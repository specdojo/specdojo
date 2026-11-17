import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const entry = resolve("src/specdojo.ts");
const tsx = resolve("node_modules/tsx/dist/loader.mjs");
const kinds = ["exec", "catalog", "schedule", "timeline", "job", "routine"] as const;
let root: string;

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "specdojo-where-"));
  mkdirSync(join(root, ".specdojo"));
  writeFileSync(
    join(root, ".specdojo/specdojo.config.json"),
    JSON.stringify({
      version: 1,
      current_project: "prj-test",
      projects: {
        "prj-test": {
          base_path: "project",
          catalog_path: "catalog",
          schedule_path: "schedule",
          execution_path: "execution",
          jobs_path: "jobs",
          routines_path: "routines",
        },
        "prj-empty": { base_path: "empty", schedule_path: "schedule" },
      },
    }),
  );
  for (const dir of ["schedule", "routines/sub", "catalog", "jobs"]) {
    mkdirSync(join(root, "project", dir), { recursive: true });
  }
  for (const file of [
    "schedule/sch-track-z.yaml",
    "schedule/sch-track-a.yaml",
    "schedule/sch-strategy-z.yaml",
    "schedule/ignored.yaml",
    "routines/sub/rtn-example.yml",
    "routines/ignored.yaml",
  ]) {
    writeFileSync(join(root, "project", file), "");
  }
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

function run(args: string[], env: NodeJS.ProcessEnv = {}) {
  const cleanEnv = Object.fromEntries(
    Object.entries(process.env).filter(([name]) => !name.startsWith("SPECDOJO_")),
  );
  const result = spawnSync(process.execPath, ["--import", tsx, entry, ...args], {
    cwd: root,
    encoding: "utf8",
    env: { ...cleanEnv, XDG_STATE_HOME: join(root, "local-state"), ...env },
    timeout: 20_000,
  });
  if (result.error) throw result.error;
  return result;
}

describe("specdojo where", () => {
  it.each(kinds)("preserves %s output and keeps its deprecated alias for one release", (kind) => {
    const before = readdirSync(root, { recursive: true }).sort();
    const result = run(["where", kind, "--project", "prj-test"]);
    const alias = run([kind, "where", "--project", "prj-test"]);
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain(join(root, "project"));
    expect(alias.status).toBe(result.status);
    expect(alias.stdout).toBe(result.stdout);
    expect(alias.stderr).toContain(`WARN: ${kind} where is deprecated.`);
    expect(alias.stderr).toContain(`Use specdojo where ${kind}.`);
    expect(alias.stderr).toContain("removed after one release");
    expect(readdirSync(root, { recursive: true }).sort()).toEqual(before);
    if (kind === "exec") {
      expect(result.stdout).toContain(join(root, "project/execution/exec/events"));
      expect(result.stdout).toContain(join(root, "project/execution/generated"));
      expect(result.stdout).toContain("scheduler-lock:");
    }
    if (kind === "schedule") {
      expect(result.stdout).toContain("strategy-files:\n  - sch-strategy-z.yaml");
      expect(result.stdout).toContain("track-files:\n  - sch-track-a.yaml\n  - sch-track-z.yaml");
      expect(result.stdout).not.toContain("ignored.yaml");
    }
    if (kind === "timeline") expect(result.stdout).toContain("tml-index.yaml (does not exist)");
    if (kind === "catalog") expect(result.stdout).toContain("plans       :");
    if (kind === "job") expect(result.stdout).toContain(join(root, "project/execution/jobs/runs"));
    if (kind === "routine") {
      expect(result.stdout).toContain(join(root, "local-state"));
      expect(result.stdout).toContain(join(root, "project/routines/sub/rtn-example.yml"));
      expect(result.stdout).not.toContain("ignored.yaml");
    }
  });

  it.each(kinds)("preserves %s failure output and status for an unknown project", (kind) => {
    const result = run(["where", kind, "--project", "unknown"]);
    const alias = run([kind, "where", "--project", "unknown"]);
    expect(result.status).toBe(1);
    expect(result.stdout + result.stderr).toContain("unknown");
    expect(alias.status).toBe(1);
    expect(alias.stdout).toBe(result.stdout);
    expect(alias.stderr.split("\n").slice(1).join("\n")).toBe(result.stderr);
  });

  it("honors the environment project and lets --project override it", () => {
    const result = run(["where", "schedule"], { SPECDOJO_PROJECT: "prj-empty" });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain(join(root, "empty/schedule"));
    expect(result.stdout).toContain("(path does not exist)");
    const explicit = run(["where", "schedule", "--project", "prj-test"], {
      SPECDOJO_PROJECT: "prj-empty",
    });
    expect(explicit.status).toBe(0);
    expect(explicit.stdout).toContain(join(root, "project/schedule"));
  });

  it.each(["catalog", "job", "routine"])("reports unconfigured %s paths", (kind) => {
    const result = run(["where", kind, "--project", "prj-empty"]);
    expect(result.status).toBe(1);
    expect(result.stdout + result.stderr).toContain("not set");
  });

  it.each([{ args: [] }, { args: ["unknown"] }])(
    "rejects a missing or unknown kind: %j",
    ({ args }) => {
      const result = run(["where", ...args]);
      expect(result.status).toBe(1);
      expect(result.stderr).toContain("error:");
      expect(result.stdout).toBe("");
    },
  );

  it("lists all six choices in help", () => {
    const result = run(["where", "--help"]);
    expect(result.status).toBe(0);
    for (const kind of kinds) expect(result.stdout).toContain(`"${kind}"`);
  });

  it.each(kinds)("hides the deprecated %s alias from normal help", (kind) => {
    const result = run([kind, "--help"]);
    expect(result.status).toBe(0);
    expect(result.stdout).not.toMatch(/^\s+where\b/m);
  });
});
