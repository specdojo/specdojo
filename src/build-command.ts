import { type Command } from "commander";
import { spawnSync } from "node:child_process";
import { loadConfig, loadEnv, specdojoRootDir } from "./specdojo-config.js";
import type { SpecDojoProjectConfig } from "./specdojo-config.js";
import { selfRunArgs } from "./spawn-self.js";

// ================================
// Types
// ================================

type BuildScope = "exec" | "catalog" | "register" | "index" | "all";

type StepDef = {
  scope: Exclude<BuildScope, "all">;
  label: string;
  subArgs: string[];
};

const VALID_SCOPES: BuildScope[] = ["exec", "catalog", "register", "index", "all"];

// ================================
// Step Resolution
// ================================

function isStepApplicable(
  scope: Exclude<BuildScope, "all">,
  project: SpecDojoProjectConfig | undefined,
): boolean {
  if (scope === "index") return true;
  if (!project) return false;
  switch (scope) {
    case "exec":
      return !!(project.schedule_path?.trim() && project.execution_path?.trim());
    case "catalog":
      return !!project.catalog_path?.trim();
    case "register":
      return !!project.project_register_path?.trim();
  }
}

function resolveSteps(
  scope: BuildScope,
  projectArgs: string[],
  project: SpecDojoProjectConfig | undefined,
): StepDef[] {
  const candidates: StepDef[] = [
    {
      scope: "exec",
      label: "exec build",
      subArgs: ["exec", "build", ...projectArgs],
    },
    {
      scope: "catalog",
      label: "catalog build",
      subArgs: ["catalog", "build", ...projectArgs],
    },
    {
      scope: "register",
      label: "register build",
      subArgs: ["register", "build", ...projectArgs],
    },
    {
      scope: "index",
      label: "index build",
      subArgs: ["index", "build"],
    },
  ];

  const active = scope === "all" ? candidates : candidates.filter((s) => s.scope === scope);

  return active.filter((s) => isStepApplicable(s.scope, project));
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
    .description("Run all build steps in sequence (exec → catalog → register → index)")
    .option("--project <id>", "Project ID (specdojo.config.json)")
    .option("--scope <scope>", `Build scope: ${VALID_SCOPES.join(" | ")}`, "all")
    .option("--dry-run", "Print commands without executing", false)
    .action((opts) => {
      const scope = opts.scope as BuildScope;
      if (!VALID_SCOPES.includes(scope)) {
        logError(`Invalid scope: "${scope}". Must be one of: ${VALID_SCOPES.join(", ")}`);
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
      const steps = resolveSteps(scope, projectArgs, project);

      if (steps.length === 0) {
        logError(
          `No applicable steps for scope "${scope}". ` +
            `Check that required paths are configured in specdojo.config.json.`,
        );
        process.exitCode = 1;
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
        const step = steps[i];
        log(`step ${i + 1}/${total}: ${step.label}`);

        const start = Date.now();
        const [cmd, args] = selfRunArgs(step.subArgs);
        const result = spawnSync(cmd, args, { stdio: "inherit" });
        const elapsed = ((Date.now() - start) / 1000).toFixed(1);
        const exitCode = result.status ?? 1;

        if (exitCode !== 0) {
          logError(`error: ${step.label} exited with code ${exitCode} — aborting`);
          process.exitCode = 1;
          return;
        }

        log(`done: ${step.label} (${elapsed}s)`);
      }

      const totalElapsed = ((Date.now() - overallStart) / 1000).toFixed(1);
      log(`all steps completed (${totalElapsed}s)`);
    });
}
