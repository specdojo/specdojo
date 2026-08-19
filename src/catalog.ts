import { type Command } from "commander";
import { join, relative, resolve } from "node:path";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import yaml from "js-yaml";
import { getProjectCatalogPath, loadConfig, loadEnv, specdojoRootDir } from "./specdojo-config.js";
import {
  buildCatalog,
  collectCatalogLocalIds,
  validateBasedOn,
  validateCatalogDomains,
  validateCatalogLocalIds,
  validateDctDoc,
} from "./catalog-build.js";
import { collectDocIndexEntries } from "./doc-index.js";
import { readSpecdojoNamespace } from "./frontmatter-namespace.js";
import { deriveProjectId, runScaffold, type ProjectSize } from "./catalog-scaffold.js";
import type { DctDoc } from "./catalog-types.js";
import {
  buildPlanSkeleton,
  DCT_PLAN_SCHEMA_PATH,
  domainFromPlanFileName,
  listPlanFiles,
  loadPlan,
  loadTemplateForDomain,
  planFileName,
  resolvePlanInputs,
  resolvePlanPath,
  resolvePlansDir,
  validateDctPlan,
  validatePlanSchema,
  writePlan,
  type DctPlan,
  type LoadedTemplateForDomain,
} from "./catalog-plan.js";
import { renderPlanPrompt } from "./catalog-plan-prompt.js";
import { generateCatalogsFromPlan, writeGeneratedCatalogs } from "./catalog-plan-generate.js";

function readSizeFromIndex(catalogPath: string): ProjectSize | null {
  const indexPath = join(catalogPath, "dct-index.md");
  if (!existsSync(indexPath)) return null;
  const content = readFileSync(indexPath, "utf8");
  const size = readSpecdojoNamespace(content).size;
  if (size === "small" || size === "medium" || size === "large") return size;
  return null;
}

export function resolveCatalogPath(opts: { project?: string }): string {
  loadEnv();
  const { config, configPath } = loadConfig();
  const baseDir = specdojoRootDir();

  const projectId =
    opts.project?.trim() ||
    process.env.SPECDOJO_PROJECT?.trim() ||
    (config ? Object.keys(config.projects)[0] : "");

  if (!config) {
    throw new Error(`catalog commands require specdojo.config.json.\nRun: specdojo config init`);
  }

  if (!projectId) {
    throw new Error(`No project specified. Use --project <id> or SPECDOJO_PROJECT.`);
  }

  const project = config.projects[projectId];
  if (!project) {
    throw new Error(`Unknown project: ${projectId} (check ${configPath})`);
  }

  const catalogPath = getProjectCatalogPath(project);
  if (!catalogPath) {
    throw new Error(
      `catalog_path not set for project '${projectId}' in ${configPath}.\n` +
        `Add "catalog_path": "<path>" to the project config.`,
    );
  }

  return resolve(baseDir, catalogPath);
}

export function printCommandError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  process.stdout.write(message + "\n");
  process.exitCode = 1;
}

export function addProjectOption(cmd: Command): Command {
  return cmd.option("--project <projectId>", "Project id in specdojo.config.json");
}

function collectCommaSeparated(value: string, previous: string[]): string[] {
  return [
    ...previous,
    ...value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  ];
}

function collectRepeatable(value: string, previous: string[]): string[] {
  return [...previous, value];
}

function resolveTemplatesPath(): string {
  const templatesPath = resolve(specdojoRootDir(), "docs/ja/specdojo/templates");
  if (!existsSync(templatesPath)) {
    throw new Error(`Templates directory not found: ${templatesPath}`);
  }
  return templatesPath;
}

function repoRelative(absolutePath: string): string {
  return relative(specdojoRootDir(), absolutePath).replace(/\\/g, "/");
}

function requireDomain(domain: unknown): string {
  const value = typeof domain === "string" ? domain.trim() : "";
  if (!value) {
    throw new Error(`--domain <domain> is required (e.g. --domain data-flow).`);
  }
  return value;
}

