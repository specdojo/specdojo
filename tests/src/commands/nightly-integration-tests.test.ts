import { describe, expect, it } from "vitest";
import {
  integrationTestArgs,
  parseVitestJsonReport,
  renderNightlyIntegrationReport,
} from "../../../src/commands/nightly-integration-tests.js";

const report = JSON.stringify({
  testResults: [
    {
      name: "/repo/tests/a.integration.test.ts",
      status: "failed",
      assertionResults: [
        { status: "passed", fullName: "a ok" },
        {
          status: "failed",
          fullName: "a breaks | pipe",
          failureMessages: ["Error: expected 1\n  to be 2"],
        },
        { status: "pending", fullName: "a skipped" },
      ],
    },
    { name: "/repo/tests/b.integration.test.ts", status: "failed", assertionResults: [] },
  ],
});

describe("integrationTestArgs", () => {
  it("runs the full suite with a JSON report file", () => {
    expect(integrationTestArgs("/tmp/r.json")).toEqual([
      "run",
      "test:integration",
      "--",
      "--reporter=default",
      "--reporter=json",
      "--outputFile.json=/tmp/r.json",
    ]);
  });
});

describe("parseVitestJsonReport", () => {
  it("counts results and lists failed tests with relative file names", () => {
    const actual = parseVitestJsonReport(report, "/repo");

    expect(actual).toMatchObject({ total: 4, passed: 1, failed: 2, skipped: 1 });
    expect(actual.failures[0]).toEqual({
      file: "tests/a.integration.test.ts",
      name: "a breaks | pipe",
      message: "Error: expected 1 / to be 2",
    });
    expect(actual.failures[1]?.name).toBe("(test file failed to run)");
  });

  it("rejects input that is not a Vitest report", () => {
    expect(() => parseVitestJsonReport("{}")).toThrow(/no testResults/);
  });
});

describe("renderNightlyIntegrationReport", () => {
  const base = {
    projectId: "prj-0001",
    startedAt: "2026-11-24T04:00:00.123Z",
    completedAt: "2026-11-24T04:20:00.000Z",
  };

  it("lists failures in an escaped table", () => {
    const actual = renderNightlyIntegrationReport({
      ...base,
      exitCode: 1,
      summary: parseVitestJsonReport(report, "/repo"),
    });

    expect(actual).toContain("結果: failure");
    expect(actual).toContain("| `tests/a.integration.test.ts` | a breaks \\| pipe |");
  });

  it("reports success without a failure section", () => {
    const actual = renderNightlyIntegrationReport({
      ...base,
      exitCode: 0,
      summary: { total: 2, passed: 2, failed: 0, skipped: 0, failures: [] },
    });

    expect(actual).toContain("全件成功した");
    expect(actual).not.toContain("失敗したテスト");
  });

  it("keeps the output tail when no report was produced", () => {
    const actual = renderNightlyIntegrationReport({
      ...base,
      exitCode: 1,
      outputTail: "boom happened",
    });

    expect(actual).toContain("取得できなかった");
    expect(actual).toContain("boom happened");
  });
});
