import { existsSync } from "node:fs";
import { copyFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { isRecord } from "./exec-shared.js";

export { specdojoPackageRootDir } from "./package-paths.js";

export const ORCHESTRATOR_NPM_SCRIPTS: Record<string, Record<string, string>> = {
  claude: {
    "orch:opus": "claude --agent specdojo-orchestrator --model opus",
    "orch:sonnet": "claude --agent specdojo-orchestrator --model sonnet",
  },
  codex: {
    "orch:codex": 'codex "$(cat .specdojo/codex/orchestrator.md)"',
  },
  antigravity: {
    "orch:agy": 'agy --add-dir "$(pwd)" -i "$(cat .specdojo/antigravity/orchestrator.md)"',
  },
  opencode: {
    "orch:opencode": "opencode --agent specdojo-orchestrator",
  },
};

// config scaffold --provider <name> と互換入口 exec scaffold --provider <name> の実体。
// npm package 内の templates/<provider>/ を配布原本として、利用リポジトリへコピーする。
// repository 内の配置規則は provider 名から機械的に決まる。
//   templates/<provider>/agents/**        -> .<provider>/agents/**   （--agent の自動発見位置）
//   templates/<provider>/README.md        -> コピーしない（配布原本の説明書）
//   templates/<provider>/ 配下のその他    -> .specdojo/<provider>/** （--settings 等で明示参照）
// ユーザーディレクトリ設定は PROVIDER_GLOBAL_SETTINGS で明示し、--global 時だけマージする。

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
  global?: boolean;
  /** テストでは実ユーザーのホームへ触れないよう一時ディレクトリを注入する。 */
  homeDir?: string;
}

interface ProviderGlobalSettingsDefinition {
  templateRelPath: string;
  destinationSegments: string[];
}

const PROVIDER_GLOBAL_SETTINGS: Readonly<Record<string, ProviderGlobalSettingsDefinition>> = {
  antigravity: {
    templateRelPath: "settings.global.json",
    destinationSegments: [".gemini", "antigravity-cli", "settings.json"],
  },
};

type PermissionListName = "allow" | "deny" | "ask";

