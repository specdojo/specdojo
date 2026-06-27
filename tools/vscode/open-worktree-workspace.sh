#!/usr/bin/env bash
set -euo pipefail

color="${1:-}"
worktree_path="${2:-}"

if [ -z "$color" ] || [ -z "$worktree_path" ]; then
  echo "usage: tools/vscode/open-worktree-workspace.sh <red|blue|green> <worktree-path>" >&2
  exit 2
fi

case "$color" in
  red | blue | green) ;;
  *)
    echo "unknown workspace color: $color" >&2
    echo "usage: tools/vscode/open-worktree-workspace.sh <red|blue|green> <worktree-path>" >&2
    exit 2
    ;;
esac

code_bin="${SPECDOJO_CODE_BIN:-code}"

if ! command -v "$code_bin" >/dev/null 2>&1; then
  echo "VS Code CLI not found: $code_bin" >&2
  exit 127
fi

repo_root="$(git rev-parse --show-toplevel)"
template="$repo_root/vscode-workspaces/$color.code-workspace"
local_dir="$repo_root/vscode-workspaces/local"

if [ ! -d "$worktree_path" ]; then
  echo "worktree path not found: $worktree_path" >&2
  exit 1
fi

if [ ! -f "$template" ]; then
  echo "workspace template not found: $template" >&2
  exit 1
fi

mkdir -p "$local_dir"

workspace_file="$(
  REPO_ROOT="$repo_root" \
  TEMPLATE="$template" \
  LOCAL_DIR="$local_dir" \
  COLOR="$color" \
  WORKTREE_PATH="$worktree_path" \
  node --input-type=commonjs <<'NODE'
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')

const repoRoot = process.env.REPO_ROOT
const templatePath = process.env.TEMPLATE
const localDir = process.env.LOCAL_DIR
const color = process.env.COLOR
const inputPath = process.env.WORKTREE_PATH

const absoluteWorktreePath = path.resolve(process.cwd(), inputPath)
const workspace = JSON.parse(fs.readFileSync(templatePath, 'utf8'))
const worktreeName = path.basename(absoluteWorktreePath)
const safeWorktreeName =
  worktreeName
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'workspace'
const hash = crypto.createHash('sha1').update(absoluteWorktreePath).digest('hex').slice(0, 8)
const workspaceFile = path.join(localDir, `${color}-${safeWorktreeName}-${hash}.code-workspace`)

workspace.folders = [
  {
    name: worktreeName,
    path: path.relative(path.dirname(workspaceFile), absoluteWorktreePath) || '.',
  },
]

fs.writeFileSync(workspaceFile, `${JSON.stringify(workspace, null, 2)}\n`)
process.stdout.write(workspaceFile)
NODE
)"

exec "$code_bin" -n "$workspace_file"
