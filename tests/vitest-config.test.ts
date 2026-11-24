import { afterEach, describe, expect, it, vi } from "vitest";
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

  async function loadConfigWithMaxWorkers(value: string) {
    // 設定は読み込みのときに VITEST_MAX_WORKERS を読むため、値を決めてから読み込み直す。
    vi.stubEnv("VITEST_MAX_WORKERS", value);
    vi.resetModules();
    return (await import("../vitest.config.js")).default;
  }

  it("runs unit and integration projects with two workers by default", async () => {
    const config = await loadConfigWithMaxWorkers("");

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

  it("uses VITEST_MAX_WORKERS for both projects when it is set", async () => {
    const config = await loadConfigWithMaxWorkers("4");

    expect(config).toMatchObject({
      test: {
        projects: [{ test: { maxWorkers: 4 } }, { test: { maxWorkers: 4 } }],
      },
    });
  });

  it("rejects a VITEST_MAX_WORKERS that is not a positive integer", async () => {
    await expect(loadConfigWithMaxWorkers("0")).rejects.toThrow(
      /VITEST_MAX_WORKERS must be a positive integer: 0/,
    );
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
