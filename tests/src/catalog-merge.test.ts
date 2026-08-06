import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import yaml from "js-yaml";
import { afterEach, describe, expect, it } from "vitest";
import { buildCatalog, loadCatalogDocs, mergeDomainCatalogs } from "../../src/catalog-build.js";
import { runScaffold } from "../../src/catalog-scaffold.js";
import type { DctDeliverableItem, DctSection } from "../../src/catalog-types.js";

let root: string;

afterEach(() => {
  if (root) rmSync(root, { recursive: true, force: true });
});

// Builds a minimal but schema-valid dct-<domain>.yaml with the given local_ids.
function dctYaml(
  domain: string,
  localIds: string[],
  opts: { basePath?: string; groupName?: string; projectId?: string } = {},
): string {
  const basePath = opts.basePath ?? `/docs/${domain}`;
  const projectId = opts.projectId ?? "prj-test";
  const deliverables = localIds
    .map((id) =>
      [
        `      - local_id: ${id}`,
        `        name: Name ${id}`,
        `        kind: work`,
        `        overview: overview ${id}`,
        `        path: ${id}.md`,
        `        done_criteria:`,
        `          - text: criterion for ${id}`,
        `            roles: [DEV]`,
        `            viewpoint: vp-dev-quality`,
      ].join("\n"),
    )
    .join("\n");
  return [
    `id: ${projectId}:dct-${domain}`,
    "type: project",
    "status: draft",
    `project_id: ${projectId}`,
    `domain: ${domain}`,
    `base_path: ${basePath}`,
    "groups:",
    ...(opts.groupName
      ? [`  - name: ${opts.groupName}`, "    deliverables:"]
      : ["  - deliverables:"]),
    deliverables,
    "",
  ].join("\n");
}

function deliverable(localId: string): DctDeliverableItem {
  return {
    local_id: localId,
    name: `Name ${localId}`,
    kind: "work",
    overview: `overview ${localId}`,
    path: `${localId}.md`,
  };
}

function dctWithGroups(domain: string, groups: DctSection[]): string {
  return yaml.dump({
    id: `prj-test:dct-${domain}`,
    type: "project",
    status: "draft",
    project_id: "prj-test",
    domain,
    base_path: `/docs/${domain}`,
    groups,
  });
}

function makeCatalog(files: Record<string, string>): string {
  root = mkdtempSync(join(tmpdir(), "specdojo-merge-"));
  const catalogPath = join(root, "catalog");
  mkdirSync(catalogPath, { recursive: true });
  for (const [name, content] of Object.entries(files)) {
    writeFileSync(join(catalogPath, name), content, "utf8");
  }
  return catalogPath;
}

