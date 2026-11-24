import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

// PJR-9X52: 親の検証の vitest を、変更したファイルに関係するテストだけに絞る。
// 関係はテストから相対 import を辿った依存（と、テストが子プロセスで起動するファイルのパス）で決める。
// 見逃しの危険があるため、判断できない変更と関係するテストが無い変更では全件に戻す。

export type RelatedTestKind = "unit" | "integration";

/** Which test files a related-tests validation runs, and why. */
export type RelatedTestSelection =
  | { mode: "related"; reason: string; selected: string[]; omitted: string[] }
  | { mode: "full"; reason: string };

/** Test files of one kind and the repository files each test depends on (itself included). */
export type TestDependencyGraph = {
  tests: readonly string[];
  dependencies: ReadonlyMap<string, ReadonlySet<string>>;
};

/**
 * Changes to these paths fall back to the full run: the vitest settings, the shared test
 * infrastructure, dependencies and compiler settings, and schemas or templates the tests read
 * at run time. The import graph cannot tell which tests they affect.
 */
export const RELATED_TESTS_FULL_RUN_PATHS: readonly string[] = [
  "vitest.*",
  "tests/helpers/**",
  "tests/setup/**",
  "tests/fixtures/**",
  "package.json",
  "package-lock.json",
  "**/tsconfig*.json",
  "lefthook.yml",
  ".specdojo/**",
  "docs/specdojo/**",
];

const CODE_EXTENSIONS = [".ts", ".mts", ".cts", ".js", ".mjs", ".cjs"];
const SOURCE_ROOTS = ["src/", "tests/", "tools/", "packages/", "scripts/"];

function isTestOfKind(file: string, kind: RelatedTestKind): boolean {
  if (!file.startsWith("tests/")) return false;
  if (kind === "integration") return file.endsWith(".integration.test.ts");
  return file.endsWith(".test.ts") && !file.endsWith(".integration.test.ts");
}

function isCodeFile(file: string): boolean {
  return CODE_EXTENSIONS.some((extension) => file.endsWith(extension));
}

function escapeRegExp(value: string): string {
  return value.replace(/[.+^${}()|[\]\\]/g, "\\$&");
}

function globToRegExp(pattern: string): RegExp {
  let source = "";
  for (let index = 0; index < pattern.length; index++) {
    const char = pattern[index];
    if (char === "*" && pattern[index + 1] === "*") {
      const followedBySlash = pattern[index + 2] === "/";
      source += followedBySlash ? "(?:.*/)?" : ".*";
      index += followedBySlash ? 2 : 1;
    } else if (char === "*") {
      source += "[^/]*";
    } else {
      source += escapeRegExp(char);
    }
  }
  return new RegExp(`^${source}$`);
}

const FULL_RUN_PATTERNS = RELATED_TESTS_FULL_RUN_PATHS.map(globToRegExp);

function isFullRunPath(file: string): boolean {
  return FULL_RUN_PATTERNS.some((pattern) => pattern.test(file));
}

const IMPORT_PATTERNS = [
  /\b(?:import|export)\s[^"'`;]*?\bfrom\s*["']([^"']+)["']/g,
  /\bimport\s*["']([^"']+)["']/g,
  /\bimport\(\s*["']([^"']+)["']\s*\)/g,
];
// テストが `tsx src/specdojo.ts` や `node tools/x.mjs` のように起動するファイルのパス。
const LAUNCHED_PATH_PATTERN =
  /["'`/\s]((?:src|tools|packages|scripts|dist)\/[A-Za-z0-9_./-]+\.(?:ts|mts|js|mjs|cjs))\b/g;

/** Repository-relative import specifiers of a file (relative specifiers only). */
export function relativeImportSpecifiers(text: string): string[] {
  const specifiers = new Set<string>();
  for (const pattern of IMPORT_PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      if (match[1].startsWith("./") || match[1].startsWith("../")) specifiers.add(match[1]);
    }
  }
  return [...specifiers].sort();
}

/** Repository-relative paths of files a test launches as a child process. */
export function launchedPaths(text: string): string[] {
  const paths = new Set<string>();
  for (const match of text.matchAll(LAUNCHED_PATH_PATTERN)) {
    const file = match[1];
    // ビルド済みの `dist/<name>.js` は、対応する `src/<name>.ts` を起動するものとして扱う。
    paths.add(file.startsWith("dist/") ? `src/${file.slice(5).replace(/\.js$/, ".ts")}` : file);
  }
  return [...paths].sort();
}

function toPosix(file: string): string {
  return file.split(path.sep).join("/");
}

/**
 * Repository-relative file an import resolves to. `.js` specifiers prefer the `.ts` source
 * (NodeNext). A specifier whose file is missing still resolves to its `.ts` form so a deleted
 * source file selects the tests that imported it.
 */
