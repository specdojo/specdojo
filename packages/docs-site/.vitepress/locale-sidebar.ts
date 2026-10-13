import { existsSync, statSync } from "node:fs";
import * as path from "node:path";

// vitepress-sidebar の generateSidebar は documentRootPath / scanStartPath を process.cwd() から解決し、
// 走査先が存在しないと "The path to scan does not exist" を投げて設定の読み込みごと失敗させる。
// `config init` は docs/ja だけを作るため、locale のフォルダーが無い workspace では走査を行わず
// 空のサイドバーとして扱う。
export function shouldScanLocaleSidebar(
  workspaceRoot: string,
  documentRootPath: string,
  locale: string,
): boolean {
  const scanPath = path.join(workspaceRoot, documentRootPath, locale);
  if (!existsSync(scanPath)) return false;
  return statSync(scanPath).isDirectory();
}

// locale のフォルダーがあるときだけ scan を呼び、無いときは空配列を返す。
export function scanLocaleSidebar<T>(
  workspaceRoot: string,
  documentRootPath: string,
  locale: string,
  scan: () => T[],
): T[] {
  if (!shouldScanLocaleSidebar(workspaceRoot, documentRootPath, locale)) return [];
  return scan();
}