function deriveProjectIdOrThrow(catalogPath: string, opts: { project?: string }): string {
  const projectId = deriveProjectId(catalogPath) ?? opts.project?.trim() ?? "";
  if (!/^prj-[0-9]{4,}$/.test(projectId)) {
    throw new Error(
      `Cannot derive project_id from catalog_path: ${catalogPath}\n` +
        `Use --project <prj-NNNN> so the plan can record project_id.`,
    );
  }
  return projectId;
}

function requireTemplateForDomain(domain: string): LoadedTemplateForDomain {
  const templatesPath = resolveTemplatesPath();
  const repoRoot = specdojoRootDir();
  const loaded = loadTemplateForDomain(templatesPath, domain, repoRoot);
  if (!loaded) {
    throw new Error(
      `No DCT template found for domain '${domain}' in ${repoRelative(templatesPath)}.`,
    );
  }
  return loaded;
}

// Runs schema + semantic validation for one plan and prints findings.
// Returns false when the plan must not be written or accepted.
function reportPlanValidation(
  plan: DctPlan,
  opts: { catalogPath: string; fileName: string; template?: LoadedTemplateForDomain },
): boolean {
  const schemaErrors = validatePlanSchema(plan, specdojoRootDir());
  for (const err of schemaErrors) {
    process.stdout.write(`ERROR: ${opts.fileName}${err}\n`);
  }
  if (schemaErrors.length > 0) return false;

  const result = validateDctPlan(plan, {
    template: opts.template?.template,
    knownLocalIds: collectCatalogLocalIds(opts.catalogPath),
    fileName: opts.fileName,
  });
  for (const err of result.errors) {
    process.stdout.write(`ERROR: ${err}\n`);
  }
  for (const warn of result.warnings) {
    process.stdout.write(`WARN:  ${warn}\n`);
  }
  return result.ok;
}

function printPlanDiff(diff: string[]): void {
  const MAX_DIFF_LINES = 200;
  for (const line of diff.slice(0, MAX_DIFF_LINES)) {
    process.stdout.write(`${line}\n`);
  }
  if (diff.length > MAX_DIFF_LINES) {
    process.stdout.write(`... (${diff.length - MAX_DIFF_LINES} more diff lines)\n`);
  }
}

function parseScaffoldVariables(values: string[]): Record<string, string> {
  const variables: Record<string, string> = {};
  for (const value of values) {
    const separator = value.indexOf("=");
    const name = separator >= 0 ? value.slice(0, separator).trim() : "";
    const replacement = separator >= 0 ? value.slice(separator + 1) : "";
    if (!/^[A-Z][A-Z0-9_]*$/.test(name) || replacement.length === 0) {
      throw new Error(`Invalid --var: "${value}". Use NAME=value (NAME must be uppercase).`);
    }
    if (name === "PROJECT_ID") {
      throw new Error(`--var PROJECT_ID is reserved; use --project-id instead.`);
    }
    if (Object.hasOwn(variables, name) && variables[name] !== replacement) {
      throw new Error(`Conflicting --var values for ${name}.`);
    }
    variables[name] = replacement;
  }
  return variables;
}

