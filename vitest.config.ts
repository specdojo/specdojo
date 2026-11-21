import { defineConfig } from "vitest/config";

// 既定は 2。リリースの前の確認などで並列を上げるときだけ VITEST_MAX_WORKERS で変える（PJR-5RAY）。
// 実 Git と worktree を使う統合テストが多く、通常の開発と exec の親の検証では負荷を抑えるため。
function resolveMaxWorkers(value: string | undefined): number {
  if (value === undefined || value === "") return 2;
  if (!/^[1-9][0-9]*$/.test(value)) {
    throw new Error(`VITEST_MAX_WORKERS must be a positive integer: ${value}`);
  }
  return Number(value);
}

const maxWorkers = resolveMaxWorkers(process.env.VITEST_MAX_WORKERS);

export default defineConfig({
  test: {
    projects: [
      {
        extends: "./vitest.unit.config.ts",
        test: {
          name: "unit",
          maxWorkers,
        },
      },
      {
        extends: "./vitest.integration.config.ts",
        test: {
          name: "integration",
          maxWorkers,
        },
      },
    ],
  },
});
