import { globSync, statSync, type Dirent } from "node:fs";
import { relative, resolve } from "node:path";

export type GlobFilesOptions = {
  /** Directory the patterns are resolved from. Defaults to `process.cwd()`. */
  cwd?: string;
  /** Return absolute paths instead of paths relative to `cwd`. */
  absolute?: boolean;
  /** Glob patterns, relative to `cwd`, whose matches are excluded. */
  ignore?: readonly string[];
};

function isFileEntry(entry: Dirent, path: string): boolean {
  if (entry.isFile()) return true;
  // Symbolic links to files are listed, as before the move to node:fs globSync.
  return entry.isSymbolicLink() && statSync(path, { throwIfNoEntry: false })?.isFile() === true;
}

/**
 * Lists files matching the patterns with node:fs globSync. Dot entries are skipped unless a
 * pattern names them, directories are not expanded, `**` does not descend into symbolic links to
 * directories, and results use `/` and are sorted.
 */
export function globFilesSync(
  patterns: string | readonly string[],
  options: GlobFilesOptions = {},
): string[] {
  const cwd = resolve(options.cwd ?? process.cwd());
  const files = globSync(patterns, {
    cwd,
    withFileTypes: true,
    ...(options.ignore ? { exclude: options.ignore } : {}),
  }).flatMap((entry) => {
    const path = resolve(entry.parentPath, entry.name);
    if (!isFileEntry(entry, path)) return [];
    return [(options.absolute ? path : relative(cwd, path)).replaceAll("\\", "/")];
  });

  return [...new Set(files)].sort((left, right) => left.localeCompare(right));
}
