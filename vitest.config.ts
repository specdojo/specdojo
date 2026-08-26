import { defineConfig } from "vitest/config";
import { TEST_GIT_ENVIRONMENT } from "./tests/helpers/git-environment.js";

export default defineConfig({
  test: {
    environment: "node",
    env: TEST_GIT_ENVIRONMENT,
    include: ["tests/**/*.test.ts"],
  },
});