describe("mergeDomainCatalogs", () => {
  it("merges same-name groups and their deliverables in sorted file order", () => {
    const catalogPath = makeCatalog({
      "dct-data-model-stsd.yaml": dctWithGroups("data-model", [
        {
          name: "業務データ辞書",
          base_path: "later-path",
          deliverables: [deliverable("stsd-x")],
        },
      ]),
      "dct-data-model-bdd.yaml": dctWithGroups("data-model", [
        {
          name: "業務データ辞書",
          base_path: "first-path",
          deliverables: [deliverable("bdd-x")],
        },
      ]),
      "dct-data-model-sld.yaml": dctWithGroups("data-model", [
        { name: "業務データ辞書", deliverables: [deliverable("sld-x")] },
      ]),
      "dct-data-model-cdsd.yaml": dctWithGroups("data-model", [
        { name: "業務データ辞書", deliverables: [deliverable("cdsd-x")] },
      ]),
      "dct-data-model-cld.yaml": dctWithGroups("data-model", [
        { name: "業務データ辞書", deliverables: [deliverable("cld-x")] },
      ]),
    });

    const merged = mergeDomainCatalogs(loadCatalogDocs(catalogPath));

    expect(merged).toHaveLength(1);
    expect(merged[0].domain).toBe("data-model");
    expect(merged[0].files).toEqual([
      "dct-data-model-bdd.yaml",
      "dct-data-model-cdsd.yaml",
      "dct-data-model-cld.yaml",
      "dct-data-model-sld.yaml",
      "dct-data-model-stsd.yaml",
    ]);
    expect(merged[0].doc.groups).toHaveLength(1);
    expect(merged[0].doc.groups[0].base_path).toBe("first-path");
    expect(merged[0].doc.groups[0].deliverables?.map((item) => item.local_id)).toEqual([
      "bdd-x",
      "cdsd-x",
      "cld-x",
      "sld-x",
      "stsd-x",
    ]);
    expect(merged[0].errors).toEqual([]);
  });

  it("merges same-name nested groups recursively", () => {
    const catalogPath = makeCatalog({
      "dct-data-model-a.yaml": dctWithGroups("data-model", [
        {
          name: "データモデル",
          groups: [{ name: "業務データ辞書", deliverables: [deliverable("dictionary-a")] }],
        },
      ]),
      "dct-data-model-b.yaml": dctWithGroups("data-model", [
        {
          name: "データモデル",
          groups: [
            { name: "業務データ辞書", deliverables: [deliverable("dictionary-b")] },
            { name: "概念モデル", deliverables: [deliverable("conceptual-b")] },
          ],
        },
      ]),
    });

    const [merged] = mergeDomainCatalogs(loadCatalogDocs(catalogPath));

    expect(merged.doc.groups).toHaveLength(1);
    expect(merged.doc.groups[0].groups?.map((group) => group.name)).toEqual([
      "業務データ辞書",
      "概念モデル",
    ]);
    expect(merged.doc.groups[0].groups?.[0].deliverables?.map((item) => item.local_id)).toEqual([
      "dictionary-a",
      "dictionary-b",
    ]);
  });

  it("keeps differently named and unnamed groups separate", () => {
    const catalogPath = makeCatalog({
      "dct-data-model-a.yaml": dctWithGroups("data-model", [
        { name: "業務データ辞書", deliverables: [deliverable("dictionary-a")] },
        { deliverables: [deliverable("unnamed-a")] },
      ]),
      "dct-data-model-b.yaml": dctWithGroups("data-model", [
        { name: "概念モデル", deliverables: [deliverable("conceptual-b")] },
        { deliverables: [deliverable("unnamed-b")] },
      ]),
    });

    const [merged] = mergeDomainCatalogs(loadCatalogDocs(catalogPath));

    expect(merged.doc.groups.map((group) => group.name)).toEqual([
      "業務データ辞書",
      undefined,
      "概念モデル",
      undefined,
    ]);
  });

  it("does not merge duplicate group names within a single file", () => {
    const groups: DctSection[] = [
      { name: "既存章", deliverables: [deliverable("one")] },
      { name: "既存章", deliverables: [deliverable("two")] },
    ];
    const catalogPath = makeCatalog({
      "dct-data-model.yaml": dctWithGroups("data-model", groups),
    });

    const [merged] = mergeDomainCatalogs(loadCatalogDocs(catalogPath));

    expect(merged.doc.groups).toEqual(groups);
  });

  it("keeps distinct domains as separate catalogs", () => {
    const catalogPath = makeCatalog({
      "dct-alpha.yaml": dctYaml("alpha", ["a"]),
      "dct-beta.yaml": dctYaml("beta", ["b"]),
    });

    const merged = mergeDomainCatalogs(loadCatalogDocs(catalogPath));

    expect(merged.map((m) => m.domain)).toEqual(["alpha", "beta"]);
    expect(merged.every((m) => m.errors.length === 0)).toBe(true);
  });

  it("reports a duplicate local_id shared across same-domain parts", () => {
    const catalogPath = makeCatalog({
      "dct-data-model-a.yaml": dctYaml("data-model", ["dup"]),
      "dct-data-model-b.yaml": dctYaml("data-model", ["dup"]),
    });

    const merged = mergeDomainCatalogs(loadCatalogDocs(catalogPath));

    expect(merged[0].errors.some((e) => /duplicate local_id 'dup'/.test(e))).toBe(true);
  });

  it("reports a base_path mismatch between same-domain parts", () => {
    const catalogPath = makeCatalog({
      "dct-data-model-a.yaml": dctYaml("data-model", ["a"], { basePath: "/docs/one" }),
      "dct-data-model-b.yaml": dctYaml("data-model", ["b"], { basePath: "/docs/two" }),
    });

    const merged = mergeDomainCatalogs(loadCatalogDocs(catalogPath));

    expect(merged[0].errors.some((e) => /base_path mismatch/.test(e))).toBe(true);
  });
});

