import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Worker } from "node:worker_threads";
import { globSync } from "tinyglobby";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";

const markdownParser = unified().use(remarkParse).use(remarkFrontmatter);

function diagramType(code) {
  // For display only. Mermaid itself detects the grammar and validates the full source.
  return (
    code
      .replace(/^\s*---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u, "")
      .replace(/%%\{[\s\S]*?\}%%/gu, "")
      .split(/\r?\n/u)
      .find((line) => line.trim() && !line.trimStart().startsWith("%%"))
      ?.trim()
      .split(/[\s;]/u)[0] || "(empty)"
  );
}

export function extractMermaidBlocks(markdown, file) {
  const blocks = [];
  function visit(node) {
    if (node.type === "code" && node.lang === "mermaid") {
      // Report the original Markdown fence line. Parser-local lines may have had
      // frontmatter/directives/comments removed; never present those as source lines.
      blocks.push({
        file,
        line: node.position.start.line,
        type: diagramType(node.value),
        code: node.value,
      });
    }
    for (const child of node.children ?? []) visit(child);
  }
  visit(markdownParser.parse(markdown));
  return blocks;
}

export function resolveMermaid() {
  const siteRequire = createRequire(new URL("../packages/docs-site/package.json", import.meta.url));
  // Resolve from mermaid-cli, exactly as the renderer does (also handles nested installs).
  const cliRequire = createRequire(siteRequire.resolve("@mermaid-js/mermaid-cli"));
  const entry = cliRequire.resolve("mermaid");
  const mermaidRequire = createRequire(entry);
  const { version } = JSON.parse(
    readFileSync(mermaidRequire.resolve("mermaid/package.json"), "utf8"),
  );
  const config = JSON.parse(
    readFileSync(new URL("../packages/docs-site/mermaid-config.json", import.meta.url), "utf8"),
  );
  return { entry: pathToFileURL(entry).href, version, config };
}

export async function checkMermaidBlocks(blocks, { entry, config }) {
  if (blocks.length === 0) return [];
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./mermaid-parse-worker.mjs", import.meta.url), {
      workerData: { blocks, entry, config },
      // The worker runs plain JS and must not inherit a test runner/agent's loaders.
      execArgv: [],
    });
    let received = false;
    worker.once("message", (results) => {
      received = true;
      resolve(results);
    });
    worker.once("error", reject);
    worker.once("exit", (code) => {
      if (!received)
        reject(new Error(`Mermaid parser worker exited without results (exit ${code})`));
    });
  });
}

export async function lintMermaid(
  patterns,
  {
    cwd = process.cwd(),
    stdout = (message) => process.stdout.write(message),
    stderr = (message) => process.stderr.write(message),
    resolveParser = resolveMermaid,
    checkBlocks = checkMermaidBlocks,
  } = {},
) {
  const blocks = [];
  let files;
  try {
    const matches = patterns.map((pattern) => {
      const found = globSync(pattern, {
        cwd,
        onlyFiles: true,
        expandDirectories: false,
        ignore: ["**/node_modules/**", "**/.git/**", "**/secrets/**"],
      }).filter((file) => /\.mdx?$/u.test(file));
      if (found.length === 0) throw new Error(`No Markdown files matched: ${pattern}`);
      return found;
    });
    files = [...new Set(matches.flat())].sort();
    for (const file of files) {
      blocks.push(...extractMermaidBlocks(readFileSync(path.resolve(cwd, file), "utf8"), file));
    }
  } catch (error) {
    stderr(`[mermaid] ${error.message}\n`);
    return 1;
  }

  let results = [];
  let version = "not loaded (no diagrams)";
  if (blocks.length > 0) {
    try {
      const parser = resolveParser();
      version = parser.version;
      results = await checkBlocks(blocks, parser);
    } catch (error) {
      // A missing docs-site install, broken loader, etc. leaves every diagram unchecked.
      results = blocks.map((block) => ({ ...block, status: "unchecked", message: error.message }));
    }
  }

  const counts = new Map();
  for (const result of results) {
    const countsForType = counts.get(result.type) ?? { passed: 0, error: 0, unchecked: 0 };
    countsForType[result.status] += 1;
    counts.set(result.type, countsForType);
    if (result.status !== "passed") {
      const label = result.status === "unchecked" ? "未検査" : "構文エラー";
      stderr(
        `${result.file}:${result.line} [${result.type}] ${label} (fence line): ${result.message}\n`,
      );
    }
  }
  stdout(`[mermaid ${version}] ${files.length} file(s), ${blocks.length} diagram(s)\n`);
  for (const [type, count] of [...counts].sort(([left], [right]) => left.localeCompare(right))) {
    stdout(`  ${type}: ${count.passed} passed, ${count.error} error, ${count.unchecked} 未検査\n`);
  }
  return results.some((result) => result.status !== "passed") ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const patterns = process.argv.slice(2);
  if (patterns.includes("--help")) {
    console.log(
      "Usage: node tools/lint-mermaid.mjs [<Markdown path or glob> ...]\nDefault: 'docs/**/*.md'",
    );
  } else {
    process.exitCode = await lintMermaid(patterns.length > 0 ? patterns : ["docs/**/*.md"]);
  }
}
