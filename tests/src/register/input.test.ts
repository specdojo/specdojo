import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  normalizeRegisterInput,
  readRegisterInput,
  setRegisterInput,
} from "../../../src/register/input.js";
import { readRegisterItemContent } from "../../../src/register/item.js";
import {
  appendRegisterEvent,
  buildRegisterEvent,
  readRegisterEventsFromContent,
} from "../../../src/register/events.js";
import { buildValidator } from "../../helpers/schema.js";
import { resolveSpecdojoTemplatePath } from "../../../src/docs/template-resolution.js";

const ticket = "# PJR-AB12 入力\n\n## 1. 概要\n\n説明\n\n## 2. 完了条件\n\n- 確認する\n";

describe("register input", () => {
  it("既存の個票へ節を追加し、複数行と Markdown を保持して読み書きする", () => {
    expect(readRegisterInput(ticket)).toBeUndefined();
    const inputs = ["対象は `api_version`\n調査を任せる", "参照は [[test:source]]"];
    const written = setRegisterInput(ticket, inputs);
    expect(written).toContain(
      "## 1. 概要\n\n説明\n\n## 2. 入力\n\n- 対象は `api_version`\n  調査を任せる\n- 参照は [[test:source]]\n\n## 3. 完了条件\n\n- 確認する",
    );
    expect(readRegisterInput(written)).toEqual(inputs);
    expect(readRegisterItemContent(written, "pjr-ab12-topic.md")?.item.inputs).toEqual(inputs);
    expect(setRegisterInput(written, inputs)).toBe(written);
    expect(readRegisterInput(setRegisterInput(written, []))).toBeUndefined();
  });

  it("番号付きの節を置換し、次節・コード中の見出しを保持する", () => {
    const before = `${ticket}\n\`\`\`md\n## 入力\n- 誤認しない\n\`\`\`\n\n## 3. 入力\n\n- 古い前提\n\n## 4. 対応結果\n\n結果\n`;
    const written = setRegisterInput(before, ["新しい前提"]);
    expect(readRegisterInput(written)).toEqual(["新しい前提"]);
    expect(written).toContain("## 4. 対応結果\n\n結果\n");
    expect(written).toContain("## 入力\n- 誤認しない");
  });

  it("番号のない ## 入力 が既にある個票へ追記したとき、番号付きの章に直して第1章直後へ移動する", () => {
    const unnumbered =
      "# PJR-TEST テスト\n\n## 1. 背景\n\n背景説明\n\n## 2. 検討した選択肢\n\n選択肢\n\n## 入力\n\n- 古い前提\n";
    expect(readRegisterInput(unnumbered)).toEqual(["古い前提"]);
    const written = setRegisterInput(unnumbered, ["新しい前提"]);
    expect(readRegisterInput(written)).toEqual(["新しい前提"]);
    expect(written).toContain(
      "## 1. 背景\n\n背景説明\n\n## 2. 入力\n\n- 新しい前提\n\n## 3. 検討した選択肢\n\n選択肢\n",
    );
    expect(written).not.toMatch(/## 入力\s*$/);
  });

  it("サブ見出し（H3）がある場合も親章の番号繰り下げに追従し、コードブロック内は変更しない", () => {
    const ticketWithH3 =
      "# PJR-H3TEST テスト\n\n## 1. 背景\n\n背景\n\n## 2. 検討した選択肢\n\n```md\n## 2. コード内見出し\n### 2.1. コード内節\n```\n\n### 2.1. 案A\n\n内容A\n\n### 2.2. 案B\n\n内容B\n\n## 3. 決定内容\n\n決定\n";
    const written = setRegisterInput(ticketWithH3, ["前提条件"]);
    expect(written).toContain("## 2. 入力\n\n- 前提条件\n\n## 3. 検討した選択肢");
    expect(written).toContain("```md\n## 2. コード内見出し\n### 2.1. コード内節\n```");
    expect(written).toContain("### 3.1. 案A\n\n内容A\n\n### 3.2. 案B\n\n内容B");
    expect(written).toContain("## 4. 決定内容\n\n決定");
  });

  it.each([
    ["issue", true],
    ["decision", false],
    ["todo", true],
    ["question", true],
    ["risk", true],
    ["change-request", true],
    ["note", false],
    ["epic", false],
  ] as const)("%s の雛形の入力章を確認し、追加・更新・削除する", (itemType, hasInput) => {
    const template = readFileSync(
      resolveSpecdojoTemplatePath(`pjr-${itemType}-template.md`),
      "utf-8",
    );
    expect(/^## 2\. 入力$/m.test(template)).toBe(hasInput);
    const headings = (content: string) => content.match(/^## .+$/gm) ?? [];
    const original = headings(template);
    const expected = hasInput
      ? original
      : [
          original[0],
          "## 2. 入力",
          ...original
            .slice(1)
            .map((heading) =>
              heading.replace(
                /^(## )(\d+)/,
                (_, prefix: string, number: string) => `${prefix}${Number(number) + 1}`,
              ),
            ),
        ];
    const updated = setRegisterInput(template, ["テスト入力"]);
    expect(readRegisterInput(updated)).toEqual(["テスト入力"]);
    expect(headings(updated)).toEqual(expected);
    expect(updated.split("# _PJR-XXXX_")[0]).toBe(template.split("# _PJR-XXXX_")[0]);
    expect(setRegisterInput(updated, ["テスト入力"])).toBe(updated);

    for (const before of [template, updated]) {
      const cleared = setRegisterInput(before, []);
      expect(readRegisterInput(cleared)).toBeUndefined();
      expect(cleared).toMatch(/^## 2\. 入力\n\n-\n\n## 3\./m);
      expect(headings(cleared)).toEqual(expected);
    }
  });

  it("途中の番号なし入力章を移動し、前後の本文と引用内の見出しを保持する", () => {
    const before =
      "# PJR-TEST\n\n## 1. 背景\n\n背景\n\n> ## 入力\n> - 引用\n\n## 入力\n\n- 古い前提\n\n## 2. 結論\n\n背景の章を参照する。\n";
    const written = setRegisterInput(before, ["新しい前提"]);
    expect(written).toBe(
      "# PJR-TEST\n\n## 1. 背景\n\n背景\n\n> ## 入力\n> - 引用\n\n## 2. 入力\n\n- 新しい前提\n\n## 3. 結論\n\n背景の章を参照する。\n",
    );
    expect(setRegisterInput(before, [])).toContain("## 2. 入力\n\n-\n\n## 3. 結論");
  });

  it.each([
    ["# PJR-TEST\n", 1],
    ["# PJR-TEST\n\n## 1. 背景\n\n背景\n", 2],
  ])("後続の章がない場合も連番の入力章を追加する: %s", (before, number) => {
    const written = setRegisterInput(before, ["前提"]);
    expect(written).toBe(`${before.trimEnd()}\n\n## ${number}. 入力\n\n- 前提\n`);
    expect(setRegisterInput(written, ["前提"])).toBe(written);
  });

  it("未指定・全削除・空文字と削除の混在を区別する", () => {
    expect(normalizeRegisterInput(undefined, true)).toBeUndefined();
    expect(normalizeRegisterInput(["-"], true)).toEqual([]);
    expect(normalizeRegisterInput(["  前提  "])).toEqual(["前提"]);
    expect(() => normalizeRegisterInput(["-"])).toThrow(/only valid/);
    expect(() => normalizeRegisterInput(["-", "前提"], true)).toThrow(/cannot be combined/);
    expect(() => normalizeRegisterInput(["  "], true)).toThrow(/non-empty/);
  });

  it("入力のみの変更と削除を event の JSON 配列で往復し、同じ値では追加しない", () => {
    const after = setRegisterInput(ticket, ["前提一", "前提二"]);
    const build = (beforeContent: string, afterContent: string) =>
      buildRegisterEvent({
        beforeContent,
        afterContent,
        filename: "pjr-ab12-topic.md",
        timeZone: "UTC",
        action: "update",
        actor: "test",
        reason: "premises updated",
      });
    const event = build(ticket, after)!;
    expect(event.changes).toEqual([{ field: "input", from: "-", to: '["前提一","前提二"]' }]);
    const log = appendRegisterEvent(undefined, event);
    const events = readRegisterEventsFromContent(log, "test");
    expect(events[0]).toEqual(event);
    const validate = buildValidator("docs/specdojo/schemas/v1/register-events.schema.yaml");
    expect(validate(events), JSON.stringify(validate.errors)).toBe(true);
    expect(build(after, after)).toBeUndefined();
    expect(build(after, setRegisterInput(after, []))?.changes).toEqual([
      { field: "input", from: '["前提一","前提二"]', to: "-" },
    ]);
  });
});
