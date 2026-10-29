import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { validateRegisterApproachTargets } from "../../../src/register/approach.js";
import { generateRegisterPlan } from "../../../src/exec/register.js";
import { generateSinglePlan } from "../../../src/exec/plans-generation.js";
import { parsePlanTaskIdentity } from "../../../src/exec/plans-storage.js";
import { parseApproach } from "../../../src/exec/core.js";
import type { PjrItem, RegisterPaths } from "../../../src/register/register.js";
import { dump } from "../../../src/shared/yaml.js";
import { readSpecdojoNamespace } from "../../../src/docs/frontmatter-namespace.js";
import { buildValidator, formatErrors } from "../../helpers/schema.js";

const sourceRoot = process.cwd();
const originalPackageRoot = process.env.SPECDOJO_PACKAGE_ROOT;
let root: string;
const project = {
  base_path: "docs/ja/projects/prj-0001",
  catalog_path: "catalog",
  schedule_path: "schedule",
};
function write(file: string, content: string) {
  mkdirSync(dirname(join(root, file)), { recursive: true });
  writeFileSync(join(root, file), content);
}
function validate(approach: string, targets: string[], extra = {}) {
  validateRegisterApproachTargets({
    repoRoot: root,
    projectId: "prj-0001",
    project,
    approach,
    targets,
    ...extra,
  });
}
beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "specdojo-planning-"));
  write(
    ".specdojo/specdojo.config.json",
    JSON.stringify({ version: 1, projects: { "prj-0001": project } }),
  );
  write(
    "docs/ja/projects/prj-0001/timeline/tml-index.yaml",
    dump({
      project_id: "prj-0001",
      tracks: [
        {
          track: "demo",
          domains: ["project-definition"],
          catalog_status: "not_started",
          order: 1,
          depends_on: [],
        },
      ],
    }),
  );
  process.env.SPECDOJO_PACKAGE_ROOT = sourceRoot;
  process.chdir(root);
});
afterEach(() => {
  process.chdir(sourceRoot);
  if (originalPackageRoot === undefined) delete process.env.SPECDOJO_PACKAGE_ROOT;
  else process.env.SPECDOJO_PACKAGE_ROOT = originalPackageRoot;
  rmSync(root, { recursive: true, force: true });
});

describe("planning approach validation", () => {
  it("未作成のカタログ・strategy を作業単位で指定できる", () => {
    expect(() => validate("catalog-planning", ["domain:project-definition"])).not.toThrow();
    expect(() => validate("strategy-planning", ["track:demo"])).not.toThrow();
    expect(parseApproach("catalog-planning")).toBe("catalog-planning");
    expect(parseApproach("strategy-planning")).toBe("strategy-planning");
  });
  it.each(
    [
      [],
      ["domain:a", "domain:b"],
      ["track:demo"],
      ["domain:../outside"],
      ["domain:Demo"],
      [`domain:${"a".repeat(64)}`],
    ].map((targets) => ({ targets })),
  )("不正な domain 対象 $targets を拒否する", ({ targets }) => {
    expect(() => validate("catalog-planning", targets)).toThrow();
  });
  it("必要な設定、track 定義、sources と成果物指定の混用を検証する", () => {
    expect(() => validate("catalog-planning", ["domain:demo"], { project: {} })).toThrow(
      "catalog_path",
    );
    expect(() =>
      validate("strategy-planning", ["track:demo"], { project: { catalog_path: "catalog" } }),
    ).toThrow("schedule_path");
    expect(() => validate("strategy-planning", ["track:missing"])).toThrow(
      "Undefined strategy track",
    );
    expect(() => validate("catalog-planning", ["domain:demo"], { sources: ["example"] })).toThrow(
      "--source",
    );
    expect(() =>
      validate("catalog-planning", ["domain:demo"], { targetPath: "demo.yaml" }),
    ).toThrow("--target-path");
  });
  it("timeline がない場合は明示 scope で strategy を作れる", () => {
    expect(() =>
      validate("strategy-planning", ["track:demo"], {
        project: { catalog_path: "catalog", schedule_path: "schedule" },
      }),
    ).not.toThrow();
  });
});

