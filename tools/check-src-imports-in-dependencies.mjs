import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const MODULE_PATH = fileURLToPath(import.meta.url);
const DEFAULT_REPOSITORY_ROOT = path.resolve(path.dirname(MODULE_PATH), "..");
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".mts", ".cts"]);

function isDeclarationFile(filePath) {
  return /\.d\.(?:ts|mts|cts)$/.test(filePath);
}

function listTypeScriptFiles(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return listTypeScriptFiles(entryPath);
      if (!entry.isFile()) return [];
      if (!SOURCE_EXTENSIONS.has(path.extname(entry.name)) || isDeclarationFile(entry.name)) {
        return [];
      }
      return [entryPath];
    })
    .sort();
}

function runtimePackageName(specifier) {
  if (specifier.startsWith(".") || specifier.startsWith("/") || specifier.startsWith("node:")) {
    return undefined;
  }
  if (specifier.startsWith("@")) {
    const [scope, name] = specifier.split("/");
    return name ? `${scope}/${name}` : specifier;
  }
  return specifier.split("/")[0];
}

function importDeclarationHasRuntimeValue(node) {
  const clause = node.importClause;
  if (!clause) return true;
  if (clause.isTypeOnly) return false;
  if (clause.name) return true;
  if (!clause.namedBindings || ts.isNamespaceImport(clause.namedBindings)) return true;
  if (clause.namedBindings.elements.length === 0) return true;
  return clause.namedBindings.elements.some((element) => !element.isTypeOnly);
}

function exportDeclarationHasRuntimeValue(node) {
  if (node.isTypeOnly) return false;
  if (!node.exportClause || ts.isNamespaceExport(node.exportClause)) return true;
  if (node.exportClause.elements.length === 0) return true;
  return node.exportClause.elements.some((element) => !element.isTypeOnly);
}

function moduleSpecifierText(node) {
  return ts.isStringLiteralLike(node) ? node.text : undefined;
}

export function findRuntimeImportViolations(sourceText, filePath, allowedPackages) {
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const violations = [];

  function record(specifierNode) {
    const specifier = moduleSpecifierText(specifierNode);
    if (!specifier) return;
    const packageName = runtimePackageName(specifier);
    if (!packageName || allowedPackages.has(packageName)) return;
    const { line } = sourceFile.getLineAndCharacterOfPosition(specifierNode.getStart(sourceFile));
    violations.push({ filePath, line: line + 1, packageName, specifier });
  }

  function visit(node) {
    if (ts.isImportDeclaration(node) && importDeclarationHasRuntimeValue(node)) {
      record(node.moduleSpecifier);
    } else if (
      ts.isExportDeclaration(node) &&
      node.moduleSpecifier &&
      exportDeclarationHasRuntimeValue(node)
    ) {
      record(node.moduleSpecifier);
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length > 0
    ) {
      record(node.arguments[0]);
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return violations;
}

function dependencyNames(packageJson) {
  const dependencies =
    typeof packageJson.dependencies === "object" && packageJson.dependencies !== null
      ? Object.keys(packageJson.dependencies)
      : [];
  const peerDependencies =
    typeof packageJson.peerDependencies === "object" && packageJson.peerDependencies !== null
      ? Object.keys(packageJson.peerDependencies)
      : [];
  return new Set([...dependencies, ...peerDependencies]);
}

export function checkSrcImportsInDependencies(options = {}) {
  const repositoryRoot = path.resolve(options.repositoryRoot ?? DEFAULT_REPOSITORY_ROOT);
  const sourceRoot = path.resolve(options.sourceRoot ?? path.join(repositoryRoot, "src"));
  const packageJsonPath = path.resolve(
    options.packageJsonPath ?? path.join(repositoryRoot, "package.json"),
  );
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  const allowedPackages = dependencyNames(packageJson);

  return listTypeScriptFiles(sourceRoot).flatMap((filePath) =>
    findRuntimeImportViolations(
      readFileSync(filePath, "utf8"),
      path.relative(repositoryRoot, filePath),
      allowedPackages,
    ),
  );
}

export function formatRuntimeImportViolation(violation) {
  return `${violation.filePath}:${violation.line}: package "${violation.packageName}" is imported at runtime but is not listed in dependencies or peerDependencies (specifier: "${violation.specifier}")`;
}

function main() {
  const violations = checkSrcImportsInDependencies();
  if (violations.length === 0) {
    console.log("src runtime imports are declared in dependencies or peerDependencies");
    return;
  }
  for (const violation of violations) console.error(formatRuntimeImportViolation(violation));
  process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === MODULE_PATH) {
  try {
    main();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`check-src-imports-in-dependencies: ${message}`);
    process.exitCode = 1;
  }
}
