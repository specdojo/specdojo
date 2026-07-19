#!/usr/bin/env bash
set -euo pipefail

if command -v fdfind >/dev/null 2>&1; then
  sudo ln -sf "$(command -v fdfind)" /usr/local/bin/fd
fi

echo "Installing frequently updated agent CLIs..."
sudo npm install -g opencode-ai@latest

# Install Codex using the official installer so remote-control is available.
if ! curl -fsSL https://chatgpt.com/codex/install.sh | CODEX_NON_INTERACTIVE=1 sh; then
  echo "Official Codex installer failed. Falling back to npm package."
  sudo npm install -g @openai/codex@latest
fi

# Some installers place binaries under ~/.local/bin.
if [ -d "${HOME}/.local/bin" ]; then
  export PATH="${HOME}/.local/bin:${PATH}"
fi

if command -v codex >/dev/null 2>&1; then
  if ! codex remote-control --help >/dev/null 2>&1; then
    echo "Warning: codex remote-control is not available in this installation."
  fi
fi

WORKSPACE_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

echo "Building and linking SpecDojo CLI..."
(
  cd "$WORKSPACE_DIR"
  npm run build
  sudo npm link
)

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

codex --version || true
opencode --version || true
