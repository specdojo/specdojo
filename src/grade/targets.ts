import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { extname, isAbsolute, join, relative, resolve } from "node:path";
import { load } from "../shared/yaml.js";
import { collectResolvedDeliverables, loadCatalogDocs } from "../catalog/build.js";
import { isTrashedPath, resolveBasePath } from "../catalog/paths.js";
import { listFilesRecursive } from "../exec/shared.js";
import { gradeContentHash } from "./result.js";
import {
  GRADE_TARGETS,
  KATA_DIRS,
  KATA_REFERENCE_EXTENSIONS,
  KATA_REFERENCE_FIELDS,
  gradedViewpoints,
  isRecord,
  parseMarkdown,
  type GradeDoneCriterion,
  type GradeTarget,
  type MarkdownDocument,
} from "./core.js";
import { resolveViewpointsDoc } from "../review/plan.js";
import type { GradeRubric, ReviewViewpointsDoc } from "../review/types.js";
import {
  assertValidActor,
  getProjectCatalogPath,
  getProjectMembersPath,
  getProjectRolesPath,
  getProjectSchedulePath,
  getProjectViewpointsPath,
  loadConfig,
  specdojoRootDir,
  type MemberRoster,
  type SpecDojoProjectConfig,
} from "../shared/specdojo-config.js";

export function resolveProject(projectOption?: string): {
  id: string;
  project: SpecDojoProjectConfig;
} {
  const { config } = loadConfig();
  if (!config) throw new Error("grade commands require .specdojo/specdojo.config.json");
  const id =
    projectOption?.trim() || config.current_project || Object.keys(config.projects)[0] || "";
  const project = config.projects[id];
  if (!project) throw new Error(`Unknown project: ${id}`);
  return { id, project };
}

export function loadViewpoints(projectOption?: string): ReviewViewpointsDoc {
  const { project } = resolveProject(projectOption);
  const path = getProjectViewpointsPath(project);
  if (!path) throw new Error("viewpoints_path is required for grade");
  return resolveViewpointsDoc(resolve(specdojoRootDir(), path));
}

// 対象探索は観点定義が無いプロジェクトでも動かす。その場合は突き合わせ先を持たない扱いにする。
export function loadViewpointsIfConfigured(
  projectOption: string | undefined,
  rootDir: string,
): ReviewViewpointsDoc | undefined {
  const path = getProjectViewpointsPath(resolveProject(projectOption).project);
  if (!path || !existsSync(resolve(rootDir, path))) return undefined;
  return resolveViewpointsDoc(resolve(rootDir, path));
}

export function resolveGradeActor(actor: string, roster: MemberRoster | null): string {
  const normalized = actor.trim();
  if (!normalized) throw new Error("--by must be a non-empty agent-members.yaml nickname");
  if (!roster) throw new Error("members_path is required for grade apply --by");
  assertValidActor(normalized, roster);
  if (roster.members.filter((member) => member.nickname === normalized).length !== 1) {
    throw new Error(`Duplicate actor nickname in members_path: ${normalized}`);
  }
  return normalized;
}

export function assertRubric(doc: ReviewViewpointsDoc): GradeRubric {
  const rubric = doc.grade_rubric;
  if (!rubric) throw new Error("Resolved viewpoints do not define grade_rubric");
  // すべての観点が grade の対象なので、重みのない category の観点は score へ黙って入らなくなる。
  for (const viewpoint of doc.viewpoints ?? []) {
    for (const target of viewpoint.grade_targets ?? GRADE_TARGETS) {
      const weight = rubric.weights[target]?.[viewpoint.category];
      if (typeof weight !== "number" || weight <= 0) {
        throw new Error(
          `grade_rubric ${rubric.id} has no ${target} weight for category '${viewpoint.category}' used by ${viewpoint.id}`,
        );
      }
    }
  }
  return rubric;
}

export function relativePathFromRoot(path: string, rootDir: string): string {
  return relative(rootDir, path).replace(/\\/g, "/");
}

export function repoRelativePath(path: string): string {
  return relativePathFromRoot(path, specdojoRootDir());
}

export type KataReference = {
  id: string;
  path: string;
  kind: (typeof KATA_DIRS)[number];
  references: string[];
};

function referenceIds(metadata: Record<string, unknown>): string[] {
  return KATA_REFERENCE_FIELDS.flatMap((field) => {
    const value = metadata[field];
    if (typeof value === "string") return [value];
    if (Array.isArray(value))
      return value.filter((item): item is string => typeof item === "string");
    return [];
  }).filter((id) => id !== "none" && id !== "undecided");
}

