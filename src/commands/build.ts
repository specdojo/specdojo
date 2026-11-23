import { type Command, Option } from "commander";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { loadConfig, loadEnv, specdojoRootDir } from "../shared/specdojo-config.js";
import type { SpecDojoConfig, SpecDojoProjectConfig } from "../shared/specdojo-config.js";
import { selfRunArgs } from "../shared/spawn-self.js";
import {
  collectStepOutputs,
  freshnessScanRoots,
  freshnessStatePath,
  planFreshSteps,
  readFreshnessState,
  scanFileStats,
  writeFreshnessState,
} from "./build-freshness.js";
import type { FreshnessContext, FreshnessState } from "./build-freshness.js";

// ================================
// Types
// ================================

export type BuildScope =
  "exec" | "catalog" | "schedule" | "register" | "yaml-pages" | "dashboard" | "index" | "all";

type BuildOptions = {
  track?: string;
  force?: boolean;
  root?: string;
  output?: string;
  registerScope?: string;
};

export type StepDef = {
  scope: Exclude<BuildScope, "all">;
  label: string;
  subArgs: string[];
};

const VALID_SCOPES: BuildScope[] = [
  "exec",
  "catalog",
  "schedule",
  "register",
  "yaml-pages",
  "dashboard",
  "index",
  "all",
];

// ================================
// Step Resolution
// ================================

function isStepApplicable(
  scope: Exclude<BuildScope, "all">,
  project: SpecDojoProjectConfig | undefined,
): boolean {
  if (scope === "yaml-pages" || scope === "index") return true;
  if (!project) return false;
  switch (scope) {
    case "exec":
      return !!(project.schedule_path?.trim() && project.execution_path?.trim());
    case "catalog":
      return !!project.catalog_path?.trim();
    case "schedule":
      return !!project.schedule_path?.trim();
    case "register":
      return !!project.project_register_path?.trim();
    case "dashboard":
      // タスク実行中（execution_path 指定）のプロジェクトのみ。execution/generated/ に集約する。
      return !!project.execution_path?.trim();
  }
}

/**
 * register build の対象 project を決める。index build はリポジトリ内のすべての登録簿の
 * generated/pjr-index.md を要求する一方、生成物は git 管理外で新しい worktree には無い。
 * そのため `--project` を明示しない build では、登録簿を持つ全 project を対象にする。
 * `--project` を明示した場合は、従来どおりその project だけを対象にする。
 */
export function resolveRegisterProjectIds(
  config: SpecDojoConfig | null,
  projectId: string | undefined,
  isProjectExplicit: boolean,
): string[] {
  if (!config) return [];
  if (isProjectExplicit) {
    const project = projectId ? config.projects[projectId] : undefined;
    return projectId && isStepApplicable("register", project) ? [projectId] : [];
  }
  return Object.keys(config.projects)
    .filter((id) => isStepApplicable("register", config.projects[id]))
    .sort();
}

