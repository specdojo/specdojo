import { defineConfig } from "vitest/config";
import { TEST_GIT_ENVIRONMENT, TEST_GIT_SETUP_FILE } from "./tests/helpers/git-environment.js";

export default defineConfig({
  test: {
    environment: "node",
    env: TEST_GIT_ENVIRONMENT,
    setupFiles: [TEST_GIT_SETUP_FILE],
    include: ["tests/**/*.integration.test.ts"],
    // 実 Git と子プロセスを使うため、exec run の並行実行中に親検証として走ると既定の 5 秒を超える。
    testTimeout: 30000,
  },
});
