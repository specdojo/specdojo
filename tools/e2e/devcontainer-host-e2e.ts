/**
 * Host-side E2E check for the Dev Container scaffold produced by `specdojo init`.
 *
 * This intentionally stays outside Vitest: it builds a real npm tarball, creates a real
 * Dev Container, and downloads the tools selected by the recommended preset.
 *
 * Usage:
 *   node --import tsx tools/e2e/devcontainer-host-e2e.ts
 *   node --import tsx tools/e2e/devcontainer-host-e2e.ts --keep
 */
import { spawnSync, type SpawnSyncReturns } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const MAX_BUFFER = 100 * 1024 * 1024;

type CommandResult = SpawnSyncReturns<string>;

function command(command: string, args: string[], cwd?: string): CommandResult {
  return spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: process.env,
    maxBuffer: MAX_BUFFER,
  });
}

function detail(result: CommandResult): string {
  return `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
}

function run(commandName: string, args: string[], cwd?: string): string {
  const result = command(commandName, args, cwd);
  if (result.error || result.status !== 0) {
    const message = result.error?.message ?? (detail(result) || `exit code ${result.status}`);
    throw new Error(`${commandName} ${args.join(" ")} failed: ${message}`);
  }
  return result.stdout;
}

function prerequisite(name: string, args: string[]): boolean {
  const result = command(name, args);
  if (!result.error && result.status === 0) {
    process.stdout.write(`[PASS] prerequisite: ${name}\n`);
    return true;
  }
  process.stderr.write(`[FAIL] prerequisite: ${name} (${detail(result) || "not found"})\n`);
  return false;
}

function printPrerequisiteHelp(): void {
  process.stderr.write(
    [
      "Host prerequisites are not ready. Verify them with:",
      "  docker --version",
      "  docker info",
      "  devcontainer --version",
      "  node --version",
      "  npm --version",
      "  git --version",
      "Install the Dev Container CLI, if needed:",
      "  npm install --global @devcontainers/cli",
      "",
    ].join("\n"),
  );
}

function parsePackFilename(output: string): string {
  const parsed = JSON.parse(output) as Array<{ filename?: unknown }>;
  const filename = parsed[0]?.filename;
  if (typeof filename !== "string" || filename === "") {
    throw new Error(`npm pack did not report a tarball filename: ${output}`);
  }
  return filename;
}

function parseContainerId(output: string): string {
  for (const line of output.trim().split(/\r?\n/).reverse()) {
    try {
      const parsed = JSON.parse(line) as { containerId?: unknown; outcome?: unknown };
      if (parsed.outcome === "success" && typeof parsed.containerId === "string") {
        return parsed.containerId;
      }
    } catch {
      // Progress lines are not necessarily JSON. Continue until the final result is found.
    }
  }
  const match = output.match(/"containerId"\s*:\s*"([a-f0-9]+)"/i);
  if (match?.[1]) return match[1];
  throw new Error(`devcontainer up succeeded but did not report a container ID: ${output}`);
}

function volumeNames(repo: string): string[] {
  const config = JSON.parse(
    readFileSync(join(repo, ".devcontainer", "devcontainer.json"), "utf8"),
  ) as { mounts?: unknown };
  if (!Array.isArray(config.mounts)) return [];
  return config.mounts.flatMap((mount) => {
    if (typeof mount !== "string") return [];
    const source = mount
      .split(",")
      .find((part) => part.startsWith("source="))
      ?.slice("source=".length);
    return source ? [source] : [];
  });
}

function imageIds(): Set<string> {
  return new Set(
    run("docker", ["image", "ls", "--quiet", "--no-trunc"]).split(/\r?\n/).filter(Boolean),
  );
}

function imageIdsForRepo(repo: string): string[] {
  const result = command("docker", [
    "image",
    "ls",
    "--quiet",
    "--no-trunc",
    "--filter",
    `label=devcontainer.local_folder=${repo}`,
  ]);
  return result.status === 0 ? result.stdout.split(/\r?\n/).filter(Boolean) : [];
}

function containerImageId(containerId: string): string | undefined {
  const result = command("docker", ["inspect", "--format", "{{.Image}}", containerId]);
  return result.status === 0 ? result.stdout.trim() || undefined : undefined;
}

function checkInContainer(repo: string, label: string, script: string): boolean {
  const result = command("devcontainer", [
    "exec",
    "--workspace-folder",
    repo,
    "bash",
    "-lc",
    script,
  ]);
  if (!result.error && result.status === 0) {
    const output = result.stdout.trim();
    process.stdout.write(`[PASS] ${label}${output ? `: ${output}` : ""}\n`);
    return true;
  }
  process.stderr.write(`[FAIL] ${label}: ${detail(result) || `exit code ${result.status}`}\n`);
  return false;
}

function removeDockerResource(kind: "container" | "volume", id: string): boolean {
  const args =
    kind === "container" ? ["container", "rm", "--force", id] : ["volume", "rm", "--force", id];
  const result = command("docker", args);
  if (result.status === 0) {
    process.stdout.write(`[PASS] cleanup ${kind}: ${id}\n`);
    return true;
  }
  process.stderr.write(`[FAIL] cleanup ${kind}: ${id}: ${detail(result)}\n`);
  return false;
}

function removeDockerImages(ids: string[]): boolean {
  if (ids.length === 0) return true;
  const result = command("docker", ["image", "rm", "--force", ...ids]);
  if (result.status === 0) {
    for (const id of ids) process.stdout.write(`[PASS] cleanup image: ${id}\n`);
    return true;
  }
  process.stderr.write(`[FAIL] cleanup images: ${detail(result)}\n`);
  return false;
}

function usage(): void {
  process.stdout.write(
    "Usage: node --import tsx tools/e2e/devcontainer-host-e2e.ts [--keep]\n" +
      "  --keep  Preserve the temporary project and its Docker resources for inspection.\n",
  );
}

function main(): void {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    usage();
    return;
  }
  const unknown = args.filter((arg) => arg !== "--keep");
  if (unknown.length > 0) throw new Error(`Unknown option: ${unknown.join(", ")}`);
  const keep = args.includes("--keep");

  const prerequisites = [
    prerequisite("docker", ["--version"]),
    prerequisite("docker", ["info"]),
    prerequisite("devcontainer", ["--version"]),
    prerequisite("node", ["--version"]),
    prerequisite("npm", ["--version"]),
    prerequisite("git", ["--version"]),
  ];
  if (prerequisites.includes(false)) {
    printPrerequisiteHelp();
    process.exitCode = 1;
    return;
  }

  const imagesBefore = imageIds();
  const root = mkdtempSync(join(tmpdir(), "specdojo-devcontainer-e2e-"));
  // The repository basename becomes the Docker volume prefix, so keep it unique as well.
  const repo = join(root, basename(root));
  const packageInstall = join(root, "package-install");
  const packDir = join(root, "pack");
  let containerId: string | undefined;
  let containerImage: string | undefined;
  let volumes: string[] = [];
  let failed = false;

  mkdirSync(repo);
  mkdirSync(packageInstall);
  mkdirSync(packDir);
  process.stdout.write(`Temporary project: ${repo}\n`);

  try {
    run("npm", ["run", "build"], projectRoot);
    const packOutput = run(
      "npm",
      ["pack", "--ignore-scripts", "--json", "--pack-destination", packDir],
      projectRoot,
    );
    const tarball = join(packDir, parsePackFilename(packOutput));
    if (!existsSync(tarball)) throw new Error(`npm pack output was not created: ${tarball}`);
    process.stdout.write(`[PASS] local SpecDojo tarball: ${tarball}\n`);

    writeFileSync(
      join(packageInstall, "package.json"),
      `${JSON.stringify({ private: true }, null, 2)}\n`,
      "utf8",
    );
    run("npm", ["install", "--no-save", tarball], packageInstall);
    const cli = join(packageInstall, "node_modules", "specdojo", "dist", "specdojo.js");
    if (!existsSync(cli)) throw new Error(`installed SpecDojo CLI was not found: ${cli}`);

    run("git", ["init", "--quiet"], repo);
    writeFileSync(
      join(repo, "package.json"),
      `${JSON.stringify({ name: "specdojo-devcontainer-e2e", private: true }, null, 2)}\n`,
      "utf8",
    );
    run("node", [cli, "init", "--yes", "--provider", "claude", "--devcontainer"], repo);
    const scaffoldVolumes = volumeNames(repo);
    const volumeCollisions = scaffoldVolumes.filter(
      (volume) => command("docker", ["volume", "inspect", volume]).status === 0,
    );
    if (volumeCollisions.length > 0) {
      throw new Error(`refusing to reuse existing Docker volumes: ${volumeCollisions.join(", ")}`);
    }
    volumes = scaffoldVolumes;
    process.stdout.write(`[PASS] specdojo init --yes --provider claude --devcontainer\n`);

    const upResult = command("devcontainer", ["up", "--workspace-folder", repo]);
    process.stdout.write(upResult.stdout);
    process.stderr.write(upResult.stderr);
    if (upResult.error || upResult.status !== 0) {
      throw new Error(`devcontainer up failed: ${upResult.error?.message ?? detail(upResult)}`);
    }
    containerId = parseContainerId(upResult.stdout);
    containerImage = containerImageId(containerId);
    process.stdout.write(`[PASS] devcontainer up: ${containerId}\n`);

    const checks = [
      checkInContainer(repo, "remote user is node", 'test "$(id -un)" = node && id -un'),
      checkInContainer(
        repo,
        "~/.local/bin is owned by node",
        'test "$(stat -c %U "$HOME/.local/bin")" = node && stat -c "%U %n" "$HOME/.local/bin"',
      ),
      checkInContainer(repo, "tmux is installed", "command -v tmux"),
      checkInContainer(repo, "Vim is installed", "command -v vim"),
      checkInContainer(repo, "Emacs is installed", "command -v emacs"),
      checkInContainer(
        repo,
        "Claude Code is installed in ~/.local/bin",
        'test -x "$HOME/.local/bin/claude" && printf "%s\\n" "$HOME/.local/bin/claude"',
      ),
      checkInContainer(
        repo,
        "Claude Code is reachable on PATH in login shell",
        'test "$(command -v claude)" = "$HOME/.local/bin/claude" && command -v claude',
      ),
      checkInContainer(
        repo,
        "Docker CLI is not installed in the development container",
        "! command -v docker >/dev/null 2>&1",
      ),
    ];
    failed = checks.includes(false);
  } catch (error) {
    failed = true;
    process.stderr.write(
      `[FAIL] E2E setup: ${error instanceof Error ? error.message : String(error)}\n`,
    );
  } finally {
    if (keep) {
      process.stdout.write(
        `[KEEP] Temporary project and Docker resources were preserved: ${root}\n` +
          (containerId ? `  container: ${containerId}\n` : "") +
          (volumes.length > 0 ? `  volumes: ${volumes.join(", ")}\n` : "") +
          (containerImage ? `  image: ${containerImage}\n` : "") +
          "Remove them manually after inspection.\n",
      );
    } else {
      const containerIds: string[] = [];
      if (containerId) containerIds.push(containerId);
      else {
        const discovered = command("docker", [
          "ps",
          "--all",
          "--quiet",
          "--filter",
          `label=devcontainer.local_folder=${repo}`,
        ]);
        containerIds.push(...discovered.stdout.split(/\r?\n/).filter(Boolean));
      }
      const relatedImages = new Set(imageIdsForRepo(repo));
      if (containerImage) relatedImages.add(containerImage);
      for (const id of containerIds) {
        const image = containerImageId(id);
        if (image) relatedImages.add(image);
      }
      for (const id of containerIds) {
        failed = !removeDockerResource("container", id) || failed;
      }
      for (const volume of volumes) {
        const inspect = command("docker", ["volume", "inspect", volume]);
        if (inspect.status === 0) failed = !removeDockerResource("volume", volume) || failed;
      }
      const newImages = [...relatedImages].filter((id) => !imagesBefore.has(id));
      const orderedImages =
        containerImage && newImages.includes(containerImage)
          ? [containerImage, ...newImages.filter((id) => id !== containerImage)]
          : newImages;
      failed = !removeDockerImages(orderedImages) || failed;
      rmSync(root, { recursive: true, force: true });
      process.stdout.write(`[PASS] cleanup temporary directory: ${root}\n`);
    }
  }

  if (failed) {
    process.stderr.write("Dev Container host E2E: FAIL\n");
    process.exitCode = 1;
  } else {
    process.stdout.write("Dev Container host E2E: PASS\n");
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(
    `Dev Container host E2E: FAIL\n${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
}
