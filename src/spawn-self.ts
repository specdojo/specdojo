import { existsSync } from "node:fs";
import { join } from "node:path";
import { specdojoRootDir } from "./specdojo-config.js";

/**
 * Returns [executablePath, fullArgs] to re-invoke the current entry script
 * with the given sub-command args.
 *
 * When the entry script is a .ts file (running via tsx), finds the local tsx
 * binary so that child processes can also handle TypeScript imports.
 * Falls back to node when the script is already compiled .js.
 */
export function selfRunArgs(subArgs: string[]): [string, string[]] {
  const script = process.argv[1];
  if (!script.endsWith(".ts")) {
    return [process.execPath, [script, ...subArgs]];
  }
  const localTsx = join(specdojoRootDir(), "node_modules", ".bin", "tsx");
  if (existsSync(localTsx)) {
    return [process.execPath, [localTsx, script, ...subArgs]];
  }
  // npx tsx as last resort (slower first-run)
  return ["npx", ["tsx", script, ...subArgs]];
}
