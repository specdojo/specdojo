#!/usr/bin/env bash
set -euo pipefail

if command -v fdfind >/dev/null 2>&1; then
  sudo ln -sf "$(command -v fdfind)" /usr/local/bin/fd
fi

echo "Installing frequently updated agent CLIs..."
sudo npm install -g @openai/codex@latest opencode-ai@latest

WORKSPACE_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
git config --global --add safe.directory "$WORKSPACE_DIR"
git config --global core.quotepath false
git config --global core.autocrlf input

codex --version || true
opencode --version || true
