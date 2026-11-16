import path from "node:path";
import { pathToFileURL } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";
import { redactSensitiveText, SENSITIVE_TEXT_RULES } from "../../src/shared/text.js";
import { sensitiveTextCases } from "../fixtures/sensitive-text.js";

type Finding = { line: number; kind: string };
let scannerRules: typeof SENSITIVE_TEXT_RULES;
let findSensitiveText: (text: string) => Finding[];

beforeAll(async () => {
  const scanner = (await import(
    pathToFileURL(path.resolve("tools/check-evidence-secrets.mjs")).href
  )) as {
    SENSITIVE_TEXT_RULES: typeof SENSITIVE_TEXT_RULES;
    findSensitiveText: typeof findSensitiveText;
  };
  scannerRules = scanner.SENSITIVE_TEXT_RULES;
  findSensitiveText = scanner.findSensitiveText;
});

describe("evidence secret patterns", () => {
  it("keeps kinds, ordered regex sources/flags and replacements equal to the runtime redactor", () => {
    const serialize = (rules: typeof SENSITIVE_TEXT_RULES) =>
      rules.map(({ kind, pattern, replacement }) => ({
        kind,
        source: pattern.source,
        flags: pattern.flags,
        replacement,
      }));
    expect(serialize(scannerRules)).toEqual(serialize(SENSITIVE_TEXT_RULES));
  });

  it.each(sensitiveTextCases)("reports only line and kind for $kind", ({ kind, secret }) => {
    const text = `safe\r\n${secret}\n${secret}`;
    expect(findSensitiveText(text)).toContainEqual({ line: 2, kind });
    expect(findSensitiveText(text)).toContainEqual({ line: 3, kind });
    expect(JSON.stringify(findSensitiveText(text))).not.toContain(secret);
    expect(findSensitiveText(redactSensitiveText(text))).toEqual([]);
  });

  it.each([
    ["Bearer synthetic-token", "bearer-token"],
    ["https://user:pass@example.invalid/path", "url-credentials"],
    ["password=synthetic-value", "credential-assignment"],
    ['{"secret":"synthetic value"}', "quoted-credential"],
    ["-----BEGIN PRIVATE KEY-----\nsynthetic-body\n-----END PRIVATE KEY-----", "private-key"],
  ])("detects %s and accepts its redacted form", (text, kind) => {
    expect(findSensitiveText(`safe\n${text}`)).toContainEqual({ line: 2, kind });
    expect(findSensitiveText(redactSensitiveText(text))).toEqual([]);
  });

  it("preserves original line numbers after a multiline key and handles repeated calls", () => {
    const text =
      "-----BEGIN PRIVATE KEY-----\nbody\n-----END PRIVATE KEY-----\npassword=synthetic-value";
    const expected = [
      { line: 1, kind: "private-key" },
      { line: 4, kind: "credential-assignment" },
    ];
    expect(findSensitiveText(text)).toEqual(expected);
    expect(findSensitiveText(text)).toEqual(expected);
  });

  it("ignores ordinary prose, URLs and all redacted credential forms", () => {
    expect(
      findSensitiveText(
        "task-judgement risk-assessment https://example.invalid/\n" +
          'password=[REDACTED] api_key="[REDACTED]" https://[REDACTED]@example.invalid/ Bearer [REDACTED]',
      ),
    ).toEqual([]);
  });
});
