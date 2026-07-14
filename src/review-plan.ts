import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import yaml from "js-yaml";

// テンプレート自身のメタ情報キー。生成物には出力しない
// （document-metadata-standard.md「生成物メタ情報雛形（metadata_template）」）。
const TEMPLATE_OWN_META_KEYS = new Set([
  "id",
  "type",
  "status",
  "title",
  "rulebook",
  "metadata_template",
]);

const PROJECT_ID_PLACEHOLDER = "_PROJECT_ID_";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function replaceProjectIdDeep(value: unknown, projectId: string): unknown {
  if (typeof value === "string") {
    return value.replaceAll(PROJECT_ID_PLACEHOLDER, projectId);
  }
  if (Array.isArray(value)) {
    return value.map((item) => replaceProjectIdDeep(item, projectId));
  }
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, replaceProjectIdDeep(item, projectId)]),
    );
  }
  return value;
}

export function expandViewpointsDoc(
  templatePath: string,
  projectId: string,
): Record<string, unknown> {
  const loaded = yaml.load(readFileSync(templatePath, "utf8"));
  if (!isRecord(loaded)) {
    throw new Error(`Template is not a YAML mapping: ${templatePath}`);
  }
  const metadataTemplate = loaded["metadata_template"];
  if (!isRecord(metadataTemplate)) {
    throw new Error(`metadata_template is missing or not a mapping: ${templatePath}`);
  }
  const body = Object.fromEntries(
    Object.entries(loaded).filter(([key]) => !TEMPLATE_OWN_META_KEYS.has(key)),
  );
  const doc = replaceProjectIdDeep({ ...metadataTemplate, ...body }, projectId);
  return doc as Record<string, unknown>;
}

export function scaffoldViewpoints(opts: {
  templatePath: string;
  projectId: string;
  outputPath: string;
  force: boolean;
}): { written: boolean; skipped: boolean } {
  const { templatePath, projectId, outputPath, force } = opts;

  if (existsSync(outputPath) && !force) {
    return { written: false, skipped: true };
  }

  const doc = expandViewpointsDoc(templatePath, projectId);

  const dir = outputPath.includes("/") ? outputPath.slice(0, outputPath.lastIndexOf("/")) : ".";
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  writeFileSync(outputPath, yaml.dump(doc, { lineWidth: 120, noRefs: true }), "utf8");
  return { written: true, skipped: false };
}
