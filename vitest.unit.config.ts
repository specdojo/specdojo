import { defineConfig } from "vitest/config";
import { TEST_GIT_ENVIRONMENT, TEST_GIT_SETUP_FILE } from "./tests/helpers/git-environment.js";

export default defineConfig({
  test: {
    environment: "node",
    env: TEST_GIT_ENVIRONMENT,
    setupFiles: [TEST_GIT_SETUP_FILE],
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/**/*.integration.test.ts"],
    // Docker Desktop 上でCPU数相当のforkを同時生成し、ホストを圧迫しないよう上限を固定する。
    maxWorkers: 2,
    // agent を並べて流す run の親の検証では負荷が高く、既定の 5 秒で時間切れになる。15 秒に延ばす（PJR-T01P で根本を直すまでのつなぎ）。
    testTimeout: 15000,
  },
});
