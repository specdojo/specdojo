import { globSync, statSync } from "node:fs";
import path from "node:path";

// Excluding the directories themselves keeps globSync from walking into them.
const EXCLUDED = ["node_modules", ".git", "secrets"].flatMap((name) => [
  `**/${name}`,
  `**/${name}/**`,
]);

/**
 * Lists Markdown files (`.md` / `.mdx`) matching the pattern as `/`-separated paths relative to
 * `cwd`. node:fs globSync skips dot entries unless the pattern names them and does not expand
 * directories; symbolic links to files are kept.
 */
export function globMarkdownFiles(pattern, cwd) {
  const root = path.resolve(cwd);
  return globSync(pattern, { cwd: root, withFileTypes: true, exclude: EXCLUDED })
    .map((entry) => path.resolve(entry.parentPath, entry.name))
    .filter((file) => /\.mdx?$/u.test(file))
    .filter((file) => statSync(file, { throwIfNoEntry: false })?.isFile() === true)
    .map((file) => path.relative(root, file).replaceAll("\\", "/"));
}
