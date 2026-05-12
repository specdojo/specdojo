#!/bin/sh
set -eu

BASE_URL="${COMFYUI_BASE_URL:-http://host.docker.internal:8188}"

echo "Checking ComfyUI: $BASE_URL"
curl -fsS "$BASE_URL/system_stats"
echo