// Plan-driven catalog generation. Every domain is generated as a whole: the plan is validated,
// the documents are built in memory, and only a fully valid set is written, so a failed run
// never leaves a domain half regenerated.
function runPlanScaffold(opts: {
  catalogPath: string;
  templatesPath: string;
  size: ProjectSize;
  domains: string[];
  projectIdOption?: string;
  force: boolean;
  dryRun: boolean;
}): void {
  const { catalogPath, templatesPath, size, force, dryRun } = opts;
  const repoRoot = specdojoRootDir();
  const projectId = deriveProjectIdOrThrow(catalogPath, { project: opts.projectIdOption });

  const requested = [...new Set(opts.domains.map((domain) => domain.trim()).filter(Boolean))];
  const domains =
    requested.length > 0
      ? requested
      : listPlanFiles(catalogPath)
          .map((file) => domainFromPlanFileName(file))
          .filter((domain): domain is string => domain !== null);

  if (domains.length === 0) {
    process.stdout.write(
      `No dct-plan-*.yaml found in: ${resolvePlansDir(catalogPath)}\n` +
        `Run: specdojo catalog plan scaffold --domain <domain>\n`,
    );
    process.exitCode = 1;
    return;
  }

  let allOk = true;
  for (const domain of domains) {
    const planPath = resolvePlanPath(catalogPath, domain);
    if (!existsSync(planPath)) {
      process.stdout.write(`ERROR: DCT plan not found: ${planPath}\n`);
      allOk = false;
      continue;
    }

    const plan = loadPlan(planPath);
    const schemaErrors = validatePlanSchema(plan, repoRoot);
    for (const err of schemaErrors) {
      process.stdout.write(`ERROR: ${planFileName(domain)}${err}\n`);
    }
    if (schemaErrors.length > 0) {
      allOk = false;
      continue;
    }

    const { files, errors, warnings } = generateCatalogsFromPlan({
      catalogPath,
      templatesPath,
      repoRoot,
      projectId,
      size,
      plan,
    });
    for (const warning of warnings) process.stdout.write(`WARN:  ${warning}\n`);
    for (const err of errors) process.stdout.write(`ERROR: ${err}\n`);
    if (errors.length > 0) {
      process.stdout.write(`Not written (${domain}): 検証エラーのため書き込みを中止した。\n`);
      allOk = false;
      continue;
    }

    const outcomes = writeGeneratedCatalogs({ catalogPath, files, force, dryRun });
    for (const outcome of outcomes) {
      if (outcome.written) {
        process.stdout.write(`${force ? "Updated" : "Created"}: ${outcome.path}\n`);
        continue;
      }
      if (outcome.skippedReason === "unchanged") {
        process.stdout.write(`Unchanged: ${outcome.path}\n`);
        continue;
      }
      if (outcome.skippedReason === "dry-run") {
        process.stdout.write(`Dry-run (not written): ${outcome.path}\n`);
        printPlanDiff(outcome.diff);
        continue;
      }
      process.stdout.write(
        `Skipped (already exists; use --force to overwrite): ${outcome.path}\n` +
          `Review the diff below before overwriting.\n`,
      );
      printPlanDiff(outcome.diff);
    }
  }

  if (!allOk) process.exitCode = 1;
}

