import { spawnSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { specdojoPackageRootDir } from "../../../src/shared/package-paths.js";

function executable(path: string, body: string): void {
  writeFileSync(path, `#!/bin/bash\n${body}\n`);
  chmodSync(path, 0o755);
}

describe("host script Docker discovery", () => {
  let root: string;
  let workspace: string;
  let bin: string;
  let home: string;
  let shell: string;
  let script: string;
  let log: string;
  let candidates: string[];

  beforeEach(() => {
    root = realpathSync(mkdtempSync(join(tmpdir(), "specdojo-docker-discovery-")));
    workspace = join(root, "workspace with spaces");
    bin = join(root, "system-bin");
    home = join(root, "home");
    shell = join(root, "login-shell");
    script = join(root, "host-script.sh");
    log = join(root, "docker.log");
    mkdirSync(join(workspace, ".devcontainer"), { recursive: true });
    mkdirSync(bin);
    mkdirSync(home);
    writeFileSync(join(workspace, ".devcontainer/devcontainer.json"), '{"remoteUser":"node"}');
    writeFileSync(join(root, "proc-version"), "Linux test kernel");

    // 固定の探索先と /proc/version だけを一時領域へ移す。
    // 実行環境に Docker が入っていてもホストの CLI や daemon へ接続しない。
    const locations = [
      "/usr/local/bin",
      "/opt/homebrew/bin",
      "/Applications/Docker.app/Contents/Resources/bin",
      "/snap/bin",
      "/usr/bin",
    ];
    let source = readFileSync(
      join(specdojoPackageRootDir(), "templates/devcontainer/remote-host/devcontainer-tmux.sh"),
      "utf8",
    );
    const relocated = locations.map((location, index) => {
      const directory = join(root, `candidate-${index}`);
      expect(source).toContain(`  ${location}\n`);
      source = source.replace(`  ${location}\n`, `  "${directory}"\n`);
      return directory;
    });
    candidates = [relocated[0]!, relocated[1]!, join(home, ".docker/bin"), ...relocated.slice(2)];
    source = source.replace("/proc/version", join(root, "proc-version"));
    writeFileSync(script, source);

    for (const command of ["sed", "grep", "head"]) {
      const lookup = spawnSync("/bin/sh", ["-c", 'command -v "$1"', "lookup", command], {
        encoding: "utf8",
      });
      expect(lookup.status).toBe(0);
      symlinkSync(lookup.stdout.trim(), join(bin, command));
    }
    executable(
      join(bin, "uname"),
      'if [ "$1" = -s ]; then printf "%s\\n" "$TEST_OS"; else printf "%s\\n" "$TEST_KERNEL"; fi',
    );
    executable(
      shell,
      `printf '%s\\n' "$1" >>"$SHELL_LOG"
printf '%s\\n' "Welcome" "${root}/noise/docker"
if [ "$1" = -lc ]; then
  export PATH="\${LOGIN_BIN:-$SYSTEM_BIN}"
else
  # ログイン設定が Docker の PATH を消しても、起動直前に復元されること。
  export PATH="$SYSTEM_BIN:\${NODE_BIN:-$SYSTEM_BIN}"
fi
/bin/bash -c "$2" "\${@:3}"
result=$?
printf 'Goodbye\\n'
exit "$result"`,
    );
  });

  afterEach(() => rmSync(root, { recursive: true, force: true }));

  function docker(directory: string): void {
    mkdirSync(directory, { recursive: true });
    executable(
      join(directory, "docker"),
      `printf '%s\\t%s\\n' "$0" "$*" >>"$COMMAND_LOG"
case "$1" in
  info) exit "\${INFO_FAILURE:-0}" ;;
  ps)
    if [ "\${NEEDS_UP:-0}" = 0 ] || [ -f "$CREATED" ]; then
      printf 'container-123\\n'
    fi
    ;;
  inspect) printf 'bind\\t%s\\t/workspaces/workspace\\n' "$WORKSPACE" ;;
esac`,
    );
  }

  function run(extra: Record<string, string> = {}) {
    return spawnSync("/bin/bash", [script, workspace], {
      cwd: workspace,
      encoding: "utf8",
      env: {
        PATH: bin,
        HOME: home,
        SHELL: shell,
        SYSTEM_BIN: bin,
        SHELL_LOG: join(root, "shell.log"),
        COMMAND_LOG: log,
        WORKSPACE: workspace,
        CREATED: join(root, "created"),
        TEST_OS: "Linux",
        TEST_KERNEL: "test-kernel",
        ...extra,
      },
    });
  }

  function expectConnected(result: ReturnType<typeof run>, directory: string): void {
    expect(result.status, result.stderr).toBe(0);
    const calls = readFileSync(log, "utf8").trim().split("\n");
    expect(calls[0]).toBe(`${directory}/docker\tinfo`);
    expect(calls.some((call) => call.includes("tmux new-session"))).toBe(true);
    expect(calls.every((call) => call.startsWith(`${directory}/docker\t`))).toBe(true);
  }

  it("prefers the explicit directory, including spaces, over PATH and the login shell", () => {
    const explicit = join(root, "explicit docker bin");
    docker(explicit);
    docker(bin);
    expectConnected(run({ SPECDOJO_DOCKER_BIN: explicit }), explicit);
    expect(existsSync(join(root, "shell.log"))).toBe(false);
  });

  it("uses the current PATH before consulting the login shell", () => {
    docker(bin);
    expectConnected(run(), bin);
    expect(existsSync(join(root, "shell.log"))).toBe(false);
  });

  it("accepts a relative PATH directory and exports its absolute path", () => {
    const directory = join(workspace, "relative-bin");
    docker(directory);
    expectConnected(run({ PATH: `relative-bin:${bin}` }), directory);
  });

  it("queries the login shell with -lc and ignores executable paths in startup output", () => {
    const directory = join(root, "login docker bin");
    docker(directory);
    docker(join(root, "noise"));
    docker(candidates[0]!);
    expectConnected(run({ LOGIN_BIN: directory }), directory);
    expect(readFileSync(join(root, "shell.log"), "utf8")).toBe("-lc\n");
  });

  it.each(["an alias description", "/missing/docker"])(
    "rejects login shell output that is not an executable file: %s",
    (output) => {
      executable(shell, `printf '\\n__SPECDOJO_DOCKER__%s\\n' '${output}'`);
      docker(candidates[0]!);
      expectConnected(run(), candidates[0]!);
    },
  );

  it("falls back when the login shell is unavailable", () => {
    docker(candidates[0]!);
    expectConnected(run({ SHELL: join(root, "missing-shell") }), candidates[0]!);
  });

  it.each([0, 1, 2, 3, 4, 5])("finds common directory %i in the specified order", (index) => {
    for (const directory of candidates.slice(index)) docker(directory);
    expectConnected(run(), candidates[index]!);
  });

  it("ignores non-executable candidates", () => {
    docker(candidates[0]!);
    chmodSync(join(candidates[0]!, "docker"), 0o644);
    docker(candidates[1]!);
    expectConnected(run(), candidates[1]!);
  });

  it.each(["missing", "non-executable", "file instead of directory"])(
    "fails for an invalid explicit directory (%s) without silently choosing PATH",
    (kind) => {
      const directory = join(root, "explicit");
      docker(bin);
      if (kind === "non-executable") {
        docker(directory);
        chmodSync(join(directory, "docker"), 0o644);
      } else if (kind === "file instead of directory") {
        docker(directory);
      }
      const value = kind === "file instead of directory" ? join(directory, "docker") : directory;
      const result = run({ SPECDOJO_DOCKER_BIN: value });
      expect(result.status).toBe(1);
      expect(result.stderr).toContain(`Searched SPECDOJO_DOCKER_BIN: ${value}/docker`);
      expect(result.stderr).toContain("Install Docker Engine");
      expect(existsSync(log)).toBe(false);
    },
  );

  const platforms = [
    {
      os: "Darwin",
      kernel: "test",
      name: "macOS",
      missing: "Install Docker Desktop",
      unavailable: "Start Docker Desktop",
    },
    {
      os: "Linux",
      kernel: "test",
      name: "Linux",
      missing: "Install Docker Engine",
      unavailable: "docker service",
    },
    {
      os: "Linux",
      kernel: "5.15-Microsoft-standard-WSL2",
      name: "WSL2",
      missing: "WSL integration",
      unavailable: "WSL integration",
    },
  ];

  it.each(platforms)(
    "reports searched locations and a $name hint when Docker is missing",
    (platform) => {
      const result = run({ TEST_OS: platform.os, TEST_KERNEL: platform.kernel });
      expect(result.status).toBe(1);
      expect(result.stderr).toContain("Docker executable not found");
      expect(result.stderr).toContain(`Searched PATH: ${bin}`);
      expect(result.stderr).toContain(`Queried login shell: ${shell}`);
      for (const directory of candidates) expect(result.stderr).toContain(directory);
      expect(result.stderr).toContain(platform.missing);
      expect(existsSync(log)).toBe(false);
    },
  );

  it.each(platforms)(
    "stops before docker ps and prints a $name hint when docker info fails",
    (platform) => {
      docker(bin);
      const result = run({ TEST_OS: platform.os, TEST_KERNEL: platform.kernel, INFO_FAILURE: "1" });
      expect(result.status).toBe(1);
      expect(result.stderr).toContain("docker info failed");
      expect(result.stderr).toContain(platform.unavailable);
      if (platform.name === "Linux") expect(result.stderr).toContain("docker group");
      expect(readFileSync(log, "utf8")).toBe(`${bin}/docker\tinfo\n`);
    },
  );

  it("detects WSL from /proc/version even when uname -r does not identify Microsoft", () => {
    writeFileSync(join(root, "proc-version"), "Linux version Microsoft WSL2");
    const result = run();
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("WSL2");
    expect(result.stderr).toContain("WSL integration");
  });

  it.each(["node-bin", "login-shell"])(
    "preserves the discovered Docker PATH for devcontainer up via %s",
    (mode) => {
      const directory = join(root, "docker-bin");
      const nodeBin = join(root, "node-bin");
      docker(directory);
      mkdirSync(nodeBin);
      executable(join(nodeBin, "docker"), "exit 91");
      executable(join(nodeBin, "devcontainer"), 'docker info || exit 92; : >"$CREATED"');
      const result = run({
        LOGIN_BIN: directory,
        NODE_BIN: nodeBin,
        NEEDS_UP: "1",
        ...(mode === "node-bin" ? { SPECDOJO_NODE_BIN: nodeBin } : {}),
      });
      expectConnected(result, directory);
      expect(existsSync(join(root, "created"))).toBe(true);
    },
  );
});
