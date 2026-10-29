import { type Command } from "commander";
import type { GradeAgentRuntime } from "../shared/agent-plan.js";
import { registerGradeApplyCommands } from "./command-apply.js";
import { registerGradeInspectionCommands } from "./command-inspect.js";
import { registerGradePlanCommands } from "./command-plan.js";
import { registerGradeRunCommand } from "./command-run.js";

export * from "./apply.js";
export { renderGradeFindingTranslationPlan } from "./command-apply.js";
export * from "./core.js";
export * from "./markdown.js";
export * from "./pipeline-state.js";
export * from "./plan.js";
export * from "./target-discovery.js";
export * from "./targets.js";

export function registerGradeCommand(program: Command, runtime?: GradeAgentRuntime): void {
  const grade = program
    .command("grade")
    .description("Continuously assess Kata and deliverable content quality");
  registerGradePlanCommands(grade);
  registerGradeApplyCommands(grade);
  registerGradeInspectionCommands(grade);
  registerGradeRunCommand(grade, runtime);
}
