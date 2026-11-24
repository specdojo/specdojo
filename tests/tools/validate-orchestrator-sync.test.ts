import { mkdirSync, writeFileSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

type Wrapper = { path: string; format: "markdown" | "toml" | "raw" };
type SkillCopy = { source: string; path: string };
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
let skillCopies: SkillCopy[];
let generateOrchestratorWrappers: (rootDir: string) => string[];
let validateOrchestratorSync: ValidateOrchestratorSync;
let runValidateOrchestratorSync: RunValidateOrchestratorSync;
const temporaryDirectories: string[] = [];

beforeAll(async () => {
  const moduleUrl = pathToFileURL(path.resolve("tools/validate-orchestrator-sync.mjs")).href;
  const entryModule = (await import(moduleUrl)) as {
    ORCHESTRATOR_SOURCE: string;
    ORCHESTRATOR_WRAPPERS: Wrapper[];
    SKILL_COPIES: SkillCopy[];
    validateOrchestratorSync: ValidateOrchestratorSync;
    runValidateOrchestratorSync: RunValidateOrchestratorSync;
  };
  orchestratorSource = entryModule.ORCHESTRATOR_SOURCE;
  orchestratorWrappers = entryModule.ORCHESTRATOR_WRAPPERS;
  skillCopies = entryModule.SKILL_COPIES;
  validateOrchestratorSync = entryModule.validateOrchestratorSync;
  runValidateOrchestratorSync = entryModule.runValidateOrchestratorSync;
  const generatorUrl = pathToFileURL(path.resolve("tools/generate-orchestrator-wrappers.mjs")).href;
  const generatorModule = (await import(generatorUrl)) as {
    generateOrchestratorWrappers: (rootDir: string) => string[];
  };
  generateOrchestratorWrappers = generatorModule.generateOrchestratorWrappers;
});

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true })),
  );
});

// raw は本文をそのまま持つ形式で、codex のようにファイル定義 agent を使わない provider 向け。
function wrapperFixtureContent(wrapper: Wrapper, body: string): string {
  if (wrapper.format === "raw") return body;
  if (wrapper.format === "markdown") return `---\nname: fixture\n---\n\n${body}`;
  return `name = "fixture"\ndeveloper_instructions = """\n${body}"""\n`;
}

async function createFixture(
  body = "# Shared body\n\nSame instructions.\n",
  writeSkillCopies = true,
) {
  const rootDir = await mkdtemp(path.join(tmpdir(), "orchestrator-sync-"));
  temporaryDirectories.push(rootDir);

  const write = (relativePath: string, content: string) => {
    const target = path.join(rootDir, relativePath);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, content, "utf8");
  };

  write(orchestratorSource, body);
  for (const wrapper of orchestratorWrappers) {
    write(wrapper.path, wrapperFixtureContent(wrapper, body));
  }
  for (const copy of skillCopies) {
    write(copy.source, `---\nname: skill\n---\n\n# ${copy.source}\n`);
    if (writeSkillCopies) write(copy.path, `---\nname: skill\n---\n\n# ${copy.source}\n`);
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

  it("raw 形式はファイル全体が本文として比較される", async () => {
    const fixture = await createFixture();
    const target = orchestratorWrappers.find((wrapper) => wrapper.format === "raw");
    expect(target).toBeDefined();
    fixture.write(target!.path, "# Stale body\n");

    expect(validateOrchestratorSync(fixture.rootDir)).toEqual([
      expect.objectContaining({ path: target!.path }),
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

  it("skill の配布原本が正本の .agents/skills と Claude Code のラッパーを templates へ写す", () => {
    expect(skillCopies).toEqual([
      {
        source: ".agents/skills/specdojo-exec-in-session/SKILL.md",
        path: "templates/agent-skills/specdojo-exec-in-session/SKILL.md",
      },
      {
        source: ".claude/skills/specdojo-exec-in-session/SKILL.md",
        path: "templates/claude/skills/specdojo-exec-in-session/SKILL.md",
      },
    ]);
  });

  it("skill の写しが無いと写し漏れとして終了コード1を返す", async () => {
    const fixture = await createFixture(undefined, false);
    const errors: string[] = [];

    const exitCode = runValidateOrchestratorSync({
      rootDir: fixture.rootDir,
      report: (message) => errors.push(message),
      confirm: () => undefined,
    });

    expect(exitCode).toBe(1);
    for (const copy of skillCopies) {
      expect(errors.join("")).toContain(`MISSING ${copy.path}`);
    }
  });

  it("skill の写しが正本と食い違うと不一致を検出する", async () => {
    const fixture = await createFixture();
    const target = skillCopies[0]!;
    fixture.write(target.path, "---\nname: skill\n---\n\n# Stale\n");

    expect(validateOrchestratorSync(fixture.rootDir)).toEqual([
      expect.objectContaining({ path: target.path }),
    ]);
  });

  it("orchestrator:sync の生成は skill の写しを作り、検査を通す", async () => {
    const fixture = await createFixture(undefined, false);

    const updated = generateOrchestratorWrappers(fixture.rootDir);

    expect(updated).toEqual(skillCopies.map((copy) => copy.path));
    expect(validateOrchestratorSync(fixture.rootDir)).toEqual([]);
  });
});
