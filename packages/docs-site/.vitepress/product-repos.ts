import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import * as path from "node:path";

// project の `repos` で宣言したプロダクトのリポジトリの docs/ja/product/ を、閲覧用ツリーの
// docs/ja/product/<リポジトリ名>/ へ取り込む（PJR-FZQA）。docs-site は specdojo CLI と別の
// package のため、設定の読み取りは CLI（src/shared/specdojo-config.ts・local-config.ts）の
// 規則のうち、取り込みに要る repos の name と path だけを写す。

export const SHARED_CONFIG_RELATIVE_PATH = ".specdojo/specdojo.config.json";
export const LOCAL_CONFIG_RELATIVE_PATH = ".specdojo/specdojo.local.config.json";
export const LOCAL_CONFIG_ENV = "SPECDOJO_LOCAL_CONFIG";

// 宣言したリポジトリの中で取り込む文書の置き場所と、閲覧用ツリーでの置き場所の親。
export const PRODUCT_DOCS_RELATIVE_DIR = "docs/ja/product";

const REPO_NAME_PATTERN = /^[a-z0-9-]+$/;
// CLI の PROJECT_REPO_WORKTREE_DIRNAME と同じ。複数リポジトリの exec の project 側 worktree の名前。
const PROJECT_REPO_WORKTREE_DIRNAME = "project";

export type ProductRepo = {
  name: string;
  // 宣言したリポジトリのルート（絶対パス）。
  root: string;
};

export type StagedProductRepo = ProductRepo & {
  // 閲覧用ツリーの docs ルートから見た取り込み先（例: "ja/product/shop"）。
  docsRelativeDir: string;
  // stagingRoot 相対のファイル一覧（例: "docs/ja/product/shop/010-x/a.md"）。
  files: string[];
};

export type Warn = (message: string) => void;

