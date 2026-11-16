import { constants, copyFileSync, existsSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, relative, resolve } from "node:path";
import { localStateDirectory } from "../shared/local-state.js";
import { specdojoRootDir } from "../shared/specdojo-config.js";

export function routineStoragePaths(routinesPath: string, repoRoot = specdojoRootDir()) {
  const key = createHash("sha256").update(relative(repoRoot, routinesPath)).digest("hex");
  const stateDirectory = join(localStateDirectory(repoRoot), "routines", key);
  return {
    stateDirectory,
    statePath: join(stateDirectory, "routine-state.json"),
    runsPath: join(stateDirectory, "routine-runs.jsonl"),
    lockPath: join(stateDirectory, ".locks", "routine-run.lock"),
  };
}

/** Copy once, preserving the old files for rollback and never overwriting newer state. */
export function migrateRoutineStorage(routinesPath: string, repoRoot = specdojoRootDir()) {
  const paths = routineStoragePaths(routinesPath, repoRoot);
  for (const destination of [paths.statePath, paths.runsPath]) {
    const source = join(
      routinesPath,
      "generated",
      destination === paths.statePath ? "routine-state.json" : "routine-runs.jsonl",
    );
    if (!existsSync(source) || existsSync(destination)) continue;
    mkdirSync(resolve(destination, ".."), { recursive: true });
    try {
      copyFileSync(source, destination, constants.COPYFILE_EXCL);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    }
  }
  return paths;
}
