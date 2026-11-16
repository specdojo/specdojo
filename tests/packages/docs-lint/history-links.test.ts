import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { findForbiddenLinks } from "../../../packages/docs-lint/src/history-links.js";

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("findForbiddenLinks", () => {
  it("flags an inline markdown link to a local path", () => {
    const findings = findForbiddenLinks("See [ルール](../instructions/markdown.instructions.md).");

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      kind: "link",
      url: "../instructions/markdown.instructions.md",
    });
  });

  it("flags a labeled external URL because it should be written bare", () => {
    const findings = findForbiddenLinks("See [Anthropic](https://www.anthropic.com).");

    expect(findings).toHaveLength(1);
    expect(findings[0].kind).toBe("link");
    expect(findings[0].reason).toContain("URL そのまま");
  });

  it("flags reference-style links and their definitions", () => {
    const findings = findForbiddenLinks("See [ルール][ref].\n\n[ref]: ./markdown.instructions.md");

    const kinds = findings.map((f) => f.kind).sort();
    expect(kinds).toEqual(["definition", "linkReference"]);
  });

  it("does not flag wikilinks with display title", () => {
    const findings = findForbiddenLinks("See [[prj-0001:pjr-index|登録簿]] for details.");

    expect(findings).toEqual([]);
  });

  it("does not flag bare wikilinks", () => {
    const findings = findForbiddenLinks("See [[specdojo:id-and-file-naming-standard]].");

    expect(findings).toEqual([]);
  });

  it("does not flag bare paths written as plain text", () => {
    const findings = findForbiddenLinks("参照: .github/instructions/markdown.instructions.md");

    expect(findings).toEqual([]);
  });

  it("does not flag a bare URL rendered as an autolink literal", () => {
    const findings = findForbiddenLinks("参照: https://www.anthropic.com/docs");

    expect(findings).toEqual([]);
  });

  it("does not flag an explicit autolink", () => {
    const findings = findForbiddenLinks("参照: <https://www.anthropic.com/docs>");

    expect(findings).toEqual([]);
  });

  it("does not flag images", () => {
    const findings = findForbiddenLinks("![図](../assets/diagram.png)");

    expect(findings).toEqual([]);
  });

  it("does not flag intra-document anchors", () => {
    const findings = findForbiddenLinks("[完了条件](#2-完了条件) を参照。");

    expect(findings).toEqual([]);
  });

  it("reports the line where the forbidden link appears", () => {
    const markdown = "# 見出し\n\n本文\n\nSee [x](./y.md) here.";
    const findings = findForbiddenLinks(markdown);

    expect(findings).toHaveLength(1);
    expect(findings[0].line).toBe(5);
  });

  it("exempts only a plan's final legacy conventions link with a matching hash", () => {
    const hash = "a".repeat(64);
    const link = `[共通規約 sha256:${hash}](../../../../conventions/${hash}.txt)`;
    const options = { allowLegacyConventionsReference: true };
    expect(findForbiddenLinks("# Plan\n\n" + link, options)).toEqual([]);
    expect(findForbiddenLinks(link)).toHaveLength(1);
    for (const content of [
      link + "\n\nBody after reference.",
      "Other text " + link,
      link.replace(`${hash}.txt`, `${"b".repeat(64)}.txt`),
      link.replace("../../../../conventions/", "../../../../other/"),
      link.replace("共通規約 sha256:", "Other sha256:"),
      link.replace("共通規約 sha256:", "**共通規約 sha256:**"),
      link.replace("../../../../conventions/", "https://example.com/conventions/"),
    ]) {
      expect(findForbiddenLinks(content, options)).toHaveLength(1);
    }
    expect(findForbiddenLinks("[ordinary](./file.md)\n\n" + link, options)).toHaveLength(1);
  });

  it("checks new run plans and results by default, allowing the legacy link only in plans", () => {
    const root = mkdtempSync(join(tmpdir(), "history-links-"));
    roots.push(root);
    const run = "docs/ja/projects/test/execution/runs/register/PJR-TEST/run-1";
    const hash = "a".repeat(64);
    const legacy = `[共通規約 sha256:${hash}](../../../../conventions/${hash}.txt)`;
    const files = [
      [`${run}/plan.md`, legacy],
      [`${run}/result.md`, "# Result\n\nDone."],
      ["docs/ja/projects/test/controls/project-register/pjr-index.md", "[ticket](pjr-test.md)"],
    ];
    for (const [path, content] of files) {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      writeFileSync(join(root, path), content);
    }
    const check = () =>
      spawnSync(
        process.execPath,
        [resolve("packages/docs-lint/bin/specdojo-docs-lint.js"), "history-links"],
        { cwd: root, encoding: "utf8" },
      );
    expect(check().status).toBe(0);
    for (const kind of ["plan", "result"]) {
      const path = join(root, run, `${kind}.md`);
      const original = kind === "plan" ? legacy : "# Result\n\nDone.";
      writeFileSync(path, `[ordinary](./file.md)\n\n${original}`);
      const result = check();
      expect(result.status).toBe(1);
      expect(result.stderr).toContain(`${run}/${kind}.md:1:1`);
      writeFileSync(path, original);
    }
    writeFileSync(join(root, run, "result.md"), legacy);
    expect(check().status).toBe(1);
  });
});
