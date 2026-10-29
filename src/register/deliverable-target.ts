import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { collectDocIndexEntries } from "../docs/doc-index.js";
import { specdojoReferencePath } from "../docs/template-resolution.js";
import { readSpecdojoNamespace } from "../docs/frontmatter-namespace.js";
import { resolveDeliverableByDocId, type DeliverableInfo } from "../catalog/document-target.js";
import { KATA_MISSING, resolveKataDocumentPathIfExists, type KataRefs } from "../kata/kata.js";
import { AUTHORING_KINDS } from "../kata/authoring.js";
import { loadConfig } from "../shared/specdojo-config.js";
import { parsePracticeId } from "../shared/practice-id.js";
import type { Approach } from "../shared/agent-types.js";
import { load } from "../shared/yaml.js";

export const CATALOG_LESS_APPROACHES: readonly string[] = [
  "fully-guided",
  "recipe-guided",
  "freeform",
  "retrofit",
  "bootstrap",
  "finalize",
  "bootstrap-finalize",
];
export type DeliverableTargetOptions = {
  repoRoot: string;
  projectId: string;
  catalogPath?: string;
  approach: Approach;
  targetId: string;
  targetPath?: string;
  targetRulebook?: string;
};
export type RegisterDeliverableTarget = {
  info: DeliverableInfo;
  catalogless: boolean;
  refs?: KataRefs;
  kataIds?: string[];
  kataTargets?: { id: string; path: string }[];
};

function metadata(path: string): Record<string, unknown> {
  const text = readFileSync(path, "utf8");
  if (/\.mdx?$/.test(path)) return readSpecdojoNamespace(text);
  const parsed = load(text) as Record<string, unknown> | undefined;
  return (parsed?.specdojo ?? parsed ?? {}) as Record<string, unknown>;
}

// Resolve the nearest existing ancestor as well, so symlink parents cannot escape the repository.
export function validateDeliverablePath(root: string, value: string): string {
  if (!value.trim() || isAbsolute(value) || /^[a-z]:/i.test(value) || value.includes("\\")) {
    throw new Error(`--target-path must be a repository-relative path: ${value}`);
  }
  const absolute = resolve(root, value);
  const path = relative(root, absolute).replaceAll("\\", "/");
  if (!path || path === ".." || path.startsWith("../")) {
    throw new Error(`--target-path points outside the repository: ${value}`);
  }
  let ancestor = absolute;
  while (!existsSync(ancestor)) ancestor = dirname(ancestor);
  const physical = relative(realpathSync(root), realpathSync(ancestor));
  if (physical === ".." || physical.startsWith("../") || isAbsolute(physical)) {
    throw new Error(`--target-path points outside the repository through a symlink: ${value}`);
  }
  if (existsSync(absolute) && !statSync(absolute).isFile()) {
    throw new Error(`--target-path must name a file: ${value}`);
  }
  return path;
}

