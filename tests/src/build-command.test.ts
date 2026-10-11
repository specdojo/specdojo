import { describe, expect, it } from "vitest";
import { resolveRegisterProjectIds, resolveSteps } from "../../src/build-command.js";
import type { SpecDojoConfig } from "../../src/specdojo-config.js";

const TWO_PROJECT_CONFIG: SpecDojoConfig = {
  version: 1,
  current_project: "prj-0002",
  projects: {
    "prj-0002": {
      base_path: "docs/ja/projects/prj-0002",
      project_register_path: "controls/project-register",
    },
    "prj-0001": {
      base_path: "docs/ja/projects/prj-0001",
      catalog_path: "010-deliverables-catalog",
      project_register_path: "controls/project-register",
    },
    "prj-0003": {
      base_path: "docs/ja/projects/prj-0003",
    },
  },
};

describe("resolveRegisterProjectIds", () => {
  it("targets every project with a register when --project is not given", () => {
    const actual = resolveRegisterProjectIds(TWO_PROJECT_CONFIG, "prj-0002", false);

    expect(actual).toEqual(["prj-0001", "prj-0002"]);
  });

  it("keeps only the explicit project when --project is given", () => {
    const actual = resolveRegisterProjectIds(TWO_PROJECT_CONFIG, "prj-0001", true);

    expect(actual).toEqual(["prj-0001"]);
  });

  it("returns no project when the explicit project has no register", () => {
    const actual = resolveRegisterProjectIds(TWO_PROJECT_CONFIG, "prj-0003", true);

    expect(actual).toEqual([]);
  });

  it("returns no project without a config", () => {
    expect(resolveRegisterProjectIds(null, undefined, false)).toEqual([]);
  });
});

describe("resolveSteps", () => {
  it("runs register build for each project before index build while other steps stay on one project", () => {
    const project = TWO_PROJECT_CONFIG.projects["prj-0001"];

    const steps = resolveSteps("all", ["--project", "prj-0001"], project, ["prj-0001", "prj-0002"]);

    expect(steps.map((step) => step.label)).toEqual([
      "catalog build",
      "register build (prj-0001)",
      "register build (prj-0002)",
      "yaml-pages build",
      "index build",
    ]);
    expect(steps.find((step) => step.scope === "catalog")?.subArgs).toEqual([
      "catalog",
      "build",
      "--project",
      "prj-0001",
    ]);
    expect(steps.filter((step) => step.scope === "register").map((step) => step.subArgs)).toEqual([
      ["register", "build", "--project", "prj-0001"],
      ["register", "build", "--project", "prj-0002"],
    ]);
  });

  it("keeps the single register step label when only one project is targeted", () => {
    const project = TWO_PROJECT_CONFIG.projects["prj-0001"];

    const steps = resolveSteps("register", ["--project", "prj-0001"], project, ["prj-0001"]);

    expect(steps).toEqual([
      {
        scope: "register",
        label: "register build",
        subArgs: ["register", "build", "--project", "prj-0001"],
      },
    ]);
  });

  it("omits register build when no project has a register", () => {
    const project = TWO_PROJECT_CONFIG.projects["prj-0003"];

    const steps = resolveSteps("all", ["--project", "prj-0003"], project, []);

    expect(steps.map((step) => step.scope)).toEqual(["yaml-pages", "index"]);
  });
});
