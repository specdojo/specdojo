import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { registerGradeFindingsText } from "../../src/exec-plans.js";

vi.mock("node:fs", async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>();
  return {
    ...original,
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
  };
});
import * as fs from "node:fs";

vi.mock("../../src/doc-index.js", () => ({
  lookupDocIndex: vi.fn(),
}));
import * as docIndex from "../../src/doc-index.js";

vi.mock("../../src/grade-result.js", () => ({
  gradeResultPathForDocument: vi.fn(),
  readGradeResultForDocument: vi.fn(),
}));
import * as gradeResult from "../../src/grade-result.js";
import type { GradeResult } from "../../src/grade-result.js";

import { join } from "node:path";
import { specdojoRootDir } from "../../src/specdojo-config.js";

describe("registerGradeFindingsText", () => {
  beforeEach(() => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockImplementation(((_path: string) => {
      if (_path.includes("ticket.md")) {
        return "## 5. 関連ドキュメント\n\n- [[doc-a]]\n- [[doc-b]]\n- [[doc-c]]\n- [[doc-not-found]]\n";
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
              message: "warning msg",
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
    expect(text).toContain("[error/R01; line=1; anchor=null]: msg 0");
    expect(text).toContain("[error/R01; line=20; anchor=null]: msg 19");
    expect(text).not.toContain("[error/R01; line=21; anchor=null]: msg 20");
    expect(text).toContain("- 他 5 件の finding があります。詳細はサイドカーを参照してください。");

    // サイドカー未存在（または finding 0件）の扱い
    expect(text).toContain("- [[doc-c]]: finding なし");
  });

  it("文書数の上限", () => {
    vi.mocked(fs.readFileSync).mockImplementation(((_path: string) => {
      const links = Array.from({ length: 15 }, (_, i) => `- [[doc-${i}]]`).join("\n");
      return `## 5. 関連ドキュメント\n\n${links}\n`;
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
});
