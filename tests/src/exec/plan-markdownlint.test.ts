import { rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { assertPlanMarkdownlint } from "../../../src/exec/plan-markdownlint.js";
import { createPlanMarkdownlintFixture } from "../../helpers/plan-markdownlint.js";

const repos: string[] = [];
const source = "# Plan\n\nInstructions.\n- Item\n";

function fixture(): string {
  const repo = createPlanMarkdownlintFixture("Instructions.");
  repos.push(repo);
  return repo;
}

afterEach(() => {
  for (const repo of repos.splice(0)) rmSync(repo, { recursive: true, force: true });
});

describe("assertPlanMarkdownlint", () => {
  it("reports the task, plan path, line and rule even without repository configuration", async () => {
    const repo = fixture();
    rmSync(join(repo, ".markdownlint.yaml"));
    await expect(
      assertPlanMarkdownlint(repo, "T-TEST", join(repo, "plan.md"), source),
    ).rejects.toThrow(/Task T-TEST, plan plan\.md:[\s\S]*plan\.md: 4 MD032/);
  });

  it("honors explicit rule configuration", async () => {
    const repo = fixture();
    writeFileSync(join(repo, ".markdownlint.yaml"), "MD032: false\n");
    await expect(
      assertPlanMarkdownlint(repo, "T-TEST", join(repo, "plan.md"), source),
    ).resolves.toBeUndefined();
  });

  it("resolves JSONC configuration and extends relative to the config file", async () => {
    const repo = fixture();
    writeFileSync(join(repo, "base.json"), '{"MD032": false}\n');
    writeFileSync(
      join(repo, ".markdownlint.jsonc"),
      '{\n// repository override\n"extends": "./base.json",\n}\n',
    );
    await expect(
      assertPlanMarkdownlint(repo, "T-TEST", join(repo, "plan.md"), source),
    ).resolves.toBeUndefined();
  });

  it("loads .markdownlintrc when no named config exists", async () => {
    const repo = fixture();
    rmSync(join(repo, ".markdownlint.yaml"));
    writeFileSync(join(repo, ".markdownlintrc"), '{"MD032": false}\n');
    await expect(
      assertPlanMarkdownlint(repo, "T-TEST", join(repo, "plan.md"), source),
    ).resolves.toBeUndefined();
  });

  it("fails explicitly when the repository config cannot be parsed", async () => {
    const repo = fixture();
    writeFileSync(join(repo, ".markdownlint.yaml"), "MD032: [\n");
    await expect(
      assertPlanMarkdownlint(repo, "T-TEST", join(repo, "plan.md"), source),
    ).rejects.toThrow(/Task T-TEST[\s\S]*Failed to run markdownlint/);
  });
});
