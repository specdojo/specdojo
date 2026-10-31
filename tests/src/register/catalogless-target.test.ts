import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { validateRegisterApproachTargets } from "../../../src/register/approach.js";
import { resolveRegisterDeliverableTarget } from "../../../src/register/deliverable-target.js";
import { generateRegisterPlan } from "../../../src/exec/register.js";
import type { PjrItem, RegisterPaths } from "../../../src/register/register.js";
import type { Approach } from "../../../src/shared/agent-types.js";

const sourceRoot = process.cwd();
const originalPackageRoot = process.env.SPECDOJO_PACKAGE_ROOT;
let root: string;
function write(path: string, text: string): void {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), text);
}
function doc(path: string, id: string, type: string, fields = ""): void {
  write(
    path,
    `---\nspecdojo:\n  id: ${id}\n  type: ${type}\n  status: draft\n${fields}---\n\n# Example\n`,
  );
}
function rulebook(
  fields = "  recipe: customer:note-recipe\n  sample: customer:note-sample\n  template: not-needed\n",
): void {
  doc(
    "docs/ja/specdojo/rulebooks/customer/note-rulebook.md",
    "customer:note-rulebook",
    "rulebook",
    fields,
  );
}
function validate(approach: Approach, overrides = {}): void {
  validateRegisterApproachTargets({
    repoRoot: root,
    projectId: "prj-test",
    approach,
    targets: ["prj-test:note"],
    ...overrides,
  });
}
async function plan(approach: Approach, overrides: Partial<PjrItem> = {}): Promise<string> {
  const registerDir = join(root, "docs/ja/projects/prj-test/register");
  const filename = "pjr-ab12-note.md";
  write(
    `docs/ja/projects/prj-test/register/${filename}`,
    "# PJR-AB12 Note\n\n## 2. 完了条件\n\n- 入力例が載っている。\n- 例外動作を説明する。\n\n## 3. 作業内容\n",
  );
  const paths: RegisterPaths = {
    projectId: "prj-test",
    projectRegisterPath: registerDir,
    pjrIndexPath: join(registerDir, "pjr-index.md"),
    generatedPath: join(registerDir, "generated"),
    controlsGeneratedPath: join(registerDir, "controls"),
    registerDateTimeZone: "UTC",
  };
  const item: PjrItem = {
    id: "PJR-AB12",
    status: "open",
    title: "Note",
    description: "Write note",
    type: "todo",
    priority: "medium",
    owner: "DEV",
    registeredAt: "2026-10-25T00:00:00Z",
    due: "-",
    completedAt: "-",
    conclusion: "-",
    ticket: `[ticket](./${filename})`,
    approach,
    targets: ["prj-test:note"],
    ...overrides,
  };
  const result = await generateRegisterPlan({
    projectId: "prj-test",
    executionPath: join(root, "execution"),
    registerPaths: paths,
    item,
    stem: "note",
  });
  return readFileSync(result.planPath, "utf8");
}

