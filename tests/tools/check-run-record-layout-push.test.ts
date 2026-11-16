import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import { pathToFileURL } from "node:url";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

type Validate = (root: string, project: string, commit: string) => number;
type RunCheck = (options: {
  argv: string[];
  input: Readable;
  root: string;
  validate: Validate;
  report: (message: string) => void;
}) => Promise<number>;

let pushedCommits: (input: string) => string[];
let runCheck: RunCheck;
const roots: string[] = [];

const LOCAL = "a".repeat(40);
const OTHER = "b".repeat(40);
const ZERO = "0".repeat(40);

beforeAll(async () => {
  const moduleUrl = pathToFileURL(path.resolve("tools/check-run-record-layout-push.mjs")).href;
  const entryModule = (await import(moduleUrl)) as {
    pushedCommits: (input: string) => string[];
    runCheckRunRecordLayoutPush: RunCheck;
  };
  pushedCommits = entryModule.pushedCommits;
  runCheck = entryModule.runCheckRunRecordLayoutPush;
});

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function rootWithTsx(): string {
  const root = mkdtempSync(path.join(tmpdir(), "specdojo-layout-push-"));
  roots.push(root);
  mkdirSync(path.join(root, "node_modules", "tsx"), { recursive: true });
  return root;
}

describe("tools/check-run-record-layout-push.mjs", () => {
  it("checks each pushed tip once and skips branch deletions", () => {
    const actual = pushedCommits(
      [
        `refs/heads/a ${LOCAL} refs/heads/a ${OTHER}`,
        `refs/heads/b ${LOCAL} refs/heads/b ${ZERO}`,
        `(delete) ${ZERO} refs/heads/c ${OTHER}`,
      ].join("\n"),
    );

    expect(actual).toEqual([LOCAL]);
  });

  it("fails the push when a pushed commit fails the layout check", async () => {
    const messages: string[] = [];
    const checked: string[] = [];

    const exitCode = await runCheck({
      argv: ["--project", "prj-0001"],
      input: Readable.from(`refs/heads/a ${LOCAL} refs/heads/a ${OTHER}\n`),
      root: rootWithTsx(),
      validate: (_root, project, commit) => {
        checked.push(`${project}:${commit}`);
        return 1;
      },
      report: (message) => messages.push(message),
    });

    expect(exitCode).toBe(1);
    expect(checked).toEqual([`prj-0001:${LOCAL}`]);
    expect(messages.join("")).toContain("exec validate --records-only");
  });

  it("passes the push when every pushed commit passes", async () => {
    const exitCode = await runCheck({
      argv: ["--project", "prj-0001"],
      input: Readable.from(`refs/heads/a ${LOCAL} refs/heads/a ${OTHER}\n`),
      root: rootWithTsx(),
      validate: () => 0,
      report: () => undefined,
    });

    expect(exitCode).toBe(0);
  });

  it("skips the check with a notice when tsx is not installed", async () => {
    const root = mkdtempSync(path.join(tmpdir(), "specdojo-layout-push-"));
    roots.push(root);
    const messages: string[] = [];

    const exitCode = await runCheck({
      argv: ["--project", "prj-0001"],
      input: Readable.from(`refs/heads/a ${LOCAL} refs/heads/a ${OTHER}\n`),
      root,
      validate: () => 1,
      report: (message) => messages.push(message),
    });

    expect(exitCode).toBe(0);
    expect(messages.join("")).toMatch(/skipped: node_modules\/tsx/);
  });
});
