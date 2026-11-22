import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  buildInstallCommands,
  COMPANION_PACKAGES,
  detectPackageManager,
  findDeclaredDependency,
  formatCommand,
  type InstallCommand,
  type InstallTarget,
  SPECDOJO_PACKAGE,
} from "./package-manager.js";
import {
  applyDriftCandidate,
  changelogTermsForPath,
  collectDriftCandidates,
  detectProvidersInUse,
  type DriftCandidate,
  snapshotScaffoldSources,
  unifiedDiff,
} from "./scaffold-drift.js";
import {
  type ChangelogSection,
  changelogLinesMentioning,
  changelogSectionsBetween,
  compareVersions,
  CONFIG_CHANGELOG_TERMS,
} from "./version.js";

// specdojo update の手順（版の比較・CHANGELOG・更新・配ったファイルの確かめ）をまとめる。
// npm への問い合わせ、パッケージの取り出し、package manager の実行、対話は deps で差し替える。

export interface UpdateOptions {
  repoRoot: string;
  /** --to の値。省くと npm の latest。 */
  to?: string;
  dryRun: boolean;
  /** --no-interactive のとき false。 */
  interactive: boolean;
  /** --to の相対パスの基準。省くと repoRoot。 */
  cwd?: string;
}

export interface PackageSource {
  name: string;
  version: string;
  tarballPath?: string;
}

export interface UpdateDeps {
  write(text: string): void;
  /** npm の `<name>@<spec>` が指す版を返す。 */
  resolveRegistryVersion(name: string, spec: string): Promise<string>;
  readTarballVersion(tarballPath: string): Promise<string>;
  /** パッケージを destinationDir の下へ取り出し、パッケージのルートを返す。 */
  materializePackage(source: PackageSource, destinationDir: string): Promise<string>;
  /** コマンドを実行して終了コードを返す。 */
  runCommand(command: InstallCommand, cwd: string): Promise<number>;
  ask(question: string): Promise<string>;
  /** stdin が TTY かどうか。 */
  isInteractiveTerminal: boolean;
}

export interface UpdateOutcome {
  currentVersion: string;
  targetVersion: string;
  updated: boolean;
  commands: InstallCommand[];
  candidates: DriftCandidate[];
  applied: string[];
  changedFiles: string[];
}

const MAX_DIFF_LINES = 200;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(filePath, "utf8")) as unknown;
}

async function installedVersion(repoRoot: string, name: string): Promise<string | undefined> {
  const manifest = path.join(repoRoot, "node_modules", ...name.split("/"), "package.json");
  if (!existsSync(manifest)) return undefined;
  const parsed = await readJson(manifest);
  return isRecord(parsed) && typeof parsed.version === "string" ? parsed.version : undefined;
}

function installedRoot(repoRoot: string, name: string): string {
  return path.join(repoRoot, "node_modules", ...name.split("/"));
}

interface ResolvedTarget {
  version: string;
  tarballPath?: string;
  label: string;
}

async function resolveTarget(options: UpdateOptions, deps: UpdateDeps): Promise<ResolvedTarget> {
  const spec = options.to?.trim() || "latest";
  const candidatePath = path.resolve(options.cwd ?? options.repoRoot, spec);
  if (options.to && existsSync(candidatePath)) {
    const version = await deps.readTarballVersion(candidatePath);
    return { version, tarballPath: candidatePath, label: `tarball ${candidatePath}` };
  }
  const version = await deps.resolveRegistryVersion(SPECDOJO_PACKAGE, spec);
  return { version, label: `npm ${SPECDOJO_PACKAGE}@${spec}` };
}

function writeChangelog(deps: UpdateDeps, sections: readonly ChangelogSection[]): void {
  if (sections.length === 0) {
    deps.write("No CHANGELOG sections between the two versions.\n\n");
    return;
  }
  deps.write("CHANGELOG (oldest first):\n\n");
  for (const section of sections) deps.write(`${section.body}\n\n`);
}

function writeConfigNotes(deps: UpdateDeps, sections: readonly ChangelogSection[]): void {
  const lines = changelogLinesMentioning(sections, CONFIG_CHANGELOG_TERMS);
  if (lines.length === 0) return;
  deps.write(
    "Settings to review by hand (specdojo update does not rewrite configuration files):\n",
  );
  for (const line of lines) deps.write(`  [${line.version}] ${line.text}\n`);
  deps.write("\n");
}

async function companionTargets(
  repoRoot: string,
  packageJson: unknown,
  deps: UpdateDeps,
): Promise<InstallTarget[]> {
  const targets: InstallTarget[] = [];
  for (const name of COMPANION_PACKAGES) {
    const dependency = findDeclaredDependency(packageJson, name);
    if (!dependency) continue;
    let latest: string;
    try {
      latest = await deps.resolveRegistryVersion(name, "latest");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      deps.write(`WARN: skipped ${name}; cannot resolve the latest version: ${message}\n`);
      continue;
    }
    const current = await installedVersion(repoRoot, name);
    if (current && compareVersions(latest, current) <= 0) {
      deps.write(`${name}: ${current} is up to date.\n`);
      continue;
    }
    deps.write(`${name}: ${current ?? "(not installed)"} -> ${latest}\n`);
    targets.push({ dependency, version: latest });
  }
  return targets;
}

