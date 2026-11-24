import { describe, expect, it } from "vitest";
import {
  channelHeadTags,
  DEFAULT_SITE_BASE,
  DEFAULT_STABLE_URL,
  resolveSiteChannel,
} from "../../../packages/docs-site/.vitepress/site-channel.js";

describe("resolveSiteChannel", () => {
  it("keeps the stable channel at the default base when nothing is set", () => {
    expect(resolveSiteChannel({})).toEqual({
      base: DEFAULT_SITE_BASE,
      channel: "stable",
      stableUrl: DEFAULT_STABLE_URL,
    });
  });

  it("builds the next channel under the given base", () => {
    const config = resolveSiteChannel({
      SPECDOJO_DOCS_CHANNEL: "next",
      SPECDOJO_DOCS_BASE: "/specdojo/next/",
    });

    expect(config).toEqual({
      base: "/specdojo/next/",
      channel: "next",
      stableUrl: DEFAULT_STABLE_URL,
    });
  });

  it("adds the trailing slash to the base", () => {
    expect(resolveSiteChannel({ SPECDOJO_DOCS_BASE: "/docs/next" }).base).toBe("/docs/next/");
  });

  it("uses the configured stable URL for the link back to the release", () => {
    expect(
      resolveSiteChannel({ SPECDOJO_DOCS_STABLE_URL: "https://example.com/docs/" }).stableUrl,
    ).toBe("https://example.com/docs/");
  });

  it("rejects an unknown channel", () => {
    expect(() => resolveSiteChannel({ SPECDOJO_DOCS_CHANNEL: "beta" })).toThrow(
      /SPECDOJO_DOCS_CHANNEL must be "stable" or "next": beta/,
    );
  });

  it("rejects a base without a leading slash", () => {
    expect(() => resolveSiteChannel({ SPECDOJO_DOCS_BASE: "specdojo/next/" })).toThrow(
      /SPECDOJO_DOCS_BASE must start with "\/"/,
    );
  });
});

describe("channelHeadTags", () => {
  it("keeps the stable site indexable", () => {
    expect(channelHeadTags(resolveSiteChannel({}))).toEqual([]);
  });

  it("hides the next site from search engines", () => {
    expect(channelHeadTags(resolveSiteChannel({ SPECDOJO_DOCS_CHANNEL: "next" }))).toEqual([
      ["meta", { name: "robots", content: "noindex, nofollow" }],
    ]);
  });
});
