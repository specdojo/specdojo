import { Argument, type Command } from "commander";
import { printCatalogPaths } from "../catalog/catalog.js";
import { printTimelinePaths } from "../dashboard/timeline.js";
import { printExecPaths } from "../exec/commands.js";
import { printJobPaths } from "../job/job.js";
import { printPlaybookPaths } from "../project/playbook.js";
import { printRoutinePaths } from "../routine/routine.js";
import { printSchedulePaths } from "../schedule/schedule.js";

const pathPrinters = {
  exec: printExecPaths,
  catalog: printCatalogPaths,
  schedule: printSchedulePaths,
  timeline: printTimelinePaths,
  job: printJobPaths,
  routine: printRoutinePaths,
  playbook: printPlaybookPaths,
};

export function registerWhereCommand(program: Command): void {
  program
    .command("where")
    .description("Print resolved project paths and files for a kind")
    .addArgument(
      new Argument("<kind>", "Kind of paths to display").choices(Object.keys(pathPrinters)),
    )
    .option("--project <projectId>", "Project id in specdojo.config.json")
    .action((kind: keyof typeof pathPrinters, opts: { project?: string }) => {
      pathPrinters[kind](opts);
    });
}
