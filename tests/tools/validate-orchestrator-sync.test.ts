import { mkdirSync, writeFileSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

type Wrapper = { path: string; format: "markdown" | "toml" };
type ValidateOrchestratorSync = (rootDir: string) => Array<{
  path: string;
  line: number;
  offset: number;
}>;
type RunValidateOrchestratorSync = (options: {
  rootDir: string;
  report: (message: string) => void;
  confirm: (message: string) => void;
}) => number;

let orchestratorSource: string;
let orchestratorWrappers: Wrapper[];
let validateOrchestratorSync: ValidateOrchestratorSync;
let runValidateOrchestratorSync: RunValidateOrchestratorSync;
const temporaryDirectories: string[] = [];

beforeAll(async () => {
  const moduleUrl = pathToFileURL(path.resolve("tools/validate-orchestrator-sync.mjs")).href;
  const entryModule = (await import(moduleUrl)) as {
    ORCHESTRATOR_SOURCE: string;
    ORCHESTRATOR_WRAPPERS: Wrapper[];
    validateOrchestratorSync: ValidateOrchestratorSync;
    runValidateOrchestratorSync: RunValidateOrchestratorSync;
  };
  orchestratorSource = entryModule.ORCHESTRATOR_SOURCE;
  orchestratorWrappers = entryModule.ORCHESTRATOR_WRAPPERS;
  validateOrchestratorSync = entryModule.validateOrchestratorSync;
  runValidateOrchestratorSync = entryModule.runValidateOrchestratorSync;
});

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true })),
  );
});

async function createFixture(body = "# Shared body\n\nSame instructions.\n") {
  const rootDir = await mkdtemp(path.join(tmpdir(), "orchestrator-sync-"));
  temporaryDirectories.push(rootDir);

  const write = (relativePath: string, content: string) => {
    const target = path.join(rootDir, relativePath);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, content, "utf8");
  };

  write(orchestratorSource, body);
  for (const wrapper of orchestratorWrappers) {
    write(
      wrapper.path,
      wrapper.format === "markdown"
        ? `---\nname: fixture\n---\n\n${body}`
        : `name = "fixture"\ndeveloper_instructions = """\n${body}"""\n`,
    );
  }

  return { rootDir, write };
}

describe("tools/validate-orchestrator-sync.mjs", () => {
  it("Markdown と TOML の全ラッパーが正本と一致すると成功する", async () => {
    const fixture = await createFixture();

    expect(validateOrchestratorSync(fixture.rootDir)).toEqual([]);
  });

  it("Markdown ラッパーの本文不一致を検出する", async () => {
    const fixture = await createFixture();
    const target = orchestratorWrappers.find((wrapper) => wrapper.format === "markdown");
    expect(target).toBeDefined();
    fixture.write(target!.path, "---\nname: fixture\n---\n\n# Changed body\n");

    expect(validateOrchestratorSync(fixture.rootDir)).toEqual([
      expect.objectContaining({ path: target!.path, line: 1 }),
    ]);
  });

  it("TOML の developer_instructions 不一致時に終了コード1を返す", async () => {
    const fixture = await createFixture();
    const target = orchestratorWrappers.find((wrapper) => wrapper.format === "toml");
    expect(target).toBeDefined();
    fixture.write(
      target!.path,
      'name = "fixture"\ndeveloper_instructions = """\n# Stale body\n"""\n',
    );
    const errors: string[] = [];

    const exitCode = runValidateOrchestratorSync({
      rootDir: fixture.rootDir,
      report: (message) => errors.push(message),
      confirm: () => undefined,
    });

    expect(exitCode).toBe(1);
    expect(errors.join("\n")).toContain(target!.path);
  });
});
