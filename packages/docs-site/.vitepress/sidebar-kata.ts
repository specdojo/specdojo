// 型のメニュー（ルール・レシピ・サンプル・テンプレート）を docs/ja/specdojo/ の型の文書から組み立てる（PJR-C8J8）。
// 文書サイトが設定を読み込むときにその場で組み立て、生成物は Git に残さない。
// 起点は非推奨でない rulebook で、frontmatter の recipe・sample・template・includes から
// 4 種類のメニューの項目と子の項目を作る。分類と並び・表示名の上書きは sidebar-kata-config.ts に書く。
import { existsSync, readFileSync, readdirSync } from "node:fs";
import * as path from "node:path";
import type { SidebarItem } from "./sidebar-config.js";
import type { KataMenuConfig, KataMenuEntry } from "./sidebar-kata-config.js";

export const KATA_KINDS = ["rulebooks", "recipes", "samples", "templates"] as const;
export type KataKind = (typeof KATA_KINDS)[number];
type CompanionKind = Exclude<KataKind, "rulebooks">;
const COMPANION_KINDS: readonly CompanionKind[] = ["recipes", "samples", "templates"];
// rulebook の frontmatter で各メニューの型を指すフィールド。
const COMPANION_FIELD: Record<CompanionKind, string> = {
  recipes: "recipe",
  samples: "sample",
  templates: "template",
};

export type KataDoc = {
  kind: KataKind;
  // 拡張子を除いたファイル名。doc id の local 部分と一致する。
  stem: string;
  isYaml: boolean;
  status: string | undefined;
  // Markdown は H1、YAML は title。
  title: string | undefined;
  // frontmatter の rulebook が指す rulebook 名（`-rulebook` なし）。
  rulebookName: string | undefined;
  link: string;
};

type RulebookDoc = KataDoc & {
  // ファイル名から `-rulebook` を除いた名前。
  name: string;
  deliverableType: string | undefined;
  // recipe・sample・template が指す型のファイル名。undecided・not-needed は項目を作らない。
  companions: Record<CompanionKind, string[]>;
  includes: string[];
};

export type KataMenus = Record<KataKind, SidebarItem[]>;

type FrontmatterValue = string | string[];
type Frontmatter = Record<string, FrontmatterValue>;