export function resolveRegisterDeliverableTarget(
  opts: DeliverableTargetOptions,
): RegisterDeliverableTarget {
  if (opts.catalogPath) {
    try {
      const resolved = resolveDeliverableByDocId(
        opts.catalogPath,
        opts.projectId,
        opts.targetId,
        opts.repoRoot,
      );
      return { info: resolved.info, catalogless: false };
    } catch (error) {
      if (
        !(error instanceof Error) ||
        !error.message.startsWith("catalog deliverable target not found")
      )
        throw error;
      if (!opts.targetPath || !opts.targetRulebook) throw error;
    }
  }
  if (!CATALOG_LESS_APPROACHES.includes(opts.approach)) {
    throw new Error(
      `Approach "${opts.approach}" requires a deliverable target from the project catalog (catalog_path)`,
    );
  }
  const entries = collectDocIndexEntries(resolve(opts.repoRoot, "docs"), opts.repoRoot);
  const indexed = entries[opts.targetId]?.replace(/:\d+$/, "");
  const indexedPath = indexed
    ? relative(opts.repoRoot, resolve(opts.repoRoot, indexed))
    : undefined;
  if (!opts.targetPath && !indexedPath) {
    throw new Error(
      `Target ${opts.targetId} is not indexed; specify --target-path and --target-rulebook (catalog_path is not configured)`,
    );
  }
  const path = validateDeliverablePath(opts.repoRoot, opts.targetPath ?? indexedPath ?? "");
  if (indexedPath && path !== validateDeliverablePath(opts.repoRoot, indexedPath)) {
    throw new Error(
      `--target-path conflicts with the indexed document ${opts.targetId}: ${indexedPath}`,
    );
  }
  const absolute = resolve(opts.repoRoot, path);
  const existing = existsSync(absolute);
  const fm = existing ? metadata(absolute) : {};
  if (existing && fm.id !== opts.targetId) {
    throw new Error(
      `--target-path is occupied by another document: ${path} (expected ${opts.targetId})`,
    );
  }
  if (AUTHORING_KINDS.includes(fm.type as (typeof AUTHORING_KINDS)[number])) {
    throw new Error(`Target ${opts.targetId} is a kata, not a deliverable`);
  }
  const declaredRulebook = typeof fm.rulebook === "string" ? fm.rulebook : undefined;
  if (opts.targetRulebook && declaredRulebook && opts.targetRulebook !== declaredRulebook) {
    throw new Error(
      `--target-rulebook conflicts with specdojo.rulebook of ${opts.targetId}: ${declaredRulebook}`,
    );
  }
  const rulebook = opts.targetRulebook ?? declaredRulebook;
  if (!existing && (!opts.targetPath || !opts.targetRulebook)) {
    throw new Error(
      `New deliverable ${opts.targetId} requires --target-path and --target-rulebook`,
    );
  }
  if (!rulebook)
    throw new Error(`Target ${opts.targetId} requires --target-rulebook or specdojo.rulebook`);
  if ((opts.approach === "finalize" || opts.approach === "bootstrap-finalize") && !existing) {
    throw new Error(
      `Approach "${opts.approach}" requires an existing deliverable: ${opts.targetId}`,
    );
  }
  const refs: KataRefs = {
    rulebook: KATA_MISSING,
    recipe: KATA_MISSING,
    sample: KATA_MISSING,
    template: KATA_MISSING,
  };
  const kataIds: string[] = [];
  const kataTargets: { id: string; path: string }[] = [];
  const findKata = (kind: (typeof AUTHORING_KINDS)[number], id: string): string | undefined => {
    const entry = entries[id]?.replace(/:\d+$/, "");
    if (entry) {
      const absolutePath = resolve(opts.repoRoot, entry);
      if (kind !== "sample" && metadata(absolutePath).type !== kind)
        throw new Error(`Kata ${id} must have type ${kind}`);
      return specdojoReferencePath(absolutePath, { repositoryRoot: opts.repoRoot });
    }
    for (const extension of kind === "rulebook" || kind === "recipe"
      ? ["md"]
      : ["md", "yaml", "yml", "json"]) {
      const found = resolveKataDocumentPathIfExists(kind, id, extension, {
        repositoryRoot: opts.repoRoot,
      });
      if (
        found &&
        metadata(found).id === id &&
        (kind === "sample" || metadata(found).type === kind)
      )
        return specdojoReferencePath(found, { repositoryRoot: opts.repoRoot });
    }
    return undefined;
  };
  if (opts.approach === "bootstrap") {
    if (!opts.targetPath || !opts.targetRulebook)
      throw new Error("Catalog-less bootstrap requires --target-path and --target-rulebook");
    const authority = loadConfig(opts.repoRoot).config?.kata_authority;
    if (!authority)
      throw new Error("Catalog-less bootstrap requires kata_authority in specdojo.config.json");
    const parsed = parsePracticeId(rulebook);
    if (parsed.authority !== authority || !/^[a-z0-9][a-z0-9-]*-rulebook$/.test(parsed.localId)) {
      throw new Error(
        `Bootstrap rulebook must use kata_authority ${authority} and end with -rulebook: ${rulebook}`,
      );
    }
    if (findKata("rulebook", rulebook))
      throw new Error(`Bootstrap requires a new rulebook id; ${rulebook} already exists`);
    const stem = parsed.localId.slice(0, -"-rulebook".length);
    for (const kind of AUTHORING_KINDS) {
      const id = `${authority}:${stem}-${kind}`;
      const proposedPath = `docs/ja/specdojo/${kind}s/${authority}/${stem}-${kind}.md`;
      validateDeliverablePath(opts.repoRoot, proposedPath);
      // Do not reuse somebody else's kata when the generated id/path collides.
      if (entries[id] || existsSync(resolve(opts.repoRoot, proposedPath)) || findKata(kind, id)) {
        throw new Error(`Bootstrap kata id or path already exists: ${id} (${proposedPath})`);
      }
      refs[kind] = proposedPath;
      kataIds.push(id);
      kataTargets.push({ id, path: proposedPath });
    }
  } else {
    const missing: string[] = [];
    const rulebookPath = !["none", "not-needed", "undecided"].includes(rulebook)
      ? findKata("rulebook", rulebook)
      : undefined;
    if (rulebookPath) {
      refs.rulebook = rulebookPath;
      kataIds.push(rulebook);
      kataTargets.push({ id: rulebook, path: rulebookPath });
    } else if (opts.approach !== "freeform") missing.push("rulebook");
    const rb = rulebookPath ? metadata(resolve(opts.repoRoot, rulebookPath)) : {};
    for (const kind of ["recipe", "sample", "template"] as const) {
      const declaration = rb[kind];
      const ids = Array.isArray(declaration) ? declaration : [declaration];
      const notNeeded = declaration === "not-needed";
      const required =
        (opts.approach === "fully-guided" && !notNeeded) ||
        (opts.approach === "recipe-guided" && kind === "recipe") ||
        (opts.approach === "bootstrap-finalize" && !notNeeded);
      let resolvedAny = false;
      for (const id of ids) {
        if (typeof id !== "string" || ["none", "not-needed", "undecided"].includes(id)) continue;
        const found = findKata(kind, id);
        if (found) {
          if (!resolvedAny) refs[kind] = found;
          resolvedAny = true;
          kataIds.push(id);
          kataTargets.push({ id, path: found });
        } else if (required) missing.push(`${kind} (${id})`);
      }
      if (required && !resolvedAny) missing.push(kind);
    }
    if (missing.length)
      throw new Error(
        `Approach "${opts.approach}" is missing kata: ${[...new Set(missing)].join(", ")}`,
      );
  }
  return {
    catalogless: true,
    refs,
    kataIds,
    kataTargets,
    info: {
      catalogless: true,
      resolvedPath: path,
      deliverable: {
        local_id: opts.targetId.split(":").pop()!,
        name: opts.targetId,
        kind: "work",
        overview: "個票の概要・完了条件を参照する。",
        path,
        rulebook,
      },
    },
  };
}
