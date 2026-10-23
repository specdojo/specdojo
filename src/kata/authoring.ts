import { existsSync, readFileSync } from "node:fs";
import { extname, resolve } from "node:path";
import { readSpecdojoNamespace } from "../docs/frontmatter-namespace.js";
import {
  getKataAuthority,
  isSpecdojoSourceRepository,
  loadConfig,
  specdojoRootDir,
} from "../shared/specdojo-config.js";
import type { Approach } from "../shared/agent-types.js";
import { parsePracticeId, practiceLocalId } from "../shared/practice-id.js";
import { load } from "../shared/yaml.js";
import { resolveSpecdojoReferencePathIfExists } from "../docs/template-resolution.js";

export const KATA_AUTHORING_BASE = "docs/ja/specdojo";
export const LEGACY_KATA_AUTHORING_BASE = "docs/ja/kata";

export const AUTHORING_KINDS = ["rulebook", "recipe", "sample", "template"] as const;
export type AuthoringKind = (typeof AUTHORING_KINDS)[number];

const KIND_DIR: Record<AuthoringKind, string> = {
  rulebook: "rulebooks",
  recipe: "recipes",
  sample: "samples",
  template: "templates",
};

const AUTHORING_KIND_BY_APPROACH: Partial<Record<Approach, AuthoringKind>> = {
  "rulebook-authoring": "rulebook",
  "recipe-authoring": "recipe",
  "sample-authoring": "sample",
  "template-authoring": "template",
};

export function authoringKind(approach: Approach | undefined): AuthoringKind | undefined {
  return approach ? AUTHORING_KIND_BY_APPROACH[approach] : undefined;
}

export function isAuthoringApproach(approach: string | undefined): boolean {
  return (
    approach !== undefined &&
    Object.prototype.hasOwnProperty.call(AUTHORING_KIND_BY_APPROACH, approach)
  );
}

export function kataKindDirectory(kind: AuthoringKind): string {
  return `${KATA_AUTHORING_BASE}/${KIND_DIR[kind]}`;
}

export function authoredKataDirectory(kind: AuthoringKind, authority: string): string {
  const directory = kataKindDirectory(kind);
  return authority === "specdojo" ? directory : `${directory}/${authority}`;
}

export function legacyKataKindDirectory(kind: AuthoringKind): string {
  return `${LEGACY_KATA_AUTHORING_BASE}/${KIND_DIR[kind]}`;
}

export function authoredKataPath(
  id: string,
  kind: AuthoringKind,
  extension: "md" | "yaml" | "yml" | "json" = "md",
): string {
  const authority = parsePracticeId(id).authority;
  const directory = authoredKataDirectory(kind, authority ?? "specdojo");
  return `${directory}/${practiceLocalId(id)}.${extension}`;
}

export function legacyAuthoredKataPath(
  id: string,
  kind: AuthoringKind,
  extension: "md" | "yaml" | "yml" | "json" = "md",
): string {
  return `${legacyKataKindDirectory(kind)}/${practiceLocalId(id)}.${extension}`;
}

const warnedLegacyPaths = new Set<string>();

export function warnLegacyAuthoredKata(
  id: string,
  canonicalPath: string,
  legacyPath: string,
  rootDir: string,
  duplicate: boolean,
): void {
  const warningKey = `${resolve(rootDir, legacyPath)}:${duplicate ? "duplicate" : "legacy"}`;
  if (warnedLegacyPaths.has(warningKey)) return;
  warnedLegacyPaths.add(warningKey);
  const detail = duplicate
    ? `both ${canonicalPath} and legacy ${legacyPath} exist; using ${canonicalPath}; remove the legacy file`
    : `legacy path ${legacyPath} is deprecated; move it to ${canonicalPath}`;
  process.stderr.write(`warning: Kata ${id}: ${detail}.\n`);
}

