// Single source of truth for resolving catalog base_path / deliverable document paths.
// All results are canonical repo-root-relative paths: POSIX separators, no leading slash.
//
// A leading slash in a catalog base_path or item path means "anchored at the repo root"
// and is normalized away here so agents and tools resolve the path from the run CWD
// (repo root for in-place runs, worktree root otherwise) rather than the filesystem root.

// Combine a parent base_path with a section's base_path. A child starting with `/`
// re-anchors at the repo root (parent is discarded), otherwise it is appended.
export function resolveBasePath(parentBase: string, childBase: string | undefined): string {
  if (!childBase) return parentBase
  if (childBase.startsWith('/')) return childBase.slice(1)
  return parentBase ? `${parentBase}/${childBase}` : childBase
}

// Resolve a deliverable item's document path against its section base_path. An item
// without a path resolves to the section base; an item path starting with `/` re-anchors
// at the repo root.
export function resolveDeliverablePath(sectionBase: string, itemPath: string | undefined): string {
  if (!itemPath) return sectionBase
  if (itemPath.startsWith('/')) return itemPath.slice(1)
  return sectionBase ? `${sectionBase}/${itemPath}` : itemPath
}
