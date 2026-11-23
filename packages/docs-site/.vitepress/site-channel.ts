// 文書サイトの公開のパスと版の種類を環境変数から決める（PJR-98HS）。
//
// 本番（リリースの版）は既定のまま `/specdojo/` に公開する。開発中の版は
// `SPECDOJO_DOCS_CHANNEL=next` と `SPECDOJO_DOCS_BASE=/specdojo/next/` でビルドし、
// 本番のサイトの下に並べて置く。開発中の版では、帯とリリースの版へのリンクを出し、
// 検索エンジンに載せない。

export type SiteChannel = "stable" | "next";

export type SiteChannelConfig = {
  base: string;
  channel: SiteChannel;
  /** 開発中の版から戻るリリースの版の URL。本番では使わない。 */
  stableUrl: string;
};

export const DEFAULT_SITE_BASE = "/specdojo/";
export const DEFAULT_STABLE_URL = "https://specdojo.github.io/specdojo/";

function normalizeBase(value: string): string {
  const trimmed = value.trim();
  if (!trimmed.startsWith("/")) {
    throw new Error(`SPECDOJO_DOCS_BASE must start with "/": ${value}`);
  }
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

export function resolveSiteChannel(env: NodeJS.ProcessEnv = process.env): SiteChannelConfig {
  const rawChannel = env.SPECDOJO_DOCS_CHANNEL?.trim();
  if (rawChannel && rawChannel !== "stable" && rawChannel !== "next") {
    throw new Error(`SPECDOJO_DOCS_CHANNEL must be "stable" or "next": ${rawChannel}`);
  }
  const channel: SiteChannel = rawChannel === "next" ? "next" : "stable";
  const rawBase = env.SPECDOJO_DOCS_BASE?.trim();
  const base = rawBase ? normalizeBase(rawBase) : DEFAULT_SITE_BASE;
  const stableUrl = env.SPECDOJO_DOCS_STABLE_URL?.trim() || DEFAULT_STABLE_URL;
  return { base, channel, stableUrl };
}

/** 開発中の版だけに足す head の要素。本番では何も足さない。 */
export function channelHeadTags(config: SiteChannelConfig): [string, Record<string, string>][] {
  if (config.channel !== "next") return [];
  return [["meta", { name: "robots", content: "noindex, nofollow" }]];
}
