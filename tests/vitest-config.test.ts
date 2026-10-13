import { describe, expect, it } from "vitest";
import config from "../vitest.config.js";
import integrationConfig from "../vitest.integration.config.js";

describe("vitest config", () => {
  it("runs unit and integration projects with at most two workers", () => {
    expect(config).toMatchObject({
      test: {
        projects: [
          {
            extends: "./vitest.unit.config.ts",
            test: { name: "unit", maxWorkers: 2 },
          },
          {
            extends: "./vitest.integration.config.ts",
            test: { name: "integration", maxWorkers: 2 },
          },
        ],
      },
    });
  });

  it("keeps the integration test timeout at 30 seconds", () => {
    expect(integrationConfig).toMatchObject({
      test: {
        include: ["tests/**/*.integration.test.ts"],
        testTimeout: 30000,
      },
    });
  });
});