function resolveImport(root: string, fromFile: string, specifier: string): string | undefined {
  const joined = toPosix(
    path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), specifier)),
  );
  if (joined.startsWith("../")) return undefined;
  const candidates = joined.endsWith(".js")
    ? [`${joined.slice(0, -3)}.ts`, joined]
    : joined.endsWith(".mjs")
      ? [`${joined.slice(0, -4)}.mts`, joined]
      : isCodeFile(joined)
        ? [joined]
        : [`${joined}.ts`, `${joined}/index.ts`, joined];
  return candidates.find((candidate) => existsSync(path.join(root, candidate))) ?? candidates[0];
}

async function listFiles(root: string, directory: string): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(path.join(root, directory), { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  const files: string[] = [];
  for (const entry of entries) {
    const child = path.posix.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules") files.push(...(await listFiles(root, child)));
    } else if (entry.isFile()) {
      files.push(child);
    }
  }
  return files;
}

async function readIfExists(file: string): Promise<string | undefined> {
  try {
    return await readFile(file, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw new Error(`Failed to read ${file} for related test selection`, { cause: error });
  }
}

/** Build the dependency graph of the test files of one kind under `<root>/tests`. */
export async function buildTestDependencyGraph(
  root: string,
  kind: RelatedTestKind,
): Promise<TestDependencyGraph> {
  const tests = (await listFiles(root, "tests")).filter((file) => isTestOfKind(file, kind)).sort();
  const edges = new Map<string, string[]>();
  const edgesOf = async (file: string): Promise<string[]> => {
    const cached = edges.get(file);
    if (cached) return cached;
    const text = isCodeFile(file) ? await readIfExists(path.join(root, file)) : undefined;
    const next = text
      ? [
          ...relativeImportSpecifiers(text).flatMap((specifier) => {
            const resolved = resolveImport(root, file, specifier);
            return resolved ? [resolved] : [];
          }),
          ...(file.startsWith("tests/")
            ? launchedPaths(text).filter((launched) => existsSync(path.join(root, launched)))
            : []),
        ]
      : [];
    edges.set(file, next);
    return next;
  };
  const dependencies = new Map<string, ReadonlySet<string>>();
  for (const test of tests) {
    const seen = new Set<string>([test]);
    const queue = [test];
    while (queue.length > 0) {
      const file = queue.shift() as string;
      for (const dependency of await edgesOf(file)) {
        if (seen.has(dependency)) continue;
        seen.add(dependency);
        queue.push(dependency);
      }
    }
    dependencies.set(test, seen);
  }
  return { tests, dependencies };
}

/**
 * Select the tests related to the changed files. Falls back to the full run when the change set
 * is unknown, a change touches the test infrastructure or settings, a non-code file changed under
 * the source roots, or no related test is found.
 */
export function selectRelatedTests(
  graph: TestDependencyGraph,
  changedPaths: readonly string[] | undefined,
): RelatedTestSelection {
  if (changedPaths === undefined) {
    return { mode: "full", reason: "change set is unknown or truncated" };
  }
  const changed = [...new Set(changedPaths.flatMap((file) => file.split(" -> ")))].sort();
  const infrastructure = changed.filter(isFullRunPath);
  if (infrastructure.length > 0) {
    return {
      mode: "full",
      reason: `test infrastructure or settings changed: ${infrastructure.join(", ")}`,
    };
  }
  const untraceable = changed.filter(
    (file) => SOURCE_ROOTS.some((prefix) => file.startsWith(prefix)) && !isCodeFile(file),
  );
  if (untraceable.length > 0) {
    return {
      mode: "full",
      reason: `non-code file changed under a source root: ${untraceable.join(", ")}`,
    };
  }
  const changedSet = new Set(changed);
  const selected = graph.tests.filter((test) =>
    [...(graph.dependencies.get(test) ?? [test])].some((file) => changedSet.has(file)),
  );
  if (selected.length === 0) {
    return { mode: "full", reason: "no related test found for the changed files" };
  }
  const selectedSet = new Set(selected);
  // 別の種類のテスト（統合テストに対する単体テストなど）は、ここで流す対象ではないので挙げない。
  const unrelated = changed.filter(
    (file) =>
      isCodeFile(file) &&
      !(file.endsWith(".test.ts") && !graph.tests.includes(file)) &&
      !selected.some((test) => graph.dependencies.get(test)?.has(file) ?? test === file),
  );
  return {
    mode: "related",
    reason:
      `${selected.length} of ${graph.tests.length} test files depend on the changed files` +
      (unrelated.length > 0 ? `; no test depends on: ${unrelated.join(", ")}` : ""),
    selected,
    omitted: graph.tests.filter((test) => !selectedSet.has(test)),
  };
}