function parseKataReference(path: string, kind: KataReference["kind"]): KataReference | null {
  try {
    const extension = extname(path).toLowerCase();
    let metadata: Record<string, unknown>;
    if (extension === ".md") {
      metadata = parseMarkdown(readFileSync(path, "utf8"), repoRelativePath(path)).data
        .specdojo as Record<string, unknown>;
    } else {
      const parsed = load(readFileSync(path, "utf8"));
      if (!isRecord(parsed)) return null;
      metadata = isRecord(parsed.specdojo) ? parsed.specdojo : parsed;
    }
    const id = typeof metadata.id === "string" ? metadata.id.trim() : "";
    if (!id) return null;
    return { id, path, kind, references: referenceIds(metadata) };
  } catch {
    // Some reusable snippets in Kata directories are Markdown fragments rather than documents.
    return null;
  }
}

// grade の評価対象は利用リポジトリが所有する kata に限る。package 側の kata は SpecDojo が
// 管理する成果物であり、利用プロジェクトが評価・改善する対象ではない。フォールバックは
// 個別ファイルの解決にのみ用い、対象の列挙には用いない（解決と列挙を区別する）。
export function loadKataReferences(): KataReference[] {
  const references = new Map<string, KataReference>();
  const root = specdojoRootDir();
  for (const kind of KATA_DIRS) {
    const paths = listFilesRecursive(join(root, "docs/ja/specdojo", kind))
      .filter((path) => KATA_REFERENCE_EXTENSIONS.has(extname(path).toLowerCase()))
      .flatMap((path) => {
        const reference = parseKataReference(path, kind);
        return reference ? [reference] : [];
      });
    for (const reference of paths) {
      if (!references.has(reference.id)) references.set(reference.id, reference);
    }
  }
  return [...references.values()];
}

export function resolveGradeReferencePathsFromCatalog(
  path: string,
  catalog: KataReference[],
): string[] {
  const target = resolveSafeMarkdownPath(path);
  const targetDocument = parseMarkdown(readFileSync(target, "utf8"), repoRelativePath(target));
  const targetMetadata = targetDocument.data.specdojo as Record<string, unknown>;
  const targetId = typeof targetMetadata.id === "string" ? targetMetadata.id.trim() : "";
  if (!targetId) return [];

  const byId = new Map(catalog.map((item) => [item.id, item]));
  const selected = new Map<string, KataReference>();
  const add = (item: KataReference | undefined) => {
    if (item && item.path !== target) selected.set(item.id, item);
  };

  for (const id of referenceIds(targetMetadata)) add(byId.get(id));
  for (const item of catalog) if (item.references.includes(targetId)) add(item);

  // A document and the directly linked rulebook/recipe form the anchor of a Kata set.
  // Follow their declared links, but do not recursively traverse sibling back-links.
  for (let depth = 0; depth < 2; depth += 1) {
    for (const item of [...selected.values()]) {
      if (item.kind !== "rulebooks" && item.kind !== "recipes") continue;
      for (const id of item.references) add(byId.get(id));
    }
  }
  return [...selected.values()].map((item) => item.path).sort();
}

export function resolveGradeReferencePaths(path: string): string[] {
  return resolveGradeReferencePathsFromCatalog(path, loadKataReferences());
}

function gradeReferenceExampleFamily(
  target: GradeTarget,
  path: string,
  metadata: Record<string, unknown>,
): string | null {
  if (target === "kata") {
    const rel = repoRelativePath(path);
    const kind = KATA_DIRS.find((candidate) => {
      const marker = `docs/ja/specdojo/${candidate}/`;
      return rel.startsWith(marker) || rel.includes(`/${marker}`);
    });
    if (kind) return kind;
  }
  const type = typeof metadata.type === "string" ? metadata.type.trim() : "";
  return type || null;
}

export type GradeReferenceExample = {
  path: string;
  family: string | null;
  status: string;
};

export function parseGradeReferenceExample(
  path: string,
  target: GradeTarget,
): GradeReferenceExample | null {
  try {
    const absolute = resolveSafeMarkdownPath(path);
    const document = parseMarkdown(readFileSync(absolute, "utf8"), repoRelativePath(absolute));
    const metadata = document.data.specdojo as Record<string, unknown>;
    return {
      path: absolute,
      family: gradeReferenceExampleFamily(target, absolute, metadata),
      status: typeof metadata.status === "string" ? metadata.status.trim() : "",
    };
  } catch {
    return null;
  }
}

