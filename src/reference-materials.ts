import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { specdojoRootDir } from "./specdojo-config.js";
import { readSpecdojoNamespace } from "./frontmatter-namespace.js";

// 参考資料（rulebook / recipe / sample / template）の解決を 1 か所に集約する。
// plan 生成（明示パスの注入）と validate（参照先の存在確認）の両方から使う。

const MISSING = "_MISSING_";
const DOCS_BASE = "docs/ja/specdojo";
// schema は言語非依存の正本資産（docs/ja/* の下ではない）。
const SCHEMA_BASE = "docs/specdojo/schemas/v1";

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
  schema?: string;
};

const KIND_DIR: Record<ReferenceMaterialKind, string> = {
  recipe: "recipes",
  sample: "samples",
  template: "templates",
};

function rulebookFsPath(rulebookId: string): string {
  return join(specdojoRootDir(), DOCS_BASE, "rulebooks", `${rulebookId}.md`);
}

// 参考資料種別 → repo ルート相対ディレクトリ。commit 許可リスト（maintenance / bootstrap 系
// approach で参考資料の変更を許可する範囲）の導出に使う。
export function referenceMaterialDirsForKinds(
  kinds: readonly (keyof ReferenceMaterialRefs)[],
): string[] {
  return kinds.map((kind) =>
    kind === "rulebook" ? `${DOCS_BASE}/rulebooks` : `${DOCS_BASE}/${KIND_DIR[kind]}`,
  );
}

// rulebook frontmatter の recipe / sample / template / target_format を読む。
// ファイル不在・frontmatter なしの場合は空オブジェクトを返す。
export function loadRulebookRefs(rulebookId: string): RulebookRefs {
  const fsPath = rulebookFsPath(rulebookId);
  if (!existsSync(fsPath)) return {};
  // rulebook frontmatter は `specdojo:` 名前空間配下にある。
  const fm = readSpecdojoNamespace(readFileSync(fsPath, "utf8"));
  const str = (value: unknown): string | undefined =>
    typeof value === "string" && value !== "" ? value : undefined;
  return {
    recipe: str(fm.recipe),
    sample: str(fm.sample),
    template: str(fm.template),
    target_format: str(fm.target_format),
    schema: str(fm.schema),
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

// schema ファイル（docs/specdojo/schemas/v1/<id>.schema.yaml）の repo 相対パス。
function schemaRepoPath(id: string): string {
  return `${SCHEMA_BASE}/${id}.schema.yaml`;
}

// 成果物を検証する schema の repo 相対パスを解決する。
// rulebook frontmatter の `schema` 宣言を正とし（`none` は検証無効）、未宣言なら
// <local_id>.schema.yaml → <rulebook-prefix>.schema.yaml の順で実在を確認して補う。
// target_format が yaml 以外、または該当 schema が無い場合は MISSING を返す。
// 決定論的に解決できるため、plan 生成時にこの具体パスを焼き込み、agent には探索させない。
export function resolveDeliverableSchemaRef(
  rulebookId: string | undefined,
  localId: string | undefined,
): string {
  if (!rulebookId || rulebookId === "none") return MISSING;
  const fm = loadRulebookRefs(rulebookId);
  if (fm.target_format !== "yaml") return MISSING;
  if (fm.schema === "none") return MISSING;
  if (fm.schema) return schemaRepoPath(fm.schema);
  const prefix = rulebookId.replace(/-rulebook$/, "");
  const root = specdojoRootDir();
  for (const id of [localId, prefix]) {
    if (!id) continue;
    if (existsSync(join(root, SCHEMA_BASE, `${id}.schema.yaml`))) return schemaRepoPath(id);
  }
  return MISSING;
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