export function resolveSteps(
  scope: BuildScope,
  projectArgs: string[],
  project: SpecDojoProjectConfig | undefined,
  registerProjectIds: readonly string[],
  opts: BuildOptions = {},
): StepDef[] {
  // schedule build は管理対象の track YAML を上書きし得るため、従来の一括 build には
  // 加えず、track を明示した --only schedule のときだけ実行する。
  if (scope === "schedule") {
    const track = opts.track?.trim();
    if (!track) throw new Error("--only schedule requires --track <track>");
    return isStepApplicable(scope, project)
      ? [
          {
            scope,
            label: "schedule build",
            subArgs: [
              "schedule",
              "build",
              ...projectArgs,
              "--track",
              track,
              ...(opts.force ? ["--force"] : []),
            ],
          },
        ]
      : [];
  }

  const registerSteps: StepDef[] = registerProjectIds.map((id) => ({
    scope: "register",
    label: registerProjectIds.length > 1 ? `register build (${id})` : "register build",
    subArgs: [
      "register",
      "build",
      "--project",
      id,
      ...(opts.registerScope ? ["--scope", opts.registerScope] : []),
    ],
  }));

  const candidates: StepDef[] = [
    {
      scope: "exec",
      label: "exec refresh",
      subArgs: ["exec", "refresh", ...projectArgs],
    },
    {
      scope: "catalog",
      label: "catalog build",
      subArgs: ["catalog", "build", ...projectArgs],
    },
    ...registerSteps,
    {
      scope: "yaml-pages",
      label: "yaml-pages build",
      subArgs: ["yaml-pages", "build", ...(opts.root ? ["--root", opts.root] : [])],
    },
    // dashboard は execution/generated/dashboard.md + timeline Gantt SVG を生成する。
    // state.json / ready.json（exec refresh）と tml-index / rtn-*.yaml / routine-state.json
    // （routines）を機械可読な入力で集約するため、index build の手前に置く。
    {
      scope: "dashboard",
      label: "dashboard build",
      subArgs: ["dashboard", "build", ...projectArgs],
    },
    {
      scope: "index",
      label: "index build",
      subArgs: [
        "index",
        "build",
        ...(opts.root ? ["--root", opts.root] : []),
        ...(opts.output ? ["--output", opts.output] : []),
      ],
    },
  ];

  const active = scope === "all" ? candidates : candidates.filter((s) => s.scope === scope);

  // register の対象は registerProjectIds で解決済み。他の段は従来どおり 1 project で判定する。
  return active.filter((s) => s.scope === "register" || isStepApplicable(s.scope, project));
}

// ================================
// Logging
// ================================

function log(msg: string): void {
  process.stdout.write(`[build] ${msg}\n`);
}

function logError(msg: string): void {
  process.stderr.write(`[build] ${msg}\n`);
}

// ================================
// Command Registration
// ================================

export function registerBuildCommand(program: Command): void {
  program
    .command("build")
    .description(
      "Run default build steps (exec → catalog → register → yaml-pages → dashboard → index); select one with --only",
    )
    .option("--project <id>", "Project ID (specdojo.config.json)")
    .addOption(
      new Option("--only <category>", "Build only this category")
        .choices(VALID_SCOPES.filter((scope) => scope !== "all"))
        .conflicts("scope"),
    )
    .addOption(
      new Option("--scope <scope>", "Compatibility alias for --only (all runs every default step)")
        .choices(VALID_SCOPES)
        .hideHelp(),
    )
    .option("--track <track>", "Track name (required for --only schedule)")
    .option("--force", "Overwrite existing track YAML (only with --only schedule)")
    .option("--root <path>", "Root directory to scan (only with --only index or yaml-pages)")
    .option("--output <path>", "Index output path (only with --only index)")
    .addOption(
      new Option(
        "--register-scope <scope>",
        "Views to generate (only with --only register)",
      ).choices(["register", "controls", "all"]),
    )
    .option(
      "--skip-fresh",
      "Rerun only the default steps whose inputs changed since their last --skip-fresh success",
    )
    .option("--dry-run", "Print commands without executing", false)
    .action((opts) => {
      const scope = (opts.only ?? opts.scope ?? "all") as BuildScope;
      const optionError =
        scope === "schedule" && !opts.track?.trim()
          ? "--only schedule requires --track <track>"
          : scope !== "schedule" && (opts.track !== undefined || opts.force !== undefined)
            ? "--track and --force require --only schedule"
            : opts.root !== undefined && scope !== "index" && scope !== "yaml-pages"
              ? "--root requires --only index or --only yaml-pages"
              : opts.output !== undefined && scope !== "index"
                ? "--output requires --only index"
                : opts.registerScope !== undefined && scope !== "register"
                  ? "--register-scope requires --only register"
                  : opts.skipFresh && scope !== "all"
                    ? "--skip-fresh cannot be combined with --only"
                    : undefined;
      if (optionError) {
        logError(optionError);
        process.exitCode = 1;
        return;
      }

      loadEnv();
      const { config, configPath } = loadConfig();
      const baseDir = specdojoRootDir();

      const projectId: string | undefined =
        opts.project?.trim() ||
        process.env.SPECDOJO_PROJECT?.trim() ||
        (config ? Object.keys(config.projects)[0] : undefined);

      // Suppress unused variable warning — baseDir is kept for symmetry with other commands
      void baseDir;

      const project: SpecDojoProjectConfig | undefined =
        config && projectId ? config.projects[projectId] : undefined;

      if (projectId && config && !project) {
        logError(`Unknown project: "${projectId}" (check ${configPath})`);
        process.exitCode = 1;
        return;
      }

      const projectArgs = projectId ? ["--project", projectId] : [];
      const registerProjectIds = resolveRegisterProjectIds(
        config,
        projectId,
        !!opts.project?.trim(),
      );
      const steps = resolveSteps(scope, projectArgs, project, registerProjectIds, opts);

      if (steps.length === 0) {
        logError(
          `No applicable steps for scope "${scope}". ` +
            `Check that required paths are configured in specdojo.config.json.`,
        );
        process.exitCode = 1;
        return;
      }

      if (opts.skipFresh) {
        runFreshBuild(steps, project, config, !!opts.dryRun);
        return;
      }

      const total = steps.length;

      if (opts.dryRun) {
        for (let i = 0; i < total; i++) {
          const step = steps[i];
          const [cmd, args] = selfRunArgs(step.subArgs);
          log(`step ${i + 1}/${total}: ${step.label} (dry-run)`);
          log(`  would run: ${cmd} ${args.join(" ")}`);
        }
        return;
      }

      const overallStart = Date.now();

      for (let i = 0; i < total; i++) {
        if (!runStep(steps[i], i, total)) return;
      }

      const totalElapsed = ((Date.now() - overallStart) / 1000).toFixed(1);
      log(`all steps completed (${totalElapsed}s)`);
    });
}

