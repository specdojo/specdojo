import { createInterface } from "node:readline/promises";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import type { Command } from "commander";
import yaml from "js-yaml";
import { runScaffold, type ProjectSize } from "./catalog-scaffold.js";
import { runDevcontainerScaffold } from "./devcontainer-scaffold.js";
import { runProviderScaffold } from "./exec-provider-scaffold.js";
import { generateDerivedViewFiles, type RegisterPaths } from "./register.js";
import {
  defaultWorktreeBase,
  projectGitignoreLayout,
  specdojoRootDir,
  type ProjectMember,
  type SpecDojoConfig,
  type SpecDojoProjectConfig,
} from "./specdojo-config.js";
import {
  ensureGitignore,
  formatGitignoreReport,
  gitignorePatternsForLayouts,
} from "./specdojo-gitignore.js";
import { specdojoPackageRootDir } from "./package-paths.js";

const PROVIDERS = ["claude", "codex", "opencode", "antigravity", "copilot"] as const;
type InitProvider = (typeof PROVIDERS)[number];

const PARENT_VALIDATION_SCRIPTS = {
  "lint-ts": "lint:ts",
  "lint-fm": "lint:fm",
  "lint-md": "lint:md",
  "test-integration": "test:integration",
  "validate-schema": "validate:schema",
  typecheck: "typecheck",
  "test-unit": "test:unit",
} as const;

export type InitOptions = {
  yes?: boolean;
  project?: string;
  name?: string;
  register?: boolean;
  nickname?: string;
  displayName?: string;
  provider?: string;
  exec?: boolean;
  catalog?: string;
  devcontainer?: boolean;
  dryRun?: boolean;
};

export type InitAnswers = {
  projectId: string;
  projectName: string;
  register: boolean;
  nickname: string;
  displayName: string;
  providers: InitProvider[];
  exec: boolean;
  catalog?: ProjectSize;
  devcontainer: boolean;
};

export interface InitPrompter {
  question(prompt: string): Promise<string>;
  close(): void;
}

const DEFAULTS = {
  projectId: "prj-0001",
  projectName: "My Project",
  nickname: "owner",
  displayName: "Project Owner",
  providers: ["codex"] as InitProvider[],
} as const;

function parseBoolean(answer: string, defaultValue: boolean): boolean {
  const normalized = answer.trim().toLowerCase();
  if (!normalized) return defaultValue;
  if (["y", "yes", "true", "1", "はい"].includes(normalized)) return true;
  if (["n", "no", "false", "0", "いいえ"].includes(normalized)) return false;
  throw new Error(`yes/no で答えてください: ${answer}`);
}

