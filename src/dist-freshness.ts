import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

/**
 * dist（bin の実体）と src の鮮度差を判定する。
 *
 * `specdojo` の bin は `dist/specdojo.js` を指すため、開発チェックアウトで
 * `npm run build` を忘れると古い挙動のまま CLI が動き、設定済みの検証が沈黙して
 * 省略される。配布パッケージには `src` が含まれないため、判定は `src` が存在する
 * 開発チェックアウトでのみ有効になり、それ以外では no-op になる。
 */
export type DistFreshnessStatus =
  | "not-dist-entry"
  | "no-source-tree"
  | "no-dist-output"
  | "up-to-date"
  | "stale";

export type DistFreshnessResult = {
  status: DistFreshnessStatus;
  packageRoot?: string;
  newestSourcePath?: string;
  newestDistPath?: string;
};

export type DistFreshnessDecision =
  | { action: "none" }
  | { action: "warn"; message: string }
  | { action: "block"; message: string };

const SKIP_ENV_NAME = "SPECDOJO_SKIP_DIST_FRESHNESS_CHECK";
const SKIP_ENV_VALUES = new Set(["1", "true", "yes"]);
const IGNORED_DIRECTORY_NAMES = new Set(["node_modules", ".git"]);

/** 検証の沈黙した省略を避けるため、exec 系だけは警告ではなく中断する。 */
const BLOCKING_COMMANDS = new Set(["exec"]);

type NewestFile = {
  filePath: string;
  mtimeMs: number;
};

function findNewestFile(rootDir: string, extension: string): NewestFile | undefined {
  if (!existsSync(rootDir)) return undefined;
  let newest: NewestFile | undefined;
  const pending: string[] = [rootDir];
  while (pending.length > 0) {
    const currentDir = pending.pop();
    if (!currentDir) break;
    const entries = readdirSync(currentDir, { withFileTypes: true }).sort((left, right) =>
      left.name.localeCompare(right.name),
    );
    for (const entry of entries) {
      const entryPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (IGNORED_DIRECTORY_NAMES.has(entry.name)) continue;
        pending.push(entryPath);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(extension)) continue;
      const mtimeMs = statSync(entryPath).mtimeMs;
      if (!newest || mtimeMs > newest.mtimeMs) {
        newest = { filePath: entryPath, mtimeMs };
      }
    }
  }
  return newest;
}

/** パッケージルート配下の `src`（.ts）と `dist`（.js）の最終更新時刻を比較する。 */
export function inspectBuildFreshness(packageRoot: string): DistFreshnessResult {
  const sourceDir = path.join(packageRoot, "src");
  const newestSource = findNewestFile(sourceDir, ".ts");
  if (!newestSource) return { status: "no-source-tree", packageRoot };

  const newestDist = findNewestFile(path.join(packageRoot, "dist"), ".js");
  if (!newestDist) {
    return { status: "no-dist-output", packageRoot, newestSourcePath: newestSource.filePath };
  }

  return {
    status: newestSource.mtimeMs > newestDist.mtimeMs ? "stale" : "up-to-date",
    packageRoot,
    newestSourcePath: newestSource.filePath,
    newestDistPath: newestDist.filePath,
  };
}

/**
 * 実行中のエントリスクリプトが `dist/` 配下の .js の場合のみ鮮度を判定する。
 * tsx などで `src/*.ts` を直接実行している場合は判定対象外になる。
 */
export function inspectDistEntryFreshness(entryPath: string): DistFreshnessResult {
  if (!entryPath.endsWith(".js")) return { status: "not-dist-entry" };
  const distDir = path.dirname(entryPath);
  if (path.basename(distDir) !== "dist") return { status: "not-dist-entry" };
  return inspectBuildFreshness(path.dirname(distDir));
}

/** `node dist/specdojo.js exec run ...` の `exec` のように、最初のサブコマンド名を取り出す。 */
export function resolveInvokedCommand(argv: readonly string[]): string | undefined {
  return argv.slice(2).find((arg) => !arg.startsWith("-"));
}

function toDisplayPath(packageRoot: string | undefined, filePath: string | undefined): string {
  if (!filePath) return "unknown";
  if (!packageRoot) return filePath;
  return path.relative(packageRoot, filePath) || filePath;
}

