import { describe, expect, it } from "vitest";
import { mkdir, mkdtemp, rm, utimes, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  ensureFreshDistBuild,
  ensureFreshDistBuildForEntry,
  evaluateDistFreshness,
  inspectBuildFreshness,
  inspectDistEntryFreshness,
  resolveInvokedCommand,
  type DistFreshnessResult,
} from "../../src/dist-freshness.js";

async function createCheckout(options: {
  root: string;
  sourceMtime?: Date;
  distMtime?: Date;
  hasTypescript?: boolean;
}): Promise<void> {
  const { root, sourceMtime, distMtime, hasTypescript } = options;
  if (hasTypescript) {
    await mkdir(path.join(root, "node_modules", "typescript"), { recursive: true });
  }
  if (sourceMtime) {
    const sourceDir = path.join(root, "src");
    await mkdir(sourceDir, { recursive: true });
    const sourceFile = path.join(sourceDir, "specdojo.ts");
    await writeFile(sourceFile, "export const value = 1;\n", "utf8");
    await utimes(sourceFile, sourceMtime, sourceMtime);
  }
  if (distMtime) {
    const distDir = path.join(root, "dist");
    await mkdir(distDir, { recursive: true });
    const distFile = path.join(distDir, "specdojo.js");
    await writeFile(distFile, "export const value = 1;\n", "utf8");
    await utimes(distFile, distMtime, distMtime);
  }
}

