#!/usr/bin/env bash
set -euo pipefail

CLAUDE_JSON="/home/node/.claude.json"
CLAUDE_STATE_JSON="/home/node/.claude-state/.claude.json"
GIT_CONFIG_DIR="/home/node/.config/git"
GIT_CONFIG_FILE="${GIT_CONFIG_GLOBAL:-/home/node/.config/git/config}"

sudo mkdir -p \
  /home/node/.config \
  "$GIT_CONFIG_DIR" \
  /home/node/.claude \
  /home/node/.claude-state \
  /home/node/.codex \
  /home/node/.copilot \
  /home/node/.config/gh \
  /home/node/.config/opencode

sudo touch "$CLAUDE_STATE_JSON"
sudo touch "$GIT_CONFIG_FILE"

sudo chown node:node /home/node/.config

sudo chown -R node:node \
  "$GIT_CONFIG_DIR" \
  /home/node/.claude \
  /home/node/.claude-state \
  /home/node/.codex \
  /home/node/.copilot \
  /home/node/.config/gh \
  /home/node/.config/opencode

chmod 755 /home/node/.config

chmod 700 \
  "$GIT_CONFIG_DIR" \
  /home/node/.claude \
  /home/node/.claude-state \
  /home/node/.codex \
  /home/node/.copilot \
  /home/node/.config/gh \
  /home/node/.config/opencode

chmod 600 "$CLAUDE_STATE_JSON"
chmod 600 "$GIT_CONFIG_FILE"

if [ -e "$CLAUDE_JSON" ] && [ ! -L "$CLAUDE_JSON" ]; then
  mv "$CLAUDE_JSON" "${CLAUDE_JSON}.bak.$(date +%Y%m%d%H%M%S)"
fi

ln -sfn "$CLAUDE_STATE_JSON" "$CLAUDE_JSON"

echo "Checking tools..."
command -v claude >/dev/null 2>&1 && claude --version || true
command -v codex >/dev/null 2>&1 && codex --version || true
command -v opencode >/dev/null 2>&1 && opencode --version || true
command -v gh >/dev/null 2>&1 && gh --version | head -n 1 || true

echo "Checking Git config..."
echo "GIT_CONFIG_GLOBAL=${GIT_CONFIG_FILE}"
ls -ld /home/node/.config "$GIT_CONFIG_DIR" || true
ls -l "$GIT_CONFIG_FILE" || true
git config --global --list || true

echo "Installing SpecDojo VSCode extension..."
VSIX="/workspaces/specdojo/tools/vscode-specdojo/vscode-specdojo-0.1.0.vsix"
if ! code --list-extensions 2>/dev/null | grep -q "specdojo.vscode-specdojo"; then
  code --install-extension "$VSIX" || true
else
  echo "SpecDojo extension already installed."
fi

echo "Checking Local LLM API..."
if curl -s "${OLLAMA_BASE_URL:-http://host.docker.internal:11434}/api/tags" >/dev/null; then
  echo "Ollama is reachable."
else
  echo "Ollama is not reachable. Start Ollama on Host PC."
fi
