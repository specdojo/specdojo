import { defineConfig } from "vitest/config";
import { TEST_GIT_ENVIRONMENT, TEST_GIT_SETUP_FILE } from "./tests/helpers/git-environment.js";

// PJR-50RQ: 実際の文書（docs/ja/specdojo/**・docs/specdojo/**）を読むテストだけを流す。
// 文書のパスを fixture の文字列として持つだけのテストは含めない。unit と integration の両方から選ぶ。
export default defineConfig({
  test: {
    ...(process.env.SPECDOJO_PARENT_VALIDATION_METRICS === "1"
      ? { reporters: ["default", "./tests/helpers/parent-validation-reporter.ts"] }
      : {}),
    environment: "node",
    env: TEST_GIT_ENVIRONMENT,
    setupFiles: [TEST_GIT_SETUP_FILE],
    include: [
      "tests/docs/specdojo/schemas/*.test.ts",
      "tests/packages/docs-lint/deliverable-type.test.ts",
      "tests/packages/docs-lint/rulebook-schema-enums.test.ts",
      "tests/packages/docs-lint/yaml-deliverable-type.test.ts",
      "tests/packages/docs-site/kata-staging.test.ts",
      "tests/src/catalog/index.test.ts",
      "tests/src/docs/template-resolution.test.ts",
      "tests/src/exec/plans.test.ts",
      "tests/src/exec/plan-conventions.test.ts",
      "tests/src/exec/register-plan-escape.test.ts",
      "tests/src/exec/run-records.test.ts",
      "tests/src/grade/grade.test.ts",
      "tests/src/kata/command.test.ts",
      "tests/src/register/item.test.ts",
    ],
    testTimeout: 30000,
  },
});
