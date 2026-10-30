import { existsSync } from "node:fs";
import { type Command } from "commander";
import { addProjectOption, printCommandError, resolveCatalogPath } from "../catalog/catalog.js";
import { runGenerate, runGenerateTarget } from "../catalog/generate.js";
import { deriveProjectId } from "../catalog/scaffold.js";
import { loadConfig, specdojoRootDir } from "../shared/specdojo-config.js";
import { resolveSpecdojoPath } from "../docs/template-resolution.js";
import { applyTrash, planTrash } from "./trash.js";

function resolveTargetProjectId(
  opts: { project?: string; projectId?: string },
  catalogPath: string | undefined,
  targetId: string,
): string {
  if (opts.projectId?.trim()) return opts.projectId.trim();
  if (opts.project?.trim()) return opts.project.trim();
  if (process.env.SPECDOJO_PROJECT?.trim()) return process.env.SPECDOJO_PROJECT.trim();
  if (catalogPath) {
    const derived = deriveProjectId(catalogPath);
    if (derived) return derived;
  }
  const config = loadConfig().config;
  if (config && Object.keys(config.projects).length > 0) {
    return Object.keys(config.projects)[0];
  }
  if (targetId.includes(":")) {
    return targetId.slice(0, targetId.indexOf(":"));
  }
  throw new Error("No project specified. Use --project <id> or --project-id <id>.");
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

export function registerDeliverableCommands(program: Command): void {
  const deliverable = program
    .command("deliverable")
    .description("Project deliverable file commands");

  const scaffold = deliverable
    .command("scaffold")
    .description("Create deliverable files the catalog points to (from template or catalog info)");
  addProjectOption(scaffold);
  scaffold.option(
    "--project-id <projectId>",
    "Project ID to embed (e.g. prj-0001); derived from each dct-*.yaml if omitted",
  );
  scaffold.option(
    "--dct <name>",
    "Limit to specific dct-*.yaml (repeatable / comma-separated; with or without 'dct-' prefix and '.yaml')",
    collectCommaSeparated,
    [] as string[],
  );
  scaffold.option("--target <targetId>", "Scaffold only a single deliverable by document id");
  scaffold.option(
    "--target-path <targetPath>",
    "Repository-relative file path for catalog-less deliverable",
  );
  scaffold.option(
    "--target-rulebook <targetRulebook>",
    "Rulebook document id for catalog-less deliverable",
  );
  scaffold.option("--force", "Overwrite existing files", false);
  scaffold.option("--dry-run", "Print planned files without writing", false);
  scaffold.action((opts) => {
    try {
      const dctList = (opts.dct as string[]) ?? [];
      const hasDct = dctList.length > 0;
      const target = typeof opts.target === "string" ? opts.target.trim() : "";
      const targetPath = typeof opts.targetPath === "string" ? opts.targetPath.trim() : undefined;
      const targetRulebook =
        typeof opts.targetRulebook === "string" ? opts.targetRulebook.trim() : undefined;

      if (target && hasDct) {
        throw new Error("Cannot specify both --target and --dct");
      }
      if (!target && (targetPath || targetRulebook)) {
        throw new Error("--target-path and --target-rulebook require --target");
      }

      const templatesPath = resolveSpecdojoPath("docs/ja/specdojo/templates");
      const rulebooksPath = resolveSpecdojoPath("docs/ja/specdojo/rulebooks");
      if (!existsSync(templatesPath)) {
        throw new Error(`Templates directory not found: ${templatesPath}`);
      }
      if (!existsSync(rulebooksPath)) {
        throw new Error(`Rulebooks directory not found: ${rulebooksPath}`);
      }

      if (target) {
        const repoRoot = specdojoRootDir();
        let catalogPath: string | undefined;
        try {
          catalogPath = resolveCatalogPath(opts);
        } catch (error) {
          if (!targetPath || !targetRulebook) {
            throw error;
          }
        }

        const projectId = resolveTargetProjectId(opts, catalogPath, target);

        const { written, skipped, errors } = runGenerateTarget({
          catalogPath,
          templatesPath,
          rulebooksPath,
          repoRoot,
          projectId,
          targetId: target,
          targetPath,
          targetRulebook,
          force: !!opts.force,
          dryRun: !!opts.dryRun,
          resourceRoots: { repositoryRoot: repoRoot },
        });

        const createdLabel = opts.dryRun ? "Would create" : "Created";
        for (const error of errors) process.stdout.write(`ERROR: ${error}\n`);
        for (const path of written) process.stdout.write(`${createdLabel}: ${path}\n`);
        for (const path of skipped) {
          process.stdout.write(`Skipped (already exists; use --force to overwrite): ${path}\n`);
        }

        if (errors.length > 0) process.exitCode = 1;
        return;
      }

      const catalogPath = resolveCatalogPath(opts);
      const { written, skipped, errors } = runGenerate({
        catalogPath,
        templatesPath,
        rulebooksPath,
        repoRoot: specdojoRootDir(),
        projectId: opts.projectId ?? null,
        force: !!opts.force,
        dryRun: !!opts.dryRun,
        dctNames: dctList,
        resourceRoots: { repositoryRoot: specdojoRootDir() },
      });

      const createdLabel = opts.dryRun ? "Would create" : "Created";
      for (const error of errors) process.stdout.write(`ERROR: ${error}\n`);
      for (const path of written) process.stdout.write(`${createdLabel}: ${path}\n`);
      for (const path of skipped) {
        process.stdout.write(`Skipped (already exists; use --force to overwrite): ${path}\n`);
      }

      if (errors.length > 0) process.exitCode = 1;
    } catch (error) {
      printCommandError(error);
    }
  });

  const trash = deliverable
    .command("trash")
    .description(
      "Move a deliverable's document file into docs/ja/product/trash/ or " +
        "docs/ja/projects/<project-id>/trash/, keeping its local_id and catalog entry " +
        "(id-and-file-naming-standard.md 9.1)",
    );
  addProjectOption(trash);
  trash.requiredOption("--local-id <localId>", "local_id of the deliverable to move");
  trash.option("--dry-run", "Print the plan without moving files or writing the catalog", false);
  trash.action((opts) => {
    try {
      const catalogPath = resolveCatalogPath(opts);
      const repoRoot = specdojoRootDir();
      const plan = planTrash(repoRoot, catalogPath, opts.localId as string);

      process.stdout.write(`local_id: ${plan.localId}\n`);
      process.stdout.write(`catalog: ${plan.catalogFile}\n`);
      process.stdout.write(`${plan.oldDocPath} -> ${plan.newDocPath}\n`);
      if (plan.frontmatterStatus !== "deprecated") {
        process.stdout.write(
          `WARN: specdojo.status is '${plan.frontmatterStatus ?? "unknown"}', not 'deprecated'. ` +
            `deliverable trash does not change document status; update it separately.\n`,
        );
      }

      if (opts.dryRun) {
        process.stdout.write(`Dry run: no files moved, catalog not written.\n`);
        return;
      }

      applyTrash(repoRoot, plan);
      process.stdout.write(`Moved: ${plan.oldDocPath} -> ${plan.newDocPath}\n`);
      process.stdout.write(`Updated: ${plan.catalogFile}\n`);
    } catch (error) {
      printCommandError(error);
    }
  });
}
