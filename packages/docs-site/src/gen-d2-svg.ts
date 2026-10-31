import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assertD2Version, d2SvgId, extractD2Blocks, renderD2 } from "./d2.mjs";
export { d2SvgId } from "./d2.mjs";

function collectMarkdown(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      if (
        entry.name.startsWith(".") ||
        ["generated", "node_modules", "public", "secrets"].includes(entry.name)
      )
        return [];
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) return collectMarkdown(file);
      return entry.isFile() && file.endsWith(".md") ? [file] : [];
    })
    .sort();
}

export function generateD2Svgs(options: { rootDir?: string; outDir?: string } = {}): void {
  const workspace = path.resolve(process.env.SPECDOJO_DOCS_ROOT ?? process.cwd());
  const rootDir = options.rootDir ?? path.join(workspace, "docs");
  const outDir = options.outDir ?? path.join(workspace, ".vitepress", "d2");
  const blocks = collectMarkdown(rootDir).flatMap((file) =>
    extractD2Blocks(readFileSync(file, "utf8"), file),
  );
  // Even a completely cached build must detect a missing or incompatible CLI.
  if (blocks.length > 0) assertD2Version();
  const referenced = new Set<string>();
  const errors: Error[] = [];
  for (const block of blocks) {
    const name = `${d2SvgId(block.code)}.svg`;
    referenced.add(name);
    const output = path.join(outDir, name);
    if (existsSync(output)) continue;
    try {
      const svg = renderD2(block.code);
      mkdirSync(outDir, { recursive: true });
      writeFileSync(output, svg, "utf8");
    } catch (error) {
      rmSync(output, { force: true });
      errors.push(
        new Error(
          `${block.file}:${block.line} [d2] ${error instanceof Error ? error.message : String(error)}`,
          { cause: error },
        ),
      );
    }
  }
  if (existsSync(outDir)) {
    for (const name of readdirSync(outDir)) {
      if (/^[0-9a-f]{8}\.svg$/u.test(name) && !referenced.has(name))
        rmSync(path.join(outDir, name));
    }
  }
  if (errors.length > 0)
    throw new AggregateError(errors, errors.map((error) => error.message).join("\n"));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  generateD2Svgs();
