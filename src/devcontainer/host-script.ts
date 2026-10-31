import { existsSync } from "node:fs";
import { chmod, mkdir, readFile, writeFile } from "node:fs/promises";
import * as path from "node:path";

export interface RunDevcontainerHostScriptOptions {
  packageRoot: string;
  repoRoot: string;
  dryRun?: boolean;
}

export async function runDevcontainerHostScript(
  opts: RunDevcontainerHostScriptOptions,
): Promise<void> {
  const { packageRoot, repoRoot, dryRun } = opts;
  const templatePath = path.join(
    packageRoot,
    "templates",
    "devcontainer",
    "remote-host",
    "devcontainer-tmux.sh",
  );

  if (!existsSync(templatePath)) {
    throw new Error(`Host script template not found: ${templatePath}`);
  }

  const hostScriptContent = await readFile(templatePath, "utf8");
  const hostDir = path.join(repoRoot, ".specdojo", "host");
  const destPath = path.join(hostDir, "devcontainer-tmux.sh");

  if (dryRun) {
    process.stdout.write(`[dry-run] would write: .specdojo/host/devcontainer-tmux.sh\n`);
    return;
  }

  await mkdir(hostDir, { recursive: true });
  await writeFile(destPath, hostScriptContent, "utf8");
  await chmod(destPath, 0o755);

  process.stdout.write(`Written: .specdojo/host/devcontainer-tmux.sh\n`);
}
