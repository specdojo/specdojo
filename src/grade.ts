import { type Command } from "commander";
import { registerGradeApplyCommands } from "./grade-command-apply.js";
import { registerGradeInspectionCommands } from "./grade-command-inspect.js";
import { registerGradePlanCommands } from "./grade-command-plan.js";

export * from "./grade-apply.js";
export { renderGradeFindingTranslationPlan } from "./grade-command-apply.js";
export * from "./grade-core.js";
export * from "./grade-markdown.js";
export * from "./grade-pipeline-state.js";
export * from "./grade-plan.js";
export * from "./grade-target-discovery.js";
export * from "./grade-targets.js";

export function registerGradeCommand(program: Command): void {
  const grade = program
    .command("grade")
    .description("Continuously assess Kata and deliverable content quality");
  registerGradePlanCommands(grade);
  registerGradeApplyCommands(grade);
  registerGradeInspectionCommands(grade);
}
