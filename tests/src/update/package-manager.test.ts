import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  buildInstallCommands,
  detectPackageManager,
  findDeclaredDependency,
  type InstallTarget,
} from "../../../src/update/package-manager.js";

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "specdojo-update-pm-"));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("detectPackageManager", () => {
  it.each([
    ["pnpm-lock.yaml", "pnpm"],
    ["yarn.lock", "yarn"],
    ["package-lock.json", "npm"],
  ])("detects %s as %s", async (lockfile, manager) => {
    await writeFile(path.join(dir, lockfile), "", "utf8");

    expect(detectPackageManager(dir)).toEqual({ manager, lockfile });
  });

  it("falls back to npm without a lockfile", () => {
    expect(detectPackageManager(dir)).toEqual({ manager: "npm", lockfile: undefined });
  });
});

describe("findDeclaredDependency", () => {
  it("reports the section and the form of the declared spec", () => {
    const packageJson = {
      dependencies: { "@specdojo/docs-site": "~0.6.0" },
      devDependencies: { specdojo: "^0.9.1", "@specdojo/docs-lint": "0.5.0" },
    };

    expect(findDeclaredDependency(packageJson, "specdojo")).toEqual({
      name: "specdojo",
      section: "devDependencies",
      spec: "^0.9.1",
      form: "caret",
    });
    expect(findDeclaredDependency(packageJson, "@specdojo/docs-lint")?.form).toBe("exact");
    expect(findDeclaredDependency(packageJson, "@specdojo/docs-site")).toMatchObject({
      section: "dependencies",
      form: "tilde",
    });
    expect(findDeclaredDependency(packageJson, "missing")).toBeUndefined();
  });
});

function target(
  name: string,
  spec: string,
  version: string,
  section: "dependencies" | "devDependencies" = "devDependencies",
): InstallTarget {
  const dependency = findDeclaredDependency({ [section]: { [name]: spec } }, name)!;
  return { dependency, version };
}

describe("buildInstallCommands", () => {
  it("keeps caret ranges and pins exact versions with npm", () => {
    const commands = buildInstallCommands("npm", [
      target("specdojo", "^0.9.1", "0.9.2"),
      target("@specdojo/docs-lint", "0.5.0", "0.5.1"),
    ]);

    expect(commands).toEqual([
      {
        command: "npm",
        args: ["install", "--save-dev", "--save-exact", "@specdojo/docs-lint@0.5.1"],
      },
      { command: "npm", args: ["install", "--save-dev", "specdojo@^0.9.2"] },
    ]);
  });

  it("uses each package manager's flags for dev and exact installs", () => {
    const targets = [target("specdojo", "0.9.1", "0.9.2")];

    expect(buildInstallCommands("pnpm", targets)).toEqual([
      { command: "pnpm", args: ["add", "-D", "--save-exact", "specdojo@0.9.2"] },
    ]);
    expect(buildInstallCommands("yarn", targets)).toEqual([
      { command: "yarn", args: ["add", "--dev", "--exact", "specdojo@0.9.2"] },
    ]);
  });

  it("keeps tilde ranges and production dependencies", () => {
    expect(
      buildInstallCommands("npm", [target("specdojo", "~0.9.1", "0.9.2", "dependencies")]),
    ).toEqual([{ command: "npm", args: ["install", "specdojo@~0.9.2"] }]);
  });

  it("passes a tarball path as is", () => {
    const tarball = {
      ...target("specdojo", "^0.9.1", "0.9.3"),
      tarballPath: "/tmp/specdojo-0.9.3.tgz",
    };

    expect(buildInstallCommands("npm", [tarball])).toEqual([
      { command: "npm", args: ["install", "--save-dev", "/tmp/specdojo-0.9.3.tgz"] },
    ]);
  });
});
