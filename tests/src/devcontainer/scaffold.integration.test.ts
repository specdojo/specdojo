import { spawnSync, type SpawnSyncReturns } from "node:child_process";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { runDevcontainerScaffold } from "../../../src/devcontainer/scaffold.js";

const PACKAGE_ROOT = resolve(process.cwd());
const REMOTE_COMMAND_PATH = "/usr/bin:/bin";
const tempDirs: string[] = [];

interface ScaffoldFixture {
  home: string;
  repo: string;
  root: string;
  postCreateScript: string;
  tmuxScript: string;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

async function createScaffoldFixture(
  providers: string[] = [],
  preset?: string,
): Promise<ScaffoldFixture> {
  const root = mkdtempSync(join(tmpdir(), "specdojo-devcontainer-scripts-"));
  tempDirs.push(root);
  const home = join(root, "home");
  const repo = join(root, "workspace", "repo");
  mkdirSync(home, { recursive: true });
  mkdirSync(repo, { recursive: true });

  await runDevcontainerScaffold({
    packageRoot: PACKAGE_ROOT,
    repoRoot: repo,
    preset,
    providers,
    editors: [],
    ollama: false,
    cron: false,
    tmux: true,
    force: false,
    dryRun: false,
  });

  return {
    home,
    repo,
    root,
    postCreateScript: join(repo, ".devcontainer", "post-create.sh"),
    tmuxScript: join(repo, ".devcontainer", "remote-host", "specdojo-tmux.sh.sample"),
  };
}

function writeExecutable(path: string, content: string): void {
  writeFileSync(path, content, "utf8");
  chmodSync(path, 0o755);
}

function configureTmuxScript(
  sourcePath: string,
  targetPath: string,
  options: { fallbackBinDirs?: readonly [string, string]; nodeBinDir: string; repo: string },
): void {
  let configured = readFileSync(sourcePath, "utf8")
    .replace(
      'container_workspace_dir="/workspaces/<workspace-name>/<repo-name>"',
      'container_workspace_dir="/workspaces/workspace/repo"',
    )
    .replace(
      'workspace_dir="${HOME}/<path-to-workspace>/<repo-name>"',
      `workspace_dir="${options.repo}"`,
    )
    .replace('node_bin_dir="/absolute/path/to/node/bin"', `node_bin_dir="${options.nodeBinDir}"`);
  if (options.fallbackBinDirs) {
    configured = configured.replace(
      "/opt/homebrew/bin:/usr/local/bin",
      options.fallbackBinDirs.join(":"),
    );
  }
  writeExecutable(targetPath, configured);
}

function runScript(
  script: string,
  cwd: string,
  env: Record<string, string>,
): SpawnSyncReturns<string> {
  return spawnSync("/bin/bash", [script], {
    cwd,
    encoding: "utf8",
    env,
  });
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

describe("scaffolded devcontainer shell scripts", () => {
  it("runs the tmux helper with a RemoteCommand-like PATH and the configured node bin", async () => {
    const fixture = await createScaffoldFixture();
    const fakeBin = join(fixture.root, "node-bin");
    const commandLog = join(fixture.root, "commands.log");
    const containerState = join(fixture.root, "container-started");
    const configuredScript = join(fixture.root, "specdojo-tmux.sh");
    mkdirSync(fakeBin);

    writeExecutable(
      join(fakeBin, "docker"),
      fakeCommandBody(
        "docker",
        `case "$1" in
  info)
    exit 0
    ;;
  ps)
    if [ -f "$FAKE_CONTAINER_STATE" ]; then
      printf 'container-123\\n'
    fi
    exit 0
    ;;
  exec)
    exit 0
    ;;
esac
exit 1`,
      ),
    );
    writeExecutable(
      join(fakeBin, "devcontainer"),
      fakeCommandBody(
        "devcontainer",
        `: >"$FAKE_CONTAINER_STATE"
exit 0`,
      ),
    );
    configureTmuxScript(fixture.tmuxScript, configuredScript, {
      nodeBinDir: fakeBin,
      repo: fixture.repo,
    });

    const result = runScript(configuredScript, fixture.repo, {
      COMMAND_LOG: commandLog,
      FAKE_CONTAINER_STATE: containerState,
      HOME: fixture.home,
      PATH: REMOTE_COMMAND_PATH,
    });

    expect(result.status, result.stderr).toBe(0);
    const calls = readFileSync(commandLog, "utf8").trim().split("\n");
    expect(calls).toContain(`devcontainer\tup\t--workspace-folder\t${fixture.repo}`);
    expect(calls).toContain(
      "docker\texec\t-it\t--detach-keys=ctrl-]\t-u\tnode\t-w\t/workspaces/workspace/repo\tcontainer-123\ttmux\tnew-session\t-A\t-s\tspecdojo",
    );
  });

  it("calls devcontainer up instead of execing into an unrelated vsc container when matching container is stopped", async () => {
    const fixture = await createScaffoldFixture();
    const fakeBin = join(fixture.root, "node-bin");
    const commandLog = join(fixture.root, "commands.log");
    const containerState = join(fixture.root, "container-started");
    const configuredScript = join(fixture.root, "specdojo-tmux.sh");
    mkdirSync(fakeBin);

    writeExecutable(
      join(fakeBin, "docker"),
      fakeCommandBody(
        "docker",
        `case "$1" in
  info)
    exit 0
    ;;
  ps)
    for arg in "$@"; do
      if [ "$arg" = "--format" ]; then
        printf 'other-container\\tvsc-other-image\\n'
        exit 0
      fi
    done
    if [ -f "$FAKE_CONTAINER_STATE" ]; then
      printf 'target-container-456\\n'
    fi
    exit 0
    ;;
  exec)
    exit 0
    ;;
esac
exit 1`,
      ),
    );
    writeExecutable(
      join(fakeBin, "devcontainer"),
      fakeCommandBody(
        "devcontainer",
        `: >"$FAKE_CONTAINER_STATE"
exit 0`,
      ),
    );
    configureTmuxScript(fixture.tmuxScript, configuredScript, {
      nodeBinDir: fakeBin,
      repo: fixture.repo,
    });

    const result = runScript(configuredScript, fixture.repo, {
      COMMAND_LOG: commandLog,
      FAKE_CONTAINER_STATE: containerState,
      HOME: fixture.home,
      PATH: REMOTE_COMMAND_PATH,
    });

    expect(result.status, result.stderr).toBe(0);
    const calls = readFileSync(commandLog, "utf8").trim().split("\n");
    expect(calls).toContain(`devcontainer\tup\t--workspace-folder\t${fixture.repo}`);
    expect(calls).toContain(
      "docker\texec\t-it\t--detach-keys=ctrl-]\t-u\tnode\t-w\t/workspaces/workspace/repo\ttarget-container-456\ttmux\tnew-session\t-A\t-s\tspecdojo",
    );
    expect(calls.some((call) => call.includes("other-container"))).toBe(false);
  });

  it("fails with diagnostics when container_workspace_dir does not exist in the container", async () => {
    const fixture = await createScaffoldFixture();
    const fakeBin = join(fixture.root, "node-bin");
    const commandLog = join(fixture.root, "commands.log");
    const configuredScript = join(fixture.root, "specdojo-tmux.sh");
    mkdirSync(fakeBin);

    writeExecutable(
      join(fakeBin, "docker"),
      fakeCommandBody(
        "docker",
        `case "$1" in
  info)
    exit 0
    ;;
  ps)
    printf 'container-123\\n'
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
exit 1`,
      ),
    );
    writeExecutable(join(fakeBin, "devcontainer"), fakeCommandBody("devcontainer"));
    configureTmuxScript(fixture.tmuxScript, configuredScript, {
      nodeBinDir: fakeBin,
      repo: fixture.repo,
    });

    const result = runScript(configuredScript, fixture.repo, {
      COMMAND_LOG: commandLog,
      HOME: fixture.home,
      PATH: REMOTE_COMMAND_PATH,
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("container-123");
    expect(result.stderr).toContain("/workspaces/workspace/repo");
    const calls = readFileSync(commandLog, "utf8").trim().split("\n");
    expect(calls.some((call) => call.includes("tmux\tnew-session"))).toBe(false);
  });

  it.each([
    {
      missing: "devcontainer",
      available: "docker",
      expected: [
        "Dev Container CLI is not installed or not in PATH.",
        "Current PATH:",
        'dirname "$(command -v devcontainer)"',
      ],
    },
    {
      missing: "docker",
      available: "devcontainer",
      expected: [
        "Docker command was not found in PATH.",
        "Current PATH:",
        'dirname "$(command -v docker)"',
      ],
    },
  ])("reports PATH diagnostics when $missing is not found", async ({ available, expected }) => {
    const fixture = await createScaffoldFixture();
    const fakeBin = join(fixture.root, "node-bin");
    const commandLog = join(fixture.root, "commands.log");
    const configuredScript = join(fixture.root, "specdojo-tmux.sh");
    const isolatedPath = join(fixture.root, "remote-command-path");
    const fallbackBinDirs = [
      join(fixture.root, "homebrew-bin"),
      join(fixture.root, "local-bin"),
    ] as const;
    mkdirSync(fakeBin);
    mkdirSync(isolatedPath);
    // Keep host-installed Docker and Dev Container CLIs unreachable in the missing-command cases.
    writeExecutable(join(fakeBin, available), fakeCommandBody(available));
    configureTmuxScript(fixture.tmuxScript, configuredScript, {
      fallbackBinDirs,
      nodeBinDir: fakeBin,
      repo: fixture.repo,
    });

    const result = runScript(configuredScript, fixture.repo, {
      COMMAND_LOG: commandLog,
      HOME: fixture.home,
      PATH: isolatedPath,
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(fakeBin);
    for (const message of expected) {
      expect(result.stderr).toContain(message);
    }
  });

  it("restores ~/.local ownership and creates ~/.local/bin before an agent installer", async () => {
    const fixture = await createScaffoldFixture(["claude"]);
    const fakeBin = join(fixture.root, "fake-bin");
    const commandLog = join(fixture.root, "commands.log");
    mkdirSync(fakeBin);
    for (const dir of [
      join(fixture.home, ".local"),
      join(fixture.home, ".local", "share"),
      join(fixture.home, ".local", "share", "opencode"),
      join(fixture.home, ".config"),
    ]) {
      mkdirSync(dir, { recursive: true });
    }

    writeExecutable(join(fakeBin, "sudo"), fakeCommandBody("sudo"));
    writeExecutable(join(fakeBin, "npm"), fakeCommandBody("npm"));
    writeExecutable(
      join(fakeBin, "curl"),
      fakeCommandBody(
        "curl",
        `if [ -d "$HOME/.local/bin" ]; then
  printf 'curl-state\\tlocal-bin-present\\n' >>"$COMMAND_LOG"
else
  printf 'curl-state\\tlocal-bin-missing\\n' >>"$COMMAND_LOG"
fi
printf ':\\n'`,
      ),
    );
    writeExecutable(
      join(fakeBin, "git"),
      fakeCommandBody(
        "git",
        `if [ "$1" = "rev-parse" ]; then
  printf '%s\\n' "$FAKE_REPO"
  exit 0
fi
if [ "$1" = "config" ] && [ "$2" = "--global" ] && [ "$3" = "--get-all" ]; then
  exit 1
fi
exit 0`,
      ),
    );

    const result = runScript(fixture.postCreateScript, fixture.repo, {
      COMMAND_LOG: commandLog,
      FAKE_REPO: fixture.repo,
      HOME: fixture.home,
      PATH: `${fakeBin}:${REMOTE_COMMAND_PATH}`,
    });

    expect(result.status, result.stderr).toBe(0);
    expect(existsSync(join(fixture.home, ".local", "bin"))).toBe(true);
    const calls = readFileSync(commandLog, "utf8").trim().split("\n");
    const nonRecursiveChowns = calls.filter((call) => call.startsWith("sudo\tchown\t"));
    expect(nonRecursiveChowns.some((call) => call.endsWith(`\t${fixture.home}/.local`))).toBe(true);
    expect(nonRecursiveChowns.some((call) => call.endsWith(`\t${fixture.home}/.local/share`))).toBe(
      true,
    );
    expect(calls).toContain("curl-state\tlocal-bin-present");
    expect(calls).toContain("npm\tinstall");
  });

  it("passes bash syntax checks for both generated scripts", async () => {
    const fixture = await createScaffoldFixture(
      ["claude", "codex", "opencode", "antigravity"],
      "full",
    );

    for (const script of [fixture.postCreateScript, fixture.tmuxScript]) {
      const result = spawnSync("/bin/bash", ["-n", script], { encoding: "utf8" });
      expect(result.status, `${script}: ${result.stderr}`).toBe(0);
    }
  });

  const shellcheckAvailable =
    spawnSync("shellcheck", ["--version"], {
      encoding: "utf8",
    }).status === 0;

  it.skipIf(!shellcheckAvailable)(
    "passes shellcheck for both generated scripts when shellcheck is installed",
    async () => {
      const fixture = await createScaffoldFixture(
        ["claude", "codex", "opencode", "antigravity"],
        "full",
      );

      for (const script of [fixture.postCreateScript, fixture.tmuxScript]) {
        const result = spawnSync("shellcheck", [script], { encoding: "utf8" });
        expect(result.status, `${script}: ${result.stdout}${result.stderr}`).toBe(0);
      }
    },
  );
});
