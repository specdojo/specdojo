#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { load } from "js-yaml";
import fg from "fast-glob";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import Ajv2020 from "ajv/dist/2020";

type JsonObject = Record<string, unknown>;

type YamlSchemaModelineInfo = {
  schemaRef?: string;
  directive?: {
    mode: "none" | "validate=false";
    reason?: string;
  };
};

const YAML_LANGUAGE_SERVER_SCHEMA_RE = /^#\s*yaml-language-server:\s+\$schema=(?<schema>\S+)\s*$/;
const SPECDOJO_SCHEMA_DIRECTIVE_RE =
  /^#\s*specdojo-schema:\s+(?<mode>none|validate=false)(?:\s+reason=(?<reason>\S+))?\s*$/;

type CliArgs = {
  mode: "explicit" | "modeline";
  schemaPath?: string;
  dataPatterns: string[];
  allowEmpty: boolean;
};

function formatErrorPath(instancePath: string): string {
  return instancePath || "/";
}

function leadingCommentLines(content: string): string[] {
  const lines: string[] = [];
  for (const line of content.split(/\r?\n/)) {
    if (line.trim() === "") continue;
    if (!line.startsWith("#")) break;
    lines.push(line);
  }
  return lines;
}

function parseYamlSchemaModeline(content: string): YamlSchemaModelineInfo {
  const info: YamlSchemaModelineInfo = {};
  for (const line of leadingCommentLines(content)) {
    const modelineMatch = YAML_LANGUAGE_SERVER_SCHEMA_RE.exec(line);
    if (modelineMatch?.groups?.schema) {
      info.schemaRef = modelineMatch.groups.schema;
      continue;
    }

    const directiveMatch = SPECDOJO_SCHEMA_DIRECTIVE_RE.exec(line);
    if (directiveMatch?.groups?.mode) {
      info.directive = {
        mode: directiveMatch.groups.mode as "none" | "validate=false",
        ...(directiveMatch.groups.reason ? { reason: directiveMatch.groups.reason } : {}),
      };
    }
  }
  return info;
}

function resolveModelineSchemaPath(yamlRepoPath: string, schemaRef: string): string {
  const yamlDir = dirname(resolve(yamlRepoPath));
  const absSchemaPath = resolve(yamlDir, schemaRef);
  return absSchemaPath.replace(`${process.cwd()}/`, "");
}

function parseArgs(argv: string[]): CliArgs {
  let schemaPath = "";
  const dataPatterns: string[] = [];
  let allowEmpty = false;
  let mode: CliArgs["mode"] = "explicit";

  for (let index = 2; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === "--modeline") {
      mode = "modeline";
      continue;
    }
    if (arg === "--schema" || arg === "-s") {
      schemaPath = argv[++index] ?? "";
      continue;
    }
    if (arg === "--data" || arg === "-d") {
      const pattern = argv[++index] ?? "";
      if (pattern) dataPatterns.push(pattern);
      continue;
    }
    if (arg === "--allow-empty") {
      allowEmpty = true;
      continue;
    }
    dataPatterns.push(arg);
  }

  if (mode === "modeline") {
    return { mode, dataPatterns, allowEmpty };
  }

  if (!schemaPath) {
    throw new Error(
      "Usage: tsx tools/docs/src/validate-yaml-schema.ts --schema <schema.yaml> --data <yaml/glob> [--data <yaml/glob> ...]\n" +
        "   or: tsx tools/docs/src/validate-yaml-schema.ts --modeline [<yaml/glob> ...]",
    );
  }
  if (dataPatterns.length === 0) {
    throw new Error("At least one data path or glob is required. Use --data <yaml/glob>.");
  }

  return { mode, schemaPath, dataPatterns, allowEmpty };
}

function selectAjv(schema: JsonObject): Ajv | Ajv2020 {
  const schemaUri = typeof schema.$schema === "string" ? schema.$schema : "";
  const ajv = schemaUri.includes("draft/2020-12/")
    ? new Ajv2020({ allErrors: true, strict: false })
    : new Ajv({ allErrors: true, strict: false });

  addFormats(ajv);
  return ajv;
}

