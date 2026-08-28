import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

// git フック（lefthook の pre-commit など）の下でテストやツールを実行すると、親の git が
// GIT_DIR / GIT_INDEX_FILE / GIT_WORK_TREE を環境変数へ設定する。それを引き継いだまま git を
// 起動すると、一時ディレクトリで完結させたつもりの init / add / commit が実リポジトリへ適用され、
// core.bare の書き換えや不正なコミットが起きる（PJR-X3E8 / PJR-A99J / PJR-TPY9 で3度再発）。
// 規約として gitEnvironment() 経由を守るだけでは再発を止められないため、呼び出し箇所に env が
// 渡っていることを機械的に検査する。
const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const SCAN_DIRS = ["src", "tests", "tools", "scripts"];
const GIT_SPAWN_RE = /(?:spawnSync|spawn|execFileSync|execFile)\(\s*"git"/g;
// 呼び出し1件分のオプションオブジェクトを収める幅。これを超えると検出漏れになるため広めに取る。
const OPTIONS_WINDOW = 500;

function collectTypeScriptFiles(dir: string): string[] {
  const files: string[] = [];
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return files;
  }
  for (const entry of entries) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) files.push(...collectTypeScriptFiles(path));
    else if (entry.endsWith(".ts")) files.push(path);
  }
  return files;
}

describe("git 起動の環境隔離", () => {
  it("git を起動する箇所はすべて env を明示する", () => {
    const offenders: string[] = [];
    for (const dir of SCAN_DIRS) {
      for (const path of collectTypeScriptFiles(join(ROOT, dir))) {
        const content = readFileSync(path, "utf8");
        for (const match of content.matchAll(GIT_SPAWN_RE)) {
          const start = match.index ?? 0;
          const window = content.slice(start, start + OPTIONS_WINDOW);
          // `env: gitEnvironment()` と、変数へ束縛した `{ ..., env }` の短縮記法の両方を許す。
          if (/\benv\s*[:,}]/.test(window)) continue;
          const line = content.slice(0, start).split("\n").length;
          offenders.push(`${relative(ROOT, path)}:${line}`);
        }
      }
    }
    expect(
      offenders,
      `env: gitEnvironment() を渡していない git 起動: ${offenders.join(", ")}`,
    ).toEqual([]);
  });
});