function originLabel(candidate: DriftCandidate): string {
  if (candidate.kind === "missing") {
    return candidate.origin === "new-file" ? "new in this version" : "not in this repository";
  }
  switch (candidate.origin) {
    case "stale":
      return "unchanged copy of the previous version";
    case "modified":
      return "edited locally; applying overwrites your edits";
    default:
      return "differs from the distributed file";
  }
}

function candidateDiff(candidate: DriftCandidate): string {
  const diff = unifiedDiff(candidate.currentContent ?? "", candidate.nextContent, {
    before:
      candidate.currentContent === undefined ? "/dev/null" : candidate.entry.destinationRelPath,
    after: `${candidate.entry.destinationRelPath} (new version)`,
  });
  const lines = diff.split("\n");
  if (lines.length <= MAX_DIFF_LINES) return diff;
  return `${lines.slice(0, MAX_DIFF_LINES).join("\n")}\n... (${lines.length - MAX_DIFF_LINES} more lines)\n`;
}

function writeCandidateDetail(
  deps: UpdateDeps,
  candidate: DriftCandidate,
  sections: readonly ChangelogSection[],
): void {
  deps.write(
    `\n== ${candidate.entry.destinationRelPath} (${candidate.provider}; ${originLabel(candidate)})\n`,
  );
  deps.write(candidateDiff(candidate));
  const related = changelogLinesMentioning(
    sections,
    changelogTermsForPath(candidate.entry.destinationRelPath),
  );
  if (related.length > 0) {
    deps.write("Related CHANGELOG lines:\n");
    for (const line of related) deps.write(`  [${line.version}] ${line.text}\n`);
  }
}

function writeCandidateList(deps: UpdateDeps, candidates: readonly DriftCandidate[]): void {
  deps.write("Distributed files that differ from the new version (nothing was rewritten):\n");
  for (const candidate of candidates) {
    deps.write(
      `  - ${candidate.entry.destinationRelPath} (${candidate.provider}; ${originLabel(candidate)})\n`,
    );
  }
  const providers = [...new Set(candidates.map((candidate) => candidate.provider))].sort();
  deps.write("To update them:\n");
  deps.write("  - Run specdojo update in a terminal to review each file and choose.\n");
  for (const provider of providers) {
    deps.write(
      `  - Or overwrite all files of a provider: npx specdojo config scaffold --provider ${provider} --force` +
        " (this also overwrites local edits)\n",
    );
  }
}

type Choice = "apply" | "skip" | "all";

async function askChoice(deps: UpdateDeps): Promise<Choice> {
  for (;;) {
    const answer = (
      await deps.ask("Apply this change? [y] apply / [n] skip / [a] apply all remaining: ")
    )
      .trim()
      .toLowerCase();
    if (answer === "y" || answer === "yes" || answer === "apply") return "apply";
    if (answer === "" || answer === "n" || answer === "no" || answer === "s" || answer === "skip") {
      return "skip";
    }
    if (answer === "a" || answer === "all") return "all";
    deps.write("Answer y, n, or a.\n");
  }
}

async function reviewCandidatesInteractively(
  deps: UpdateDeps,
  candidates: readonly DriftCandidate[],
  sections: readonly ChangelogSection[],
): Promise<string[]> {
  const applied: string[] = [];
  let applyAll = false;
  for (const candidate of candidates) {
    writeCandidateDetail(deps, candidate, sections);
    const choice = applyAll ? "apply" : await askChoice(deps);
    if (choice === "all") applyAll = true;
    if (choice === "skip") {
      deps.write(`Skipped: ${candidate.entry.destinationRelPath}\n`);
      continue;
    }
    await applyDriftCandidate(candidate);
    applied.push(candidate.entry.destinationRelPath);
    deps.write(`Applied: ${candidate.entry.destinationRelPath}\n`);
  }
  return applied;
}

async function runInstall(
  options: UpdateOptions,
  deps: UpdateDeps,
  commands: readonly InstallCommand[],
): Promise<void> {
  for (const command of commands) {
    if (options.dryRun) {
      deps.write(`[dry-run] would run: ${formatCommand(command)}\n`);
      continue;
    }
    deps.write(`Running: ${formatCommand(command)}\n`);
    const exitCode = await deps.runCommand(command, options.repoRoot);
    if (exitCode !== 0) {
      throw new Error(
        `Update command failed with exit code ${exitCode}: ${formatCommand(command)}`,
      );
    }
  }
}

function writeSummary(deps: UpdateDeps, dryRun: boolean, changedFiles: readonly string[]): void {
  if (dryRun) {
    deps.write("\n[dry-run] No files were changed.\n");
    return;
  }
  if (changedFiles.length === 0) {
    deps.write("\nNo files were changed.\n");
    return;
  }
  deps.write("\nChanged files:\n");
  for (const file of changedFiles) deps.write(`  - ${file}\n`);
  deps.write(
    "Review the changes and commit them yourself (specdojo update does not run git commit or git push).\n",
  );
}

