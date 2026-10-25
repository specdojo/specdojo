import { existsSync } from "node:fs";
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { dump } from "js-yaml";

const BASE_CONFIG = {
  MD013: false,
  MD024: false,
  MD033: false,
  MD036: false,
  MD041: false,
  MD060: false,
};

// Slide boundaries and per-slide frontmatter interrupt normal Markdown blocks.
// Each slide may start with its own H1 or use a heading level chosen for its layout.
const SLIDEV_CONFIG = {
  MD001: false,
  MD022: false,
  MD025: false,
  MD031: false,
  MD032: false,
};

export async function writeMarkdownlintConfigs(opts: {
  repoRoot: string;
  dryRun: boolean;
  slidevKataPatterns?: readonly string[];
}): Promise<void> {
  const files = await readdir(opts.repoRoot);
  const legacyConfigs = files.filter((file) => file.startsWith(".markdownlint."));
  const cli2Configs = files.filter((file) => file.startsWith(".markdownlint-cli2."));
  const hasRc = existsSync(path.join(opts.repoRoot, ".markdownlintrc"));
  const rcContent = `${JSON.stringify(BASE_CONFIG, null, 2)}\n`;
  const cli2Content = dump({
    config: { extends: ".markdownlintrc" },
    ...(opts.slidevKataPatterns?.length
      ? {
          overrides: [{ filter: opts.slidevKataPatterns, combine: "merge", config: SLIDEV_CONFIG }],
        }
      : {}),
  });

  process.stdout.write(
    `Planned markdownlint base (.markdownlintrc):\n${rcContent}` +
      `Planned markdownlint-cli2 configuration (.markdownlint-cli2.yaml):\n${cli2Content}`,
  );
  if (opts.slidevKataPatterns?.length) {
    process.stdout.write(
      "Place the Slidev override FIRST in markdownlint-cli2 overrides (first match wins).\n",
    );
  }
  if (legacyConfigs.length > 0) {
    process.stdout.write(
      `Kept existing markdownlint config: ${legacyConfigs.join(", ")}.\n` +
        "Migrate its rules to .markdownlintrc (JSON starting with {, without a leading comment), " +
        "then remove the old .markdownlint.* config, including any in parent directories. " +
        "Merge the CLI2 configuration above manually; see docs/ja/specdojo/references/command-reference.md.\n",
    );
  }

  // Do not introduce competing settings or an extends pointing to a missing rc.
  // Existing CLI2 configurations may have their own base; show additions for manual review.
  const canCreateRc = legacyConfigs.length === 0 && cli2Configs.length === 0;
  const canCreateCli2 = legacyConfigs.length === 0 && (hasRc || canCreateRc);
  for (const [filename, content, canCreate] of [
    [".markdownlintrc", rcContent, canCreateRc],
    [".markdownlint-cli2.yaml", cli2Content, canCreateCli2],
  ] as const) {
    const existing = filename === ".markdownlintrc" ? hasRc : cli2Configs.length > 0;
    if (existing || !canCreate) {
      process.stdout.write(
        `Kept existing markdownlint settings. Merge any missing ${filename} entries above manually.\n`,
      );
    } else if (opts.dryRun) {
      process.stdout.write(`[dry-run] would write: ${filename}\n`);
    } else {
      await writeFile(path.join(opts.repoRoot, filename), content, "utf8");
      process.stdout.write(`Written: ${filename}\n`);
    }
  }
}