// ================================
// Step Execution
// ================================

function runStep(step: StepDef, index: number, total: number): boolean {
  log(`step ${index + 1}/${total}: ${step.label}`);

  const start = Date.now();
  const [cmd, args] = selfRunArgs(step.subArgs);
  const result = spawnSync(cmd, args, { stdio: "inherit" });
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  const exitCode = result.status ?? 1;

  if (exitCode !== 0) {
    logError(`error: ${step.label} exited with code ${exitCode} — aborting`);
    process.exitCode = 1;
    return false;
  }

  log(`done: ${step.label} (${elapsed}s)`);
  return true;
}

// `--skip-fresh`: 入力が前回の成功から変わった段だけを流す（PJR-E73Z）。段を流す前に記録を消し、
// 成功した後に鍵と出力を記録する。途中で止まった段は記録が無いため、次回は作り直す。
function runFreshBuild(
  steps: StepDef[],
  project: SpecDojoProjectConfig | undefined,
  config: SpecDojoConfig | null,
  isDryRun: boolean,
): void {
  const overallStart = Date.now();
  const repoRoot = specdojoRootDir();
  const ctx: FreshnessContext = {
    repoRoot,
    config,
    project,
    codeRoot: path.dirname(path.resolve(process.argv[1] ?? ".")),
    now: new Date(),
    env: process.env,
  };
  const statePath = freshnessStatePath(repoRoot);
  const { state: previous, problem } = readFreshnessState(statePath);
  const files = scanFileStats(repoRoot, freshnessScanRoots(config));
  const decisions = planFreshSteps(steps, ctx, files, previous, problem);
  const state: FreshnessState = previous ?? { version: 1, steps: {} };
  const total = decisions.length;

  for (let i = 0; i < total; i++) {
    const decision = decisions[i];
    if (!decision.rebuild) {
      log(`skip: ${decision.step.label} (${decision.reason})`);
      continue;
    }
    log(`rebuild: ${decision.step.label} (${decision.reason})`);
    if (isDryRun) {
      const [cmd, args] = selfRunArgs(decision.step.subArgs);
      log(`  would run: ${cmd} ${args.join(" ")}`);
      continue;
    }

    delete state.steps[decision.id];
    writeFreshnessState(statePath, state);
    if (!runStep(decision.step, i, total)) return;
    if (decision.key) {
      state.steps[decision.id] = {
        key: decision.key,
        outputs: collectStepOutputs(decision.step, ctx, files),
      };
      writeFreshnessState(statePath, state);
    }
  }

  if (isDryRun) return;
  const totalElapsed = ((Date.now() - overallStart) / 1000).toFixed(1);
  log(`all steps completed (${totalElapsed}s)`);
}
