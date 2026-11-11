import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { gradeContentHash } from "../../../src/shared/grade-result.js";
import { writeGradeRunFixture } from "../../helpers/grade-run-fixture.js";

const entrypoint = resolve("src/specdojo.ts");
const tsxLoader = import.meta.resolve("tsx");

describe("YAML grade CLI", () => {
  it("lists, plans, runs, applies and reads YAML deliverables and samples", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-grade-yaml-cli-"));
    const write = (path: string, content: string) => {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      writeFileSync(join(root, path), content);
    };
    const cli = (...args: string[]) => {
      const result = spawnSync(
        process.execPath,
        ["--import", tsxLoader, entrypoint, "grade", ...args],
        {
          cwd: root,
          encoding: "utf8",
          timeout: 20000,
          env: process.env,
        },
      );
      expect(result.error, `${args.join(" ")}\n${result.error?.message}`).toBeUndefined();
      expect(result.status, `${args.join(" ")}\n${result.stderr}\n${result.stdout}`).toBe(0);
      return result.stdout;
    };
    try {
      writeGradeRunFixture(root);
      const targets = [
        { path: "docs/data.yaml", id: "test:data", target: "deliverable" },
        { path: "docs/api.yml", id: "test:api", target: "deliverable" },
        {
          path: "docs/ja/specdojo/samples/data-sample.yaml",
          id: "test:data-sample",
          target: "kata",
        },
      ];
      for (const { path, id } of targets) {
        write(
          path,
          path.endsWith(".yml")
            ? `---\nopenapi: 3.1.0\nx-spec-meta:\n  id: ${id}\n  type: api\n  status: draft\n  rulebook: none\npaths: {}\n`
            : `id: ${id}\ntype: data\nstatus: draft\nrulebook: none\nfields: []\n`,
        );
      }
      write(
        "catalog/dct-test.yaml",
        "version: 1\nproject_id: test\nbase_path: docs\ngroups:\n  - id: product\n    deliverables:\n      - local_id: data\n        path: data.yaml\n      - local_id: api\n        path: api.yml\n",
      );
      const selected = cli("list", "--target", "deliverable", "--project", "test");
      expect(selected).toContain("docs/data.yaml");
      expect(selected).toContain("docs/api.yml");
      for (const { path, id, target } of targets) {
        const before = readFileSync(join(root, path), "utf8");
        const selection = ["--target", target, "--project", "test", "--path", path];
        expect(cli("list", ...selection)).toContain(path);
        cli("plan", ...selection, "--out", "plans", "--embed-documents");
        cli("run", ...selection, "--run-id", id.replace(":", "-"), "--by", "actual-grader");
        const result = JSON.parse(cli("result", "--project", "test", "--path", path));
        expect(result).toMatchObject({
          document: id,
          path,
          target,
          content_hash: gradeContentHash(before),
          verdict: "pass",
        });
        write(
          "submission.json",
          JSON.stringify({
            rubric: "grade-rubric-v1",
            documents: [{ path, viewpoints: [{ id: "vp-content", level: 4, findings: [] }] }],
          }),
        );
        cli("apply", ...selection, "--from", "submission.json", "--by", "actual-grader");
        expect(readFileSync(join(root, path), "utf8")).toBe(before);
        expect(cli("list", ...selection, "--changed-only")).toBe("");
      }
      write("docs/no-meta.yaml", "settings: {}\n");
      expect(
        cli("list", "--target", "deliverable", "--project", "test", "--path", "docs/no-meta.yaml"),
      ).toBe("");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }, 120000);
});
