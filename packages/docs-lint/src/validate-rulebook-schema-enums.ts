#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import fg from "fast-glob";
import { load } from "js-yaml";
import { resolveSpecdojoAssetPath } from "./specdojo-package.js";

type JsonObject = Record<string, unknown>;

export type RulebookSchemaEnumFinding = {
  rulebookPath: string;
  schemaPath: string;
  enumPath: string;
  missingValue: string;
};

type RulebookMetadata = {
  status?: string;
  targetFormat?: string;
};

const SCHEMA_SUFFIX = ".schema.yaml";
const FINDING_COMMENT_RE = /<!--\s*specdojo:finding\b[\s\S]*?-->/g;
const SCAFFOLD_PLACEHOLDER_RE = /^_[A-Z0-9_]+_$/;

function isRecord(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function escapeJsonPointerSegment(segment: string): string {
  return segment.replace(/~/g, "~0").replace(/\//g, "~1");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseRulebook(markdown: string): { body: string; metadata: RulebookMetadata } {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return { body: markdown, metadata: {} };

  const parsed = load(match[1]);
  const specdojo = isRecord(parsed) && isRecord(parsed.specdojo) ? parsed.specdojo : {};
  return {
    body: markdown.slice(match[0].length),
    metadata: {
      status: typeof specdojo.status === "string" ? specdojo.status : undefined,
      targetFormat: typeof specdojo.target_format === "string" ? specdojo.target_format : undefined,
    },
  };
}

// Grade findings describe missing content, but are not themselves normative rulebook text.
export function normativeRulebookBody(markdown: string): string {
  return parseRulebook(markdown).body.replace(FINDING_COMMENT_RE, "");
}

function enumValueAppears(body: string, value: string): boolean {
  const identifierChar = "\\p{L}\\p{N}_-";
  const pattern = new RegExp(
    `(^|[^${identifierChar}])${escapeRegExp(value)}(?=$|[^${identifierChar}])`,
    "u",
  );
  return pattern.test(body);
}

export function collectStringEnums(schema: unknown): Array<{ enumPath: string; values: string[] }> {
  const found: Array<{ enumPath: string; values: string[] }> = [];

  function visit(value: unknown, pointer: string): void {
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, `${pointer}/${index}`));
      return;
    }
    if (!isRecord(value)) return;

    if (Array.isArray(value.enum)) {
      const values = [
        ...new Set(value.enum.filter((item): item is string => typeof item === "string")),
      ].filter((item) => !SCAFFOLD_PLACEHOLDER_RE.test(item));
      if (values.length > 0) found.push({ enumPath: `${pointer}/enum`, values });
    }

    for (const [key, child] of Object.entries(value)) {
      if (key === "enum") continue;
      visit(child, `${pointer}/${escapeJsonPointerSegment(key)}`);
    }
  }

  visit(schema, "");
  return found;
}

export function lintRulebookSchemaEnums(
  rulebookMarkdown: string,
  schema: unknown,
  rulebookPath: string,
  schemaPath: string,
): RulebookSchemaEnumFinding[] {
  const body = normativeRulebookBody(rulebookMarkdown);
  return collectStringEnums(schema).flatMap(({ enumPath, values }) =>
    values
      .filter((value) => !enumValueAppears(body, value))
      .map((missingValue) => ({ rulebookPath, schemaPath, enumPath, missingValue })),
  );
}

export function findReadyRulebookSchemaPairs(
  schemaDir = "docs/specdojo/schemas/v1",
  rulebookDir = "docs/ja/specdojo/rulebooks",
): Array<{ rulebookPath: string; schemaPath: string }> {
  const effectiveSchemaDir = existsSync(resolve(schemaDir))
    ? schemaDir
    : resolveSpecdojoAssetPath(schemaDir);
  return fg
    .sync(join(effectiveSchemaDir, `*${SCHEMA_SUFFIX}`).replaceAll("\\", "/"), {
      absolute: false,
      onlyFiles: true,
    })
    .sort((left, right) => left.localeCompare(right))
    .flatMap((schemaPath) => {
      const stem = basename(schemaPath).slice(0, -SCHEMA_SUFFIX.length);
      const rulebookPath = join(rulebookDir, `${stem}-rulebook.md`).replaceAll("\\", "/");
      if (!existsSync(resolve(rulebookPath))) return [];

      const { metadata } = parseRulebook(readFileSync(resolve(rulebookPath), "utf8"));
      return metadata.status === "ready" && ["yaml", "json"].includes(metadata.targetFormat ?? "")
        ? [{ rulebookPath, schemaPath }]
        : [];
    });
}

export function validateReadyRulebookSchemaEnums(): boolean {
  const pairs = findReadyRulebookSchemaPairs();
  if (pairs.length === 0) {
    console.warn("No ready YAML/JSON rulebook/schema pairs found (skip)");
    return true;
  }

  let hasError = false;
  for (const { rulebookPath, schemaPath } of pairs) {
    const markdown = readFileSync(resolve(rulebookPath), "utf8");
    const schema = load(readFileSync(resolve(schemaPath), "utf8"));
    const findings = lintRulebookSchemaEnums(markdown, schema, rulebookPath, schemaPath);
    if (findings.length === 0) {
      console.log(`${rulebookPath}: enum coverage valid (${schemaPath})`);
      continue;
    }

    hasError = true;
    console.error(`${rulebookPath}: enum coverage invalid (${schemaPath})`);
    for (const finding of findings) {
      console.error(
        `  - ${finding.schemaPath}${finding.enumPath}: missing enum value ${JSON.stringify(finding.missingValue)}`,
      );
    }
  }
  return !hasError;
}

function main(): void {
  try {
    if (!validateReadyRulebookSchemaEnums()) process.exitCode = 1;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`rulebook schema enum validation failed: ${detail}`);
    process.exitCode = 1;
  }
}

const invokedPath = process.argv[1];
if (invokedPath && import.meta.url === pathToFileURL(resolve(invokedPath)).href) main();
