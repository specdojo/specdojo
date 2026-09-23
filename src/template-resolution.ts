import { existsSync } from "node:fs";
import { isAbsolute, join, relative, resolve } from "node:path";
import { specdojoPackageRootDir } from "./package-paths.js";
import { specdojoRootDir } from "./specdojo-config.js";

const SPECDOJO_TEMPLATES_RELATIVE_DIR = "docs/ja/specdojo/templates";

export type SpecdojoResolutionRoots = {
  repositoryRoot?: string;
  packageRoot?: string;
};

// kata と schema は同じ規則で解決する。呼び出し側ごとに fallback の実装を持つと、
// eject 済みファイルと package 同梱ファイルが混在する場合に優先順位がずれるため、
// 候補の組み立てと存在判定をこのモジュールへ集約する。
function normalizedResourcePath(relativePath: string): string {
  const normalized = relativePath.replaceAll("\\", "/").replace(/^\.\//, "");
  if (
    !normalized ||
    isAbsolute(relativePath) ||
    normalized === ".." ||
    normalized.startsWith("../") ||
    normalized.includes("/../")
  ) {
    throw new Error(`SpecDojo resource path must be repository-relative: ${relativePath}`);
  }
  if (
    normalized !== "docs/ja/specdojo" &&
    !normalized.startsWith("docs/ja/specdojo/") &&
    normalized !== "docs/specdojo/schemas" &&
    !normalized.startsWith("docs/specdojo/schemas/")
  ) {
    throw new Error(`Unsupported SpecDojo resource path: ${relativePath}`);
  }
  return normalized;
}

export function specdojoResourceCandidates(
  relativePath: string,
  roots: SpecdojoResolutionRoots = {},
): { repositoryPath: string; bundledPath: string } {
  const normalized = normalizedResourcePath(relativePath);
  return {
    repositoryPath: resolve(roots.repositoryRoot ?? specdojoRootDir(), normalized),
    bundledPath: resolve(roots.packageRoot ?? specdojoPackageRootDir(), normalized),
  };
}

export function resolveSpecdojoPathIfExists(
  relativePath: string,
  roots: SpecdojoResolutionRoots = {},
): string | undefined {
  const { repositoryPath, bundledPath } = specdojoResourceCandidates(relativePath, roots);

  if (existsSync(repositoryPath)) return repositoryPath;
  if (existsSync(bundledPath)) return bundledPath;
  return undefined;
}

// ディレクトリを列挙する処理向け。両方が存在する場合も repository を先に返し、
// 呼び出し側が同じ相対ファイル名を先勝ちで重複除去できるようにする。
export function specdojoDirectoryPaths(
  relativePath: string,
  roots: SpecdojoResolutionRoots = {},
): string[] {
  const { repositoryPath, bundledPath } = specdojoResourceCandidates(relativePath, roots);
  return [...new Set([repositoryPath, bundledPath])].filter((path) => existsSync(path));
}

export function resolveSpecdojoPath(
  relativePath: string,
  roots: SpecdojoResolutionRoots = {},
): string {
  const resolved = resolveSpecdojoPathIfExists(relativePath, roots);
  if (resolved) return resolved;

  const { repositoryPath, bundledPath } = specdojoResourceCandidates(relativePath, roots);
  throw new Error(
    `SpecDojo resource not found: ${relativePath}\n` +
      `Searched repository resource: ${repositoryPath}\n` +
      `Searched bundled package resource: ${bundledPath}`,
  );
}

// plan に記載する参照は、実際に選ばれたファイルを利用者リポジトリからの相対パスで表す。
// npm 導入時は node_modules/specdojo/...、SpecDojo 自身の src/dist 実行時は docs/... になる。
// 利用者リポジトリの外へ解決された場合（別 checkout から CLI を実行した場合など）は、
// `../` で遡る相対パスが agent の作業ディレクトリ基準で不安定になるため絶対パスを返す。
export function specdojoReferencePath(
  absolutePath: string,
  roots: Pick<SpecdojoResolutionRoots, "repositoryRoot"> = {},
): string {
  const repositoryRoot = roots.repositoryRoot ?? specdojoRootDir();
  const relativePath = relative(repositoryRoot, absolutePath).replaceAll("\\", "/");
  if (relativePath === "" || relativePath === ".." || relativePath.startsWith("../")) {
    return absolutePath.replaceAll("\\", "/");
  }
  return relativePath;
}

export function resolveSpecdojoReferencePathIfExists(
  relativePath: string,
  roots: SpecdojoResolutionRoots = {},
): string | undefined {
  const resolved = resolveSpecdojoPathIfExists(relativePath, roots);
  return resolved ? specdojoReferencePath(resolved, roots) : undefined;
}

export function resolveSpecdojoTemplatesDir(roots: SpecdojoResolutionRoots = {}): string {
  const resolved = resolveSpecdojoPathIfExists(SPECDOJO_TEMPLATES_RELATIVE_DIR, roots);
  if (resolved) return resolved;

  const { repositoryPath, bundledPath } = specdojoResourceCandidates(
    SPECDOJO_TEMPLATES_RELATIVE_DIR,
    roots,
  );

  throw new Error(
    `Templates directory not found.\n` +
      `Searched repository templates: ${repositoryPath}\n` +
      `Searched bundled package templates: ${bundledPath}`,
  );
}

// 利用者リポジトリの template を上書きとして優先し、無い場合だけ npm package に
// 同梱した原本へフォールバックする。両方に無い場合は調査できるよう探索元をすべて示す。
export function resolveSpecdojoTemplatePath(
  templateFileName: string,
  roots: SpecdojoResolutionRoots = {},
): string {
  const relativePath = join(SPECDOJO_TEMPLATES_RELATIVE_DIR, templateFileName);
  const resolved = resolveSpecdojoPathIfExists(relativePath, roots);
  if (resolved) return resolved;

  const { repositoryPath, bundledPath } = specdojoResourceCandidates(relativePath, roots);

  throw new Error(
    `Template not found: ${templateFileName}\n` +
      `Searched repository template: ${repositoryPath}\n` +
      `Searched bundled package template: ${bundledPath}`,
  );
}
