#!/usr/bin/env bash
# Bring the base branch's latest commits into the current worktree.
#
# `specdojo exec worktree merge` only goes the other way (exec branch → current
# branch), so pulling the base branch into a worktree is a plain Git operation.
# This script wraps it with the safety checks that are easy to forget: refusing
# to run on a dirty tree, refusing to sync a branch onto itself, and reminding
# you to regenerate build outputs when commits were actually brought in.
#
# The base branch defaults to whatever the main worktree has checked out, so
# this stays project-agnostic. Override it with --base or
# SPECDOJO_WORKTREE_BASE_BRANCH.
#
# Usage:
#   tools/worktree/sync.sh                     # merge the base branch
#   tools/worktree/sync.sh --rebase            # rebase onto the base branch
#   tools/worktree/sync.sh --fetch             # fetch origin first, merge origin/<base>
#   tools/worktree/sync.sh --base main         # sync from an explicit branch
#   tools/worktree/sync.sh --dry-run           # show incoming commits only

set -euo pipefail

base_branch="${SPECDOJO_WORKTREE_BASE_BRANCH:-}"
mode="merge"
do_fetch="false"
dry_run="false"

while [ $# -gt 0 ]; do
  case "$1" in
    --base)
      base_branch="${2:-}"
      if [ -z "$base_branch" ]; then
        echo "--base requires a branch name" >&2
        exit 2
      fi
      shift 2
      ;;
    --rebase)
      mode="rebase"
      shift
      ;;
    --fetch)
      do_fetch="true"
      shift
      ;;
    --dry-run)
      dry_run="true"
      shift
      ;;
    -h | --help)
      sed -n '2,20p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *)
      echo "unknown option: $1" >&2
      echo "usage: tools/worktree/sync.sh [--base <branch>] [--rebase] [--fetch] [--dry-run]" >&2
      exit 2
      ;;
  esac
done

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "not a Git repository" >&2
  exit 1
fi

current_branch="$(git rev-parse --abbrev-ref HEAD)"
if [ "$current_branch" = "HEAD" ]; then
  echo "HEAD is detached; check out a branch before syncing" >&2
  exit 1
fi

# Default to the branch the main worktree is on. Worktrees share refs, so that
# branch is reachable from here without fetching.
if [ -z "$base_branch" ]; then
  main_worktree="$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")"
  base_branch="$(git -C "$main_worktree" rev-parse --abbrev-ref HEAD)"
  if [ "$base_branch" = "HEAD" ]; then
    echo "main worktree is on a detached HEAD; pass --base <branch>" >&2
    exit 1
  fi
fi

if [ "$do_fetch" = "true" ]; then
  echo "fetching origin/$base_branch"
  git fetch origin "$base_branch"
  merge_ref="origin/$base_branch"
else
  merge_ref="$base_branch"
fi

if [ "$merge_ref" = "$current_branch" ]; then
  echo "current branch is already $current_branch; nothing to sync" >&2
  exit 1
fi

if ! git rev-parse --verify --quiet "$merge_ref" >/dev/null; then
  echo "base ref not found: $merge_ref" >&2
  exit 1
fi

incoming="$(git rev-list --count "HEAD..$merge_ref")"

if [ "$incoming" = "0" ]; then
  echo "already up to date with $merge_ref"
  exit 0
fi

echo "incoming commits from $merge_ref ($incoming):"
git log --oneline --no-decorate "HEAD..$merge_ref"

if [ "$dry_run" = "true" ]; then
  echo
  echo "dry-run: would $mode $merge_ref into $current_branch"
  exit 0
fi

# A dirty tree turns a rename-heavy sync into an avoidable conflict mess.
if [ -n "$(git status --porcelain)" ]; then
  echo >&2
  echo "working tree has uncommitted changes; commit or stash them first" >&2
  git status --short >&2
  exit 1
fi

echo
echo "$mode $merge_ref into $current_branch"
if [ "$mode" = "rebase" ]; then
  git rebase "$merge_ref"
else
  git merge --no-edit "$merge_ref"
fi

echo
echo "synced $incoming commit(s). Regenerate build outputs before continuing:"
echo "  npm run build && npm run docs:generate"
