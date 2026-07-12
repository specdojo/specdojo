import { existsSync } from "node:fs";
import { copyFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// exec scaffold --provider <name> の実体。
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

// 配布原本はインストール済み package のルートから解決する。このモジュールは
// 開発時は src/、配布時は dist/ 直下にあり、どちらも package ルートの 1 階層下。
export function specdojoPackageRootDir(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
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