export function registerCatalogCommands(program: Command): void {
  const cat = program.command("catalog").description("Deliverables catalog (dct-*.yaml) commands");

  const wcmd = cat.command("where").description("Print resolved catalog paths");
  addProjectOption(wcmd);
  wcmd.action((opts) => {
    try {
      const catalogPath = resolveCatalogPath(opts);
      process.stdout.write(`catalog-path: ${catalogPath}\n`);
      process.stdout.write(`generated   : ${join(catalogPath, "generated")}\n`);
      process.stdout.write(`plans       : ${resolvePlansDir(catalogPath)}\n`);
    } catch (error) {
      printCommandError(error);
    }
  });

  const vcmd = cat.command("validate").description("Validate dct-*.yaml files");
  addProjectOption(vcmd);
  vcmd.action((opts) => {
    try {
      const catalogPath = resolveCatalogPath(opts);
      const files = readdirSync(catalogPath)
        .filter((f) => /^dct-.+\.yaml$/.test(f))
        .sort();

      if (files.length === 0) {
        process.stdout.write(`No dct-*.yaml files found in: ${catalogPath}\n`);
        return;
      }

      const knownLocalIds = collectCatalogLocalIds(catalogPath);
      const repoRoot = specdojoRootDir();
      let allOk = true;
      for (const f of files) {
        const filePath = `${catalogPath}/${f}`;
        try {
          const raw = readFileSync(filePath, "utf8");
          const doc = yaml.load(raw) as DctDoc;
          const result = validateDctDoc(doc, filePath, knownLocalIds, repoRoot);
          for (const err of result.errors) {
            process.stdout.write(`ERROR: ${err}\n`);
          }
          for (const warn of result.warnings) {
            process.stdout.write(`WARN:  ${warn}\n`);
          }
          if (result.ok) {
            process.stdout.write(`OK: ${f}\n`);
          } else {
            allOk = false;
          }
        } catch (err) {
          process.stdout.write(
            `ERROR: ${filePath}: ${err instanceof Error ? err.message : String(err)}\n`,
          );
          allOk = false;
        }
      }

      // Cross-check: same-project based_on must be within the depends_on closure.
      // Build a fresh document-id universe so resolve-or-error does not depend on
      // a possibly-stale .specdojo/doc-index.json.
      const knownIds = new Set(
        Object.keys(collectDocIndexEntries(resolve(repoRoot, "docs"), repoRoot)),
      );
      const basedOnResult = validateBasedOn(catalogPath, repoRoot, knownIds);
      for (const err of basedOnResult.errors) {
        process.stdout.write(`ERROR: ${err}\n`);
      }
      for (const warn of basedOnResult.warnings) {
        process.stdout.write(`WARN:  ${warn}\n`);
      }
      if (!basedOnResult.ok) {
        allOk = false;
      }

      // Cross-file: domain must be unique (catalog build output is keyed by domain).
      const domainResult = validateCatalogDomains(catalogPath);
      for (const err of domainResult.errors) {
        process.stdout.write(`ERROR: ${err}\n`);
      }
      if (!domainResult.ok) {
        allOk = false;
      }

      // Cross-file: local_id must be unique project-wide so a bare local_id resolves
      // to one deliverable (scheduled tasks and --deliverable).
      for (const warn of validateCatalogLocalIds(catalogPath).warnings) {
        process.stdout.write(`WARN:  ${warn}\n`);
      }

      process.exitCode = allOk ? 0 : 1;
    } catch (error) {
      printCommandError(error);
    }
  });

  const bcmd = cat.command("build").description("Generate dct-*.md from dct-*.yaml");
  addProjectOption(bcmd);
  bcmd.action((opts) => {
    try {
      const catalogPath = resolveCatalogPath(opts);
      const { generated, errors } = buildCatalog(catalogPath);

      for (const err of errors) {
        process.stdout.write(`ERROR: ${err}\n`);
      }
      for (const path of generated) {
        process.stdout.write(`Generated: ${path}\n`);
      }

      if (errors.length > 0) {
        process.exitCode = 1;
      }
    } catch (error) {
      printCommandError(error);
    }
  });

  const scCmd = cat
    .command("scaffold")
    .description("Create dct-*.yaml from templates (small|medium|large)");
  addProjectOption(scCmd);
  scCmd.option(
    "--size <size>",
    "Project size: small|medium|large (default: read from dct-index.md)",
  );
  scCmd.option(
    "--project-id <projectId>",
    "Project ID to embed (e.g. prj-0001); derived from catalog_path if omitted",
  );
  scCmd.option(
    "--domain <domain>",
    "Limit to template domain (repeatable / comma-separated)",
    collectCommaSeparated,
    [] as string[],
  );
  scCmd.option(
    "--var <NAME=value>",
    "Replace a template placeholder such as _TERM_ (repeatable)",
    collectRepeatable,
    [] as string[],
  );
  scCmd.option(
    "--plan",
    "Generate from the saved dct-plan-<domain>.yaml instead of the raw template",
    false,
  );
  scCmd.option("--dry-run", "Show what would be generated without writing (with --plan)", false);
  scCmd.option("--force", "Overwrite existing files", false);
  scCmd.action((opts) => {
    try {
      const catalogPath = resolveCatalogPath(opts);

      const explicitSize = opts.size as string | undefined;
      if (explicitSize && !["small", "medium", "large"].includes(explicitSize)) {
        throw new Error(`Invalid --size: "${explicitSize}". Must be one of: small|medium|large`);
      }
      const size: ProjectSize =
        (explicitSize as ProjectSize | undefined) ??
        readSizeFromIndex(catalogPath) ??
        (() => {
          throw new Error(
            `--size not specified and dct-index.md has no "size" field.\n` +
              `Use --size <small|medium|large> or add size: to dct-index.md frontmatter.`,
          );
        })();

      const templatesPath = resolveTemplatesPath();

      if (opts.plan) {
        if ((opts.var as string[]).length > 0) {
          throw new Error(
            `--var は --plan と併用できない。placeholder の値は dct-plan-<domain>.yaml の variables ` +
              `（根拠付き）を正本にする。`,
          );
        }
        runPlanScaffold({
          catalogPath,
          templatesPath,
          size,
          domains: opts.domain as string[],
          projectIdOption: opts.projectId as string | undefined,
          force: !!opts.force,
          dryRun: !!opts.dryRun,
        });
        return;
      }

      const { written, skipped, warnings, errors } = runScaffold({
        catalogPath,
        templatesPath,
        size,
        projectId: opts.projectId ?? null,
        force: !!opts.force,
        domains: opts.domain as string[],
        variables: parseScaffoldVariables(opts.var as string[]),
      });

      for (const err of errors) {
        process.stdout.write(`ERROR: ${err}\n`);
      }
      for (const p of written) {
        process.stdout.write(`Created: ${p}\n`);
      }
      for (const p of skipped) {
        process.stdout.write(`Skipped (already exists; use --force to overwrite): ${p}\n`);
      }
      for (const warning of warnings) {
        process.stdout.write(`WARN: ${warning}\n`);
      }

      if (errors.length > 0) process.exitCode = 1;
    } catch (error) {
      printCommandError(error);
    }
  });

  registerCatalogPlanCommands(cat);
}

