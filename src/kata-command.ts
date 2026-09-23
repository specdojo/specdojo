import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { type Command } from "commander";
import yaml from "js-yaml";
import { readSpecdojoNamespace } from "./frontmatter-namespace.js";
import { type SpecdojoResolutionRoots, specdojoResourceCandidates } from "./template-resolution.js";

export const KATA_RESOURCE_KINDS = [
  "rulebook",
  "standard",
  "recipe",
  "sample",
  "template",
] as const;

// eject できない参照固定の種別。CLI のバージョンと対応するため利用リポジトリへ複製しない。
export const KATA_REFERENCED_KINDS = ["exec-template", "schema"] as const;

export type KataResourceKind = (typeof KATA_RESOURCE_KINDS)[number];
export type KataReferencedKind = (typeof KATA_REFERENCED_KINDS)[number];
export type KataListKind = KataResourceKind | KataReferencedKind;
export type KataResourceSource = "repository" | "node_modules";
export type KataResourceState = "ejected" | "referenced";
export type KataResourceDifference = "same" | "modified" | "package-missing" | "-";

export type KataResource = {
  id: string;
  kind: KataListKind;
  ejectable: boolean;
  relativePath: string;
  repositoryPath?: string;
  bundledPath?: string;
  resolvedPath: string;
  source: KataResourceSource;
  state: KataResourceState;
  difference: KataResourceDifference;
};

export type KataCopyResult = {
  id: string;
  kind: KataResourceKind;
  relativePath: string;
  action: "copy" | "overwrite" | "skip";
};

type ResourceKindConfig =
  | { kind: KataResourceKind; relativeDir: string; ejectable: true }
  | { kind: "exec-template" | "schema"; relativeDir: string; ejectable: false };

type EjectableResourceKindConfig = Extract<ResourceKindConfig, { ejectable: true }>;

const RESOURCE_KINDS: readonly ResourceKindConfig[] = [
  { kind: "rulebook", relativeDir: "docs/ja/specdojo/rulebooks", ejectable: true },
  { kind: "standard", relativeDir: "docs/ja/specdojo/standards", ejectable: true },
  { kind: "recipe", relativeDir: "docs/ja/specdojo/recipes", ejectable: true },
  { kind: "sample", relativeDir: "docs/ja/specdojo/samples", ejectable: true },
  { kind: "template", relativeDir: "docs/ja/specdojo/templates", ejectable: true },
  {
    kind: "exec-template",
    relativeDir: "docs/ja/specdojo/exec-templates",
    ejectable: false,
  },
  { kind: "schema", relativeDir: "docs/ja/specdojo/schemas", ejectable: false },
  { kind: "schema", relativeDir: "docs/specdojo/schemas", ejectable: false },
];

function isEjectableKind(kind: KataListKind): kind is KataResourceKind {
  return (KATA_RESOURCE_KINDS as readonly string[]).includes(kind);
}

const EJECTABLE_KINDS = RESOURCE_KINDS.filter(
  (config): config is EjectableResourceKindConfig => config.ejectable,
);

function normalizeRelativePath(value: string): string {
  return value.replaceAll("\\", "/");
}

function filesBelow(root: string): string[] {
  if (!existsSync(root)) return [];
  const files: string[] = [];
  const visit = (current: string): void => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (entry.name === "generated") continue;
      const absolutePath = join(current, entry.name);
      if (entry.isDirectory()) visit(absolutePath);
      else if (entry.isFile()) files.push(absolutePath);
    }
  };
  visit(root);
  return files.sort();
}

