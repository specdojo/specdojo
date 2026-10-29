import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { registerGradeFindingsText } from "../../../src/exec/plans.js";
import { gradeFindingsText } from "../../../src/exec/plans-core.js";
import { findForbiddenLinks } from "../../../packages/docs-lint/src/history-links.js";
import { lint } from "markdownlint/sync";
import { format } from "prettier";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import type { Nodes } from "mdast";
import { load } from "../../../src/shared/yaml.js";

vi.mock("node:fs", async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>();
  return {
    ...original,
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
  };
});
import * as fs from "node:fs";

vi.mock("../../../src/docs/doc-index.js", () => ({
  lookupDocIndex: vi.fn(),
}));
import * as docIndex from "../../../src/docs/doc-index.js";

vi.mock("../../../src/shared/grade-result.js", () => ({
  gradeFindingDisplayMessage: vi.fn(
    (finding: { message: string; message_ja?: string }) => finding.message_ja ?? finding.message,
  ),
  gradeResultPathForDocument: vi.fn(),
  readGradeResultForDocument: vi.fn(),
}));
import * as gradeResult from "../../../src/shared/grade-result.js";
import type { GradeResult, StoredGradeFinding } from "../../../src/shared/grade-result.js";

import { join } from "node:path";
import { specdojoRootDir } from "../../../src/shared/specdojo-config.js";