function buildMessage(result: DistFreshnessResult, isBlocking: boolean): string {
  const detail =
    result.status === "no-dist-output"
      ? "dist/ が存在しない"
      : `src が dist より新しい (src: ${toDisplayPath(result.packageRoot, result.newestSourcePath)}, dist: ${toDisplayPath(result.packageRoot, result.newestDistPath)})`;
  const head = isBlocking
    ? `specdojo: 中断: dist ビルドが古い: ${detail}`
    : `specdojo: 警告: dist ビルドが古い: ${detail}`;
  const remediation = isBlocking
    ? "`npm run build` を実行してから再試行してください"
    : "`npm run build` を実行して dist を更新してください";
  return `${head}。${remediation}（この検査を無効化する場合は ${SKIP_ENV_NAME}=1）。`;
}

/** 鮮度判定とサブコマンドから、無視 / 警告 / 中断を決める。 */
export function evaluateDistFreshness(
  result: DistFreshnessResult,
  argv: readonly string[],
  env: NodeJS.ProcessEnv,
): DistFreshnessDecision {
  if (result.status !== "stale" && result.status !== "no-dist-output") return { action: "none" };
  const skipValue = env[SKIP_ENV_NAME]?.trim().toLowerCase();
  if (skipValue && SKIP_ENV_VALUES.has(skipValue)) return { action: "none" };

  const command = resolveInvokedCommand(argv);
  const isBlocking = command !== undefined && BLOCKING_COMMANDS.has(command);
  return isBlocking
    ? { action: "block", message: buildMessage(result, true) }
    : { action: "warn", message: buildMessage(result, false) };
}

export type BuildRunResult = {
  status: number | null;
  error?: string;
};

export type BuildRunner = (packageRoot: string) => BuildRunResult;

export type EnsureFreshDistOutcome =
  | "not-applicable"
  | "up-to-date"
  | "rebuilt"
  | "rebuild-skipped"
  | "rebuild-failed";

export type EnsureFreshDistResult = {
  outcome: EnsureFreshDistOutcome;
  message?: string;
};

function spawnNpmBuild(packageRoot: string): BuildRunResult {
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(npmCommand, ["run", "build"], {
    cwd: packageRoot,
    stdio: "inherit",
    shell: false,
  });
  return { status: result.status, error: result.error?.message };
}

/**
 * dist が古い場合に `npm run build` を実行して最新化する。
 * 子プロセスとして bin を起動する自動実行経路（routine など）から呼び出し、
 * 古い dist のまま子プロセスが動くことを防ぐ。
 */
export function ensureFreshDistBuild(
  packageRoot: string,
  runBuild: BuildRunner = spawnNpmBuild,
): EnsureFreshDistResult {
  const freshness = inspectBuildFreshness(packageRoot);
  if (freshness.status === "no-source-tree") return { outcome: "not-applicable" };
  if (freshness.status === "up-to-date") return { outcome: "up-to-date" };
  if (!existsSync(path.join(packageRoot, "node_modules", "typescript"))) {
    return {
      outcome: "rebuild-skipped",
      message:
        "dist ビルドが古いが、typescript が未インストールのため再ビルドをスキップした（npm install を実行する）",
    };
  }

  const detail =
    freshness.status === "no-dist-output"
      ? "dist/ が存在しない"
      : `src が dist より新しい (src: ${toDisplayPath(packageRoot, freshness.newestSourcePath)})`;
  const result = runBuild(packageRoot);
  if (result.error) {
    return { outcome: "rebuild-failed", message: `再ビルドを起動できなかった: ${result.error}` };
  }
  if (result.status !== 0) {
    return {
      outcome: "rebuild-failed",
      message: `再ビルドが失敗した（終了コード ${result.status ?? "unknown"}）。npm run build を手動で実行する`,
    };
  }
  return { outcome: "rebuilt", message: `${detail}ため dist を再ビルドした` };
}

/** 実行中のエントリが dist 配下の場合のみ、そのパッケージルートを最新化する。 */
export function ensureFreshDistBuildForEntry(
  entryPath: string,
  runBuild: BuildRunner = spawnNpmBuild,
): EnsureFreshDistResult {
  const freshness = inspectDistEntryFreshness(entryPath);
  if (freshness.status === "not-dist-entry" || !freshness.packageRoot) {
    return { outcome: "not-applicable" };
  }
  return ensureFreshDistBuild(freshness.packageRoot, runBuild);
}
