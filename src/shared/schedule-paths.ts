import { basename, relative } from "node:path";
import { toPortablePath } from "./artifact-path.js";

export function isSchYamlFilename(path: string): boolean {
  const name = basename(path);
  return /^sch-.*\.(yaml|yml)$/.test(name);
}

export function toScheduleFilePath(schedulePath: string, filePath: string): string {
  return toPortablePath(relative(schedulePath, filePath) || ".");
}
