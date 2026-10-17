import { describe, it, expect, vi, beforeEach } from "vitest";
import { runDevcontainerScaffold } from "../../../src/devcontainer/scaffold.js";
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
            mounts: [
              "source=specdojo-git,target=/home/node/.config/git,type=volume",
              "source=specdojo-gh,target=/home/node/.config/gh,type=volume",
            ],
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

    expect(writeFileMock).toHaveBeenCalledTimes(2);
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

    expect(writeFileMock).toHaveBeenCalledTimes(2);
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
    expect(json.mounts).toContain(
      "source=repo-specdojo-gh,target=/home/node/.config/gh,type=volume",
    );
  });

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

    expect(writeFileMock).toHaveBeenCalledTimes(3);
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
});
