import type { Command } from "commander";
import { relative } from "node:path";
import { resolveProjectPaths } from "../exec/project.js";
import { STALL_CATEGORY_LABELS, type StallCategory } from "../exec/watch-scan-classify.js";
import { runWatchScan } from "../exec/watch-scan.js";
import { loadRegisterItems, resolveRegisterPaths } from "../register/register.js";
import { specdojoRootDir } from "../shared/specdojo-config.js";

const DURATION_UNITS: Record<string, number> = { m: 60_000, h: 3_600_000, d: 86_400_000 };

export function parseStaleAfter(value: string): number {
  const match = /^([1-9]\d*)([mhd])$/u.exec(value.trim());
  if (!match)
    throw new Error(`--stale-after must be <positive integer><m|h|d> (e.g. 2h): ${value}`);
  return Number(match[1]) * DURATION_UNITS[match[2]!]!;
}

export function registerWatchScanCommand(orchestrator: Command): void {
  orchestrator
    .command("watch-scan")
    .description(
      "Find stalled tasks, register items, and queues, classify why, and write the watch log and morning report (takes no action)",
    )
    .option("--project <projectId>", "Project id in specdojo.config.json")
    .option(
      "--stale-after <duration>",
      "Treat doing / in-progress / running without a live exec lock as interrupted after this long",
      "2h",
    )
    .option("--dry-run", "Print what would be recorded without writing", false)
    .action((opts: { project?: string; staleAfter: string; dryRun: boolean }) => {
      try {
        const staleMs = parseStaleAfter(opts.staleAfter);
        const resolved = resolveProjectPaths({ project: opts.project });
        const projectId = resolved.projectId ?? opts.project;
        if (!projectId) throw new Error("orchestrator watch-scan requires --project <id>.");
        const root = specdojoRootDir();
        let register: Parameters<typeof runWatchScan>[0]["register"];
        let timeZone = "UTC";
        try {
          const registerPaths = resolveRegisterPaths({ project: projectId });
          timeZone = registerPaths.registerDateTimeZone;
          register = {
            items: loadRegisterItems(registerPaths).map((view) => view.item),
            projectRegisterPath: registerPaths.projectRegisterPath,
          };
        } catch (error) {
          process.stderr.write(
            `[watch-scan] register skipped: ${error instanceof Error ? error.message : String(error)}\n`,
          );
        }
        const outcome = runWatchScan({
          projectId,
          root,
          executionPath: resolved.executionPath,
          schedulePath: resolved.schedulePath,
          ...(register ? { register } : {}),
          timeZone,
          now: new Date(),
          staleMs,
          dryRun: opts.dryRun,
        });
        for (const line of outcome.appended) {
          process.stdout.write(
            line.event === "stalled"
              ? `[watch-scan] stalled ${line.target.id} ${line.state} → ${line.category}/${line.detail}\n`
              : `[watch-scan] cleared ${line.target.id}\n`,
          );
        }
        const byCategory = new Map<StallCategory, number>();
        for (const line of outcome.current)
          byCategory.set(line.category, (byCategory.get(line.category) ?? 0) + 1);
        const summary = [...byCategory]
          .map(([category, count]) => `${STALL_CATEGORY_LABELS[category]}=${count}`)
          .join(", ");
        process.stdout.write(
          `[watch-scan] ${outcome.current.length} stalled (${summary || "none"}), ${outcome.appended.length} new log line(s)${opts.dryRun ? " [dry-run]" : ""}\n`,
        );
        for (const warning of outcome.warnings)
          process.stderr.write(`[watch-scan] warning: ${warning}\n`);
        if (!opts.dryRun) {
          process.stdout.write(`[watch-scan] log: ${relative(root, outcome.logPath)}\n`);
          process.stdout.write(
            `[watch-scan] morning report: ${relative(root, outcome.reportPath)}\n`,
          );
        }
      } catch (error) {
        process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
        process.exitCode = 1;
      }
    });
}
