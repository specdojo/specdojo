import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  classifyDocLink,
  collectExternalDocLinks,
  createUnresolvedWikilinkReporter,
  externalEntryHref,
  loadExternalProjectLinkSources,
  selectExternalDocLinks,
  type ExternalProjectLinkSource,
} from "../../../packages/docs-site/.vitepress/external-links.js";

function write(filePath: string, content: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, "utf8");
}

function writeJson(filePath: string, value: unknown): void {
  write(filePath, JSON.stringify(value));
}

let parent: string;
let workspace: string;
let external: string;
let warnings: string[];
const warn = (message: string): void => {
  warnings.push(message);
};

beforeEach(() => {
  parent = mkdtempSync(join(tmpdir(), "specdojo-external-links-"));
  workspace = join(parent, "specdojo");
  external = join(parent, "lp-specdojo");
  mkdirSync(workspace, { recursive: true });
  mkdirSync(external, { recursive: true });
  warnings = [];
});

afterEach(() => {
  rmSync(parent, { recursive: true, force: true });
});

function source(overrides: Partial<ExternalProjectLinkSource> = {}): ExternalProjectLinkSource {
  return {
    alias: "lp",
    projectId: "prj-0002",
    root: external,
    sourceUrl: "https://github.com/example/lp-specdojo/blob/main",
    ...overrides,
  };
}

describe("loadExternalProjectLinkSources", () => {
  it("reads aliases with source_url and resolves path from the workspace root", () => {
    writeJson(join(workspace, ".specdojo/specdojo.config.json"), {
      version: 1,
      projects: {},
      external_projects: {
        lp: {
          path: "../lp-specdojo",
          project_id: "prj-0002",
          source_url: "https://github.com/example/lp-specdojo/blob/main/",
        },
        other: { path: "../other", project_id: "prj-0003" },
      },
    });

    const actual = loadExternalProjectLinkSources(workspace, {}, warn);

    expect(actual).toEqual([source()]);
    expect(warnings).toEqual([]);
  });

  it("applies the local config path override to a shared alias", () => {
    writeJson(join(workspace, ".specdojo/specdojo.config.json"), {
      version: 1,
      projects: {},
      external_projects: {
        lp: {
          path: "../missing",
          project_id: "prj-0002",
          source_url: "https://github.com/example/lp-specdojo/blob/main",
        },
      },
    });
    writeJson(join(workspace, ".specdojo/specdojo.local.config.json"), {
      version: 1,
      external_projects: { lp: { path: "../lp-specdojo", project_id: "prj-9999" } },
    });

    const actual = loadExternalProjectLinkSources(workspace, {}, warn);

    expect(actual).toEqual([source()]);
  });

  it("warns and skips a source_url that is not an http(s) URL", () => {
    writeJson(join(workspace, ".specdojo/specdojo.config.json"), {
      version: 1,
      projects: {},
      external_projects: {
        lp: { path: "../lp-specdojo", project_id: "prj-0002", source_url: "../lp-specdojo" },
      },
    });

    const actual = loadExternalProjectLinkSources(workspace, {}, warn);

    expect(actual).toEqual([]);
    expect(warnings).toEqual([
      'skip external project "lp": source_url must start with http:// or https://',
    ]);
  });
});

describe("externalEntryHref", () => {
  it("turns a line-suffixed doc index entry into a line anchor", () => {
    expect(
      externalEntryHref("https://github.com/o/r/blob/main", "docs/ja/projects/a b.yaml:42"),
    ).toBe("https://github.com/o/r/blob/main/docs/ja/projects/a%20b.yaml#L42");
  });
});

