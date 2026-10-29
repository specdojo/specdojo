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

const ticket = "# PJR-AB12 入力\n\n## 1. 概要\n\n説明\n\n## 2. 完了条件\n\n- 確認する\n";

describe("register input", () => {
  it("既存の個票へ節を追加し、複数行と Markdown を保持して読み書きする", () => {
    expect(readRegisterInput(ticket)).toBeUndefined();
    const inputs = ["対象は `api_version`\n調査を任せる", "参照は [[test:source]]"];
    const written = setRegisterInput(ticket, inputs);
    expect(written).toContain(ticket.trimEnd());
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
