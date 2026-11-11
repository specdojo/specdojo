import { createRequire } from "node:module";
import { extname } from "node:path";
import { load } from "./yaml.js";

const require = createRequire(import.meta.url);
const yamlMetadata = require("../../docs/specdojo/lib/yaml-metadata.cjs") as (
  value: unknown,
) => Record<string, unknown> | undefined;

export function isYamlDocument(path: string): boolean {
  return [".yaml", ".yml"].includes(extname(path).toLowerCase());
}

export function isGradeDocument(path: string): boolean {
  return extname(path).toLowerCase() === ".md" || isYamlDocument(path);
}

export function readYamlMetadata(content: string, path: string): Record<string, unknown> {
  const metadata = yamlMetadata(load(content));
  for (const key of ["id", "type", "status", "rulebook"] as const) {
    if (typeof metadata?.[key] !== "string" || !metadata[key].trim()) {
      throw new Error(
        `${path}: YAML grade target requires metadata ${key} at the root or x-spec-meta`,
      );
    }
  }
  return metadata!;
}