export function selectGradeReferenceExampleFromCatalog(opts: {
  target: GradeTarget;
  path: string;
  candidates: GradeReferenceExample[];
  random?: () => number;
}): string | undefined {
  const target = resolveSafeMarkdownPath(opts.path);
  const targetDocument = parseMarkdown(readFileSync(target, "utf8"), repoRelativePath(target));
  const targetMetadata = targetDocument.data.specdojo as Record<string, unknown>;
  const family = gradeReferenceExampleFamily(opts.target, target, targetMetadata);
  if (!family) return undefined;

  // 同種別だけを候補にする。種別が違うと構造も目的も異なり、記載水準の基準として
  // 誤りを招く。template はプレースホルダを正解と誤解させ、rulebook は recipe の
  // 基準にならない。該当がなければリファレンスなしで評価する。
  const candidates = opts.candidates
    .filter(
      (candidate) =>
        candidate.path !== target && candidate.family === family && candidate.status === "ready",
    )
    .map((candidate) => candidate.path)
    .sort();
  if (candidates.length === 0) return undefined;

  const random = opts.random ?? Math.random;
  const sample = random();
  const normalizedSample = Number.isFinite(sample) ? Math.max(0, sample) : 0;
  const index = Math.min(Math.floor(normalizedSample * candidates.length), candidates.length - 1);
  return candidates[index];
}

export function selectGradeReferenceExample(opts: {
  target: GradeTarget;
  path: string;
  candidates: string[];
  random?: () => number;
}): string | undefined {
  return selectGradeReferenceExampleFromCatalog({
    ...opts,
    candidates: opts.candidates.flatMap((candidate) => {
      const parsed = parseGradeReferenceExample(candidate, opts.target);
      return parsed ? [parsed] : [];
    }),
  });
}

export function resolveSafeMarkdownPath(input: string, root = specdojoRootDir()): string {
  const absolute = resolve(root, input);
  const rel = relativePathFromRoot(absolute, root);
  if (rel.startsWith("../") || isAbsolute(rel))
    throw new Error(`Path is outside repository: ${input}`);
  if (extname(absolute).toLowerCase() !== ".md") {
    throw new Error(`${input}: grade currently writes inline findings only for Markdown`);
  }
  if (!existsSync(absolute)) throw new Error(`Document not found: ${input}`);
  return absolute;
}

export function resolveSafeRepositoryPath(input: string, option: string): string {
  const root = specdojoRootDir();
  const absolute = resolve(root, input);
  const rel = relative(root, absolute);
  if (rel.startsWith("../") || isAbsolute(rel)) {
    throw new Error(`${option} must be inside the repository`);
  }
  return absolute;
}

export function isGeneratedGradeTarget(path: string, rootDir = specdojoRootDir()): boolean {
  return relativePathFromRoot(path, rootDir).split("/").includes("generated");
}

export function isTrashedGradeTarget(path: string, rootDir = specdojoRootDir()): boolean {
  return isTrashedPath(relativePathFromRoot(path, rootDir));
}

export type DeliverableCatalogEntry = {
  path: string;
  localId: string;
  doneCriteria: GradeDoneCriterion[];
  dependsOn?: string[];
  /** SHA-256 of the catalog entry definition; the catalog-entry comparison source. */
  entryHash: string;
};

function criterionId(index: number): string {
  return `DC-${String(index + 1).padStart(3, "0")}`;
}

// カタログの Markdown 成果物を絶対パスで引ける形にする。grade の対象探索と
// done_criteria の解決が同じ集合を見るよう、両者はこの関数を共有する。
export function loadDeliverableCatalog(
  projectOption?: string,
  root = specdojoRootDir(),
): Map<string, DeliverableCatalogEntry> {
  const { project } = resolveProject(projectOption);
  const catalog = getProjectCatalogPath(project);
  if (!catalog) throw new Error("catalog_path is required for deliverable grading");
  const entries = new Map<string, DeliverableCatalogEntry>();
  for (const loaded of loadCatalogDocs(resolve(root, catalog))) {
    const resolved: Parameters<typeof collectResolvedDeliverables>[2] = [];
    collectResolvedDeliverables(
      loaded.doc.groups,
      resolveBasePath("", loaded.doc.base_path),
      resolved,
    );
    for (const item of resolved) {
      if (item.item.kind === "generated" || !item.item.path) continue;
      if (!item.resolvedPath.endsWith(".md")) continue;
      if (isTrashedPath(item.resolvedPath)) continue;
      const path = resolve(root, item.resolvedPath);
      if (!existsSync(path) || entries.has(path)) continue;
      entries.set(path, {
        path,
        localId: item.item.local_id,
        dependsOn: item.item.depends_on,
        entryHash: gradeContentHash(stableJson(item.item)),
        doneCriteria: (item.item.done_criteria ?? []).map((criterion, index) => ({
          id: criterionId(index),
          text: criterion.text,
          roles: [...criterion.roles],
          viewpoint: criterion.viewpoint,
        })),
      });
    }
  }
  return entries;
}

