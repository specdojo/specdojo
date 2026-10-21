import { describe, expect, it } from "vitest";
import { load } from "../../../src/shared/yaml.js";

describe("YAML compatibility loader", () => {
  it("keeps an unquoted date as a Date while preserving a quoted date as a string", () => {
    expect(load("unquoted: 2026-10-15\nquoted: '2026-10-15'\n")).toEqual({
      unquoted: new Date("2026-10-15T00:00:00.000Z"),
      quoted: "2026-10-15",
    });
  });

  it("keeps merge-key behavior used by js-yaml 4", () => {
    expect(load("base: &base\n  owner: DEV\nitem:\n  <<: *base\n  priority: medium\n")).toEqual({
      base: { owner: "DEV" },
      item: { owner: "DEV", priority: "medium" },
    });
  });
});