describe("collectExternalDocLinks", () => {
  it("maps only the external project's doc ids from its doc index", () => {
    writeJson(join(external, ".specdojo/doc-index.json"), {
      entries: {
        "prj-0002:pjr-hepk-lp-content": "docs/ja/projects/prj-0002/pjr-hepk.md",
        "specdojo:pjr-rulebook": "docs/ja/specdojo/rulebooks/pjr-rulebook.md",
      },
    });

    const actual = collectExternalDocLinks([source()], warn);

    expect(actual).toEqual({
      "prj-0002:pjr-hepk-lp-content": {
        alias: "lp",
        href: "https://github.com/example/lp-specdojo/blob/main/docs/ja/projects/prj-0002/pjr-hepk.md",
      },
    });
  });

  it("scans the project's base_path when the external repository has no doc index", () => {
    writeJson(join(external, ".specdojo/specdojo.config.json"), {
      version: 1,
      projects: { "prj-0002": { base_path: "docs/ja/projects/prj-0002" } },
    });
    write(
      join(external, "docs/ja/projects/prj-0002/controls/pjr-hepk.md"),
      "---\nspecdojo:\n  id: prj-0002:pjr-hepk-lp-content\n  type: project\n---\n\n# x\n",
    );

    const actual = collectExternalDocLinks([source()], warn);

    expect(actual["prj-0002:pjr-hepk-lp-content"]?.href).toBe(
      "https://github.com/example/lp-specdojo/blob/main/docs/ja/projects/prj-0002/controls/pjr-hepk.md",
    );
  });

  it("warns and skips an external repository that is not checked out", () => {
    const missing = join(parent, "missing");

    const actual = collectExternalDocLinks([source({ root: missing })], warn);

    expect(actual).toEqual({});
    expect(warnings).toEqual([`skip external project "lp": ${missing} not found`]);
  });
});

describe("classifyDocLink", () => {
  const externalHref =
    "https://github.com/example/lp-specdojo/blob/main/docs/ja/projects/prj-0002/pjr-hepk.md";

  it("prefers the local doc index over an external URL for the same id", () => {
    const localIds = new Set(["prj-0002:pjr-hepk-lp-content"]);
    const links = selectExternalDocLinks(
      { "prj-0002:pjr-hepk-lp-content": { alias: "lp", href: externalHref } },
      localIds,
    );

    const actual = classifyDocLink("prj-0002:pjr-hepk-lp-content", localIds, links);

    expect(actual).toEqual({ kind: "local" });
    expect(links).toEqual({});
  });

  it("resolves an id missing from the local doc index to the external URL", () => {
    const actual = classifyDocLink("prj-0002:pjr-hepk-lp-content", new Set(), {
      "prj-0002:pjr-hepk-lp-content": { alias: "lp", href: externalHref },
    });

    expect(actual).toEqual({ kind: "external", href: externalHref });
  });

  it("leaves an id unresolved when its project is not declared in external_projects", () => {
    writeJson(join(workspace, ".specdojo/specdojo.config.json"), {
      version: 1,
      projects: {},
      external_projects: {
        other: {
          path: "../lp-specdojo",
          project_id: "prj-0003",
          source_url: "https://github.com/example/other/blob/main",
        },
      },
    });
    writeJson(join(external, ".specdojo/doc-index.json"), {
      entries: { "prj-0002:pjr-hepk-lp-content": "docs/ja/projects/prj-0002/pjr-hepk.md" },
    });
    const links = collectExternalDocLinks(
      loadExternalProjectLinkSources(workspace, {}, warn),
      warn,
    );

    const actual = classifyDocLink("prj-0002:pjr-hepk-lp-content", new Set(), links);

    expect(actual).toEqual({ kind: "unresolved" });
    expect(warnings).toEqual([]);
  });
});

describe("createUnresolvedWikilinkReporter", () => {
  it("warns once per document with the id and the document path", () => {
    const report = createUnresolvedWikilinkReporter(warn);

    report("prj-0002:pjr-hepk-lp-content", "ja/projects/prj-0001/a.md");
    report("prj-0002:pjr-hepk-lp-content", "ja/projects/prj-0001/a.md");
    report("prj-0002:pjr-hepk-lp-content", "ja/projects/prj-0001/b.md");

    expect(warnings).toEqual([
      'unresolved wikilink "[[prj-0002:pjr-hepk-lp-content]]" in ja/projects/prj-0001/a.md: not found in the local doc index nor in external_projects',
      'unresolved wikilink "[[prj-0002:pjr-hepk-lp-content]]" in ja/projects/prj-0001/b.md: not found in the local doc index nor in external_projects',
    ]);
  });

  it("does not warn for an id without a namespace prefix", () => {
    const report = createUnresolvedWikilinkReporter(warn);

    report("pjr-hepk-lp-content", "ja/projects/prj-0001/a.md");

    expect(warnings).toEqual([]);
  });
});
