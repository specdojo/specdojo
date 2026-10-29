import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { dump } from "js-yaml";

// Keep the fallback result check and every scaffold on the same document rules.
export const DEFAULT_MARKDOWNLINT_CONFIG = {
  MD013: false,
  MD024: false,
  MD033: false,
  MD036: false,
  MD041: false,
  MD060: false,
};

// These are the project files read by markdownlint-cli (CLI2 uses a separate config).
export function hasMarkdownlintConfig(repoRoot: string): boolean {
  if (
    ["jsonc", "json", "yaml", "yml"].some((ext) =>
      existsSync(join(repoRoot, `.markdownlint.${ext}`)),
    )
  )
    return true;
  // markdownlint-cli also discovers .markdownlintrc in parent directories.
  for (let dir = repoRoot; ; dir = dirname(dir)) {
    if (existsSync(join(dir, ".markdownlintrc"))) return true;
    if (dirname(dir) === dir) return false;
  }
}

export function ensureMarkdownlintConfig(repoRoot: string, dryRun: boolean): void {
  const hasExistingConfig = readdirSync(repoRoot).some(
    (file) => file.startsWith(".markdownlint.") || file.startsWith(".markdownlint-cli2."),
  );
  if (hasMarkdownlintConfig(repoRoot) || hasExistingConfig) {
    process.stdout.write("Kept existing markdownlint settings.\n");
    return;
  }
  const content = dump(DEFAULT_MARKDOWNLINT_CONFIG);
  if (dryRun) {
    process.stdout.write(`[dry-run] would write: .markdownlint.yaml\n${content}`);
    return;
  }
  writeFileSync(join(repoRoot, ".markdownlint.yaml"), content, { encoding: "utf8", flag: "wx" });
  process.stdout.write("Written: .markdownlint.yaml\n");
}
