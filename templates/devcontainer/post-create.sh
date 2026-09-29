#!/usr/bin/env bash
set -euo pipefail

# Some installers place binaries under ~/.local/bin.
if [ -d "${HOME}/.local/bin" ]; then
  export PATH="${HOME}/.local/bin:${PATH}"
fi

WORKSPACE_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

# Keep safe.directory entries unique to avoid unbounded growth across rebuilds.
SAFE_DIRS="$(git config --global --get-all safe.directory 2>/dev/null || true)"
if [ -n "$SAFE_DIRS" ]; then
  git config --global --unset-all safe.directory || true
  while IFS= read -r dir; do
    [ -n "$dir" ] || continue
    git config --global --add safe.directory "$dir"
  done < <(printf '%s\n%s\n' "$SAFE_DIRS" "$WORKSPACE_DIR" | awk '!seen[$0]++')
else
  git config --global --add safe.directory "$WORKSPACE_DIR"
fi

git config --global core.quotepath false
git config --global core.autocrlf input

npm install
