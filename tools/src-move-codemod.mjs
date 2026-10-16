#!/usr/bin/env node

/**
 * Move TypeScript source files while keeping tests and relative imports in sync.
 *
 * Usage:
 *   node tools/src-move-codemod.mjs [--dry-run] <mapping.json|mapping.tsv>
 *
 * JSON accepts either an object whose keys are old paths and values are new paths,
 * or an array of { "from": "src/old.ts", "to": "src/new/old.ts" } objects.
 * Source mappings stay under `src/`; tests whose names do not match a source can
 * be mapped explicitly within `tests/`.
 * TSV uses one `old-path<TAB>new-path` pair per line; blank lines and lines whose
 * first non-space character is `#` are ignored. Paths are repository-relative. If
 * the mapping is inside the repository, commit it first; otherwise keep it outside
 * the repository so the clean-worktree precondition remains true.
 *
 * The command refuses a dirty worktree. It uses `git mv` for each mapped source and
 * for matching `.test.ts` / `.integration.test.ts` files under `tests/src` (or the
 * legacy `tests/` root). Explicit test mappings take precedence over inferred test
 * moves. The command then rewrites relative TypeScript import/export, import(),
 * require(), and vi/jest mock specifiers in src, tests, tools, and scripts. A dry
 * run prints the same plan but makes no changes.
 *
 * `import.meta.url`, `import.meta.dirname`, `__dirname`, and literal `dist/...` or
 * `src/...ts` references are reported only. Review those findings manually. After
 * a real move, run `npm run build`; this repository's build script removes `dist`
 * before rebuilding, so obsolete compiled files cannot remain. Historical records
 * under project-register, execution, and logs are excluded from detection reports.
 */

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

const TYPESCRIPT_ROOTS = ["src/", "tests/", "tools/", "scripts/"];
const TYPESCRIPT_EXTENSIONS = [".ts", ".tsx", ".mts", ".cts"];
const CODE_EXTENSIONS = new Set([...TYPESCRIPT_EXTENSIONS, ".cjs", ".js", ".jsx", ".mjs"]);
const DETECTION_EXTENSIONS = new Set([
  ".cjs",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".mts",
  ".ts",
  ".tsx",
  ".yaml",
  ".yml",
]);
const MOCK_METHODS = new Set(["mock", "doMock", "unmock"]);
const DIST_PATH_PATTERN = /(?:^|[^A-Za-z0-9_.-])(dist\/[A-Za-z0-9_./-]+)/gu;
const SOURCE_PATH_PATTERN =
  /(?:^|[^A-Za-z0-9_.-])(src\/[A-Za-z0-9_./-]+\.tsx?)(?=$|[^A-Za-z0-9_.-])/gu;

function runGit(repoRoot, args) {
  const result = spawnSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
    env: process.env,
  });
  if (result.status !== 0) {
    const detail = result.stderr.trim() || result.stdout.trim() || `exit ${result.status}`;
    throw new Error(`git ${args.join(" ")} failed: ${detail}`);
  }
  return result.stdout;
}

function findRepoRoot(cwd) {
  return runGit(cwd, ["rev-parse", "--show-toplevel"]).trim();
}

function assertCleanWorktree(repoRoot) {
  const status = runGit(repoRoot, ["status", "--porcelain=v1", "--untracked-files=all"]);
  if (status.trim()) {
    throw new Error(
      "worktree is not clean; commit or stash all changes before running the codemod",
    );
  }
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseJsonMappings(value, mappingPath) {
  if (Array.isArray(value)) {
    return value.map((entry, index) => {
      if (!isRecord(entry) || typeof entry.from !== "string" || typeof entry.to !== "string") {
        throw new Error(`${mappingPath}: entry ${index + 1} must contain string from/to fields`);
      }
      return { from: entry.from, to: entry.to };
    });
  }
  if (!isRecord(value)) {
    throw new Error(`${mappingPath}: JSON must be an object or an array`);
  }
  return Object.entries(value).map(([from, to]) => {
    if (typeof to !== "string") {
      throw new Error(`${mappingPath}: destination for ${from} must be a string`);
    }
    return { from, to };
  });
}

function parseTsvMappings(source, mappingPath) {
  const mappings = [];
  for (const [index, line] of source.split(/\r?\n/u).entries()) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const columns = line.split("\t");
    if (columns.length !== 2 || !columns[0]?.trim() || !columns[1]?.trim()) {
      throw new Error(`${mappingPath}:${index + 1}: expected old-path<TAB>new-path`);
    }
    mappings.push({ from: columns[0].trim(), to: columns[1].trim() });
  }
  return mappings;
}

