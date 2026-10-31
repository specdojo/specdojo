#!/usr/bin/env bash
#
# devcontainer-tmux.sh
#
# SpecDojo が配布する、ホストから devcontainer 内の tmux セッションへ入るためのスクリプト本体です。
# workspace の .specdojo/host/devcontainer-tmux.sh へ書き出され、ホスト側のラッパーから呼ばれます。
#
# 対応 OS:
#   - macOS
#   - Linux
#   - Windows WSL2
#
set -euo pipefail

if [ $# -lt 1 ] || [ -z "${1:-}" ]; then
  echo "Usage: $0 <workspace-path>" >&2
  exit 1
fi

workspace_dir_input="$1"
if [ ! -d "$workspace_dir_input" ]; then
  echo "Workspace directory not found: $workspace_dir_input" >&2
  exit 1
fi

workspace_dir="$(cd "$workspace_dir_input" && pwd -P)"

devcontainer_json="$workspace_dir/.devcontainer/devcontainer.json"
if [ ! -f "$devcontainer_json" ]; then
  if [ -f "$workspace_dir/.devcontainer.json" ]; then
    devcontainer_json="$workspace_dir/.devcontainer.json"
  else
    echo "devcontainer.json was not found in $workspace_dir" >&2
    exit 1
  fi
fi

remote_user="$(sed -E -e 's,//.*$,,' -e 's,/\*.*\*/,,' "$devcontainer_json" | grep -E '"remoteUser"[[:space:]]*:' | head -n 1 | sed -E 's/.*"remoteUser"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/' || true)"

if [ -z "$remote_user" ]; then
  echo "remoteUser is not defined in $devcontainer_json" >&2
  exit 1
fi

# 1. 動いているコンテナを探す
container_id="$(docker ps -q --filter "label=devcontainer.local_folder=$workspace_dir" | head -n 1)"

# 2. 止まっているコンテナがあれば docker start で起こす
if [ -z "$container_id" ]; then
  stopped_id="$(docker ps -a -q --filter "label=devcontainer.local_folder=$workspace_dir" | head -n 1)"
  if [ -n "$stopped_id" ]; then
    docker start "$stopped_id" >/dev/null
    container_id="$stopped_id"
  fi
fi

# 3. コンテナが無いときだけ devcontainer up を動かす
if [ -z "$container_id" ]; then
  echo "Starting devcontainer for $workspace_dir..." >&2
  if [ -n "${SPECDOJO_NODE_BIN:-}" ]; then
    PATH="$SPECDOJO_NODE_BIN:$PATH" devcontainer up --workspace-folder "$workspace_dir" >&2
  else
    # shellcheck disable=SC2016
    "${SHELL:-/bin/bash}" -lic 'exec devcontainer up --workspace-folder "$1"' devcontainer-launcher "$workspace_dir" >&2
  fi
  container_id="$(docker ps -q --filter "label=devcontainer.local_folder=$workspace_dir" | head -n 1)"
fi

if [ -z "$container_id" ]; then
  echo "Failed to start or find devcontainer for $workspace_dir" >&2
  exit 1
fi

# 4. コンテナ内の作業ディレクトリをマウント情報から求める
mounts_info="$(docker inspect --format '{{range .Mounts}}{{printf "%s\t%s\t%s\n" .Type .Source .Destination}}{{end}}' "$container_id")"
best_match_src=""
best_match_dst=""

while IFS=$'\t' read -r m_type m_src m_dst; do
  [ "$m_type" != "bind" ] && continue
  [ -z "$m_src" ] && continue

  norm_src="$m_src"
  if [ -d "$m_src" ]; then
    norm_src="$(cd "$m_src" && pwd -P)"
  fi

  if [ "$workspace_dir" = "$norm_src" ]; then
    best_match_src="$norm_src"
    best_match_dst="$m_dst"
    break
  elif [ "${workspace_dir#"$norm_src"/}" != "$workspace_dir" ]; then
    if [ ${#norm_src} -gt ${#best_match_src} ]; then
      best_match_src="$norm_src"
      best_match_dst="$m_dst"
    fi
  fi
done <<< "$mounts_info"

if [ -z "$best_match_src" ]; then
  echo "Could not determine container workspace directory from mounts for: $workspace_dir" >&2
  exit 1
fi

if [ "$workspace_dir" = "$best_match_src" ]; then
  container_workspace_dir="$best_match_dst"
else
  rel_path="${workspace_dir#"$best_match_src"/}"
  container_workspace_dir="${best_match_dst%/}/$rel_path"
fi

if ! docker exec "$container_id" test -d "$container_workspace_dir"; then
  echo "Workspace directory '$container_workspace_dir' does not exist in container '$container_id'." >&2
  exit 1
fi

# 5. tmux セッションへ入る
session_name="${SPECDOJO_TMUX_SESSION:-specdojo}"
exec docker exec -it --detach-keys="ctrl-]" -u "$remote_user" -w "$container_workspace_dir" "$container_id" tmux new-session -A -s "$session_name"
