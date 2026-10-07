import { describe, it, expect, vi, beforeEach } from "vitest";
import { runDevcontainerScaffold } from "../src/devcontainer-scaffold.js";
import * as fs from "node:fs";
import * as fsPromises from "node:fs/promises";
import { spawnSync } from "node:child_process";
import * as os from "node:os";
import * as path from "node:path";

vi.mock("node:fs");
vi.mock("node:fs/promises");

describe("runDevcontainerScaffold", () => {
  const packageRoot = "/pkg";
  const repoRoot = "/repo";
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

    const shCall = findWriteCall("post-create.sh");
    expect(shCall[1]).toContain("curl -fsSL https://claude.ai/install.sh");
    expect(shCall[1]).toContain("sudo npm install -g @openai/codex@latest");
    expect(shCall[1]).toContain("sudo npm install -g @opencode/cli@latest");
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
    expect(shCall[1]).toContain('[ ! -f "$HOME/.emacs.d/init.el" ]');
    expect(shCall[1]).toContain('[ ! -f "$HOME/.config/emacs/init.el" ]');

    const initCall = findWriteCall("init.el");
    expect(initCall[1]).toBe(";;; bundled Emacs defaults");
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
});
