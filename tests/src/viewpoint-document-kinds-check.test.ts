import { afterEach, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import yaml from "js-yaml";
import {
  checkViewpointDocumentKinds,
  collectRulebookIds,
  formatViewpointDocumentKindsFinding,
  lintViewpointDocumentKinds,
} from "../../src/viewpoint-document-kinds-check.js";

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

function rulebookMarkdown(id: string): string {
  return `---\nspecdojo:\n  id: ${id}\n  type: rulebook\n  status: draft\n---\n\n# ${id}\n`;
}

function viewpointsYaml(documentKinds: Record<string, unknown>): string {
  return yaml.dump({
    id: "specdojo:pm-review-viewpoints",
    viewpoints: [
      { id: "vp-arc-single-responsibility", document_kinds: documentKinds },
      { id: "vp-ux-readability", document_kinds: { unclassified: "include" } },
      { id: "vp-dev-change-impact" },
    ],
  });
}

function createFixture(rulebookIds: string[], documentKinds: Record<string, unknown>) {
  const root = mkdtempSync(path.join(tmpdir(), "specdojo-viewpoint-kinds-"));
  temporaryDirectories.push(root);
  const rulebookDir = path.join(root, "rulebooks");
  mkdirSync(rulebookDir);
  for (const id of rulebookIds) {
    const name = `${id.replace(/^specdojo:/, "")}.md`;
    writeFileSync(path.join(rulebookDir, name), rulebookMarkdown(id), "utf8");
  }
  const viewpointsPath = path.join(root, "pm-review-viewpoints.yaml");
  writeFileSync(viewpointsPath, viewpointsYaml(documentKinds), "utf8");
  return { rulebookDir, viewpointsPath };
}

describe("viewpoint document_kinds coverage check", () => {
  it("追加した rulebook の判断漏れを観点 ID と rulebook ID で報告する", () => {
    const { rulebookDir, viewpointsPath } = createFixture(
      ["specdojo:bps-rulebook", "specdojo:dct-index-rulebook", "specdojo:new-index-rulebook"],
      {
        exclude: ["specdojo:dct-index-rulebook"],
        confirmed_default: ["specdojo:bps-rulebook"],
      },
    );

    const actual = checkViewpointDocumentKinds(viewpointsPath, rulebookDir);

    expect(actual).toEqual({
      rulebookCount: 3,
      errors: [
        "vp-arc-single-responsibility: specdojo:new-index-rulebook is not decided (add it to document_kinds.include / exclude, or to confirmed_default to keep the default)",
      ],
    });
  });

  it("追加した rulebook の判断を記録すれば通る", () => {
    const { rulebookDir, viewpointsPath } = createFixture(
      ["specdojo:bps-rulebook", "specdojo:dct-index-rulebook", "specdojo:new-index-rulebook"],
      {
        exclude: ["specdojo:dct-index-rulebook", "specdojo:new-index-rulebook"],
        confirmed_default: ["specdojo:bps-rulebook"],
      },
    );

    expect(checkViewpointDocumentKinds(viewpointsPath, rulebookDir)).toEqual({
      rulebookCount: 3,
      errors: [],
    });
  });

  it("include / exclude / confirmed_default を持たない観点は対象にしない", () => {
    const doc = {
      viewpoints: [{ id: "vp-ux-readability", document_kinds: { unclassified: "include" } }],
    };

    expect(lintViewpointDocumentKinds(doc, ["specdojo:bps-rulebook"])).toEqual([]);
  });

  it("存在しない rulebook と重複した判断を報告する", () => {
    const doc = {
      viewpoints: [
        {
          id: "vp-ba-business-value",
          document_kinds: {
            exclude: ["specdojo:bps-rulebook", "specdojo:removed-rulebook"],
            confirmed_default: ["specdojo:bps-rulebook"],
          },
        },
      ],
    };

    const actual = lintViewpointDocumentKinds(doc, ["specdojo:bps-rulebook"]).map(
      formatViewpointDocumentKindsFinding,
    );

    expect(actual).toEqual([
      "vp-ba-business-value: document_kinds.exclude lists unknown rulebook specdojo:removed-rulebook",
      "vp-ba-business-value: specdojo:bps-rulebook is listed in more than one of document_kinds.exclude / confirmed_default",
    ]);
  });

  it("rulebook ID は type: rulebook の frontmatter からソートして集める", () => {
    const { rulebookDir } = createFixture(["specdojo:tsd-rulebook", "specdojo:atc-rulebook"], {
      exclude: ["specdojo:atc-rulebook"],
    });
    writeFileSync(
      path.join(rulebookDir, "notes-rulebook.md"),
      "---\nspecdojo:\n  id: specdojo:notes\n  type: guide\n---\n\n# notes\n",
      "utf8",
    );

    expect(collectRulebookIds(rulebookDir)).toEqual([
      "specdojo:atc-rulebook",
      "specdojo:tsd-rulebook",
    ]);
  });

  // npm run check は npm test を含むため、このテストがリポジトリの宣言に対する検証になる。
  it("リポジトリの共通観点はすべての rulebook について判断済みである", () => {
    const actual = checkViewpointDocumentKinds();

    expect(actual.errors).toEqual([]);
    expect(actual.rulebookCount).toBeGreaterThan(0);
  });
});
