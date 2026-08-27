import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { specdojoRootDir } from "./specdojo-config.js";
import { readSpecdojoNamespace } from "./frontmatter-namespace.js";
import { practiceLocalId } from "./practice-id.js";
import { readYamlSchemaModelineRef } from "./yaml-schema-modeline.js";

// 実践の型（rulebook / recipe / sample / template）の解決を 1 か所に集約する。
// plan 生成（明示パスの注入）と validate（参照先の存在確認）の両方から使う。

const MISSING = "_MISSING_";
// 解決できなかった実践の型を表すマーカー。呼び出し側が解決結果を判定できるよう公開する。
export const KATA_MISSING = MISSING;
const DOCS_BASE = "docs/ja/specdojo";
export type KataKind = "recipe" | "sample" | "template";

export type KataRefs = {
  rulebook: string;
  recipe: string;
  sample: string;
  template: string;
};

export type KataTargetKind = "work" | "control" | "generated";

type RulebookRefs = {
  recipe?: string;
  sample?: string | string[];
  template?: string;
  target_format?: string;
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
  const strOrArray = (value: unknown): string | string[] | undefined =>
    str(value) ?? strArray(value);
  return {
    recipe: str(fm.recipe),
    sample: strOrArray(fm.sample),
    template: str(fm.template),
    target_format: str(fm.target_format),
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

// 宣言 ID は拡張子を持たないため、対象形式を優先しつつ実在する例外形式も解決する。
// dct-index の YAML 正本に対する Markdown 生成ビュー template などが該当する。
function declaredRefExt(kind: KataKind, id: string, preferredExt: string): string {
  const candidates = kind === "recipe" ? ["md"] : [preferredExt, "md", "yaml", "json"];
  for (const ext of [...new Set(candidates)]) {
    if (existsSync(join(specdojoRootDir(), repoPath(kind, id, ext)))) return ext;
  }
  return preferredExt;
}

// recipe / sample / template を 1 件解決する。
// rulebook frontmatter の宣言だけを正とする。未判断・不要・未宣言は MISSING を返す。
function resolveRef(
  kind: KataKind,
  declaredId: string | string[] | undefined,
  ext: string,
): string {
  // 複数 sample は宣言順の先頭を既定例として使う。
  const primaryId = Array.isArray(declaredId) ? declaredId[0] : declaredId;
  if (primaryId === "none" || primaryId === "undecided" || primaryId === "not-needed") {
    return MISSING;
  }
  if (primaryId) return repoPath(kind, primaryId, declaredRefExt(kind, primaryId, ext));
  return MISSING;
}

// 成果物の rulebook ID を起点に、recipe / sample / template の repo 相対パスを解決する。
// 要否と所在は rulebook frontmatter だけを正本とし、成果物カタログの宣言は参照しない。
// kind: generated は実践の型を適用しないため、rulebook 宣言の有無にかかわらず全項目を MISSING にする。
// 該当なしの項目は MISSING を返し、表示構造はテンプレート側に委ねる。
export function resolveKataRefs(
  rulebookId: string | undefined,
  targetKind?: KataTargetKind,
): KataRefs {
  if (targetKind === "generated") {
    return { rulebook: MISSING, recipe: MISSING, sample: MISSING, template: MISSING };
  }
  const usableRulebookId =
    rulebookId && rulebookId !== "none" && rulebookId !== "undecided" && rulebookId !== "not-needed"
      ? rulebookId
      : undefined;
  const fm = usableRulebookId ? loadRulebookRefs(usableRulebookId) : {};
  return {
    rulebook: usableRulebookId
      ? `${DOCS_BASE}/rulebooks/${practiceLocalId(usableRulebookId)}.md`
      : MISSING,
    recipe: usableRulebookId ? resolveRef("recipe", fm.recipe, "md") : MISSING,
    sample: usableRulebookId
      ? resolveRef("sample", fm.sample, formatExt(fm.target_format))
      : MISSING,
    template: usableRulebookId
      ? resolveRef("template", fm.template, formatExt(fm.target_format))
      : MISSING,
  };
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
  if (
    !rulebookId ||
    rulebookId === "none" ||
    rulebookId === "undecided" ||
    rulebookId === "not-needed"
  ) {
    return [];
  }
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

// 成果物を検証する schema の repo 相対パスを、対象 YAML の yaml-language-server
// modeline から解決する。schema の正本は rulebook frontmatter や命名規約ではなく
// YAML ファイル自身の先頭宣言である。
export function resolveDeliverableSchemaRef(deliverablePath: string | undefined): string {
  return readYamlSchemaModelineRef(specdojoRootDir(), deliverablePath) ?? MISSING;
}

export type DeclaredKata = {
  kind: KataKind;
  id: string;
  fsPath: string;
};

// rulebook frontmatter で宣言された recipe / sample / template の絶対パス一覧。
// not-needed・undecided・旧 none・未宣言は含めない（validate で存在確認するため）。
export function declaredKata(rulebookId: string): DeclaredKata[] {
  const fm = loadRulebookRefs(rulebookId);
  const root = specdojoRootDir();
  const out: DeclaredKata[] = [];
  const add = (kind: KataKind, value: string | string[] | undefined, ext: string): void => {
    const ids = Array.isArray(value) ? value : value ? [value] : [];
    for (const id of ids) {
      if (id === "none" || id === "not-needed" || id === "undecided") continue;
      out.push({
        kind,
        id,
        fsPath: join(root, repoPath(kind, id, declaredRefExt(kind, id, ext))),
      });
    }
  };
  add("recipe", fm.recipe, "md");
  add("sample", fm.sample, formatExt(fm.target_format));
  add("template", fm.template, formatExt(fm.target_format));
  return out;
}
