import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

interface Block {
  file: string;
  line: number;
  type: string;
  code: string;
}
interface ParseResult extends Block {
  status: "passed" | "error" | "unchecked";
  message?: string;
  parserType?: string;
}
interface Parser {
  entry: string;
  version: string;
  config: Record<string, unknown>;
}
interface Tool {
  extractMermaidBlocks: (markdown: string, file: string) => Block[];
  resolveMermaid: () => Parser;
  checkMermaidBlocks: (blocks: Block[], parser: Parser) => Promise<ParseResult[]>;
  lintMermaid: (
    patterns: string[],
    options?: {
      cwd?: string;
      stdout?: (message: string) => void;
      stderr?: (message: string) => void;
      resolveParser?: () => Parser;
      checkBlocks?: (blocks: Block[], parser: Parser) => Promise<ParseResult[]>;
    },
  ) => Promise<number>;
}

const examples = [
  { type: "flowchart", valid: "flowchart TD\nA[日本語] --> B", invalid: "flowchart TD\nA --> [" },
  { type: "graph", valid: "graph LR\nA --> B", invalid: "graph TD\nA --> [" },
  {
    type: "stateDiagram-v2",
    valid: "stateDiagram-v2\n[*] --> A",
    invalid: "stateDiagram-v2\nstate A {",
  },
  {
    type: "classDiagram",
    valid: "classDiagram\nclass A {\n+String name\n}",
    invalid: "classDiagram\nclass A {",
  },
  { type: "erDiagram", valid: "erDiagram\nA ||--o{ B : has", invalid: "erDiagram\nA ||--o{ : has" },
  {
    type: "sequenceDiagram",
    valid: "sequenceDiagram\nA->>B: hello",
    invalid: "sequenceDiagram\nA--x: invalid",
  },
  { type: "block", valid: 'block\na["A"]', invalid: "block\na[" },
  {
    type: "architecture-beta",
    valid: "architecture-beta\nservice a(server)[A]",
    invalid: "architecture-beta\nservice a(",
  },
];

let tool: Tool;
let parser: Parser;
let parsed: ParseResult[];
const temporaryRoots: string[] = [];

function fixture(content: string, name = "diagram with spaces.md") {
  const cwd = mkdtempSync(path.join(tmpdir(), "specdojo-mermaid-lint-"));
  temporaryRoots.push(cwd);
  writeFileSync(path.join(cwd, name), content);
  return { cwd, name };
}

beforeAll(async () => {
  tool = (await import(pathToFileURL(path.resolve("tools/lint-mermaid.mjs")).href)) as Tool;
  parser = tool.resolveMermaid();
  const codes = examples.flatMap(({ valid, invalid }) => [valid, invalid]);
  codes.push("unknownDiagram\nA", "", 'block-beta\na["A"]');
  codes.push(
    '---\ntitle: Test\n---\n%% comment\n%%{init: {"theme": "dark"}}%%\nflowchart TD\nA["<b>日本語</b>"] --> B',
  );
  parsed = await tool.checkMermaidBlocks(
    codes.map((code) => ({
      file: "diagrams.md",
      line: 10,
      type: code.split("\n")[0],
      code,
    })),
    parser,
  );
}, 15000);

afterEach(() => {
  while (temporaryRoots.length) rmSync(temporaryRoots.pop()!, { recursive: true, force: true });
});

describe("Mermaid syntax parser without a browser", () => {
  it.each(examples.map((example, index) => ({ ...example, index })))(
    "$type の正しい図と誤った図を実際の Mermaid で解析する",
    ({ type, index }) => {
      expect(parsed[index * 2].status, type).toBe("passed");
      expect(parsed[index * 2].parserType).toBeTruthy();
      expect(parsed[index * 2 + 1].status, type).toBe("error");
      expect(parsed[index * 2 + 1].message).toMatch(/error|Parsing failed/iu);
    },
  );

  it("未知の図と空のブロックを未検査にする", () => {
    expect(parsed[16].status).toBe("unchecked");
    expect(parsed[17].status).toBe("unchecked");
  });

  it("block-beta、frontmatter、directive、HTML を含む日本語ラベルも解析する", () => {
    expect(parsed[18].status).toBe("passed");
    expect(parsed[19].status).toBe("passed");
    expect(globalThis).not.toHaveProperty("document");
  });

  it("docs-site のレンダラーから解決した Mermaid の版を報告する", () => {
    expect(parser.version).toMatch(/^\d+\.\d+\.\d+/u);
    expect(parser.entry).toContain("mermaid");
  });
});

