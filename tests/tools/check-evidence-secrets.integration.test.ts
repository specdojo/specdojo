import { execFile } from "node:child_process";
import { copyFile, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { gitEnvironment } from "../../src/shared/git-environment.js";

const script = path.resolve("tools/check-evidence-secrets.mjs");
const roots: string[] = [];
const record = "docs/ja/projects/prj-test/execution/exec/evidence/run log.json";

async function fixture(): Promise<string> {
  const root = await mkdtemp(path.join(tmpdir(), "specdojo-secret-scan-"));
  roots.push(root);
  return root;
}

function run(
  command: string,
  args: string[],
  cwd: string,
): Promise<{
  status: number;
  stdout: string;
  stderr: string;
}> {
  return new Promise((resolve) => {
    execFile(
      command,
      args,
      { cwd, env: gitEnvironment(), encoding: "utf8" },
      (error, stdout, stderr) => {
        resolve({
          status: typeof error?.code === "number" ? error.code : error ? 1 : 0,
          stdout,
          stderr,
        });
      },
    );
  });
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("check-evidence-secrets CLI", () => {
  it("runs a copied script without node_modules, dist, TS sources or a package.json", async () => {
    const root = await fixture();
    await copyFile(script, path.join(root, "scan.mjs"));
    await writeFile(path.join(root, "clean.log"), "task-judgement https://example.invalid/\n");
    const clean = await run(process.execPath, ["scan.mjs", "clean.log"], root);
    expect(clean).toEqual({ status: 0, stdout: "", stderr: "secret-scan: 1 files, 0 findings\n" });
    const secret = "ASIA" + "A".repeat(16);
    const name = "unsafe name\n.log";
    await writeFile(path.join(root, name), `safe\n${secret}\n`);
    const unsafe = await run(process.execPath, ["scan.mjs", name], root);
    expect(unsafe.status).toBe(1);
    expect(unsafe.stdout).toBe("");
    expect(unsafe.stderr).toContain(`${JSON.stringify(name)}:2: aws-access-key\n`);
    expect(unsafe.stderr).not.toContain(secret);
  });

  it("scans staged blobs even when the working file is clean and ignores unstaged secrets", async () => {
    const root = await fixture();
    expect((await run("git", ["init", "--quiet"], root)).status).toBe(0);
    await mkdir(path.dirname(path.join(root, record)), { recursive: true });
    await writeFile(path.join(root, record), "safe\n");
    await writeFile(path.join(root, "outside.log"), "password=synthetic-outside\n");
    expect((await run("git", ["add", "--", record, "outside.log"], root)).status).toBe(0);
    await writeFile(path.join(root, record), "password=synthetic-staged\n");
    expect((await run(process.execPath, [script, "--staged"], root)).status).toBe(0);
    const tracked = await run(process.execPath, [script, "--tracked"], root);
    expect(tracked.status).toBe(1);
    expect(tracked.stderr).toContain(`${JSON.stringify(record)}:1: credential-assignment`);
    expect(tracked.stderr).not.toContain("outside.log");
    expect((await run("git", ["add", "--", record], root)).status).toBe(0);
    await writeFile(path.join(root, record), "safe\n");
    // Invoke from a subdirectory, as hooks/scripts may do.
    const staged = await run(
      process.execPath,
      [script, "--staged"],
      path.dirname(path.join(root, record)),
    );
    expect(staged.status).toBe(1);
    expect(staged.stderr).toContain(`${JSON.stringify(record)}:1: credential-assignment`);
    expect(staged.stderr).not.toContain("synthetic-staged");
    expect((await run("git", ["rm", "--cached", "--force", "--", record], root)).status).toBe(0);
    expect((await run(process.execPath, [script, "--staged"], root)).status).toBe(0);
  });

  it("fails closed on invalid arguments, missing files, directories, forbidden paths and Git errors", async () => {
    const root = await fixture();
    const checks = [
      [],
      ["--unknown"],
      ["--staged", "file"],
      ["missing.log"],
      ["."],
      [".env"],
      ["secrets/key"],
      ["--tracked"],
    ];
    for (const args of checks) {
      const result = await run(process.execPath, [script, ...args], root);
      expect(result.status).toBe(1);
      expect(result.stdout).toBe("");
      expect(result.stderr).toMatch(/Usage:|read-failed|forbidden-path/);
    }
  });
});