interface PermissionAdditions {
  allow: string[];
  deny: string[];
  ask: string[];
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
    // 配布原本の説明書と、明示的な --global でだけ利用するユーザー設定は
    // repository 内へコピーしない。
    if (
      relFile === "README.md" ||
      relFile === PROVIDER_GLOBAL_SETTINGS[provider]?.templateRelPath
    ) {
      continue;
    }

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

function parseJsonObject(content: string, sourcePath: string): Record<string, unknown> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON in ${sourcePath}: ${message}`);
  }
  if (!isRecord(parsed)) {
    throw new Error(`Invalid JSON in ${sourcePath}: top-level value must be an object`);
  }
  return parsed;
}

function permissionList(
  permissions: Record<string, unknown>,
  name: PermissionListName,
  sourcePath: string,
): string[] {
  const value = permissions[name];
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string")) {
    throw new Error(`Invalid ${sourcePath}: permissions.${name} must be an array of strings`);
  }
  return value as string[];
}

function mergePermissionSettings(
  current: Record<string, unknown>,
  required: Record<string, unknown>,
  currentPath: string,
  templatePath: string,
): { merged: Record<string, unknown>; additions: PermissionAdditions } {
  const currentPermissionsValue = current.permissions;
  if (currentPermissionsValue !== undefined && !isRecord(currentPermissionsValue)) {
    throw new Error(`Invalid ${currentPath}: permissions must be an object`);
  }
  if (!isRecord(required.permissions)) {
    throw new Error(`Invalid ${templatePath}: permissions must be an object`);
  }

  const currentPermissions = isRecord(currentPermissionsValue) ? currentPermissionsValue : {};
  const mergedPermissions: Record<string, unknown> = { ...currentPermissions };
  const additions: PermissionAdditions = { allow: [], deny: [], ask: [] };

  for (const name of ["allow", "deny", "ask"] as const) {
    const existing = permissionList(currentPermissions, name, currentPath);
    const requiredItems = permissionList(required.permissions, name, templatePath);
    const existingSet = new Set(existing);
    additions[name] = requiredItems.filter((item) => !existingSet.has(item));
    if (existing.length > 0 || requiredItems.length > 0) {
      mergedPermissions[name] = [...existing, ...additions[name]];
    }
  }

  return {
    merged: { ...current, permissions: mergedPermissions },
    additions,
  };
}

function hasPermissionAdditions(additions: PermissionAdditions): boolean {
  return additions.allow.length + additions.deny.length + additions.ask.length > 0;
}

function displayHomePath(segments: readonly string[]): string {
  return `~/${segments.join("/")}`;
}

function printGlobalSettingsDiff(
  displayPath: string,
  additions: PermissionAdditions,
  dryRun: boolean,
): void {
  const prefix = dryRun ? "[dry-run] " : "";
  process.stdout.write(`${prefix}global settings diff: ${displayPath}\n`);
  process.stdout.write(`--- ${displayPath} (current)\n`);
  process.stdout.write(`+++ ${displayPath} (merged)\n`);
  for (const name of ["allow", "deny", "ask"] as const) {
    if (additions[name].length === 0) continue;
    process.stdout.write(`@@ permissions.${name} @@\n`);
    for (const rule of additions[name]) process.stdout.write(`+ ${JSON.stringify(rule)}\n`);
  }
}

async function nextBackupPath(settingsPath: string): Promise<string> {
  const stamp = new Date().toISOString().replace(/[-:.]/g, "");
  const base = `${settingsPath}.backup-${stamp}`;
  let candidate = base;
  let suffix = 1;
  while (existsSync(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

/**
 * provider のユーザーディレクトリ設定へ、テンプレートの permission rule だけを追記する。
 * 既存キー・既存配列要素は保持し、実書き込み前には必ず元ファイルをバックアップする。
 */
export async function mergeProviderGlobalSettings(
  provider: string,
  opts: Pick<RunProviderScaffoldOptions, "packageRoot" | "dryRun" | "homeDir">,
): Promise<void> {
  const definition = PROVIDER_GLOBAL_SETTINGS[provider];
  if (!definition) {
    throw new Error(`Provider ${provider} does not define global settings for --global`);
  }

  const templatePath = path.join(
    opts.packageRoot,
    "templates",
    provider,
    ...definition.templateRelPath.split("/"),
  );
  const settingsPath = path.join(opts.homeDir ?? homedir(), ...definition.destinationSegments);
  const displayPath = displayHomePath(definition.destinationSegments);
  const required = parseJsonObject(await readFile(templatePath, "utf8"), templatePath);
  const currentContent = existsSync(settingsPath) ? await readFile(settingsPath, "utf8") : "{}\n";
  const current = parseJsonObject(currentContent, settingsPath);
  const { merged, additions } = mergePermissionSettings(
    current,
    required,
    settingsPath,
    templatePath,
  );

  if (!hasPermissionAdditions(additions)) {
    process.stdout.write(`Global settings unchanged: ${displayPath}\n`);
    return;
  }

  printGlobalSettingsDiff(displayPath, additions, opts.dryRun);
  if (opts.dryRun) return;

  await mkdir(path.dirname(settingsPath), { recursive: true });
  if (existsSync(settingsPath)) {
    const backupPath = await nextBackupPath(settingsPath);
    await copyFile(settingsPath, backupPath);
    process.stdout.write(
      `Backup: ${displayHomePath([...definition.destinationSegments])}${backupPath.slice(settingsPath.length)}\n`,
    );
  }
  await writeFile(
    settingsPath,
    `${JSON.stringify(merged, null, detectIndent(currentContent))}\n`,
    "utf8",
  );
  process.stdout.write(`Merged global settings: ${displayPath}\n`);
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
  if (opts.global && !PROVIDER_GLOBAL_SETTINGS[provider]) {
    throw new Error(`Provider ${provider} does not define global settings for --global`);
  }

  if (opts.dryRun) {
    for (const entry of plan.entries) {
      process.stdout.write(`[dry-run] would write: ${entry.destinationRelPath}\n`);
    }
  } else {
    const outcomes = await applyProviderScaffoldPlan(plan, { force: opts.force });
    for (const { entry, written } of outcomes) {
      if (written) {
        process.stdout.write(`Written: ${entry.destinationRelPath}\n`);
      } else {
        process.stdout.write(`Skipped (already exists): ${entry.destinationRelPath}\n`);
      }
    }
  }

  const scriptsToAdd = ORCHESTRATOR_NPM_SCRIPTS[provider];
  if (scriptsToAdd) {
    await addOrchestratorNpmScripts(path.join(opts.repoRoot, "package.json"), scriptsToAdd, {
      dryRun: !!opts.dryRun,
    });
  }

  if (opts.global) {
    await mergeProviderGlobalSettings(provider, opts);
  }

  if (opts.dryRun) {
    return;
  }

  process.stdout.write(
    "Next steps:\n" +
      "  1. Commit the scaffolded files (worktree runs read committed content).\n" +
      `  2. Define providers.${provider}.command_template in .specdojo/exec-defaults.yaml (see templates/${provider}/README.md).\n`,
  );
}

/**
 * provider のオーケストレーター起動スクリプトを package.json へ加える。
 * 利用者が書き換えたスクリプトを壊さないよう、既存のキーは --force でも上書きしない。
 * package.json の読み書きに失敗した場合は、成功扱いにしないため終了コードを 1 にする。
 */
async function addOrchestratorNpmScripts(
  packageJsonPath: string,
  scriptsToAdd: Record<string, string>,
  opts: { dryRun: boolean },
): Promise<void> {
  if (!existsSync(packageJsonPath)) {
    process.stdout.write("Skipped (package.json not found)\n");
    return;
  }
  try {
    const content = await readFile(packageJsonPath, "utf8");
    const parsed: unknown = JSON.parse(content);
    if (!isRecord(parsed)) {
      throw new Error("top-level value is not an object");
    }
    if (parsed.scripts !== undefined && !isRecord(parsed.scripts)) {
      throw new Error('"scripts" is not an object');
    }
    const scripts: Record<string, unknown> = isRecord(parsed.scripts) ? parsed.scripts : {};

    let modified = false;
    for (const [scriptName, scriptCommand] of Object.entries(scriptsToAdd)) {
      if (Object.hasOwn(scripts, scriptName)) {
        process.stdout.write(`Skipped (script already exists): ${scriptName} in package.json\n`);
        continue;
      }
      if (opts.dryRun) {
        process.stdout.write(
          `[dry-run] would add script: "${scriptName}": "${scriptCommand}" to package.json\n`,
        );
        continue;
      }
      scripts[scriptName] = scriptCommand;
      process.stdout.write(`Added script: ${scriptName} to package.json\n`);
      modified = true;
    }

    if (modified) {
      parsed.scripts = scripts;
      await writeFile(
        packageJsonPath,
        JSON.stringify(parsed, null, detectIndent(content)) + "\n",
        "utf8",
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Failed to update package.json (${packageJsonPath}): ${message}\n`);
    process.exitCode = 1;
  }
}

/** 既存の package.json の字下げ（空白の数またはタブ）を保つ。判別できなければ 2 とする。 */
function detectIndent(content: string): string | number {
  const match = content.match(/^[{[]\r?\n([ \t]+)\S/u);
  if (!match) return 2;
  return match[1].includes("\t") ? "\t" : match[1].length;
}
