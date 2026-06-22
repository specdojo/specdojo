#!/usr/bin/env bash
# Watch the live Claude Code session transcript for this repo and print a
# human-readable stream of the agent's text, tool calls, and tool results.
# Claude-specific: it reads Claude Code's transcript files, so it only applies to
# `claude -p` agents (not opencode/codex members).
#
# Claude Code records each `claude -p` run as a JSONL transcript under
# ~/.claude/projects/<repo-path-slug>/<session-id>.jsonl. `specdojo exec run`
# launches the agent that way, so this script tails the most recent transcript
# and auto-switches when a new run starts a fresh session. Run it in a second
# terminal alongside `specdojo exec run`.
#
# Usage:
#   tools/exec/watch-claude-log.sh           # auto-detect repo + transcript dir
#   tools/exec/watch-claude-log.sh <dir>     # watch a specific projects dir
#   RAW=1 tools/exec/watch-claude-log.sh     # print raw JSONL (skip jq formatting)
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
# Claude Code slugifies the absolute repo path by replacing each "/" with "-".
slug="$(printf '%s' "$repo_root" | sed 's:/:-:g')"
project_dir="${1:-${CLAUDE_PROJECT_DIR:-$HOME/.claude/projects/$slug}}"

if [ ! -d "$project_dir" ]; then
  echo "transcript dir not found: $project_dir" >&2
  echo "pass the directory explicitly: $0 <projects-dir>" >&2
  exit 1
fi

# jq filter: assistant text + tool calls (name and the most relevant arg) and a
# marker line per tool result. Falls back to raw JSONL when jq is missing or RAW=1.
FILTER='
  if .type=="assistant" then
    (.message.content[]? |
      if .type=="text" then "💬 " + (.text|gsub("\n";" ")) + "\n"
      elif .type=="tool_use" then "🔧 " + .name + "  " + ((.input.command // .input.file_path // .input.description // "")|tostring) + "\n"
      else empty end)
  elif .type=="user" then
    (.message.content[]? | select(.type=="tool_result") | "   ↳ done\n")
  else empty end'

have_jq=1
command -v jq >/dev/null 2>&1 || have_jq=0
[ "${RAW:-0}" = "1" ] && have_jq=0

# Tail runs in its own session (setsid) so the whole pipeline can be torn down by
# process-group kill when the watched file changes or the script exits.
watcher_pid=""
cleanup() {
  if [ -n "$watcher_pid" ]; then
    kill -- "-$watcher_pid" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

echo "watching: $project_dir (Ctrl-C to stop)" >&2

prev=""
while :; do
  newest="$(ls -t "$project_dir"/*.jsonl 2>/dev/null | head -1 || true)"
  if [ -n "$newest" ] && [ "$newest" != "$prev" ]; then
    cleanup
    echo "==> $newest" >&2
    if [ "$have_jq" = "1" ]; then
      setsid sh -c 'tail -n0 -F "$1" | jq -rj "$2"' _ "$newest" "$FILTER" &
    else
      setsid sh -c 'tail -n0 -F "$1"' _ "$newest" &
    fi
    watcher_pid=$!
    prev="$newest"
  fi
  sleep 2
done
