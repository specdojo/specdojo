import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/**/*.integration.test.ts"],
    // Docker Desktop 上でCPU数相当のforkを同時生成し、ホストを圧迫しないよう上限を固定する。
    maxWorkers: 2,
  },
});
