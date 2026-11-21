import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative } from "node:path";
import { pathToFileURL } from "node:url";
import type { Configuration, ConfigurationParser } from "markdownlint";
import type * as MarkdownlintSync from "markdownlint/sync";
import { load } from "../shared/yaml.js";
import { DEFAULT_MARKDOWNLINT_CONFIG } from "../shared/markdownlint-config.js";

async function markdownlintApi(repoRoot: string) {
  // Prefer the consumer's installation, then SpecDojo's development installation.
  // Resolve from markdownlint-cli as well, for package managers without hoisting.
  for (let require of [
    createRequire(join(repoRoot, "package.json")),
    createRequire(import.meta.url),
  ]) {
    try {
      try {
        require = createRequire(require.resolve("markdownlint-cli/markdownlint.js"));
      } catch {
        // A direct markdownlint installation is sufficient too.
      }
      const api = (await import(
        pathToFileURL(require.resolve("markdownlint/sync")).href
      )) as typeof MarkdownlintSync;
      const parsers: ConfigurationParser[] = [];
      try {
        const jsonc = require("jsonc-parser") as {
          parse: (
            text: string,
            errors: unknown[],
            options: { allowTrailingComma: boolean },
          ) => Configuration;
        };
        parsers.push((text) => {
          const errors: unknown[] = [];
          const value = jsonc.parse(text, errors, { allowTrailingComma: true });
          if (errors.length) throw new Error("Invalid JSONC configuration");
          return value;
        });
      } catch {
        // JSON and YAML remain supported without markdownlint-cli's JSONC parser.
      }
      parsers.push((text) => load(text) as Configuration);
      return { ...api, parsers };
    } catch {
      // Try the next installation without downloading a package.
    }
  }
  throw new Error(
    "markdownlint not available; install markdownlint-cli in the project to validate plans.",
  );
}

function planLintConfig(
  repoRoot: string,
  api: Awaited<ReturnType<typeof markdownlintApi>>,
): Configuration {
  let config: Configuration | undefined;
  // Merge ancestor .markdownlintrc files from outermost to nearest, like the CLI.
  const rcPaths: string[] = [];
  for (let dir = repoRoot; ; dir = dirname(dir)) {
    const candidate = join(dir, ".markdownlintrc");
    if (existsSync(candidate)) rcPaths.unshift(candidate);
    if (dirname(dir) === dir) break;
  }
  for (const file of rcPaths) config = { ...config, ...api.readConfig(file, api.parsers) };
  for (const ext of ["jsonc", "json", "yaml", "yml"]) {
    const file = join(repoRoot, `.markdownlint.${ext}`);
    if (existsSync(file)) {
      config = { ...config, ...api.readConfig(file, api.parsers) };
      break;
    }
  }
  return config ?? DEFAULT_MARKDOWNLINT_CONFIG;
}

// Lint rendered source before formatting or replacing an existing schedule plan.
// A string input bypasses ignore globs for generated history directories.
export async function assertPlanMarkdownlint(
  repoRoot: string,
  taskId: string,
  outPath: string,
  content: string,
): Promise<void> {
  const planPath = relative(repoRoot, outPath);
  const label = `Task ${taskId}, plan ${planPath}`;
  let errors: string;
  try {
    const api = await markdownlintApi(repoRoot);
    const issues =
      api.lint({
        strings: { [planPath]: content },
        config: planLintConfig(repoRoot, api),
        configParsers: api.parsers,
      })[planPath] ?? [];
    errors = issues
      .map(
        (issue) =>
          `${planPath}: ${issue.lineNumber} ${issue.ruleNames.join("/")} ${issue.ruleDescription}${issue.errorDetail ? ` [${issue.errorDetail}]` : ""}`,
      )
      .join("\n");
  } catch (error) {
    throw new Error(
      `${label}: Failed to run markdownlint before plan generation: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  if (errors)
    throw new Error(`${label}: Plan Markdown notation violation before generation\n${errors}`);
}
