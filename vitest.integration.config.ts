import { defineConfig } from "vitest/config";
import { TEST_GIT_ENVIRONMENT, TEST_GIT_SETUP_FILE } from "./tests/helpers/git-environment.js";

export default defineConfig({
  test: {
    environment: "node",
    env: TEST_GIT_ENVIRONMENT,
    setupFiles: [TEST_GIT_SETUP_FILE],
    include: ["tests/**/*.integration.test.ts"],
  },
});
