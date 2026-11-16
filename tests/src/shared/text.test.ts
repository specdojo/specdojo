import { describe, expect, it } from "vitest";
import { redactSensitiveText } from "../../../src/shared/text.js";
import { sensitiveTextCases } from "../../fixtures/sensitive-text.js";

// Check exact output so even a surviving suffix or a second occurrence is a failure.
describe("redactSensitiveText", () => {
  it.each(sensitiveTextCases)(
    "removes the entire $kind value at every occurrence",
    ({ secret }) => {
      const result = redactSensitiveText(`before ${secret}\nafter ${secret}`);
      expect(result).toBe("before [REDACTED]\nafter [REDACTED]");
      expect(result).not.toContain(secret);
      expect(redactSensitiveText(result)).toBe(result);
    },
  );

  it.each([
    "PRIVATE KEY",
    "RSA PRIVATE KEY",
    "EC PRIVATE KEY",
    "OPENSSH PRIVATE KEY",
    "ENCRYPTED PRIVATE KEY",
  ])("removes the complete %s PEM block, including serialized newlines", (label) => {
    for (const newline of ["\n", "\r\n", "\\n"]) {
      const secret = `-----BEGIN ${label}-----${newline}synthetic-body${newline}-----END ${label}-----`;
      expect(redactSensitiveText(`before\n${secret}\nafter`)).toBe("before\n[REDACTED]\nafter");
    }
  });

  it.each([
    [
      "https://synthetic-user:synthetic-pass@example.invalid/path?q=1",
      "https://[REDACTED]@example.invalid/path?q=1",
    ],
    ["postgres://user:p%40ss@example.invalid/db", "postgres://[REDACTED]@example.invalid/db"],
    ["ssh://user@example.invalid/repo", "ssh://[REDACTED]@example.invalid/repo"],
    ["Bearer abc.def-ghi", "Bearer [REDACTED]"],
    ["api_key=synthetic-value; done", "api_key=[REDACTED]; done"],
    ["access-token: synthetic-value", "access-token: [REDACTED]"],
    ['{"password":"synthetic value with spaces","ok":true}', '{"password":"[REDACTED]","ok":true}'],
    ["passwd='synthetic value'", "passwd='[REDACTED]'"],
    ['secret="synthetic \\"quoted\\" value"', 'secret="[REDACTED]"'],
    ["Authorization: Bearer abc.def.ghi", "Authorization: [REDACTED]"],
  ])("redacts %s", (input, expected) => {
    expect(redactSensitiveText(input)).toBe(expected);
    expect(redactSensitiveText(expected)).toBe(expected);
  });

  it.each([
    "task-judgement risk-assessment mask-test sk-short",
    "https://example.invalid/path?q=ordinary#section",
    "mailto:team@example.invalid",
    "AKIA" + "A".repeat(15),
    "AKIA" + "A".repeat(17),
    "AIza" + "A".repeat(34),
    "AIza" + "A".repeat(36),
    "prefixAKIA" + "A".repeat(16),
    "-----BEGIN PUBLIC KEY-----\npublic-body\n-----END PUBLIC KEY-----",
    "password=[REDACTED] api_key=[REDACTED]",
  ])("keeps non-secrets and already redacted text: %s", (input) => {
    expect(redactSensitiveText(input)).toBe(input);
  });
});