function normalizeRepoPath(value, label) {
  if (path.posix.isAbsolute(value) || value.includes("\\")) {
    throw new Error(`${label}: path must be repository-relative and use '/' separators: ${value}`);
  }
  const normalized = path.posix.normalize(value);
  if (normalized === "." || normalized === ".." || normalized.startsWith("../")) {
    throw new Error(`${label}: path escapes the repository: ${value}`);
  }
  return normalized.replace(/^\.\//u, "");
}

function loadMappings(mappingPath) {
  const source = readFileSync(mappingPath, "utf8");
  const rawMappings =
    path.extname(mappingPath).toLowerCase() === ".json"
      ? parseJsonMappings(JSON.parse(source), mappingPath)
      : parseTsvMappings(source, mappingPath);
  if (rawMappings.length === 0) throw new Error(`${mappingPath}: mapping is empty`);

  const mappings = rawMappings
    .map(({ from, to }, index) => ({
      from: normalizeRepoPath(from, `mapping ${index + 1} from`),
      to: normalizeRepoPath(to, `mapping ${index + 1} to`),
    }))
    .sort((left, right) => left.from.localeCompare(right.from));
  const sources = new Set();
  const destinations = new Set();
  for (const mapping of mappings) {
    const mappingRoot = mapping.from.startsWith("src/")
      ? "src/"
      : mapping.from.startsWith("tests/")
        ? "tests/"
        : undefined;
    if (!mappingRoot || !mapping.to.startsWith(mappingRoot)) {
      throw new Error(`mappings must stay within src/ or tests/: ${mapping.from} -> ${mapping.to}`);
    }
    if (!TYPESCRIPT_EXTENSIONS.includes(path.posix.extname(mapping.from))) {
      throw new Error(`source mapping must name a TypeScript file: ${mapping.from}`);
    }
    if (path.posix.extname(mapping.from) !== path.posix.extname(mapping.to)) {
      throw new Error(`source and destination extensions differ: ${mapping.from} -> ${mapping.to}`);
    }
    if (mapping.from === mapping.to)
      throw new Error(`source and destination are identical: ${mapping.from}`);
    if (sources.has(mapping.from)) throw new Error(`duplicate source mapping: ${mapping.from}`);
    if (destinations.has(mapping.to))
      throw new Error(`duplicate destination mapping: ${mapping.to}`);
    sources.add(mapping.from);
    destinations.add(mapping.to);
  }
  return mappings;
}

function listTrackedFiles(repoRoot) {
  return runGit(repoRoot, ["ls-files", "-z"]).split("\0").filter(Boolean).sort();
}

function testPathFor(sourcePath, suffix) {
  const extension = path.posix.extname(sourcePath);
  const stem = sourcePath.slice(0, -extension.length);
  return `tests/${stem}${suffix}`;
}

function legacyTestPathFor(sourcePath, suffix) {
  const extension = path.posix.extname(sourcePath);
  const stem = sourcePath.slice("src/".length, -extension.length);
  return `tests/${stem}${suffix}`;
}

function buildMoves(repoRoot, mappings, trackedFiles) {
  const tracked = new Set(trackedFiles);
  const explicitlyMapped = new Set(mappings.map((mapping) => mapping.from));
  const moves = [];
  for (const mapping of mappings) {
    if (!tracked.has(mapping.from))
      throw new Error(`mapped source is not tracked: ${mapping.from}`);
    moves.push(mapping);
    if (!mapping.from.startsWith("src/")) continue;
    for (const suffix of [".test.ts", ".integration.test.ts"]) {
      const candidates = [
        testPathFor(mapping.from, suffix),
        legacyTestPathFor(mapping.from, suffix),
      ].filter((candidate) => tracked.has(candidate));
      if (candidates.length > 1) {
        throw new Error(
          `multiple matching tests exist for ${mapping.from}: ${candidates.join(", ")}`,
        );
      }
      const from = candidates[0];
      if (from && !explicitlyMapped.has(from)) {
        moves.push({ from, to: testPathFor(mapping.to, suffix) });
      }
    }
  }

  const destinations = new Set();
  for (const move of moves) {
    if (destinations.has(move.to)) throw new Error(`multiple files would move to ${move.to}`);
    destinations.add(move.to);
    if (existsSync(path.join(repoRoot, move.to))) {
      throw new Error(`move destination already exists: ${move.to}`);
    }
  }
  return moves;
}

function isTypeScriptPath(filePath) {
  return (
    TYPESCRIPT_ROOTS.some((root) => filePath.startsWith(root)) &&
    TYPESCRIPT_EXTENSIONS.includes(path.posix.extname(filePath))
  );
}

function scriptKind(filePath) {
  if (filePath.endsWith(".tsx")) return ts.ScriptKind.TSX;
  if (filePath.endsWith(".jsx")) return ts.ScriptKind.JSX;
  if ([".cjs", ".js", ".mjs"].includes(path.posix.extname(filePath))) return ts.ScriptKind.JS;
  return ts.ScriptKind.TS;
}

function moduleSpecifierNodes(sourceFile) {
  const nodes = [];
  function visit(node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteralLike(node.moduleSpecifier)
    ) {
      nodes.push(node.moduleSpecifier);
    } else if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference) &&
      node.moduleReference.expression &&
      ts.isStringLiteralLike(node.moduleReference.expression)
    ) {
      nodes.push(node.moduleReference.expression);
    } else if (
      ts.isImportTypeNode(node) &&
      ts.isLiteralTypeNode(node.argument) &&
      ts.isStringLiteralLike(node.argument.literal)
    ) {
      nodes.push(node.argument.literal);
    } else if (ts.isCallExpression(node) && node.arguments.length > 0) {
      const first = node.arguments[0];
      if (first && ts.isStringLiteralLike(first)) {
        if (node.expression.kind === ts.SyntaxKind.ImportKeyword) {
          nodes.push(first);
        } else if (ts.isIdentifier(node.expression) && node.expression.text === "require") {
          nodes.push(first);
        } else if (ts.isPropertyAccessExpression(node.expression)) {
          const owner = node.expression.expression;
          const method = node.expression.name.text;
          if (
            (ts.isIdentifier(owner) &&
              ["vi", "jest"].includes(owner.text) &&
              MOCK_METHODS.has(method)) ||
            (ts.isIdentifier(owner) && owner.text === "require" && method === "resolve")
          ) {
            nodes.push(first);
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return nodes;
}

function splitSpecifierSuffix(specifier) {
  const suffixIndex = specifier.search(/[?#]/u);
  return suffixIndex < 0
    ? { pathPart: specifier, suffix: "" }
    : { pathPart: specifier.slice(0, suffixIndex), suffix: specifier.slice(suffixIndex) };
}

function resolveImportTarget(importerPath, specifier, trackedFiles) {
  const { pathPart } = splitSpecifierSuffix(specifier);
  if (!pathPart.startsWith("./") && !pathPart.startsWith("../")) return undefined;
  const resolved = path.posix.normalize(
    path.posix.join(path.posix.dirname(importerPath), pathPart),
  );
  const extension = path.posix.extname(resolved);
  const candidates = [];
  if (extension === ".js")
    candidates.push(`${resolved.slice(0, -3)}.ts`, `${resolved.slice(0, -3)}.tsx`, resolved);
  else if (extension === ".mjs") candidates.push(`${resolved.slice(0, -4)}.mts`, resolved);
  else if (extension === ".cjs") candidates.push(`${resolved.slice(0, -4)}.cts`, resolved);
  else if (extension) candidates.push(resolved);
  else
    candidates.push(
      resolved,
      ...TYPESCRIPT_EXTENSIONS.map((candidateExtension) => `${resolved}${candidateExtension}`),
      ...TYPESCRIPT_EXTENSIONS.map(
        (candidateExtension) => `${resolved}/index${candidateExtension}`,
      ),
    );
  return candidates.find((candidate) => trackedFiles.has(candidate));
}

function formatRewrittenSpecifier(original, newImporterPath, newTargetPath) {
  const { pathPart, suffix } = splitSpecifierSuffix(original);
  const originalExtension = path.posix.extname(pathPart);
  let targetForSpecifier = newTargetPath;
  if (originalExtension === ".js" || originalExtension === ".mjs" || originalExtension === ".cjs") {
    targetForSpecifier =
      newTargetPath.slice(0, -path.posix.extname(newTargetPath).length) + originalExtension;
  } else if (!originalExtension) {
    const targetExtension = path.posix.extname(newTargetPath);
    targetForSpecifier = newTargetPath.slice(0, -targetExtension.length);
    if (
      path.posix.basename(targetForSpecifier) === "index" &&
      path.posix.basename(pathPart) !== "index"
    ) {
      targetForSpecifier = path.posix.dirname(targetForSpecifier);
    }
  }
  let relative = path.posix.relative(path.posix.dirname(newImporterPath), targetForSpecifier);
  if (!relative.startsWith(".")) relative = `./${relative}`;
  return `${relative}${suffix}`;
}

function planRewrites(repoRoot, trackedFiles, moves) {
  const moveMap = new Map(moves.map((move) => [move.from, move.to]));
  const trackedFileSet = new Set(trackedFiles);
  const trackedTypeScriptFiles = new Set(trackedFiles.filter(isTypeScriptPath));
  const rewrites = [];
  for (const originalPath of [...trackedTypeScriptFiles].sort()) {
    const absolutePath = path.join(repoRoot, originalPath);
    const source = readFileSync(absolutePath, "utf8");
    const sourceFile = ts.createSourceFile(
      originalPath,
      source,
      ts.ScriptTarget.Latest,
      true,
      scriptKind(originalPath),
    );
    const replacements = [];
    for (const node of moduleSpecifierNodes(sourceFile)) {
      const oldSpecifier = node.text;
      const oldTarget = resolveImportTarget(originalPath, oldSpecifier, trackedFileSet);
      if (!oldTarget) continue;
      const finalImporter = moveMap.get(originalPath) ?? originalPath;
      const finalTarget = moveMap.get(oldTarget) ?? oldTarget;
      const newSpecifier = formatRewrittenSpecifier(oldSpecifier, finalImporter, finalTarget);
      if (newSpecifier === oldSpecifier) continue;
      replacements.push({
        start: node.getStart(sourceFile) + 1,
        end: node.getEnd() - 1,
        oldSpecifier,
        newSpecifier,
      });
    }
    if (replacements.length === 0) continue;
    let updated = source;
    for (const replacement of [...replacements].sort((left, right) => right.start - left.start)) {
      updated =
        updated.slice(0, replacement.start) +
        replacement.newSpecifier +
        updated.slice(replacement.end);
    }
    rewrites.push({
      originalPath,
      finalPath: moveMap.get(originalPath) ?? originalPath,
      updated,
      replacements,
    });
  }
  return rewrites;
}

function isSensitivePath(filePath) {
  return (
    filePath === ".env" ||
    filePath.startsWith(".env.") ||
    filePath.startsWith("secrets/") ||
    filePath.includes("/secrets/")
  );
}

function isDetectionHistoryPath(filePath) {
  return (
    filePath.startsWith("logs/") ||
    /^docs\/ja\/projects\/[^/]+\/controls\/project-register\//u.test(filePath) ||
    /^docs\/ja\/projects\/[^/]+\/execution\//u.test(filePath)
  );
}

function pathConstructionLines(source, filePath) {
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    scriptKind(filePath),
  );
  const lines = new Set();
  function visit(node) {
    const isImportMetaPath =
      ts.isPropertyAccessExpression(node) &&
      (node.name.text === "url" || node.name.text === "dirname") &&
      ts.isMetaProperty(node.expression) &&
      node.expression.keywordToken === ts.SyntaxKind.ImportKeyword;
    const isDirectoryName = ts.isIdentifier(node) && node.text === "__dirname";
    if (isImportMetaPath || isDirectoryName) {
      lines.add(sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1);
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return lines;
}

function collectDetections(repoRoot, trackedFiles, moves) {
  const moveMap = new Map(moves.map((move) => [move.from, move.to]));
  const mappedSources = new Set(
    moves.filter((move) => move.from.startsWith("src/")).map((move) => move.from),
  );
  const findings = [];
  for (const filePath of trackedFiles) {
    if (
      isSensitivePath(filePath) ||
      isDetectionHistoryPath(filePath) ||
      !DETECTION_EXTENSIONS.has(path.posix.extname(filePath))
    )
      continue;
    const absolutePath = path.join(repoRoot, filePath);
    if (!existsSync(absolutePath) || !statSync(absolutePath).isFile()) continue;
    const source = readFileSync(absolutePath, "utf8");
    const lines = source.split(/\r?\n/u);
    const constructionLines = CODE_EXTENSIONS.has(path.posix.extname(filePath))
      ? pathConstructionLines(source, filePath)
      : new Set();
    for (const [index, line] of lines.entries()) {
      const kinds = [];
      if (constructionLines.has(index + 1)) kinds.push("path-construction");
      DIST_PATH_PATTERN.lastIndex = 0;
      SOURCE_PATH_PATTERN.lastIndex = 0;
      const hasDistPath = DIST_PATH_PATTERN.test(line);
      SOURCE_PATH_PATTERN.lastIndex = 0;
      const hasMappedSourcePath = [...line.matchAll(SOURCE_PATH_PATTERN)].some((match) =>
        mappedSources.has(match[1]),
      );
      if (hasDistPath || hasMappedSourcePath) kinds.push("literal-path");
      for (const kind of kinds) {
        findings.push({
          kind,
          filePath: moveMap.get(filePath) ?? filePath,
          line: index + 1,
          excerpt: line.trim().slice(0, 180),
        });
      }
    }
  }
  return findings;
}

function printPlan(moves, rewrites, detections, dryRun) {
  console.log(dryRun ? "DRY RUN: no files will be changed" : "Applying src move codemod");
  for (const move of moves) console.log(`MOVE ${move.from} -> ${move.to}`);
  for (const rewrite of rewrites) {
    for (const replacement of rewrite.replacements) {
      console.log(
        `REWRITE ${rewrite.finalPath}: ${replacement.oldSpecifier} -> ${replacement.newSpecifier}`,
      );
    }
  }
  if (detections.length === 0) console.log("DETECT none");
  for (const finding of detections) {
    console.log(`DETECT ${finding.kind} ${finding.filePath}:${finding.line} ${finding.excerpt}`);
  }
}

function applyPlan(repoRoot, moves, rewrites) {
  for (const move of moves) {
    mkdirSync(path.dirname(path.join(repoRoot, move.to)), { recursive: true });
    runGit(repoRoot, ["mv", "--", move.from, move.to]);
  }
  for (const rewrite of rewrites) {
    writeFileSync(path.join(repoRoot, rewrite.finalPath), rewrite.updated, "utf8");
  }
}

function runSrcMoveCodemod({ cwd, mappingPath, dryRun = false }) {
  const absoluteMappingPath = path.resolve(cwd, mappingPath);
  const repoRoot = findRepoRoot(cwd);
  assertCleanWorktree(repoRoot);
  const mappings = loadMappings(absoluteMappingPath);
  const trackedFiles = listTrackedFiles(repoRoot);
  const moves = buildMoves(repoRoot, mappings, trackedFiles);
  const rewrites = planRewrites(repoRoot, trackedFiles, moves);
  const detections = collectDetections(repoRoot, trackedFiles, moves);
  printPlan(moves, rewrites, detections, dryRun);
  if (!dryRun) {
    applyPlan(repoRoot, moves, rewrites);
    console.log("NEXT run npm run build to recreate dist without obsolete outputs");
  }
  return { moves, rewrites, detections };
}

function printUsage() {
  console.log("Usage: node tools/src-move-codemod.mjs [--dry-run] <mapping.json|mapping.tsv>");
}

function main(argv) {
  if (argv.includes("--help") || argv.includes("-h")) {
    printUsage();
    return 0;
  }
  const dryRun = argv.includes("--dry-run");
  const positional = argv.filter((argument) => argument !== "--dry-run");
  if (positional.length !== 1) {
    printUsage();
    return 1;
  }
  try {
    runSrcMoveCodemod({ cwd: process.cwd(), mappingPath: positional[0], dryRun });
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`src-move-codemod: ${message}`);
    return 1;
  }
}

process.exitCode = main(process.argv.slice(2));
