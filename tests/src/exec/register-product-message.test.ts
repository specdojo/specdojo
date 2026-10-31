import { describe, expect, it } from "vitest";
import { registerProductMessage } from "../../../src/exec/register-product-message.js";
import { validateCommitMessageTemplate } from "../../../src/shared/commit-message-template.js";

const base = {
  projectId: "prj-0001",
  item: { id: "PJR-Z7GX", title: "Add feature", type: "todo" },
  ticketPath: "tickets/pjr-z7gx-product-messages.md",
  product: {
    name: "app",
    repoRoot: ".",
    path: ".",
    branch: "exec/prj-0001-PJR-Z7GX",
    integrationBranch: "develop",
    created: true,
  },
  kind: "commit" as const,
};
const trailer = "Refs: prj-0001:PJR-Z7GX";
const repo = { name: "app", path: "../app" };

describe("registerProductMessage", () => {
  it.each(["commit", "merge"] as const)(
    "retains the legacy %s message without configuration",
    (kind) => {
      expect(registerProductMessage({ ...base, kind })).toBe(
        `exec(register PJR-Z7GX): Add feature\n\n${trailer}`,
      );
    },
  );

  it("expands all variables, taking type and scope from the item", () => {
    expect(
      registerProductMessage({
        ...base,
        item: { ...base.item, commitType: "fix", commitScope: "api" },
        projectConfig: { commit_types: { todo: "docs" } },
        repoConfig: {
          ...repo,
          commit_subject_template:
            "{type}({scope}): {title} {id} {project} {topic} {branch} {target}",
        },
      }),
    ).toBe(
      "fix(api): Add feature PJR-Z7GX prj-0001 product-messages exec/prj-0001-PJR-Z7GX develop\n\n" +
        trailer,
    );
  });

  it("removes the scope parentheses and uses the repository type mapping", () => {
    expect(
      registerProductMessage({
        ...base,
        projectConfig: { commit_types: { todo: "docs" } },
        repoConfig: {
          ...repo,
          commit_types: { todo: "chore" },
          commit_subject_template: "{type}({scope}): {title}",
        },
      }),
    ).toBe(`chore: Add feature\n\n${trailer}`);
  });

  it("uses the project type mapping when no repository mapping exists", () => {
    expect(
      registerProductMessage({
        ...base,
        projectConfig: { commit_types: { todo: "docs" } },
        repoConfig: { ...repo, commit_subject_template: "{type}: {title}" },
      }),
    ).toBe(`docs: Add feature\n\n${trailer}`);
  });

  it("keeps the default merge independent of a configured commit template", () => {
    expect(
      registerProductMessage({
        ...base,
        kind: "merge",
        repoConfig: { ...repo, commit_subject_template: "{type}: {title}" },
      }),
    ).toBe(`exec(register PJR-Z7GX): Add feature\n\n${trailer}`);
  });

  it("keeps a merge body and moves a supplied Refs trailer to the end exactly once", () => {
    expect(
      registerProductMessage({
        ...base,
        kind: "merge",
        repoConfig: {
          ...repo,
          merge_message_template:
            "Merge branch '{branch}' into {target}\n\nRefs: {project}:{id}\n\nTopic: {topic}",
        },
      }),
    ).toBe(
      `Merge branch 'exec/prj-0001-PJR-Z7GX' into develop\n\n\nTopic: product-messages\n\n${trailer}`,
    );
  });

  it.each(["commit", "merge"] as const)(
    "limits the %s subject to 100 characters and preserves Refs",
    (kind) => {
      const message = registerProductMessage({
        ...base,
        kind,
        item: { ...base.item, title: "x".repeat(150) },
        repoConfig: {
          ...repo,
          commit_subject_template: "{type}: {title}",
          merge_message_template: "{title}\n\nbody",
        },
      });
      expect(message.split("\n")[0]).toHaveLength(100);
      expect(message.split("\n")[0]).toMatch(/…$/);
      expect(message.endsWith(`\n\n${trailer}`)).toBe(true);
      if (kind === "merge") expect(message).toContain("\n\nbody\n\n");
    },
  );

  it("flattens commit subjects and does not re-expand placeholders in titles", () => {
    expect(
      registerProductMessage({
        ...base,
        item: { ...base.item, title: "Keep {unknown}\nand {id}" },
        repoConfig: { ...repo, commit_subject_template: "{type}:\n{title}" },
      }),
    ).toBe(`feat: Keep {unknown} and {id}\n\n${trailer}`);
  });

  it("rejects unknown variables at expansion as well as configuration validation", () => {
    expect(() =>
      registerProductMessage({
        ...base,
        repoConfig: { ...repo, commit_subject_template: "{unknown}" },
      }),
    ).toThrow("unknown variable {unknown}");
  });

  it("rejects a template that renders an empty subject when scope is absent", () => {
    expect(() =>
      registerProductMessage({
        ...base,
        repoConfig: { ...repo, commit_subject_template: "({scope})" },
      }),
    ).toThrow("empty subject");
  });

  it("uses the item ID when a topic filename is unavailable", () => {
    expect(
      registerProductMessage({
        ...base,
        ticketPath: undefined,
        repoConfig: { ...repo, commit_subject_template: "{topic}: {title}" },
      }),
    ).toBe(`pjr-z7gx: Add feature\n\n${trailer}`);
  });
});

describe("validateCommitMessageTemplate", () => {
  it.each(["{unknown}", "{title", "title}", "{{title}}", "{}", "", " ", null, false, 1, "a\0b"])(
    "rejects invalid template %j",
    (value) => {
      expect(
        validateCommitMessageTemplate(value, "repos[0].commit_subject_template").length,
      ).toBeGreaterThan(0);
    },
  );
});