describe("buildCatalog", () => {
  it("emits one dct-<domain>.md per domain, merging split parts", () => {
    const catalogPath = makeCatalog({
      "dct-data-model-sales.yaml": dctYaml("data-model", ["sales-x"], {
        groupName: "業務データ辞書",
      }),
      "dct-data-model-buy.yaml": dctYaml("data-model", ["buy-x"], {
        groupName: "業務データ辞書",
      }),
    });

    const { generated, errors } = buildCatalog(catalogPath);

    expect(errors).toEqual([]);
    const names = readdirSync(join(catalogPath, "generated")).sort();
    expect(names).toEqual(["dct-data-model.md"]);
    const md = readFileSync(join(catalogPath, "generated", "dct-data-model.md"), "utf8");
    // Both parts' deliverables appear in one merged catalog, buy before sales.
    expect(md).toContain("`buy-x`");
    expect(md).toContain("`sales-x`");
    expect(md.indexOf("buy-x")).toBeLessThan(md.indexOf("sales-x"));
    expect(md.match(/業務データ辞書/g)).toHaveLength(1);
    expect(generated).toHaveLength(1);
  });

  it("keeps a single-file domain producing the same dct-<domain>.md (backward compatible)", () => {
    const catalogPath = makeCatalog({
      "dct-glossary.yaml": dctYaml("glossary", ["term-a"]),
    });

    const { generated } = buildCatalog(catalogPath);

    expect(generated.map((p) => p.endsWith("dct-glossary.md"))).toEqual([true]);
  });

  it("skips output and reports errors when same-domain parts collide", () => {
    const catalogPath = makeCatalog({
      "dct-data-model-a.yaml": dctYaml("data-model", ["dup"]),
      "dct-data-model-b.yaml": dctYaml("data-model", ["dup"]),
    });

    const { generated, errors } = buildCatalog(catalogPath);

    expect(generated).toEqual([]);
    expect(errors.some((e) => /duplicate local_id 'dup'/.test(e))).toBe(true);
  });

  it("builds the seven kind-split data-model templates as two chapters", () => {
    root = mkdtempSync(join(tmpdir(), "specdojo-template-merge-"));
    const catalogPath = join(root, "catalog");
    const scaffolded = runScaffold({
      catalogPath,
      templatesPath: resolve("docs/ja/specdojo/templates"),
      size: "large",
      projectId: "prj-0001",
      domains: ["data-model"],
      variables: { TERM: "sample" },
      force: false,
    });

    expect(scaffolded.errors).toEqual([]);
    expect(scaffolded.written.map((path) => basename(path)).sort()).toEqual([
      "dct-data-model-bdd.yaml",
      "dct-data-model-ccd.yaml",
      "dct-data-model-cdsd.yaml",
      "dct-data-model-cld.yaml",
      "dct-data-model-cstd.yaml",
      "dct-data-model-sld.yaml",
      "dct-data-model-stsd.yaml",
    ]);

    const { generated, errors } = buildCatalog(catalogPath);
    expect(errors).toEqual([]);
    expect(generated).toHaveLength(1);

    const md = readFileSync(generated[0], "utf8");
    expect(md.match(/^## \d+\. 業務データ辞書$/gm)).toHaveLength(1);
    expect(md.match(/^## \d+\. 概念モデル$/gm)).toHaveLength(1);
    const dictionaryPositions = [
      "bdd-sample",
      "cdsd-sample",
      "cld-sample",
      "sld-sample",
      "stsd-sample",
    ].map((id) => md.indexOf(id));
    expect(dictionaryPositions.every((position) => position >= 0)).toBe(true);
    expect(dictionaryPositions).toEqual([...dictionaryPositions].sort((a, b) => a - b));
  });
});
