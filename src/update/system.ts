import { execFile, spawn } from "node:child_process";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import type { InstallCommand } from "./package-manager.js";
import type { PackageSource } from "./run.js";

// specdojo update が実際に外へ出る処理（npm への問い合わせ、tar、package manager の実行）。
// 単体テストでは run.ts の deps で差し替える。

const execFileAsync = promisify(execFile);
const useShell = process.platform === "win32";

function errorMessage(error: unknown): string {
  if (error && typeof error === "object" && "stderr" in error) {
    const stderr = String(error.stderr).trim();
    if (stderr !== "") return stderr;
  }
  return error instanceof Error ? error.message : String(error);
}

/** `npm view <name>@<spec> version --json` の版。範囲のときは最も新しい版を返す。 */
export async function resolveRegistryVersion(name: string, spec: string): Promise<string> {
  let stdout: string;
  try {
    ({ stdout } = await execFileAsync("npm", ["view", `${name}@${spec}`, "version", "--json"], {
      encoding: "utf8",
      shell: useShell,
    }));
  } catch (error) {
    throw new Error(`npm view ${name}@${spec} failed: ${errorMessage(error)}`, { cause: error });
  }
  const parsed: unknown = JSON.parse(stdout.trim() === "" ? "null" : stdout);
  const version = Array.isArray(parsed) ? parsed.at(-1) : parsed;
  if (typeof version !== "string" || version === "") {
    throw new Error(`npm view ${name}@${spec} returned no version`);
  }
  return version;
}

export async function readTarballVersion(tarballPath: string): Promise<string> {
  let stdout: string;
  try {
    ({ stdout } = await execFileAsync("tar", ["-xzOf", tarballPath, "package/package.json"], {
      encoding: "utf8",
    }));
  } catch (error) {
    throw new Error(
      `Cannot read package/package.json from ${tarballPath}: ${errorMessage(error)}`,
      {
        cause: error,
      },
    );
  }
  const parsed: unknown = JSON.parse(stdout);
  if (
    typeof parsed === "object" &&
    parsed !== null &&
    "version" in parsed &&
    typeof parsed.version === "string"
  ) {
    return parsed.version;
  }
  throw new Error(`package/package.json in ${tarballPath} has no version`);
}

async function extractTarball(tarballPath: string, destinationDir: string): Promise<string> {
  try {
    await execFileAsync("tar", ["-xzf", tarballPath, "-C", destinationDir]);
  } catch (error) {
    throw new Error(`Cannot extract ${tarballPath}: ${errorMessage(error)}`, { cause: error });
  }
  return path.join(destinationDir, "package");
}

/** tarball はそのまま、npm の版は `npm pack` で一時ディレクトリへ落として展開する。 */
export async function materializePackage(
  source: PackageSource,
  destinationDir: string,
): Promise<string> {
  if (source.tarballPath) return extractTarball(source.tarballPath, destinationDir);
  try {
    await execFileAsync(
      "npm",
      [
        "pack",
        `${source.name}@${source.version}`,
        "--pack-destination",
        destinationDir,
        "--silent",
      ],
      { cwd: destinationDir, encoding: "utf8", shell: useShell },
    );
  } catch (error) {
    throw new Error(`npm pack ${source.name}@${source.version} failed: ${errorMessage(error)}`, {
      cause: error,
    });
  }
  const tarballs = (await readdir(destinationDir)).filter((name) => name.endsWith(".tgz")).sort();
  if (tarballs.length === 0) {
    throw new Error(`npm pack ${source.name}@${source.version} produced no tarball`);
  }
  return extractTarball(path.join(destinationDir, tarballs[0]), destinationDir);
}

export function runCommand(command: InstallCommand, cwd: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(command.command, command.args, { cwd, stdio: "inherit", shell: useShell });
    child.on("error", (error) => {
      reject(new Error(`Cannot start ${command.command}: ${error.message}`, { cause: error }));
    });
    child.on("close", (code) => resolve(code ?? 1));
  });
}
