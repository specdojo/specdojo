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

# docker の探索は最初の呼び出しより前に行う。SSH の PATH だけには依存しない。
docker_dir=""
docker_search_path="$PATH"
docker_login_shell="${SHELL:-/bin/bash}"
docker_candidates=(
  /usr/local/bin
  /opt/homebrew/bin
  "${HOME:-}/.docker/bin"
  /Applications/Docker.app/Contents/Resources/bin
  /snap/bin
  /usr/bin
)

select_docker() {
  local candidate="$1" candidate_dir
  # command -v が返す alias や関数の説明は受け付けない。
  case "$candidate" in
    */docker) ;;
    *) return 1 ;;
  esac
  [ -f "$candidate" ] && [ -x "$candidate" ] || return 1
  candidate_dir="${candidate%/*}"
  candidate_dir="$(cd "${candidate_dir:-/}" && pwd -P)" || return 1
  docker_dir="$candidate_dir"
}

docker_hint() {
  local failure="$1" host_os kernel
  host_os="$(uname -s 2>/dev/null || true)"
  kernel="$(uname -r 2>/dev/null || true)"
  case "$host_os" in
    Darwin)
      if [ "$failure" = missing ]; then
        echo "macOS: Install Docker Desktop." >&2
      else
        echo "macOS: Start Docker Desktop and check the Docker context." >&2
      fi
      ;;
    Linux)
      if printf '%s\n' "$kernel" | grep -qi microsoft || grep -qi microsoft /proc/version 2>/dev/null; then
        echo "WSL2: Start Docker Desktop and enable WSL integration for this distribution." >&2
      elif [ "$failure" = missing ]; then
        echo "Linux: Install Docker Engine." >&2
      else
        echo "Linux: Start the docker service and check membership in the docker group (then log in again)." >&2
      fi
      ;;
    *) echo "Install and start Docker, and check the Docker context and access permissions." >&2 ;;
  esac
}

if [ -n "${SPECDOJO_DOCKER_BIN:-}" ]; then
  # 明示指定はディレクトリ。誤指定を別の Docker で隠さず、下で診断する。
  select_docker "$SPECDOJO_DOCKER_BIN/docker" || true
else
  if ! select_docker "$(command -v docker || true)"; then
    # 起動時のメッセージを無視し、問い合わせの印が付いた実行ファイルだけを採る。
    # shellcheck disable=SC2016
    login_output="$("$docker_login_shell" -lc 'printf "\n__SPECDOJO_DOCKER__"; command -v docker' 2>/dev/null)" || login_output=""
    while IFS= read -r line; do
      case "$line" in
        __SPECDOJO_DOCKER__*)
          if select_docker "${line#__SPECDOJO_DOCKER__}"; then
            break
          fi
          ;;
      esac
    done <<< "$login_output"
    if [ -z "$docker_dir" ]; then
      for candidate_dir in "${docker_candidates[@]}"; do
        if select_docker "$candidate_dir/docker"; then
          break
        fi
      done
    fi
  fi
fi

if [ -z "$docker_dir" ]; then
  echo "Docker executable not found." >&2
  if [ -n "${SPECDOJO_DOCKER_BIN:-}" ]; then
    echo "Searched SPECDOJO_DOCKER_BIN: $SPECDOJO_DOCKER_BIN/docker (must be an executable file)." >&2
  else
    echo "Searched PATH: $docker_search_path" >&2
    echo "Queried login shell: $docker_login_shell -lc 'command -v docker'" >&2
    printf 'Searched directory: %s\n' "${docker_candidates[@]}" >&2
  fi
  docker_hint missing
  exit 1
fi

export PATH="$docker_dir:$PATH"
if ! docker info >/dev/null 2>&1; then
  echo "Docker is not usable: $docker_dir/docker (docker info failed)." >&2
  docker_hint unavailable
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
    PATH="$docker_dir:$SPECDOJO_NODE_BIN:$PATH" devcontainer up --workspace-folder "$workspace_dir" >&2
  else
    # shellcheck disable=SC2016
    "${SHELL:-/bin/bash}" -lic 'export PATH="$1:$PATH"; exec devcontainer up --workspace-folder "$2"' devcontainer-launcher "$docker_dir" "$workspace_dir" >&2
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
