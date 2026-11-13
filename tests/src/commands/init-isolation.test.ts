import { Command } from "commander";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import ts from "typescript";
import { afterEach, describe, expect, it, vi } from "vitest";
import { runInit } from "../../../src/commands/init.js";
import { hasMarkdownlintConfig } from "../../../src/shared/markdownlint-config.js";
import { registerConfigCommands, specdojoRootDir } from "../../../src/shared/specdojo-config.js";

const originalCwd = process.cwd();

afterEach(() => {
  process.chdir(originalCwd);
  vi.restoreAllMocks();
});

describe("init isolation and temporary directory boundary", () => {
  describe("静的検査: init を実行するテストが mkdtemp の一時ディレクトリに閉じていること", () => {
    const targetFiles = [
      "tests/src/commands/init.test.ts",
      "tests/src/commands/init-agent-roster.integration.test.ts",
      "tests/src/shared/lefthook-scaffold.integration.test.ts",
    ];

    it("各テストファイルが mkdtemp / mkdtempSync を使って一時ディレクトリを作成している", () => {
      for (const relPath of targetFiles) {
        const fullPath = resolve(process.cwd(), relPath);
        expect(existsSync(fullPath), `テストファイルが存在すること: ${relPath}`).toBe(true);
        const content = readFileSync(fullPath, "utf8");
        expect(
          content.includes("mkdtemp") || content.includes("mkdtempSync"),
          `${relPath} は mkdtemp または mkdtempSync で一時ディレクトリを作成していること`,
        ).toBe(true);
      }
    });

    it("テストファイル内で tmpdir() そのものや '/tmp' を直接 process.chdir していない", () => {
      for (const relPath of targetFiles) {
        const fullPath = resolve(process.cwd(), relPath);
        const sourceFile = ts.createSourceFile(
          fullPath,
          readFileSync(fullPath, "utf8"),
          ts.ScriptTarget.Latest,
          true,
        );

        function checkNode(node: ts.Node): void {
          if (
            ts.isCallExpression(node) &&
            ts.isPropertyAccessExpression(node.expression) &&
            node.expression.expression.getText(sourceFile) === "process" &&
            node.expression.name.getText(sourceFile) === "chdir"
          ) {
            const [arg] = node.arguments;
            if (arg) {
              const argText = arg.getText(sourceFile);
              // tmpdir() や "/tmp" そのものを引数にしていないこと
              expect(
                argText !== "tmpdir()" && argText !== '"/tmp"' && argText !== "'/tmp'",
                `${relPath} 内の process.chdir(${argText}) は tmpdir 直下そのものであってはならない`,
              ).toBe(true);
            }
          }
          ts.forEachChild(node, checkNode);
        }

        checkNode(sourceFile);
      }
    });
  });

  describe("ランタイム境界保護: 親の /tmp や上位ディレクトリの設定を拾わないこと", () => {
    it("一時ディレクトリ内のリポジトリは親ディレクトリにある .specdojo を拾わず自身をルートとする", () => {
      const parentDir = mkdtempSync(join(tmpdir(), "specdojo-test-parent-"));
      const childRepo = join(parentDir, "child-repo");
      mkdirSync(childRepo);
      mkdirSync(join(childRepo, ".git"));

      mkdirSync(join(parentDir, ".specdojo"));
      writeFileSync(
        join(parentDir, ".specdojo", "specdojo.config.json"),
        JSON.stringify({ version: 1, projects: { leak: {} } }),
        "utf8",
      );

      try {
        const detected = specdojoRootDir(childRepo);
        expect(detected).toBe(resolve(childRepo));
        expect(detected).not.toBe(resolve(parentDir));
      } finally {
        rmSync(parentDir, { recursive: true, force: true });
      }
    });

    it("hasMarkdownlintConfig は一時ディレクトリの親や .git 境界を越えて親の .markdownlintrc を拾わない", () => {
      const parentDir = mkdtempSync(join(tmpdir(), "specdojo-test-mdlint-parent-"));
      const childRepo = join(parentDir, "child-repo");
      mkdirSync(childRepo);
      mkdirSync(join(childRepo, ".git"));

      writeFileSync(join(parentDir, ".markdownlintrc"), "MD013: true\n", "utf8");

      try {
        expect(hasMarkdownlintConfig(childRepo)).toBe(false);
      } finally {
        rmSync(parentDir, { recursive: true, force: true });
      }
    });

    it("tmpdir() 直下で runInit を実行しようとした場合は拒否エラーになる", async () => {
      const original = process.cwd();
      try {
        process.chdir(tmpdir());
        await expect(runInit({ yes: true, provider: "none" })).rejects.toThrow(
          "Refusing to initialize specdojo directly under temporary directory root.",
        );
      } finally {
        process.chdir(original);
      }
    });

    it("tmpdir() 直下で config init を実行しようとした場合は拒否エラーになる", async () => {
      const original = process.cwd();
      const program = new Command();
      program.exitOverride();
      registerConfigCommands(program);

      try {
        process.chdir(tmpdir());
        await expect(program.parseAsync(["config", "init"], { from: "user" })).rejects.toThrow(
          "Refusing to initialize specdojo configuration directly under temporary directory root.",
        );
      } finally {
        process.chdir(original);
      }
    });
  });
});
