// 変えた Markdown だけに lint を流す（PJR-50RQ）。範囲は統合の commit の hook（staged の *.md）と同じ
// 考え方で、作業ツリーの HEAD からの追加・変更・名前の変更と、未追跡の *.md を対象にする。
// 入口は Node 標準だけで動かし、`md` は markdownlint、`fm` は frontmatter の検査を流す。
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const LINT_BIN = "packages/docs-lint/bin/specdojo-docs-lint.js";
const COMMANDS = {
  md: (files) => [LINT_BIN, "markdownlint", ...files],
  fm: (files) => [LINT_BIN, "remark", ...files, "--quiet", "--frail"],
};

function gitLines(args) {
  const result = spawnSync("git", args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed: ${result.stderr.trim()}`);
  }
  return result.stdout.split("\n").filter((line) => line.length > 0);
}

export function selectFiles(kind, files) {
  const unique = [...new Set(files)].sort();
  if (kind === "fm") return unique.filter((file) => /^docs\/.*\.(md|mdx)$/.test(file));
  return unique.filter((file) => file.endsWith(".md"));
}

function main(kind) {
  if (!Object.hasOwn(COMMANDS, kind ?? "")) {
    process.stderr.write("usage: node tools/lint-changed.mjs <md|fm>\n");
    return 2;
  }
  const files = selectFiles(kind, [
    ...gitLines(["diff", "--name-only", "--diff-filter=ACMR", "HEAD"]),
    ...gitLines(["ls-files", "--others", "--exclude-standard"]),
  ]);
  if (files.length === 0) {
    process.stdout.write(`lint:${kind}:changed: no changed files\n`);
    return 0;
  }
  return spawnSync("node", COMMANDS[kind](files), { stdio: "inherit" }).status ?? 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main(process.argv[2]));
}
