#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import { evaluateDistFreshness, inspectDistEntryFreshness } from "./dist-freshness.js";
import { registerConfigCommands, registerProjectCommands } from "./specdojo-config.js";
import { registerExecCommands } from "./exec.js";
import { registerCatalogCommands } from "./catalog.js";
import { registerDeliverableCommands } from "./deliverable.js";
import { registerScheduleCommands } from "./schedule.js";
import { registerTimelineCommands } from "./timeline.js";
import { registerIndexCommands } from "./index-command.js";
import { registerRegisterCommands } from "./register.js";
import { registerRoutineCommands } from "./routine.js";
import { registerJobCommands } from "./job.js";
import { registerWatchCommand } from "./watch.js";
import { registerBuildCommand } from "./build-command.js";
import { registerYamlPagesCommands } from "./yaml-pages-command.js";
import { registerDashboardCommands } from "./dashboard.js";
import { registerGradeCommand } from "./grade.js";

/**
 * bin は dist/specdojo.js を指すため、開発チェックアウトで `npm run build` を忘れると
 * 古い挙動のまま実行される。src が dist より新しい場合は警告し、exec 系は中断する。
 * 配布パッケージには src が無いため、この検査は no-op になる。
 */
function guardDistFreshness(): boolean {
  const decision = evaluateDistFreshness(
    inspectDistEntryFreshness(fileURLToPath(import.meta.url)),
    process.argv,
    process.env,
  );
  if (decision.action === "none") return true;
  process.stderr.write(`${decision.message}\n`);
  return decision.action !== "block";
}

async function main(): Promise<void> {
  if (!guardDistFreshness()) {
    process.exitCode = 1;
    return;
  }

  const program = new Command();

  program.name("specdojo").description("SpecDojo helper CLI").version("0.4.0");

  registerConfigCommands(program);
  registerProjectCommands(program);
  registerExecCommands(program);
  registerCatalogCommands(program);
  registerDeliverableCommands(program);
  registerScheduleCommands(program);
  registerTimelineCommands(program);
  registerIndexCommands(program);
  registerRegisterCommands(program);
  registerRoutineCommands(program);
  registerJobCommands(program);
  registerWatchCommand(program);
  registerBuildCommand(program);
  registerYamlPagesCommands(program);
  registerDashboardCommands(program);
  registerGradeCommand(program);

  await program.parseAsync(process.argv);
}

void main();
