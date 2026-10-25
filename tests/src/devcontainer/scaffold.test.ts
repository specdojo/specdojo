import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  extractPublishedPorts,
  generateSshConfigSample,
  runDevcontainerScaffold,
} from "../../../src/devcontainer/scaffold.js";
import * as fs from "node:fs";
import * as fsPromises from "node:fs/promises";
import { spawnSync } from "node:child_process";
import * as os from "node:os";
import * as path from "node:path";

vi.mock("node:fs");
vi.mock("node:fs/promises");

describe("runDevcontainerScaffold", () => {
  const packageRoot = "/pkg";
  const repoRoot = "/workspaces/app1-workspace/repo";
  const stdoutWrite = vi.spyOn(process.stdout, "write");
  const existsSyncMock = vi.mocked(fs.existsSync);
  const readFileMock = vi.mocked(fsPromises.readFile);
  const writeFileMock = vi.mocked(fsPromises.writeFile);

  function findWriteCall(fileName: string) {
    const call = writeFileMock.mock.calls.find(([file]) => String(file).endsWith(fileName));
    expect(call).toBeDefined();
    if (!call) throw new Error(`writeFile call not found: ${fileName}`);
    return call;
  }

  beforeEach(() => {
    vi.resetAllMocks();
    stdoutWrite.mockImplementation(() => true);
    existsSyncMock.mockImplementation((p) => {
      const file = String(p);
      if (file.includes(".devcontainer")) return false; // not exists in repo
      if (file.includes("templates")) return true; // template exists
      return false;
    });

    readFileMock.mockImplementation(async (p) => {
      const file = String(p);
      if (file.endsWith("devcontainer.json")) {
        return Promise.resolve(
          JSON.stringify({
            workspaceMount:
              "source=${localWorkspaceFolder}/..,target=/workspaces/__SPECDOJO_WORKSPACE_NAME__,type=bind,consistency=cached",
            workspaceFolder:
              "/workspaces/__SPECDOJO_WORKSPACE_NAME__/${localWorkspaceFolderBasename}",
            features: {},
            mounts: ["source=specdojo-git,target=/home/node/.config/git,type=volume"],
            containerEnv: {},
            postCreateCommand: "bash .devcontainer/post-create.sh",
          }),
        );
      }
      if (file.endsWith("post-create.sh")) {
        return Promise.resolve("npm install");
      }
      if (file.endsWith("init.el")) {
        return Promise.resolve(";;; bundled Emacs defaults");
      }
      if (file.endsWith("vimrc")) {
        return Promise.resolve("set number\n");
      }
      if (file.endsWith("specdojo-tmux.sh.sample")) {
        return Promise.resolve("#!/usr/bin/env bash\necho sample");
      }
      return Promise.resolve("");
    });
  });

  it("should not overwrite existing .devcontainer by default", async () => {
    existsSyncMock.mockReturnValue(true); // .devcontainer exists

    await runDevcontainerScaffold({
      packageRoot,
      repoRoot,
      providers: [],
      editors: [],
      ollama: false,
      cron: false,
      tmux: false,
      force: false,
      dryRun: false,
    });

    expect(stdoutWrite).toHaveBeenCalledWith(expect.stringContaining("Skipped (already exists)"));
    expect(writeFileMock).not.toHaveBeenCalled();
  });

  it("should overwrite existing .devcontainer if force is true", async () => {
    existsSyncMock.mockReturnValue(true); // .devcontainer exists

    await runDevcontainerScaffold({
      packageRoot,
      repoRoot,
      providers: [],
      editors: [],
      ollama: false,
      cron: false,
      tmux: false,
      force: true,
      dryRun: false,
    });

    expect(writeFileMock).toHaveBeenCalledTimes(4);
  });

  it("should only report planned files in dry-run mode", async () => {
    await runDevcontainerScaffold({
      packageRoot,
      repoRoot,
      providers: [],
      editors: [],
      ollama: false,
      cron: false,
      tmux: false,
      force: false,
      dryRun: true,
    });

    expect(stdoutWrite).toHaveBeenCalledWith(
      expect.stringContaining("[dry-run] would write: .devcontainer/devcontainer.json"),
    );
    expect(stdoutWrite).toHaveBeenCalledWith(
      expect.stringContaining("[dry-run] would write: .devcontainer/post-create.sh"),
    );
    expect(stdoutWrite).toHaveBeenCalledWith(
      expect.stringContaining(
        "[dry-run] would write: .devcontainer/remote-host/specdojo-tmux.sh.sample",
      ),
    );
    expect(stdoutWrite).toHaveBeenCalledWith(
      expect.stringContaining("[dry-run] would write: .devcontainer/remote-host/ssh-config.sample"),
    );
    expect(writeFileMock).not.toHaveBeenCalled();
  });

  it("should generate json and sh for basic setup", async () => {
    await runDevcontainerScaffold({
      packageRoot,
      repoRoot,
      providers: [],
      editors: [],
      ollama: false,
      cron: false,
      tmux: false,
      force: false,
      dryRun: false,
    });

    expect(writeFileMock).toHaveBeenCalledTimes(4);
    const jsonCall = findWriteCall("devcontainer.json");
    const json = JSON.parse(String(jsonCall[1]));
    expect(json.workspaceMount).toBe(
      "source=${localWorkspaceFolder}/..,target=/workspaces/app1-workspace,type=bind,consistency=cached",
    );
    expect(json.workspaceFolder).toBe("/workspaces/app1-workspace/${localWorkspaceFolderBasename}");
    expect(json.features).not.toHaveProperty(
      "ghcr.io/rocker-org/devcontainer-features/apt-packages:1",
    );
    expect(json.mounts).toContain(
      "source=repo-specdojo-git,target=/home/node/.config/git,type=volume",
    );
    expect(json.mounts).not.toContain(
      "source=repo-specdojo-gh,target=/home/node/.config/gh,type=volume",
    );
    expect(json.remoteEnv).toEqual({
      PATH: "/home/node/.local/bin:${containerEnv:PATH}",
    });
  });

  it.each([
    {
      name: "no preset",
      preset: undefined,
      aptPackages: [],
      recommended: false,
      ollama: false,
      cron: false,
    },
    {
      name: "minimal",
      preset: "minimal",
      aptPackages: [],
      recommended: false,
      ollama: false,
      cron: false,
    },
    {
      name: "recommended",
      preset: "recommended",
      aptPackages: ["gh", "tmux", "emacs-nox", "ripgrep", "vim-nox"],
      recommended: true,
      ollama: false,
      cron: false,
    },
    {
      name: "full",
      preset: "full",
      aptPackages: [
        "gh",
        "ripgrep",
        "fd-find",
        "fzf",
        "yq",
        "shellcheck",
        "shfmt",
        "tmux",
        "cron",
        "emacs-nox",
        "vim-nox",
      ],
      recommended: true,
      ollama: true,
      cron: true,
    },
  ] as const)(
    "should apply the $name preset feature set",
    async ({ preset, aptPackages, recommended, ollama, cron }) => {
      await runDevcontainerScaffold({
        packageRoot,
        repoRoot,
        preset,
        providers: ["codex"],
        editors: [],
        ollama: false,
        cron: false,
        tmux: false,
        force: false,
        dryRun: false,
      });

      const json = JSON.parse(String(findWriteCall("devcontainer.json")[1]));
      const aptFeature = json.features["ghcr.io/rocker-org/devcontainer-features/apt-packages:1"];
      expect(aptFeature?.packages?.split(",") ?? []).toEqual(aptPackages);
      expect(json.customizations?.vscode?.extensions?.length > 0).toBe(recommended);
      expect(json.customizations?.vscode?.extensions?.includes("antfu.slidev") ?? false).toBe(
        preset === "full",
      );
      expect(json.containerEnv.OLLAMA_BASE_URL !== undefined).toBe(ollama);
      expect(json.containerEnv.LOCAL_OPENAI_BASE_URL !== undefined).toBe(ollama);
      expect(json.postAttachCommand === "sudo service cron start").toBe(cron);
      expect(
        json.mounts.includes("source=repo-specdojo-gh,target=/home/node/.config/gh,type=volume"),
      ).toBe(recommended);

      if (recommended) {
        const extensions = JSON.parse(String(findWriteCall("extensions.json")[1]));
        expect(extensions.recommendations.includes("antfu.slidev")).toBe(preset === "full");
      }
      expect(
        writeFileMock.mock.calls.some(([file]) => String(file).endsWith("extensions.json")),
      ).toBe(recommended);

      const script = String(findWriteCall("post-create.sh")[1]);
      expect(script.includes("/usr/local/bin/fd")).toBe(preset === "full");
    },
  );

  it("should mount the workspace parent and trust its repositories and worktrees", async () => {
    const actualFs = await vi.importActual<typeof fs>("node:fs");
    const devcontainerTemplate = actualFs.readFileSync(
      path.join(process.cwd(), "templates/devcontainer/devcontainer.json"),
      "utf8",
    );
    const postCreateTemplate = actualFs.readFileSync(
      path.join(process.cwd(), "templates/devcontainer/post-create.sh"),
      "utf8",
    );
    expect(devcontainerTemplate).toContain("/workspaces/__SPECDOJO_WORKSPACE_NAME__");
    readFileMock.mockImplementation(async (p) => {
      const file = String(p);
      if (file.endsWith("devcontainer.json")) {
        return Promise.resolve(devcontainerTemplate);
      }
      if (file.endsWith("post-create.sh")) return Promise.resolve(postCreateTemplate);
      if (file.endsWith("specdojo-tmux.sh.sample")) {
        return Promise.resolve("#!/usr/bin/env bash\necho sample");
      }
      return Promise.resolve("");
    });

    await runDevcontainerScaffold({
      packageRoot,
      repoRoot,
      providers: [],
      editors: [],
      ollama: false,
      cron: false,
      tmux: false,
      force: false,
      dryRun: false,
    });

    const json = JSON.parse(String(findWriteCall("devcontainer.json")[1]));
    expect(json.workspaceMount).toBe(
      "source=${localWorkspaceFolder}/..,target=/workspaces/app1-workspace,type=bind,consistency=cached",
    );
    expect(json.workspaceFolder).toBe("/workspaces/app1-workspace/${localWorkspaceFolderBasename}");
    const script = String(findWriteCall("post-create.sh")[1]);
    expect(script).toContain('WORKSPACE_PARENT="$(dirname "$WORKSPACE_DIR")"');
    expect(script).toContain('SAFE_DIRECTORY_SCOPE="${WORKSPACE_PARENT}/*"');
    expect(script).toContain('"$WORKSPACE_DIR" "$SAFE_DIRECTORY_SCOPE"');
    expect(script).toContain('git config --global --add safe.directory "$SAFE_DIRECTORY_SCOPE"');
    expect(script).toContain('"${HOME}/.local"');
    expect(script).toContain('"${HOME}/.local/share"');
    expect(script).toContain('"${HOME}/.config"');
    expect(script).toContain('sudo chown "$(id -u):$(id -g)" "$parent"');
    expect(script).toContain('sudo chown -R "$(id -u):$(id -g)" "$dir"');
    expect(script).toContain('mkdir -p "${HOME}/.local/bin"');
    expect(script).toContain('export PATH="${HOME}/.local/bin:${PATH}"');
  });

  it("restores mount parent ownership non-recursively and creates ~/.local/bin before installers", async () => {
    const actualFs = await vi.importActual<typeof fs>("node:fs");
    const postCreateTemplate = actualFs.readFileSync(
      path.join(process.cwd(), "templates/devcontainer/post-create.sh"),
      "utf8",
    );
    readFileMock.mockImplementation(async (p) => {
      const file = String(p);
      if (file.endsWith("devcontainer.json")) {
        return Promise.resolve(
          JSON.stringify({
            workspaceMount:
              "source=${localWorkspaceFolder}/..,target=/workspaces/__SPECDOJO_WORKSPACE_NAME__,type=bind,consistency=cached",
            workspaceFolder:
              "/workspaces/__SPECDOJO_WORKSPACE_NAME__/${localWorkspaceFolderBasename}",
            features: {},
            mounts: [],
            containerEnv: {},
            postCreateCommand: "bash .devcontainer/post-create.sh",
          }),
        );
      }
      if (file.endsWith("post-create.sh")) return Promise.resolve(postCreateTemplate);
      if (file.endsWith("specdojo-tmux.sh.sample")) {
        return Promise.resolve("#!/usr/bin/env bash\necho sample");
      }
      return Promise.resolve("");
    });

    await runDevcontainerScaffold({
      packageRoot,
      repoRoot,
      providers: ["claude"],
      editors: [],
      ollama: false,
      cron: false,
      tmux: false,
      force: false,
      dryRun: false,
    });

    const script = String(findWriteCall("post-create.sh")[1]);
    expect(script).toMatch(
      /for parent in \\\s+"[^"]*\.local" \\\s+"[^"]*\.local\/share" \\\s+"[^"]*\.config"; do\s+if \[ -d "\$parent" \]; then\s+sudo chown "\$\(id -u\):\$\(id -g\)" "\$parent"/,
    );
    expect(script).toMatch(
      /for dir in \\\s+"[^"]*\.config\/git"[\s\S]*sudo chown -R "\$\(id -u\):\$\(id -g\)" "\$dir"/,
    );
    expect(script).toContain('mkdir -p "${HOME}/.local/bin"');
    expect(script).toContain('export PATH="${HOME}/.local/bin:${PATH}"');

    const mkdirIndex = script.indexOf('mkdir -p "${HOME}/.local/bin"');
    const installerIndex = script.indexOf("https://claude.ai/install.sh");
    expect(mkdirIndex).toBeGreaterThan(-1);
    expect(installerIndex).toBeGreaterThan(mkdirIndex);
  });

  it("should add tmux and cron features", async () => {
    await runDevcontainerScaffold({
      packageRoot,
      repoRoot,
      providers: [],
      editors: [],
      ollama: false,
      cron: true,
      tmux: true,
      force: false,
      dryRun: false,
    });

    const jsonCall = findWriteCall("devcontainer.json");
    const json = JSON.parse(String(jsonCall[1]));
    expect(
      json.features["ghcr.io/rocker-org/devcontainer-features/apt-packages:1"].packages,
    ).toContain("tmux");
    expect(
      json.features["ghcr.io/rocker-org/devcontainer-features/apt-packages:1"].packages,
    ).toContain("cron");
    expect(json.postAttachCommand).toBe("sudo service cron start");
  });

  it("should add ollama env", async () => {
    await runDevcontainerScaffold({
      packageRoot,
      repoRoot,
      providers: [],
      editors: [],
      ollama: true,
      cron: false,
      tmux: false,
      force: false,
      dryRun: false,
    });

    const jsonCall = findWriteCall("devcontainer.json");
    const json = JSON.parse(String(jsonCall[1]));
    expect(json.containerEnv["OLLAMA_BASE_URL"]).toBe("http://host.docker.internal:11434");
  });

  it("should add provider specific setups", async () => {
    await runDevcontainerScaffold({
      packageRoot,
      repoRoot,
      providers: ["claude", "codex", "opencode", "antigravity"],
      editors: [],
      ollama: false,
      cron: false,
      tmux: false,
      force: false,
      dryRun: false,
    });

    const jsonCall = findWriteCall("devcontainer.json");
    const json = JSON.parse(String(jsonCall[1]));
    expect(json.mounts).toContain(
      "source=repo-specdojo-claude,target=/home/node/.claude,type=volume",
    );
    expect(json.mounts).toContain(
      "source=repo-specdojo-codex,target=/home/node/.codex,type=volume",
    );
    expect(json.mounts).toContain(
      "source=repo-specdojo-opencode,target=/home/node/.config/opencode,type=volume",
    );
    expect(json.mounts).toContain(
      "source=repo-specdojo-opencode-data,target=/home/node/.local/share/opencode,type=volume",
    );
    expect(json.mounts).toContain(
      "source=repo-specdojo-antigravity,target=/home/node/.config/antigravity,type=volume",
    );
    expect(json.runArgs).toEqual(["--security-opt=seccomp=unconfined"]);

    const shCall = findWriteCall("post-create.sh");
    expect(shCall[1]).toContain("curl -fsSL https://claude.ai/install.sh");
    expect(shCall[1]).toContain(
      "dpkg-query -W -f='${Status}' bubblewrap 2>/dev/null | grep -qx 'install ok installed'",
    );
    expect(shCall[1]).toContain("if ! sudo apt-get remove -y bubblewrap; then");
    expect(shCall[1]).toContain(
      "Warning: Failed to remove system bubblewrap; Codex sandbox may not start.",
    );
    expect(shCall[1]).toContain("curl -fsSL https://chatgpt.com/codex/install.sh");
    expect(shCall[1]).toContain("sudo npm install -g @openai/codex@latest");
    expect(shCall[1]).toContain("sudo npm install -g opencode-ai@latest");
    expect(shCall[1]).toContain("curl -fsSL https://antigravity.google/cli/install.sh");
  });

  it("should add Emacs tools, setup, and init template only when requested", async () => {
    await runDevcontainerScaffold({
      packageRoot,
      repoRoot,
      providers: [],
      editors: ["emacs"],
      ollama: false,
      cron: false,
      tmux: false,
      force: false,
      dryRun: false,
    });

    expect(writeFileMock).toHaveBeenCalledTimes(5);
    const jsonCall = findWriteCall("devcontainer.json");
    const json = JSON.parse(String(jsonCall[1]));
    const aptPackages =
      json.features["ghcr.io/rocker-org/devcontainer-features/apt-packages:1"].packages;
    expect(aptPackages).toContain("emacs-nox");
    expect(aptPackages).toContain("ripgrep");

    const shCall = findWriteCall("post-create.sh");
    expect(shCall[1]).toContain("typescript-language-server@6.0.1");
    expect(shCall[1]).toContain("yaml-language-server@1.24.0");
    expect(shCall[1]).toContain("bash-language-server@5.8.1");
    expect(shCall[1]).toContain('MARKSMAN_VERSION="2026-02-08"');
    expect(shCall[1]).toContain('[ ! -f "$HOME/.emacs" ]');
    expect(shCall[1]).toContain('[ ! -f "$HOME/.emacs.el" ]');
    expect(shCall[1]).toContain('[ ! -f "$HOME/.emacs.d/init.el" ]');
    expect(shCall[1]).toContain('[ ! -f "$HOME/.config/emacs/init.el" ]');

    const initCall = findWriteCall("init.el");
    expect(initCall[1]).toBe(";;; bundled Emacs defaults");
  });

  it("should combine the recommended preset with explicit options", async () => {
    await runDevcontainerScaffold({
      packageRoot,
      repoRoot,
      preset: "recommended",
      providers: ["codex"],
      editors: ["emacs"],
      ollama: false,
      cron: true,
      tmux: false,
      force: false,
      dryRun: false,
    });

    const json = JSON.parse(String(findWriteCall("devcontainer.json")[1]));
    const aptPackages =
      json.features["ghcr.io/rocker-org/devcontainer-features/apt-packages:1"].packages;
    expect(aptPackages.split(",").filter((item: string) => item === "emacs-nox")).toHaveLength(1);
    expect(aptPackages).toContain("vim-nox");
    expect(aptPackages).toContain("tmux");
    expect(aptPackages).toContain("cron");
    expect(aptPackages).toContain("gh");
    expect(json.mounts).toContain(
      "source=repo-specdojo-gh,target=/home/node/.config/gh,type=volume",
    );
    expect(json.customizations.vscode.extensions).toEqual(
      expect.arrayContaining([
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
        "openai.chatgpt",
      ]),
    );
    expect(json.customizations.vscode.extensions).not.toContain("anthropic.claude-code");
    expect(json.customizations.vscode.settings["[markdown]"]).toMatchObject({
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true,
    });
    expect(json.customizations.vscode.settings["[yaml]"]).toMatchObject({
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true,
    });
    expect(json.customizations.vscode.settings["yaml.schemas"]).toHaveProperty(
      "./docs/specdojo/schemas/v1/exec-defaults.schema.yaml",
      ".specdojo/exec-defaults.yaml",
    );

    expect(findWriteCall("vimrc")[1]).toBe("set number\n");
    const script = String(findWriteCall("post-create.sh")[1]);
    expect(script).toContain('[ ! -f "$HOME/.vimrc" ]');
    expect(script).toContain('[ ! -f "$HOME/.vim/vimrc" ]');
    expect(script).toContain('cp .devcontainer/vim/vimrc "$HOME/.vimrc"');

    const extensions = JSON.parse(String(findWriteCall("extensions.json")[1]));
    expect(extensions.recommendations).toEqual(json.customizations.vscode.extensions);
  });

  it("should preserve existing VS Code extension recommendations and add only missing ones", async () => {
    existsSyncMock.mockImplementation((p) => {
      const file = String(p);
      if (file.endsWith(".vscode/extensions.json")) return true;
      if (file.includes("/repo/.devcontainer")) return false;
      return file.includes("templates");
    });
    const originalReadFile = readFileMock.getMockImplementation();
    readFileMock.mockImplementation(async (p) => {
      if (String(p).endsWith(".vscode/extensions.json")) {
        return JSON.stringify({ recommendations: ["existing.extension", "mhutchie.git-graph"] });
      }
      return originalReadFile?.(p) ?? "";
    });

    await runDevcontainerScaffold({
      packageRoot,
      repoRoot,
      preset: "recommended",
      providers: [],
      editors: [],
      ollama: false,
      cron: false,
      tmux: false,
      force: false,
      dryRun: false,
    });

    const extensions = JSON.parse(String(findWriteCall("extensions.json")[1]));
    expect(extensions.recommendations[0]).toBe("existing.extension");
    expect(
      extensions.recommendations.filter((extension: string) => extension === "mhutchie.git-graph"),
    ).toHaveLength(1);
  });

  it("should reject an unknown preset", async () => {
    await expect(
      runDevcontainerScaffold({
        packageRoot,
        repoRoot,
        preset: "unknown",
        providers: [],
        editors: [],
        ollama: false,
        cron: false,
        tmux: false,
        force: false,
        dryRun: false,
      }),
    ).rejects.toThrow("Unknown Dev Container preset: unknown");
    expect(writeFileMock).not.toHaveBeenCalled();
  });

  it("should install the Emacs init where Emacs will load it without overwriting user config", async () => {
    await runDevcontainerScaffold({
      packageRoot,
      repoRoot,
      providers: [],
      editors: ["emacs"],
      ollama: false,
      cron: false,
      tmux: false,
      force: false,
      dryRun: false,
    });

    const script = String(findWriteCall("post-create.sh")[1]);
    const actualFs = await vi.importActual<typeof fs>("node:fs");
    const temporaryRoot = actualFs.mkdtempSync(path.join(os.tmpdir(), "specdojo-emacs-home-"));
    const fakeBin = path.join(temporaryRoot, "bin");
    actualFs.mkdirSync(fakeBin);
    actualFs.writeFileSync(path.join(fakeBin, "sudo"), "#!/usr/bin/env bash\nexit 0\n", {
      mode: 0o755,
    });
    actualFs.writeFileSync(path.join(fakeBin, "curl"), "#!/usr/bin/env bash\nexit 0\n", {
      mode: 0o755,
    });
    actualFs.writeFileSync(path.join(fakeBin, "dpkg"), "#!/usr/bin/env bash\necho amd64\n", {
      mode: 0o755,
    });
    actualFs.writeFileSync(path.join(fakeBin, "sha256sum"), "#!/usr/bin/env bash\nexit 0\n", {
      mode: 0o755,
    });
    actualFs.writeFileSync(path.join(fakeBin, "npm"), "#!/usr/bin/env bash\nexit 0\n", {
      mode: 0o755,
    });
    actualFs.writeFileSync(path.join(fakeBin, "rm"), "#!/usr/bin/env bash\nexit 0\n", {
      mode: 0o755,
    });

    const cases = [
      {
        name: "an empty home",
        prepare: (_home: string) => undefined,
        installedPath: ".config/emacs/init.el",
      },
      {
        name: "an existing .emacs.d directory",
        prepare: (home: string) => actualFs.mkdirSync(path.join(home, ".emacs.d")),
        installedPath: ".emacs.d/init.el",
      },
      {
        name: "an existing .emacs file",
        prepare: (home: string) => actualFs.writeFileSync(path.join(home, ".emacs"), "user config"),
        installedPath: undefined,
      },
    ];

    try {
      for (const testCase of cases) {
        const home = path.join(temporaryRoot, testCase.name.replaceAll(" ", "-"));
        const workspace = path.join(home, "workspace");
        actualFs.mkdirSync(path.join(workspace, ".devcontainer", "emacs"), { recursive: true });
        actualFs.writeFileSync(
          path.join(workspace, ".devcontainer", "emacs", "init.el"),
          ";;; bundled Emacs defaults",
        );
        testCase.prepare(home);

        const result = spawnSync("bash", ["-c", script], {
          cwd: workspace,
          encoding: "utf8",
          env: { ...process.env, HOME: home, PATH: `${fakeBin}:${process.env.PATH ?? ""}` },
        });

        expect(result.status, `${testCase.name}: ${result.stderr}`).toBe(0);
        const configInit = path.join(home, ".config", "emacs", "init.el");
        const legacyInit = path.join(home, ".emacs.d", "init.el");
        if (testCase.installedPath) {
          const installedPath = path.join(home, testCase.installedPath);
          expect(actualFs.readFileSync(installedPath, "utf8")).toBe(";;; bundled Emacs defaults");
          expect(result.stdout).toContain(`Installed Emacs init: ${installedPath}`);
        } else {
          expect(actualFs.existsSync(configInit)).toBe(false);
          expect(actualFs.existsSync(legacyInit)).toBe(false);
          expect(result.stdout).not.toContain("Installed Emacs init:");
        }
      }
    } finally {
      actualFs.rmSync(temporaryRoot, { recursive: true, force: true });
    }
  });

  it("should install the Vim config only when the user has no existing Vim config", async () => {
    await runDevcontainerScaffold({
      packageRoot,
      repoRoot,
      providers: [],
      editors: ["vim"],
      ollama: false,
      cron: false,
      tmux: false,
      force: false,
      dryRun: false,
    });

    const script = String(findWriteCall("post-create.sh")[1]);
    const actualFs = await vi.importActual<typeof fs>("node:fs");
    const temporaryRoot = actualFs.mkdtempSync(path.join(os.tmpdir(), "specdojo-vim-home-"));
    const fakeBin = path.join(temporaryRoot, "bin");
    actualFs.mkdirSync(fakeBin);
    actualFs.writeFileSync(path.join(fakeBin, "npm"), "#!/usr/bin/env bash\nexit 0\n", {
      mode: 0o755,
    });

    const cases = [
      { name: "empty", existingPath: undefined, expectInstalled: true },
      { name: "vimrc", existingPath: ".vimrc", expectInstalled: false },
      { name: "vim-directory", existingPath: ".vim/vimrc", expectInstalled: false },
    ];

    try {
      for (const testCase of cases) {
        const home = path.join(temporaryRoot, testCase.name);
        const workspace = path.join(home, "workspace");
        actualFs.mkdirSync(path.join(workspace, ".devcontainer", "vim"), { recursive: true });
        actualFs.writeFileSync(path.join(workspace, ".devcontainer", "vim", "vimrc"), "bundled");
        if (testCase.existingPath) {
          const existingPath = path.join(home, testCase.existingPath);
          actualFs.mkdirSync(path.dirname(existingPath), { recursive: true });
          actualFs.writeFileSync(existingPath, "user config");
        }

        const result = spawnSync("bash", ["-c", script], {
          cwd: workspace,
          encoding: "utf8",
          env: { ...process.env, HOME: home, PATH: `${fakeBin}:${process.env.PATH ?? ""}` },
        });

        expect(result.status, `${testCase.name}: ${result.stderr}`).toBe(0);
        const vimrc = path.join(home, ".vimrc");
        if (testCase.expectInstalled) {
          expect(actualFs.readFileSync(vimrc, "utf8")).toBe("bundled");
          expect(result.stdout).toContain(`Installed Vim config: ${vimrc}`);
        } else if (testCase.existingPath === ".vimrc") {
          expect(actualFs.readFileSync(vimrc, "utf8")).toBe("user config");
        } else {
          expect(actualFs.existsSync(vimrc)).toBe(false);
        }
      }
    } finally {
      actualFs.rmSync(temporaryRoot, { recursive: true, force: true });
    }
  });

  it("should load the bundled Emacs init without errors when Emacs is available", async () => {
    const actualFs = await vi.importActual<typeof fs>("node:fs");
    const temporaryHome = actualFs.mkdtempSync(path.join(os.tmpdir(), "specdojo-emacs-test-"));
    try {
      const result = spawnSync(
        "emacs",
        ["--batch", "-Q", "-l", path.join(process.cwd(), "templates/devcontainer/emacs/init.el")],
        {
          encoding: "utf8",
          env: { ...process.env, HOME: temporaryHome },
        },
      );
      if (result.error && "code" in result.error && result.error.code === "ENOENT") return;
      expect(result.status, result.stderr).toBe(0);
    } finally {
      actualFs.rmSync(temporaryHome, { recursive: true, force: true });
    }
  });

  it("should keep the default seccomp profile without the codex provider", async () => {
    await runDevcontainerScaffold({
      packageRoot,
      repoRoot,
      providers: ["claude", "opencode", "antigravity"],
      editors: [],
      ollama: false,
      cron: false,
      tmux: false,
      force: false,
      dryRun: false,
    });

    const jsonCall = findWriteCall("devcontainer.json");
    const json = JSON.parse(String(jsonCall[1]));
    expect(json).not.toHaveProperty("runArgs");
    const shCall = findWriteCall("post-create.sh");
    expect(shCall[1]).not.toContain("bubblewrap");
  });

  it("should normalize the repository name used as the volume prefix", async () => {
    await runDevcontainerScaffold({
      packageRoot,
      repoRoot: "/workspaces/My Project!",
      providers: [],
      editors: [],
      ollama: false,
      cron: false,
      tmux: false,
      force: false,
      dryRun: false,
    });

    const jsonCall = findWriteCall("devcontainer.json");
    const json = JSON.parse(String(jsonCall[1]));
    expect(json.mounts).toContain(
      "source=my-project-specdojo-git,target=/home/node/.config/git,type=volume",
    );
  });

  it("should override the workspace parent name", async () => {
    await runDevcontainerScaffold({
      packageRoot,
      repoRoot,
      workspaceName: "stable-workspace",
      providers: [],
      editors: [],
      ollama: false,
      cron: false,
      tmux: false,
      force: false,
      dryRun: false,
    });

    const json = JSON.parse(String(findWriteCall("devcontainer.json")[1]));
    expect(json.workspaceMount).toContain("target=/workspaces/stable-workspace,");
    expect(json.workspaceFolder).toBe(
      "/workspaces/stable-workspace/${localWorkspaceFolderBasename}",
    );
  });

  it.each(["has space", "nested/path", "control\nname", ".", ".."])(
    "should reject an invalid workspace name: %j",
    async (workspaceName) => {
      await expect(
        runDevcontainerScaffold({
          packageRoot,
          repoRoot,
          workspaceName,
          providers: [],
          editors: [],
          ollama: false,
          cron: false,
          tmux: false,
          force: false,
          dryRun: false,
        }),
      ).rejects.toThrow("Invalid workspace name");
      expect(writeFileMock).not.toHaveBeenCalled();
    },
  );

  it("should reject an invalid detected workspace parent name", async () => {
    await expect(
      runDevcontainerScaffold({
        packageRoot,
        repoRoot: "/workspaces/has space/app1-specdojo",
        providers: [],
        editors: [],
        ollama: false,
        cron: false,
        tmux: false,
        force: false,
        dryRun: false,
      }),
    ).rejects.toThrow("Invalid workspace name");
    expect(writeFileMock).not.toHaveBeenCalled();
  });

  describe("remoteEnv configuration", () => {
    it("should prepend ~/.local/bin to PATH and preserve other remoteEnv variables", async () => {
      readFileMock.mockImplementation(async (p) => {
        const file = String(p);
        if (file.endsWith("devcontainer.json")) {
          return Promise.resolve(
            JSON.stringify({
              remoteUser: "testuser",
              workspaceMount: "source=...,target=...",
              workspaceFolder: "...",
              features: {},
              mounts: [],
              containerEnv: {},
              remoteEnv: {
                CUSTOM_VAR: "custom_value",
                ANOTHER_VAR: "another_value",
              },
            }),
          );
        }
        if (file.endsWith("post-create.sh")) return Promise.resolve("npm install");
        if (file.endsWith("specdojo-tmux.sh.sample")) {
          return Promise.resolve("#!/usr/bin/env bash\necho sample");
        }
        return Promise.resolve("");
      });

      await runDevcontainerScaffold({
        packageRoot,
        repoRoot,
        providers: [],
        editors: [],
        ollama: false,
        cron: false,
        tmux: false,
        force: false,
        dryRun: false,
      });

      const json = JSON.parse(String(findWriteCall("devcontainer.json")[1]));
      expect(json.remoteEnv).toEqual({
        CUSTOM_VAR: "custom_value",
        ANOTHER_VAR: "another_value",
        PATH: "/home/testuser/.local/bin:${containerEnv:PATH}",
      });
    });

    it("should prepend ~/.local/bin when PATH is already in remoteEnv", async () => {
      readFileMock.mockImplementation(async (p) => {
        const file = String(p);
        if (file.endsWith("devcontainer.json")) {
          return Promise.resolve(
            JSON.stringify({
              remoteUser: "node",
              workspaceMount: "source=...,target=...",
              workspaceFolder: "...",
              features: {},
              mounts: [],
              containerEnv: {},
              remoteEnv: {
                PATH: "/opt/custom/bin:${containerEnv:PATH}",
              },
            }),
          );
        }
        if (file.endsWith("post-create.sh")) return Promise.resolve("npm install");
        if (file.endsWith("specdojo-tmux.sh.sample")) {
          return Promise.resolve("#!/usr/bin/env bash\necho sample");
        }
        return Promise.resolve("");
      });

      await runDevcontainerScaffold({
        packageRoot,
        repoRoot,
        providers: [],
        editors: [],
        ollama: false,
        cron: false,
        tmux: false,
        force: false,
        dryRun: false,
      });

      const json = JSON.parse(String(findWriteCall("devcontainer.json")[1]));
      expect(json.remoteEnv).toEqual({
        PATH: "/home/node/.local/bin:/opt/custom/bin:${containerEnv:PATH}",
      });
    });

    it("should not duplicate ~/.local/bin when it is already in PATH", async () => {
      readFileMock.mockImplementation(async (p) => {
        const file = String(p);
        if (file.endsWith("devcontainer.json")) {
          return Promise.resolve(
            JSON.stringify({
              remoteUser: "node",
              workspaceMount: "source=...,target=...",
              workspaceFolder: "...",
              features: {},
              mounts: [],
              containerEnv: {},
              remoteEnv: {
                PATH: "/home/node/.local/bin:${containerEnv:PATH}",
              },
            }),
          );
        }
        if (file.endsWith("post-create.sh")) return Promise.resolve("npm install");
        if (file.endsWith("specdojo-tmux.sh.sample")) {
          return Promise.resolve("#!/usr/bin/env bash\necho sample");
        }
        return Promise.resolve("");
      });

      await runDevcontainerScaffold({
        packageRoot,
        repoRoot,
        providers: [],
        editors: [],
        ollama: false,
        cron: false,
        tmux: false,
        force: false,
        dryRun: false,
      });

      const json = JSON.parse(String(findWriteCall("devcontainer.json")[1]));
      expect(json.remoteEnv).toEqual({
        PATH: "/home/node/.local/bin:${containerEnv:PATH}",
      });
    });
  });

  describe("remote-host sample generation", () => {
    it("extracts published ports from appPort and forwardPorts", () => {
      expect(
        extractPublishedPorts({
          appPort: [5173, "5174:5174", "127.0.0.1:5175:5175"],
          forwardPorts: [4321, 5173],
        }),
      ).toEqual([5173, 5174, 5175, 4321]);

      expect(extractPublishedPorts({ appPort: 3000 })).toEqual([3000]);
      expect(extractPublishedPorts({})).toEqual([]);
    });

    it("generates ssh-config.sample with LocalForward when ports are present", () => {
      const config = generateSshConfigSample([5173, 5174]);
      expect(config).toContain("Host <host>");
      expect(config).toContain("Host <host>-tmux");
      expect(config).toContain("RequestTTY force");
      expect(config).toContain("RemoteCommand ~/bin/specdojo-tmux.sh");
      expect(config).toContain("LocalForward 5173 127.0.0.1:5173");
      expect(config).toContain("LocalForward 5174 127.0.0.1:5174");
    });

    it("generates ssh-config.sample with example comment when no ports are present", () => {
      const config = generateSshConfigSample([]);
      expect(config).toContain("Host <host>");
      expect(config).toContain("Host <host>-tmux");
      expect(config).toContain("RequestTTY force");
      expect(config).toContain("RemoteCommand ~/bin/specdojo-tmux.sh");
      expect(config).toContain(
        "RemoteCommand は非対話シェルで動くため、接続先端末の ~/.zshrc などの PATH 設定は読み込まれません。",
      );
      expect(config).toContain("ssh <host> 'command -v devcontainer'");
      expect(config).toContain("# 例: LocalForward 5173 127.0.0.1:5173");
      expect(config).not.toMatch(/^\s*LocalForward/m);
    });

    it("writes remote-host samples including published ports from devcontainer.json", async () => {
      readFileMock.mockImplementation(async (p) => {
        const file = String(p);
        if (file.endsWith("devcontainer.json")) {
          return Promise.resolve(
            JSON.stringify({
              appPort: [5173, 5174],
              forwardPorts: [4321],
              workspaceMount:
                "source=${localWorkspaceFolder}/..,target=/workspaces/__SPECDOJO_WORKSPACE_NAME__,type=bind,consistency=cached",
              workspaceFolder:
                "/workspaces/__SPECDOJO_WORKSPACE_NAME__/${localWorkspaceFolderBasename}",
              mounts: [],
            }),
          );
        }
        if (file.endsWith("post-create.sh")) return Promise.resolve("npm install");
        if (file.endsWith("specdojo-tmux.sh.sample")) {
          return Promise.resolve("#!/usr/bin/env bash\necho sample tmux");
        }
        return Promise.resolve("");
      });

      await runDevcontainerScaffold({
        packageRoot,
        repoRoot,
        providers: [],
        editors: [],
        ollama: false,
        cron: false,
        tmux: false,
        force: false,
        dryRun: false,
      });

      const tmuxCall = findWriteCall("specdojo-tmux.sh.sample");
      expect(String(tmuxCall[0])).toBe(
        path.join(repoRoot, ".devcontainer", "remote-host", "specdojo-tmux.sh.sample"),
      );
      expect(String(tmuxCall[1])).toContain("echo sample tmux");

      const sshCall = findWriteCall("ssh-config.sample");
      expect(String(sshCall[0])).toBe(
        path.join(repoRoot, ".devcontainer", "remote-host", "ssh-config.sample"),
      );
      const sshContent = String(sshCall[1]);
      expect(sshContent).toContain("LocalForward 5173 127.0.0.1:5173");
      expect(sshContent).toContain("LocalForward 5174 127.0.0.1:5174");
      expect(sshContent).toContain("LocalForward 4321 127.0.0.1:4321");

      expect(stdoutWrite).toHaveBeenCalledWith(
        expect.stringContaining("Written: .devcontainer/remote-host/specdojo-tmux.sh.sample"),
      );
      expect(stdoutWrite).toHaveBeenCalledWith(
        expect.stringContaining("Written: .devcontainer/remote-host/ssh-config.sample"),
      );
      expect(stdoutWrite).toHaveBeenCalledWith(
        expect.stringContaining(
          "Remote host: copy .devcontainer/remote-host/specdojo-tmux.sh.sample",
        ),
      );
    });

    it("writes remote-host samples with comment example when no ports are configured", async () => {
      await runDevcontainerScaffold({
        packageRoot,
        repoRoot,
        providers: [],
        editors: [],
        ollama: false,
        cron: false,
        tmux: false,
        force: false,
        dryRun: false,
      });

      const sshCall = findWriteCall("ssh-config.sample");
      const sshContent = String(sshCall[1]);
      expect(sshContent).toContain("# 例: LocalForward 5173 127.0.0.1:5173");
      expect(sshContent).not.toMatch(/^\s*LocalForward \d+/m);
    });

    it("does not overwrite existing samples when force is false", async () => {
      existsSyncMock.mockImplementation((p) => {
        const file = String(p);
        if (file.includes(".devcontainer")) return true;
        if (file.includes("templates")) return true;
        return false;
      });

      await runDevcontainerScaffold({
        packageRoot,
        repoRoot,
        providers: [],
        editors: [],
        ollama: false,
        cron: false,
        tmux: false,
        force: false,
        dryRun: false,
      });

      expect(stdoutWrite).toHaveBeenCalledWith(expect.stringContaining("Skipped (already exists)"));
      expect(writeFileMock).not.toHaveBeenCalled();
    });

    it("overwrites existing samples when force is true", async () => {
      existsSyncMock.mockImplementation((p) => {
        const file = String(p);
        if (file.includes(".devcontainer")) return true;
        if (file.includes("templates")) return true;
        return false;
      });

      await runDevcontainerScaffold({
        packageRoot,
        repoRoot,
        providers: [],
        editors: [],
        ollama: false,
        cron: false,
        tmux: false,
        force: true,
        dryRun: false,
      });

      expect(findWriteCall("specdojo-tmux.sh.sample")).toBeDefined();
      expect(findWriteCall("ssh-config.sample")).toBeDefined();
    });

    it("generates specdojo-tmux.sh.sample with -u flag and reflects remoteUser from devcontainer.json", async () => {
      const actualFs = await vi.importActual<typeof fs>("node:fs");
      const tmuxTemplate = actualFs.readFileSync(
        path.join(process.cwd(), "templates/devcontainer/remote-host/specdojo-tmux.sh.sample"),
        "utf8",
      );
      readFileMock.mockImplementation(async (p) => {
        const file = String(p);
        if (file.endsWith("devcontainer.json")) {
          return Promise.resolve(
            JSON.stringify({
              remoteUser: "developer",
              workspaceMount:
                "source=${localWorkspaceFolder}/..,target=/workspaces/__SPECDOJO_WORKSPACE_NAME__,type=bind,consistency=cached",
              workspaceFolder:
                "/workspaces/__SPECDOJO_WORKSPACE_NAME__/${localWorkspaceFolderBasename}",
              mounts: [],
            }),
          );
        }
        if (file.endsWith("post-create.sh")) return Promise.resolve("npm install");
        if (file.endsWith("specdojo-tmux.sh.sample")) {
          return Promise.resolve(tmuxTemplate);
        }
        return Promise.resolve("");
      });

      await runDevcontainerScaffold({
        packageRoot,
        repoRoot,
        providers: [],
        editors: [],
        ollama: false,
        cron: false,
        tmux: false,
        force: false,
        dryRun: false,
      });

      const tmuxCall = findWriteCall("specdojo-tmux.sh.sample");
      const tmuxContent = String(tmuxCall[1]);
      expect(tmuxContent).toContain('docker exec -it --detach-keys="ctrl-]" -u "$container_user"');
      expect(tmuxContent).toContain('container_user="developer"');
      expect(tmuxContent).toContain(
        "remoteUser を変更した場合は、下記 container_user の値を変更してください。",
      );
      expect(tmuxContent).toContain('node_bin_dir="/absolute/path/to/node/bin"');
      expect(tmuxContent).toContain(
        'export PATH="$node_bin_dir:/opt/homebrew/bin:/usr/local/bin:$PATH"',
      );
      expect(tmuxContent).toContain('dirname "$(command -v devcontainer)"');
      expect(tmuxContent).toContain('node_bin_dir="/opt/homebrew/bin"');
      expect(tmuxContent).toContain('node_bin_dir="$HOME/.nvm/versions/node/v22.0.0/bin"');
      expect(tmuxContent).toContain('node_bin_dir="$HOME/.local/share/mise/installs/node/24/bin"');
      expect(tmuxContent).toContain(
        'echo "Dev Container CLI is not installed or not in PATH." >&2',
      );
      expect(tmuxContent).toContain('echo "Current PATH: $PATH" >&2');
      expect(tmuxContent).toContain(
        'echo "Check the location on the host terminal with: dirname \\"\\$(command -v devcontainer)\\"" >&2',
      );
      expect(tmuxContent).toContain('echo "Docker command was not found in PATH." >&2');
      expect(tmuxContent).toContain(
        'echo "Check the location on the host terminal with: dirname \\"\\$(command -v docker)\\"" >&2',
      );
    });
  });
});
