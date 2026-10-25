import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Keep ordinary kata Markdown on the standard parser. Existing decks with other
// names can be added to the displayed overrides and ignore patterns by the user.
export const SLIDEV_KATA_PATTERNS = [
  "docs/ja/specdojo/samples/**/*-slidev-sample.md",
  "docs/ja/specdojo/templates/**/*-slidev-template.md",
] as const;

const DEV_DEPENDENCIES = {
  "@slidev/cli": "^53.0.0",
  "prettier-plugin-slidev": "^1.0.5",
  prettier: "^3.8.4",
};

const PRETTIER_CONFIG = {
  overrides: [
    {
      files: SLIDEV_KATA_PATTERNS,
      options: { parser: "slidev", plugins: ["prettier-plugin-slidev"] },
    },
  ],
};

const PRETTIER_CONFIG_FILES = [
  ".prettierrc",
  ...["json", "json5", "yml", "yaml", "js", "ts", "mjs", "mts", "cjs", "cts", "toml"].map(
    (extension) => `.prettierrc.${extension}`,
  ),
  ...["js", "ts", "mjs", "mts", "cjs", "cts"].map((extension) => `prettier.config.${extension}`),
];

type JsonObject = Record<string, unknown>;

function isRecord(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function runSlidevScaffold(opts: {
  repoRoot: string;
  dryRun: boolean;
}): Promise<void> {
  const packagePath = path.join(opts.repoRoot, "package.json");
  const packageContent = existsSync(packagePath) ? await readFile(packagePath, "utf8") : undefined;
  const parsed: unknown = packageContent === undefined ? {} : JSON.parse(packageContent);
  if (!isRecord(parsed)) throw new Error(`Invalid ${packagePath}: expected an object`);
  for (const field of ["dependencies", "devDependencies"]) {
    if (parsed[field] !== undefined && !isRecord(parsed[field])) {
      throw new Error(`Invalid ${packagePath}: ${field} must be an object`);
    }
  }
  const dependencies = isRecord(parsed.dependencies) ? parsed.dependencies : {};
  const devDependencies = isRecord(parsed.devDependencies) ? parsed.devDependencies : {};
  const additions = Object.fromEntries(
    Object.entries(DEV_DEPENDENCIES).filter(
      ([name]) => !Object.hasOwn(dependencies, name) && !Object.hasOwn(devDependencies, name),
    ),
  );
  process.stdout.write(
    `Planned package.json additions (Slidev):\n${JSON.stringify({ devDependencies: additions }, null, 2)}\n`,
  );
  for (const name of Object.keys(DEV_DEPENDENCIES)) {
    if (Object.hasOwn(dependencies, name) || Object.hasOwn(devDependencies, name)) {
      process.stdout.write(`Skipped (dependency already exists): ${name} in package.json\n`);
    }
  }
  if (packageContent === undefined) {
    process.stdout.write(
      "Skipped package.json update (not found). Create it and add the entries above.\n",
    );
  }

  const prettierConfig = Object.hasOwn(parsed, "prettier")
    ? "package.json#prettier"
    : PRETTIER_CONFIG_FILES.find((file) => existsSync(path.join(opts.repoRoot, file)));
  const prettierContent = `${JSON.stringify(PRETTIER_CONFIG, null, 2)}\n`;
  process.stdout.write(`Planned Slidev Prettier overrides:\n${prettierContent}`);
  if (prettierConfig) {
    process.stdout.write(
      `Kept existing ${prettierConfig}. Merge the overrides above manually for your Slidev kata paths.\n`,
    );
  }
  const ignorePath = path.join(opts.repoRoot, ".markdownlintignore");
  const ignoreExists = existsSync(ignorePath);
  const ignoreContent = `${SLIDEV_KATA_PATTERNS.join("\n")}\n`;
  process.stdout.write(`Planned Slidev .markdownlintignore entries:\n${ignoreContent}`);
  if (ignoreExists) {
    process.stdout.write(
      "Kept existing .markdownlintignore. Add any missing patterns above manually.\n",
    );
  }

  // Preview all additions before the first write, including on a normal run.
  if (opts.dryRun) {
    if (packageContent !== undefined && Object.keys(additions).length > 0) {
      process.stdout.write("[dry-run] would update: package.json\n");
    }
    if (!prettierConfig) process.stdout.write("[dry-run] would write: .prettierrc\n");
    if (!ignoreExists) process.stdout.write("[dry-run] would write: .markdownlintignore\n");
    return;
  }
  if (packageContent !== undefined && Object.keys(additions).length > 0) {
    parsed.devDependencies = { ...devDependencies, ...additions };
    const indent = packageContent.match(/^([\t ]+)\S/m)?.[1] ?? "  ";
    await writeFile(packagePath, `${JSON.stringify(parsed, null, indent)}\n`, "utf8");
    process.stdout.write("Updated: package.json\n");
  }
  if (!prettierConfig) {
    await writeFile(path.join(opts.repoRoot, ".prettierrc"), prettierContent, "utf8");
    process.stdout.write("Written: .prettierrc\n");
  }
  if (!ignoreExists) {
    await writeFile(ignorePath, ignoreContent, "utf8");
    process.stdout.write("Written: .markdownlintignore\n");
  }
  process.stdout.write(
    "Next steps (Slidev):\n" +
      "  1. Review the additions and any manual merges above, then run npm install.\n" +
      "  2. Install the theme used by the kata and supply its project-specific components/assets.\n" +
      '  3. Run ./node_modules/.bin/slidev build <kata-sample.md> --out "$PWD/tmp/slidev-dist".\n' +
      "  See docs/ja/specdojo/guides/kata-guide.md for the verification workflow.\n",
  );
}
