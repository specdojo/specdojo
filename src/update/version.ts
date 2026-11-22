// specdojo update の版の比較と CHANGELOG の範囲の切り出し。

export interface ParsedVersion {
  major: number;
  minor: number;
  patch: number;
  prerelease: string[];
}

const VERSION_PATTERN = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/u;

export function parseVersion(value: string): ParsedVersion | undefined {
  const match = VERSION_PATTERN.exec(value.trim());
  if (!match) return undefined;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4] ? match[4].split(".") : [],
  };
}

function comparePrereleaseIdentifier(left: string, right: string): number {
  const leftNumeric = /^\d+$/u.test(left);
  const rightNumeric = /^\d+$/u.test(right);
  if (leftNumeric && rightNumeric) return Number(left) - Number(right);
  if (leftNumeric) return -1;
  if (rightNumeric) return 1;
  return left < right ? -1 : left > right ? 1 : 0;
}

/** semver の優先順位で比べる。負なら left が古く、正なら left が新しい。 */
export function compareVersions(left: string, right: string): number {
  const a = parseVersion(left);
  const b = parseVersion(right);
  if (!a || !b) {
    throw new Error(`Cannot compare versions: ${left} and ${right}`);
  }
  for (const key of ["major", "minor", "patch"] as const) {
    if (a[key] !== b[key]) return a[key] - b[key];
  }
  if (a.prerelease.length === 0 || b.prerelease.length === 0) {
    // 正式版はその prerelease より新しい。
    return b.prerelease.length - a.prerelease.length;
  }
  const length = Math.max(a.prerelease.length, b.prerelease.length);
  for (let index = 0; index < length; index += 1) {
    const leftPart = a.prerelease[index];
    const rightPart = b.prerelease[index];
    if (leftPart === undefined) return -1;
    if (rightPart === undefined) return 1;
    const diff = comparePrereleaseIdentifier(leftPart, rightPart);
    if (diff !== 0) return diff;
  }
  return 0;
}

export interface ChangelogSection {
  version: string;
  /** 見出しの行（`## [0.9.2] - 2026-11-21`）を含む節の本文。末尾の空行は除く。 */
  body: string;
}

const SECTION_HEADING = /^## \[([^\]]+)\]/u;

/** CHANGELOG.md を `## [版]` の見出しで分ける。`[Unreleased]` など版でない節は除く。 */
export function parseChangelogSections(changelog: string): ChangelogSection[] {
  const sections: ChangelogSection[] = [];
  let current: { version: string; lines: string[] } | undefined;
  const flush = (): void => {
    if (current && parseVersion(current.version)) {
      sections.push({ version: current.version, body: current.lines.join("\n").trimEnd() });
    }
  };
  for (const line of changelog.split(/\r?\n/u)) {
    const heading = SECTION_HEADING.exec(line);
    if (heading) {
      flush();
      current = { version: heading[1], lines: [line] };
      continue;
    }
    if (line.startsWith("# ")) {
      flush();
      current = undefined;
      continue;
    }
    current?.lines.push(line);
  }
  flush();
  return sections;
}

/** from より新しく to 以下の節を、古い版から順に返す。 */
export function changelogSectionsBetween(
  changelog: string,
  fromVersion: string,
  toVersion: string,
): ChangelogSection[] {
  return parseChangelogSections(changelog)
    .filter(
      (section) =>
        compareVersions(section.version, fromVersion) > 0 &&
        compareVersions(section.version, toVersion) <= 0,
    )
    .sort((a, b) => compareVersions(a.version, b.version));
}

export interface ChangelogLine {
  version: string;
  text: string;
}

/** 節の箇条書きの行のうち、語のどれかを含む行を返す。 */
export function changelogLinesMentioning(
  sections: readonly ChangelogSection[],
  terms: readonly string[],
): ChangelogLine[] {
  const needles = terms.filter((term) => term.trim() !== "");
  if (needles.length === 0) return [];
  const lines: ChangelogLine[] = [];
  for (const section of sections) {
    for (const line of section.body.split("\n")) {
      if (!line.startsWith("- ")) continue;
      if (needles.some((needle) => line.includes(needle))) {
        lines.push({ version: section.version, text: line });
      }
    }
  }
  return lines;
}

/**
 * update は設定ファイルを書き換えない。CHANGELOG のうち設定の手直しに関わる行を示すための語。
 */
export const CONFIG_CHANGELOG_TERMS: readonly string[] = [
  "specdojo.config.json",
  "specdojo.local.config.json",
  "exec-defaults.yaml",
  "agent-members.yaml",
  "pm-members.yaml",
  "command_template",
  "lefthook.yml",
];
