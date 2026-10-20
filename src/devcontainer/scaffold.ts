import { existsSync } from "node:fs";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import * as path from "node:path";

export interface RunDevcontainerScaffoldOptions {
  packageRoot: string;
  repoRoot: string;
  workspaceName?: string;
  preset?: string;
  providers: string[];
  editors: string[];
  ollama: boolean;
  cron: boolean;
  tmux: boolean;
  force: boolean;
  dryRun: boolean;
}

const RECOMMENDED_VSCODE_EXTENSIONS = [
  "mhutchie.git-graph",
  "davidanson.vscode-markdownlint",
  "redhat.vscode-yaml",
  "esbenp.prettier-vscode",
  "unifiedjs.vscode-remark",
  "yzhang.markdown-all-in-one",
  "streetsidesoftware.code-spell-checker",
  "editorconfig.editorconfig",
  "usernamehw.errorlens",
  "tamasfe.even-better-toml",
] as const;

const PROVIDER_VSCODE_EXTENSIONS: Readonly<Record<string, readonly string[]>> = {
  claude: ["anthropic.claude-code"],
  codex: ["openai.chatgpt"],
  copilot: ["github.copilot", "github.copilot-chat"],
};

const RECOMMENDED_VSCODE_SETTINGS = {
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
  },
  "[yaml]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
  },
  "yaml.schemas": {
    "./docs/specdojo/schemas/v1/agent-members.schema.yaml": ".specdojo/agent-members.yaml",
    "./docs/specdojo/schemas/v1/exec-defaults.schema.yaml": ".specdojo/exec-defaults.yaml",
    "./docs/specdojo/schemas/v1/job.schema.yaml": "docs/**/jobs/*.yaml",
    "./docs/specdojo/schemas/v1/pm-members.schema.yaml": "docs/**/pm-members.yaml",
    "./docs/specdojo/schemas/v1/pm-review-viewpoints.schema.yaml":
      "docs/**/pm-review-viewpoints.yaml",
    "./docs/specdojo/schemas/v1/pm-roles.schema.yaml": "docs/**/pm-roles.yaml",
    "./docs/specdojo/schemas/v1/routine.schema.yaml": "docs/**/routines/*.yaml",
    "./docs/specdojo/schemas/v1/sch-defaults.schema.yaml": "docs/**/sch-defaults.yaml",
    "./docs/specdojo/schemas/v1/sch-milestones.schema.yaml": "docs/**/sch-milestones.yaml",
    "./docs/specdojo/schemas/v1/sch-strategy.schema.yaml": "docs/**/sch-strategy-*.yaml",
    "./docs/specdojo/schemas/v1/sch-track.schema.yaml": "docs/**/sch-track-*.yaml",
  },
} as const;

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function providerExtensions(providers: readonly string[]): string[] {
  return unique(providers.flatMap((provider) => PROVIDER_VSCODE_EXTENSIONS[provider] ?? []));
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

async function readExtensionsRecommendations(pathname: string): Promise<Record<string, unknown>> {
  if (!existsSync(pathname)) return { recommendations: [] };
  const parsed: unknown = JSON.parse(await readFile(pathname, "utf8"));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`Invalid VS Code extensions file: ${pathname}`);
  }
  const result = parsed as Record<string, unknown>;
  if (result.recommendations !== undefined && !Array.isArray(result.recommendations)) {
    throw new Error(`Invalid recommendations in VS Code extensions file: ${pathname}`);
  }
  return result;
}

function resolveWorkspaceName(repoRoot: string, override: string | undefined): string {
  const workspaceName = override ?? path.basename(path.dirname(path.resolve(repoRoot)));
  if (workspaceName === "." || workspaceName === ".." || !/^[A-Za-z0-9._-]+$/.test(workspaceName)) {
    throw new Error(
      `Invalid workspace name: ${JSON.stringify(workspaceName)}. Use only ASCII letters, numbers, dot, underscore, and hyphen.`,
    );
  }
  return workspaceName;
}

function repositoryVolumePrefix(repoRoot: string): string {
  const repositoryName = path.basename(path.resolve(repoRoot)).toLowerCase();
  const safeName = repositoryName.replace(/[^a-z0-9_.-]+/g, "-").replace(/^[._-]+|[._-]+$/g, "");
  return safeName || "project";
}

