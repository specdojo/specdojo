import { relative } from "node:path";
import { specdojoRootDir } from "./specdojo-config.js";

export function toPortablePath(path: string): string {
  return path.replace(/\\/g, "/");
}

export function toArtifactPath(path: string): string {
  const rel = relative(specdojoRootDir(), path);
  return toPortablePath(rel || ".");
}
