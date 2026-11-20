import { relative } from "node:path";
import type { Reporter, TestModule } from "vitest/node";

// Only enabled by the parent validation runner. Keep the normal reporter and verdict intact.
export default class ParentValidationReporter implements Reporter {
  private record(event: "start" | "end", module: TestModule): void {
    try {
      process.stdout.write(
        `[parent-validation:test-file] ${JSON.stringify({ event, file: relative(process.cwd(), module.moduleId) })}\n`,
      );
    } catch {
      /* Diagnostics must not affect test results. */
    }
  }
  onTestModuleStart(module: TestModule): void {
    this.record("start", module);
  }
  onTestModuleEnd(module: TestModule): void {
    this.record("end", module);
  }
}
