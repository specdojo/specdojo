import { Readable } from "node:stream";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";

type InspectPushInput = (input: string) => { allowed: boolean; protectedRef: string };
type RunProtectMainPush = (options: {
  input: Readable;
  report: (message: string) => void;
}) => Promise<number>;

let inspectPushInput: InspectPushInput;
let runProtectMainPush: RunProtectMainPush;

beforeAll(async () => {
  const moduleUrl = pathToFileURL(path.resolve("tools/protect-main-push.mjs")).href;
  const entryModule = (await import(moduleUrl)) as {
    inspectPushInput: InspectPushInput;
    runProtectMainPush: RunProtectMainPush;
  };
  inspectPushInput = entryModule.inspectPushInput;
  runProtectMainPush = entryModule.runProtectMainPush;
});

describe("tools/protect-main-push.mjs", () => {
  it("rejects an update to refs/heads/main", () => {
    const result = inspectPushInput(
      "refs/heads/project/prj-0001/develop local refs/heads/main remote\n",
    );

    expect(result).toEqual({ allowed: false, protectedRef: "refs/heads/main" });
  });

  it.each([
    "refs/heads/project/prj-0001/develop",
    "refs/heads/feature/prj-0001/topic",
    "refs/heads/exec/prj-0001-PJR-QW5T",
  ])("allows an update to %s", (remoteRef) => {
    const result = inspectPushInput(`refs/heads/local local ${remoteRef} remote\n`);

    expect(result.allowed).toBe(true);
  });

  it("rejects the whole push when one of multiple updates targets main", () => {
    const result = inspectPushInput(
      [
        "refs/heads/feature/prj-0001/topic local refs/heads/feature/prj-0001/topic remote",
        "refs/heads/project/prj-0001/develop local refs/heads/main remote",
      ].join("\n"),
    );

    expect(result.allowed).toBe(false);
  });

  it("reports the required pull request direction and merge method", async () => {
    const messages: string[] = [];
    const exitCode = await runProtectMainPush({
      input: Readable.from("refs/heads/local local refs/heads/main remote\n"),
      report: (message) => messages.push(message),
    });

    expect(exitCode).toBe(1);
    expect(messages.join("\n")).toContain("refs/heads/main");
    expect(messages.join("\n")).toContain("base: main");
    expect(messages.join("\n")).toContain("head: project/<project-id>/develop");
    expect(messages.join("\n")).toContain("Create a merge commit");
  });
});
