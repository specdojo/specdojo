import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import * as path from "node:path";

// 利用リポジトリに docs/index.md や project の index.md が無いと、サイトの土台
// （/<base>/）と project のトップ（/ja/projects/<project-id>/）が 404 になる。
// 利用リポジトリへは書き込まず、閲覧用ステージングにだけ入口のページを置く。
// 利用リポジトリに同じ index.md がある場合は、そちらを採用して生成しない。

const CONFIG_RELATIVE_PATH = path.join(".specdojo", "specdojo.config.json");
const SPECDOJO_ENTRY_CANDIDATES = [
  "docs/ja/specdojo/index.md",
  "docs/ja/specdojo/guides/specdojo-overview-guide.md",
] as const;

const REGISTER_INDEX_FILE = "pjr-index.md";
const REGISTER_VIEW_FILES = [
  "pjr-views-by-status.md",
  "pjr-views-by-priority.md",
  "pjr-views-by-owner.md",
  "pjr-derived-items.md",
  "pjr-dependent-items.md",
  "pjr-epic-items.md",
] as const;
const MANAGEMENT_LOG_FILES = [
  "pm-decision-log.md",
  "pm-issue-log.md",
  "pm-change-request-log.md",
  "pm-risk-register.md",
] as const;

export type ProjectEntry = {
  id: string;
  // workspace からの相対パス（docs/ja/projects/<id> など）。
  projectDir: string;
  // workspace からの相対パス。未設定なら undefined。
  registerDir: string | undefined;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

// specdojo CLI と同じく、各パスは base_path からの相対で解決する。
// base_path が無い project は、project のトップの URL 規約（docs/ja/projects/<id>）に置く。
export function readProjectEntries(workspaceRoot: string): ProjectEntry[] {
  const configPath = path.join(workspaceRoot, CONFIG_RELATIVE_PATH);
  if (!existsSync(configPath)) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(configPath, "utf8"));
  } catch (error) {
    console.warn(
      `specdojo-docs-site: ${configPath} を読めないため project のトップのページを生成しません: ${String(error)}`,
    );
    return [];
  }
  if (!isRecord(parsed) || !isRecord(parsed.projects)) return [];

  const entries: ProjectEntry[] = [];
  for (const [id, project] of Object.entries(parsed.projects)) {
    if (!isRecord(project)) continue;
    const basePath = optionalString(project.base_path);
    const registerPath = optionalString(project.project_register_path);
    entries.push({
      id,
      projectDir: path.normalize(basePath ?? path.join("docs", "ja", "projects", id)),
      registerDir:
        registerPath === undefined
          ? undefined
          : path.normalize(basePath ? path.join(basePath, registerPath) : registerPath),
    });
  }
  return entries.sort((first, second) => first.id.localeCompare(second.id));
}

function isWithinDocs(relativePath: string): boolean {
  const withinDocs = path.relative("docs", relativePath);
  return withinDocs !== "" && !withinDocs.startsWith("..") && !path.isAbsolute(withinDocs);
}

function toMarkdownHref(fromDir: string, target: string): string {
  const relative = path.relative(fromDir, target).split(path.sep).join("/");
  return relative.startsWith(".") ? relative : `./${relative}`;
}

function readHeading(file: string): string | undefined {
  try {
    const match = /^# (.+)$/m.exec(readFileSync(file, "utf8"));
    return match?.[1].trim();
  } catch {
    return undefined;
  }
}

// ステージングに存在するページだけをリンクする。存在しないページへのリンクは
// build の dead link 検査で失敗するため。
function linkItems(stagingRoot: string, pageDir: string, relativeFiles: string[]): string[] {
  return relativeFiles
    .filter((file) => existsSync(path.join(stagingRoot, file)))
    .map((file) => {
      const label = readHeading(path.join(stagingRoot, file)) ?? path.basename(file, ".md");
      return `- [${label}](${toMarkdownHref(pageDir, file)})`;
    });
}

