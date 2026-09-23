#!/usr/bin/env bash
# Open an interactive agent in its persistent, consistently named worktree.

set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "usage: tools/worktree/open-agent-worktree.sh <worktree-name> <command> [args...]" >&2
  exit 2
fi

worktree_name="$1"
shift

case "$worktree_name" in
  *[!a-z0-9-]* | "")
    echo "invalid worktree name: $worktree_name" >&2
    exit 2
    ;;
esac

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "not a Git repository" >&2
  exit 1
fi

git_common_dir="$(git rev-parse --path-format=absolute --git-common-dir)"
main_worktree="$(dirname "$git_common_dir")"
worktree_path="$(dirname "$main_worktree")/worktrees/$worktree_name"
worktree_branch="worktree/$worktree_name"

if git -C "$worktree_path" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  worktree_common_dir="$(git -C "$worktree_path" rev-parse --path-format=absolute --git-common-dir)"
  if [ "$worktree_common_dir" != "$git_common_dir" ]; then
    echo "worktree path belongs to another Git repository: $worktree_path" >&2
    exit 1
  fi
  current_branch="$(git -C "$worktree_path" branch --show-current)"
  if [ "$current_branch" != "$worktree_branch" ]; then
    echo "worktree branch mismatch: path=$worktree_path actual=${current_branch:-detached} expected=$worktree_branch" >&2
    exit 1
  fi
else
  if [ -e "$worktree_path" ]; then
    echo "worktree path exists but is not a Git worktree: $worktree_path" >&2
    exit 1
  fi

  mkdir -p "$(dirname "$worktree_path")"
  if git show-ref --verify --quiet "refs/heads/$worktree_branch"; then
    git worktree add "$worktree_path" "$worktree_branch"
  else
    git worktree add -b "$worktree_branch" "$worktree_path"
  fi
fi

cd "$worktree_path"
exec "$@"
