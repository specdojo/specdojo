#!/usr/bin/env bash
set -euo pipefail

USER_LOCAL_DIR="${HOME}/.local"

# postCreateCommand runs before postStartCommand. Fix ownership of the named volume mount points
# here as well, because the git config and agent installers below write into them.
bash "$(dirname "$0")/prepare-agent-dirs.sh"

if command -v fdfind >/dev/null 2>&1; then
  sudo ln -sf "$(command -v fdfind)" /usr/local/bin/fd
fi

# Official installers write executables and application data below ~/.local.
sudo install -d -o "$(id -u)" -g "$(id -g)" \
  "$USER_LOCAL_DIR" \
  "$USER_LOCAL_DIR/bin" \
  "$USER_LOCAL_DIR/share"
export PATH="$USER_LOCAL_DIR/bin:$PATH"

echo "Installing frequently updated agent CLIs..."
sudo npm install -g opencode-ai@latest

# Install Codex using the official installer so remote-control is available.
if ! curl -fsSL https://chatgpt.com/codex/install.sh | CODEX_NON_INTERACTIVE=1 sh; then
  echo "Official Codex installer failed. Falling back to npm package."
  sudo npm install -g @openai/codex@latest
fi

# Install Antigravity CLI (agy) into ~/.local/bin. Failure must not abort container creation.
if ! curl -fsSL https://antigravity.google/cli/install.sh | bash; then
  echo "Warning: Antigravity CLI installer failed. Install it later with: curl -fsSL https://antigravity.google/cli/install.sh | bash"
fi

# Install Claude Code with the official installer so that `claude update` can write to its own
# install directory. The devcontainer feature installed it as an npm global package under a
# root-owned @anthropic-ai directory, which made self-update fail with insufficient permissions.
if ! curl -fsSL https://claude.ai/install.sh | bash; then
  echo "Warning: Claude Code installer failed. Install it later with: curl -fsSL https://claude.ai/install.sh | bash"
fi

# Remove a Claude Code left over from the npm global install. ~/.local/bin precedes npm-global on
# PATH, so a stale copy is not used, but leaving two installations makes `claude --version` and
# update failures hard to attribute.
if [ -d /usr/local/share/npm-global/lib/node_modules/@anthropic-ai/claude-code ]; then
  sudo npm uninstall -g @anthropic-ai/claude-code || echo "Warning: could not remove the npm global Claude Code."
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

echo "Installing documentation site dependencies..."
(
  cd "$WORKSPACE_DIR"
  npm --prefix packages/docs-site ci
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

# Install the bundled Emacs defaults (the same template that `specdojo devcontainer scaffold
# --editor emacs` generates) only when no user init file exists, so dotfiles stay authoritative.
# Emacs ignores ~/.config/emacs when ~/.emacs.d exists, even without an init.el inside, and Emacs
# itself creates ~/.emacs.d on first start. Place the file where Emacs will actually read it.
EMACS_TEMPLATE="$WORKSPACE_DIR/templates/devcontainer/emacs/init.el"
if [ -f "$EMACS_TEMPLATE" ] &&
  [ ! -e "$HOME/.emacs" ] && [ ! -e "$HOME/.emacs.el" ] &&
  [ ! -e "$HOME/.emacs.d/init.el" ] && [ ! -e "$HOME/.config/emacs/init.el" ]; then
  if [ -d "$HOME/.emacs.d" ]; then
    EMACS_INIT_DIR="$HOME/.emacs.d"
  else
    EMACS_INIT_DIR="$HOME/.config/emacs"
  fi
  mkdir -p "$EMACS_INIT_DIR"
  cp "$EMACS_TEMPLATE" "$EMACS_INIT_DIR/init.el"
  echo "Installed the SpecDojo Emacs defaults: $EMACS_INIT_DIR/init.el"
fi

claude --version || true
codex --version || true
opencode --version || true
