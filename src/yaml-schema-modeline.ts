import { existsSync, readFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";

const YAML_LANGUAGE_SERVER_SCHEMA_RE = /^#\s*yaml-language-server:\s+\$schema=(?<schema>\S+)\s*$/;
const SPECDOJO_SCHEMA_DIRECTIVE_RE =
  /^#\s*specdojo-schema:\s+(?<mode>none|validate=false)(?:\s+reason=(?<reason>\S+))?\s*$/;

export type SpecdojoSchemaDirective = {
  mode: "none" | "validate=false";
  reason?: string;
};

export type YamlSchemaModelineInfo = {
  schemaRef?: string;
  directive?: SpecdojoSchemaDirective;
};

function leadingCommentLines(content: string): string[] {
  const lines: string[] = [];
  for (const line of content.split(/\r?\n/)) {
    if (line.trim() === "") continue;
    if (!line.startsWith("#")) break;
    lines.push(line);
  }
  return lines;
}

export function parseYamlSchemaModeline(content: string): YamlSchemaModelineInfo {
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
        mode: directiveMatch.groups.mode as SpecdojoSchemaDirective["mode"],
        ...(directiveMatch.groups.reason ? { reason: directiveMatch.groups.reason } : {}),
      };
    }
  }
  return info;
}

export function resolveModelineSchemaPath(
  repoRoot: string,
  yamlRepoPath: string,
  schemaRef: string,
): string {
  const yamlDir = dirname(join(repoRoot, yamlRepoPath));
  const absSchemaPath = isAbsolute(schemaRef) ? schemaRef : resolve(yamlDir, schemaRef);
  return relative(repoRoot, absSchemaPath).replace(/\\/g, "/");
}

export function readYamlSchemaModelineRef(
  repoRoot: string,
  yamlRepoPath: string | undefined,
): string | undefined {
  if (!yamlRepoPath) return undefined;
  const absPath = join(repoRoot, yamlRepoPath);
  if (!existsSync(absPath)) return undefined;

  const info = parseYamlSchemaModeline(readFileSync(absPath, "utf8"));
  if (!info.schemaRef || info.directive?.mode === "none") return undefined;
  return resolveModelineSchemaPath(repoRoot, yamlRepoPath, info.schemaRef);
}
