#!/usr/bin/env bash
# Verify that an agent CLI launched from a project repository can write to two
# product repositories through the same extra-root arguments as SpecDojo.
#
# Usage:
#   tools/exec/verify-multi-repo-agent-write.sh <claude|codex|antigravity|all>
#   KEEP_TMP=1 tools/exec/verify-multi-repo-agent-write.sh all
#
# The script invokes real agent CLIs and may consume provider quota. Run it from
# an orchestrator or an interactive shell, not from another agent sandbox.
set -euo pipefail

provider="${1:-}"
case "$provider" in
  claude | codex | antigravity | all) ;;
  *)
    echo "usage: $0 <claude|codex|antigravity|all>" >&2
    exit 2
    ;;
esac

script_dir="$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)"
repo_root="$(CDPATH='' cd -- "$script_dir/../.." && pwd)"
fixture_root="$(mktemp -d "${TMPDIR:-/tmp}/specdojo-agent-multi-repo.XXXXXX")"
project_repo="$fixture_root/project"
app1_repo="$fixture_root/app1"
app2_repo="$fixture_root/app2"

cleanup() {
  status=$?
  if [ "$status" -eq 0 ] && [ "${KEEP_TMP:-0}" != "1" ]; then
    rm -rf -- "$fixture_root"
  else
    echo "fixture preserved: $fixture_root" >&2
  fi
}
trap cleanup EXIT

for repo in "$project_repo" "$app1_repo" "$app2_repo"; do
  mkdir -p "$repo"
  git -C "$repo" init -q
done

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "agent CLI not found: $1" >&2
    exit 127
  fi
}

verify_output() {
  current_provider="$1"
  for repo in "$app1_repo" "$app2_repo"; do
    output="$repo/$current_provider.txt"
    if [ ! -f "$output" ] || [ "$(cat "$output")" != "OK" ]; then
      echo "verification failed: expected exactly OK in $output" >&2
      exit 1
    fi
  done
  echo "$current_provider: wrote app1/$current_provider.txt and app2/$current_provider.txt"
}

prompt_for() {
  current_provider="$1"
  printf '%s' "Create $app1_repo/$current_provider.txt and $app2_repo/$current_provider.txt, each containing exactly OK followed by a newline. Do not change any other file."
}

run_claude() {
  require_command claude
  prompt="$(prompt_for claude)"
  (
    cd "$project_repo"
    printf '%s\n' "$prompt" | claude -p \
      --settings "$repo_root/.specdojo/claude/settings.edit.json" \
      --add-dir "$app1_repo" "$app2_repo" \
      --allowedTools "Edit(/$app1_repo/**)" "Edit(/$app2_repo/**)"
  )
  verify_output claude
}

run_codex() {
  require_command codex
  prompt="$(prompt_for codex)"
  (
    cd "$project_repo"
    printf '%s\n' "$prompt" | codex exec --ephemeral --sandbox workspace-write \
      -c approval_policy="never" \
      -c sandbox_workspace_write.network_access=false \
      --add-dir "$app1_repo" \
      --add-dir "$app2_repo"
  )
  verify_output codex
}

run_antigravity() {
  require_command agy
  prompt="$(prompt_for antigravity)"
  (
    cd "$project_repo"
    agy --sandbox --add-dir "$(pwd)" --dangerously-skip-permissions \
      -p "$prompt" \
      --add-dir "$app1_repo" \
      --add-dir "$app2_repo"
  )
  verify_output antigravity
}

case "$provider" in
  claude) run_claude ;;
  codex) run_codex ;;
  antigravity) run_antigravity ;;
  all)
    run_claude
    run_codex
    run_antigravity
    ;;
esac

echo "verified three-repository fixture: project, app1, app2"