function parseProviders(value: string | undefined): InitProvider[] {
  const raw = value?.trim();
  if (!raw) return [...DEFAULTS.providers];
  if (raw === "none" || raw === "-") return [];
  const providers = [
    ...new Set(
      raw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];
  const unknown = providers.filter(
    (provider): provider is string => !PROVIDERS.includes(provider as InitProvider),
  );
  if (unknown.length > 0) {
    throw new Error(`Unknown provider: ${unknown.join(", ")}. Available: ${PROVIDERS.join(", ")}`);
  }
  return providers as InitProvider[];
}

function parseCatalog(value: string | undefined): ProjectSize | undefined {
  const normalized = value?.trim().toLowerCase();
  if (!normalized || normalized === "none" || normalized === "-") return undefined;
  if (normalized === "small" || normalized === "medium" || normalized === "large") {
    return normalized;
  }
  throw new Error(`Invalid catalog size: ${value}. Must be small, medium, large, or none`);
}

function validateAnswers(answers: InitAnswers): InitAnswers {
  if (!/^prj-[0-9]{4,}$/.test(answers.projectId)) {
    throw new Error(`Invalid project ID: ${answers.projectId}. Expected prj-0001 style`);
  }
  if (!answers.projectName.trim()) throw new Error("Project name must not be empty");
  if (!/^[a-z0-9][a-z0-9_-]{0,62}$/.test(answers.nickname)) {
    throw new Error(`Invalid nickname: ${answers.nickname}`);
  }
  if (!answers.displayName.trim()) throw new Error("Display name must not be empty");
  if (answers.exec && answers.providers.length === 0) {
    throw new Error("--exec requires at least one --provider");
  }
  return answers;
}

export async function collectInitAnswers(
  options: InitOptions,
  prompter?: InitPrompter,
): Promise<InitAnswers> {
  if (!prompter) {
    const answers = validateAnswers({
      projectId: options.project?.trim() || DEFAULTS.projectId,
      projectName: options.name?.trim() || DEFAULTS.projectName,
      register: options.register !== false,
      nickname: options.nickname?.trim() || DEFAULTS.nickname,
      displayName: options.displayName?.trim() || DEFAULTS.displayName,
      providers: parseProviders(options.provider),
      exec: !!options.exec,
      catalog: parseCatalog(options.catalog),
      devcontainer: !!options.devcontainer,
    });
    for (const [label, used] of [
      ["project", !options.project],
      ["name", !options.name],
      ["nickname", !options.nickname],
      ["display-name", !options.displayName],
      ["provider", !options.provider],
      ["register=yes", options.register !== false],
      ["exec=no", !options.exec],
      ["catalog=none", !options.catalog],
      ["devcontainer=no", !options.devcontainer],
    ] as const) {
      if (used) process.stdout.write(`Using default: ${label}\n`);
    }
    return answers;
  }

  try {
    const projectDefault = options.project?.trim() || DEFAULTS.projectId;
    const nameDefault = options.name?.trim() || DEFAULTS.projectName;
    const registerDefault = options.register !== false;
    const nicknameDefault = options.nickname?.trim() || DEFAULTS.nickname;
    const displayNameDefault = options.displayName?.trim() || DEFAULTS.displayName;
    const providerDefault = options.provider?.trim() || DEFAULTS.providers.join(",");
    const execDefault = !!options.exec;
    const catalogDefault = options.catalog?.trim() || "none";
    const devcontainerDefault = !!options.devcontainer;
    const projectId =
      (await prompter.question(`Project ID [${projectDefault}]: `)).trim() || projectDefault;
    const projectName =
      (await prompter.question(`Project name [${nameDefault}]: `)).trim() || nameDefault;
    const register = parseBoolean(
      await prompter.question(`Create a project register? [${registerDefault ? "Y/n" : "y/N"}]: `),
      registerDefault,
    );
    const nickname =
      (await prompter.question(`Your nickname [${nicknameDefault}]: `)).trim() || nicknameDefault;
    const displayName =
      (await prompter.question(`Your display name [${displayNameDefault}]: `)).trim() ||
      displayNameDefault;
    const providers = parseProviders(
      (await prompter.question(
        `Orchestrator providers (${PROVIDERS.join(", ")}) [${providerDefault}]: `,
      )) || providerDefault,
    );
    const exec = parseBoolean(
      await prompter.question(`Delegate work to agents (exec)? [${execDefault ? "Y/n" : "y/N"}]: `),
      execDefault,
    );
    const catalog = parseCatalog(
      (await prompter.question(
        `Deliverables catalog (none|small|medium|large) [${catalogDefault}]: `,
      )) || catalogDefault,
    );
    const devcontainer = parseBoolean(
      await prompter.question(`Create a Dev Container? [${devcontainerDefault ? "Y/n" : "y/N"}]: `),
      devcontainerDefault,
    );
    return validateAnswers({
      projectId,
      projectName,
      register,
      nickname,
      displayName,
      providers,
      exec,
      catalog,
      devcontainer,
    });
  } finally {
    prompter.close();
  }
}

function buildConfig(answers: InitAnswers, repoRoot: string): SpecDojoConfig {
  const project: SpecDojoProjectConfig = {
    base_path: `docs/ja/projects/${answers.projectId}`,
    ...(answers.catalog ? { catalog_path: "010-deliverables-catalog" } : {}),
    members_path: "030-project-management/pm-members.yaml",
    ...(answers.register ? { project_register_path: "controls/project-register" } : {}),
    project_context: ["prj-overview"],
    run: {
      ...(answers.exec ? { exec_defaults: ".specdojo/exec-defaults.yaml" } : {}),
      worktree_base: defaultWorktreeBase(repoRoot),
    },
  };
  return {
    version: 1,
    current_project: answers.projectId,
    ...(answers.exec ? { agent_members_path: ".specdojo/agent-members.yaml" } : {}),
    projects: { [answers.projectId]: project },
  };
}

function writeNewFile(
  repoRoot: string,
  relPath: string,
  content: string,
  dryRun: boolean,
): boolean {
  const path = join(repoRoot, relPath);
  if (existsSync(path)) {
    process.stdout.write(`Skipped (already exists): ${relPath}\n`);
    return false;
  }
  if (dryRun) {
    process.stdout.write(`[dry-run] would write: ${relPath}\n`);
    return true;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
  process.stdout.write(`Created: ${relPath}\n`);
  return true;
}

function humanRoster(answers: InitAnswers): string {
  return yaml.dump(
    {
      id: `${answers.projectId}:pm-members`,
      type: "project",
      status: "draft",
      title: `${answers.projectName} メンバー名簿`,
      rulebook: "specdojo:pm-members-rulebook",
      version: 1,
      project_id: answers.projectId,
      members: [
        {
          nickname: answers.nickname,
          display_name: answers.displayName,
          email: null,
          roles: [],
          type: "human",
          persona: "final-decision-maker",
          scheduler_strategy: "critical-first",
        },
      ],
    },
    { lineWidth: 120, noRefs: true },
  );
}

function loadInitTemplate(packageRoot: string, filename: string): Record<string, unknown> {
  return yaml.load(readFileSync(join(packageRoot, "templates", filename), "utf8")) as Record<
    string,
    unknown
  >;
}

function readPackageScripts(repoRoot: string): Readonly<Record<string, string>> {
  const packageJsonPath = join(repoRoot, "package.json");
  if (!existsSync(packageJsonPath)) return {};
  try {
    const parsed = JSON.parse(readFileSync(packageJsonPath, "utf8")) as { scripts?: unknown };
    if (!parsed.scripts || typeof parsed.scripts !== "object" || Array.isArray(parsed.scripts)) {
      return {};
    }
    return Object.fromEntries(
      Object.entries(parsed.scripts).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
      ),
    );
  } catch {
    return {};
  }
}

function selectParentValidations(repoRoot: string, configured: unknown): string[] {
  const scripts = readPackageScripts(repoRoot);
  const candidates = Array.isArray(configured)
    ? configured.filter((entry): entry is string => typeof entry === "string")
    : [];
  const selected: string[] = [];
  for (const id of candidates) {
    const script = PARENT_VALIDATION_SCRIPTS[id as keyof typeof PARENT_VALIDATION_SCRIPTS];
    if (script && Object.hasOwn(scripts, script)) {
      selected.push(id);
      process.stdout.write(`Included parent validation: ${id} (npm run ${script})\n`);
    } else {
      const reason = script
        ? `package.json script "${script}" was not found`
        : "validation ID is not supported by specdojo init";
      process.stdout.write(`Skipped parent validation: ${id} (${reason})\n`);
    }
  }
  if (selected.length === 0) {
    process.stdout.write(
      "Omitted pipeline.parent_validations: no supported npm scripts were found in package.json.\n",
    );
  }
  return selected;
}

type ExecAgentNames = { executor: string; reporter: string };

function writeExecConfiguration(
  repoRoot: string,
  packageRoot: string,
  providers: InitProvider[],
  dryRun: boolean,
): ExecAgentNames {
  const memberTemplate = loadInitTemplate(packageRoot, "init-agent-members.yaml") as {
    version: number;
    members: ProjectMember[];
  };
  const defaultsTemplate = loadInitTemplate(packageRoot, "init-exec-defaults.yaml") as {
    providers: Record<string, unknown>;
    [key: string]: unknown;
  };
  const selected = new Set(providers);
  const members = memberTemplate.members.filter(
    (member) => member.provider && selected.has(member.provider as InitProvider),
  );
  const providerDefaults = Object.fromEntries(
    Object.entries(defaultsTemplate.providers).filter(([provider]) =>
      selected.has(provider as InitProvider),
    ),
  );
  const { providers: _providers, ...commonDefaults } = defaultsTemplate;
  const commonPipeline =
    commonDefaults.pipeline && typeof commonDefaults.pipeline === "object"
      ? (commonDefaults.pipeline as Record<string, unknown>)
      : {};
  const { parent_validations: configuredParentValidations, ...otherPipeline } = commonPipeline;
  const parentValidations = selectParentValidations(repoRoot, configuredParentValidations);
  const configuredDefaults: Record<string, unknown> = { ...commonDefaults };
  if (parentValidations.length > 0 || Object.keys(otherPipeline).length > 0) {
    configuredDefaults.pipeline = {
      ...otherPipeline,
      ...(parentValidations.length > 0 ? { parent_validations: parentValidations } : {}),
    };
  } else {
    delete configuredDefaults.pipeline;
  }
  writeNewFile(
    repoRoot,
    ".specdojo/agent-members.yaml",
    yaml.dump({ version: 1, members }, { lineWidth: 120, noRefs: true }),
    dryRun,
  );
  writeNewFile(
    repoRoot,
    ".specdojo/exec-defaults.yaml",
    yaml.dump(
      { ...configuredDefaults, providers: providerDefaults },
      { lineWidth: 120, noRefs: true },
    ),
    dryRun,
  );
  const primaryProvider = providers[0];
  const executor = members.find(
    (member) =>
      member.provider === primaryProvider &&
      member.stage_role === "executor" &&
      member.mode === "edit",
  );
  const reporter = members.find(
    (member) => member.provider === primaryProvider && member.stage_role === "reporter",
  );
  if (!executor || !reporter) {
    throw new Error("init-agent-members.yaml must define an edit executor and reporter");
  }
  return { executor: executor.nickname, reporter: reporter.nickname };
}

function scaffoldRegister(
  repoRoot: string,
  config: SpecDojoConfig,
  answers: InitAnswers,
  dryRun: boolean,
): void {
  if (!answers.register) return;
  const basePath = config.projects[answers.projectId].base_path as string;
  const registerRel = join(basePath, "controls/project-register");
  const registerPath = join(repoRoot, registerRel);
  const paths: RegisterPaths = {
    projectId: answers.projectId,
    projectRegisterPath: registerPath,
    executionPath: join(repoRoot, basePath, "execution"),
    pjrIndexPath: join(registerPath, "pjr-index.md"),
    generatedPath: join(registerPath, "generated"),
    controlsGeneratedPath: join(repoRoot, basePath, "controls/generated"),
    registerDateTimeZone: "UTC",
  };
  for (const view of generateDerivedViewFiles(paths, "all")) {
    writeNewFile(repoRoot, relative(repoRoot, view.path), view.content, dryRun);
  }
}

function catalogTemplateEntries(
  packageRoot: string,
): Array<{ file: string; domain: string; name: string }> {
  const templateDir = join(packageRoot, "docs/ja/specdojo/templates");
  return readdirSync(templateDir)
    .filter((file) => /^dct-.+-template\.yaml$/.test(file))
    .sort()
    .map((file) => {
      const doc = yaml.load(readFileSync(join(templateDir, file), "utf8")) as {
        domain: string;
        title?: string;
      };
      return {
        file,
        domain: doc.domain,
        name: doc.title?.replace(/^成果物カタログ（|）$/g, "") || doc.domain,
      };
    });
}

function scaffoldCatalog(
  repoRoot: string,
  packageRoot: string,
  config: SpecDojoConfig,
  answers: InitAnswers,
  dryRun: boolean,
): void {
  if (!answers.catalog) return;
  const project = config.projects[answers.projectId];
  const catalogRel = join(project.base_path as string, project.catalog_path as string);
  const catalogPath = join(repoRoot, catalogRel);
  const templates = catalogTemplateEntries(packageRoot);
  const domains = [...new Map(templates.map((entry) => [entry.domain, entry])).values()];
  writeNewFile(
    repoRoot,
    join(catalogRel, "dct-index.yaml"),
    yaml.dump(
      {
        id: `${answers.projectId}:dct-index`,
        type: "project",
        status: "draft",
        title: `${answers.projectName} 成果物カタログ`,
        rulebook: "specdojo:dct-index-rulebook",
        project_id: answers.projectId,
        size: answers.catalog,
        groups: [
          {
            name: "成果物",
            domains: domains.map(({ domain, name }) => ({
              domain,
              name,
              overview: `${name}の成果物を管理する。`,
            })),
          },
        ],
      },
      { lineWidth: 120, noRefs: true },
    ),
    dryRun,
  );
  if (dryRun) {
    for (const { file } of templates) {
      const relPath = join(catalogRel, file.replace("-template", ""));
      process.stdout.write(
        existsSync(join(repoRoot, relPath))
          ? `Skipped (already exists): ${relPath}\n`
          : `[dry-run] would write: ${relPath}\n`,
      );
    }
    return;
  }
  const outcome = runScaffold({
    catalogPath,
    templatesPath: join(packageRoot, "docs/ja/specdojo/templates"),
    size: answers.catalog,
    projectId: answers.projectId,
    force: false,
  });
  for (const path of outcome.written)
    process.stdout.write(`Created: ${relative(repoRoot, path)}\n`);
  for (const path of outcome.skipped)
    process.stdout.write(`Skipped (already exists): ${relative(repoRoot, path)}\n`);
  for (const warning of outcome.warnings) process.stdout.write(`WARN: ${warning}\n`);
  if (outcome.errors.length > 0) throw new Error(outcome.errors.join("\n"));
}

export async function runInit(
  options: InitOptions,
  deps?: { prompter?: InitPrompter },
): Promise<void> {
  const repoRoot = specdojoRootDir();
  const packageRoot = specdojoPackageRootDir();
  const interactive = !options.yes && !!process.stdin.isTTY && !process.env.CI;
  const prompter =
    deps?.prompter ??
    (interactive ? createInterface({ input: process.stdin, output: process.stdout }) : undefined);
  const answers = await collectInitAnswers(options, prompter);
  const config = buildConfig(answers, repoRoot);
  const dryRun = !!options.dryRun;

  writeNewFile(
    repoRoot,
    ".specdojo/specdojo.config.json",
    `${JSON.stringify(config, null, 2)}\n`,
    dryRun,
  );
  const gitignore = ensureGitignore(
    repoRoot,
    gitignorePatternsForLayouts([projectGitignoreLayout(config.projects[answers.projectId])]),
    { dryRun },
  );
  process.stdout.write(formatGitignoreReport(gitignore, dryRun));
  writeNewFile(
    repoRoot,
    join(
      config.projects[answers.projectId].base_path as string,
      "030-project-management/pm-members.yaml",
    ),
    humanRoster(answers),
    dryRun,
  );
  scaffoldRegister(repoRoot, config, answers, dryRun);

  for (const provider of answers.providers) {
    await runProviderScaffold(provider, {
      packageRoot,
      repoRoot,
      force: false,
      dryRun,
      showNextSteps: false,
    });
  }
  const execAgents = answers.exec
    ? writeExecConfiguration(repoRoot, packageRoot, answers.providers, dryRun)
    : undefined;
  scaffoldCatalog(repoRoot, packageRoot, config, answers, dryRun);
  if (answers.devcontainer) {
    await runDevcontainerScaffold({
      packageRoot,
      repoRoot,
      providers: answers.providers,
      editors: [],
      ollama: answers.providers.includes("opencode"),
      cron: false,
      tmux: false,
      force: false,
      dryRun,
    });
  }

  const firstProvider = answers.providers[0];
  const script =
    firstProvider === "claude"
      ? "orch:sonnet"
      : firstProvider === "antigravity"
        ? "orch:agy"
        : `orch:${firstProvider}`;
  process.stdout.write(
    "Next steps:\n" +
      (firstProvider
        ? `  1. Run npm run ${script} and create the first register item.\n`
        : "  1. Create the first register item.\n") +
      (execAgents
        ? `  2. To run an item without the orchestrator: npx specdojo exec run --register <id> --executor-by ${execAgents.executor} --reporter-by ${execAgents.reporter}\n`
        : "") +
      `  ${execAgents ? "3" : "2"}. Review and commit the files created by specdojo init.\n`,
  );
}

export function registerInitCommand(program: Command): void {
  program
    .command("init")
    .description(
      "Interactively configure a project, orchestrator providers, and optional agent execution",
    )
    .option("--yes", "Use defaults without prompting", false)
    .option("--project <id>", "Project ID (default: prj-0001)")
    .option("--name <name>", "Project display name")
    .option("--no-register", "Do not create the project register")
    .option("--nickname <nickname>", "Human member nickname")
    .option("--display-name <name>", "Human member display name")
    .option("--provider <names>", `Comma-separated providers (${PROVIDERS.join("|")})`)
    .option("--exec", "Configure executor and reporter agents", false)
    .option("--catalog <size>", "Create a deliverables catalog (small|medium|large)")
    .option("--devcontainer", "Create a Dev Container for the selected providers", false)
    .option("--dry-run", "Show planned files and changes without writing", false)
    .action(async (options: InitOptions) => {
      try {
        await runInit(options);
      } catch (error) {
        process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
        process.exitCode = 1;
      }
    });
}
