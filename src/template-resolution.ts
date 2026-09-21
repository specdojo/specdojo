import { existsSync } from "node:fs";
import { join } from "node:path";
import { specdojoPackageRootDir } from "./package-paths.js";
import { specdojoRootDir } from "./specdojo-config.js";

const SPECDOJO_TEMPLATES_RELATIVE_DIR = "docs/ja/specdojo/templates";

export type TemplateResolutionRoots = {
  repositoryRoot?: string;
  packageRoot?: string;
};

function templateDirectories(roots: TemplateResolutionRoots): {
  repositoryPath: string;
  bundledPath: string;
} {
  return {
    repositoryPath: join(
      roots.repositoryRoot ?? specdojoRootDir(),
      SPECDOJO_TEMPLATES_RELATIVE_DIR,
    ),
    bundledPath: join(
      roots.packageRoot ?? specdojoPackageRootDir(),
      SPECDOJO_TEMPLATES_RELATIVE_DIR,
    ),
  };
}

export function resolveSpecdojoTemplatesDir(roots: TemplateResolutionRoots = {}): string {
  const { repositoryPath, bundledPath } = templateDirectories(roots);

  if (existsSync(repositoryPath)) return repositoryPath;
  if (existsSync(bundledPath)) return bundledPath;

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
  roots: TemplateResolutionRoots = {},
): string {
  const directories = templateDirectories(roots);
  const repositoryPath = join(directories.repositoryPath, templateFileName);
  const bundledPath = join(directories.bundledPath, templateFileName);

  if (existsSync(repositoryPath)) return repositoryPath;
  if (existsSync(bundledPath)) return bundledPath;

  throw new Error(
    `Template not found: ${templateFileName}\n` +
      `Searched repository template: ${repositoryPath}\n` +
      `Searched bundled package template: ${bundledPath}`,
  );
}
