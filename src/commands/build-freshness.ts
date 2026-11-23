import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  getProjectCatalogPath,
  getProjectExecutionPath,
  getProjectRegisterPath,
  getProjectRoutinesPath,
  getProjectSchedulePath,
  getProjectTimelinePath,
} from "../shared/specdojo-config.js";
import type { SpecDojoConfig, SpecDojoProjectConfig } from "../shared/specdojo-config.js";
import type { StepDef } from "./build.js";

// `specdojo build --skip-fresh` の段ごとの判定（PJR-E73Z）。
// 段ごとに入力ファイルの一覧（パス・サイズ・更新時刻）から鍵を作り、前回成功した時の鍵と
// 比べる。判定できないときは、その段を作り直す側へ倒す。

// ================================
// Types
// ================================

export type FileStats = ReadonlyMap<string, string>;

export type FreshnessContext = {
  repoRoot: string;
  config: SpecDojoConfig | null;
  /** exec・catalog・dashboard の段が対象にする project（build の解決結果と同じもの）。 */
  project: SpecDojoProjectConfig | undefined;
  /** CLI の実装を置くディレクトリ（src または dist）。実装が変わると全段を作り直す。 */
  codeRoot: string;
  now: Date;
  env: NodeJS.ProcessEnv;
};

export type FreshnessStateEntry = { key: string; outputs: string[] };

export type FreshnessState = { version: 1; steps: Record<string, FreshnessStateEntry> };

export type FreshStepDecision = {
  step: StepDef;
  id: string;
  /** 判定できない段は null。成功しても状態に記録しない。 */
  key: string | null;
  rebuild: boolean;
  reason: string;
};

type StepInputSpec = {
  matches: (relPath: string) => boolean;
  isDateSensitive: boolean;
  dependsOn: StepDef["scope"][];
};

export const FRESHNESS_STATE_RELATIVE_PATH = path.join(
  "node_modules",
  ".cache",
  "specdojo",
  "build-steps.json",
);

// 生成物（git 管理外の generated/）は段の出力なので入力に数えない。段の間の受け渡しは
// dependsOn で表す。
const SKIP_DIRECTORY_NAMES = new Set(["generated", "node_modules", ".git"]);
const DCT_YAML_RE = /(^|\/)dct-[^/]+\.ya?ml$/i;
const YAML_RE = /\.ya?ml$/i;
const DEFAULT_INDEX_OUTPUT = ".specdojo/doc-index.json";

// ================================
// File Scanning
// ================================

function toPosix(relPath: string): string {
  return relPath.split(path.sep).join("/");
}

function normalizeRepoPath(relPath: string): string {
  return toPosix(path.normalize(relPath)).replace(/\/+$/, "");
}

function isUnder(relPath: string, directory: string): boolean {
  return directory !== "" && (relPath === directory || relPath.startsWith(`${directory}/`));
}

function walkFiles(
  baseDir: string,
  directory: string,
  out: Map<string, string>,
  skipDirectories: ReadonlySet<string>,
): void {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (skipDirectories.has(entry.name)) continue;
      walkFiles(baseDir, full, out, skipDirectories);
      continue;
    }
    if (!entry.isFile() && !entry.isSymbolicLink()) continue;
    const stat = statSync(full);
    out.set(toPosix(path.relative(baseDir, full)), `${stat.size}:${stat.mtimeMs}`);
  }
}

