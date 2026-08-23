import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { specdojoRootDir } from "./specdojo-config.js";
import { readSpecdojoNamespace } from "./frontmatter-namespace.js";
import { parsePracticeId, practiceLocalId, qualifyPracticeId } from "./practice-id.js";

// 実践の型（rulebook / recipe / sample / template）の解決を 1 か所に集約する。
// plan 生成（明示パスの注入）と validate（参照先の存在確認）の両方から使う。

const MISSING = "_MISSING_";
// 解決できなかった実践の型を表すマーカー。呼び出し側が解決結果を判定できるよう公開する。
export const KATA_MISSING = MISSING;
const DOCS_BASE = "docs/ja/specdojo";
// schema は言語非依存の正本資産（docs/ja/* の下ではない）。
const SCHEMA_BASE = "docs/specdojo/schemas/v1";

export type KataKind = "recipe" | "sample" | "template";

export type KataRefs = {
  rulebook: string;
  recipe: string;
  sample: string;
  template: string;
};

export type CatalogKataDeclarations = Partial<Record<keyof KataRefs, string>>;

type RulebookRefs = {
  recipe?: string;
  sample?: string;
  template?: string;
  target_format?: string;
  schema?: string;
  includes?: string[];
};

const KIND_DIR: Record<KataKind, string> = {
  recipe: "recipes",
  sample: "samples",
  template: "templates",
};

function rulebookFsPath(rulebookId: string): string {
  return join(specdojoRootDir(), DOCS_BASE, "rulebooks", `${practiceLocalId(rulebookId)}.md`);
}

// 実践の型種別 → repo ルート相対ディレクトリ。commit 許可リスト（maintenance / bootstrap 系
// approach で実践の型の変更を許可する範囲）の導出に使う。
export function kataDirsForKinds(kinds: readonly (keyof KataRefs)[]): string[] {
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
  const strArray = (value: unknown): string[] | undefined =>
    Array.isArray(value)
      ? value.filter((v): v is string => typeof v === "string" && v !== "")
      : undefined;
  return {
    recipe: str(fm.recipe),
    sample: str(fm.sample),
    template: str(fm.template),
    target_format: str(fm.target_format),
    schema: str(fm.schema),
    includes: strArray(fm.includes),
  };
}

// sample / template は対象成果物のフォーマットに合わせて拡張子が変わる。
function formatExt(targetFormat: string | undefined): string {
  return targetFormat === "yaml" ? "yaml" : targetFormat === "json" ? "json" : "md";
}

// Canonical repo-root-relative path (no leading slash): the agent opens these files
// from the run CWD (repo root or worktree root).
function repoPath(kind: KataKind, id: string, ext: string): string {
  return `${DOCS_BASE}/${KIND_DIR[kind]}/${practiceLocalId(id)}.${ext}`;
}

// rulebook 未宣言時の慣例 ID（<rulebook-prefix>-<kind>）。
// 例: rulebook `specdojo:pm-organization-rulebook` → sample `specdojo:pm-organization-sample`。
function conventionalRefId(rulebookId: string, kind: KataKind): string {
  const { authority, localId } = parsePracticeId(rulebookId);
  const conventionalId = `${localId.replace(/-rulebook$/, "")}-${kind}`;
  return authority ? qualifyPracticeId(authority, conventionalId) : conventionalId;
}

// recipe / sample / template を 1 件解決する。
// 宣言があればそれを正とする。'none' は明示的な無効化として MISSING を返す。
// 未宣言の場合は規定ディレクトリ上の慣例ファイルを探し、実在すればそのパスを返す。
function resolveRef(
  kind: KataKind,
  declaredId: string | undefined,
  rulebookId: string,
  ext: string,
): string {
  if (declaredId === "none" || declaredId === "not-needed") return MISSING;
  if (declaredId) return repoPath(kind, declaredId, ext);
  const fallbackId = conventionalRefId(rulebookId, kind);
  const fsPath = join(
    specdojoRootDir(),
    DOCS_BASE,
    KIND_DIR[kind],
    `${practiceLocalId(fallbackId)}.${ext}`,
  );
  return existsSync(fsPath) ? repoPath(kind, fallbackId, ext) : MISSING;
}

