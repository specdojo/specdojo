import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        extends: "./vitest.unit.config.ts",
        test: {
          name: "unit",
          maxWorkers: 2,
        },
      },
      {
        extends: "./vitest.integration.config.ts",
        test: {
          name: "integration",
          maxWorkers: 2,
        },
      },
    ],
  },
});
