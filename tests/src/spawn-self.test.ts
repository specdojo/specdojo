import { afterEach, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { selfRunArgs } from "../../src/spawn-self.js";

const originalScript = process.argv[1];
const originalCwd = process.cwd();

afterEach(() => {
  process.argv[1] = originalScript;
  process.chdir(originalCwd);
});

describe("selfRunArgs", () => {
  it("コンパイル済み .js は node で直接再実行する", () => {
    process.argv[1] = "/opt/app/dist/specdojo.js";

    const [command, args] = selfRunArgs(["exec", "run"]);

    expect(command).toBe(process.execPath);
    expect(args).toEqual(["/opt/app/dist/specdojo.js", "exec", "run"]);
  });

  it(".ts かつローカル tsx がある場合は tsx 経由で再実行する", () => {
    // リポジトリ直下で実行するため node_modules/.bin/tsx が存在する
    process.argv[1] = "/opt/app/src/specdojo.ts";

    const [command, args] = selfRunArgs(["watch"]);

    expect(command).toBe(process.execPath);
    expect(args[0]).toMatch(/node_modules[/\\]\.bin[/\\]tsx$/);
    expect(args.slice(1)).toEqual(["/opt/app/src/specdojo.ts", "watch"]);
  });

  it(".ts かつローカル tsx がない場合は npx tsx にフォールバックする", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-test-"));

    try {
      mkdirSync(join(dir, ".specdojo"), { recursive: true });
      writeFileSync(
        join(dir, ".specdojo", "specdojo.config.json"),
        JSON.stringify({ version: 1, projects: {} }),
        "utf8",
      );
      process.chdir(dir);
      process.argv[1] = "/opt/app/src/specdojo.ts";

      const [command, args] = selfRunArgs(["watch"]);

      expect(command).toBe("npx");
      expect(args).toEqual(["tsx", "/opt/app/src/specdojo.ts", "watch"]);
    } finally {
      process.chdir(originalCwd);
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
