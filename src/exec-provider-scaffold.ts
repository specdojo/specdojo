import { existsSync } from "node:fs";
import { copyFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";

export { specdojoPackageRootDir } from "./package-paths.js";

// config scaffold --provider <name> と互換入口 exec scaffold --provider <name> の実体。
// npm package 内の templates/<provider>/ を配布原本として、利用リポジトリへコピーする。
// 配置規則は provider 名から機械的に決まり、provider ごとの分岐を持たない。
//   templates/<provider>/agents/**        -> .<provider>/agents/**   （--agent の自動発見位置）
//   templates/<provider>/README.md        -> コピーしない（配布原本の説明書）
//   templates/<provider>/ 配下のその他    -> .specdojo/<provider>/** （--settings 等で明示参照）

export interface ProviderScaffoldEntry {
  sourcePath: string;
  destinationPath: string;
  // repo ルート相対の表示用パス（POSIX 区切り）
  destinationRelPath: string;
}

export interface ProviderScaffoldPlan {
  provider: string;
  entries: ProviderScaffoldEntry[];
}

export interface ProviderScaffoldOutcome {
  entry: ProviderScaffoldEntry;
  written: boolean;
}

export interface RunProviderScaffoldOptions {
  packageRoot: string;
  repoRoot: string;
  force: boolean;
  dryRun: boolean;
}

export async function listProviderTemplates(packageRoot: string): Promise<string[]> {
  const templatesDir = path.join(packageRoot, "templates");
  if (!existsSync(templatesDir)) return [];
  const entries = await readdir(templatesDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

async function collectFilesRecursively(rootDir: string, relDir = ""): Promise<string[]> {
  const entries = await readdir(path.join(rootDir, relDir), { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const relPath = relDir ? path.join(relDir, entry.name) : entry.name;
    if (entry.isDirectory()) {
      files.push(...(await collectFilesRecursively(rootDir, relPath)));
    } else if (entry.isFile()) {
      files.push(relPath);
    }
  }
  return files;
}

function toPosix(relPath: string): string {
  return relPath.split(path.sep).join("/");
}

export async function buildProviderScaffoldPlan(opts: {
  packageRoot: string;
  repoRoot: string;
  provider: string;
}): Promise<ProviderScaffoldPlan> {
  const { packageRoot, repoRoot, provider } = opts;

  const templateDir = path.join(packageRoot, "templates", provider);
  if (!existsSync(templateDir)) {
    const available = await listProviderTemplates(packageRoot);
    const availableLabel = available.length > 0 ? available.join(", ") : "(none)";
    throw new Error(
      `Unknown provider template: ${provider}. Available: ${availableLabel} (looked in ${path.join(packageRoot, "templates")})`,
    );
  }

  const relFiles = (await collectFilesRecursively(templateDir)).map(toPosix).sort();
  const entries: ProviderScaffoldEntry[] = [];
  for (const relFile of relFiles) {
    // 配布原本の説明書は利用リポジトリへコピーしない。
    if (relFile === "README.md") continue;

    const destinationRelPath = relFile.startsWith("agents/")
      ? `.${provider}/${relFile}`
      : `.specdojo/${provider}/${relFile}`;
    entries.push({
      sourcePath: path.join(templateDir, ...relFile.split("/")),
      destinationPath: path.join(repoRoot, ...destinationRelPath.split("/")),
      destinationRelPath,
    });
  }

  return { provider, entries };
}

export async function applyProviderScaffoldPlan(
  plan: ProviderScaffoldPlan,
  opts: { force: boolean },
): Promise<ProviderScaffoldOutcome[]> {
  const outcomes: ProviderScaffoldOutcome[] = [];
  for (const entry of plan.entries) {
    if (existsSync(entry.destinationPath) && !opts.force) {
      outcomes.push({ entry, written: false });
      continue;
    }
    await mkdir(path.dirname(entry.destinationPath), { recursive: true });
    await copyFile(entry.sourcePath, entry.destinationPath);
    outcomes.push({ entry, written: true });
  }
  return outcomes;
}

/**
 * config scaffold と従来の exec scaffold で共有する provider 設定の配置処理。
 * package root と利用リポジトリ root は呼び出し側で解決し、このモジュールはコピーと
 * 利用者向け出力だけを担う。
 */
export async function runProviderScaffold(
  provider: string,
  opts: RunProviderScaffoldOptions,
): Promise<void> {
  const plan = await buildProviderScaffoldPlan({
    packageRoot: opts.packageRoot,
    repoRoot: opts.repoRoot,
    provider,
  });

  if (opts.dryRun) {
    for (const entry of plan.entries) {
      process.stdout.write(`[dry-run] would write: ${entry.destinationRelPath}\n`);
    }
    return;
  }

  const outcomes = await applyProviderScaffoldPlan(plan, { force: opts.force });
  for (const { entry, written } of outcomes) {
    if (written) {
      process.stdout.write(`Written: ${entry.destinationRelPath}\n`);
    } else {
      process.stdout.write(`Skipped (already exists): ${entry.destinationRelPath}\n`);
    }
  }
  process.stdout.write(
    "Next steps:\n" +
      "  1. Commit the scaffolded files (worktree runs read committed content).\n" +
      `  2. Define providers.${provider}.command_template in .specdojo/exec-defaults.yaml (see templates/${provider}/README.md).\n`,
  );
}
