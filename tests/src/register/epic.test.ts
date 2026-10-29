import { afterEach, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { load } from "js-yaml";
import { buildValidator, formatErrors } from "../../helpers/schema.js";
import { buildRegisterItemContent } from "../../../src/register/core.js";
import { buildRegisterEvent } from "../../../src/register/events.js";
import { readRegisterItemContent, registerItemFieldsFromItem } from "../../../src/register/item.js";
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
