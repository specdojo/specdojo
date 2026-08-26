import { defineConfig } from "vitest/config";
import { TEST_GIT_ENVIRONMENT } from "./tests/helpers/git-environment.js";

export default defineConfig({
  test: {
    environment: "node",
    env: TEST_GIT_ENVIRONMENT,
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/**/*.integration.test.ts"],
    // Docker Desktop 上でCPU数相当のforkを同時生成し、ホストを圧迫しないよう上限を固定する。
    maxWorkers: 2,
  },
});
