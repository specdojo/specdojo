// `specdojo init` の使う環境のパターン（PJR-7EZR）。
//
// Dev Container か手元（macOS・WSL・Linux）かと、tmux でセッションを保つかの組み合わせで、
// 作るスクリプトと最後に出す次の手順を決める。init.ts は対話と書き出しの順だけを受け持つ。

import { existsSync, readFileSync } from "node:fs";
import { chmod, mkdir, readFile, writeFile } from "node:fs/promises";
import * as path from "node:path";

export type HostOs = "macos" | "wsl" | "linux" | "windows" | "other";

export type EnvironmentPattern = {
  devcontainer: boolean;
  tmux: boolean;
};

export const LOCAL_TMUX_SCRIPT = ".specdojo/host/local-tmux.sh";
export const DEVCONTAINER_TMUX_SCRIPT = ".specdojo/host/devcontainer-tmux.sh";

/** WSL は Linux として動くため、/proc/version の "microsoft" で見分ける。 */
export function detectHostOs(
  platform: NodeJS.Platform = process.platform,
  procVersion: string | undefined = readProcVersion(),
): HostOs {
  if (platform === "darwin") return "macos";
  if (platform === "win32") return "windows";
  if (platform === "linux") return /microsoft/i.test(procVersion ?? "") ? "wsl" : "linux";
  return "other";
}

function readProcVersion(): string | undefined {
  try {
    return existsSync("/proc/version") ? readFileSync("/proc/version", "utf8") : undefined;
  } catch {
    return undefined;
  }
}

export function hostOsLabel(os: HostOs): string {
  switch (os) {
    case "macos":
      return "macOS";
    case "wsl":
      return "WSL";
    case "linux":
      return "Linux";
    case "windows":
      return "Windows";
    default:
      return "this machine";
  }
}

/** Dev Container の preset のうち、tmux を含むもの。 */
export function presetIncludesTmux(preset: string | undefined): boolean {
  return preset === "recommended" || preset === "full";
}

export async function writeLocalTmuxScript(opts: {
  packageRoot: string;
  repoRoot: string;
  dryRun?: boolean;
}): Promise<void> {
  const templatePath = path.join(opts.packageRoot, "templates", "host", "local-tmux.sh");
  if (!existsSync(templatePath)) {
    throw new Error(`Local tmux script template not found: ${templatePath}`);
  }
  if (opts.dryRun) {
    process.stdout.write(`[dry-run] would write: ${LOCAL_TMUX_SCRIPT}\n`);
    return;
  }
  const destination = path.join(opts.repoRoot, LOCAL_TMUX_SCRIPT);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, await readFile(templatePath, "utf8"), "utf8");
  await chmod(destination, 0o755);
  process.stdout.write(`Written: ${LOCAL_TMUX_SCRIPT}\n`);
}

/** 選んだ環境のパターンだけの次の手順（番号なしの行）を返す。 */
export function environmentNextSteps(pattern: EnvironmentPattern, os: HostOs): string[] {
  const steps = [`Check prerequisites: npx specdojo doctor${doctorFlags(pattern)}`];
  if (pattern.devcontainer) {
    steps.push(
      "Open the repository in the Dev Container (VS Code: Dev Containers: Reopen in Container, or devcontainer up --workspace-folder .).",
    );
    if (pattern.tmux) {
      steps.push(
        `To keep sessions on an always-on host, copy .devcontainer/remote-host/specdojo-tmux.sh.sample to ~/bin/specdojo-tmux.sh on the host; it runs ${DEVCONTAINER_TMUX_SCRIPT} (see docs/ja/specdojo/guides/remote-host-development-guide.md).`,
      );
    }
  } else {
    if (os === "wsl") {
      steps.push(
        "On WSL, keep the repository under your Linux home (not /mnt/c) for speed and file permissions.",
      );
    }
    if (pattern.tmux) {
      steps.push(
        `Start or attach the tmux session on ${hostOsLabel(os)}: bash ${LOCAL_TMUX_SCRIPT} (detach with Ctrl-b d).`,
      );
    }
  }
  return steps;
}

function doctorFlags(pattern: EnvironmentPattern): string {
  return `${pattern.devcontainer ? " --devcontainer" : ""}${pattern.tmux ? " --tmux" : ""}`;
}
