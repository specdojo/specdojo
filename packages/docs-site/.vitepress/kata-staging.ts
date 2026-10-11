import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import * as path from "node:path";

// package 参照中（eject していない）の kata は利用リポジトリの docs/ 配下に存在しない。
// VitePress の srcDir は 1 つしか指定できないため、ビルド前に package 側の kata を
// srcDir（呼び出し元 workspace）配下のステージングへ複製し、rewrites で公開 URL
// （/ja/specdojo/...）へ写像する。
//
// ステージング先はドット始まりにしない。VitePress のページ走査（tinyglobby）は
// ドット始まりのディレクトリを辿らないため、`.specdojo/` などに置くとページにならない。
export const KATA_STAGING_DIR_NAME = "specdojo-kata-staging";

// 複製対象は package が同梱する docs/ja/specdojo 全体とする。eject できる kata（rulebook /
// standard / recipe / sample / template）だけを複製すると、standard などが相対 Markdown
// リンクで参照する guides / references が欠け、VitePress の dead link 検査でビルドが失敗する。
// サイドバーの specdojo 節も guides などを前提に組まれている。
const KATA_RELATIVE_DIRS = ["docs/ja/specdojo"] as const;

const PACKAGE_NAME = "specdojo";

// package 同梱文書には SpecDojo 開発リポジトリ自身の設計書（docs/ja/product/...）への相対リンクが
// あり、利用リポジトリでは必ず dead link になる。VitePress の ignoreDeadLinks は URL しか
// 受け取らず参照元ページで絞れないため、ステージングを行った場合に限りこの形の URL だけを無視する。
export const STAGED_PACKAGE_DEAD_LINK_PATTERNS: readonly RegExp[] = [/^(\.\/)?(\.\.\/)+product\//];

export type KataStagingResult = {
  // ステージングのルート（workspace 直下）。複製した kata が無い場合は undefined。
  stagingRoot: string | undefined;
  // kata の参照元 package ルート。解決できない、または workspace 自身の場合は undefined。
  packageRoot: string | undefined;
  staged: number;
  ejected: number;
};

function readPackageName(packageJsonPath: string): string | undefined {
  try {
    const parsed: unknown = JSON.parse(readFileSync(packageJsonPath, "utf8"));
    if (typeof parsed === "object" && parsed !== null && "name" in parsed) {
      const name = (parsed as { name: unknown }).name;
      return typeof name === "string" ? name : undefined;
    }
  } catch {
    // package.json が無い・壊れている場合は該当なしとして扱う
  }
  return undefined;
}

function sameDirectory(first: string, second: string): boolean {
  return realPathOrResolved(first) === realPathOrResolved(second);
}

// kata の参照元 package ルートを解決する。順序は specdojo CLI の resolver と揃える。
// 1. SPECDOJO_PACKAGE_ROOT（CLI と同じ明示差し替え）
// 2. workspace から親方向へ辿った node_modules/specdojo
// workspace 自身が specdojo package の場合（SpecDojo 開発リポジトリ）は複製不要のため undefined。
export function resolveKataPackageRoot(workspaceRoot: string): string | undefined {
  const override = process.env.SPECDOJO_PACKAGE_ROOT;
  const candidate =
    override && override.trim() !== ""
      ? path.resolve(override)
      : findInstalledPackage(workspaceRoot);
  if (!candidate || sameDirectory(candidate, workspaceRoot)) return undefined;
  return candidate;
}

function findInstalledPackage(workspaceRoot: string): string | undefined {
  if (readPackageName(path.join(workspaceRoot, "package.json")) === PACKAGE_NAME) {
    return workspaceRoot;
  }
  let current = path.resolve(workspaceRoot);
  for (;;) {
    const candidate = path.join(current, "node_modules", PACKAGE_NAME);
    if (readPackageName(path.join(candidate, "package.json")) === PACKAGE_NAME) return candidate;
    const parent = path.dirname(current);
    if (parent === current) return undefined;
    current = parent;
  }
}

// kata コマンドと同じく generated/ は複製しない。順序を固定して結果を再現可能にする。
function relativeFilesBelow(root: string): string[] {
  if (!existsSync(root)) return [];
  const files: string[] = [];
  const visit = (current: string): void => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (entry.name === "generated") continue;
      const absolutePath = path.join(current, entry.name);
      if (entry.isDirectory()) visit(absolutePath);
      else if (entry.isFile()) files.push(path.relative(root, absolutePath));
    }
  };
  visit(root);
  return files.sort();
}

