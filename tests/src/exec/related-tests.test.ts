import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  buildTestDependencyGraph,
  launchedPaths,
  relativeImportSpecifiers,
  selectRelatedTests,
  type TestDependencyGraph,
} from "../../../src/exec/related-tests.js";
import {
  resolveParentValidationAssignments,
  runParentValidations,
  type ParentValidationDefinition,
  type ParentValidationInvoker,
} from "../../../src/exec/parent-validation.js";

const graph: TestDependencyGraph = {
  tests: [
    "tests/src/exec/cli.integration.test.ts",
    "tests/src/exec/worktree.integration.test.ts",
    "tests/src/register/register.integration.test.ts",
  ],
  dependencies: new Map([
    [
      "tests/src/exec/cli.integration.test.ts",
      new Set([
        "tests/src/exec/cli.integration.test.ts",
        "src/specdojo.ts",
        "src/exec/worktree.ts",
        "src/register/register.ts",
      ]),
    ],
    [
      "tests/src/exec/worktree.integration.test.ts",
      new Set(["tests/src/exec/worktree.integration.test.ts", "src/exec/worktree.ts"]),
    ],
    [
      "tests/src/register/register.integration.test.ts",
      new Set(["tests/src/register/register.integration.test.ts", "src/register/register.ts"]),
    ],
  ]),
};

describe("selectRelatedTests", () => {
  it("selects the tests that depend on a changed source file", () => {
    const actual = selectRelatedTests(graph, ["src/exec/worktree.ts"]);

    expect(actual).toEqual({
      mode: "related",
      reason: "2 of 3 test files depend on the changed files",
      selected: [
        "tests/src/exec/cli.integration.test.ts",
        "tests/src/exec/worktree.integration.test.ts",
      ],
      omitted: ["tests/src/register/register.integration.test.ts"],
    });
  });

  it("selects a changed test file itself", () => {
    const actual = selectRelatedTests(graph, ["tests/src/register/register.integration.test.ts"]);

    expect(actual).toMatchObject({
      mode: "related",
      selected: ["tests/src/register/register.integration.test.ts"],
    });
  });

  it("matches both sides of a rename and ignores documentation changes", () => {
    const actual = selectRelatedTests(graph, [
      "src/register/old.ts -> src/register/register.ts",
      "docs/ja/projects/prj-0001/a.md",
    ]);

    expect(actual).toMatchObject({
      mode: "related",
      selected: [
        "tests/src/exec/cli.integration.test.ts",
        "tests/src/register/register.integration.test.ts",
      ],
    });
  });

  it("names the changed code files no selected test depends on", () => {
    const actual = selectRelatedTests(graph, ["src/exec/worktree.ts", "src/exec/unused.ts"]);

    expect(actual.reason).toBe(
      "2 of 3 test files depend on the changed files; no test depends on: src/exec/unused.ts",
    );
  });

  it("falls back to the full run when no related test is found", () => {
    expect(selectRelatedTests(graph, ["src/exec/unused.ts"])).toEqual({
      mode: "full",
      reason: "no related test found for the changed files",
    });
  });

  it("falls back to the full run when the change set is unknown", () => {
    expect(selectRelatedTests(graph, undefined)).toEqual({
      mode: "full",
      reason: "change set is unknown or truncated",
    });
  });

  it.each([
    ["vitest.integration.config.ts"],
    ["tests/helpers/git-environment.ts"],
    ["tests/setup/git-environment.ts"],
    ["tests/fixtures/sample/plan.md"],
    ["package.json"],
    ["tsconfig.test.json"],
    ["docs/specdojo/schemas/v1/exec-defaults.schema.yaml"],
  ])("falls back to the full run when the test infrastructure %s changed", (changed) => {
    const actual = selectRelatedTests(graph, ["src/exec/worktree.ts", changed]);

    expect(actual).toEqual({
      mode: "full",
      reason: `test infrastructure or settings changed: ${changed}`,
    });
  });

  it("falls back to the full run when a non-code file changed under src", () => {
    const actual = selectRelatedTests(graph, ["src/exec/worktree.ts", "src/exec/defaults.yaml"]);

    expect(actual).toEqual({
      mode: "full",
      reason: "non-code file changed under a source root: src/exec/defaults.yaml",
    });
  });
});

describe("import and launched path extraction", () => {
  it("returns only relative import specifiers", () => {
    const text = [
      'import { a } from "../../src/a.js";',
      'import type { B } from "./b.js";',
      'export { c } from "../c.js";',
      'import "./side-effect.js";',
      'const d = await import("../d.js");',
      'import { describe } from "vitest";',
      'import path from "node:path";',
    ].join("\n");

    expect(relativeImportSpecifiers(text)).toEqual([
      "../../src/a.js",
      "../c.js",
      "../d.js",
      "./b.js",
      "./side-effect.js",
    ]);
  });

  it("maps a built CLI entry to its source", () => {
    const text =
      'spawn("npx", ["tsx", "src/specdojo.ts"]); run(path.join(root, "dist/specdojo.js"));';

    expect(launchedPaths(text)).toEqual(["src/specdojo.ts"]);
  });
});

