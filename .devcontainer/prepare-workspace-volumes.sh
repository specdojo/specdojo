#!/usr/bin/env bash
# exec の worktree の置き場と node_modules を、共有フォルダ（bind mount）ではなく named volume に置く
# （PJR-TATP）。devcontainer.json の mounts と同じ場所を、ここでも並べる。
# named volume は初回は root の持ち主で空のため、持ち主を node にそろえ、空の node_modules には
# npm ci で依存を入れる。ホストで直接実行する場合は、この script は使わず、ホストの
# ../worktrees と node_modules がそのまま使われる。
set -euo pipefail

WORKSPACE_ROOT="/workspaces/specdojo-workspace"

# devcontainer.json の mounts と 1 対 1 に対応させる。
WORKTREE_DIR="$WORKSPACE_ROOT/worktrees"
PACKAGE_DIRS=(
  "$WORKSPACE_ROOT/specdojo"
  "$WORKSPACE_ROOT/specdojo/.opencode"
  "$WORKSPACE_ROOT/specdojo/packages/docs-site"
  "$WORKSPACE_ROOT/specdojo/packages/docs-lint"
  "$WORKSPACE_ROOT/specdojo/packages/vscode-specdojo"
  "$WORKSPACE_ROOT/specdojo-prj-0002"
  "$WORKSPACE_ROOT/specdojo-prj-0002/packages/docs-site"
  "$WORKSPACE_ROOT/specdojo-prj-0002/packages/docs-lint"
  "$WORKSPACE_ROOT/specdojo-prj-0002/packages/vscode-specdojo"
  "$WORKSPACE_ROOT/specdojo-lp"
  "$WORKSPACE_ROOT/specdojo-assets"
)

own_mount_point() {
  local dir="$1"
  sudo mkdir -p "$dir"
  # 中身までは辿らない。既に npm ci 済みの volume は node の持ち主のため、上だけをそろえる。
  sudo chown node:node "$dir"
}

own_mount_point "$WORKTREE_DIR"

for package_dir in "${PACKAGE_DIRS[@]}"; do
  if [ ! -f "$package_dir/package-lock.json" ]; then
    echo "Skipping $package_dir: no package-lock.json"
    continue
  fi
  own_mount_point "$package_dir/node_modules"
  # 空の volume（初回、または volume を消したあと）にだけ依存を入れる。作り直しのたびに入れ直すと
  # 時間がかかるため、依存を更新したいときは手で npm ci を流す。
  if [ ! -f "$package_dir/node_modules/.package-lock.json" ]; then
    echo "Installing dependencies: $package_dir"
    (cd "$package_dir" && npm ci --no-audit --no-fund)
  fi
done

# container の worktree は volume の中にあり、ホストからは見えない。ホストの git gc が、見えない
# worktree の記録を prune しないようにする（.git はホストと container で共有している）。
for repo_dir in "$WORKSPACE_ROOT/specdojo" "$WORKSPACE_ROOT/specdojo-lp" "$WORKSPACE_ROOT/specdojo-assets"; do
  if git -C "$repo_dir" rev-parse --git-dir >/dev/null 2>&1; then
    git -C "$repo_dir" config --local gc.worktreePruneExpire never
  fi
done