/** specdojo update の本体。 */
export async function runUpdate(options: UpdateOptions, deps: UpdateDeps): Promise<UpdateOutcome> {
  const packageJsonPath = path.join(options.repoRoot, "package.json");
  if (!existsSync(packageJsonPath)) {
    throw new Error(`package.json not found: ${packageJsonPath}`);
  }
  const packageJson = await readJson(packageJsonPath);
  const dependency = findDeclaredDependency(packageJson, SPECDOJO_PACKAGE);
  if (!dependency) {
    throw new Error(`${SPECDOJO_PACKAGE} is not declared in ${packageJsonPath}`);
  }
  const currentVersion = await installedVersion(options.repoRoot, SPECDOJO_PACKAGE);
  if (!currentVersion) {
    throw new Error(
      `${SPECDOJO_PACKAGE} is not installed under ${path.join(options.repoRoot, "node_modules")}. Install dependencies first.`,
    );
  }

  const target = await resolveTarget(options, deps);
  deps.write(`specdojo: ${currentVersion} (installed) -> ${target.version} (${target.label})\n`);
  const comparison = compareVersions(target.version, currentVersion);
  const updated = comparison > 0;
  const currentRoot = installedRoot(options.repoRoot, SPECDOJO_PACKAGE);

  const temporaryDir = updated ? await mkdtemp(path.join(tmpdir(), "specdojo-update-")) : "";
  try {
    let nextRoot = currentRoot;
    let sections: ChangelogSection[] = [];
    let commands: InstallCommand[] = [];
    let previousSources: Map<string, string> | undefined;
    if (!updated) {
      deps.write(
        comparison === 0
          ? "Already at the target version; skipping the version update.\n\n"
          : "The target version is older than the installed one; skipping the version update.\n\n",
      );
    } else {
      // 更新の前に新しい版のパッケージを取り出し、その CHANGELOG と原本を使う。
      nextRoot = await deps.materializePackage(
        { name: SPECDOJO_PACKAGE, version: target.version, tarballPath: target.tarballPath },
        temporaryDir,
      );
      const changelogPath = path.join(nextRoot, "CHANGELOG.md");
      if (existsSync(changelogPath)) {
        sections = changelogSectionsBetween(
          await readFile(changelogPath, "utf8"),
          currentVersion,
          target.version,
        );
        deps.write("\n");
        writeChangelog(deps, sections);
      } else {
        deps.write("WARN: CHANGELOG.md is not in the new package.\n\n");
      }
      writeConfigNotes(deps, sections);
    }

    const providers = await detectProvidersInUse({
      packageRoot: nextRoot,
      repoRoot: options.repoRoot,
    });
    const manager = detectPackageManager(options.repoRoot);
    if (updated) {
      previousSources = await snapshotScaffoldSources({
        packageRoot: currentRoot,
        repoRoot: options.repoRoot,
        providers,
      });
      const targets: InstallTarget[] = [
        { dependency, version: target.version, tarballPath: target.tarballPath },
        ...(await companionTargets(options.repoRoot, packageJson, deps)),
      ];
      commands = buildInstallCommands(manager.manager, targets);
      deps.write(
        `Package manager: ${manager.manager}${manager.lockfile ? ` (${manager.lockfile})` : " (no lockfile; default)"}\n`,
      );
      if (target.tarballPath) {
        deps.write(
          "NOTE: installing from a tarball records its path in package.json instead of a version range.\n",
        );
      }
      await runInstall(options, deps, commands);
    }

    deps.write(
      `\nChecking distributed files for: ${providers.length > 0 ? providers.join(", ") : "(no provider files found)"}\n`,
    );
    const candidates = await collectDriftCandidates({
      packageRoot: nextRoot,
      repoRoot: options.repoRoot,
      providers,
      previousSources,
    });
    let applied: string[] = [];
    if (candidates.length === 0) {
      deps.write("Distributed files match the new version.\n");
    } else if (options.dryRun || !options.interactive || !deps.isInteractiveTerminal) {
      writeCandidateList(deps, candidates);
    } else {
      applied = await reviewCandidatesInteractively(deps, candidates, sections);
    }

    // lockfile の無いリポジトリでも、更新で lockfile ができることがあるため改めて調べる。
    const lockfileAfter = detectPackageManager(options.repoRoot).lockfile;
    const changedFiles =
      updated && !options.dryRun
        ? ["package.json", ...(lockfileAfter ? [lockfileAfter] : []), ...applied]
        : applied;
    writeSummary(deps, options.dryRun, changedFiles);
    return {
      currentVersion,
      targetVersion: target.version,
      updated: updated && !options.dryRun,
      commands,
      candidates,
      applied,
      changedFiles,
    };
  } finally {
    if (temporaryDir) await rm(temporaryDir, { recursive: true, force: true });
  }
}