describe("buildTestDependencyGraph", () => {
  let root: string;

  beforeEach(async () => {
    root = await mkdtemp(path.join(tmpdir(), "specdojo-related-tests-"));
  });

  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  const write = async (file: string, content: string): Promise<void> => {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await writeFile(path.join(root, file), content, "utf8");
  };

  it("follows transitive imports, launched CLI entries and imports of deleted files", async () => {
    await write("src/specdojo.ts", 'import { run } from "./commands/run.js";\n');
    await write("src/commands/run.ts", 'import { lock } from "../shared/lock.js";\n');
    await write("src/shared/lock.ts", "export const lock = 1;\n");
    await write("src/exec/worktree.ts", 'export * from "../shared/lock.js";\n');
    await write(
      "tests/src/exec/cli.integration.test.ts",
      'const args = ["tsx", "src/specdojo.ts"];\n',
    );
    await write(
      "tests/src/exec/worktree.integration.test.ts",
      'import { x } from "../../../src/exec/worktree.js";\nimport { y } from "../../../src/exec/removed.js";\n',
    );
    await write("tests/src/exec/worktree.test.ts", 'import "../../../src/exec/worktree.js";\n');

    const integration = await buildTestDependencyGraph(root, "integration");

    expect(integration.tests).toEqual([
      "tests/src/exec/cli.integration.test.ts",
      "tests/src/exec/worktree.integration.test.ts",
    ]);
    expect(selectRelatedTests(integration, ["src/shared/lock.ts"])).toMatchObject({
      mode: "related",
      selected: integration.tests,
    });
    expect(selectRelatedTests(integration, ["src/commands/run.ts"])).toMatchObject({
      selected: ["tests/src/exec/cli.integration.test.ts"],
      omitted: ["tests/src/exec/worktree.integration.test.ts"],
    });
    expect(selectRelatedTests(integration, ["src/exec/removed.ts"])).toMatchObject({
      selected: ["tests/src/exec/worktree.integration.test.ts"],
    });
    const unit = await buildTestDependencyGraph(root, "unit");
    expect(unit.tests).toEqual(["tests/src/exec/worktree.test.ts"]);
  });

  describe("in the parent validation batch", () => {
    const recordingInvoker = (calls: ParentValidationDefinition[]): ParentValidationInvoker => {
      return async (definition) => {
        calls.push(definition);
        return { exitCode: 0, stdout: "ok", stderr: "" };
      };
    };

    beforeEach(async () => {
      await write("src/a.ts", "export const a = 1;\n");
      await write("src/b.ts", "export const b = 1;\n");
      await write("tests/a.integration.test.ts", 'import { a } from "../src/a.js";\n');
      await write("tests/b.integration.test.ts", 'import { b } from "../src/b.js";\n');
    });

    it("runs the full suite with the fixed argv when related is not set", async () => {
      const calls: ParentValidationDefinition[] = [];
      const [validation] = await runParentValidations(
        ["test-integration"],
        root,
        recordingInvoker(calls),
        { changedPaths: ["src/a.ts"] },
      );

      expect(calls.map((call) => call.args)).toEqual([["run", "test:integration"]]);
      expect(validation.test_selection).toBeUndefined();
      expect(validation.summary).toBe("exit 0: ok");
    });

    it("passes only the related test files and records what did not run", async () => {
      const calls: ParentValidationDefinition[] = [];
      const [validation] = await runParentValidations(
        [{ id: "test-integration", related: true }],
        root,
        recordingInvoker(calls),
        { changedPaths: ["src/a.ts"] },
      );

      expect(calls.map((call) => call.args)).toEqual([
        ["run", "test:integration", "--", "tests/a.integration.test.ts"],
      ]);
      expect(validation).toMatchObject({
        status: "passed",
        command: "npm run test:integration",
        test_selection: {
          mode: "related",
          reason: "1 of 2 test files depend on the changed files",
          selected_tests: ["tests/a.integration.test.ts"],
          omitted_tests: ["tests/b.integration.test.ts"],
        },
      });
      expect(validation.summary).toMatch(/^related tests only \(1 of 2 test files/);
    });

    it("runs the full suite and records the reason when the selection falls back", async () => {
      const calls: ParentValidationDefinition[] = [];
      const [validation] = await runParentValidations(
        [{ id: "test-integration", related: true }],
        root,
        recordingInvoker(calls),
        { changedPaths: ["src/a.ts", "tests/helpers/fixture.ts"] },
      );

      expect(calls.map((call) => call.args)).toEqual([["run", "test:integration"]]);
      expect(validation.test_selection).toEqual({
        mode: "full",
        reason: "test infrastructure or settings changed: tests/helpers/fixture.ts",
      });
    });
  });
});

describe("related parent validation config", () => {
  it("accepts related for the vitest validations", () => {
    const [assignment] = resolveParentValidationAssignments([{ id: "test-unit", related: true }]);

    expect(assignment).toMatchObject({ label: "test-unit", related: true });
  });

  it("rejects related for a validation that is not a vitest run", () => {
    expect(() => resolveParentValidationAssignments([{ id: "lint-md", related: true }])).toThrow(
      /\.related is supported only for test-unit, test-integration \(got lint-md\)/,
    );
  });

  it("rejects a non-boolean related", () => {
    expect(() =>
      resolveParentValidationAssignments([{ id: "test-integration", related: "yes" }]),
    ).toThrow(/\.related must be a boolean/);
  });
});
