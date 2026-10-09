#!/usr/bin/env bash
set -euo pipefail

# Some installers place binaries under ~/.local/bin.
if [ -d "${HOME}/.local/bin" ]; then
  export PATH="${HOME}/.local/bin:${PATH}"
fi

# Docker creates named volume mount points as root when the image lacks them. Hand them back to
# the container user before git config and agent installers write into them.
for dir in \
  "${HOME}/.config" \
  "${HOME}/.config/git" \
  "${HOME}/.claude" \
  "${HOME}/.codex" \
  "${HOME}/.config/gh" \
  "${HOME}/.config/opencode" \
  "${HOME}/.local/share/opencode" \
  "${HOME}/.config/antigravity"; do
  if [ -d "$dir" ]; then
    sudo chown -R "$(id -u):$(id -g)" "$dir"
  fi
done

# Include the host ~/.gitconfig copied by Dev Containers at the top of the volume-backed global
# config, so identity and other host settings take effect while container-specific settings written
# below still win. A missing include file is ignored by git.
HOST_GIT_CONFIG="${HOME}/.gitconfig"
GIT_CONFIG_FILE="${GIT_CONFIG_GLOBAL:-}"
if [ -n "$GIT_CONFIG_FILE" ] && [ "$GIT_CONFIG_FILE" != "$HOST_GIT_CONFIG" ]; then
  touch "$GIT_CONFIG_FILE"
  include_paths="$(git config --file "$GIT_CONFIG_FILE" --get-all include.path || true)"
  if ! printf '%s\n' "$include_paths" | grep -qxF "$HOST_GIT_CONFIG"; then
    tmp="$(mktemp "${GIT_CONFIG_FILE}.XXXXXX")"
    { printf '[include]\n\tpath = %s\n' "$HOST_GIT_CONFIG"; cat "$GIT_CONFIG_FILE"; } >"$tmp"
    chmod 600 "$tmp"
    mv "$tmp" "$GIT_CONFIG_FILE"
  fi
fi

WORKSPACE_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
WORKSPACE_PARENT="$(dirname "$WORKSPACE_DIR")"
SAFE_DIRECTORY_SCOPE="${WORKSPACE_PARENT}/*"

# Trust repositories and worktrees under the mounted workspace parent. Keep entries unique to avoid
# unbounded growth across rebuilds.
SAFE_DIRS="$(git config --global --get-all safe.directory 2>/dev/null || true)"
if [ -n "$SAFE_DIRS" ]; then
  git config --global --unset-all safe.directory || true
  while IFS= read -r dir; do
    [ -n "$dir" ] || continue
    git config --global --add safe.directory "$dir"
  done < <(printf '%s\n%s\n%s\n' "$SAFE_DIRS" "$WORKSPACE_DIR" "$SAFE_DIRECTORY_SCOPE" | awk '!seen[$0]++')
else
  git config --global --add safe.directory "$WORKSPACE_DIR"
  git config --global --add safe.directory "$SAFE_DIRECTORY_SCOPE"
fi

git config --global core.quotepath false
git config --global core.autocrlf input

npm install
