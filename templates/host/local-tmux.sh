#!/usr/bin/env bash
#
# local-tmux.sh
#
# 手元（macOS・WSL・Linux）で、この workspace 用の tmux セッションを作るか、既にあれば入ります。
# `specdojo init` で手元 ＋ tmux を選ぶと .specdojo/host/local-tmux.sh に書き出されます。
# 端末を閉じても、セッションの中で流した orchestrator や exec run は続きます。
#
# 使い方:
#   bash .specdojo/host/local-tmux.sh            # この workspace のセッションに入る
#   bash .specdojo/host/local-tmux.sh <名前>     # セッション名を指定する
#
# 抜けるときは Ctrl-b d（セッションは残ります）。入り直すときは同じコマンドを流します。
#
set -euo pipefail

if ! command -v tmux >/dev/null 2>&1; then
  echo "tmux が見つかりません。macOS は 'brew install tmux'、WSL・Linux は 'sudo apt install tmux' などで入れてください。" >&2
  exit 1
fi

workspace_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
default_name="specdojo-$(basename "$workspace_dir" | tr -c 'A-Za-z0-9_-' '-' | sed 's/-*$//')"
session_name="${1:-$default_name}"

if ! tmux has-session -t "$session_name" 2>/dev/null; then
  tmux new-session -d -s "$session_name" -c "$workspace_dir"
fi

if [ -n "${TMUX:-}" ]; then
  exec tmux switch-client -t "$session_name"
fi
exec tmux attach-session -t "$session_name"