const unquote = (value: string): string => {
  const trimmed = value.replace(/\s+#.*$/, "").trim();
  const quoted = trimmed.match(/^(["'])(.*)\1$/);
  return quoted ? quoted[2] : trimmed;
};

const parseScalarOrFlowList = (raw: string): FrontmatterValue => {
  const value = unquote(raw);
  const flow = value.match(/^\[(.*)\]$/);
  if (!flow) return value;
  return flow[1]
    .split(",")
    .map((item) => unquote(item))
    .filter((item) => item !== "");
};

const indentOf = (line: string): number => line.length - line.trimStart().length;

// 字下げされた `key: value` と `key:` に続く `- item` の並びだけを読む。
// 型の frontmatter はこの形に限られるため、YAML パーサーへの依存を足さない。
function parseMappingLines(lines: readonly string[]): Frontmatter {
  const result: Frontmatter = {};
  const keyIndent = lines.find((line) => line.trim() !== "")?.match(/^\s*/)?.[0].length ?? 0;
  let listKey: string | undefined;
  for (const line of lines) {
    if (line.trim() === "" || line.trimStart().startsWith("#")) continue;
    const indent = indentOf(line);
    const item = line.trim().match(/^-\s+(.+)$/);
    if (item && listKey && indent >= keyIndent) {
      const current = result[listKey];
      result[listKey] = [...(Array.isArray(current) ? current : []), unquote(item[1])];
      continue;
    }
    if (indent !== keyIndent) continue;
    const pair = line.trim().match(/^([A-Za-z0-9_-]+):(?:\s+(.*))?$/);
    if (!pair) continue;
    const [, key, raw] = pair;
    if (raw === undefined || raw.trim() === "") {
      result[key] = [];
      listKey = key;
    } else {
      result[key] = parseScalarOrFlowList(raw);
      listKey = undefined;
    }
  }
  return result;
}

// 列 0 の `name:` に続く字下げされた行を取り出す。
function nestedBlock(lines: readonly string[], name: string): string[] | undefined {
  const start = lines.findIndex((line) => line.trimEnd() === `${name}:`);
  if (start < 0) return undefined;
  const block: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (line.trim() !== "" && indentOf(line) === 0) break;
    block.push(line);
  }
  return block;
}

const topLevelLines = (lines: readonly string[]): string[] =>
  lines.filter((line) => indentOf(line) === 0 && !line.startsWith("-"));

// Markdown は `specdojo:` 名前空間、YAML はトップレベル（無ければ x-spec-meta）を読む。
export function readKataMetadata(content: string, isYaml: boolean): Frontmatter {
  if (isYaml) {
    const lines = content.split(/\r?\n/);
    const meta = nestedBlock(lines, "x-spec-meta");
    return { ...parseMappingLines(topLevelLines(lines)), ...(meta ? parseMappingLines(meta) : {}) };
  }
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const lines = match[1].split(/\r?\n/);
  const namespaced = nestedBlock(lines, "specdojo");
  return namespaced ? parseMappingLines(namespaced) : parseMappingLines(topLevelLines(lines));
}

const scalar = (value: FrontmatterValue | undefined): string | undefined =>
  typeof value === "string" && value !== "" ? value : undefined;

const list = (value: FrontmatterValue | undefined): string[] =>
  value === undefined ? [] : Array.isArray(value) ? value : value === "" ? [] : [value];

const localId = (id: string): string => id.slice(id.lastIndexOf(":") + 1);

const rulebookNameOf = (stem: string): string => stem.replace(/-rulebook$/, "");

const readTitle = (content: string, isYaml: boolean, metadata: Frontmatter): string | undefined => {
  if (isYaml) return scalar(metadata.title);
  const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
  return body.match(/^# (.+)$/m)?.[1].trim();
};

const kataLink = (kind: KataKind, stem: string, isYaml: boolean): string =>
  // YAML の型は yaml-pages build が生成する表示用ページへリンクする。
  isYaml ? `/ja/specdojo/${kind}/generated/${stem}` : `/ja/specdojo/${kind}/${stem}`;

// 型の置き場所（docs/ja/specdojo/<kind>/ 直下）の Markdown と YAML を読む。生成物の generated/ は読まない。
export function readKataDocs(specdojoDir: string): KataDoc[] {
  const docs: KataDoc[] = [];
  for (const kind of KATA_KINDS) {
    const dir = path.join(specdojoDir, kind);
    if (!existsSync(dir)) continue;
    const files = readdirSync(dir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && /\.(md|yaml)$/.test(entry.name))
      .map((entry) => entry.name)
      .sort();
    for (const fileName of files) {
      const isYaml = fileName.endsWith(".yaml");
      const stem = fileName.replace(/\.(md|yaml)$/, "");
      const content = readFileSync(path.join(dir, fileName), "utf8");
      const metadata = readKataMetadata(content, isYaml);
      const rulebookRef = scalar(metadata.rulebook);
      const doc: KataDoc = {
        kind,
        stem,
        isYaml,
        status: scalar(metadata.status),
        title: readTitle(content, isYaml, metadata),
        rulebookName:
          rulebookRef && rulebookRef !== "none" ? rulebookNameOf(localId(rulebookRef)) : undefined,
        link: kataLink(kind, stem, isYaml),
      };
      if (kind !== "rulebooks") {
        docs.push(doc);
        continue;
      }
      const companions = Object.fromEntries(
        COMPANION_KINDS.map((companion) => [
          companion,
          list(metadata[COMPANION_FIELD[companion]])
            .filter((value) => value !== "undecided" && value !== "not-needed")
            .map(localId),
        ]),
      ) as Record<CompanionKind, string[]>;
      const rulebook: RulebookDoc = {
        ...doc,
        name: rulebookNameOf(stem),
        deliverableType: scalar(metadata.deliverable_type),
        companions,
        includes: list(metadata.includes).map((id) => rulebookNameOf(localId(id))),
      };
      docs.push(rulebook);
    }
  }
  return docs;
}

const isRulebookDoc = (doc: KataDoc): doc is RulebookDoc => "companions" in doc;
const isActive = (doc: KataDoc): boolean => doc.status !== "deprecated";

const stripMarkdownLinks = (text: string): string => text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
const isPlaceholderOnly = (text: string): boolean => /^(_[A-Z0-9_-]+_\s*)+$/.test(text);

// 「作成ルール」と、末尾の英字だけの補足（例: 「（CXD）」）を落として成果物の名称にする。
export function rulebookLabelFromTitle(title: string): string {
  return stripMarkdownLinks(title)
    .replace(/（非推奨）$/, "")
    .replace(/\s*(ドキュメント)?作成ルール$/, "")
    .replace(/\s*（[\x20-\x7e]+）$/, "")
    .trim();
}

// 「サンプル」「作成レシピ」などの接尾辞と「対象: 」の前置きを落とす。
export function kataLabelFromTitle(title: string): string | undefined {
  const cleaned = stripMarkdownLinks(title)
    .replace(/\s*(作成レシピ|実行レシピ|（サンプル）|サンプル)$/, "")
    .trim();
  const label =
    cleaned
      .split(/:\s+|：/)
      .pop()
      ?.trim() ?? "";
  return label === "" || isPlaceholderOnly(label) ? undefined : label;
}

type PlacedRulebook = { type: "rulebook"; doc: RulebookDoc; children: PlacedRulebook[] };
type PlacedNode =
  | { type: "group"; text: string; items: PlacedNode[] }
  | PlacedRulebook
  | { type: "kata"; doc: KataDoc };
type PlacedGroup = Extract<PlacedNode, { type: "group" }>;

type Placement = {
  root: PlacedNode[];
  fallback: PlacedGroup;
  // ツリーに置いた rulebook（includes の子を含む）。
  placed: Map<string, RulebookDoc>;
};

function placeRulebooks(docs: readonly KataDoc[], config: KataMenuConfig): Placement {
  const rulebooks = new Map(
    docs
      .filter(isRulebookDoc)
      .filter(isActive)
      .map((doc) => [doc.name, doc] as const),
  );
  const kataByStem = new Map(
    docs.filter((doc) => doc.kind !== "rulebooks" && isActive(doc)).map((doc) => [doc.stem, doc]),
  );
  const explicit = new Set<string>();
  const collect = (entries: readonly KataMenuEntry[]): void => {
    for (const entry of entries) {
      if (typeof entry === "string") explicit.add(entry);
      else collect(entry.items);
    }
  };
  collect(config.menu);

  // includes で 1 つの rulebook だけから参照され、設定に並びが無い rulebook は、その子にする。
  // 複数から参照される共通の記法ルールは、設定か deliverable_type で置く。
  const parents = new Map<string, string[]>();
  for (const rulebook of rulebooks.values()) {
    for (const child of rulebook.includes) {
      if (!rulebooks.has(child) || child === rulebook.name) continue;
      parents.set(child, [...(parents.get(child) ?? []), rulebook.name]);
    }
  }
  const childNames = (parent: string): string[] =>
    [...parents.entries()]
      .filter(([child, of]) => of.length === 1 && of[0] === parent && !explicit.has(child))
      .map(([child]) => child)
      .sort();

  const placed = new Map<string, RulebookDoc>();
  const placeRulebook = (doc: RulebookDoc, ancestors: ReadonlySet<string>): PlacedRulebook => {
    placed.set(doc.name, doc);
    const lineage = new Set([...ancestors, doc.name]);
    const children = childNames(doc.name)
      .filter((name) => !lineage.has(name) && !placed.has(name))
      .map((name) => placeRulebook(rulebooks.get(name) as RulebookDoc, lineage));
    return { type: "rulebook", doc, children };
  };

  const groupByType = new Map<string, PlacedGroup>();
  const resolve = (entries: readonly KataMenuEntry[]): PlacedNode[] =>
    entries.flatMap((entry): PlacedNode[] => {
      if (typeof entry !== "string") {
        const group: PlacedGroup = { type: "group", text: entry.text, items: [] };
        for (const type of entry.deliverableTypes ?? []) {
          if (!groupByType.has(type)) groupByType.set(type, group);
        }
        group.items = resolve(entry.items);
        return [group];
      }
      const rulebook = rulebooks.get(entry);
      if (rulebook && !placed.has(entry)) return [placeRulebook(rulebook, new Set())];
      const kata = kataByStem.get(entry);
      return kata ? [{ type: "kata", doc: kata }] : [];
    });
  const root = resolve(config.menu);

  const fallback: PlacedGroup = { type: "group", text: config.fallbackGroupText, items: [] };
  const isChild = (name: string): boolean =>
    (parents.get(name)?.length ?? 0) === 1 && !explicit.has(name);
  for (const rulebook of [...rulebooks.values()].sort((a, b) => a.name.localeCompare(b.name))) {
    if (placed.has(rulebook.name) || isChild(rulebook.name)) continue;
    const group = groupByType.get(rulebook.deliverableType ?? "") ?? fallback;
    group.items.push(placeRulebook(rulebook, new Set()));
  }
  // 親が非推奨などで置かれなかった子も、メニューから欠けないように置く。
  for (const rulebook of [...rulebooks.values()].sort((a, b) => a.name.localeCompare(b.name))) {
    if (!placed.has(rulebook.name)) fallback.items.push(placeRulebook(rulebook, new Set()));
  }
  return { root, fallback, placed };
}

function* walkRulebooks(nodes: readonly PlacedNode[]): Generator<PlacedRulebook> {
  for (const node of nodes) {
    if (node.type === "group") yield* walkRulebooks(node.items);
    if (node.type === "rulebook") {
      yield node;
      yield* walkRulebooks(node.children);
    }
  }
}

function* walkKata(nodes: readonly PlacedNode[]): Generator<KataDoc> {
  for (const node of nodes) {
    if (node.type === "group") yield* walkKata(node.items);
    if (node.type === "kata") yield node.doc;
  }
}

// rulebook ごとに、その下に出す recipe・sample・template を決める。
// rulebook の frontmatter が指すものを先に割り当て、残りは設定の attach・型の frontmatter の rulebook・
// ファイル名の接頭辞（例: `pjr-todo-template` → `pjr`）の順で rulebook に付ける。
type Ownership = {
  owned: Map<string, KataDoc[]>;
  extras: Map<string, KataDoc[]>;
  orphans: KataDoc[];
};

function assignCompanions(
  kind: CompanionKind,
  docs: readonly KataDoc[],
  placement: Placement,
  config: KataMenuConfig,
): Ownership {
  const byStem = new Map(
    docs.filter((doc) => doc.kind === kind && isActive(doc)).map((doc) => [doc.stem, doc]),
  );
  const nodes = [...placement.root, placement.fallback];
  const claimed = new Set([...walkKata(nodes)].map((doc) => doc.stem));
  const owned = new Map<string, KataDoc[]>();
  for (const { doc: rulebook } of walkRulebooks(nodes)) {
    const mine = rulebook.companions[kind]
      .map((stem) => byStem.get(stem))
      .filter((doc): doc is KataDoc => doc !== undefined && !claimed.has(doc.stem));
    for (const doc of mine) claimed.add(doc.stem);
    owned.set(rulebook.name, mine);
  }

  const names = [...placement.placed.keys()].sort((a, b) => b.length - a.length);
  const ownerOf = (doc: KataDoc): string | undefined => {
    const attached = config.attach[doc.stem];
    if (attached && placement.placed.has(attached)) return attached;
    if (doc.rulebookName && placement.placed.has(doc.rulebookName)) return doc.rulebookName;
    return names.find((name) => doc.stem.startsWith(`${name}-`));
  };
  const extras = new Map<string, KataDoc[]>();
  const orphans: KataDoc[] = [];
  for (const doc of [...byStem.values()].sort((a, b) => a.stem.localeCompare(b.stem))) {
    if (claimed.has(doc.stem)) continue;
    const owner = ownerOf(doc);
    if (owner) extras.set(owner, [...(extras.get(owner) ?? []), doc]);
    else orphans.push(doc);
  }
  return { owned, extras, orphans };
}

type RenderContext = {
  kind: KataKind;
  config: KataMenuConfig;
  ownership: Ownership | undefined;
};

const group = (text: string, items: SidebarItem[]): SidebarItem[] =>
  items.length > 0 ? [{ text, collapsed: true, items }] : [];

const withChildren = (item: SidebarItem, children: SidebarItem[]): SidebarItem =>
  children.length > 0 ? { ...item, collapsed: true, items: children } : item;

const rulebookLabel = (doc: RulebookDoc, config: KataMenuConfig): string =>
  config.labels[doc.name] ??
  (doc.title ? rulebookLabelFromTitle(doc.title) : undefined) ??
  doc.name;

const kataLabel = (doc: KataDoc, config: KataMenuConfig): string =>
  config.labels[doc.stem] ?? (doc.title ? kataLabelFromTitle(doc.title) : undefined) ?? doc.stem;

const kataItem = (doc: KataDoc, config: KataMenuConfig): SidebarItem => ({
  text: kataLabel(doc, config),
  link: doc.link,
});

// 設定の children に書いた順に並べ、残りをファイル名順で後ろへ足す。
function orderChildren(
  docs: readonly KataDoc[],
  entries: readonly KataMenuEntry[],
  config: KataMenuConfig,
): SidebarItem[] {
  const remaining = new Map(docs.map((doc) => [doc.stem, doc]));
  const take = (list: readonly KataMenuEntry[]): SidebarItem[] =>
    list.flatMap((entry): SidebarItem[] => {
      if (typeof entry !== "string") return group(entry.text, take(entry.items));
      const doc = remaining.get(entry);
      if (!doc) return [];
      remaining.delete(entry);
      return [kataItem(doc, config)];
    });
  const ordered = take(entries);
  return [...ordered, ...[...remaining.values()].map((doc) => kataItem(doc, config))];
}

function renderRulebook(node: PlacedRulebook, context: RenderContext): SidebarItem[] {
  const { kind, config, ownership } = context;
  const label = rulebookLabel(node.doc, config);
  const childItems = node.children.flatMap((child) => renderRulebook(child, context));
  if (kind === "rulebooks" || !ownership) {
    return [withChildren({ text: label, link: node.doc.link }, childItems)];
  }
  const [primary, ...rest] = ownership.owned.get(node.doc.name) ?? [];
  const extras = ownership.extras.get(node.doc.name) ?? [];
  const restDocs = [...rest, ...extras];
  const restItems = orderChildren(restDocs, config.children[node.doc.name] ?? [], config);
  if (primary) {
    return [withChildren({ text: label, link: primary.link }, [...restItems, ...childItems])];
  }
  // rulebook が直接指さない型が 1 件だけなら、rulebook の表示名でその型を出す。
  if (restDocs.length === 1 && childItems.length === 0) {
    const [only] = restDocs;
    return [{ text: config.labels[only.stem] ?? label, link: only.link }];
  }
  return [...restItems, ...childItems];
}

function renderNodes(nodes: readonly PlacedNode[], context: RenderContext): SidebarItem[] {
  return nodes.flatMap((node): SidebarItem[] => {
    if (node.type === "group") return group(node.text, renderNodes(node.items, context));
    if (node.type === "rulebook") return renderRulebook(node, context);
    return node.doc.kind === context.kind ? [kataItem(node.doc, context.config)] : [];
  });
}

export function buildKataMenusFromDocs(
  docs: readonly KataDoc[],
  config: KataMenuConfig,
): KataMenus {
  const placement = placeRulebooks(docs, config);
  const render = (kind: KataKind): SidebarItem[] => {
    const ownership =
      kind === "rulebooks" ? undefined : assignCompanions(kind, docs, placement, config);
    const context: RenderContext = { kind, config, ownership };
    const fallbackItems = [
      ...renderNodes(placement.fallback.items, context),
      ...(ownership?.orphans ?? []).map((doc) => kataItem(doc, config)),
    ];
    return [
      ...renderNodes(placement.root, context),
      ...group(placement.fallback.text, fallbackItems),
    ];
  };
  return {
    rulebooks: render("rulebooks"),
    recipes: render("recipes"),
    samples: render("samples"),
    templates: render("templates"),
  };
}

// specdojoDir は docs/ja/specdojo に当たるディレクトリ。
export function buildKataMenus(specdojoDir: string, config: KataMenuConfig): KataMenus {
  return buildKataMenusFromDocs(readKataDocs(specdojoDir), config);
}
