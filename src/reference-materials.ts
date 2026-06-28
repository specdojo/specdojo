import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { load } from "js-yaml";
import { specdojoRootDir } from "./specdojo-config.js";

// 参考資料（rulebook / recipe / sample / template）の解決を 1 か所に集約する。
// plan 生成（明示パスの注入）と validate（参照先の存在確認）の両方から使う。

const MISSING = "_MISSING_";
const DOCS_BASE = "docs/ja/specdojo";

export type ReferenceMaterialKind = "recipe" | "sample" | "template";

export type ReferenceMaterialRefs = {
  rulebook: string;
  recipe: string;
  sample: string;
  template: string;
};

type RulebookRefs = {
  recipe?: string;
  sample?: string;
  template?: string;
  target_format?: string;
};

const KIND_DIR: Record<ReferenceMaterialKind, string> = {
  recipe: "recipes",
  sample: "samples",
  template: "templates",
};

function rulebookFsPath(rulebookId: string): string {
  return join(specdojoRootDir(), DOCS_BASE, "rulebooks", `${rulebookId}.md`);
}

// rulebook frontmatter の recipe / sample / template / target_format を読む。
// ファイル不在・frontmatter なしの場合は空オブジェクトを返す。
export function loadRulebookRefs(rulebookId: string): RulebookRefs {
  const fsPath = rulebookFsPath(rulebookId);
  if (!existsSync(fsPath)) return {};
  const match = readFileSync(fsPath, "utf8").match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const data = load(match[1]);
  if (typeof data !== "object" || data === null) return {};
  const fm = data as Record<string, unknown>;
  const str = (value: unknown): string | undefined =>
    typeof value === "string" && value !== "" ? value : undefined;
  return {
    recipe: str(fm.recipe),
    sample: str(fm.sample),
    template: str(fm.template),
    target_format: str(fm.target_format),
  };
}

// sample / template は対象成果物のフォーマットに合わせて拡張子が変わる。
function formatExt(targetFormat: string | undefined): string {
  return targetFormat === "yaml" ? "yaml" : targetFormat === "json" ? "json" : "md";
}

// Canonical repo-root-relative path (no leading slash): the agent opens these files
// from the run CWD (repo root or worktree root).
function repoPath(kind: ReferenceMaterialKind, id: string, ext: string): string {
  return `${DOCS_BASE}/${KIND_DIR[kind]}/${id}.${ext}`;
}

// rulebook 未宣言時の慣例 ID（<rulebook-prefix>-<kind>）。
// 例: rulebook `pm-organization-rulebook` → sample `pm-organization-sample`。
function conventionalRefId(rulebookId: string, kind: ReferenceMaterialKind): string {
  return `${rulebookId.replace(/-rulebook$/, "")}-${kind}`;
}

// recipe / sample / template を 1 件解決する。
// 宣言があればそれを正とする。'none' は明示的な無効化として MISSING を返す。
// 未宣言の場合は規定ディレクトリ上の慣例ファイルを探し、実在すればそのパスを返す。
function resolveRef(
  kind: ReferenceMaterialKind,
  declaredId: string | undefined,
  rulebookId: string,
  ext: string,
): string {
  if (declaredId === "none") return MISSING;
  if (declaredId) return repoPath(kind, declaredId, ext);
  const fallbackId = conventionalRefId(rulebookId, kind);
  const fsPath = join(specdojoRootDir(), DOCS_BASE, KIND_DIR[kind], `${fallbackId}.${ext}`);
  return existsSync(fsPath) ? repoPath(kind, fallbackId, ext) : MISSING;
}

// 成果物の rulebook ID を起点に、recipe / sample / template の repo 相対パスを解決する。
// recipe / sample / template は rulebook frontmatter の宣言を正とし、未宣言なら規定
// ディレクトリ上の慣例ファイルの実在を確認してパスを補う。
// 該当なしの項目は MISSING を返し、表示構造はテンプレート側に委ねる。
export function resolveReferenceMaterialRefs(
  rulebookId: string | undefined,
): ReferenceMaterialRefs {
  if (!rulebookId || rulebookId === "none") {
    return { rulebook: MISSING, recipe: MISSING, sample: MISSING, template: MISSING };
  }
  const fm = loadRulebookRefs(rulebookId);
  return {
    rulebook: `${DOCS_BASE}/rulebooks/${rulebookId}.md`,
    recipe: resolveRef("recipe", fm.recipe, rulebookId, "md"),
    sample: resolveRef("sample", fm.sample, rulebookId, formatExt(fm.target_format)),
    template: resolveRef("template", fm.template, rulebookId, formatExt(fm.target_format)),
  };
}

export type DeclaredReference = {
  kind: ReferenceMaterialKind;
  id: string;
  fsPath: string;
};

// rulebook frontmatter で宣言された recipe / sample / template の絶対パス一覧。
// none・未宣言は含めない（validate で存在確認するため）。
export function declaredReferences(rulebookId: string): DeclaredReference[] {
  const fm = loadRulebookRefs(rulebookId);
  const root = specdojoRootDir();
  const out: DeclaredReference[] = [];
  const add = (kind: ReferenceMaterialKind, id: string | undefined, ext: string): void => {
    if (id && id !== "none") {
      out.push({ kind, id, fsPath: join(root, DOCS_BASE, KIND_DIR[kind], `${id}.${ext}`) });
    }
  };
  add("recipe", fm.recipe, "md");
  add("sample", fm.sample, formatExt(fm.target_format));
  add("template", fm.template, formatExt(fm.target_format));
  return out;
}