// 統合時の全件実行など負荷下で、一時ディレクトリ生成・kata 配置・plan 生成の累積により
// 既定の 5 秒を超えることがあるため、スイート全体のタイムアウトを 30 秒へ広げる（PJR-FK0Y）。
describe("catalog-less deliverable resolution and plans", { timeout: 30_000 }, () => {
  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "specdojo-catalogless-"));
    write(
      ".specdojo/specdojo.config.json",
      JSON.stringify({ version: 1, kata_authority: "customer", projects: { "prj-test": {} } }),
    );
    write("package.json", '{"name":"customer"}');
    process.env.SPECDOJO_PACKAGE_ROOT = sourceRoot;
    process.chdir(root);
    doc(
      "docs/ja/product/note.md",
      "prj-test:note",
      "project",
      "  rulebook: customer:note-rulebook\n",
    );
    rulebook();
    doc("docs/ja/specdojo/recipes/customer/note-recipe.md", "customer:note-recipe", "recipe");
    doc("docs/ja/specdojo/samples/customer/note-sample.md", "customer:note-sample", "sample");
  });
  afterEach(() => {
    process.chdir(sourceRoot);
    if (originalPackageRoot === undefined) delete process.env.SPECDOJO_PACKAGE_ROOT;
    else process.env.SPECDOJO_PACKAGE_ROOT = originalPackageRoot;
    rmSync(root, { recursive: true, force: true });
  });

  it.each<Approach>(["fully-guided", "recipe-guided", "freeform", "retrofit"])(
    "resolves existing frontmatter and creates a %s plan",
    async (approach) => {
      validate(approach);
      const text = await plan(approach);
      expect(text).toContain("docs/ja/product/note.md");
      expect(text).toContain("カタログの `done_criteria` はない");
      expect(text).toContain("入力例が載っている。");
      expect(text).toContain(`approach: ${approach}`);
      expect(text).not.toContain("note-template");
    },
  );

  it.each<Approach>(["fully-guided", "recipe-guided", "freeform", "retrofit"])(
    "resolves an uncreated target with explicit path/rulebook for %s",
    async (approach) => {
      const fields = {
        targets: ["prj-test:new"],
        targetPath: "docs/ja/product/new.md",
        targetRulebook: "customer:note-rulebook",
      };
      validate(approach, fields);
      const text = await plan(approach, fields);
      expect(text).toContain("docs/ja/product/new.md");
      expect(text).toContain("specdojo.id: prj-test:new");
    },
  );

  it("resolves bundled kata when no local copy exists", async () => {
    doc(
      "docs/ja/product/note.md",
      "prj-test:note",
      "project",
      "  rulebook: specdojo:prj-overview-rulebook\n",
    );
    validate("fully-guided");
    const text = await plan("fully-guided");
    expect(text).toContain("prj-overview-recipe.md");
    expect(text).toContain("prj-overview-sample.md");
    expect(text).not.toContain("../");
  });

  it("resolves an existing YAML document's metadata", async () => {
    write(
      "docs/ja/product/note.yaml",
      "id: prj-test:yaml-note\ntype: project\nstatus: draft\nrulebook: customer:note-rulebook\n",
    );
    validate("recipe-guided", { targets: ["prj-test:yaml-note"] });
    expect(await plan("recipe-guided", { targets: ["prj-test:yaml-note"] })).toContain(
      "docs/ja/product/note.yaml",
    );
  });

  it("reports missing sample and recipe at registration", () => {
    rmSync(join(root, "docs/ja/specdojo/samples/customer/note-sample.md"));
    expect(() => validate("fully-guided")).toThrow(/missing kata:.*sample/);
    rulebook("  recipe: undecided\n  sample: not-needed\n  template: not-needed\n");
    expect(() => validate("recipe-guided")).toThrow(/missing kata:.*recipe/);
    expect(() =>
      validate("bootstrap", {
        targets: ["prj-test:new"],
        targetPath: "docs/ja/product/new.md",
        targetRulebook: "customer:new-rulebook",
      }),
    ).not.toThrow();
  });

  it("allows explicitly unnecessary kata but omits them from the plan", async () => {
    rulebook("  recipe: not-needed\n  sample: not-needed\n  template: not-needed\n");
    validate("fully-guided");
    const text = await plan("fully-guided");
    expect(text).not.toMatch(/- `(?:recipe|sample|template)`:/);
  });

  it("rejects frontmatter conflicts and occupied paths", () => {
    expect(() => validate("fully-guided", { targetRulebook: "customer:other-rulebook" })).toThrow(
      /conflicts with specdojo.rulebook/,
    );
    expect(() => validate("fully-guided", { targetPath: "docs/ja/product/other.md" })).toThrow(
      /conflicts with the indexed document/,
    );
    expect(() =>
      validate("freeform", {
        targets: ["prj-test:other"],
        targetPath: "docs/ja/product/note.md",
        targetRulebook: "customer:note-rulebook",
      }),
    ).toThrow(/occupied/);
  });

  it.each(["../outside.md", "/tmp/outside.md", "C:\\outside.md", "docs\\outside.md", "."])(
    "rejects invalid target path %s",
    (targetPath) => {
      expect(() =>
        validate("freeform", {
          targets: ["new"],
          targetPath,
          targetRulebook: "customer:note-rulebook",
        }),
      ).toThrow(/target-path/);
    },
  );

  it("rejects symlink escapes", () => {
    symlinkSync(tmpdir(), join(root, "escape"));
    expect(() =>
      validate("freeform", {
        targets: ["new"],
        targetPath: "escape/new.md",
        targetRulebook: "customer:note-rulebook",
      }),
    ).toThrow(/outside.*symlink/);
  });

  it("keeps catalog precedence and requires both explicit fields for a catalog miss", () => {
    write(
      "catalog/dct-note.yaml",
      "id: prj-test:dct-note\nproject_id: prj-test\ndomain: test\nbase_path: /docs/ja/product\ngroups:\n  - deliverables:\n      - local_id: note\n        name: Catalog Note\n        overview: Catalog overview\n        kind: work\n        path: note.md\n",
    );
    const catalogPath = join(root, "catalog");
    const found = resolveRegisterDeliverableTarget({
      repoRoot: root,
      projectId: "prj-test",
      catalogPath,
      approach: "fully-guided",
      targetId: "prj-test:note",
      targetPath: "ignored.md",
      targetRulebook: "ignored",
    });
    expect(found.catalogless).toBe(false);
    expect(found.info.deliverable.name).toBe("Catalog Note");
    expect(() => validate("freeform", { catalogPath, targets: ["new"] })).toThrow(
      /not a catalog deliverable/,
    );
    expect(() =>
      validate("freeform", {
        catalogPath,
        targets: ["new"],
        targetPath: "docs/new.md",
        targetRulebook: "customer:note-rulebook",
      }),
    ).not.toThrow();
  });

  it("bootstrap proposes new ids/paths and instructs writing specdojo.rulebook", async () => {
    const fields = {
      targets: ["new"],
      targetPath: "docs/ja/product/new.md",
      targetRulebook: "customer:new-rulebook",
    };
    const text = await plan("bootstrap", fields);
    for (const kind of ["rulebook", "recipe", "sample", "template"]) {
      expect(text).toContain(`customer:new-${kind}`);
      expect(text).toContain(`docs/ja/specdojo/${kind}s/customer/new-${kind}.md`);
    }
    expect(text).toContain("未作成");
    expect(text).toContain("specdojo.rulebook: customer:new-rulebook");
    expect(() =>
      validate("bootstrap", { ...fields, targetRulebook: "customer:note-rulebook" }),
    ).toThrow(/already exists/);
    write(".specdojo/specdojo.config.json", '{"version":1,"projects":{"prj-test":{}}}');
    expect(() => validate("bootstrap", fields)).toThrow(/kata_authority/);
  });

  it.each<Approach>(["finalize", "bootstrap-finalize"])(
    "%s uses ticket criteria and only existing targets",
    async (approach) => {
      expect(() =>
        validate(approach, {
          targets: ["new"],
          targetPath: "docs/new.md",
          targetRulebook: "customer:note-rulebook",
        }),
      ).toThrow(/existing deliverable/);
      const text = await plan(approach);
      expect(text).toContain("- [ ] 入力例が載っている。");
      expect(text).toContain("- [ ] 成果物: `docs/ja/product/note.md`");
      if (approach === "bootstrap-finalize") expect(text).toContain("- [ ] `customer:note-recipe`");
      else expect(text).not.toContain("- [ ] `customer:note-recipe`");
    },
  );

  it("bootstrap-finalize follows every sample declaration", async () => {
    rulebook(
      "  recipe: not-needed\n  sample: [customer:note-sample, customer:extra-sample]\n  template: not-needed\n",
    );
    doc("docs/ja/specdojo/samples/customer/extra-sample.md", "customer:extra-sample", "sample");
    const text = await plan("bootstrap-finalize");
    expect(text).toContain("- [ ] `customer:extra-sample`");
    expect(text).toContain("docs/ja/specdojo/samples/customer/extra-sample.md");
  });

  it("keeps cross-deliverable-dedup catalog-only", () => {
    expect(() => validate("cross-deliverable-dedup")).toThrow(/catalog_path/);
  });
});
