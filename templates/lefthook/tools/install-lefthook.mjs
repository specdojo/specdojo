import { spawnSync } from "node:child_process";
import { existsSync, lstatSync } from "node:fs";
import { join } from "node:path";

const repoRoot = process.cwd();
const gitEntry = join(repoRoot, ".git");
const lefthookCli = join(repoRoot, "node_modules", "lefthook", "bin", "index.js");

if (!existsSync(gitEntry) || !lstatSync(gitEntry).isDirectory()) {
  process.stdout.write("Skipping lefthook install outside the primary Git worktree.\n");
  process.exit(0);
}
if (!existsSync(lefthookCli)) {
  process.stdout.write(
    "Skipping lefthook install because node_modules/lefthook is unavailable. Run npm install first.\n",
  );
  process.exit(0);
}

const env = { ...process.env };
for (const name of [
  "GIT_ALTERNATE_OBJECT_DIRECTORIES",
  "GIT_COMMON_DIR",
  "GIT_DIR",
  "GIT_GRAFT_FILE",
  "GIT_IMPLICIT_WORK_TREE",
  "GIT_INDEX_FILE",
  "GIT_NAMESPACE",
  "GIT_NO_REPLACE_OBJECTS",
  "GIT_OBJECT_DIRECTORY",
  "GIT_PREFIX",
  "GIT_QUARANTINE_PATH",
  "GIT_REPLACE_REF_BASE",
  "GIT_SHALLOW_FILE",
  "GIT_WORK_TREE",
]) {
  delete env[name];
}

const result = spawnSync(process.execPath, [lefthookCli, "install"], {
  cwd: repoRoot,
  env,
  stdio: "inherit",
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
