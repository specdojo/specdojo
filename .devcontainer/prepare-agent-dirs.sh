#!/usr/bin/env bash
# AI CLI・git 用の設定ディレクトリ（名前付きボリュームのマウント先）を作成し、所有者と権限を
# node が読み書きできる状態に整える。post-start.sh（毎回の起動時）から呼ぶ。ボリュームが
# リセットされた場合にも備える。
set -euo pipefail

GIT_CONFIG_FILE="${GIT_CONFIG_GLOBAL:-/home/node/.config/git/config}"

sudo mkdir -p /home/node/.config
sudo chown node:node /home/node/.config
chmod 755 /home/node/.config

DIRS=(
  /home/node/.config/git
  /home/node/.claude
  /home/node/.codex
  /home/node/.copilot
  /home/node/.config/gh
  /home/node/.config/opencode
  /home/node/.config/antigravity
  /home/node/.gemini
)

for dir in "${DIRS[@]}"; do
  sudo mkdir -p "$dir"
  sudo chown -R node:node "$dir"
  chmod 700 "$dir"
done

sudo touch "$GIT_CONFIG_FILE"
sudo chown node:node "$GIT_CONFIG_FILE"
chmod 600 "$GIT_CONFIG_FILE"

# Claude Code の設定ファイルは CLAUDE_CONFIG_DIR（~/.claude ボリューム）に置く。以前は
# ~/.claude.json を .claude-state ボリュームへの symlink にしていたため、移行時に一度だけ
# 旧ファイルの内容を写し、symlink が残っていれば外す。
if [ -n "${CLAUDE_CONFIG_DIR:-}" ]; then
  legacy="/home/node/.claude.json"
  target="${CLAUDE_CONFIG_DIR}/.claude.json"
  if [ ! -e "$target" ] && [ -f "$legacy" ]; then
    cp "$legacy" "$target"
  fi
  if [ -L "$legacy" ]; then
    rm -f "$legacy"
  fi
  [ -e "$target" ] && chmod 600 "$target"
fi
