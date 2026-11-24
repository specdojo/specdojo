import { existsSync, realpathSync, statSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { repositoryIdentityRoot } from "./local-config.js";
import type { SpecDojoConfig } from "./specdojo-config.js";

/** Canonical roots keep symlink aliases out of the writable-root permission list. */
export function resolveReferences(
  rootDir: string,
  config: Pick<SpecDojoConfig, "references">,
): Array<{ alias: string; path: string; root: string }> {
  return Object.entries(config.references ?? {}).map(([alias, entry]) => ({
    alias,
    path: entry.path,
    root: realpathSync(resolve(repositoryIdentityRoot(rootDir), entry.path)),
  }));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function contains(parent: string, child: string): boolean {
  const path = relative(parent, child);
  return path === "" || (!isAbsolute(path) && path !== ".." && !path.startsWith(`..${sep}`));
}

/** Reject missing directories and overlap with any repository granted write access. */
export function validateReferences(
  rootDir: string,
  config: SpecDojoConfig,
  additionalWritableRoots: readonly string[] = [],
): string[] {
  const references: unknown = config.references;
  if (references === undefined) return [];
  if (!isRecord(references)) return ["references must be an object"];

  const identityRoot = repositoryIdentityRoot(rootDir);
  const writableRoots = [rootDir, identityRoot, ...additionalWritableRoots];
  for (const project of Object.values(config.projects)) {
    if (!Array.isArray(project.repos)) continue;
    for (const repo of project.repos) {
      if (typeof repo?.path === "string") writableRoots.push(resolve(identityRoot, repo.path));
    }
  }
  if (isRecord(config.external_projects)) {
    for (const entry of Object.values(config.external_projects)) {
      if (isRecord(entry) && typeof entry.path === "string") {
        writableRoots.push(resolve(identityRoot, entry.path));
      }
    }
  }
  const canonicalWritable = writableRoots
    .filter((path) => existsSync(path))
    .map((path) => realpathSync(path));
  const errors: string[] = [];
  for (const [alias, entry] of Object.entries(references)) {
    const at = `references.${alias}`;
    if (!/^[a-z0-9-]+$/.test(alias)) errors.push(`${at}: alias must match /^[a-z0-9-]+$/`);
    if (!isRecord(entry)) {
      errors.push(`${at} must be an object with path`);
      continue;
    }
    for (const key of Object.keys(entry).sort()) {
      if (key !== "path") errors.push(`${at}: unknown key "${key}"`);
    }
    const path = entry.path;
    if (typeof path !== "string" || !path.trim()) {
      errors.push(`${at}.path must be a non-empty string`);
      continue;
    }
    if (isAbsolute(path) || /^[A-Za-z]:[\\/]/.test(path)) {
      errors.push(`${at}.path must be relative to the SpecDojo root`);
      continue;
    }
    const absolute = resolve(identityRoot, path);
    if (!existsSync(absolute)) {
      errors.push(`${at}.path "${path}" does not exist (resolved to ${absolute})`);
    } else if (!statSync(absolute).isDirectory()) {
      errors.push(`${at}.path "${path}" is not a directory (resolved to ${absolute})`);
    } else {
      const canonical = realpathSync(absolute);
      const overlap = canonicalWritable.find(
        (writable) => contains(writable, canonical) || contains(canonical, writable),
      );
      if (overlap) errors.push(`${at}.path overlaps writable repository ${overlap}`);
    }
  }
  return errors;
}
