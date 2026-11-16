import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { realpathSync } from "node:fs";
import { homedir } from "node:os";
import { isAbsolute, join, resolve } from "node:path";
import { gitEnvironment } from "./git-environment.js";

/** Machine-local state, shared by linked worktrees, never part of the repository tree. */
export function localStateDirectory(repoRoot: string): string {
  const common = spawnSync("git", ["rev-parse", "--git-common-dir"], {
    cwd: repoRoot,
    encoding: "utf8",
    env: gitEnvironment(),
  });
  const identity =
    common.status === 0 ? resolve(repoRoot, common.stdout.trim()) : resolve(repoRoot);
  const canonical = realpathSync(identity);
  const key = createHash("sha256").update(canonical).digest("hex");
  const configured = process.env.XDG_STATE_HOME;
  const base =
    configured && isAbsolute(configured) ? configured : join(homedir(), ".local", "state");
  return join(base, "specdojo", key);
}