export function resolveAuthoredKataPathIfExists(
  id: string,
  kind: AuthoringKind,
  extension: "md" | "yaml" | "yml" | "json",
  rootDir: string = specdojoRootDir(),
): { relativePath: string; absolutePath: string; legacy: boolean } | undefined {
  const authority = parsePracticeId(id).authority;
  const canonicalPath = authoredKataPath(id, kind, extension);
  const canonicalAbsolutePath = resolve(rootDir, canonicalPath);
  if (!authority || authority === "specdojo") {
    return existsSync(canonicalAbsolutePath)
      ? { relativePath: canonicalPath, absolutePath: canonicalAbsolutePath, legacy: false }
      : undefined;
  }
  if (authority !== configuredKataAuthority(rootDir)) return undefined;

  const legacyPath = legacyAuthoredKataPath(id, kind, extension);
  const legacyAbsolutePath = resolve(rootDir, legacyPath);
  const canonicalExists = existsSync(canonicalAbsolutePath);
  const legacyExists = existsSync(legacyAbsolutePath);
  if (canonicalExists && legacyExists) {
    warnLegacyAuthoredKata(id, canonicalPath, legacyPath, rootDir, true);
  } else if (legacyExists) {
    warnLegacyAuthoredKata(id, canonicalPath, legacyPath, rootDir, false);
  }
  if (canonicalExists) {
    return { relativePath: canonicalPath, absolutePath: canonicalAbsolutePath, legacy: false };
  }
  return legacyExists
    ? { relativePath: legacyPath, absolutePath: legacyAbsolutePath, legacy: true }
    : undefined;
}

export function configuredKataAuthority(rootDir: string = specdojoRootDir()): string {
  return getKataAuthority(loadConfig(rootDir).config, rootDir);
}

export function assertAuthorableKataId(
  id: string,
  kind: AuthoringKind,
  rootDir: string = specdojoRootDir(),
): void {
  const parsed = parsePracticeId(id);
  const expectedSuffix = `-${kind}`;
  if (!parsed.localId.endsWith(expectedSuffix)) {
    throw new Error(`Kata id ${id} must end with ${expectedSuffix} for ${kind}-authoring`);
  }
  if (!parsed.authority) {
    throw new Error(`Kata id ${id} must include a repository authority`);
  }
  if (parsed.authority === "specdojo") {
    if (!isSpecdojoSourceRepository(rootDir)) {
      throw new Error(
        `Kata authority "specdojo" is reserved for the SpecDojo repository; use ${configuredKataAuthority(rootDir)}:${parsed.localId}`,
      );
    }
  } else {
    const expected = configuredKataAuthority(rootDir);
    if (parsed.authority !== expected) {
      throw new Error(`Kata id ${id} must use this repository's kata_authority "${expected}"`);
    }
  }
}

function dataFileId(path: string): string | undefined {
  try {
    const content = readFileSync(path, "utf8");
    const extension = extname(path).toLowerCase();
    if (extension === ".md" || extension === ".mdx") {
      const id = readSpecdojoNamespace(content).id;
      return typeof id === "string" ? id : undefined;
    }
    const parsed = extension === ".json" ? JSON.parse(content) : load(content);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return undefined;
    const id = (parsed as Record<string, unknown>).id;
    return typeof id === "string" ? id : undefined;
  } catch {
    return undefined;
  }
}

export function authoredKataExists(id: string, rootDir: string = specdojoRootDir()): boolean {
  for (const kind of AUTHORING_KINDS) {
    const extensions =
      kind === "rulebook" || kind === "recipe" ? ["md"] : ["md", "yaml", "yml", "json"];
    for (const extension of extensions) {
      const resolved = resolveAuthoredKataPathIfExists(
        id,
        kind,
        extension as "md" | "yaml" | "yml" | "json",
        rootDir,
      );
      if (resolved && dataFileId(resolved.absolutePath) === id) return true;
    }
  }
  return false;
}

export function authoringStandardId(kind: AuthoringKind): string {
  return `specdojo:${kind}-authoring-standard`;
}

export function authoringStandardPath(kind: AuthoringKind): string {
  const path = `docs/ja/specdojo/standards/${kind}-authoring-standard.md`;
  return resolveSpecdojoReferencePathIfExists(path) ?? path;
}
