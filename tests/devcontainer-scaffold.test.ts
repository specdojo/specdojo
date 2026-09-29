import { describe, it, expect, vi, beforeEach } from "vitest";
import { runDevcontainerScaffold } from "../src/devcontainer-scaffold.js";
import * as fs from "node:fs";
import * as fsPromises from "node:fs/promises";
import * as path from "node:path";

vi.mock("node:fs");
vi.mock("node:fs/promises");

describe("runDevcontainerScaffold", () => {
  const packageRoot = "/pkg";
  const repoRoot = "/repo";
  let stdoutWrite: any;

  beforeEach(() => {
    vi.resetAllMocks();
    stdoutWrite = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    (fs.existsSync as any).mockImplementation((p: string) => {
      if (p.includes(".devcontainer")) return false; // not exists in repo
      if (p.includes("templates")) return true; // template exists
      return false;
    });

    (fsPromises.readFile as any).mockImplementation((p: string) => {
      if (p.endsWith("devcontainer.json")) {
        return Promise.resolve(
          JSON.stringify({
            features: {},
            mounts: [],
            containerEnv: {},
            postCreateCommand: "bash .devcontainer/post-create.sh",
          }),
        );
      }
      if (p.endsWith("post-create.sh")) {
        return Promise.resolve("npm install");
      }
      return Promise.resolve("");
    });
  });

  it("should not overwrite existing .devcontainer by default", async () => {
    (fs.existsSync as any).mockReturnValue(true); // .devcontainer exists

    await runDevcontainerScaffold({
      packageRoot,
      repoRoot,
      providers: [],
      ollama: false,
      cron: false,
      tmux: false,
      force: false,
      dryRun: false,
    });

    expect(stdoutWrite).toHaveBeenCalledWith(expect.stringContaining("Skipped (already exists)"));
    expect(fsPromises.writeFile).not.toHaveBeenCalled();
  });

  it("should overwrite existing .devcontainer if force is true", async () => {
    (fs.existsSync as any).mockReturnValue(true); // .devcontainer exists

    await runDevcontainerScaffold({
      packageRoot,
      repoRoot,
      providers: [],
      ollama: false,
      cron: false,
      tmux: false,
      force: true,
      dryRun: false,
    });

    expect(fsPromises.writeFile).toHaveBeenCalledTimes(2);
  });

  it("should generate json and sh for basic setup", async () => {
    await runDevcontainerScaffold({
      packageRoot,
      repoRoot,
      providers: [],
      ollama: false,
      cron: false,
      tmux: false,
      force: false,
      dryRun: false,
    });

    expect(fsPromises.writeFile).toHaveBeenCalledTimes(2);
    const jsonCall = (fsPromises.writeFile as any).mock.calls.find((c: any[]) =>
      c[0].endsWith("devcontainer.json"),
    );
    expect(jsonCall).toBeTruthy();
    const json = JSON.parse(jsonCall[1]);
    expect(json.features).not.toHaveProperty(
      "ghcr.io/rocker-org/devcontainer-features/apt-packages:1",
    );
  });

  it("should add tmux and cron features", async () => {
    await runDevcontainerScaffold({
      packageRoot,
      repoRoot,
      providers: [],
      ollama: false,
      cron: true,
      tmux: true,
      force: false,
      dryRun: false,
    });

    const jsonCall = (fsPromises.writeFile as any).mock.calls.find((c: any[]) =>
      c[0].endsWith("devcontainer.json"),
    );
    const json = JSON.parse(jsonCall[1]);
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
      ollama: true,
      cron: false,
      tmux: false,
      force: false,
      dryRun: false,
    });

    const jsonCall = (fsPromises.writeFile as any).mock.calls.find((c: any[]) =>
      c[0].endsWith("devcontainer.json"),
    );
    const json = JSON.parse(jsonCall[1]);
    expect(json.containerEnv["OLLAMA_BASE_URL"]).toBe("http://host.docker.internal:11434");
  });

  it("should add provider specific setups", async () => {
    await runDevcontainerScaffold({
      packageRoot,
      repoRoot,
      providers: ["claude", "codex"],
      ollama: false,
      cron: false,
      tmux: false,
      force: false,
      dryRun: false,
    });

    const jsonCall = (fsPromises.writeFile as any).mock.calls.find((c: any[]) =>
      c[0].endsWith("devcontainer.json"),
    );
    const json = JSON.parse(jsonCall[1]);
    expect(json.mounts).toContain("source=specdojo-claude,target=/home/node/.claude,type=volume");
    expect(json.mounts).toContain("source=specdojo-codex,target=/home/node/.codex,type=volume");

    const shCall = (fsPromises.writeFile as any).mock.calls.find((c: any[]) =>
      c[0].endsWith("post-create.sh"),
    );
    expect(shCall[1]).toContain("curl -fsSL https://claude.ai/install.sh");
    expect(shCall[1]).toContain("curl -fsSL https://chatgpt.com/codex/install.sh");
  });
});
