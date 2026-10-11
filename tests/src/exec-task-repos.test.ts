import { describe, expect, it } from "vitest";
import {
  agentExtraRootArguments,
  productRepoEnvironment,
  productRepoPromptSection,
  productRootsFromEnvironment,
  projectRepoDirName,
  repoEnvironmentVariableName,
  resolveProductRepos,
  withAgentExtraRoots,
  withoutInheritedRepoEnvironment,
  withProductRepoPrompt,
  type ProductRepo,
} from "../../src/exec-task-repos.js";

const products = [
  { name: "app1", path: "/work/task/app1" },
  { name: "admin-ui", path: "/work/task/admin-ui" },
];

describe("repoEnvironmentVariableName", () => {
  it("upper-cases the name and maps hyphens to underscores", () => {
    expect(repoEnvironmentVariableName("admin-ui")).toBe("SPECDOJO_REPO_ADMIN_UI");
  });
});

describe("productRepoEnvironment", () => {
  it("returns no variables for a task without product worktrees", () => {
    expect(productRepoEnvironment("/work/task/project", undefined)).toEqual({});
    expect(productRepoEnvironment("/work/task/project", [])).toEqual({});
  });

  it("round-trips the product roots through productRootsFromEnvironment", () => {
    const env = productRepoEnvironment("/work/task/project", products);

    expect(env.SPECDOJO_REPO_PROJECT).toBe("/work/task/project");
    expect(productRootsFromEnvironment(env)).toEqual(products);
  });

  it("drops SPECDOJO_REPO_* inherited from the parent process", () => {
    const inherited = { PATH: "/usr/bin", SPECDOJO_REPO_NAMES: "old", SPECDOJO_REPO_OLD: "/x" };

    expect(withoutInheritedRepoEnvironment(inherited)).toEqual({ PATH: "/usr/bin" });
  });

  it("ignores names announced without a path variable", () => {
    expect(productRootsFromEnvironment({ SPECDOJO_REPO_NAMES: "app1" })).toEqual([]);
  });
});

describe("agentExtraRootArguments", () => {
  const dirs = ["/work/task/app1", "/work/task/admin-ui"];

  it("adds directories and absolute Edit rules for claude", () => {
    expect(agentExtraRootArguments("claude", dirs)).toEqual([
      "--add-dir",
      "/work/task/app1",
      "/work/task/admin-ui",
      "--allowedTools",
      "Edit(//work/task/app1/**)",
      "Edit(//work/task/admin-ui/**)",
    ]);
  });

  it("repeats --add-dir for codex, antigravity, and copilot", () => {
    for (const provider of ["codex", "antigravity", "copilot"] as const) {
      expect(agentExtraRootArguments(provider, dirs)).toEqual([
        "--add-dir",
        "/work/task/app1",
        "--add-dir",
        "/work/task/admin-ui",
      ]);
    }
  });

  it("adds nothing for opencode, custom, and unknown providers", () => {
    expect(agentExtraRootArguments("opencode", dirs)).toEqual([]);
    expect(agentExtraRootArguments("custom", dirs)).toEqual([]);
    expect(agentExtraRootArguments(undefined, dirs)).toEqual([]);
  });

  it("adds nothing when there are no product worktrees", () => {
    expect(agentExtraRootArguments("claude", [])).toEqual([]);
  });
});

describe("withAgentExtraRoots", () => {
  it("leaves the command unchanged without extra roots", () => {
    expect(withAgentExtraRoots("codex exec", "codex", [])).toBe("codex exec");
  });

  it("appends shell-quoted arguments so paths with quotes stay one word", () => {
    expect(withAgentExtraRoots("codex exec", "codex", ["/tmp/it's here"])).toBe(
      "codex exec '--add-dir' '/tmp/it'\\''s here'",
    );
  });
});

describe("productRepoPromptSection", () => {
  it("is empty for single-repository tasks", () => {
    expect(productRepoPromptSection(undefined)).toBe("");
    expect(withProductRepoPrompt("plan body\n", [])).toBe("plan body\n");
  });

  it("lists every product worktree with its variable and the <repo>:<path> notation", () => {
    const section = productRepoPromptSection(products);

    expect(section).toContain(
      "- `app1`: /work/task/app1 (environment variable `SPECDOJO_REPO_APP1`)",
    );
    expect(section).toContain("`SPECDOJO_REPO_ADMIN_UI`");
    expect(section).toContain("`app1:src/index.ts`");
  });
});

describe("resolveProductRepos", () => {
  it("resolves paths from the SpecDojo root and defaults setup to install and build", () => {
    const actual = resolveProductRepos("/work/app1-specdojo", {
      repos: [
        { name: "app1", path: "../app1" },
        {
          name: "app2",
          path: "../app2",
          integration_branch: "main",
          setup: { install: false, build: false },
        },
      ],
    });

    expect(actual).toEqual<ProductRepo[]>([
      { name: "app1", repoRoot: "/work/app1", install: true, build: true },
      {
        name: "app2",
        repoRoot: "/work/app2",
        integrationBranch: "main",
        install: false,
        build: false,
      },
    ]);
  });

  it("returns no products for a project without repos", () => {
    expect(resolveProductRepos("/work/app1-specdojo", {})).toEqual([]);
    expect(projectRepoDirName([])).toBeUndefined();
  });
});
