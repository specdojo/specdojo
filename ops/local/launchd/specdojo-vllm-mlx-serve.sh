set -euo pipefail

export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"

exec vllm-mlx serve mlx-community/Qwen3.6-27B-4bit \
  --port 8000 \
  --continuous-batching \
  --ssd-cache-dir "$HOME/.cache/vllm-mlx/kv-cache"