// `catalog plan` handles the agent judgment artifact (dct-plan-<domain>.yaml) that sits
// between the DCT template and the deterministic catalog generator.
function registerCatalogPlanCommands(cat: Command): void {
  const plan = cat
    .command("plan")
    .description("DCT plan (dct-plan-<domain>.yaml) commands for agent judgment");

  const pScaffold = plan
    .command("scaffold")
    .description("Create dct-plan-<domain>.yaml (skeleton, or ingest agent output with --from)");
  addProjectOption(pScaffold);
  pScaffold.option("--domain <domain>", "Target catalog domain (e.g. data-flow)");
  pScaffold.option(
    "--input <path>",
    "Additional upstream document to record as input (repeatable)",
    collectRepeatable,
    [] as string[],
  );
  pScaffold.option("--from <path>", "Agent-produced plan file to validate and store");
  pScaffold.option("--force", "Overwrite an existing plan", false);
  pScaffold.option("--dry-run", "Show the diff without writing", false);
  pScaffold.action((opts) => {
    try {
      const catalogPath = resolveCatalogPath(opts);
      const domain = requireDomain(opts.domain);
      const template = requireTemplateForDomain(domain);
      const repoRoot = specdojoRootDir();

      let planDoc: DctPlan;
      if (opts.from) {
        const fromPath = resolve(repoRoot, opts.from as string);
        if (!existsSync(fromPath)) {
          throw new Error(`--from not found: ${opts.from}`);
        }
        planDoc = loadPlan(fromPath);
        if (planDoc.domain !== domain) {
          throw new Error(
            `--from plan domain '${planDoc.domain}' does not match --domain '${domain}'.`,
          );
        }
      } else {
        const projectId = deriveProjectIdOrThrow(catalogPath, opts);
        const resolution = resolvePlanInputs({
          catalogPath,
          repoRoot,
          domain,
          extraInputs: (opts.input as string[]).map((input) => resolve(repoRoot, input)),
        });
        for (const warning of resolution.warnings) {
          process.stdout.write(`WARN:  ${warning}\n`);
        }
        if (resolution.errors.length > 0) {
          for (const err of resolution.errors) {
            process.stdout.write(`ERROR: ${err}\n`);
          }
          process.exitCode = 1;
          return;
        }
        planDoc = buildPlanSkeleton({
          projectId,
          domain,
          template: { id: template.template.id, path: template.relPath },
          inputs: resolution.inputs,
        });
      }

      const ok = reportPlanValidation(planDoc, {
        catalogPath,
        fileName: planFileName(domain),
        template,
      });
      if (!ok) {
        process.exitCode = 1;
        return;
      }

      const result = writePlan({
        catalogPath,
        plan: planDoc,
        force: !!opts.force,
        dryRun: !!opts.dryRun,
      });

      if (result.written) {
        process.stdout.write(`${opts.force ? "Updated" : "Created"}: ${result.path}\n`);
        return;
      }
      if (result.skippedReason === "unchanged") {
        process.stdout.write(`Unchanged: ${result.path}\n`);
        return;
      }
      if (result.skippedReason === "dry-run") {
        process.stdout.write(`Dry-run (not written): ${result.path}\n`);
        printPlanDiff(result.diff);
        return;
      }
      process.stdout.write(
        `Skipped (already exists; use --force to overwrite): ${result.path}\n` +
          `Review the diff below before overwriting.\n`,
      );
      printPlanDiff(result.diff);
    } catch (error) {
      printCommandError(error);
    }
  });

  const pPrompt = plan
    .command("prompt")
    .description("Print the agent instruction for judging deliverable instances");
  addProjectOption(pPrompt);
  pPrompt.option("--domain <domain>", "Target catalog domain (e.g. data-flow)");
  pPrompt.option(
    "--input <path>",
    "Additional upstream document to include as input (repeatable)",
    collectRepeatable,
    [] as string[],
  );
  pPrompt.option("--out <path>", "Write the instruction to a file instead of stdout");
  pPrompt.action((opts) => {
    try {
      const catalogPath = resolveCatalogPath(opts);
      const domain = requireDomain(opts.domain);
      const template = requireTemplateForDomain(domain);
      const repoRoot = specdojoRootDir();
      const projectId = deriveProjectIdOrThrow(catalogPath, opts);

      const resolution = resolvePlanInputs({
        catalogPath,
        repoRoot,
        domain,
        extraInputs: (opts.input as string[]).map((input) => resolve(repoRoot, input)),
      });
      for (const warning of resolution.warnings) {
        process.stderr.write(`WARN:  ${warning}\n`);
      }
      if (resolution.errors.length > 0) {
        for (const err of resolution.errors) {
          process.stdout.write(`ERROR: ${err}\n`);
        }
        process.exitCode = 1;
        return;
      }

      const planPath = resolvePlanPath(catalogPath, domain);
      const prompt = renderPlanPrompt({
        projectId,
        domain,
        templateId: template.template.id,
        templateRelPath: template.relPath,
        planRelPath: repoRelative(planPath),
        schemaRelPath: DCT_PLAN_SCHEMA_PATH,
        inputs: resolution.inputs,
        planExists: existsSync(planPath),
      });

      if (opts.out) {
        const outPath = resolve(repoRoot, opts.out as string);
        mkdirSync(dirname(outPath), { recursive: true });
        writeFileSync(outPath, prompt, "utf8");
        process.stdout.write(`Created: ${outPath}\n`);
        return;
      }
      process.stdout.write(prompt);
    } catch (error) {
      printCommandError(error);
    }
  });

  const pValidate = plan.command("validate").description("Validate dct-plan-*.yaml files");
  addProjectOption(pValidate);
  pValidate.option("--domain <domain>", "Limit validation to one domain");
  pValidate.action((opts) => {
    try {
      const catalogPath = resolveCatalogPath(opts);
      const plansDir = resolvePlansDir(catalogPath);
      const domain = typeof opts.domain === "string" ? opts.domain.trim() : "";
      const files = listPlanFiles(catalogPath).filter(
        (file) => !domain || file === planFileName(domain),
      );

      if (files.length === 0) {
        process.stdout.write(
          domain
            ? `No ${planFileName(domain)} found in: ${plansDir}\n`
            : `No dct-plan-*.yaml files found in: ${plansDir}\n`,
        );
        return;
      }

      let allOk = true;
      for (const file of files) {
        const filePath = join(plansDir, file);
        try {
          const planDoc = loadPlan(filePath);
          const template = loadTemplateForDomain(
            resolveTemplatesPath(),
            planDoc.domain,
            specdojoRootDir(),
          );
          if (!template) {
            process.stdout.write(
              `WARN:  ${file}: no DCT template found for domain '${planDoc.domain}'; ` +
                `template_local_id references are not checked.\n`,
            );
          }
          const ok = reportPlanValidation(planDoc, {
            catalogPath,
            fileName: file,
            ...(template ? { template } : {}),
          });
          if (ok) {
            process.stdout.write(`OK: ${file}\n`);
          } else {
            allOk = false;
          }
        } catch (error) {
          process.stdout.write(
            `ERROR: ${filePath}: ${error instanceof Error ? error.message : String(error)}\n`,
          );
          allOk = false;
        }
      }

      process.exitCode = allOk ? 0 : 1;
    } catch (error) {
      printCommandError(error);
    }
  });
}
