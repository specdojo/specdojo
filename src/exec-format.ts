import { readFile, writeFile } from "node:fs/promises";
import { format, resolveConfig } from "prettier";

export async function formatMarkdownFile(path: string): Promise<void> {
  try {
    const source = await readFile(path, "utf8");
    const config = await resolveConfig(path);
    const formatted = await format(source, {
      ...(config ?? {}),
      filepath: path,
    });
    await writeFile(path, formatted, "utf8");
  } catch (error) {
    const cause = error instanceof Error ? `: ${error.message}` : "";
    throw new Error(`Failed to format Markdown with Prettier: ${path}${cause}`);
  }
}
