import { createRequire } from "node:module";
import { load as loadWithJsYaml, type LoadOptions } from "js-yaml";

const require = createRequire(import.meta.url);
const jsYamlSchemas = require("js-yaml") as Record<string, unknown>;
const legacyLoadSchema = (jsYamlSchemas.YAML11_SCHEMA ??
  jsYamlSchemas.DEFAULT_SCHEMA) as LoadOptions["schema"];

if (legacyLoadSchema === undefined) {
  throw new Error("js-yaml does not expose a YAML 1.1-compatible schema");
}

/** Load YAML with the scalar and merge-key behavior used by js-yaml 4. */
export function load(source: string, options: LoadOptions = {}): unknown {
  return loadWithJsYaml(source, { ...options, schema: options.schema ?? legacyLoadSchema });
}
