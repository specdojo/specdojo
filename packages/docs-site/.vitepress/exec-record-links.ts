import { posix as path } from "node:path";

export type GitHubSource = {
  repositoryUrl: string;
  branch: string;
};

type WikilinkTarget = {
  displayText: string;
  href: string;
};

const EXEC_RECORD_PATH = /(^|\/)execution\/exec\/(?:plans|results)\/[^/]+\.md$/;

function stripEntryLineSuffix(entry: string): string {
  const colonIndex = entry.lastIndexOf(":");
  const hasLine = colonIndex > 0 && /^\d+$/.test(entry.slice(colonIndex + 1));
  return hasLine ? entry.slice(0, colonIndex) : entry;
}

function isExecPlanOrResultPath(repositoryPath: string): boolean {
  return EXEC_RECORD_PATH.test(repositoryPath);
}

function githubBlobUrl(repositoryPath: string, source: GitHubSource): string {
  const repositoryUrl = source.repositoryUrl.replace(/\/+$/, "");
  return `${repositoryUrl}/blob/${source.branch}/${repositoryPath}`;
}

function toRepositoryPath(currentRelPath: string, hrefPath: string): string | undefined {
  const normalizedCurrentPath = currentRelPath.replace(/\\/g, "/");
  const normalizedHrefPath = hrefPath.replace(/\\/g, "/");
  const sitePath = normalizedHrefPath.startsWith("/")
    ? path.normalize(normalizedHrefPath.slice(1))
    : path.normalize(path.join(path.dirname(normalizedCurrentPath), normalizedHrefPath));

  if (sitePath === ".." || sitePath.startsWith("../")) return undefined;
  return sitePath.startsWith("docs/") ? sitePath : `docs/${sitePath}`;
}

export function rewriteExecRecordMarkdownHref(
  href: string,
  currentRelPath: string,
  source: GitHubSource,
): string {
  if (
    href === "" ||
    href.startsWith("#") ||
    href.startsWith("//") ||
    /^[a-z][a-z+.-]*:/i.test(href)
  ) {
    return href;
  }

  const match = href.match(/^([^?#]*)([?#].*)?$/);
  if (!match || match[1] === "") return href;

  const repositoryPath = toRepositoryPath(currentRelPath, match[1]);
  if (!repositoryPath || !isExecPlanOrResultPath(repositoryPath)) return href;

  return `${githubBlobUrl(repositoryPath, source)}${match[2] ?? ""}`;
}

export function resolveExecRecordWikilink(
  inner: string,
  docIndex: Readonly<Record<string, string>>,
  source: GitHubSource,
): WikilinkTarget | undefined {
  const pipeIndex = inner.indexOf("|");
  const id = pipeIndex === -1 ? inner : inner.slice(0, pipeIndex);
  const displayText = pipeIndex === -1 ? id : inner.slice(pipeIndex + 1);
  if (!/^[a-z][a-z0-9:_-]+$/.test(id)) return undefined;

  const entry = docIndex[id];
  if (!entry) return undefined;
  const repositoryPath = stripEntryLineSuffix(entry).replace(/\\/g, "/").replace(/^\.\//, "");
  if (!isExecPlanOrResultPath(repositoryPath)) return undefined;

  return {
    displayText,
    href: githubBlobUrl(repositoryPath, source),
  };
}