const defaultWarn: Warn = (message) => console.warn(`[product-repos] ${message}`);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readJson(filePath: string, warn: Warn): unknown {
  if (!existsSync(filePath)) return undefined;
  try {
    return JSON.parse(readFileSync(filePath, "utf8")) as unknown;
  } catch (error) {
    warn(`skip ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    return undefined;
  }
}

function readTextOrUndefined(filePath: string): string | undefined {
  try {
    return readFileSync(filePath, "utf8");
  } catch {
    return undefined;
  }
}

function gitdirOf(root: string): string | undefined {
  const dotGit = path.join(root, ".git");
  if (!existsSync(dotGit) || statSync(dotGit).isDirectory()) return undefined;
  const line = readTextOrUndefined(dotGit)
    ?.split(/\r?\n/)
    .find((candidate) => candidate.startsWith("gitdir:"));
  return line ? path.resolve(root, line.slice("gitdir:".length).trim()) : undefined;
}

// CLI の resolveLocalConfigPath と同じ規則。linked worktree は自分の中の同名ファイルを信用せず、
// SPECDOJO_LOCAL_CONFIG（親が渡す絶対パス）か、本体の作業ツリーのファイルを読む。
export function resolveLocalConfigPath(
  workspaceRoot: string,
  env: NodeJS.ProcessEnv = process.env,
): string {
  const root = path.resolve(workspaceRoot);
  if (!gitdirOf(root)) return path.join(root, LOCAL_CONFIG_RELATIVE_PATH);
  const fromEnv = env[LOCAL_CONFIG_ENV]?.trim();
  if (fromEnv && path.isAbsolute(fromEnv)) return fromEnv;
  return path.join(resolveMainWorkingTreeRoot(root), LOCAL_CONFIG_RELATIVE_PATH);
}

// CLI の repositoryIdentityRoot と同じ規則。linked worktree なら、その worktree を持つ主の
// 作業ツリーのルートを返す。それ以外は与えたルートのまま返す。
export function resolveMainWorkingTreeRoot(workspaceRoot: string): string {
  const root = path.resolve(workspaceRoot);
  const gitdir = gitdirOf(root);
  if (!gitdir) return root;
  const normalized = gitdir.replaceAll("\\", "/");
  const markerIndex = normalized.lastIndexOf("/.git/worktrees/");
  return markerIndex >= 0 ? path.resolve(normalized.slice(0, markerIndex)) : root;
}

// CLI の resolveRepoRoot と同じ規則。複数リポジトリの exec の project 側 worktree
// （<task>/project/ が exec/<task> を checkout）では、隣の <task>/<name>/ を使う。
function resolveRepoRoot(workspaceRoot: string, name: string, repoPath: string): string {
  const root = path.resolve(workspaceRoot);
  if (path.basename(root) === PROJECT_REPO_WORKTREE_DIRNAME) {
    const gitdir = gitdirOf(root);
    const head = gitdir ? readTextOrUndefined(path.join(gitdir, "HEAD"))?.trim() : undefined;
    if (head === `ref: refs/heads/exec/${path.basename(path.dirname(root))}`) {
      return path.join(path.dirname(root), name);
    }
  }
  return path.resolve(root, repoPath);
}

type RepoEntry = { name: string; path: string };

function readRepoEntries(value: unknown): RepoEntry[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) =>
    isRecord(entry) && typeof entry.name === "string" && typeof entry.path === "string"
      ? [{ name: entry.name, path: entry.path }]
      : [],
  );
}

// 共有の設定の各 project の repos を読み、ローカルの設定の同名の path 差し替えと追加を反映する。
// 同じ名前を複数の project が宣言した場合は、project id 順で先に出た path を使う。
export function loadProductRepos(
  workspaceRoot: string,
  env: NodeJS.ProcessEnv = process.env,
  warn: Warn = defaultWarn,
): ProductRepo[] {
  const shared = readJson(path.join(workspaceRoot, SHARED_CONFIG_RELATIVE_PATH), warn);
  if (!isRecord(shared) || !isRecord(shared.projects)) return [];
  const local = readJson(resolveLocalConfigPath(workspaceRoot, env), warn);
  const localProjects = isRecord(local) && isRecord(local.projects) ? local.projects : {};

  const repos = new Map<string, ProductRepo>();
  for (const projectId of Object.keys(shared.projects).sort()) {
    const project = shared.projects[projectId];
    if (!isRecord(project)) continue;
    const merged = readRepoEntries(project.repos);
    const localProject = localProjects[projectId];
    for (const override of readRepoEntries(isRecord(localProject) ? localProject.repos : [])) {
      const index = merged.findIndex((entry) => entry.name === override.name);
      if (index >= 0) merged[index] = override;
      else merged.push(override);
    }
    for (const entry of merged) {
      if (!REPO_NAME_PATTERN.test(entry.name)) {
        warn(
          `skip repository "${entry.name}" of ${projectId}: name must match ${REPO_NAME_PATTERN}`,
        );
        continue;
      }
      const root = resolveRepoRoot(workspaceRoot, entry.name, entry.path);
      const existing = repos.get(entry.name);
      if (existing) {
        if (existing.root !== root) {
          warn(
            `repository "${entry.name}" of ${projectId} is also declared as ${existing.root}; using it`,
          );
        }
        continue;
      }
      repos.set(entry.name, { name: entry.name, root });
    }
  }
  return [...repos.values()];
}

function listFiles(root: string): string[] {
  const files: string[] = [];
  const visit = (current: string): void => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
      const absolutePath = path.join(current, entry.name);
      if (entry.isDirectory()) visit(absolutePath);
      else if (entry.isFile()) files.push(path.relative(root, absolutePath));
    }
  };
  visit(root);
  return files.sort();
}

// 複製元と同じ大きさ・更新時刻のファイルは複製し直さない（kata-staging と同じ判定）。
function copyIfChanged(source: string, destination: string): void {
  const sourceStat = statSync(source);
  try {
    const destinationStat = statSync(destination);
    if (
      destinationStat.size === sourceStat.size &&
      Math.abs(destinationStat.mtimeMs - sourceStat.mtimeMs) < 1
    ) {
      return;
    }
  } catch {
    // 無ければ複製する
  }
  mkdirSync(path.dirname(destination), { recursive: true });
  copyFileSync(source, destination);
  utimesSync(destination, sourceStat.atime, sourceStat.mtime);
}

export function defaultIndexPage(repoName: string): string {
  return `# プロダクト: ${repoName}\n\nリポジトリ \`${repoName}\` の \`${PRODUCT_DOCS_RELATIVE_DIR}/\` から取り込んだ文書です。サイドバーから文書を選んでください。\n`;
}

function writeIfChanged(destination: string, content: string): void {
  if (readTextOrUndefined(destination) === content) return;
  mkdirSync(path.dirname(destination), { recursive: true });
  writeFileSync(destination, content, "utf8");
}

// 宣言したリポジトリの docs/ja/product/ を stagingRoot/docs/ja/product/<name>/ へ複製する。
// リポジトリや文書の置き場所が無い場合（CI で checkout していないなど）は警告して飛ばす。
// project のリポジトリ自身が docs/ja/product/<name>/ を持つ場合は、そちらを優先して飛ばす。
export function stageProductRepoDocs(
  workspaceRoot: string,
  stagingRoot: string,
  repos: readonly ProductRepo[],
  warn: Warn = defaultWarn,
): StagedProductRepo[] {
  const staged: StagedProductRepo[] = [];
  for (const repo of repos) {
    const source = path.join(repo.root, PRODUCT_DOCS_RELATIVE_DIR);
    if (!existsSync(repo.root)) {
      warn(`skip repository "${repo.name}": ${repo.root} not found`);
      continue;
    }
    if (!existsSync(source) || !statSync(source).isDirectory()) {
      warn(`skip repository "${repo.name}": ${source} not found`);
      continue;
    }
    const relativeDir = path.join(PRODUCT_DOCS_RELATIVE_DIR, repo.name);
    if (existsSync(path.join(workspaceRoot, relativeDir))) {
      warn(
        `skip repository "${repo.name}": ${relativeDir} already exists in the project repository`,
      );
      continue;
    }
    const sourceFiles = listFiles(source);
    const files = sourceFiles.map((file) => {
      const relativePath = path.join(relativeDir, file);
      copyIfChanged(path.join(source, file), path.join(stagingRoot, relativePath));
      return relativePath;
    });
    // 節の入口（/ja/product/<name>/）を 404 にしないよう、index.md が無ければ入口のページを置く。
    if (!sourceFiles.includes("index.md")) {
      const indexPath = path.join(relativeDir, "index.md");
      writeIfChanged(path.join(stagingRoot, indexPath), defaultIndexPage(repo.name));
      files.push(indexPath);
    }
    staged.push({
      ...repo,
      docsRelativeDir: path.posix.join("ja", "product", repo.name),
      files,
    });
  }
  return staged;
}

// Markdown の frontmatter から doc id（specdojo.id、なければトップレベルの id）を読む。
export function readMarkdownDocId(content: string): string | undefined {
  const block = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  if (!block) return undefined;
  const unquote = (value: string): string => value.replace(/^["']|["']$/g, "").trim();
  const namespaced = block.match(/^specdojo:\s*\r?\n((?:[ \t]+.*(?:\r?\n|$))+)/m)?.[1];
  const nestedId = namespaced?.match(/^[ \t]+id:\s*(.+?)\s*$/m)?.[1];
  if (nestedId) return unquote(nestedId) || undefined;
  const topId = block.match(/^id:\s*(.+?)\s*$/m)?.[1];
  return topId ? unquote(topId) || undefined : undefined;
}

const DOC_ID_PATTERN = /^[a-z][a-z0-9:_-]+$/;

// 取り込んだ文書の doc id を、閲覧用ツリーのパス（"docs/ja/product/<name>/..."）へ引く表を作る。
// - Markdown の frontmatter の id を使う。YAML はページにならないため、yaml-pages が生成した
//   表示用ページ（generated/<name>.md、同じ id を持つ）を取り込んだ場合だけ引ける。
// - 宣言どおりの id に加え、`:` を含まない id には `<リポジトリ名>:<id>` の別名も付ける。
// - project の doc index（reserved）にある id は project 側を優先し、取り込んだ側を警告して捨てる。
export function collectProductDocIndex(
  stagingRoot: string,
  stagedRepos: readonly StagedProductRepo[],
  reserved: ReadonlySet<string> = new Set(),
  warn: Warn = defaultWarn,
): Record<string, string> {
  const entries: Record<string, string> = {};
  const add = (id: string, entry: string): void => {
    if (!DOC_ID_PATTERN.test(id)) return;
    if (reserved.has(id)) {
      warn(`doc id "${id}" of ${entry} is already in the project doc index; keeping the project's`);
      return;
    }
    if (entries[id]) {
      warn(`doc id "${id}" of ${entry} duplicates ${entries[id]}; keeping the first`);
      return;
    }
    entries[id] = entry;
  };
  for (const repo of stagedRepos) {
    const files = repo.files.map((file) => file.split(path.sep).join("/")).sort();
    for (const file of files.filter((candidate) => candidate.endsWith(".md"))) {
      const id = readMarkdownDocId(readTextOrUndefined(path.join(stagingRoot, file)) ?? "");
      if (!id) continue;
      add(id, file);
      if (!id.includes(":")) add(`${repo.name}:${id}`, file);
    }
  }
  return entries;
}

// サイドバーの項目（vitepress-sidebar の出力と同じ形）。
export type ProductSidebarItem = {
  text?: string;
  link?: string;
  items?: ProductSidebarItem[];
  collapsed?: boolean;
};

export const PRODUCT_REPO_SECTION_PREFIX = "プロダクト";

// vitepress-sidebar を scanStartPath=ja/product/<name> で走査すると、リンクが走査起点からの
// 相対（"010-x/a"）になる。公開 URL（"/ja/product/<name>/010-x/a"）へ付け替え、入口の index は
// 節の見出しのリンクにするため一覧から外して、リポジトリごとの節へ包む。
export function buildProductRepoSidebarSection(
  repo: Pick<StagedProductRepo, "name" | "docsRelativeDir">,
  scanned: readonly ProductSidebarItem[],
): ProductSidebarItem {
  const base = `/${repo.docsRelativeDir}/`;
  const rewrite = (items: readonly ProductSidebarItem[]): ProductSidebarItem[] =>
    items.flatMap((item) => {
      const relativeLink = item.link?.replace(/^\.?\/+/, "");
      if (relativeLink !== undefined && /^index$/i.test(relativeLink)) return [];
      const next: ProductSidebarItem = { ...item };
      if (relativeLink !== undefined && !/^[a-z]+:/i.test(relativeLink)) {
        next.link = base + relativeLink;
      }
      if (next.items) next.items = rewrite(next.items);
      return [next];
    });
  return {
    text: `${PRODUCT_REPO_SECTION_PREFIX}: ${repo.name}`,
    link: base,
    collapsed: false,
    items: rewrite(scanned),
  };
}
