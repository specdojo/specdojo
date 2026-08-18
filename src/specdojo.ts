#!/usr/bin/env node
import { Command } from "commander";
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

async function main(): Promise<void> {
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

  await program.parseAsync(process.argv);
}

void main();
