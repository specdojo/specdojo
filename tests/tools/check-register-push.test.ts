import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import { pathToFileURL } from "node:url";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

type Update = { commit: string; remoteRef: string; base: string };
type RunCheck = (options: {
  argv: string[];
  input: Readable;
  root: string;
  check: (root: string, project: string, update: Update) => number;
  report: (message: string) => void;
}) => Promise<number>;

let pushedUpdates: (input: string) => Update[];
let runCheck: RunCheck;
const roots: string[] = [];

const LOCAL = "a".repeat(40);
const OTHER = "b".repeat(40);
const ZERO = "0".repeat(40);
const REF = "refs/heads/project/prj-0001/register";

beforeAll(async () => {
  const moduleUrl = pathToFileURL(path.resolve("tools/check-register-push.mjs")).href;
  const entryModule = (await import(moduleUrl)) as {
    pushedUpdates: (input: string) => Update[];
    runCheckRegisterPush: RunCheck;
  };
  pushedUpdates = entryModule.pushedUpdates;
  runCheck = entryModule.runCheckRegisterPush;
});

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function rootWithTsx(): string {
  const root = mkdtempSync(path.join(tmpdir(), "specdojo-register-push-"));
  roots.push(root);
  mkdirSync(path.join(root, "node_modules", "tsx"), { recursive: true });
  return root;
}

describe("pushedUpdates", () => {
  it("returns commit, remote ref and base, and ignores deletions", () => {
    const input = `x ${LOCAL} ${REF} ${OTHER}\nx ${ZERO} refs/heads/gone ${OTHER}\n`;

    expect(pushedUpdates(input)).toEqual([{ commit: LOCAL, remoteRef: REF, base: OTHER }]);
  });
});

describe("runCheckRegisterPush", () => {
  it("fails and reports when a branch-check fails", async () => {
    const messages: string[] = [];

    const code = await runCheck({
      argv: ["--project", "prj-0001"],
      input: Readable.from([`x ${LOCAL} ${REF} ${ZERO}\n`]),
      root: rootWithTsx(),
      check: () => 1,
      report: (message) => messages.push(message),
    });

    expect(code).toBe(1);
    expect(messages.join("")).toContain("register branch-check");
  });

  it("passes when every branch-check passes", async () => {
    const seen: Update[] = [];

    const code = await runCheck({
      argv: ["--project", "prj-0001"],
      input: Readable.from([`x ${LOCAL} ${REF} ${OTHER}\n`]),
      root: rootWithTsx(),
      check: (_root, _project, update) => {
        seen.push(update);
        return 0;
      },
      report: () => undefined,
    });

    expect(code).toBe(0);
    expect(seen).toEqual([{ commit: LOCAL, remoteRef: REF, base: OTHER }]);
  });

  it("skips when tsx is not installed", async () => {
    const root = mkdtempSync(path.join(tmpdir(), "specdojo-register-push-"));
    roots.push(root);
    const messages: string[] = [];

    const code = await runCheck({
      argv: ["--project", "prj-0001"],
      input: Readable.from([`x ${LOCAL} ${REF} ${OTHER}\n`]),
      root,
      check: () => 1,
      report: (message) => messages.push(message),
    });

    expect(code).toBe(0);
    expect(messages.join("")).toContain("skipped");
  });
});
