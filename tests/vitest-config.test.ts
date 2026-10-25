import { afterEach, describe, expect, it, vi } from "vitest";
import config from "../vitest.config.js";
import integrationConfig from "../vitest.integration.config.js";
import unitConfig from "../vitest.unit.config.js";
import { TEST_GIT_SETUP_FILE } from "./helpers/git-environment.js";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("vitest config", () => {
  it.each([
    ["unit", unitConfig],
    ["integration", integrationConfig],
  ] as const)(
    "%s は test module の読み込み前に共通の環境隔離 setup を実行する",
    (_, projectConfig) => {
      expect(projectConfig.test?.setupFiles).toEqual([TEST_GIT_SETUP_FILE]);
    },
  );

  it("共通 setup はシェルから継承した project を除去する", async () => {
    vi.stubEnv("SPECDOJO_PROJECT", "prj-0002");
    vi.resetModules();

    await import("./setup/git-environment.js");

    expect(process.env.SPECDOJO_PROJECT).toBeUndefined();
  });

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