// package 側の kata をステージングへ複製する。前回のステージングは毎回作り直し、
// package の更新や eject で消えた kata が古いまま残らないようにする。
// eject 済み（利用リポジトリ側に同じ相対パスがある）ファイルは複製せず、利用リポジトリ側を採用する。
export function stageBundledKata(workspaceRoot: string): KataStagingResult {
  const stagingRoot = path.join(workspaceRoot, KATA_STAGING_DIR_NAME);
  rmSync(stagingRoot, { recursive: true, force: true });

  const packageRoot = resolveKataPackageRoot(workspaceRoot);
  if (!packageRoot)
    return { stagingRoot: undefined, packageRoot: undefined, staged: 0, ejected: 0 };

  let staged = 0;
  let ejected = 0;
  for (const relativeDir of KATA_RELATIVE_DIRS) {
    const bundledDir = path.join(packageRoot, relativeDir);
    const repositoryDir = path.join(workspaceRoot, relativeDir);
    for (const file of relativeFilesBelow(bundledDir)) {
      if (existsSync(path.join(repositoryDir, file))) {
        ejected += 1;
        continue;
      }
      const destination = path.join(stagingRoot, relativeDir, file);
      mkdirSync(path.dirname(destination), { recursive: true });
      copyFileSync(path.join(bundledDir, file), destination);
      staged += 1;
    }
  }

  if (staged === 0) {
    rmSync(stagingRoot, { recursive: true, force: true });
    return { stagingRoot: undefined, packageRoot, staged, ejected };
  }

  // 利用リポジトリの .gitignore を書き換えずに Git 管理対象から外す。
  writeFileSync(
    path.join(stagingRoot, ".gitignore"),
    "# @specdojo/docs-site が生成するステージング。Git 管理しない。\n*\n",
    "utf8",
  );
  return { stagingRoot, packageRoot, staged, ejected };
}

// doc-index の package 側 kata エントリ（例: "node_modules/specdojo/docs/ja/specdojo/..."）を
// サイト上のパス（"docs/ja/specdojo/..."）へ付け替える。ステージングは rewrites で
// docs/ja/... と同じ公開 URL へ写像されるため、wikilink はこのパスで解決できる。
// 行番号サフィックス（":42"）は保持する。package 外のエントリはそのまま返す。
export function toSiteDocIndexEntry(
  entry: string,
  workspaceRoot: string,
  packageRoot: string | undefined,
): string {
  if (!packageRoot) return entry;
  const colonIndex = entry.lastIndexOf(":");
  const hasLine = colonIndex > 0 && /^\d+$/.test(entry.slice(colonIndex + 1));
  const filePath = hasLine ? entry.slice(0, colonIndex) : entry;
  const suffix = hasLine ? entry.slice(colonIndex) : "";

  // node_modules/specdojo が symlink（npm link・pnpm など）の場合、index build が記録した
  // パスと package ルートの表記が一致しないため、実体パスで比較する。
  const packageDocsRoot = realPathOrResolved(path.join(packageRoot, "docs"));
  const absolutePath = realPathOrResolved(path.resolve(workspaceRoot, filePath));
  const relativePath = path.relative(packageDocsRoot, absolutePath);
  if (relativePath === "" || relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return entry;
  }
  return `docs/${relativePath.split(path.sep).join("/")}${suffix}`;
}

function realPathOrResolved(target: string): string {
  try {
    return realpathSync(target);
  } catch {
    return path.resolve(target);
  }
}