function extractPortNumber(value: unknown): number | undefined {
  if (typeof value === "number") {
    return Number.isInteger(value) && value > 0 && value <= 65535 ? value : undefined;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    const withoutProto = trimmed.replace(/\/(tcp|udp)$/, "");
    const parts = withoutProto.split(":");
    const portStr = parts.length === 3 ? parts[1] : parts[0];
    const parsed = parseInt(portStr, 10);
    return !isNaN(parsed) && parsed > 0 && parsed <= 65535 ? parsed : undefined;
  }
  return undefined;
}

export function extractPublishedPorts(devcontainer: Record<string, unknown>): number[] {
  const ports: number[] = [];

  const addPort = (val: unknown) => {
    const port = extractPortNumber(val);
    if (port !== undefined && !ports.includes(port)) {
      ports.push(port);
    }
  };

  const appPort = devcontainer.appPort;
  if (Array.isArray(appPort)) {
    for (const p of appPort) addPort(p);
  } else if (appPort !== undefined) {
    addPort(appPort);
  }

  const forwardPorts = devcontainer.forwardPorts;
  if (Array.isArray(forwardPorts)) {
    for (const p of forwardPorts) addPort(p);
  } else if (forwardPorts !== undefined) {
    addPort(forwardPorts);
  }

  return ports;
}

export function generateSshConfigSample(ports: number[]): string {
  const lines: string[] = [
    "# 接続元端末の ~/.ssh/config 用設定サンプル",
    "# <host> や <user> などのプレースホルダーは実際の接続先環境に合わせて変更してください。",
    "",
    "# 常時稼働ホストへの通常接続用",
    "Host <host>",
    "  HostName <host>",
    "  User <user>",
    "",
    "# devcontainer 内の tmux セッションへ直接入る接続用",
    "# RemoteCommand は非対話シェルで動くため、接続先端末の ~/.zshrc などの PATH 設定は読み込まれません。",
    "# 接続元から「ssh <host> 'command -v devcontainer'」を実行して Dev Container CLI が見つかるか確認できます。",
    "# 見つからない場合は、ホスト側の ~/bin/specdojo-tmux.sh の node_bin_dir を設定してください。",
    "Host <host>-tmux",
    "  HostName <host>",
    "  User <user>",
    "  RequestTTY force",
    "  RemoteCommand ~/bin/specdojo-tmux.sh",
  ];

  if (ports.length > 0) {
    for (const port of ports) {
      lines.push(`  LocalForward ${port} 127.0.0.1:${port}`);
    }
  } else {
    lines.push(
      "  # devcontainer.json の公開ポート（appPort / forwardPorts）に合わせて LocalForward を追加してください。",
      "  # 例: LocalForward 5173 127.0.0.1:5173",
    );
  }

  lines.push("");
  return lines.join("\n");
}

