import { describe, expect, it } from "vitest";
import {
  assertCrossProjectMutationAllowed,
  resolveProjectIntegrationBranch,
} from "../../../src/register/cross-project.js";
import { parseRegisterItemRef } from "../../../src/register/derivation.js";

describe("resolveProjectIntegrationBranch", () => {
  it("uses the configured project integration branch", () => {
    expect(
      resolveProjectIntegrationBranch("prj-0002", {
        integration_branch: "project/customer-b/develop",
      }),
    ).toBe("project/customer-b/develop");
  });

  it("defaults to project/<project-id>/develop", () => {
    expect(resolveProjectIntegrationBranch("prj-0002", {})).toBe("project/prj-0002/develop");
  });
});

describe("parseRegisterItemRef", () => {
  it("keeps the traditional unqualified form in the current project", () => {
    expect(parseRegisterItemRef("PJR-AB12", "prj-0001")).toEqual({
      projectId: "prj-0001",
      itemId: "PJR-AB12",
    });
  });

  it("resolves a project-qualified source item", () => {
    expect(parseRegisterItemRef("prj-0002:PJR-CD34", "prj-0001")).toEqual({
      projectId: "prj-0002",
      itemId: "PJR-CD34",
    });
  });
});

describe("assertCrossProjectMutationAllowed", () => {
  it("requires commit for a cross-project add", () => {
    expect(() => assertCrossProjectMutationAllowed("add", "prj-0002", false)).toThrow(
      /requires --commit/,
    );
    expect(() => assertCrossProjectMutationAllowed("add", "prj-0002", true)).not.toThrow();
  });

  it("rejects a cross-project state transition with worktree guidance", () => {
    expect(() => assertCrossProjectMutationAllowed("close", "prj-0002", true)).toThrow(
      /Run the command in the worktree for project prj-0002/,
    );
  });
});
