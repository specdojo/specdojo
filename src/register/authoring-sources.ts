import { existsSync, realpathSync, statSync } from "node:fs";
import { extname, isAbsolute, posix, relative, resolve, sep } from "node:path";
import { globSync } from "tinyglobby";
import { collectDocIndexEntries } from "../docs/doc-index.js";
import {
  getProjectRepos,
  resolveRepoQualifiedRef,
  resolveRepoRoot,
  type SpecDojoProjectConfig,
  type SpecDojoRepoConfig,
} from "../shared/specdojo-config.js";

// A bounded source set keeps generated plans reviewable and prevents a broad glob from handing an
// executor an unexpectedly large read scope. The limit applies after directory/glob expansion and
// duplicate removal, across all --source values.
export const MAX_AUTHORING_SOURCE_FILES = 100;

export type AuthoringSourceKind = "document" | "project-path" | "repo-path";

export type ResolvedAuthoringSource = {
  ref: string;
  kind: AuthoringSourceKind;
  /** Path relative to the repository that owns the source. */
  path: string;
  /** Present only for `<repo>:<path>` sources. */
  repo?: string;
  /** Present only when the source was resolved through the document index. */
  documentId?: string;
};

function normalizedRelativePath(value: string, label: string): string {
  const slashPath = value.trim().replaceAll("\\", "/");
  if (!slashPath) throw new Error(`${label} must not be empty`);
  if (posix.isAbsolute(slashPath) || isAbsolute(slashPath) || /^[A-Za-z]:\//.test(slashPath)) {
    throw new Error(`${label} must be relative: ${value}`);
  }
  const normalized = posix.normalize(slashPath).replace(/^\.\//, "").replace(/\/+$/, "");
  if (!normalized || normalized === "." || normalized === ".." || normalized.startsWith("../")) {
    throw new Error(`${label} escapes its repository root: ${value}`);
  }
  return normalized;
}

function assertInsideRoot(root: string, path: string, ref: string): void {
  const realRoot = realpathSync(root);
  const realPath = realpathSync(path);
  const fromRoot = relative(realRoot, realPath);
  if (fromRoot === ".." || fromRoot.startsWith(`..${sep}`) || isAbsolute(fromRoot)) {
    throw new Error(`Authoring source resolves outside its repository: ${ref}`);
  }
}

function expandPath(root: string, rawPath: string, ref: string): string[] {
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    throw new Error(`Repository root for authoring source does not exist: ${ref}`);
  }
  const normalized = normalizedRelativePath(rawPath, `Authoring source path "${ref}"`);
  const exact = resolve(root, normalized);
  let paths: string[];
  if (existsSync(exact)) {
    assertInsideRoot(root, exact, ref);
    if (statSync(exact).isDirectory()) {
      paths = globSync("**/*", {
        cwd: exact,
        onlyFiles: true,
        dot: false,
        followSymbolicLinks: false,
        ignore: ["**/.git/**", "**/node_modules/**"],
      }).map((entry) => posix.join(normalized, entry.replaceAll("\\", "/")));
    } else {
      paths = [normalized];
    }
  } else {
    paths = globSync(normalized, {
      cwd: root,
      onlyFiles: true,
      dot: false,
      followSymbolicLinks: false,
      ignore: ["**/.git/**", "**/node_modules/**"],
    }).map((entry) => entry.replaceAll("\\", "/"));
  }
  const sorted = [...new Set(paths)].sort();
  if (sorted.length === 0) {
    throw new Error(`Authoring source did not match any files: ${ref}`);
  }
  for (const path of sorted) assertInsideRoot(root, resolve(root, path), ref);
  return sorted;
}

function looksLikeProjectPath(ref: string): boolean {
  const normalized = ref.replaceAll("\\", "/");
  return normalized.includes("/") || extname(posix.basename(normalized)) !== "";
}

function indexedDocumentPath(repoRoot: string, ref: string): string {
  const indexed = collectDocIndexEntries(resolve(repoRoot, "docs"), repoRoot)[ref];
  if (!indexed) {
    throw new Error(
      `Authoring source document id is not resolvable via the document index: ${ref}`,
    );
  }
  const withoutLine = indexed.replace(/:\d+$/, "");
  const absolute = resolve(repoRoot, withoutLine);
  if (!existsSync(absolute) || !statSync(absolute).isFile()) {
    throw new Error(`Authoring source document does not exist: ${ref} (${withoutLine})`);
  }
  assertInsideRoot(repoRoot, absolute, ref);
  return relative(repoRoot, absolute).replaceAll("\\", "/");
}

function configuredRepo(project: SpecDojoProjectConfig, name: string): SpecDojoRepoConfig {
  const repo = getProjectRepos(project).find((candidate) => candidate.name === name);
  if (!repo) throw new Error(`Unknown product repository in authoring source: ${name}`);
  return repo;
}

export function resolveAuthoringSources(opts: {
  repoRoot: string;
  project: SpecDojoProjectConfig;
  sources: readonly string[];
}): ResolvedAuthoringSource[] {
  const refs = [...new Set(opts.sources.map((source) => source.trim()).filter(Boolean))];
  const repos = getProjectRepos(opts.project);
  const resolved: ResolvedAuthoringSource[] = [];
  const seen = new Set<string>();

  const append = (source: ResolvedAuthoringSource): void => {
    const key = `${source.repo ?? "project"}:${source.path}`;
    if (seen.has(key)) return;
    seen.add(key);
    resolved.push(source);
    if (resolved.length > MAX_AUTHORING_SOURCE_FILES) {
      throw new Error(
        `Authoring sources expand to more than ${MAX_AUTHORING_SOURCE_FILES} files; narrow the directory or pattern`,
      );
    }
  };

  for (const ref of refs) {
    const qualified = resolveRepoQualifiedRef(ref, repos);
    if (qualified.kind === "repo") {
      const repo = configuredRepo(opts.project, qualified.repo);
      const root = resolveRepoRoot(opts.repoRoot, repo);
      for (const path of expandPath(root, qualified.path, ref)) {
        append({ ref, kind: "repo-path", repo: qualified.repo, path });
      }
      continue;
    }

    if (looksLikeProjectPath(ref)) {
      for (const path of expandPath(opts.repoRoot, ref, ref)) {
        append({ ref, kind: "project-path", path });
      }
      continue;
    }

    append({
      ref,
      kind: "document",
      path: indexedDocumentPath(opts.repoRoot, ref),
      documentId: ref,
    });
  }

  return resolved;
}
