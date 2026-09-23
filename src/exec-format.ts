import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { format, getFileInfo, resolveConfig } from "prettier";

// 対象ファイルから上位へ辿り、最も近い .prettierignore を返す。Prettier CLI は cwd の
// .prettierignore を使うが、API の format は ignore を参照しないため、runner 側で探索する。
export function findPrettierIgnorePath(filePath: string): string | undefined {
  let directory = path.dirname(path.resolve(filePath));
  for (;;) {
    const candidate = path.join(directory, ".prettierignore");
    if (existsSync(candidate)) return candidate;
    const parent = path.dirname(directory);
    if (parent === directory) return undefined;
    directory = parent;
  }
}

// .prettierignore で除外されたファイル（exec の plan / result 履歴など）は、commit hook と
// 同様に runner の描画時にも整形しない。整形すると `_` を含む識別子と `_TODO_` の同居を
// 強調と解釈して本文を書き換える（PJR-19HX）。
export async function isPrettierIgnored(filePath: string): Promise<boolean> {
  const ignorePath = findPrettierIgnorePath(filePath);
  if (!ignorePath) return false;
  const info = await getFileInfo(path.resolve(filePath), { ignorePath });
  return info.ignored;
}

export async function formatMarkdownFile(filePath: string): Promise<void> {
  try {
    if (await isPrettierIgnored(filePath)) return;
    const source = await readFile(filePath, "utf8");
    const config = await resolveConfig(filePath);
    const formatted = await format(source, {
      ...(config ?? {}),
      filepath: filePath,
    });
    await writeFile(filePath, formatted, "utf8");
  } catch (error) {
    const cause = error instanceof Error ? `: ${error.message}` : "";
    throw new Error(`Failed to format Markdown with Prettier: ${filePath}${cause}`);
  }
}
