#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GIT_CONFIG_FILE="${GIT_CONFIG_GLOBAL:-/home/node/.config/git/config}"
WORKSPACE_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
TMUX_CONF_SOURCE="${WORKSPACE_DIR}/.devcontainer/tmux.conf"
TMUX_CONF_TARGET="${HOME}/.tmux.conf"
CRON_SOURCE="${WORKSPACE_DIR}/.devcontainer/specdojo-routine.cron"
CRON_TARGET="/etc/cron.d/specdojo-routine"

bash "${SCRIPT_DIR}/prepare-agent-dirs.sh"

if [ -f "$TMUX_CONF_SOURCE" ]; then
  ln -sfn "$TMUX_CONF_SOURCE" "$TMUX_CONF_TARGET"
fi

echo "Configuring SpecDojo routine cron..."
if command -v cron >/dev/null 2>&1; then
  sed "s|__WORKSPACE_DIR__|${WORKSPACE_DIR}|g" "$CRON_SOURCE" | sudo tee "$CRON_TARGET" >/dev/null
  sudo chown root:root "$CRON_TARGET"
  sudo chmod 0644 "$CRON_TARGET"
  mkdir -p "${WORKSPACE_DIR}/logs"
  sudo service cron start
  sudo service cron status
else
  echo "Cron is not installed. Rebuild the devcontainer to apply .devcontainer/Dockerfile."
fi

echo "Checking tools..."
command -v claude >/dev/null 2>&1 && claude --version || true
command -v codex >/dev/null 2>&1 && codex --version || true
command -v opencode >/dev/null 2>&1 && opencode --version || true
command -v agy >/dev/null 2>&1 && agy --version || true
command -v gh >/dev/null 2>&1 && gh --version | head -n 1 || true

echo "Checking Git config..."
echo "GIT_CONFIG_GLOBAL=${GIT_CONFIG_FILE}"
ls -ld /home/node/.config /home/node/.config/git || true
ls -l "$GIT_CONFIG_FILE" || true
git config --global --list || true

echo "Installing SpecDojo VSCode extension..."
VSIX=$(ls -t "${WORKSPACE_DIR}/packages/vscode-specdojo/"*.vsix 2>/dev/null | head -n 1 || true)
CODE_SERVER_BIN="$(ls -t /vscode/vscode-server/bin/*/*/bin/code-server 2>/dev/null | head -n 1 || true)"
if [ -n "$VSIX" ]; then
  if [ -n "$CODE_SERVER_BIN" ]; then
    echo "Using VS Code server CLI: $CODE_SERVER_BIN"
    "$CODE_SERVER_BIN" --install-extension "$VSIX" --force || true
  else
    echo "Skipping VSIX install: code-server CLI is not available in this startup context."
  fi
else
  echo "SpecDojo VSIX not found. Run 'npm run vscode:package' at the repository root."
fi

echo "Checking Local LLM API..."
if curl -s "${OLLAMA_BASE_URL:-http://host.docker.internal:11434}/api/tags" >/dev/null; then
  echo "Ollama is reachable."
else
  echo "Ollama is not reachable. Start Ollama on Host PC."
fi