// 成果物ごとの done_criteria 定義を、submission が使うリポジトリ相対パスで引ける形にする。
// カタログに無い文書（--path で明示した非カタログ文書）は含めず、plan と apply は
// 定義が無い文書を「完了条件なし」として扱う。
export function resolveDeliverableDoneCriteria(
  paths: readonly string[],
  projectOption?: string,
): Map<string, GradeDoneCriterion[]> {
  const catalog = loadDeliverableCatalog(projectOption);
  const result = new Map<string, GradeDoneCriterion[]>();
  for (const path of paths) {
    const entry = catalog.get(resolveSafeMarkdownPath(path));
    if (entry && entry.doneCriteria.length > 0) {
      result.set(repoRelativePath(entry.path), entry.doneCriteria);
    }
  }
  return result;
}

// キー順に依存しない直列化。カタログ項目の hash が YAML 上のキー順の入れ替えで変わらないようにする。
function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map((item) => stableJson(item)).join(",")}]`;
  if (isRecord(value)) {
    const keys = Object.keys(value)
      .filter((key) => value[key] !== undefined)
      .sort();
    return `{${keys.map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

// 突き合わせ先の変更検出（PJR-Z47X）。観点が comparison_sources で宣言した突き合わせ先と、
// 成果物の depends_on 先の hash を grade result の source_hashes へ記録し、
// --changed-only と --dependency-changed が現在の hash と比較する。
const COMPARISON_SOURCE_RE =
  /^(catalog-entry|dependencies|schedule|members|roles|deliverable:[a-z0-9][a-z0-9-]*)$/;
// 突き合わせ先が存在しないことも状態として記録し、後から作られた場合に変更として検出する。
const ABSENT_SOURCE_HASH = gradeContentHash("specdojo:grade-comparison-source-absent");

export type GradeSourceContext = {
  rootDir: string;
  project: SpecDojoProjectConfig;
  projectOption?: string;
  catalog?: Map<string, DeliverableCatalogEntry>;
  localIdToPath?: Map<string, string>;
  hashes: Map<string, string>;
};

export function createGradeSourceContext(
  projectOption: string | undefined,
  rootDir: string,
): GradeSourceContext {
  return {
    rootDir,
    project: resolveProject(projectOption).project,
    projectOption,
    hashes: new Map(),
  };
}

function sourceCatalog(context: GradeSourceContext): {
  catalog: Map<string, DeliverableCatalogEntry>;
  localIdToPath: Map<string, string>;
} {
  if (!context.catalog || !context.localIdToPath) {
    context.catalog = getProjectCatalogPath(context.project)
      ? loadDeliverableCatalog(context.projectOption, context.rootDir)
      : new Map<string, DeliverableCatalogEntry>();
    context.localIdToPath = new Map(
      [...context.catalog.entries()].map(([path, entry]) => [entry.localId, path]),
    );
  }
  return { catalog: context.catalog, localIdToPath: context.localIdToPath };
}

function hashSourceFile(path: string | undefined): string {
  if (!path || !existsSync(path)) return ABSENT_SOURCE_HASH;
  return gradeContentHash(readFileSync(path, "utf8"));
}

// ディレクトリはファイルの相対パスと内容の組で hash する。生成物は生成元の変更で検出する。
function hashSourceDirectory(path: string): string {
  const files = listFilesRecursive(path)
    .filter((file) => !relativePathFromRoot(file, path).split("/").includes("generated"))
    .sort();
  if (files.length === 0) return ABSENT_SOURCE_HASH;
  const hash = createHash("sha256");
  for (const file of files) {
    hash.update(`${relativePathFromRoot(file, path)}\0${hashSourceFile(file)}\n`);
  }
  return hash.digest("hex");
}

function sharedSourceHash(key: string, context: GradeSourceContext): string {
  const cached = context.hashes.get(key);
  if (cached !== undefined) return cached;
  let hash: string;
  if (key === "schedule") {
    hash = hashSourceDirectory(resolve(context.rootDir, getProjectSchedulePath(context.project)));
  } else if (key === "members" || key === "roles") {
    const path =
      key === "members"
        ? getProjectMembersPath(context.project)
        : getProjectRolesPath(context.project);
    hash = hashSourceFile(path ? resolve(context.rootDir, path) : undefined);
  } else {
    const localId = key.slice(key.indexOf(":") + 1);
    hash = hashSourceFile(sourceCatalog(context).localIdToPath.get(localId));
  }
  context.hashes.set(key, hash);
  return hash;
}

export function gradedComparisonSources(
  viewpoints: ReviewViewpointsDoc | undefined,
  target: GradeTarget,
  metadata: Record<string, unknown>,
): string[] {
  if (!viewpoints) return [];
  const sources = new Set<string>();
  for (const viewpoint of gradedViewpoints(viewpoints, target, metadata)) {
    for (const source of viewpoint.comparison_sources ?? []) {
      if (!COMPARISON_SOURCE_RE.test(source)) {
        throw new Error(`${viewpoint.id}: unknown comparison source ${source}`);
      }
      sources.add(source);
    }
  }
  return [...sources].sort();
}

// depends_on のうちカタログで Markdown 成果物に解決できるものだけを依存先として扱う。
export function dependencySourceKeys(documentPath: string, context: GradeSourceContext): string[] {
  const { catalog, localIdToPath } = sourceCatalog(context);
  return (catalog.get(documentPath)?.dependsOn ?? [])
    .filter((localId) => localIdToPath.has(localId))
    .map((localId) => `dependency:${localId}`)
    .sort();
}

export function comparisonSourceKeys(
  sources: readonly string[],
  documentPath: string,
  context: GradeSourceContext,
): string[] {
  return sources.flatMap((source) =>
    source === "dependencies" ? dependencySourceKeys(documentPath, context) : [source],
  );
}

export function currentSourceHashes(
  keys: readonly string[],
  documentPath: string,
  context: GradeSourceContext,
): Record<string, string> {
  const hashes: Record<string, string> = {};
  for (const key of [...new Set(keys)].sort()) {
    if (key === "catalog-entry") {
      hashes[key] =
        sourceCatalog(context).catalog.get(documentPath)?.entryHash ?? ABSENT_SOURCE_HASH;
    } else if (key.startsWith("dependency:")) {
      const localId = key.slice("dependency:".length);
      hashes[key] = hashSourceFile(sourceCatalog(context).localIdToPath.get(localId));
    } else {
      hashes[key] = sharedSourceHash(key, context);
    }
  }
  return hashes;
}

// grade result へ記録する突き合わせ先の hash。宣言された突き合わせ先に加え、成果物では
// --dependency-changed が使う depends_on 先を、観点の宣言に関係なく記録する。
export function gradeSourceHashes(
  documentPath: string,
  document: MarkdownDocument,
  viewpoints: ReviewViewpointsDoc | undefined,
  target: GradeTarget,
  context: GradeSourceContext,
): Record<string, string> {
  const metadata = isRecord(document.data.specdojo) ? document.data.specdojo : {};
  const keys = [
    ...comparisonSourceKeys(
      gradedComparisonSources(viewpoints, target, metadata),
      documentPath,
      context,
    ),
    ...(target === "deliverable" ? dependencySourceKeys(documentPath, context) : []),
  ];
  return currentSourceHashes(keys, documentPath, context);
}

/** Current hashes of the comparison sources and dependencies that grade apply records for a document. */
export function resolveGradeSourceHashes(
  opts: {
    path: string;
    target: GradeTarget;
    project?: string;
    viewpoints?: ReviewViewpointsDoc;
  },
  rootDir = specdojoRootDir(),
): Record<string, string> {
  const absolute = resolveSafeMarkdownPath(opts.path, rootDir);
  const document = parseMarkdown(
    readFileSync(absolute, "utf8"),
    relativePathFromRoot(absolute, rootDir),
  );
  const viewpoints = opts.viewpoints ?? loadViewpointsIfConfigured(opts.project, rootDir);
  return gradeSourceHashes(
    absolute,
    document,
    viewpoints,
    opts.target,
    createGradeSourceContext(opts.project, rootDir),
  );
}

// 記録の無い突き合わせ先（source tracking 導入前の結果を含む）は、鮮度を保証できないため変更として扱う。
export function sourceHashesChanged(
  stored: Readonly<Record<string, string>> | undefined,
  current: Readonly<Record<string, string>>,
): boolean {
  return Object.entries(current).some(([key, hash]) => stored?.[key] !== hash);
}