describe("Markdown の抽出と診断", () => {
  it.each(["\n", "\r\n"])(
    "改行 %j、長い fence、tilde、引用・リスト内の図を元文書の行番号で抽出する",
    (lineEnding) => {
      const markdown = [
        "# Test",
        "",
        "````markdown",
        "```mermaid",
        "bad example",
        "```",
        "````",
        "",
        "> ~~~mermaid title",
        "> graph LR",
        "> A --> B",
        "> ~~~",
        "",
        "- item",
        "",
        "  ````mermaid",
        "  flowchart TD",
        "  A --> B",
        "  ````",
        "",
        "```js",
        "const mermaid = 1;",
        "```",
      ].join(lineEnding);
      expect(tool.extractMermaidBlocks(markdown, "nested.md")).toEqual([
        {
          file: "nested.md",
          line: 9,
          type: "graph",
          code: ["graph LR", "A --> B"].join(lineEnding),
        },
        {
          file: "nested.md",
          line: 16,
          type: "flowchart",
          code: ["flowchart TD", "A --> B"].join(lineEnding),
        },
      ]);
    },
  );

  it("Mermaid がないファイルは依存をロードせず成功する", async () => {
    const { cwd, name } = fixture("# No diagram\n");
    const resolveParser = vi.fn(() => {
      throw new Error("must not load");
    });
    const stdout = vi.fn();
    expect(await tool.lintMermaid([name], { cwd, stdout, resolveParser })).toBe(0);
    expect(resolveParser).not.toHaveBeenCalled();
    expect(stdout).toHaveBeenCalledWith(expect.stringContaining("0 diagram(s)"));
  });

  it("ファイル名・fence 行・種類・内容と未検査の件数を報告して失敗する", async () => {
    const { cwd, name } = fixture(
      "# Title\n\n```mermaid\nflowchart TD\nA --> [\n```\n\n~~~mermaid\nunknownDiagram\nA\n~~~\n",
    );
    const stderr = vi.fn();
    const stdout = vi.fn();
    // Actual parser results above, with the source locations from this Markdown.
    const checkBlocks = async (blocks: Block[]) =>
      blocks.map((block, index) => ({
        ...block,
        status: index === 0 ? parsed[1].status : parsed[16].status,
        message: index === 0 ? parsed[1].message : parsed[16].message,
      }));
    expect(await tool.lintMermaid([name, "*.md"], { cwd, stderr, stdout, checkBlocks })).toBe(1);
    expect(stderr).toHaveBeenCalledWith(
      expect.stringContaining(`${name}:3 [flowchart] 構文エラー`),
    );
    expect(stderr).toHaveBeenCalledWith(expect.stringContaining("Parse error on line 2"));
    expect(stderr).toHaveBeenCalledWith(
      expect.stringContaining(`${name}:8 [unknownDiagram] 未検査`),
    );
    expect(stdout).toHaveBeenCalledWith(expect.stringContaining("1 file(s), 2 diagram(s)"));
    expect(stdout).toHaveBeenCalledWith("  unknownDiagram: 0 passed, 0 error, 1 未検査\n");
  });

  it("解析環境の障害は全図を未検査とし、成功と区別する", async () => {
    const { cwd, name } = fixture("```mermaid\ngraph LR\nA --> B\n```\n");
    for (const failure of ["resolution", "worker"]) {
      const stderr = vi.fn();
      const stdout = vi.fn();
      const resolveParser = () => {
        if (failure === "resolution") throw new Error("docs-site is not installed");
        return parser;
      };
      const checkBlocks = async (): Promise<ParseResult[]> => {
        throw new Error("worker failed");
      };
      expect(
        await tool.lintMermaid([name], { cwd, stderr, stdout, resolveParser, checkBlocks }),
      ).toBe(1);
      expect(stderr).toHaveBeenCalledWith(expect.stringContaining("[graph] 未検査"));
      expect(stdout).toHaveBeenCalledWith("  graph: 0 passed, 0 error, 1 未検査\n");
    }
  });

  it("未一致の glob は失敗させる", async () => {
    const { cwd, name } = fixture("# Text\n");
    const stderr = vi.fn();
    expect(await tool.lintMermaid([name, "missing*.md"], { cwd, stderr })).toBe(1);
    expect(stderr).toHaveBeenCalledWith(expect.stringContaining("No Markdown files matched"));
  });

  it("CLI の終了コードは正しい図で 0、誤った図で 1 になる", () => {
    const { cwd, name } = fixture("```mermaid\ngraph LR\nA --> B\n```\n");
    const entry = path.resolve("tools/lint-mermaid.mjs");
    const valid = spawnSync(process.execPath, [entry, name], { cwd, encoding: "utf8" });
    expect(valid.status, valid.stderr).toBe(0);
    expect(valid.stdout).toContain("1 passed, 0 error, 0 未検査");
    writeFileSync(path.join(cwd, name), "```mermaid\nflowchart TD\nA --> [\n```\n");
    const invalid = spawnSync(process.execPath, [entry, name], { cwd, encoding: "utf8" });
    expect(invalid.status).toBe(1);
    expect(invalid.stderr).toContain(`${name}:1 [flowchart] 構文エラー`);
    expect(invalid.stderr).toContain("Parse error");
  }, 15000);
});
