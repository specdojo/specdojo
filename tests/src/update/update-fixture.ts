import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// specdojo update のテストで使う、配る原本を持つパッケージと利用リポジトリの最小の形。

export async function writeFiles(root: string, files: Record<string, string>): Promise<void> {
  for (const [relPath, content] of Object.entries(files)) {
    const filePath = path.join(root, ...relPath.split("/"));
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, content, "utf8");
  }
}

export async function writePackage(
  root: string,
  version: string,
  templates: Record<string, string>,
  changelog = "# Changelog\n",
): Promise<string> {
  await writeFiles(root, {
    "package.json": `${JSON.stringify({ name: "specdojo", version })}\n`,
    "CHANGELOG.md": changelog,
    ...Object.fromEntries(
      Object.entries(templates).map(([relPath, content]) => [`templates/${relPath}`, content]),
    ),
  });
  return root;
}
