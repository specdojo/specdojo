import { describe, expect, it } from "vitest";
import {
  collectRepeatable,
  formatDays,
  isUtcIsoSeconds,
  parseKeyValuePairs,
  requireNonEmpty,
  safeSlug,
  stripTerminalControlSequences,
  tsForFilenameUtc,
} from "../../src/exec-shared.js";

// ESC(0x1B) を String.fromCharCode で構築し、ソースへ生の制御文字を混入させない。
const ESC = String.fromCharCode(0x1b);

describe("isUtcIsoSeconds", () => {
  it("正しい UTC ISO 秒形式を受け入れる", () => {
    expect(isUtcIsoSeconds("2024-01-15T12:34:56Z")).toBe(true);
  });
  it("ミリ秒付きは拒否する", () => {
    expect(isUtcIsoSeconds("2024-01-15T12:34:56.789Z")).toBe(false);
  });
  it("空文字は拒否する", () => {
    expect(isUtcIsoSeconds("")).toBe(false);
  });
});

describe("tsForFilenameUtc", () => {
  it("ISO 文字列をファイル名用に変換する", () => {
    expect(tsForFilenameUtc("2024-01-15T12:34:56Z")).toBe("20240115T123456Z");
  });
});

describe("safeSlug", () => {
  it("スペースをハイフンに変換する", () => {
    expect(safeSlug("hello world")).toBe("hello-world");
  });
  it("使用不可文字をアンダースコアに変換する", () => {
    expect(safeSlug("foo/bar@baz")).toBe("foo_bar_baz");
  });
  it("前後の空白をトリムする", () => {
    expect(safeSlug("  hello  ")).toBe("hello");
  });
  it("80 文字に切り詰める", () => {
    expect(safeSlug("a".repeat(100))).toHaveLength(80);
  });
});

describe("requireNonEmpty", () => {
  it("非空文字列をそのまま返す", () => {
    expect(requireNonEmpty("name", "value")).toBe("value");
  });
  it("空文字列でエラーを投げる", () => {
    expect(() => requireNonEmpty("name", "")).toThrow("name is required");
  });
  it("非文字列でエラーを投げる", () => {
    expect(() => requireNonEmpty("name", undefined)).toThrow("name is required");
  });
});

describe("collectRepeatable", () => {
  it("配列に値を追加する", () => {
    expect(collectRepeatable("c", ["a", "b"])).toEqual(["a", "b", "c"]);
  });
});

describe("parseKeyValuePairs", () => {
  it("key=value 形式をオブジェクトに変換する", () => {
    expect(parseKeyValuePairs(["foo=bar", "baz=qux"])).toEqual({ foo: "bar", baz: "qux" });
  });
  it("undefined は undefined を返す", () => {
    expect(parseKeyValuePairs(undefined)).toBeUndefined();
  });
  it("空配列は undefined を返す", () => {
    expect(parseKeyValuePairs([])).toBeUndefined();
  });
});

describe("formatDays", () => {
  it("浮動小数点誤差を含む値を小数点以下2桁に丸める", () => {
    expect(formatDays(6.2509999999999994)).toBe("6.25");
  });
  it("小数点以下3桁目を四捨五入する", () => {
    expect(formatDays(6.3759999999999994)).toBe("6.38");
  });
  it("整数は小数点なしで返す", () => {
    expect(formatDays(0)).toBe("0");
    expect(formatDays(3)).toBe("3");
  });
  it("末尾の 0 を付けない", () => {
    expect(formatDays(1.5)).toBe("1.5");
  });
});

describe("stripTerminalControlSequences", () => {
  it("SGR カラーの ANSI エスケープシーケンスを除去する", () => {
    const colored = `${ESC}[31m${ESC}[1mERROR${ESC}[0m: build failed`;

    expect(stripTerminalControlSequences(colored)).toBe("ERROR: build failed");
  });

  it("lefthook 風のボックス UI（色付き）を可読テキストへ整える", () => {
    const boxed = `${ESC}[90m│${ESC}[0m ${ESC}[31mmarkdownlint${ESC}[0m ${ESC}[90m│${ESC}[0m`;

    expect(stripTerminalControlSequences(boxed)).toBe("│ markdownlint │");
  });

  it("OSC 終端の BEL など制御文字を残さない", () => {
    const bel = String.fromCharCode(0x07);
    const withOsc = `${ESC}]0;title${bel}done`;

    const actual = stripTerminalControlSequences(withOsc);

    // ESC と BEL が除去され、制御文字が 1 つも残らないこと（表・YAML を壊さない）。
    expect([...actual].every((ch) => (ch.codePointAt(0) ?? 0) >= 0x20)).toBe(true);
    expect(actual).toContain("done");
  });

  it("その他の C0/C1 制御文字を除去する", () => {
    const nul = String.fromCharCode(0x00);
    const bs = String.fromCharCode(0x08);

    expect(stripTerminalControlSequences(`a${nul}b${bs}c`)).toBe("abc");
  });

  it("タブ・改行・復帰は保持する（1 行化は呼び出し側に委ねる）", () => {
    expect(stripTerminalControlSequences("a\tb\nc\r\nd")).toBe("a\tb\nc\r\nd");
  });

  it("制御文字を含まない文字列は変更しない", () => {
    expect(stripTerminalControlSequences("plain text")).toBe("plain text");
  });
});
