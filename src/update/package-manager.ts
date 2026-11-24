import { existsSync } from "node:fs";
import path from "node:path";

// specdojo update の package manager の判定と、版の指定の形を保つ更新コマンドの組み立て。

export type PackageManager = "npm" | "pnpm" | "yarn";

export interface PackageManagerDetection {
  manager: PackageManager;
  /** 判定に使った lockfile。無いときは undefined（npm とみなす）。 */
  lockfile: string | undefined;
}

const LOCKFILES: ReadonlyArray<{ file: string; manager: PackageManager }> = [
  { file: "pnpm-lock.yaml", manager: "pnpm" },
  { file: "yarn.lock", manager: "yarn" },
  { file: "package-lock.json", manager: "npm" },
  { file: "npm-shrinkwrap.json", manager: "npm" },
];

/** lockfile から package manager を決める。lockfile が無いときは npm とする。 */
export function detectPackageManager(repoRoot: string): PackageManagerDetection {
  for (const { file, manager } of LOCKFILES) {
    if (existsSync(path.join(repoRoot, file))) return { manager, lockfile: file };
  }
  return { manager: "npm", lockfile: undefined };
}

export const SPECDOJO_PACKAGE = "specdojo";
/** 入っているときだけ specdojo と同じ回で上げる同梱パッケージ。 */
export const COMPANION_PACKAGES: readonly string[] = ["@specdojo/docs-lint", "@specdojo/docs-site"];

export type DependencySection = "dependencies" | "devDependencies";
export type SpecForm = "caret" | "tilde" | "exact" | "other";

export interface DeclaredDependency {
  name: string;
  section: DependencySection;
  spec: string;
  form: SpecForm;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function specForm(spec: string): SpecForm {
  const trimmed = spec.trim();
  if (/^\^\d/u.test(trimmed)) return "caret";
  if (/^~\d/u.test(trimmed)) return "tilde";
  if (/^=?\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.+-]+)?$/u.test(trimmed)) return "exact";
  return "other";
}

/** package.json の dependencies・devDependencies から、名前の一致する依存を返す。 */
export function findDeclaredDependency(
  packageJson: unknown,
  name: string,
): DeclaredDependency | undefined {
  if (!isRecord(packageJson)) return undefined;
  for (const section of ["devDependencies", "dependencies"] as const) {
    const deps = packageJson[section];
    if (!isRecord(deps)) continue;
    const spec = deps[name];
    if (typeof spec === "string") return { name, section, spec, form: specForm(spec) };
  }
  return undefined;
}

export interface InstallTarget {
  dependency: DeclaredDependency;
  /** 上げる先の版。tarball のときは tarball から読んだ版。 */
  version: string;
  /** tarball から入れるときの絶対パス。 */
  tarballPath?: string;
}

export interface InstallCommand {
  command: PackageManager;
  args: string[];
}

/** 版の指定の形（`^`・`~`・固定）を保った引数。tarball はパスをそのまま渡す。 */
export function installArgument(target: InstallTarget): string {
  if (target.tarballPath) return target.tarballPath;
  const { name, form } = target.dependency;
  if (form === "caret") return `${name}@^${target.version}`;
  if (form === "tilde") return `${name}@~${target.version}`;
  return `${name}@${target.version}`;
}

function addCommandArgs(
  manager: PackageManager,
  section: DependencySection,
  exact: boolean,
): string[] {
  const args = manager === "npm" ? ["install"] : ["add"];
  if (section === "devDependencies") {
    args.push(manager === "yarn" ? "--dev" : manager === "pnpm" ? "-D" : "--save-dev");
  }
  if (exact) args.push(manager === "yarn" ? "--exact" : "--save-exact");
  return args;
}

/**
 * 依存の区分と固定の指定かどうかで束ね、package manager ごとの追加のコマンドにする。
 * 固定の指定は --save-exact（yarn は --exact）で、`^` が付かないように保つ。
 */
export function buildInstallCommands(
  manager: PackageManager,
  targets: readonly InstallTarget[],
): InstallCommand[] {
  const groups = new Map<string, { section: DependencySection; exact: boolean; args: string[] }>();
  for (const target of targets) {
    const exact = target.dependency.form === "exact" && !target.tarballPath;
    const key = `${target.dependency.section}:${exact ? "exact" : "range"}`;
    const group = groups.get(key) ?? { section: target.dependency.section, exact, args: [] };
    group.args.push(installArgument(target));
    groups.set(key, group);
  }
  return [...groups.keys()].sort().map((key) => {
    const group = groups.get(key)!;
    return {
      command: manager,
      args: [...addCommandArgs(manager, group.section, group.exact), ...group.args],
    };
  });
}

export function formatCommand(command: InstallCommand): string {
  return [command.command, ...command.args]
    .map((part) => (/^[\w@^~./:=-]+$/u.test(part) ? part : `'${part.replaceAll("'", `'\\''`)}'`))
    .join(" ");
}