function addSiblingSchemas(ajv: Ajv | Ajv2020, schemaPath: string): void {
  const schemaDir = dirname(schemaPath);
  const currentSchemaName = basename(schemaPath);

  for (const entry of readdirSync(schemaDir)) {
    if (!entry.endsWith(".schema.yaml") || entry === currentSchemaName) continue;

    const siblingSchema = load(readFileSync(join(schemaDir, entry), "utf8")) as JsonObject;
    ajv.addSchema(siblingSchema, entry);
  }
}

function validateFiles(schemaPath: string, files: string[]): boolean {
  const absSchemaPath = resolve(schemaPath);

  const schema = load(readFileSync(absSchemaPath, "utf8")) as JsonObject;
  const ajv = selectAjv(schema);
  addSiblingSchemas(ajv, absSchemaPath);
  const validate = ajv.compile(schema);

  let hasError = false;
  for (const filePath of files) {
    const data = load(readFileSync(resolve(filePath), "utf8")) as JsonObject;
    const valid = validate(data);
    if (valid) {
      console.log(`${filePath}: valid`);
      continue;
    }

    hasError = true;
    console.error(`${filePath}: invalid`);
    for (const error of validate.errors ?? []) {
      console.error(
        `  - ${formatErrorPath(error.instancePath)}: ${error.message ?? "validation error"}`,
      );
    }
  }
  return !hasError;
}

function explicitFiles(patterns: string[], allowEmpty: boolean): string[] {
  const files = fg
    .sync(patterns, {
      absolute: false,
      onlyFiles: true,
      unique: true,
    })
    .sort((left, right) => left.localeCompare(right));

  if (files.length === 0) {
    if (allowEmpty) {
      console.log(`No YAML files matched: ${patterns.join(", ")} (skip)`);
      return [];
    }
    throw new Error(`No YAML files matched: ${patterns.join(", ")}`);
  }
  return files;
}

function validateByModeline(patterns: string[]): boolean {
  const targetPatterns = patterns.length > 0 ? patterns : ["docs/**/*.{yaml,yml}"];
  const files = fg
    .sync(targetPatterns, {
      absolute: false,
      ignore: ["docs/**/schemas/**/*.{yaml,yml}"],
      onlyFiles: true,
      unique: true,
    })
    .sort((left, right) => left.localeCompare(right));

  const bySchema = new Map<string, string[]>();
  let hasError = false;

  for (const filePath of files) {
    const info = parseYamlSchemaModeline(readFileSync(resolve(filePath), "utf8"));
    if (info.directive?.mode === "none") {
      if (!info.directive.reason) {
        console.error(`${filePath}: specdojo-schema none requires reason=<reason>`);
        hasError = true;
        continue;
      }
      console.log(`${filePath}: schema none (${info.directive.reason})`);
      continue;
    }
    if (!info.schemaRef) {
      console.error(`${filePath}: missing yaml-language-server $schema modeline`);
      hasError = true;
      continue;
    }

    const schemaPath = resolveModelineSchemaPath(filePath, info.schemaRef);
    if (!existsSync(resolve(schemaPath))) {
      console.error(`${filePath}: schema not found: ${schemaPath}`);
      hasError = true;
      continue;
    }
    if (info.directive?.mode === "validate=false") {
      if (!info.directive.reason) {
        console.error(`${filePath}: specdojo-schema validate=false requires reason=<reason>`);
        hasError = true;
        continue;
      }
      console.log(
        `${filePath}: schema ${schemaPath} (validation skipped: ${info.directive.reason})`,
      );
      continue;
    }
    const schemaFiles = bySchema.get(schemaPath) ?? [];
    schemaFiles.push(filePath);
    bySchema.set(schemaPath, schemaFiles);
  }

  for (const [schemaPath, schemaFiles] of [...bySchema.entries()].sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    if (!validateFiles(schemaPath, schemaFiles)) hasError = true;
  }

  if (hasError) {
    return false;
  }
  return true;
}

function main(): void {
  const args = parseArgs(process.argv);
  const ok =
    args.mode === "modeline"
      ? validateByModeline(args.dataPatterns)
      : validateFiles(args.schemaPath as string, explicitFiles(args.dataPatterns, args.allowEmpty));
  if (!ok) process.exitCode = 1;
}

main();
