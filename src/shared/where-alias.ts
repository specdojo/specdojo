import type { Command } from "commander";
import { warnDeprecated } from "./deprecation.js";

/** Retain the six pre-unification entries for one release before removing them. */
export function registerDeprecatedWhereAlias(
  parent: Command,
  printPaths: (opts: { project?: string }) => void,
): void {
  const kind = parent.name();
  parent
    .command("where", { hidden: true })
    .description(`Deprecated: use specdojo where ${kind} (will be removed in 0.10.0)`)
    .option("--project <projectId>", "Project id in specdojo.config.json")
    .action((opts: { project?: string }) => {
      warnDeprecated(
        `${kind} where`,
        `Use specdojo where ${kind}. This alias will be removed in 0.10.0.`,
      );
      printPaths(opts);
    });
}
