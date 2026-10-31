import { spawnSync, type SpawnSyncReturns } from "node:child_process";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { runDevcontainerHostScript } from "../../../src/devcontainer/host-script.js";
import { specdojoPackageRootDir } from "../../../src/shared/package-paths.js";

function writeExecutable(filePath: string, content: string): void {
  writeFileSync(filePath, content, "utf8");
  chmodSync(filePath, 0o755);
}

function fakeCommandBody(command: string, behavior = "exit 0"): string {
  return `#!/bin/bash
{
  printf '${command}'
  for arg in "$@"; do
    printf '\\t%s' "$arg"
  done
  printf '\\n'
} >>"$COMMAND_LOG"
${behavior}
`;
}

function runScript(
  script: string,
  args: string[],
  cwd: string,
  env: Record<string, string>,
): SpawnSyncReturns<string> {
  return spawnSync("/bin/bash", [script, ...args], {
    cwd,
    encoding: "utf8",
    env,
  });
}

describe("devcontainer host-script", () => {
  let tempRoot: string;
  let packageRoot: string;

  beforeEach(async () => {
    tempRoot = await mkdtemp(join(tmpdir(), "specdojo-host-script-test-"));
    packageRoot = specdojoPackageRootDir();
  });

  afterEach(() => {
    if (existsSync(tempRoot)) {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  describe("runDevcontainerHostScript", () => {
    it("writes executable devcontainer-tmux.sh into .specdojo/host/", async () => {
      await runDevcontainerHostScript({
        packageRoot,
        repoRoot: tempRoot,
        dryRun: false,
      });

      const targetPath = join(tempRoot, ".specdojo", "host", "devcontainer-tmux.sh");
      expect(existsSync(targetPath)).toBe(true);

      const stat = statSync(targetPath);
      // 実行権限 (0o755 / 0o111) が付与されているか
      expect(stat.mode & 0o111).toBe(0o111);

      const content = readFileSync(targetPath, "utf8");
      expect(content).toContain("#!/usr/bin/env bash");
      expect(content).toContain("devcontainer-tmux.sh");
    });

    it("does not write file when dry-run is specified", async () => {
      await runDevcontainerHostScript({
        packageRoot,
        repoRoot: tempRoot,
        dryRun: true,
      });

      const targetPath = join(tempRoot, ".specdojo", "host", "devcontainer-tmux.sh");
      expect(existsSync(targetPath)).toBe(false);
    });

    it("produces identical content when run multiple times (idempotent)", async () => {
      await runDevcontainerHostScript({
        packageRoot,
        repoRoot: tempRoot,
        dryRun: false,
      });

      const targetPath = join(tempRoot, ".specdojo", "host", "devcontainer-tmux.sh");
      const firstRunContent = readFileSync(targetPath, "utf8");

      await runDevcontainerHostScript({
        packageRoot,
        repoRoot: tempRoot,
        dryRun: false,
      });

      const secondRunContent = readFileSync(targetPath, "utf8");
      expect(secondRunContent).toBe(firstRunContent);
    });
  });

  describe("devcontainer-tmux.sh script behavior", () => {
    let workspaceDir: string;
    let fakeBin: string;
    let commandLog: string;
    let hostScript: string;

    beforeEach(async () => {
      workspaceDir = join(tempRoot, "workspace");
      mkdirSync(workspaceDir, { recursive: true });

      const devcontainerDir = join(workspaceDir, ".devcontainer");
      mkdirSync(devcontainerDir, { recursive: true });
      writeFileSync(
        join(devcontainerDir, "devcontainer.json"),
        JSON.stringify({
          name: "test-workspace",
          remoteUser: "node",
        }),
        "utf8",
      );

      // host-script を配置
      await runDevcontainerHostScript({
        packageRoot,
        repoRoot: workspaceDir,
        dryRun: false,
      });

      hostScript = join(workspaceDir, ".specdojo", "host", "devcontainer-tmux.sh");
      fakeBin = join(tempRoot, "fake-bin");
      mkdirSync(fakeBin, { recursive: true });
      commandLog = join(tempRoot, "commands.log");
    });

    it("Path 1: connects directly to running container without calling docker start or devcontainer up", () => {
      const inspectOutput = `bind\t${tempRoot}\t/workspaces\n`;
      writeExecutable(
        join(fakeBin, "docker"),
        fakeCommandBody(
          "docker",
          `case "$1" in
  ps)
    for arg in "$@"; do
      if [ "$arg" = "-a" ]; then
        # 止まっているコンテナの検索では呼ばれない想定
        printf 'stopped-container-999\\n'
        exit 0
      fi
    done
    printf 'running-container-123\\n'
    exit 0
    ;;
  inspect)
    printf '${inspectOutput}'
    exit 0
    ;;
  exec)
    exit 0
    ;;
  start)
    printf 'start should not be called\\n' >&2
    exit 1
    ;;
esac
exit 0`,
        ),
      );
      writeExecutable(
        join(fakeBin, "devcontainer"),
        fakeCommandBody(
          "devcontainer",
          "printf 'devcontainer should not be called\\n' >&2; exit 1",
        ),
      );

      const result = runScript(hostScript, [workspaceDir], workspaceDir, {
        PATH: `${fakeBin}:/usr/bin:/bin`,
        COMMAND_LOG: commandLog,
      });

      expect(result.status, result.stderr).toBe(0);
      const calls = readFileSync(commandLog, "utf8").trim().split("\n");
      // docker ps が呼ばれたこと
      expect(calls.some((c) => c.startsWith("docker\tps"))).toBe(true);
      // docker start や devcontainer up は呼ばれていないこと
      expect(calls.some((c) => c.startsWith("docker\tstart"))).toBe(false);
      expect(calls.some((c) => c.startsWith("devcontainer"))).toBe(false);
      // tmux セッションへの接続が実行されたこと
      expect(calls).toContain(
        `docker\texec\t-it\t--detach-keys=ctrl-]\t-u\tnode\t-w\t/workspaces/workspace\trunning-container-123\ttmux\tnew-session\t-A\t-s\tspecdojo`,
      );
    });

    it("Path 2: wakes stopped container with docker start and connects without node/devcontainer", () => {
      const inspectOutput = `bind\t${tempRoot}\t/workspaces\n`;
      writeExecutable(
        join(fakeBin, "docker"),
        fakeCommandBody(
          "docker",
          `case "$1" in
  ps)
    for arg in "$@"; do
      if [ "$arg" = "-a" ]; then
        printf 'stopped-container-456\\n'
        exit 0
      fi
    done
    # 最初は動いているコンテナなし
    exit 0
    ;;
  start)
    exit 0
    ;;
  inspect)
    printf '${inspectOutput}'
    exit 0
    ;;
  exec)
    exit 0
    ;;
esac
exit 0`,
        ),
      );
      // fakeBin には devcontainer を置かない（node が要らないことの確認）

      const result = runScript(hostScript, [workspaceDir], workspaceDir, {
        PATH: `${fakeBin}:/usr/bin:/bin`,
        COMMAND_LOG: commandLog,
      });

      expect(result.status, result.stderr).toBe(0);
      const calls = readFileSync(commandLog, "utf8").trim().split("\n");
      // docker start stopped-container-456 が呼ばれたこと
      expect(calls).toContain("docker\tstart\tstopped-container-456");
      // devcontainer は呼ばれていないこと
      expect(calls.some((c) => c.startsWith("devcontainer"))).toBe(false);
      // tmux セッションへ接続したこと
      expect(calls).toContain(
        `docker\texec\t-it\t--detach-keys=ctrl-]\t-u\tnode\t-w\t/workspaces/workspace\tstopped-container-456\ttmux\tnew-session\t-A\t-s\tspecdojo`,
      );
    });

    it("Path 3-a: runs devcontainer up with SPECDOJO_NODE_BIN added to PATH when no container exists", () => {
      const customNodeBin = join(tempRoot, "custom-node-bin");
      mkdirSync(customNodeBin, { recursive: true });
      const inspectOutput = `bind\t${workspaceDir}\t/workspaces/workspace\n`;

      writeExecutable(
        join(fakeBin, "docker"),
        fakeCommandBody(
          "docker",
          `case "$1" in
  ps)
    if [ -f "${tempRoot}/container-created" ]; then
      printf 'new-container-789\\n'
    fi
    exit 0
    ;;
  inspect)
    printf '${inspectOutput}'
    exit 0
    ;;
  exec)
    exit 0
    ;;
esac
exit 0`,
        ),
      );

      // customNodeBin に devcontainer を配置
      writeExecutable(
        join(customNodeBin, "devcontainer"),
        fakeCommandBody(
          "devcontainer",
          `touch "${tempRoot}/container-created"
exit 0`,
        ),
      );

      const result = runScript(hostScript, [workspaceDir], workspaceDir, {
        PATH: `${fakeBin}:/usr/bin:/bin`,
        SPECDOJO_NODE_BIN: customNodeBin,
        COMMAND_LOG: commandLog,
      });

      expect(result.status, result.stderr).toBe(0);
      const calls = readFileSync(commandLog, "utf8").trim().split("\n");
      expect(calls).toContain(`devcontainer\tup\t--workspace-folder\t${workspaceDir}`);
      expect(calls).toContain(
        `docker\texec\t-it\t--detach-keys=ctrl-]\t-u\tnode\t-w\t/workspaces/workspace\tnew-container-789\ttmux\tnew-session\t-A\t-s\tspecdojo`,
      );
    });

    it("Path 3-b: runs devcontainer up via user login shell when SPECDOJO_NODE_BIN is not set", () => {
      const inspectOutput = `bind\t${workspaceDir}\t/workspaces/workspace\n`;

      writeExecutable(
        join(fakeBin, "docker"),
        fakeCommandBody(
          "docker",
          `case "$1" in
  ps)
    if [ -f "${tempRoot}/container-created" ]; then
      printf 'login-container-101\\n'
    fi
    exit 0
    ;;
  inspect)
    printf '${inspectOutput}'
    exit 0
    ;;
  exec)
    exit 0
    ;;
esac
exit 0`,
        ),
      );

      writeExecutable(
        join(fakeBin, "devcontainer"),
        fakeCommandBody(
          "devcontainer",
          `touch "${tempRoot}/container-created"
exit 0`,
        ),
      );

      // fake shell を作成して "$SHELL" -lic を模擬（PATH を保持して bash を起動）
      const fakeShell = join(tempRoot, "fake-shell.sh");
      writeExecutable(
        fakeShell,
        `#!/bin/bash
export PATH="${fakeBin}:$PATH"
exec /bin/bash "$@"
`,
      );

      const result = runScript(hostScript, [workspaceDir], workspaceDir, {
        PATH: `${fakeBin}:/usr/bin:/bin`,
        SHELL: fakeShell,
        COMMAND_LOG: commandLog,
      });

      expect(result.status, result.stderr).toBe(0);
      const calls = readFileSync(commandLog, "utf8").trim().split("\n");
      expect(calls).toContain(`devcontainer\tup\t--workspace-folder\t${workspaceDir}`);
      expect(calls).toContain(
        `docker\texec\t-it\t--detach-keys=ctrl-]\t-u\tnode\t-w\t/workspaces/workspace\tlogin-container-101\ttmux\tnew-session\t-A\t-s\tspecdojo`,
      );
    });

    describe("failures and diagnostics", () => {
      it("fails when no arguments are provided", () => {
        const result = runScript(hostScript, [], workspaceDir, {
          PATH: `${fakeBin}:/usr/bin:/bin`,
        });
        expect(result.status).toBe(1);
        expect(result.stderr).toContain("Usage:");
      });

      it("fails when specified workspace directory does not exist", () => {
        const nonexistent = join(tempRoot, "does-not-exist");
        const result = runScript(hostScript, [nonexistent], workspaceDir, {
          PATH: `${fakeBin}:/usr/bin:/bin`,
        });
        expect(result.status).toBe(1);
        expect(result.stderr).toContain("Workspace directory not found");
      });

      it("fails when devcontainer.json does not exist", () => {
        const emptyDir = join(tempRoot, "empty-workspace");
        mkdirSync(emptyDir, { recursive: true });
        const result = runScript(hostScript, [emptyDir], emptyDir, {
          PATH: `${fakeBin}:/usr/bin:/bin`,
        });
        expect(result.status).toBe(1);
        expect(result.stderr).toContain("devcontainer.json was not found");
      });

      it("fails when remoteUser cannot be determined from devcontainer.json", () => {
        const noUserDir = join(tempRoot, "no-user-workspace");
        mkdirSync(join(noUserDir, ".devcontainer"), { recursive: true });
        writeFileSync(
          join(noUserDir, ".devcontainer", "devcontainer.json"),
          JSON.stringify({ name: "no-remote-user" }),
          "utf8",
        );
        const result = runScript(hostScript, [noUserDir], noUserDir, {
          PATH: `${fakeBin}:/usr/bin:/bin`,
        });
        expect(result.status).toBe(1);
        expect(result.stderr).toContain("remoteUser is not defined");
      });

      it("fails when devcontainer fails to start or container is not found", () => {
        writeExecutable(
          join(fakeBin, "docker"),
          fakeCommandBody("docker", "exit 0"), // ps は何も返さない
        );
        writeExecutable(join(fakeBin, "devcontainer"), fakeCommandBody("devcontainer", "exit 0"));

        const result = runScript(hostScript, [workspaceDir], workspaceDir, {
          PATH: `${fakeBin}:/usr/bin:/bin`,
          SPECDOJO_NODE_BIN: fakeBin,
          COMMAND_LOG: commandLog,
        });

        expect(result.status).toBe(1);
        expect(result.stderr).toContain("Failed to start or find devcontainer");
      });

      it("fails when container workspace directory cannot be determined from mounts", () => {
        writeExecutable(
          join(fakeBin, "docker"),
          fakeCommandBody(
            "docker",
            `case "$1" in
  ps)
    printf 'container-abc\\n'
    exit 0
    ;;
  inspect)
    # workspaceDir と一致しないマウント情報
    printf 'bind\\t/other/path\\t/workspaces/other\\n'
    exit 0
    ;;
esac
exit 0`,
          ),
        );

        const result = runScript(hostScript, [workspaceDir], workspaceDir, {
          PATH: `${fakeBin}:/usr/bin:/bin`,
        });

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
          "Could not determine container workspace directory from mounts",
        );
      });

      it("fails when workspace directory does not exist inside container", () => {
        const inspectOutput = `bind\t${workspaceDir}\t/workspaces/workspace\n`;
        writeExecutable(
          join(fakeBin, "docker"),
          fakeCommandBody(
            "docker",
            `case "$1" in
  ps)
    printf 'container-abc\\n'
    exit 0
    ;;
  inspect)
    printf '${inspectOutput}'
    exit 0
    ;;
  exec)
    for arg in "$@"; do
      if [ "$arg" = "test" ]; then
        exit 1
      fi
    done
    exit 0
    ;;
esac
exit 0`,
          ),
        );

        const result = runScript(hostScript, [workspaceDir], workspaceDir, {
          PATH: `${fakeBin}:/usr/bin:/bin`,
        });

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
          "Workspace directory '/workspaces/workspace' does not exist in container 'container-abc'",
        );
      });
    });
  });
});
