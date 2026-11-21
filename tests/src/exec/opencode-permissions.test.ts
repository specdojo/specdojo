import { describe, expect, it } from "vitest";
import {
  opencodeAgentNameFromCommand,
  opencodeEditPattern,
  opencodeExtraRootConfig,
  opencodeExternalDirectoryPattern,
} from "../../../src/exec/opencode-permissions.js";

describe("opencodeAgentNameFromCommand", () => {
  it("reads --agent <name>, --agent=<name>, and a quoted name", () => {
    expect(opencodeAgentNameFromCommand("opencode run --agent opencode-executor --model m")).toBe(
      "opencode-executor",
    );
    expect(opencodeAgentNameFromCommand("opencode run --agent=opencode-reporter")).toBe(
      "opencode-reporter",
    );
    expect(opencodeAgentNameFromCommand("opencode run --agent 'opencode-review-executor'")).toBe(
      "opencode-review-executor",
    );
  });

  it("returns undefined without an agent", () => {
    expect(opencodeAgentNameFromCommand("opencode run --model m")).toBeUndefined();
  });
});

describe("opencode permission patterns", () => {
  it("uses the absolute path for external_directory", () => {
    expect(opencodeExternalDirectoryPattern("/work/task/app1")).toBe("/work/task/app1/**");
  });

  it("uses the path relative to the working directory for edit", () => {
    expect(opencodeEditPattern("/work/task/app1", "/work/task/project")).toBe("../app1/**");
    expect(opencodeEditPattern("/work/product", "/work/task/project")).toBe("../../product/**");
  });
});

describe("opencodeExtraRootConfig", () => {
  it("rejects an inherited value that is not a JSON object", () => {
    expect(() => opencodeExtraRootConfig("[]", "a", ["/x"], "/w")).toThrow(
      /Invalid OPENCODE_CONFIG_CONTENT: top-level value must be an object/,
    );
    expect(() => opencodeExtraRootConfig("{", "a", ["/x"], "/w")).toThrow(
      /Invalid OPENCODE_CONFIG_CONTENT/,
    );
  });
});
