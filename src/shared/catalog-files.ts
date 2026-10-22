import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { readYaml } from "./fs.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// 1 ドメインが dct-<domain>-<sub>.yaml のように複数ファイルへ分割されることがあるため、
// ファイル名ではなく各カタログの domain 値で突き合わせる。
export function collectCatalogFilesByDomain(catalogPath: string): Map<string, string[]> {
  const byDomain = new Map<string, string[]>();
  if (!existsSync(catalogPath)) return byDomain;

  const files = readdirSync(catalogPath)
    .filter((file) => /^dct-.+\.ya?ml$/.test(file))
    .sort();

  for (const file of files) {
    const fullPath = join(catalogPath, file);
    const parsed = readYaml(fullPath);
    if (!isRecord(parsed)) continue;
    const domain = parsed.domain;
    if (typeof domain !== "string" || domain.trim().length === 0) continue;

    const group = byDomain.get(domain);
    if (group) group.push(fullPath);
    else byDomain.set(domain, [fullPath]);
  }

  return byDomain;
}
