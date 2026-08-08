import { existsSync, lstatSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = process.cwd();
const gitEntry = join(repoRoot, ".git");

if (!existsSync(gitEntry) || !lstatSync(gitEntry).isDirectory()) {
  process.stdout.write("Skipping lefthook install outside the primary Git worktree.\n");
  process.exit(0);
}

const lefthookCli = join(repoRoot, "node_modules", "lefthook", "bin", "index.js");
const result = spawnSync(process.execPath, [lefthookCli, "install"], { stdio: "inherit" });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
