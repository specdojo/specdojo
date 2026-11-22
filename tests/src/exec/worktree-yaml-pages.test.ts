import { afterEach, describe, expect, it, vi } from "vitest";
import type { ExecDefaultsConfig } from "../../../src/exec/agent-config.js";
import { failedParentValidationReason } from "../../../src/exec/parent-validation.js";
import { runConfiguredParentValidationBatch } from "../../../src/exec/run/agent.js";
import {
  refreshWorktreeYamlPages,
  refreshYamlPagesBeforeParentValidations,
  selectStaleYamlPageSources,
  type YamlPageSourceState,
} from "../../../src/exec/worktree-yaml-pages.js";

describe("selectStaleYamlPageSources", () => {
  const states: Record<string, YamlPageSourceState> = {
    "docs/ja/a/ifx-index.yaml": { sourceMtimeMs: 20, pageMtimeMs: 10, pageIsYamlPage: true },
    "docs/ja/a/pm-roles.yaml": { sourceMtimeMs: 10, pageMtimeMs: 20 },
    "docs/ja/a/new.yml": { sourceMtimeMs: 30 },
    "docs/ja/a/schema-like.yaml": { sourceMtimeMs: 30 },
    "docs/ja/a/dct-catalog.yaml": { sourceMtimeMs: 20, pageMtimeMs: 10, pageIsYamlPage: false },
    "docs/specdojo/schemas/v1/x.schema.yaml": { sourceMtimeMs: 20, pageMtimeMs: 10 },
  };

  it("selects YAML newer than its page and changed YAML without a page", () => {
    const actual = selectStaleYamlPageSources({
      yamlPaths: Object.keys(states),
      changedPaths: ["docs/ja/a/new.yml", "docs/specdojo/schemas/v1/x.schema.yaml"],
      state: (path) => states[path],
    });

    expect(actual).toEqual(["docs/ja/a/ifx-index.yaml", "docs/ja/a/new.yml"]);
  });

  it("selects nothing when no YAML changed after the pages were generated", () => {
    const actual = selectStaleYamlPageSources({
      yamlPaths: ["docs/ja/a/pm-roles.yaml", "docs/ja/a/schema-like.yaml"],
      changedPaths: ["docs/ja/a/readme.md"],
      state: (path) => states[path],
    });

    expect(actual).toEqual([]);
  });
});

describe("refreshWorktreeYamlPages", () => {
  it("does not run the build when no YAML page is stale", () => {
    const build = vi.fn(() => ({ exitCode: 0, output: "" }));

    const actual = refreshWorktreeYamlPages("/worktree", { stale: () => [], build });

    expect(actual).toEqual({ status: "skipped" });
    expect(build).not.toHaveBeenCalled();
  });

  it("names the changed YAML and keeps the build output when the rebuild fails", () => {
    const actual = refreshWorktreeYamlPages("/worktree", {
      stale: () => ["docs/ja/a/ifx-index.yaml"],
      build: () => ({
        exitCode: 1,
        output: "Failed to render YAML page: docs/ja/a/ifx-index.yaml (boom)",
      }),
    });

    expect(actual).toEqual({
      status: "failed",
      sources: ["docs/ja/a/ifx-index.yaml"],
      summary:
        "yaml-pages rebuild for changed YAML (docs/ja/a/ifx-index.yaml) exited with 1: " +
        "Failed to render YAML page: docs/ja/a/ifx-index.yaml (boom)",
      output: "Failed to render YAML page: docs/ja/a/ifx-index.yaml (boom)",
    });
  });
});

describe("refreshYamlPagesBeforeParentValidations", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("records nothing when the pages were rebuilt or left as they were", () => {
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);

    const actual = refreshYamlPagesBeforeParentValidations(
      { project: "/project", repos: { app1: "/app1" } },
      (path) =>
        path === "/project"
          ? { status: "rebuilt", sources: ["docs/ja/a.yaml"] }
          : { status: "skipped" },
    );

    expect(actual).toEqual({ validations: [], failureOutputs: [] });
  });

  it("turns a failed rebuild into a failed runner validation", () => {
    const actual = refreshYamlPagesBeforeParentValidations({ project: "/project" }, () => ({
      status: "failed",
      sources: ["docs/ja/a.yaml"],
      summary: "yaml-pages rebuild for changed YAML (docs/ja/a.yaml) exited with 1",
      output: "boom",
    }));

    expect(actual.validations).toEqual([
      {
        id: "yaml-pages",
        source: "runner",
        command: "specdojo build --only yaml-pages",
        status: "failed",
        summary: "yaml-pages rebuild for changed YAML (docs/ja/a.yaml) exited with 1",
      },
    ]);
    expect(actual.failureOutputs.map((output) => output.label)).toEqual(["yaml-pages"]);
  });
});

describe("runConfiguredParentValidationBatch with YAML pages", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rebuilds the pages before the validations and fails the batch when the rebuild fails", async () => {
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    const events: string[] = [];
    const execDefaults: ExecDefaultsConfig = {
      pipeline: { parent_validations: ["lint-md-changed"] },
    };

    const batch = await runConfiguredParentValidationBatch(execDefaults, "/worktree", {
      label: "PJR-AAAA",
      refreshYamlPages: () => {
        events.push("refresh");
        return {
          status: "failed",
          sources: ["docs/ja/a.yaml"],
          summary: "rebuild failed",
          output: "",
        };
      },
      invoke: async (definition) => {
        events.push(definition.id);
        return { exitCode: 0, stdout: "", stderr: "" };
      },
    });

    expect(events).toEqual(["refresh", "lint-md-changed"]);
    expect(batch.validations.map((validation) => [validation.id, validation.status])).toEqual([
      ["yaml-pages", "failed"],
      ["lint-md-changed", "passed"],
    ]);
    expect(failedParentValidationReason(batch.validations)).toBe(
      "parent validation failed: yaml-pages",
    );
  });
});
