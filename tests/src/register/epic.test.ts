import { afterEach, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { load } from "js-yaml";
import { buildValidator, formatErrors } from "../../helpers/schema.js";
import { buildRegisterItemContent } from "../../../src/register/core.js";
import { buildRegisterEvent } from "../../../src/register/events.js";
import { readRegisterItemContent, registerItemFieldsFromItem } from "../../../src/register/item.js";
import { validateRegisterEpicDocs } from "../../../src/register/epic.js";
import { generateDerivedViewFiles } from "../../../src/register/views.js";
import type { RegisterAddFields, RegisterPaths } from "../../../src/register/command-types.js";

const fields: RegisterAddFields = {
  type: "epic",
  track: "business",
  title: "業務 | 整備",
  description: "track の目的",
  status: "open",
  priority: "high",
  owner: "_TODO_",
  registeredAt: "2026-10-28T00:00:00Z",
  due: "_TODO_",
  completedAt: "-",
  conclusion: "-",
};

const filename = "pjr-ab12-business.md";
function ticket(overrides: Partial<RegisterAddFields> = {}, displayId = "PJR-AB12"): string {
  return buildRegisterItemContent({
    projectId: "prj-test",
    displayId,
    topic: "business",
    fields: { ...fields, ...overrides },
    templatePath: `docs/ja/specdojo/templates/pjr-${overrides.type ?? "epic"}-template.md`,
  });
}

describe("epic", () => {
  const dirs: string[] = [];
  afterEach(() => dirs.splice(0).forEach((dir) => rmSync(dir, { recursive: true, force: true })));

  it("track を読み書きし、type / track のイベントが schema に適合する", () => {
    const content = ticket();
    const parsed = readRegisterItemContent(content, filename)!;
    expect(parsed.item).toMatchObject({
      type: "epic",
      track: "business",
      title: "業務 \\| 整備",
    });
    expect(content).toContain("# PJR-AB12 業務 | 整備");
    expect(content).not.toContain("_EPIC_TITLE_");
    expect(registerItemFieldsFromItem(parsed.item)).toMatchObject({
      item_type: "epic",
      track: "business",
    });
    const frontmatter = load(content.match(/^---\n([\s\S]*?)\n---/)![1]);
    const validate = buildValidator(
      "docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml",
    );
    expect(validate(frontmatter), formatErrors(validate.errors)).toBe(true);
    const validateDeliverable = buildValidator(
      "docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml",
    );
    expect(validateDeliverable(frontmatter), formatErrors(validateDeliverable.errors)).toBe(true);
    const event = buildRegisterEvent({
      afterContent: content,
      filename,
      timeZone: "UTC",
      action: "add",
      actor: "SpecDojo",
      reason: "created",
    })!;
    expect(event.changes).toEqual(
      expect.arrayContaining([
        { field: "type", from: "", to: "epic" },
        { field: "track", from: "", to: "business" },
      ]),
    );
    const validateEvents = buildValidator("docs/specdojo/schemas/v1/register-events.schema.yaml");
    expect(validateEvents([event]), formatErrors(validateEvents.errors)).toBe(true);
    expect(
      validateEvents([{ ...event, changes: [{ field: "type", from: "epic", to: "unknown" }] }]),
    ).toBe(false);
  });

  it("epic の track を必須とし、ほかの type の track を許容しない", () => {
    const validate = buildValidator(
      "docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml",
    );
    const data = load(ticket().match(/^---\n([\s\S]*?)\n---/)![1]) as {
      specdojo: Record<string, unknown>;
    };
    delete data.specdojo.track;
    expect(validate(data)).toBe(false);
    data.specdojo.track = "Not Valid";
    expect(validate(data)).toBe(false);
    data.specdojo.track = "business";
    data.specdojo.item_type = "todo";
    expect(validate(data)).toBe(false);
  });

  it("start_on は epic の任意の暦日として読み書きと履歴を保持する", () => {
    const content = ticket({ startOn: "2026-02-28" });
    const parsed = readRegisterItemContent(content, filename)!;
    expect(parsed.item.startOn).toBe("2026-02-28");
    expect(registerItemFieldsFromItem(parsed.item).start_on).toBe("2026-02-28");
    const data = load(content.match(/^---\n([\s\S]*?)\n---/)![1]) as {
      specdojo: Record<string, unknown>;
    };
    const validate = buildValidator(
      "docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml",
    );
    expect(validate(data), formatErrors(validate.errors)).toBe(true);
    const validateDeliverable = buildValidator(
      "docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml",
    );
    expect(validateDeliverable(data), formatErrors(validateDeliverable.errors)).toBe(true);
    for (const value of [null, "-", "2026-02-30", "2026-2-28", "2026-02-28T00:00:00Z"]) {
      data.specdojo.start_on = value;
      expect(validate(data), String(value)).toBe(false);
    }
    for (const type of [
      "todo",
      "question",
      "risk",
      "issue",
      "change-request",
      "decision",
      "note",
    ]) {
      data.specdojo.item_type = type;
      data.specdojo.start_on = "2026-02-28";
      delete data.specdojo.track;
      expect(validate(data), type).toBe(false);
    }
    const event = buildRegisterEvent({
      afterContent: content,
      filename,
      timeZone: "Asia/Tokyo",
      action: "add",
      actor: "SpecDojo",
      reason: "planned",
    })!;
    expect(event.changes).toContainEqual({ field: "start_on", from: "", to: "2026-02-28" });
    const validateEvents = buildValidator("docs/specdojo/schemas/v1/register-events.schema.yaml");
    expect(validateEvents([event]), formatErrors(validateEvents.errors)).toBe(true);
  });

  it("domains は epic の文字列配列だけを許可し、読み書きと履歴を保持する", () => {
    const validate = buildValidator(
      "docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml",
    );
    const content = ticket({ domains: ["business", "data-flow"] });
    const data = load(content.match(/^---\n([\s\S]*?)\n---/)![1]) as {
      specdojo: Record<string, unknown>;
    };
    expect(validate(data), formatErrors(validate.errors)).toBe(true);
    expect(readRegisterItemContent(content, filename)!.item.domains).toEqual([
      "business",
      "data-flow",
    ]);
    for (const domains of ["business", [42], [""], ["business", "business"]]) {
      data.specdojo.domains = domains;
      expect(validate(data)).toBe(false);
    }
    data.specdojo.domains = ["business"];
    data.specdojo.item_type = "todo";
    delete data.specdojo.track;
    expect(validate(data)).toBe(false);
    const event = buildRegisterEvent({
      afterContent: content,
      filename,
      timeZone: "UTC",
      action: "add",
      actor: "SpecDojo",
      reason: "domains",
    })!;
    const validateEvents = buildValidator("docs/specdojo/schemas/v1/register-events.schema.yaml");
    expect(validateEvents([event]), formatErrors(validateEvents.errors)).toBe(true);
  });

  it.each(["open", "in-progress", "waiting", "review", "done", "rejected", "deferred"])(
    "epic の %s 状態を schema が受け付ける",
    (status) => {
      const content = ticket({
        status,
        ...(["done", "rejected"].includes(status) ? { completedAt: "2026-10-28T00:00:00Z" } : {}),
      });
      const validate = buildValidator(
        "docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml",
      );
      expect(
        validate(load(content.match(/^---\n([\s\S]*?)\n---/)![1])),
        formatErrors(validate.errors),
      ).toBe(true);
    },
  );

  it("register build の検証が依存循環と track の重複を検出する", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-epic-validation-"));
    dirs.push(root);
    const paths: RegisterPaths = {
      projectId: "prj-test",
      projectRegisterPath: root,
      generatedPath: join(root, "generated"),
      pjrIndexPath: join(root, "pjr-index.md"),
      controlsGeneratedPath: join(root, "controls/generated"),
      registerDateTimeZone: "UTC",
    };
    writeFileSync(join(root, filename), ticket({ dependsOn: ["prj-test:PJR-AB13"] }));
    const second = join(root, "pjr-ab13-business.md");
    writeFileSync(second, ticket({ track: "other", dependsOn: ["PJR-AB12"] }, "PJR-AB13"));
    expect(validateRegisterEpicDocs(paths).join(" ")).toContain("cycle");
    writeFileSync(second, ticket({}, "PJR-AB13"));
    expect(validateRegisterEpicDocs(paths).join(" ")).toContain("Duplicate epic track");
    writeFileSync(second, ticket({ track: "other" }, "PJR-AB13"));
    expect(validateRegisterEpicDocs(paths)).toEqual([]);
    writeFileSync(second, ticket({ track: "other", startOn: "2026-02-30" }, "PJR-AB13"));
    expect(validateRegisterEpicDocs(paths).join(" ")).toContain("Invalid start_on");
    writeFileSync(
      second,
      ticket({ type: "todo", track: undefined, startOn: "2026-02-28" }, "PJR-AB13"),
    );
    expect(validateRegisterEpicDocs(paths).join(" ")).toContain("only valid for epic");
  });

  it("epic ごとに直接の子と状態を表示し、孫・無関係な項目を含めない", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-epic-"));
    dirs.push(root);
    writeFileSync(join(root, filename), ticket());
    writeFileSync(join(root, "pjr-ab13-business.md"), ticket({ title: "子なし" }, "PJR-AB13"));
    writeFileSync(
      join(root, "pjr-cd12-business.md"),
      ticket(
        {
          type: "todo",
          track: undefined,
          title: "子 todo",
          derivedFrom: ["prj-test:PJR-AB12"],
          status: "review",
        },
        "PJR-CD12",
      ),
    );
    writeFileSync(
      join(root, "pjr-cd13-business.md"),
      ticket(
        {
          type: "question",
          track: undefined,
          title: "子の確認",
          derivedFrom: ["PJR-AB12"],
          status: "waiting",
        },
        "PJR-CD13",
      ),
    );
    writeFileSync(
      join(root, "pjr-cd14-business.md"),
      ticket(
        { type: "todo", track: undefined, title: "孫", derivedFrom: ["PJR-CD12"] },
        "PJR-CD14",
      ),
    );
    const paths: RegisterPaths = {
      projectId: "prj-test",
      projectRegisterPath: root,
      generatedPath: join(root, "generated"),
      pjrIndexPath: join(root, "pjr-index.md"),
      controlsGeneratedPath: join(root, "controls/generated"),
      registerDateTimeZone: "UTC",
    };
    mkdirSync(paths.generatedPath);
    const view = generateDerivedViewFiles(paths, "register").find((entry) =>
      entry.path.endsWith("pjr-epic-items.md"),
    )!;
    expect(view.content).toContain("track: business / ステータス: open");
    expect(view.content).toContain("| todo | review | 子 todo |");
    expect(view.content).toContain("| question | waiting | 子の確認 |");
    expect(view.content).toContain("../pjr-cd12-business.md");
    expect(view.content).toContain("業務 \\| 整備");
    expect(view.content).toContain("子項目なし");
    expect(view.content).not.toContain("PJR-CD14");
    expect(readFileSync(join(root, filename), "utf8")).toBe(ticket());
  });
});
