import { globSync, type GlobOptions } from "tinyglobby";

export function globFilesSync(
  patterns: string | readonly string[],
  options: Omit<GlobOptions, "patterns"> = {},
): string[] {
  const files = globSync(patterns, {
    dot: false,
    expandDirectories: false,
    onlyFiles: true,
    ...options,
  });

  return [...new Set(files)].sort((left, right) => left.localeCompare(right));
}
