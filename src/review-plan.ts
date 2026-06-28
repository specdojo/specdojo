import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import yaml from "js-yaml";

export function expandViewpointsDoc(
  templatePath: string,
  projectId: string,
): Record<string, unknown> {
  const template = yaml.load(readFileSync(templatePath, "utf8")) as Record<string, unknown>;
  return {
    ...template,
    id: `${projectId}:pm-review-viewpoints`,
    type: "project",
    project_id: projectId,
  };
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
