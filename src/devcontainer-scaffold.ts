import { existsSync } from "node:fs";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import * as path from "node:path";

export interface RunDevcontainerScaffoldOptions {
  packageRoot: string;
  repoRoot: string;
  providers: string[];
  ollama: boolean;
  cron: boolean;
  tmux: boolean;
  force: boolean;
  dryRun: boolean;
}

export async function runDevcontainerScaffold(opts: RunDevcontainerScaffoldOptions): Promise<void> {
  const { packageRoot, repoRoot, providers, ollama, cron, tmux, force, dryRun } = opts;
  const devcontainerDir = path.join(repoRoot, ".devcontainer");

  if (existsSync(devcontainerDir) && !force) {
    if (dryRun) {
      process.stdout.write(`[dry-run] skipped: .devcontainer/ already exists\n`);
    } else {
      process.stdout.write(`Skipped (already exists): .devcontainer/\n`);
    }
    return;
  }

  const templateDir = path.join(packageRoot, "templates", "devcontainer");
  if (!existsSync(templateDir)) {
    throw new Error(`Template directory not found: ${templateDir}`);
  }

  // devcontainer.json をパースして改変する
  const devcontainerJsonPath = path.join(templateDir, "devcontainer.json");
  const baseJsonStr = await readFile(devcontainerJsonPath, "utf8");
  const devcontainer = JSON.parse(baseJsonStr);

  const postCreateScriptPath = path.join(templateDir, "post-create.sh");
  let postCreateScript = await readFile(postCreateScriptPath, "utf8");

  // options に応じて json と script を改変
  const aptPackages: string[] = [];

  if (tmux) {
    aptPackages.push("tmux");
  }
  if (cron) {
    aptPackages.push("cron");
    devcontainer.postAttachCommand = "sudo service cron start";
  }

  if (aptPackages.length > 0) {
    devcontainer.features["ghcr.io/rocker-org/devcontainer-features/apt-packages:1"] = {
      packages: aptPackages.join(","),
      upgradePackages: false,
    };
  }

  if (ollama) {
    devcontainer.containerEnv["OLLAMA_BASE_URL"] = "http://host.docker.internal:11434";
    devcontainer.containerEnv["LOCAL_OPENAI_BASE_URL"] = "http://host.docker.internal:11434/v1";
  }

  // providers の処理
  const extraScripts: string[] = [];
  const knownProviders = new Set(["claude", "codex", "opencode", "antigravity"]);
  for (const provider of providers) {
    if (!knownProviders.has(provider)) {
      process.stdout.write(`Warning: unknown provider "${provider}"\n`);
    }

    if (provider === "claude") {
      devcontainer.mounts.push("source=specdojo-claude,target=/home/node/.claude,type=volume");
      devcontainer.containerEnv["CLAUDE_CONFIG_DIR"] = "/home/node/.claude";
      extraScripts.push(
        'if ! curl -fsSL https://claude.ai/install.sh | bash; then\n  echo "Warning: Claude Code installer failed."\nfi',
      );
    } else if (provider === "codex") {
      devcontainer.mounts.push("source=specdojo-codex,target=/home/node/.codex,type=volume");
      // Codex は curl -fsSL https://chatgpt.com/codex/install.sh | CODEX_NON_INTERACTIVE=1 sh
      extraScripts.push(
        'if ! curl -fsSL https://chatgpt.com/codex/install.sh | CODEX_NON_INTERACTIVE=1 sh; then\n  echo "Warning: Codex installer failed."\nfi',
      );
    } else if (provider === "opencode") {
      devcontainer.mounts.push(
        "source=specdojo-opencode,target=/home/node/.config/opencode,type=volume",
      );
      devcontainer.containerEnv["OPENCODE_DISABLE_AUTO_UPDATE"] = "1";
      extraScripts.push("sudo npm install -g opencode-ai@latest");
    } else if (provider === "antigravity") {
      devcontainer.mounts.push(
        "source=specdojo-antigravity,target=/home/node/.config/antigravity,type=volume",
      );
      extraScripts.push(
        'if ! curl -fsSL https://antigravity.google/cli/install.sh | bash; then\n  echo "Warning: Antigravity CLI installer failed."\nfi',
      );
    }
  }

  if (extraScripts.length > 0) {
    postCreateScript = postCreateScript.replace(
      "npm install",
      extraScripts.join("\n\n") + "\n\nnpm install",
    );
  }

  if (dryRun) {
    process.stdout.write(`[dry-run] would write: .devcontainer/devcontainer.json\n`);
    process.stdout.write(`[dry-run] would write: .devcontainer/post-create.sh\n`);
    return;
  }

  await mkdir(devcontainerDir, { recursive: true });
  await writeFile(
    path.join(devcontainerDir, "devcontainer.json"),
    JSON.stringify(devcontainer, null, 2) + "\n",
    "utf8",
  );
  await writeFile(path.join(devcontainerDir, "post-create.sh"), postCreateScript, "utf8");

  process.stdout.write(`Written: .devcontainer/devcontainer.json\n`);
  process.stdout.write(`Written: .devcontainer/post-create.sh\n`);

  process.stdout.write(
    "Next steps:\n" +
      "  1. Commit the scaffolded files.\n" +
      "  2. Open this directory in a Dev Container (VS Code or compatible editor).\n",
  );
}