describe("registerGradeFindingsText", () => {
  beforeEach(() => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockImplementation(((_path: string) => {
      if (_path.includes("ticket.md")) {
        return [
          "---",
          "specdojo:",
          "  targets:",
          "    - doc-a",
          "    - doc-b",
          "    - doc-c",
          "    - doc-not-found",
          "---",
          "",
          "## 5. 関連ドキュメント",
          "",
          "- [[doc-reference-only]]",
          "",
        ].join("\n");
      }
      return "";
    }) as unknown as typeof fs.readFileSync);
    vi.mocked(docIndex.lookupDocIndex).mockImplementation((id: string) => {
      if (id === "doc-not-found") return undefined;
      return `docs/ja/product/${id}.md`;
    });
    vi.mocked(gradeResult.gradeResultPathForDocument).mockImplementation(({ documentPath }) => {
      return join(specdojoRootDir(), `execution/grade/results/${documentPath}.yaml`);
    });
    vi.mocked(gradeResult.readGradeResultForDocument).mockImplementation(({ documentPath }) => {
      if (documentPath.includes("doc-a")) {
        return {
          findings: Array.from({ length: 25 }, (_, i) => ({
            id: `finding-${i}`,
            severity: "error",
            rule: "R01",
            line: i + 1,
            anchor: null,
            message: `msg ${i}`,
          })),
        } as unknown as GradeResult;
      }
      if (documentPath.includes("doc-b")) {
        return {
          findings: [
            {
              id: "finding-b",
              severity: "warning",
              rule: "R02",
              line: 10,
              anchor: "anch",
              message: "Canonical warning message",
              message_ja: "警告メッセージ",
            },
          ],
        } as unknown as GradeResult;
      }
      if (documentPath.includes("doc-c")) {
        return { findings: [] } as unknown as GradeResult;
      }
      return undefined;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("展開の有無・上限・サイドカー未存在の扱いを検証する", () => {
    const text = registerGradeFindingsText("prj-test", "ticket.md");

    // 展開の有無（doc-a, doc-b が展開される）
    expect(text).toContain("- [[doc-a]] (サイドカー:");
    expect(text).toContain("- [[doc-b]] (サイドカー:");

    // 上限（doc-a の finding は 20件まで表示され、残りは省略）
    expect(text).toContain("\\[error/R01; line=1; anchor=`null`\\]: `msg 0`");
    expect(text).toContain("\\[error/R01; line=20; anchor=`null`\\]: `msg 19`");
    expect(text).not.toContain("\\[error/R01; line=21; anchor=`null`\\]: `msg 20`");
    expect(text).toContain("- 他 5 件の finding があります。詳細はサイドカーを参照してください。");
    expect(text).toContain('\\[warning/R02; line=10; anchor=`"anch"`\\]: `警告メッセージ`');
    expect(text).not.toContain("Canonical warning message");

    // サイドカー未存在（または finding 0件）の扱い
    expect(text).toContain("- [[doc-c]]: finding なし");

    // 関連ドキュメントにあるだけで targets にない文書は展開されない
    expect(text).not.toContain("doc-reference-only");
    expect(docIndex.lookupDocIndex).not.toHaveBeenCalledWith(
      "doc-reference-only",
      expect.any(String),
    );
  });

  it("文書数の上限", () => {
    vi.mocked(fs.readFileSync).mockImplementation(((_path: string) => {
      const targets = Array.from({ length: 15 }, (_, i) => `    - doc-${i}`).join("\n");
      return `---\nspecdojo:\n  targets:\n${targets}\n---\n`;
    }) as unknown as typeof fs.readFileSync);
    vi.mocked(docIndex.lookupDocIndex).mockReturnValue("dummy.md");
    vi.mocked(gradeResult.readGradeResultForDocument).mockReturnValue({
      findings: [],
    } as unknown as GradeResult);

    const text = registerGradeFindingsText("prj-test", "ticket.md");

    expect(text).toContain("- [[doc-0]]: finding なし");
    expect(text).toContain("- [[doc-9]]: finding なし");
    expect(text).not.toContain("- [[doc-10]]: finding なし");
    expect(text).toContain("- その他 5 件の文書は省略されました");
  });

  it("targets がなければ関連ドキュメントの finding を展開しない", () => {
    vi.mocked(fs.readFileSync).mockReturnValue(
      "---\nspecdojo:\n  id: prj-test:pjr-test\n---\n\n## 5. 関連ドキュメント\n\n- [[doc-a]]\n",
    );

    const text = registerGradeFindingsText("prj-test", "ticket.md");

    expect(text).toBe("- なし");
    expect(docIndex.lookupDocIndex).not.toHaveBeenCalled();
    expect(gradeResult.readGradeResultForDocument).not.toHaveBeenCalled();
  });

  describe.each([
    { name: "plans-core", render: () => gradeFindingsText("prj-test", "doc-a.md") },
    { name: "plans-storage", render: () => registerGradeFindingsText("prj-test", "ticket.md") },
  ])("$name の finding の Markdown 安全性", ({ render }) => {
    async function expectSafePlan(anchor: string, message: string, localized = false) {
      const finding: StoredGradeFinding = {
        id: "finding-1",
        severity: "minor",
        rule: "vp-test",
        line: 12,
        anchor,
        message: localized ? "Canonical message" : message,
        ...(localized ? { message_ja: message } : {}),
      };
      vi.mocked(gradeResult.readGradeResultForDocument).mockReturnValue({
        findings: [finding],
      } as GradeResult);
      const plan = `# Edit Plan\n\n## grade result から展開された finding\n\n${render()}\n`;
      const actualFs = await vi.importActual<typeof fs>("node:fs");
      const config = load(
        actualFs.readFileSync(join(specdojoRootDir(), ".markdownlint.yaml"), "utf8"),
      ) as Record<string, boolean>;

      // 生成直後と Prettier 整形後の双方で、CLI と同じリンク検査・markdownlint を通す。
      for (const content of [plan, await format(plan, { parser: "markdown" })]) {
        expect(findForbiddenLinks(content)).toEqual([]);
        expect(lint({ strings: { plan: content }, config }).plan).toEqual([]);

        // インラインコードを解析しても anchor の JSON 表記と本文を読み取れる。
        const codeValues: string[] = [];
        function collectCode(node: Nodes): void {
          if (node.type === "inlineCode") codeValues.push(node.value);
          if ("children" in node) node.children.forEach(collectCode);
        }
        collectCode(remark().use(remarkGfm).parse(content));
        expect(codeValues).toContain(JSON.stringify(anchor));
        expect(codeValues).toContain(message.replace(/\r\n?|\n/g, " ").trim());
        if (localized) expect(content).not.toContain("Canonical message");
      }
    }

    it.each([
      ["通常の anchor", "通常の説明文"],
      ['引用符 " と \\ と |', "通常の説明文"],
      ["# [設計](../design.md) `code` | ``nested``", "[参照](../other.md) `code` | ``nested``"],
      ["[外部](https://example.com) | `code`", "[外部](https://example.com) | `code`"],
      ["`先頭と末尾`", "`先頭と末尾`"],
      ["``連続バッククォート```", "```連続バッククォート``"],
      ["末尾`", "先頭` と ```fence``` と末尾`"],
      [" anchor ", " 本文 "],
      ["[参照][id] | `code`", "_emphasis_ *emphasis* depends_on | [参照][id]"],
      ["複数行\nanchor", "説明\n\n[id]: ../design.md\r\n[参照][id]"],
    ])("anchor=%s の引用内容を保持して検査を通る", async (anchor, message) => {
      await expectSafePlan(anchor, message);
    });

    it("日本語表示メッセージにも同じ安全化を適用する", async () => {
      await expectSafePlan("anchor", "`[設計](../design.md)` | [外部](https://example.com)", true);
    });
  });
});
