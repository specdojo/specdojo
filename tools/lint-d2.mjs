import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { globSync } from "tinyglobby";
import {
  assertD2Version,
  D2_VERSION,
  extractD2Blocks,
  validateD2,
} from "../packages/docs-site/src/d2.mjs";

export function lintD2(
  patterns,
  {
    cwd = process.cwd(),
    stdout = (text) => process.stdout.write(text),
    stderr = (text) => process.stderr.write(text),
  } = {},
) {
  try {
    const files = [
      ...new Set(
        patterns.flatMap((pattern) => {
          const matches = globSync(pattern, {
            cwd,
            onlyFiles: true,
            expandDirectories: false,
            ignore: ["**/node_modules/**", "**/.git/**", "**/secrets/**"],
          }).filter((file) => /\.mdx?$/u.test(file));
          if (matches.length === 0) throw new Error(`No Markdown files matched: ${pattern}`);
          return matches;
        }),
      ),
    ].sort();
    const blocks = files.flatMap((file) =>
      extractD2Blocks(readFileSync(path.resolve(cwd, file), "utf8"), file),
    );
    if (blocks.length > 0) assertD2Version();
    const version = blocks.length > 0 ? D2_VERSION : "not loaded (no diagrams)";
    let failed = 0;
    for (const block of blocks) {
      try {
        validateD2(block.code);
      } catch (error) {
        failed++;
        stderr(`${block.file}:${block.line} [d2] 構文エラー (fence line): ${error.message}\n`);
      }
    }
    stdout(
      `[d2 ${version}] ${files.length} file(s), ${blocks.length} diagram(s), ${blocks.length - failed} passed, ${failed} error\n`,
    );
    return failed > 0 ? 1 : 0;
  } catch (error) {
    stderr(`[d2] 未検査: ${error.message}\n`);
    return 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const patterns = process.argv.slice(2);
  if (patterns.includes("--help"))
    console.log(
      "Usage: node tools/lint-d2.mjs [<Markdown path or glob> ...]\nDefault: 'docs/**/*.md'",
    );
  else process.exitCode = lintD2(patterns.length > 0 ? patterns : ["docs/**/*.md"]);
}
