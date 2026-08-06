import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { buildCatalog, loadCatalogDocs, mergeDomainCatalogs } from "../../src/catalog-build.js";

let root: string;

afterEach(() => {
  if (root) rmSync(root, { recursive: true, force: true });
});

// Builds a minimal but schema-valid dct-<domain>.yaml with the given local_ids.
function dctYaml(
  domain: string,
  localIds: string[],
  opts: { basePath?: string; projectId?: string } = {},
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
    "  - deliverables:",
    deliverables,
    "",
  ].join("\n");
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
  it("merges same-domain parts into one catalog in sorted file order", () => {
    const catalogPath = makeCatalog({
      "dct-data-model-sales.yaml": dctYaml("data-model", ["sales-x"]),
      "dct-data-model-buy.yaml": dctYaml("data-model", ["buy-x"]),
    });

    const merged = mergeDomainCatalogs(loadCatalogDocs(catalogPath));

    expect(merged).toHaveLength(1);
    expect(merged[0].domain).toBe("data-model");
    // dct-data-model-buy.yaml sorts before dct-data-model-sales.yaml.
    expect(merged[0].files).toEqual(["dct-data-model-buy.yaml", "dct-data-model-sales.yaml"]);
    expect(merged[0].doc.groups).toHaveLength(2);
    expect(merged[0].errors).toEqual([]);
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
      "dct-data-model-sales.yaml": dctYaml("data-model", ["sales-x"]),
      "dct-data-model-buy.yaml": dctYaml("data-model", ["buy-x"]),
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
});
