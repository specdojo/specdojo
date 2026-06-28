import { beforeEach, describe, expect, it, vi } from "vitest";

const { config } = vi.hoisted(() => ({ config: vi.fn() }));

vi.mock("dotenv", () => ({
  default: { config },
}));

import { loadEnv } from "../../src/specdojo-config.js";

describe("loadEnv", () => {
  beforeEach(() => {
    config.mockClear();
  });

  it("dotenv の案内ログを出さずに設定を読み込む", () => {
    loadEnv();

    expect(config).toHaveBeenCalledWith(
      expect.objectContaining({
        path: expect.stringMatching(/\.env$/),
        quiet: true,
      }),
    );
  });
});