/** repoRoot 配下の roots を走査し、repo 相対パスごとに「サイズ:更新時刻」を返す。 */
export function scanFileStats(
  repoRoot: string,
  roots: readonly string[],
  skipDirectories: ReadonlySet<string> = SKIP_DIRECTORY_NAMES,
): FileStats {
  const out = new Map<string, string>();
  for (const root of roots) {
    const full = path.join(repoRoot, root);
    if (!existsSync(full)) continue;
    if (statSync(full).isDirectory()) {
      walkFiles(repoRoot, full, out, skipDirectories);
    } else {
      const stat = statSync(full);
      out.set(normalizeRepoPath(root), `${stat.size}:${stat.mtimeMs}`);
    }
  }
  return new Map([...out.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}

function hashParts(parts: readonly string[]): string {
  const hash = createHash("sha256");
  for (const part of parts) {
    hash.update(part);
    hash.update("\n");
  }
  return hash.digest("hex");
}

function fingerprintFiles(files: FileStats, matches: (relPath: string) => boolean): string {
  const lines: string[] = [];
  for (const [relPath, stat] of files) {
    if (matches(relPath)) lines.push(`${relPath}\t${stat}`);
  }
  return hashParts(lines);
}

// ================================
// Context Resolution
// ================================

function projectEntries(config: SpecDojoConfig | null): [string, SpecDojoProjectConfig][] {
  return Object.entries(config?.projects ?? {}).sort(([a], [b]) => a.localeCompare(b));
}

function projectDirectories(project: SpecDojoProjectConfig): string[] {
  const candidates = [
    project.base_path?.trim() || undefined,
    getProjectSchedulePath(project),
    getProjectExecutionPath(project),
    getProjectTimelinePath(project),
    getProjectCatalogPath(project),
    getProjectRegisterPath(project),
    getProjectRoutinesPath(project),
  ];
  return candidates.filter((value): value is string => !!value).map(normalizeRepoPath);
}

/**
 * 段の入力を repo の外まで辿る設定（別リポジトリの登録簿・プロダクトリポジトリ）や、repo の外を
 * 指すパスがあると、入力の一覧を作れない。そのときは理由を返し、全段を作り直させる。
 */
export function undeterminableReason(config: SpecDojoConfig | null): string | undefined {
  if (!config) return "no specdojo.config.json";
  if (Object.keys(config.external_projects ?? {}).length > 0) {
    return "external_projects are configured";
  }
  for (const [id, project] of projectEntries(config)) {
    if ((project.repos ?? []).length > 0) return `project ${id} declares repos`;
    for (const directory of projectDirectories(project)) {
      if (path.isAbsolute(directory) || directory === ".." || directory.startsWith("../")) {
        return `project ${id} has a path outside the repository: ${directory}`;
      }
    }
  }
  return undefined;
}

/** 走査する根。`docs/` と、`docs/` の外に置かれた project のディレクトリ。 */
export function freshnessScanRoots(config: SpecDojoConfig | null): string[] {
  const roots = ["docs"];
  for (const [, project] of projectEntries(config)) {
    for (const directory of projectDirectories(project)) {
      if (directory === "" || directory === ".") continue;
      if (roots.some((root) => isUnder(directory, root))) continue;
      roots.push(directory);
    }
  }
  return roots;
}

function stepProject(step: StepDef, ctx: FreshnessContext): SpecDojoProjectConfig | undefined {
  const index = step.subArgs.indexOf("--project");
  const id = index >= 0 ? step.subArgs[index + 1] : undefined;
  return id ? ctx.config?.projects[id] : ctx.project;
}

function registerDirectories(config: SpecDojoConfig | null): string[] {
  return projectEntries(config)
    .map(([, project]) => getProjectRegisterPath(project))
    .filter((value): value is string => !!value)
    .map(normalizeRepoPath);
}

/** 段ごとの入力・日付への依存・前段への依存。対応表は PJR-E73Z の個票に記載する。 */
export function stepInputSpec(step: StepDef, ctx: FreshnessContext): StepInputSpec {
  switch (step.scope) {
    case "exec": {
      const project = stepProject(step, ctx);
      const schedule = project ? normalizeRepoPath(getProjectSchedulePath(project)) : "";
      const execution = project ? normalizeRepoPath(getProjectExecutionPath(project)) : "";
      return {
        // schedule の sch-*.yaml、exec/events、strategy が参照する dct-*.yaml を読む。
        matches: (p) => isUnder(p, schedule) || isUnder(p, execution) || DCT_YAML_RE.test(p),
        isDateSensitive: true,
        dependsOn: [],
      };
    }
    case "catalog": {
      const registers = registerDirectories(ctx.config);
      return {
        // dct-*.yaml と、カタログが指す成果物・rulebook・sample を docs/ のどこからでも読む。
        // 登録簿の個票は成果物にならないため外す。
        matches: (p) => !registers.some((directory) => isUnder(p, directory)),
        isDateSensitive: false,
        dependsOn: [],
      };
    }
    case "yaml-pages":
      return { matches: (p) => YAML_RE.test(p), isDateSensitive: false, dependsOn: [] };
    case "register":
      // 個票・events のほか、派生元・依存先・対象文書を docs/ 全体の doc id から引く。
      return { matches: () => true, isDateSensitive: true, dependsOn: [] };
    case "dashboard":
      // exec refresh の state・ready、登録簿の個票、カタログ、成果物の有無を読む。
      return {
        matches: () => true,
        isDateSensitive: true,
        dependsOn: ["exec", "catalog", "register"],
      };
    case "index":
      // 登録簿・カタログ・YAML の表示のページなど前段の生成物も索引に含める。
      return {
        matches: () => true,
        isDateSensitive: false,
        dependsOn: ["exec", "catalog", "register", "yaml-pages", "dashboard"],
      };
    case "schedule":
      throw new Error("schedule build is not part of the default build steps");
  }
}

function dateStamps(ctx: FreshnessContext): string[] {
  const zones = new Set<string>(["UTC", Intl.DateTimeFormat().resolvedOptions().timeZone]);
  for (const [, project] of projectEntries(ctx.config)) {
    const zone = project.run?.register_date_timezone?.trim();
    if (zone) zones.add(zone);
  }
  return [...zones].sort().map((zone) => {
    try {
      const date = new Intl.DateTimeFormat("en-CA", {
        timeZone: zone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(ctx.now);
      return `${zone}=${date}`;
    } catch {
      return `${zone}=invalid`;
    }
  });
}

/** 全段に共通する鍵の材料（CLI の実装・設定・SPECDOJO_* 環境変数）。 */
export function commonFingerprint(ctx: FreshnessContext): string {
  const code = scanFileStats(ctx.codeRoot, ["."]);
  const settings = scanFileStats(ctx.repoRoot, [".specdojo", "package-lock.json"]);
  const env = Object.entries(ctx.env)
    .filter(([name]) => name.startsWith("SPECDOJO_"))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => `${name}=${value ?? ""}`);
  return hashParts([
    `code:${fingerprintFiles(code, () => true)}`,
    `settings:${fingerprintFiles(settings, (p) => p !== DEFAULT_INDEX_OUTPUT)}`,
    `env:${hashParts(env)}`,
  ]);
}

// ================================
// Outputs
// ================================

function listGenerated(repoRoot: string, directory: string): string[] {
  const full = path.join(repoRoot, directory, "generated");
  if (!existsSync(full)) return [];
  return readdirSync(full, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name !== ".gitkeep")
    .map((entry) => `${normalizeRepoPath(directory)}/generated/${entry.name}`);
}

function optionValue(step: StepDef, name: string): string | undefined {
  const index = step.subArgs.indexOf(name);
  return index >= 0 ? step.subArgs[index + 1] : undefined;
}

/** 段が成功した後に存在する出力。次回、1 つでも欠けていれば作り直す。 */
export function collectStepOutputs(
  step: StepDef,
  ctx: FreshnessContext,
  files: FileStats,
): string[] {
  const project = stepProject(step, ctx);
  const outputs: string[] = [];
  switch (step.scope) {
    case "exec":
      if (project) outputs.push(...listGenerated(ctx.repoRoot, getProjectExecutionPath(project)));
      break;
    case "catalog": {
      const catalog = project ? getProjectCatalogPath(project) : undefined;
      if (catalog) outputs.push(...listGenerated(ctx.repoRoot, catalog));
      break;
    }
    case "register": {
      const register = project ? getProjectRegisterPath(project) : undefined;
      if (register) {
        outputs.push(...listGenerated(ctx.repoRoot, register));
        outputs.push(...listGenerated(ctx.repoRoot, path.dirname(register)));
      }
      break;
    }
    case "yaml-pages":
      for (const relPath of files.keys()) {
        if (!YAML_RE.test(relPath)) continue;
        const page = path.posix.join(
          path.posix.dirname(relPath),
          "generated",
          path.posix.basename(relPath).replace(YAML_RE, ".md"),
        );
        if (existsSync(path.join(ctx.repoRoot, page))) outputs.push(page);
      }
      break;
    case "dashboard":
      if (project) {
        outputs.push(
          `${normalizeRepoPath(getProjectExecutionPath(project))}/generated/dashboard.md`,
        );
      }
      break;
    case "index":
      outputs.push(normalizeRepoPath(optionValue(step, "--output") ?? DEFAULT_INDEX_OUTPUT));
      break;
    case "schedule":
      break;
  }
  return [...new Set(outputs)]
    .filter((relPath) => existsSync(path.join(ctx.repoRoot, relPath)))
    .sort();
}

// ================================
// Decision
// ================================

export function stepId(step: StepDef): string {
  return [step.scope, ...step.subArgs].join(" ");
}

/**
 * 段ごとに作り直すかを決める。作り直すのは、判定できない・前回の記録がない・鍵が違う・
 * 記録した出力が欠けている・依存する前段を作り直す、のいずれかのとき。
 */
export function planFreshSteps(
  steps: readonly StepDef[],
  ctx: FreshnessContext,
  files: FileStats,
  state: FreshnessState | null,
  stateProblem?: string,
): FreshStepDecision[] {
  const blocker = undeterminableReason(ctx.config);
  const common = blocker ? "" : commonFingerprint(ctx);
  const dates = dateStamps(ctx);
  const keysByScope = new Map<StepDef["scope"], string[]>();
  const rebuiltScopes = new Set<StepDef["scope"]>();
  const decisions: FreshStepDecision[] = [];

  for (const step of steps) {
    const id = stepId(step);
    let key: string | null = null;
    let reason: string | undefined;
    if (blocker) {
      reason = `cannot determine inputs (${blocker})`;
    } else {
      const spec = stepInputSpec(step, ctx);
      const dependencyKeys = spec.dependsOn.flatMap(
        (scope) => keysByScope.get(scope)?.map((k) => `${scope}:${k}`) ?? [],
      );
      key = hashParts([
        `common:${common}`,
        `step:${id}`,
        `inputs:${fingerprintFiles(files, spec.matches)}`,
        ...(spec.isDateSensitive ? dates.map((date) => `date:${date}`) : []),
        ...dependencyKeys.map((dependency) => `dependency:${dependency}`),
      ]);
      const previous = state?.steps[id];
      if (!state) reason = stateProblem ?? "no previous state";
      else if (!previous) reason = "no previous run";
      else if (previous.key !== key) reason = "inputs changed";
      else if (previous.outputs.length === 0) reason = "no recorded outputs";
      else if (previous.outputs.some((p) => !existsSync(path.join(ctx.repoRoot, p)))) {
        reason = "outputs missing";
      } else {
        const rebuiltDependency = spec.dependsOn.find((scope) => rebuiltScopes.has(scope));
        if (rebuiltDependency) reason = `dependency rebuilt (${rebuiltDependency})`;
      }
    }

    const rebuild = reason !== undefined;
    if (rebuild) rebuiltScopes.add(step.scope);
    if (key) keysByScope.set(step.scope, [...(keysByScope.get(step.scope) ?? []), key]);
    decisions.push({ step, id, key, rebuild, reason: reason ?? "inputs unchanged" });
  }
  return decisions;
}

// ================================
// State Persistence
// ================================

function isFreshnessState(value: unknown): value is FreshnessState {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  if (record.version !== 1) return false;
  const steps = record.steps;
  if (typeof steps !== "object" || steps === null || Array.isArray(steps)) return false;
  return Object.values(steps).every((entry) => {
    if (typeof entry !== "object" || entry === null) return false;
    const { key, outputs } = entry as Record<string, unknown>;
    return (
      typeof key === "string" &&
      Array.isArray(outputs) &&
      outputs.every((output) => typeof output === "string")
    );
  });
}

/** 状態ファイルの場所。repo に node_modules が無いときは記録しない（毎回作り直す）。 */
export function freshnessStatePath(repoRoot: string): string | null {
  return existsSync(path.join(repoRoot, "node_modules"))
    ? path.join(repoRoot, FRESHNESS_STATE_RELATIVE_PATH)
    : null;
}

export function readFreshnessState(statePath: string | null): {
  state: FreshnessState | null;
  problem?: string;
} {
  if (!statePath) return { state: null, problem: "no node_modules to keep the state" };
  if (!existsSync(statePath)) return { state: null, problem: "no previous state" };
  try {
    const parsed: unknown = JSON.parse(readFileSync(statePath, "utf8"));
    if (isFreshnessState(parsed)) return { state: parsed };
    return { state: null, problem: `invalid state file: ${statePath}` };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { state: null, problem: `unreadable state file: ${statePath} (${message})` };
  }
}

export function writeFreshnessState(statePath: string | null, state: FreshnessState): void {
  if (!statePath) return;
  mkdirSync(path.dirname(statePath), { recursive: true });
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}