function parseDataFileId(content: string, extension: string): string | undefined {
  let parsed: unknown;
  try {
    parsed = extension === ".json" ? JSON.parse(content) : yaml.load(content);
  } catch {
    return undefined;
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return undefined;
  const id = (parsed as Record<string, unknown>).id;
  return typeof id === "string" && id !== "" ? id : undefined;
}

function resourceId(absolutePath: string): string {
  const content = readFileSync(absolutePath, "utf8");
  const extension = extname(absolutePath).toLowerCase();
  if (extension === ".md" || extension === ".mdx") {
    const id = readSpecdojoNamespace(content).id;
    if (typeof id === "string" && id !== "") return id;
  } else if ([".yaml", ".yml", ".json"].includes(extension)) {
    const id = parseDataFileId(content, extension);
    if (id) return id;
  }
  return basename(absolutePath, extension);
}

function sameContents(first: string, second: string): boolean {
  return readFileSync(first).equals(readFileSync(second));
}

function pathsForConfig(
  config: ResourceKindConfig,
  roots: SpecdojoResolutionRoots,
): { repositoryDir: string; bundledDir: string } {
  const paths = specdojoResourceCandidates(config.relativeDir, roots);
  return { repositoryDir: paths.repositoryPath, bundledDir: paths.bundledPath };
}

function relativeFiles(root: string): string[] {
  return filesBelow(root).map((filePath) => normalizeRelativePath(relative(root, filePath)));
}

function enumerateConfig(
  config: ResourceKindConfig,
  roots: SpecdojoResolutionRoots,
): KataResource[] {
  const { repositoryDir, bundledDir } = pathsForConfig(config, roots);
  const relativePaths = [
    ...new Set([...relativeFiles(repositoryDir), ...relativeFiles(bundledDir)]),
  ];
  return relativePaths.sort().map((filePath) => {
    const repositoryPath = resolve(repositoryDir, filePath);
    const bundledPath = resolve(bundledDir, filePath);
    const hasRepositoryFile = existsSync(repositoryPath);
    const hasBundledFile = existsSync(bundledPath);
    const resolvedPath = hasRepositoryFile ? repositoryPath : bundledPath;
    const source: KataResourceSource = hasRepositoryFile ? "repository" : "node_modules";
    return {
      id: resourceId(resolvedPath),
      kind: config.kind,
      ejectable: config.ejectable,
      relativePath: normalizeRelativePath(join(config.relativeDir, filePath)),
      repositoryPath: hasRepositoryFile ? repositoryPath : undefined,
      bundledPath: hasBundledFile ? bundledPath : undefined,
      resolvedPath,
      source,
      state: hasRepositoryFile ? "ejected" : "referenced",
      difference: hasRepositoryFile
        ? hasBundledFile
          ? sameContents(repositoryPath, bundledPath)
            ? "same"
            : "modified"
          : "package-missing"
        : "-",
    };
  });
}

const ALL_LIST_KINDS: readonly string[] = [...KATA_RESOURCE_KINDS, ...KATA_REFERENCED_KINDS];

function assertKind(kind: string | undefined): KataListKind | undefined {
  if (kind === undefined) return undefined;
  if (ALL_LIST_KINDS.includes(kind)) return kind as KataListKind;
  throw new Error(`Unknown kata kind: ${kind}. Expected ${ALL_LIST_KINDS.join(" | ")}.`);
}

// 既定は eject できる種別だけを返す。`all` は参照固定の exec-template / schema も含める。
// 参照固定の種別は ID を知る手段が他に無いため、一覧から辿れるようにしておく。
export function listKataResources(
  options: { kind?: string; all?: boolean; roots?: SpecdojoResolutionRoots } = {},
): KataResource[] {
  const kind = assertKind(options.kind);
  const configs =
    options.all || (kind !== undefined && !isEjectableKind(kind))
      ? RESOURCE_KINDS
      : EJECTABLE_KINDS;
  return configs
    .filter((config) => kind === undefined || config.kind === kind)
    .flatMap((config) => enumerateConfig(config, options.roots ?? {}))
    .sort(
      (first, second) =>
        first.kind.localeCompare(second.kind) ||
        first.relativePath.localeCompare(second.relativePath),
    );
}

function localId(id: string): string {
  return id.includes(":") ? id.slice(id.lastIndexOf(":") + 1) : id;
}

function selectById(resources: KataResource[], id: string): KataResource {
  const exact = resources.filter((resource) => resource.id === id);
  const matches =
    exact.length > 0 ? exact : resources.filter((resource) => localId(resource.id) === id);
  if (matches.length === 0) throw new Error(`Kata not found: ${id}`);
  if (matches.length > 1) {
    throw new Error(
      `Kata ID is ambiguous: ${id}\n${matches.map((resource) => `- ${resource.id} (${resource.kind})`).join("\n")}`,
    );
  }
  return matches[0];
}

// show は読み取りのみのため、参照固定の種別も対象にする。
export function findKataResource(
  id: string,
  options: { kind?: string; roots?: SpecdojoResolutionRoots } = {},
): KataResource {
  return selectById(listKataResources({ ...options, all: true }), id);
}

type BundledResource = {
  id: string;
  config: ResourceKindConfig;
  relativePath: string;
  sourcePath: string;
  destinationPath: string;
};

function bundledResources(
  configs: readonly ResourceKindConfig[],
  roots: SpecdojoResolutionRoots,
): BundledResource[] {
  return configs.flatMap((config) => {
    const { repositoryDir, bundledDir } = pathsForConfig(config, roots);
    return relativeFiles(bundledDir).map((filePath) => ({
      id: resourceId(resolve(bundledDir, filePath)),
      config,
      relativePath: normalizeRelativePath(join(config.relativeDir, filePath)),
      sourcePath: resolve(bundledDir, filePath),
      destinationPath: resolve(repositoryDir, filePath),
    }));
  });
}

function selectBundledById(resources: BundledResource[], id: string): BundledResource {
  const exact = resources.filter((resource) => resource.id === id);
  const matches =
    exact.length > 0 ? exact : resources.filter((resource) => localId(resource.id) === id);
  if (matches.length === 0) throw new Error(`Bundled kata not found: ${id}`);
  if (matches.length > 1) {
    throw new Error(
      `Bundled kata ID is ambiguous: ${id}\n${matches
        .map((resource) => `- ${resource.id} (${resource.config.kind})`)
        .join("\n")}`,
    );
  }
  return matches[0];
}

function copyBundledResource(
  resource: BundledResource,
  options: { dryRun?: boolean; force?: boolean },
): KataCopyResult {
  if (!resource.config.ejectable) {
    throw new Error(`Internal error: ${resource.config.kind} is not ejectable.`);
  }
  const exists = existsSync(resource.destinationPath);
  const samePath = resolve(resource.sourcePath) === resolve(resource.destinationPath);
  const action: KataCopyResult["action"] =
    samePath || (exists && !options.force) ? "skip" : exists ? "overwrite" : "copy";

  if (action !== "skip" && !options.dryRun) {
    mkdirSync(dirname(resource.destinationPath), { recursive: true });
    copyFileSync(resource.sourcePath, resource.destinationPath);
  }
  return {
    id: resource.id,
    kind: resource.config.kind,
    relativePath: resource.relativePath,
    action,
  };
}

export function ejectKata(
  id: string,
  options: { dryRun?: boolean; force?: boolean; roots?: SpecdojoResolutionRoots } = {},
): KataCopyResult {
  const resource = selectBundledById(bundledResources(RESOURCE_KINDS, options.roots ?? {}), id);
  if (!resource.config.ejectable) {
    throw new Error(
      `Cannot eject ${resource.config.kind} '${resource.id}': ${resource.config.relativeDir} is tied to the installed SpecDojo version and must remain package-referenced.`,
    );
  }
  return copyBundledResource(resource, options);
}

export function installAllKata(
  options: { dryRun?: boolean; force?: boolean; roots?: SpecdojoResolutionRoots } = {},
): KataCopyResult[] {
  return bundledResources(EJECTABLE_KINDS, options.roots ?? {}).map((resource) =>
    copyBundledResource(resource, options),
  );
}

function printCommandError(error: unknown): void {
  process.stdout.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}

function printCopyResult(result: KataCopyResult, dryRun: boolean): void {
  const prefix = dryRun ? "DRY-RUN" : result.action.toUpperCase();
  process.stdout.write(
    `${prefix}\t${result.action}\t${result.kind}\t${result.id}\t${result.relativePath}\n`,
  );
}

export function registerKataCommands(program: Command): void {
  const kata = program.command("kata").description("Inspect and copy SpecDojo kata resources");

  kata
    .command("list")
    .description("List resolved kata resources and their source")
    .option("--kind <kind>", `Filter by kind (${ALL_LIST_KINDS.join(" | ")})`)
    .option("--all", "Include exec-template and schema, which cannot be ejected", false)
    .option("--dry-run", "Read-only compatibility option", false)
    .action((opts) => {
      try {
        process.stdout.write("KIND\tSOURCE\tEJECTABLE\tID\tPATH\n");
        for (const resource of listKataResources({ kind: opts.kind, all: opts.all })) {
          process.stdout.write(
            `${resource.kind}\t${resource.source}\t${resource.ejectable ? "yes" : "no"}\t${resource.id}\t${resource.relativePath}\n`,
          );
        }
      } catch (error) {
        printCommandError(error);
      }
    });

  kata
    .command("show")
    .description("Show a kata resource using repository-first resolution")
    .argument("<id>", "Kata document ID")
    .option("--kind <kind>", `Limit lookup to one kind (${KATA_RESOURCE_KINDS.join(" | ")})`)
    .option("--dry-run", "Read-only compatibility option", false)
    .action((id, opts) => {
      try {
        const resource = findKataResource(id, { kind: opts.kind });
        const content = readFileSync(resource.resolvedPath, "utf8");
        process.stdout.write(content.endsWith("\n") ? content : `${content}\n`);
      } catch (error) {
        printCommandError(error);
      }
    });

  kata
    .command("status")
    .description("Show referenced/ejected state and package differences")
    .option("--kind <kind>", `Filter by kind (${KATA_RESOURCE_KINDS.join(" | ")})`)
    .option("--dry-run", "Read-only compatibility option", false)
    .action((opts) => {
      try {
        process.stdout.write("KIND\tSTATUS\tDIFF\tID\tPATH\n");
        for (const resource of listKataResources({ kind: opts.kind })) {
          process.stdout.write(
            `${resource.kind}\t${resource.state}\t${resource.difference}\t${resource.id}\t${resource.relativePath}\n`,
          );
        }
      } catch (error) {
        printCommandError(error);
      }
    });

  kata
    .command("eject")
    .description("Copy one bundled kata resource to its canonical repository path")
    .requiredOption("--id <id>", "Bundled kata document ID")
    .option("--dry-run", "Print the copy action without writing", false)
    .option("--force", "Overwrite an existing repository file", false)
    .action((opts) => {
      try {
        printCopyResult(
          ejectKata(opts.id, { dryRun: opts.dryRun, force: opts.force }),
          opts.dryRun,
        );
      } catch (error) {
        printCommandError(error);
      }
    });

  kata
    .command("install")
    .description("Copy all ejectable bundled kata resources to the repository")
    .requiredOption("--all", "Copy all rulebooks, standards, recipes, samples, and templates")
    .option("--dry-run", "Print copy actions without writing", false)
    .option("--force", "Overwrite existing repository files", false)
    .action((opts) => {
      try {
        for (const result of installAllKata({ dryRun: opts.dryRun, force: opts.force })) {
          printCopyResult(result, opts.dryRun);
        }
      } catch (error) {
        printCommandError(error);
      }
    });
}
