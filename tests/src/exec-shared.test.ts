import { describe, expect, it } from "vitest";
import {
  collectRepeatable,
  formatDays,
  isUtcIsoSeconds,
  parseKeyValuePairs,
  requireNonEmpty,
  safeSlug,
  tsForFilenameUtc,
} from "../../src/exec-shared.js";

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