describe("planning approach plans", () => {
  it.each(["catalog-planning", "strategy-planning"] as const)(
    "%s に kata、既存カタログ、個票の完了条件とコマンドを展開する",
    async (approach) => {
      const catalogPath = join(root, project.base_path, "catalog");
      write(
        `${project.base_path}/catalog/dct-existing.yaml`,
        dump({ id: "prj-0001:dct-existing", domain: "existing", groups: [] }),
      );
      const registerPath = join(root, "register");
      write(
        "register/pjr-ab12-planning.md",
        "# PJR-AB12 計画\n\n## 2. 完了条件\n\n- 業務責任者へ確認した根拠を記録する。\n\n## 3. 作業内容\n",
      );
      const paths: RegisterPaths = {
        projectId: "prj-0001",
        projectRegisterPath: registerPath,
        pjrIndexPath: join(registerPath, "pjr-index.md"),
        generatedPath: join(registerPath, "generated"),
        controlsGeneratedPath: join(registerPath, "controls"),
        registerDateTimeZone: "UTC",
      };
      const item: PjrItem = {
        id: "PJR-AB12",
        status: "open",
        type: "todo",
        title: "計画を作る",
        description: "計画作成",
        priority: "medium",
        owner: "PM",
        registeredAt: "2026-10-28T00:00:00Z",
        due: "-",
        completedAt: "-",
        conclusion: "-",
        ticket: "[ticket](./pjr-ab12-planning.md)",
        approach,
        targets: [approach === "catalog-planning" ? "domain:project-definition" : "track:demo"],
      };
      const { planPath } = await generateRegisterPlan({
        executionPath: join(root, "execution"),
        projectId: "prj-0001",
        catalogPath,
        registerPaths: paths,
        item,
        stem: approach,
      });
      const content = readFileSync(planPath, "utf8");
      const validatePlan = buildValidator(
        join(sourceRoot, "docs/specdojo/schemas/v1/exec-plan-frontmatter.schema.yaml"),
      );
      expect(
        validatePlan({ specdojo: readSpecdojoNamespace(content) }),
        formatErrors(validatePlan.errors),
      ).toBe(true);
      expect(parsePlanTaskIdentity(content)).toMatchObject({
        approach,
        origin: "register",
        targets: item.targets,
      });
      expect(content).toContain("prj-0001:dct-existing");
      expect(content).toContain("業務責任者へ確認した根拠を記録する");
      expect(content).not.toMatch(/_COMMON_CONVENTIONS_|_TASK_ID_/);
      if (approach === "catalog-planning") {
        expect(content).toContain("dct-rulebook.md");
        expect(content).toContain("dct-project-definition-template.yaml");
        expect(content).toContain("catalog plan scaffold");
        expect(content).toContain("--from <agent-output>.yaml");
        expect(content).toContain("--plan`");
        expect(content).toContain(
          "docs/ja/projects/prj-0001/catalog/plans/dct-plan-project-definition.yaml",
        );
      } else {
        expect(content).toContain("sch-rulebook.md");
        expect(content).toContain("scope.catalogs");
        expect(content).toContain("approach_rules");
        expect(content).toContain("schedule strategy generate --project prj-0001 --track demo");
        expect(content).toContain("schedule build --project prj-0001 --track demo");
      }
    },
  );
  it("schedule から planning approach を実行できない", async () => {
    await expect(
      generateSinglePlan({
        executionPath: join(root, "execution"),
        projectId: "prj-0001",
        catalogPath: "",
        task: {
          id: "T-DEMO",
          name: "demo",
          approach: "catalog-planning",
          schedule_file: "",
          fifo_rank: 0,
          critical_first_rank: 0,
        },
      }),
    ).rejects.toThrow("register-only");
  });
});
