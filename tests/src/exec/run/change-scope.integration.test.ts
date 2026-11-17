import { execFileSync, spawn, type ChildProcess } from "node:child_process";
import { once } from "node:events";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import {
  ChangeScopeGate,
  inferChangeScope,
  type ChangeScopeLease,
} from "../../../../src/exec/run/change-scope.js";
import { gitEnvironment } from "../../../../src/shared/git-environment.js";

describe("change scope across joined run processes", () => {
  it("excludes gitignored derived lists outside generated directories", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-scope-ignored-"));
    try {
      execFileSync("git", ["init", "--quiet", root], { env: gitEnvironment() });
      writeFileSync(join(root, ".gitignore"), "derived-list.md\n");
      expect(
        inferChangeScope({
          projectId: "test",
          repoRoot: root,
          targets: ["derived-list.md", "src/new.ts"],
          text: "`derived-list.md` を再生成する。",
        }),
      ).toEqual({ paths: ["project:src/new.ts"], unknown: false });
      expect(
        inferChangeScope({
          projectId: "test",
          repoRoot: root,
          targets: ["derived-list.md"],
        }),
      ).toEqual({ paths: [], unknown: true });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it(
    "atomically reserves overlapping scope across processes and waits for integration",
    { timeout: 30_000 },
    async () => {
      const execution = mkdtempSync(join(tmpdir(), "specdojo-joined-scope-"));
      const module = pathToFileURL(
        resolve(__dirname, "../../../../src/exec/run/change-scope.ts"),
      ).href;
      let child: ChildProcess | undefined;
      const leases: ChangeScopeLease[] = [];
      try {
        child = spawn(
          process.execPath,
          [
            "--import",
            "tsx",
            "--input-type=module",
            "-e",
            `
        import { ChangeScopeGate } from ${JSON.stringify(module)};
        const gate = new ChangeScopeGate(${JSON.stringify(execution)});
        const lease = await gate.acquire("PJR-ED0K", { paths: ["project:src/exec/run"], unknown: false });
        process.stdout.write("reserved\\n");
        await new Promise(resolve => process.stdin.once("data", resolve));
        await lease.finish(true);
      `,
          ],
          { stdio: ["pipe", "pipe", "pipe"] },
        );
        const output = await Promise.race([
          once(child.stdout!, "data").then(([chunk]) => String(chunk)),
          once(child, "exit").then(([code]) => {
            throw new Error(`scope holder exited early: ${code}`);
          }),
        ]);
        expect(output).toContain("reserved");
        const gate = new ChangeScopeGate(execution);
        const scope = { paths: ["project:src/exec/run/lifecycle-commands.ts"], unknown: false };
        expect(await gate.tryAcquire("PJR-1GCD", scope)).toBeNull();
        leases.push(
          await gate.acquire("PJR-INDEPENDENT", { paths: ["project:src/catalog"], unknown: false }),
        );
        const exited = once(child, "exit");
        child.stdin!.end("integrated\n");
        expect((await exited)[0]).toBe(0);
        const second = await gate.acquire("PJR-1GCD", scope);
        leases.push(second);
        expect(second.waits).toMatchObject([
          { blocker: "PJR-ED0K", overlap: expect.stringContaining("src/exec/run") },
        ]);
      } finally {
        child?.kill();
        for (const lease of leases) await lease.finish(true);
        rmSync(execution, { recursive: true, force: true });
      }
    },
  );
});
