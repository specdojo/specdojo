// Deliberately synthetic values; assemble provider prefixes to avoid storing plausible live keys.
export const sensitiveTextCases = [
  ...["AKIA", "ASIA"].map((prefix) => ({
    kind: "aws-access-key",
    secret: prefix + "A".repeat(16),
  })),
  { kind: "google-api-key", secret: "AIza" + "A".repeat(34) + "-" },
  ...["b", "p", "a", "r", "s", "c"].map((type) => ({
    kind: "slack-token",
    secret: `xox${type}-` + "1234567890-".repeat(3),
  })),
  { kind: "github-fine-grained-token", secret: "github_pat_" + "A".repeat(82) },
  { kind: "anthropic-api-key", secret: "sk-ant-api03-" + "A".repeat(80) + "-" },
  { kind: "api-token", secret: "sk-" + "A".repeat(24) },
  { kind: "api-token", secret: "sk-proj-" + "A".repeat(24) },
  ...["o", "p", "r", "s", "u"].map((type) => ({
    kind: "api-token",
    secret: `gh${type}_` + "A".repeat(36),
  })),
  { kind: "jwt", secret: ["eyJ" + "A".repeat(20), "B".repeat(24), "C".repeat(24) + "-"].join(".") },
];