export async function runDevcontainerScaffold(opts: RunDevcontainerScaffoldOptions): Promise<void> {
  const {
    packageRoot,
    repoRoot,
    workspaceName: workspaceNameOverride,
    preset,
    providers,
    editors,
    ollama,
    cron,
    tmux,
    force,
    dryRun,
  } = opts;
  if (preset !== undefined && preset !== "recommended") {
    throw new Error(`Unknown Dev Container preset: ${preset}. Available: recommended`);
  }
  const recommended = preset === "recommended";
  const effectiveEditors = unique([...editors, ...(recommended ? ["emacs", "vim"] : [])]);
  const effectiveTmux = tmux || recommended;
  const devcontainerDir = path.join(repoRoot, ".devcontainer");
  const workspaceName = resolveWorkspaceName(repoRoot, workspaceNameOverride);

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
  const workspaceRoot = `/workspaces/${workspaceName}`;
  devcontainer.workspaceMount = `source=\${localWorkspaceFolder}/..,target=${workspaceRoot},type=bind,consistency=cached`;
  devcontainer.workspaceFolder = `${workspaceRoot}/\${localWorkspaceFolderBasename}`;
  const volumePrefix = repositoryVolumePrefix(repoRoot);
  const volumeName = (name: string) => `${volumePrefix}-specdojo-${name}`;
  devcontainer.mounts = devcontainer.mounts.map((mount: string) =>
    mount.replace(/^source=specdojo-/, `source=${volumePrefix}-specdojo-`),
  );

  const postCreateScriptPath = path.join(templateDir, "post-create.sh");
  let postCreateScript = await readFile(postCreateScriptPath, "utf8");

  // options に応じて json と script を改変
  const aptPackages: string[] = [];
  const extraScripts: string[] = [];
  let emacsInitTemplate: string | undefined;
  let vimrcTemplate: string | undefined;

  if (effectiveTmux) {
    aptPackages.push("tmux");
  }
  if (cron) {
    aptPackages.push("cron");
    devcontainer.postAttachCommand = "sudo service cron start";
  }

  const knownEditors = new Set(["emacs", "vim"]);
  for (const editor of effectiveEditors) {
    if (!knownEditors.has(editor)) {
      process.stdout.write(`Warning: unknown editor "${editor}"\n`);
    }

    if (editor === "emacs") {
      aptPackages.push("emacs-nox", "ripgrep");
      emacsInitTemplate = await readFile(path.join(templateDir, "emacs", "init.el"), "utf8");
      extraScripts.push(`sudo npm install --global \\
  typescript@6.0.3 \\
  typescript-language-server@6.0.1 \\
  yaml-language-server@1.24.0 \\
  bash-language-server@5.8.1

MARKSMAN_VERSION="2026-02-08"
case "$(dpkg --print-architecture)" in
  amd64)
    MARKSMAN_ARCH="x64"
    MARKSMAN_SHA256="be5098e8213219269c47fc0d916a66fa31ce0602ec967475c722260aabf26087"
    ;;
  arm64)
    MARKSMAN_ARCH="arm64"
    MARKSMAN_SHA256="db8e124527f7f8048e3e6c91821b9c52ef173d92c01e47d221bf1337afd962fb"
    ;;
  *)
    echo "Unsupported architecture for Marksman: $(dpkg --print-architecture)" >&2
    exit 1
    ;;
esac
curl -fsSL --retry 3 \\
  "https://github.com/artempyanykh/marksman/releases/download/$MARKSMAN_VERSION/marksman-linux-$MARKSMAN_ARCH" \\
  -o /tmp/marksman
echo "$MARKSMAN_SHA256  /tmp/marksman" | sha256sum -c -
sudo install -m 0755 /tmp/marksman /usr/local/bin/marksman
rm -f /tmp/marksman

# Keep dotfiles authoritative: install the bundled defaults only when no supported init file exists.
if [ ! -f "$HOME/.emacs" ] && \\
   [ ! -f "$HOME/.emacs.el" ] && \\
   [ ! -f "$HOME/.emacs.d/init.el" ] && \\
   [ ! -f "$HOME/.config/emacs/init.el" ]; then
  if [ -d "$HOME/.emacs.d" ]; then
    EMACS_INIT="$HOME/.emacs.d/init.el"
  else
    EMACS_INIT="$HOME/.config/emacs/init.el"
  fi
  mkdir -p "$(dirname "$EMACS_INIT")"
  cp .devcontainer/emacs/init.el "$EMACS_INIT"
  echo "Installed Emacs init: $EMACS_INIT"
fi`);
    } else if (editor === "vim") {
      aptPackages.push("vim-nox");
      vimrcTemplate = await readFile(path.join(templateDir, "vim", "vimrc"), "utf8");
      extraScripts.push(`# Keep dotfiles authoritative: install the bundled defaults only when Vim has no user config.
if [ ! -f "$HOME/.vimrc" ] && [ ! -f "$HOME/.vim/vimrc" ]; then
  cp .devcontainer/vim/vimrc "$HOME/.vimrc"
  echo "Installed Vim config: $HOME/.vimrc"
fi`);
    }
  }

  let vscodeExtensions: string[] = [];
  let extensionsFile: Record<string, unknown> | undefined;
  if (recommended) {
    vscodeExtensions = unique([...RECOMMENDED_VSCODE_EXTENSIONS, ...providerExtensions(providers)]);
    const customizations = (devcontainer.customizations ??= {});
    const vscode = (customizations.vscode ??= {});
    const existingExtensions = Array.isArray(vscode.extensions)
      ? vscode.extensions.filter((value: unknown): value is string => typeof value === "string")
      : [];
    vscode.extensions = unique([...existingExtensions, ...vscodeExtensions]);
    const existingSettings = objectValue(vscode.settings);
    vscode.settings = {
      ...existingSettings,
      "[markdown]": {
        ...objectValue(existingSettings["[markdown]"]),
        ...RECOMMENDED_VSCODE_SETTINGS["[markdown]"],
      },
      "[yaml]": {
        ...objectValue(existingSettings["[yaml]"]),
        ...RECOMMENDED_VSCODE_SETTINGS["[yaml]"],
      },
      "yaml.schemas": {
        ...objectValue(existingSettings["yaml.schemas"]),
        ...RECOMMENDED_VSCODE_SETTINGS["yaml.schemas"],
      },
    };

    const extensionsPath = path.join(repoRoot, ".vscode", "extensions.json");
    extensionsFile = await readExtensionsRecommendations(extensionsPath);
    const existingRecommendations = (extensionsFile.recommendations ?? []) as unknown[];
    extensionsFile.recommendations = unique([
      ...existingRecommendations.filter((value): value is string => typeof value === "string"),
      ...vscodeExtensions,
    ]);
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
  const knownProviders = new Set(["claude", "codex", "opencode", "antigravity"]);
  for (const provider of providers) {
    if (!knownProviders.has(provider)) {
      process.stdout.write(`Warning: unknown provider "${provider}"\n`);
    }

    if (provider === "claude") {
      devcontainer.mounts.push(
        `source=${volumeName("claude")},target=/home/node/.claude,type=volume`,
      );
      devcontainer.containerEnv["CLAUDE_CONFIG_DIR"] = "/home/node/.claude";
      extraScripts.push(
        'if ! curl -fsSL https://claude.ai/install.sh | bash; then\n  echo "Warning: Claude Code installer failed."\nfi',
      );
    } else if (provider === "codex") {
      devcontainer.runArgs = devcontainer.runArgs ?? [];
      if (!devcontainer.runArgs.includes("--security-opt=seccomp=unconfined")) {
        devcontainer.runArgs.push("--security-opt=seccomp=unconfined");
      }
      devcontainer.mounts.push(
        `source=${volumeName("codex")},target=/home/node/.codex,type=volume`,
      );
      extraScripts.push(
        "if dpkg-query -W -f='${Status}' bubblewrap 2>/dev/null | grep -qx 'install ok installed'; then\n  if ! sudo apt-get remove -y bubblewrap; then\n    echo \"Warning: Failed to remove system bubblewrap; Codex sandbox may not start.\" >&2\n  fi\nfi",
      );
      // 本リポジトリの devcontainer と同じく公式の install.sh を使い、失敗したら npm で入れる。
      extraScripts.push(
        'if ! curl -fsSL https://chatgpt.com/codex/install.sh | CODEX_NON_INTERACTIVE=1 sh; then\n  echo "Warning: Codex installer failed; falling back to npm."\n  sudo npm install -g @openai/codex@latest\nfi',
      );
    } else if (provider === "opencode") {
      devcontainer.mounts.push(
        `source=${volumeName("opencode")},target=/home/node/.config/opencode,type=volume`,
        `source=${volumeName("opencode-data")},target=/home/node/.local/share/opencode,type=volume`,
      );
      devcontainer.containerEnv["OPENCODE_DISABLE_AUTO_UPDATE"] = "1";
      // 本リポジトリで設定を確かめている opencode の npm パッケージ（opencode-ai）を使う。
      extraScripts.push("sudo npm install -g opencode-ai@latest");
    } else if (provider === "antigravity") {
      devcontainer.mounts.push(
        `source=${volumeName("antigravity")},target=/home/node/.config/antigravity,type=volume`,
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

  const specdojoTmuxTemplatePath = path.join(templateDir, "remote-host", "specdojo-tmux.sh.sample");
  let specdojoTmuxScript = await readFile(specdojoTmuxTemplatePath, "utf8");
  const remoteUser =
    typeof devcontainer.remoteUser === "string" && devcontainer.remoteUser.trim()
      ? devcontainer.remoteUser.trim()
      : "node";
  specdojoTmuxScript = specdojoTmuxScript.replace(
    'container_user="node"',
    `container_user="${remoteUser}"`,
  );
  const publishedPorts = extractPublishedPorts(devcontainer);
  const sshConfigScript = generateSshConfigSample(publishedPorts);

  if (dryRun) {
    process.stdout.write(`[dry-run] would write: .devcontainer/devcontainer.json\n`);
    process.stdout.write(`[dry-run] would write: .devcontainer/post-create.sh\n`);
    if (emacsInitTemplate !== undefined) {
      process.stdout.write(`[dry-run] would write: .devcontainer/emacs/init.el\n`);
    }
    if (vimrcTemplate !== undefined) {
      process.stdout.write(`[dry-run] would write: .devcontainer/vim/vimrc\n`);
    }
    if (extensionsFile !== undefined) {
      process.stdout.write(`[dry-run] would write: .vscode/extensions.json\n`);
    }
    process.stdout.write(
      `[dry-run] would write: .devcontainer/remote-host/specdojo-tmux.sh.sample\n`,
    );
    process.stdout.write(`[dry-run] would write: .devcontainer/remote-host/ssh-config.sample\n`);
    return;
  }

  await mkdir(devcontainerDir, { recursive: true });
  await writeFile(
    path.join(devcontainerDir, "devcontainer.json"),
    JSON.stringify(devcontainer, null, 2) + "\n",
    "utf8",
  );
  await writeFile(path.join(devcontainerDir, "post-create.sh"), postCreateScript, "utf8");
  if (emacsInitTemplate !== undefined) {
    await mkdir(path.join(devcontainerDir, "emacs"), { recursive: true });
    await writeFile(path.join(devcontainerDir, "emacs", "init.el"), emacsInitTemplate, "utf8");
  }
  if (vimrcTemplate !== undefined) {
    await mkdir(path.join(devcontainerDir, "vim"), { recursive: true });
    await writeFile(path.join(devcontainerDir, "vim", "vimrc"), vimrcTemplate, "utf8");
  }
  if (extensionsFile !== undefined) {
    await mkdir(path.join(repoRoot, ".vscode"), { recursive: true });
    await writeFile(
      path.join(repoRoot, ".vscode", "extensions.json"),
      `${JSON.stringify(extensionsFile, null, 2)}\n`,
      "utf8",
    );
  }
  const remoteHostDir = path.join(devcontainerDir, "remote-host");
  await mkdir(remoteHostDir, { recursive: true });
  await writeFile(path.join(remoteHostDir, "specdojo-tmux.sh.sample"), specdojoTmuxScript, "utf8");
  await writeFile(path.join(remoteHostDir, "ssh-config.sample"), sshConfigScript, "utf8");

  process.stdout.write(`Written: .devcontainer/devcontainer.json\n`);
  process.stdout.write(`Written: .devcontainer/post-create.sh\n`);
  if (emacsInitTemplate !== undefined) {
    process.stdout.write(`Written: .devcontainer/emacs/init.el\n`);
  }
  if (vimrcTemplate !== undefined) {
    process.stdout.write(`Written: .devcontainer/vim/vimrc\n`);
  }
  if (extensionsFile !== undefined) {
    process.stdout.write(`Written: .vscode/extensions.json\n`);
  }
  process.stdout.write(`Written: .devcontainer/remote-host/specdojo-tmux.sh.sample\n`);
  process.stdout.write(`Written: .devcontainer/remote-host/ssh-config.sample\n`);

  process.stdout.write(
    "Next steps:\n" +
      "  1. Commit the scaffolded files.\n" +
      "  2. Open this directory in a Dev Container (VS Code or compatible editor).\n" +
      "  3. Remote host: copy .devcontainer/remote-host/specdojo-tmux.sh.sample to the host (e.g. ~/bin/) and merge ssh-config.sample into ~/.ssh/config on your client.\n",
  );
}
