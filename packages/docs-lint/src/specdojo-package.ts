import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, isAbsolute, join, resolve, sep } from "node:path";

const ASSET_MARKERS = ["docs/specdojo/", "docs/ja/specdojo/"];

function packageRoot(workspaceRoot: string): string | undefined {
  try {
    const workspaceRequire = createRequire(join(resolve(workspaceRoot), "package.json"));
    return dirname(workspaceRequire.resolve("specdojo/package.json"));
  } catch {
    return undefined;
  }
}

export function resolveSpecdojoAssetPath(pathRef: string, workspaceRoot = process.cwd()): string {
  const localPath = isAbsolute(pathRef) ? pathRef : resolve(workspaceRoot, pathRef);
  if (existsSync(localPath)) return localPath;

  const posixPath = pathRef.split(sep).join("/");
  const marker = ASSET_MARKERS.find((candidate) => posixPath.includes(candidate));
  const root = marker ? packageRoot(workspaceRoot) : undefined;
  if (!marker || !root) return localPath;

  return join(root, posixPath.slice(posixPath.indexOf(marker)));
}
