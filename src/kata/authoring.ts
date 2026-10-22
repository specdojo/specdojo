import { existsSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
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

export const KATA_AUTHORING_BASE = "docs/ja/kata";

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

export function kataKindDirectory(kind: AuthoringKind, local = false): string {
  return local ? `${KATA_AUTHORING_BASE}/${KIND_DIR[kind]}` : `docs/ja/specdojo/${KIND_DIR[kind]}`;
}

export function authoredKataPath(
  id: string,
  kind: AuthoringKind,
  extension: "md" | "yaml" | "json" = "md",
): string {
  const specdojoOwned = parsePracticeId(id).authority === "specdojo";
  const directory = kataKindDirectory(kind, !specdojoOwned);
  return `${directory}/${practiceLocalId(id)}.${extension}`;
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
  const localId = practiceLocalId(id);
  for (const kind of AUTHORING_KINDS) {
    const extensions =
      kind === "rulebook" || kind === "recipe" ? ["md"] : ["md", "yaml", "yml", "json"];
    for (const local of [true, false]) {
      const directory = resolve(rootDir, kataKindDirectory(kind, local));
      for (const extension of extensions) {
        const candidate = join(directory, `${localId}.${extension}`);
        if (existsSync(candidate) && dataFileId(candidate) === id) return true;
      }
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
