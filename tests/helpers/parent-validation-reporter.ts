import { relative } from "node:path";
import type { Reporter, TestModule } from "vitest/node";

// Only enabled by the parent validation runner. Keep the normal reporter and verdict intact.
export default class ParentValidationReporter implements Reporter {
  private record(event: "start" | "end", module: TestModule): void {
    try {
      const file = relative(process.cwd(), module.moduleId);
      // The end event carries the file's own duration so the parent runner can record per-file times.
      const duration = event === "end" ? module.diagnostic?.().duration : undefined;
      const payload =
        typeof duration === "number" && Number.isFinite(duration)
          ? { event, file, duration_ms: Math.round(duration) }
          : { event, file };
      process.stdout.write(`[parent-validation:test-file] ${JSON.stringify(payload)}\n`);
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
