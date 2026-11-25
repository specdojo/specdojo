import { defineConfig } from "vitest/config";
import { TEST_GIT_ENVIRONMENT, TEST_GIT_SETUP_FILE } from "./tests/helpers/git-environment.js";

// PJR-FNB7: 実 agent（claude CLI）を呼ぶテスト群。時間と費用がかかり結果も毎回同じではないため、
// npm test（unit・integration）には入れず npm run test:agent で任意に流す。
export default defineConfig({
  test: {
    environment: "node",
    env: TEST_GIT_ENVIRONMENT,
    setupFiles: [TEST_GIT_SETUP_FILE],
    include: ["tests/**/*.agent.test.ts"],
    // 同じ claude のログインを使うため、run を順に流す。
    maxWorkers: 1,
    fileParallelism: false,
    testTimeout: 30 * 60 * 1000,
  },
});