async function withTempCheckout(
  options: { sourceMtime?: Date; distMtime?: Date; hasTypescript?: boolean },
  assert: (root: string) => void | Promise<void>,
): Promise<void> {
  const root = await mkdtemp(path.join(tmpdir(), "specdojo-dist-freshness-"));
  try {
    await createCheckout({ root, ...options });
    await assert(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

const oldTime = new Date("2026-08-15T12:33:00Z");
const newTime = new Date("2026-08-16T09:00:00Z");

describe("inspectBuildFreshness", () => {
  it("reports stale when the newest src file is newer than the newest dist file", async () => {
    await withTempCheckout({ sourceMtime: newTime, distMtime: oldTime }, (root) => {
      const actual = inspectBuildFreshness(root);

      expect(actual.status).toBe("stale");
      expect(actual.newestSourcePath).toBe(path.join(root, "src", "specdojo.ts"));
      expect(actual.newestDistPath).toBe(path.join(root, "dist", "specdojo.js"));
    });
  });

  it("reports up-to-date when dist is not older than src", async () => {
    await withTempCheckout({ sourceMtime: oldTime, distMtime: newTime }, (root) => {
      expect(inspectBuildFreshness(root).status).toBe("up-to-date");
    });
  });

  it("reports no-dist-output when the build output is missing", async () => {
    await withTempCheckout({ sourceMtime: newTime }, (root) => {
      expect(inspectBuildFreshness(root).status).toBe("no-dist-output");
    });
  });

  it("reports no-source-tree for a distributed package without src", async () => {
    await withTempCheckout({ distMtime: oldTime }, (root) => {
      expect(inspectBuildFreshness(root).status).toBe("no-source-tree");
    });
  });
});

describe("inspectDistEntryFreshness", () => {
  it("inspects the package root when the entry is dist/<name>.js", async () => {
    await withTempCheckout({ sourceMtime: newTime, distMtime: oldTime }, (root) => {
      const actual = inspectDistEntryFreshness(path.join(root, "dist", "specdojo.js"));

      expect(actual.status).toBe("stale");
      expect(actual.packageRoot).toBe(root);
    });
  });

  it("skips inspection when the entry is a TypeScript file run through tsx", async () => {
    await withTempCheckout({ sourceMtime: newTime, distMtime: oldTime }, (root) => {
      const actual = inspectDistEntryFreshness(path.join(root, "src", "specdojo.ts"));

      expect(actual.status).toBe("not-dist-entry");
    });
  });

  it("skips inspection when the entry is a .js file outside dist/", async () => {
    await withTempCheckout({ sourceMtime: newTime, distMtime: oldTime }, (root) => {
      const actual = inspectDistEntryFreshness(path.join(root, "bin", "specdojo.js"));

      expect(actual.status).toBe("not-dist-entry");
    });
  });
});

describe("resolveInvokedCommand", () => {
  it("returns the first non-option argument", () => {
    const actual = resolveInvokedCommand(["node", "dist/specdojo.js", "exec", "run", "--auto"]);

    expect(actual).toBe("exec");
  });

  it("skips leading options", () => {
    const actual = resolveInvokedCommand(["node", "dist/specdojo.js", "--verbose", "catalog"]);

    expect(actual).toBe("catalog");
  });

  it("returns undefined when no sub-command is given", () => {
    expect(resolveInvokedCommand(["node", "dist/specdojo.js"])).toBeUndefined();
  });
});

describe("evaluateDistFreshness", () => {
  const staleResult: DistFreshnessResult = {
    status: "stale",
    packageRoot: "/repo",
    newestSourcePath: "/repo/src/exec-run.ts",
    newestDistPath: "/repo/dist/exec-run.js",
  };

  it("blocks exec commands so configured validations are not silently skipped", () => {
    const actual = evaluateDistFreshness(
      staleResult,
      ["node", "/repo/dist/specdojo.js", "exec", "run", "--auto"],
      {},
    );

    expect(actual.action).toBe("block");
    expect(actual.action === "block" && actual.message).toContain("npm run build");
    expect(actual.action === "block" && actual.message).toContain("src/exec-run.ts");
  });

  it("warns for non-exec commands instead of blocking", () => {
    const actual = evaluateDistFreshness(
      staleResult,
      ["node", "/repo/dist/specdojo.js", "catalog", "validate"],
      {},
    );

    expect(actual.action).toBe("warn");
  });

  it("warns when dist output is missing", () => {
    const actual = evaluateDistFreshness(
      { status: "no-dist-output", packageRoot: "/repo", newestSourcePath: "/repo/src/exec.ts" },
      ["node", "/repo/dist/specdojo.js", "index", "build"],
      {},
    );

    expect(actual.action).toBe("warn");
    expect(actual.action === "warn" && actual.message).toContain("dist/ が存在しない");
  });

  it("does nothing for a distributed package without src", () => {
    const actual = evaluateDistFreshness({ status: "no-source-tree" }, ["node", "x", "exec"], {});

    expect(actual).toEqual({ action: "none" });
  });

  it("does nothing when the check is disabled by environment variable", () => {
    const actual = evaluateDistFreshness(staleResult, ["node", "x", "exec", "run"], {
      SPECDOJO_SKIP_DIST_FRESHNESS_CHECK: "1",
    });

    expect(actual).toEqual({ action: "none" });
  });
});

describe("ensureFreshDistBuild", () => {
  it("runs the build once when dist is stale", async () => {
    await withTempCheckout(
      { sourceMtime: newTime, distMtime: oldTime, hasTypescript: true },
      (root) => {
        const buildRoots: string[] = [];

        const actual = ensureFreshDistBuild(root, (packageRoot) => {
          buildRoots.push(packageRoot);
          return { status: 0 };
        });

        expect(actual.outcome).toBe("rebuilt");
        expect(buildRoots).toEqual([root]);
      },
    );
  });

  it("does not run the build when dist is up to date", async () => {
    await withTempCheckout(
      { sourceMtime: oldTime, distMtime: newTime, hasTypescript: true },
      (root) => {
        let buildCount = 0;

        const actual = ensureFreshDistBuild(root, () => {
          buildCount += 1;
          return { status: 0 };
        });

        expect(actual).toEqual({ outcome: "up-to-date" });
        expect(buildCount).toBe(0);
      },
    );
  });

  it("reports rebuild-failed with the exit code when the build fails", async () => {
    await withTempCheckout(
      { sourceMtime: newTime, distMtime: oldTime, hasTypescript: true },
      (root) => {
        const actual = ensureFreshDistBuild(root, () => ({ status: 2 }));

        expect(actual.outcome).toBe("rebuild-failed");
        expect(actual.message).toContain("終了コード 2");
      },
    );
  });

  it("skips the rebuild when typescript is not installed", async () => {
    await withTempCheckout({ sourceMtime: newTime, distMtime: oldTime }, (root) => {
      let buildCount = 0;

      const actual = ensureFreshDistBuild(root, () => {
        buildCount += 1;
        return { status: 0 };
      });

      expect(actual.outcome).toBe("rebuild-skipped");
      expect(buildCount).toBe(0);
    });
  });

  it("is a no-op for a distributed package without src", async () => {
    await withTempCheckout({ distMtime: oldTime, hasTypescript: true }, (root) => {
      const actual = ensureFreshDistBuild(root, () => ({ status: 0 }));

      expect(actual).toEqual({ outcome: "not-applicable" });
    });
  });
});

describe("ensureFreshDistBuildForEntry", () => {
  it("rebuilds when the entry is a stale dist entry", async () => {
    await withTempCheckout(
      { sourceMtime: newTime, distMtime: oldTime, hasTypescript: true },
      (root) => {
        const actual = ensureFreshDistBuildForEntry(path.join(root, "dist", "routine.js"), () => ({
          status: 0,
        }));

        expect(actual.outcome).toBe("rebuilt");
      },
    );
  });

  it("is a no-op when running from source through tsx", async () => {
    await withTempCheckout(
      { sourceMtime: newTime, distMtime: oldTime, hasTypescript: true },
      (root) => {
        let buildCount = 0;

        const actual = ensureFreshDistBuildForEntry(path.join(root, "src", "routine.ts"), () => {
          buildCount += 1;
          return { status: 0 };
        });

        expect(actual).toEqual({ outcome: "not-applicable" });
        expect(buildCount).toBe(0);
      },
    );
  });
});