function renderPage(title: string, intro: string, sections: [string, string[]][]): string {
  const lines = [`# ${title}`, "", intro, ""];
  let number = 0;
  for (const [heading, items] of sections) {
    if (items.length === 0) continue;
    number += 1;
    lines.push(`## ${number}. ${heading}`, "", ...items, "");
  }
  return `${lines.join("\n").trimEnd()}\n`;
}

function renderProjectPage(stagingRoot: string, project: ProjectEntry): string {
  const registerFiles = (names: readonly string[], dir: string | undefined): string[] =>
    dir === undefined ? [] : names.map((name) => path.join(dir, name));
  const generatedDir =
    project.registerDir === undefined ? undefined : path.join(project.registerDir, "generated");
  const controlsGeneratedDir =
    project.registerDir === undefined
      ? undefined
      : path.join(path.dirname(project.registerDir), "generated");

  const sections: [string, string[]][] = [
    [
      "登録簿の一覧",
      linkItems(
        stagingRoot,
        project.projectDir,
        registerFiles([REGISTER_INDEX_FILE], generatedDir),
      ),
    ],
    [
      "派生ビュー",
      linkItems(stagingRoot, project.projectDir, registerFiles(REGISTER_VIEW_FILES, generatedDir)),
    ],
    [
      "管理ログ",
      linkItems(
        stagingRoot,
        project.projectDir,
        registerFiles(MANAGEMENT_LOG_FILES, controlsGeneratedDir),
      ),
    ],
  ];
  const hasLinks = sections.some(([, items]) => items.length > 0);
  const intro = hasLinks
    ? `project \`${project.id}\` の入口です。@specdojo/docs-site が用意したページです。`
    : `project \`${project.id}\` の入口です。@specdojo/docs-site が用意したページです。登録簿の一覧・派生ビュー・管理ログはまだ生成されていません。`;
  return renderPage(`プロジェクト ${project.id}`, intro, sections);
}

function renderSiteTopPage(stagingRoot: string, projects: ProjectEntry[]): string {
  const specdojoEntry = SPECDOJO_ENTRY_CANDIDATES.find((file) =>
    existsSync(path.join(stagingRoot, file)),
  );
  const specdojoItems = specdojoEntry
    ? [`- [SpecDojo の文書](${toMarkdownHref("docs", specdojoEntry)})`]
    : [];
  const projectItems = projects
    .map((project) => ({ id: project.id, file: path.join(project.projectDir, "index.md") }))
    .filter(({ file }) => existsSync(path.join(stagingRoot, file)))
    .map(({ id, file }) => `- [${id}](${toMarkdownHref("docs", file)})`);
  return renderPage(
    "文書サイト",
    "この文書サイトの入口です。@specdojo/docs-site が用意したページです。",
    [
      ["SpecDojo の文書", specdojoItems],
      ["プロジェクト", projectItems],
    ],
  );
}

// ステージング済みのツリーへ、利用リポジトリに無い入口のページを書き込む。
// 戻り値は利用側にあって書き込まなかったページも含む、workspace からの相対パスと内容の対応で、
// dev 中に利用側の index.md が削除されたときの復元に使う。
export function writeDefaultIndexPages(
  workspaceRoot: string,
  stagingRoot: string,
): Map<string, string> {
  const generated = new Map<string, string>();
  const write = (relativePath: string, content: string): void => {
    generated.set(relativePath, content);
    if (existsSync(path.join(workspaceRoot, relativePath))) return;
    const destination = path.join(stagingRoot, relativePath);
    mkdirSync(path.dirname(destination), { recursive: true });
    writeFileSync(destination, content, "utf8");
  };

  // project のトップを先に用意し、サイトのトップから存在するページとしてリンクできるようにする。
  const projects = readProjectEntries(workspaceRoot).filter((project) =>
    isWithinDocs(project.projectDir),
  );
  for (const project of projects) {
    write(path.join(project.projectDir, "index.md"), renderProjectPage(stagingRoot, project));
  }
  write(path.join("docs", "index.md"), renderSiteTopPage(stagingRoot, projects));
  return generated;
}