// 成果物の rulebook ID を起点に、recipe / sample / template の repo 相対パスを解決する。
// recipe / sample / template は rulebook frontmatter の宣言を正とし、未宣言なら規定
// ディレクトリ上の慣例ファイルの実在を確認してパスを補う。
// 該当なしの項目は MISSING を返し、表示構造はテンプレート側に委ねる。
export function resolveKataRefs(
  rulebookId: string | undefined,
  catalog: CatalogKataDeclarations = {},
): KataRefs {
  const usableRulebookId =
    rulebookId && rulebookId !== "none" && rulebookId !== "not-needed" ? rulebookId : undefined;
  const fm = usableRulebookId ? loadRulebookRefs(usableRulebookId) : {};
  const hasCatalogKataSet = (["recipe", "sample", "template"] as const).some(
    (kind) => catalog[kind] !== undefined,
  );
  const directOrLegacy = (kind: KataKind): string | undefined =>
    hasCatalogKataSet ? catalog[kind] : fm[kind];
  return {
    rulebook: usableRulebookId
      ? `${DOCS_BASE}/rulebooks/${practiceLocalId(usableRulebookId)}.md`
      : MISSING,
    recipe: usableRulebookId
      ? resolveRef("recipe", directOrLegacy("recipe"), usableRulebookId, "md")
      : resolveRefWithoutRulebook("recipe", catalog.recipe, "md"),
    sample: usableRulebookId
      ? resolveRef(
          "sample",
          directOrLegacy("sample"),
          usableRulebookId,
          formatExt(fm.target_format),
        )
      : resolveRefWithoutRulebook("sample", catalog.sample, "md"),
    template: usableRulebookId
      ? resolveRef(
          "template",
          directOrLegacy("template"),
          usableRulebookId,
          formatExt(fm.target_format),
        )
      : resolveRefWithoutRulebook("template", catalog.template, "md"),
  };
}

function resolveRefWithoutRulebook(
  kind: KataKind,
  declaredId: string | undefined,
  ext: string,
): string {
  if (!declaredId || declaredId === "none" || declaredId === "not-needed") return MISSING;
  return repoPath(kind, declaredId, ext);
}

// rulebook の repo 相対パス（先頭スラッシュ無し）。
function rulebookRepoPath(rulebookId: string): string {
  return `${DOCS_BASE}/rulebooks/${practiceLocalId(rulebookId)}.md`;
}

// 主 rulebook の frontmatter `includes` から、併せて適用する rulebook の宣言順・重複除去済み
// ID 一覧を返す。自己参照は除外する。単一段のみ（include 先の include はたどらない）。
function declaredIncludeIds(rulebookId: string): string[] {
  const fm = loadRulebookRefs(rulebookId);
  const ids = fm.includes ?? [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids) {
    if (id === rulebookId || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

// plan 注入用: 主 rulebook が include する rulebook の repo 相対パス一覧。
// 実在するファイルのみを返す（不在の宣言は validate で警告する）。
export function resolveIncludedRulebooks(rulebookId: string | undefined): string[] {
  if (!rulebookId || rulebookId === "none" || rulebookId === "not-needed") return [];
  return declaredIncludeIds(rulebookId)
    .filter((id) => existsSync(rulebookFsPath(id)))
    .map((id) => rulebookRepoPath(id));
}

export type DeclaredInclude = {
  id: string;
  fsPath: string;
  selfReference: boolean;
};

// validate 用: 主 rulebook が宣言する include の一覧（実在に関わらず）。
// 自己参照フラグ付きで返し、呼び出し側で存在・種別を検査する。
export function declaredIncludes(rulebookId: string): DeclaredInclude[] {
  const fm = loadRulebookRefs(rulebookId);
  const ids = fm.includes ?? [];
  const seen = new Set<string>();
  const out: DeclaredInclude[] = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({ id, fsPath: rulebookFsPath(id), selfReference: id === rulebookId });
  }
  return out;
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
  if (!rulebookId || rulebookId === "none" || rulebookId === "not-needed") return MISSING;
  const fm = loadRulebookRefs(rulebookId);
  if (fm.target_format !== "yaml") return MISSING;
  if (fm.schema === "none") return MISSING;
  if (fm.schema) return schemaRepoPath(fm.schema);
  const prefix = practiceLocalId(rulebookId).replace(/-rulebook$/, "");
  const root = specdojoRootDir();
  for (const id of [localId, prefix]) {
    if (!id) continue;
    if (existsSync(join(root, SCHEMA_BASE, `${id}.schema.yaml`))) return schemaRepoPath(id);
  }
  return MISSING;
}

export type DeclaredKata = {
  kind: KataKind;
  id: string;
  fsPath: string;
};

// rulebook frontmatter で宣言された recipe / sample / template の絶対パス一覧。
// none・未宣言は含めない（validate で存在確認するため）。
export function declaredKata(rulebookId: string): DeclaredKata[] {
  const fm = loadRulebookRefs(rulebookId);
  const root = specdojoRootDir();
  const out: DeclaredKata[] = [];
  const add = (kind: KataKind, id: string | undefined, ext: string): void => {
    if (id && id !== "none") {
      out.push({
        kind,
        id,
        fsPath: join(root, DOCS_BASE, KIND_DIR[kind], `${practiceLocalId(id)}.${ext}`),
      });
    }
  };
  add("recipe", fm.recipe, "md");
  add("sample", fm.sample, formatExt(fm.target_format));
  add("template", fm.template, formatExt(fm.target_format));
  return out;
}
