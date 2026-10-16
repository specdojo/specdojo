import { createRequire } from "node:module";
import {
  dump as dumpWithJsYaml,
  load as loadWithJsYaml,
  type DumpOptions,
  type LoadOptions,
} from "js-yaml";

const require = createRequire(import.meta.url);
const jsYamlSchemas = require("js-yaml") as Record<string, unknown>;
const legacyLoadSchema = (jsYamlSchemas.YAML11_SCHEMA ??
  jsYamlSchemas.DEFAULT_SCHEMA) as LoadOptions["schema"];
const usesV5Api = jsYamlSchemas.YAML11_SCHEMA !== undefined;

if (legacyLoadSchema === undefined) {
  throw new Error("js-yaml does not expose a YAML 1.1-compatible schema");
}

/** Load YAML with the scalar and merge-key behavior used by js-yaml 4. */
export function load(source: string, options: LoadOptions = {}): unknown {
  return loadWithJsYaml(source, { ...options, schema: options.schema ?? legacyLoadSchema });
}

export type CompatibleDumpOptions = DumpOptions & {
  quoteStyle?: "single" | "double";
};

/** Dump YAML using the v5 option name while remaining runnable before the dependency handoff. */
export function dump(input: unknown, options: CompatibleDumpOptions = {}): string {
  const normalized = { ...options } as Record<string, unknown>;
  const quoteStyle = normalized.quoteStyle;
  delete normalized.quoteStyle;

  if (quoteStyle !== undefined) {
    normalized[usesV5Api ? "quoteStyle" : "quotingType"] = usesV5Api
      ? quoteStyle
      : quoteStyle === "single"
        ? "'"
        : '"';
  }

  return dumpWithJsYaml(input, normalized as DumpOptions);
}
