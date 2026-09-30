import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { validateGlossaryReferences } from "../../../packages/docs-lint/src/validate-glossary-references.js";

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("glossary references validation", () => {
  it("validates valid glossary file without errors", () => {
    const directory = mkdtempSync(join(tmpdir(), "docs-lint-test-"));
    temporaryDirectories.push(directory);
    const file = join(directory, "gl-valid.yaml");

    writeFileSync(
      file,
      `
terms:
  - id: tm-actor
    term: アクター
    definition: テスト
  - id: tm-inventory
    term: 在庫
    category: tm-actor
    relatedTerms: [tm-actor]
`,
    );

    const errors = validateGlossaryReferences([file]);
    expect(errors).toHaveLength(0);
  });

  it("detects duplicate term IDs", () => {
    const directory = mkdtempSync(join(tmpdir(), "docs-lint-test-"));
    temporaryDirectories.push(directory);
    const file = join(directory, "gl-duplicate.yaml");

    writeFileSync(
      file,
      `
terms:
  - id: tm-actor
    term: アクター
  - id: tm-actor
    term: 重複アクター
`,
    );

    const errors = validateGlossaryReferences([file]);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("Duplicate term ID");
    expect(errors[0]).toContain("tm-actor");
  });

  it("detects invalid category reference", () => {
    const directory = mkdtempSync(join(tmpdir(), "docs-lint-test-"));
    temporaryDirectories.push(directory);
    const file = join(directory, "gl-invalid-category.yaml");

    writeFileSync(
      file,
      `
terms:
  - id: tm-inventory
    term: 在庫
    category: tm-nonexistent
`,
    );

    const errors = validateGlossaryReferences([file]);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("Invalid category reference");
    expect(errors[0]).toContain("tm-nonexistent");
  });

  it("detects invalid relatedTerms reference", () => {
    const directory = mkdtempSync(join(tmpdir(), "docs-lint-test-"));
    temporaryDirectories.push(directory);
    const file = join(directory, "gl-invalid-related.yaml");

    writeFileSync(
      file,
      `
terms:
  - id: tm-inventory
    term: 在庫
    relatedTerms: [tm-nonexistent]
`,
    );

    const errors = validateGlossaryReferences([file]);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("Invalid relatedTerms reference");
    expect(errors[0]).toContain("tm-nonexistent");
  });
});
