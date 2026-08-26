import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { type Command } from "commander";
import { addProjectOption, printCommandError, resolveCatalogPath } from "./catalog.js";
import { runGenerate } from "./catalog-generate.js";
import { specdojoRootDir } from "./specdojo-config.js";
import { applyTrash, planTrash } from "./deliverable-trash.js";

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
  scaffold.option("--force", "Overwrite existing files", false);
  scaffold.option("--dry-run", "Print planned files without writing", false);
  scaffold.action((opts) => {
    try {
      const catalogPath = resolveCatalogPath(opts);
      const templatesPath = resolve(specdojoRootDir(), "docs/ja/specdojo/templates");
      const rulebooksPath = resolve(specdojoRootDir(), "docs/ja/specdojo/rulebooks");
      if (!existsSync(templatesPath)) {
        throw new Error(`Templates directory not found: ${templatesPath}`);
      }
      if (!existsSync(rulebooksPath)) {
        throw new Error(`Rulebooks directory not found: ${rulebooksPath}`);
      }

      const { written, skipped, errors } = runGenerate({
        catalogPath,
        templatesPath,
        rulebooksPath,
        repoRoot: specdojoRootDir(),
        projectId: opts.projectId ?? null,
        force: !!opts.force,
        dryRun: !!opts.dryRun,
        dctNames: (opts.dct as string[]) ?? [],
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
