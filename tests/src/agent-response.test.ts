import { describe, expect, it } from "vitest";

import { extractJsonText } from "../../src/agent-response.js";

describe("extractJsonText", () => {
  it("returns the input unchanged when the response is bare JSON", () => {
    const raw = '{"rubric":"grade-rubric-v1"}';

    expect(extractJsonText(raw)).toBe('{"rubric":"grade-rubric-v1"}');
  });

  it("unwraps a json code fence", () => {
    const raw = '```json\n{"rubric":"grade-rubric-v1"}\n```';

    expect(extractJsonText(raw)).toBe('{"rubric":"grade-rubric-v1"}');
  });

  it("unwraps a code fence without a language identifier", () => {
    const raw = '```\n{"verdict":"pass"}\n```';

    expect(extractJsonText(raw)).toBe('{"verdict":"pass"}');
  });

  it("drops a prose preamble that precedes the JSON", () => {
    const raw = '評価対象と参考資料を全文読み込みます。\n{"verdict":"needs-work"}';

    expect(extractJsonText(raw)).toBe('{"verdict":"needs-work"}');
  });

  it("drops text that follows the JSON", () => {
    const raw = '{"verdict":"fail"}\n\n以上が判定結果です。';

    expect(extractJsonText(raw)).toBe('{"verdict":"fail"}');
  });

  it("keeps nested objects intact when the response is surrounded by prose", () => {
    const raw = 'まず読みます。\n{"a":{"b":1},"c":2}\n完了しました。';

    expect(JSON.parse(extractJsonText(raw))).toEqual({ a: { b: 1 }, c: 2 });
  });

  it("returns the trimmed input when no object delimiters are present", () => {
    const raw = "  判定できませんでした  ";

    expect(extractJsonText(raw)).toBe("判定できませんでした");
  });

  it("leaves invalid JSON for the caller to reject", () => {
    const raw = "前置き {not json} 後書き";

    expect(() => JSON.parse(extractJsonText(raw))).toThrow();
  });
});
