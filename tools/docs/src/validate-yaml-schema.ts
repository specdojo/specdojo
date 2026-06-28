#!/usr/bin/env node

import { readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { load } from "js-yaml";
import fg from "fast-glob";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import Ajv2020 from "ajv/dist/2020";

type JsonObject = Record<string, unknown>;

type CliArgs = {
  schemaPath: string;
  dataPatterns: string[];
  allowEmpty: boolean;
};

function formatErrorPath(instancePath: string): string {
  return instancePath || "/";
}

function parseArgs(argv: string[]): CliArgs {
  let schemaPath = "";
  const dataPatterns: string[] = [];
  let allowEmpty = false;

  for (let index = 2; index < argv.length; index++) {
    const arg = argv[index];
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

  if (!schemaPath) {
    throw new Error(
      "Usage: tsx tools/docs/src/validate-yaml-schema.ts --schema <schema.yaml> --data <yaml/glob> [--data <yaml/glob> ...]",
    );
  }
  if (dataPatterns.length === 0) {
    throw new Error("At least one data path or glob is required. Use --data <yaml/glob>.");
  }

  return { schemaPath, dataPatterns, allowEmpty };
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

function main(): void {
  const args = parseArgs(process.argv);
  const schemaPath = resolve(args.schemaPath);
  const targetPatterns = args.dataPatterns;

  const schema = load(readFileSync(schemaPath, "utf8")) as JsonObject;
  const ajv = selectAjv(schema);
  addSiblingSchemas(ajv, schemaPath);
  const validate = ajv.compile(schema);

  const files = fg
    .sync(targetPatterns, {
      absolute: false,
      onlyFiles: true,
      unique: true,
    })
    .sort((left, right) => left.localeCompare(right));

  if (files.length === 0) {
    if (args.allowEmpty) {
      console.log(`No YAML files matched: ${targetPatterns.join(", ")} (skip)`);
      return;
    }
    throw new Error(`No YAML files matched: ${targetPatterns.join(", ")}`);
  }

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

  if (hasError) {
    process.exitCode = 1;
  }
}

main();
