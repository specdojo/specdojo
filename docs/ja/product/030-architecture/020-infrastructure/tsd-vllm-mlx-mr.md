---
specdojo:
  id: tsd-vllm-mlx-mr
  type: architecture
  status: draft
  rulebook: tsd-rulebook
---

# vllm-mlx Model Registry 技術スタック定義

SpecDojoでは、vllm-mlx の標準構成として [tsd-vllm-mlx](tsd-vllm-mlx.md) の単一モデル構成を採用する。一方で、用途別モデルを1つのOpenAI互換APIエンドポイントから切り替えたい場合の選択肢として、Model Registry 構成を本書に分離して定義する。

Model Registry 構成は、`--models-config` に複数モデルを登録し、リクエストの `model` フィールドで論理モデル名を選択する方式である。モデル切り替え、遅延ロード、メモリ予算に応じた退避ができる一方、モデル実装や vllm-mlx のレスポンス生成処理の影響を受けやすいため、安定運用の第一候補にはしない。

## 1. 採用条件

Model Registry 構成は、以下を満たす場合に検証候補とする。

- 1つの base URL から用途別モデルを切り替えたい
- OpenAI SDK 互換ツール側で `model` 名だけを切り替えたい
- メモリ予算に応じて idle モデルを退避させたい
- 単一モデル構成で vllm-mlx の基本動作確認が完了している
- vllm-mlx / mlx-vlm のバージョン差による不安定さを許容できる

安定性を優先する通常運用では、Model Registry ではなく Qwen3.6-27B-4bit の単一モデル構成を使う。

## 2. mise + uv ベースの実行環境

Python と uv は mise で管理し、vllm-mlx は uv tool としてインストールする。Python は単一モデル構成と同じく **Python 3.12** を標準とする。

```bash
brew install mise
mise install python@3.12 uv@latest
mise use -g python@3.12 uv@latest
```

リポジトリ単位で固定する場合は、リポジトリルートで以下を実行する。

```bash
mise use python@3.12 uv@latest
```

有効化を確認する。

```bash
python --version
uv --version
mise current
```

vllm-mlx をインストールする。

```bash
uv tool install --python 3.12 vllm-mlx
```

既にインストール済みの場合は、更新しておく。

```bash
uv tool upgrade vllm-mlx
```

CLI が見えることを確認する。

```bash
vllm-mlx --help
```

## 3. モデル構成

Model Registry では、物理モデルIDではなく論理モデル名をアプリケーション側から指定する。SpecDojo の検証構成では、以下の3モデルを登録する。

| 論理モデル名    | 用途                           | 実モデル                                | 備考                 |
| --------------- | ------------------------------ | --------------------------------------- | -------------------- |
| `code`          | コーディング                   | `mlx-community/Qwen3.6-27B-4bit`        | 標準の安定確認モデル |
| `markdown`      | Markdown設計書の作成・レビュー | `mlx-community/gemma-4-26b-a4b-it-4bit` | 品質比較用           |
| `markdown-fast` | 軽めの設計書整理・要約         | `mlx-community/gemma-4-e4b-it-4bit`     | 速度比較用           |

Gemma 4 系モデルは、mlx-vlm 側の Attention 実装や vllm-mlx 側の batching patch との組み合わせで不安定になることがある。Gemma 4 系の `continuous_batching` は初期値では `false` にし、Qwen 系モデルだけで batching を検証する。

## 4. メモリ安定化設定

複数モデルを1プロセスで扱うため、単一モデル構成よりも unified memory を圧迫しやすい。Model Registry では `manager.memory_budget_gb` と各モデルの `estimated_memory_gb` を明示し、退避判断を安定させる。

基本方針:

- `preload: true` は常用する軽量モデルに限定する
- Gemma 4 系の `continuous_batching` は初期値で `false` にする
- Qwen 系の `continuous_batching` は検証目的で `true` にできる
- `memory_budget_gb` は実RAM全体ではなく、常駐モデル用の予算として設定する
- `estimated_memory_gb` は初期値として設定し、実測に合わせて調整する
- 疎通確認では `max_tokens` を必ず明示する

64GB Mac の初期値例:

```yaml
manager:
  memory_budget_gb: 48
```

128GB Mac の初期値例:

```yaml
manager:
  memory_budget_gb: 96
```

## 5. モデル取得

vllm-mlx は Hugging Face 上の MLX 形式モデルを直接利用できる。Model Registry 構成ではローカルパスを明示して運用するため、必要なモデルを事前に取得する。

```bash
mkdir -p ~/vllm-mlx-models
vllm-mlx model acquire mlx-community/Qwen3.6-27B-4bit \
  --target-dir ~/vllm-mlx-models/qwen3.6-27b-4bit

vllm-mlx model acquire mlx-community/gemma-4-26b-a4b-it-4bit \
  --target-dir ~/vllm-mlx-models/gemma-4-26b-a4b-it-4bit

vllm-mlx model acquire mlx-community/gemma-4-e4b-it-4bit \
  --target-dir ~/vllm-mlx-models/gemma-4-e4b-it-4bit
```

モデル情報を確認する。

```bash
vllm-mlx model inspect ~/vllm-mlx-models/qwen3.6-27b-4bit
vllm-mlx model inspect ~/vllm-mlx-models/gemma-4-26b-a4b-it-4bit
vllm-mlx model inspect ~/vllm-mlx-models/gemma-4-e4b-it-4bit
```

## 6. Model Registry設定

Model Registry設定ファイルを作成する。

```bash
mkdir -p ~/.config/specdojo/vllm-mlx
code ~/.config/specdojo/vllm-mlx/models.yaml
```

`~/.config/specdojo/vllm-mlx/models.yaml`:

```yaml
manager:
  memory_budget_gb: 48
  contention_policy:
    strategy: wait_then_preempt
    wait_timeout_s: 45
    preempt_after_s: 15
models:
  - name: markdown-fast
    path: /Users/<user>/vllm-mlx-models/gemma-4-e4b-it-4bit
    preload: false
    continuous_batching: false
    estimated_memory_gb: 8

  - name: markdown
    path: /Users/<user>/vllm-mlx-models/gemma-4-26b-a4b-it-4bit
    continuous_batching: false
    estimated_memory_gb: 24

  - name: code
    path: /Users/<user>/vllm-mlx-models/qwen3.6-27b-4bit
    preload: true
    continuous_batching: true
    estimated_memory_gb: 24
```

`path` には `~` を使わず、実際の絶対パスを書く。設定例を作る場合は以下でユーザー名を展開できる。

```bash
perl -0pi -e "s#/Users/<user>#$HOME#g" ~/.config/specdojo/vllm-mlx/models.yaml
```

設定ファイル内のモデルディレクトリが存在することを確認する。

```bash
ls -la ~/vllm-mlx-models/qwen3.6-27b-4bit
ls -la ~/vllm-mlx-models/gemma-4-26b-a4b-it-4bit
ls -la ~/vllm-mlx-models/gemma-4-e4b-it-4bit
```

## 7. macOSでの起動と疎通確認

まずはフォアグラウンドで Model Registry を起動する。

```bash
vllm-mlx serve \
  --models-config ~/.config/specdojo/vllm-mlx/models.yaml \
  --port 8000 \
  --ssd-cache-dir ~/.cache/vllm-mlx/kv-cache
```

Registryに登録された論理モデルを確認する。

```bash
curl http://localhost:8000/v1/models
```

最初の疎通確認は、`code` から実行する。`code` は Qwen3.6 系であり、SpecDojo の単一モデル構成と同じモデルを使う。

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer not-needed" \
  -d '{"model":"code","messages":[{"role":"user","content":"短く疎通確認の返答をしてください。"}],"max_tokens":32,"stream":false}'
```

Gemma 4 系モデルを検証する場合は、`markdown-fast` から確認する。

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer not-needed" \
  -d '{"model":"markdown-fast","messages":[{"role":"user","content":"短く疎通確認の返答をしてください。"}],"max_tokens":32,"stream":false}'
```

品質比較が必要な場合のみ、`markdown` を確認する。

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer not-needed" \
  -d '{"model":"markdown","messages":[{"role":"user","content":"Markdown設計書レビューの観点を3つ挙げてください。"}],"max_tokens":128,"stream":false}'
```

Anthropic互換APIとして使う場合は、ツール側に以下を設定する。

```bash
export ANTHROPIC_BASE_URL=http://localhost:8000
export ANTHROPIC_API_KEY=not-needed
```

## 8. LaunchAgentで常駐させる場合

Model Registry 構成では、LaunchAgent は1つだけ作成する。

```bash
mkdir -p ~/bin
code ~/bin/specdojo-vllm-mlx-registry.sh
chmod +x ~/bin/specdojo-vllm-mlx-registry.sh
```

`~/bin/specdojo-vllm-mlx-registry.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"

exec vllm-mlx serve \
  --models-config "$HOME/.config/specdojo/vllm-mlx/models.yaml" \
  --port 8000 \
  --ssd-cache-dir "$HOME/.cache/vllm-mlx/kv-cache"
```

LaunchAgentを作る。

```bash
code ~/Library/LaunchAgents/org.specdojo.vllm-mlx-registry.plist
```

`org.specdojo.vllm-mlx-registry.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>org.specdojo.vllm-mlx-registry</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>-lc</string>
    <string>$HOME/bin/specdojo-vllm-mlx-registry.sh</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>/tmp/vllm-mlx-registry.out.log</string>
  <key>StandardErrorPath</key>
  <string>/tmp/vllm-mlx-registry.err.log</string>
</dict>
</plist>
```

読み込み:

```bash
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/org.specdojo.vllm-mlx-registry.plist
launchctl kickstart -k gui/$(id -u)/org.specdojo.vllm-mlx-registry
```

ログを見る場合:

```bash
tail -f /tmp/vllm-mlx-registry.err.log
```

LaunchAgent の設定変更後に再起動する場合は、以下を実行する。

```bash
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/org.specdojo.vllm-mlx-registry.plist 2>/dev/null || true
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/org.specdojo.vllm-mlx-registry.plist
launchctl kickstart -k gui/$(id -u)/org.specdojo.vllm-mlx-registry
```

## 9. devcontainerからの疎通確認

devcontainer 内から Host Mac 上の vllm-mlx に接続する場合、`localhost` は devcontainer 自身を指すため、Docker Desktop が提供する `host.docker.internal` を使う。

まず、devcontainer のターミナルで OpenAI互換APIに到達できることを確認する。

```bash
curl http://host.docker.internal:8000/v1/models
```

生成APIまで確認する場合は、用途に応じた論理モデル名を指定する。最初は `code` を使う。

```bash
curl http://host.docker.internal:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer not-needed" \
  -d '{"model":"code","messages":[{"role":"user","content":"devcontainer から疎通確認しています。短く返答してください。"}],"max_tokens":32,"stream":false}'
```

OpenAI SDK 互換ツールから参照する場合は、devcontainer 内で base URL を設定する。

```bash
export OPENAI_BASE_URL=http://host.docker.internal:8000/v1
export OPENAI_API_KEY=not-needed
```

opencode から使う場合の custom provider 設定は [tsd-vllm-mlx-mr-opencode](tsd-vllm-mlx-mr-opencode.md) を参照する。

Anthropic互換ツールから参照する場合は、devcontainer 内で base URL を設定する。

```bash
export ANTHROPIC_BASE_URL=http://host.docker.internal:8000
export ANTHROPIC_API_KEY=not-needed
```

接続できない場合は、Host Mac 側で以下を確認する。

- vllm-mlx が起動していること: `curl http://localhost:8000/v1/models`
- `models.yaml` の `path` が絶対パスで存在すること
- devcontainer が Docker Desktop 上で動作していること
- `host.docker.internal` が名前解決できること: `getent hosts host.docker.internal`
- ポート 8000 を他プロセスが使用していないこと: `lsof -i :8000`

## 10. トラブルシュート

### 10.1. `model=None` で 500 になる場合

生成後に `ChatCompletionResponse` の `model` が `None` になり、`Input should be a valid string` で 500 になる場合は、推論後のOpenAI互換レスポンス生成で論理モデル名が引き継がれていない。まず vllm-mlx を更新し、サーバを再起動する。

```bash
uv tool upgrade vllm-mlx
```

更新後も再現する場合は、Model Registry 構成を中断し、[tsd-vllm-mlx](tsd-vllm-mlx.md) の単一モデル構成へ戻す。

### 10.2. Gemma 4 系で `shared_kv` エラーになる場合

`patch_gemma4_attention_for_batching.<locals>._patched_call() got an unexpected keyword argument 'shared_kv'` が出る場合は、Gemma 4 系モデルと batching patch の互換性問題である。`models.yaml` の Gemma 4 系モデルは `continuous_batching: false` にし、起動コマンドでも `--continuous-batching` を付けない。

### 10.3. 生成が長く続く場合

疎通確認やツール設定の確認では、必ず `max_tokens` を明示する。短い確認では `32` から始め、実運用ではタスクに応じて上限を調整する。

### 10.4. メモリ不足や応答遅延が出る場合

`preload: true` のモデルを減らし、`manager.memory_budget_gb` と各モデルの `estimated_memory_gb` を実測に合わせる。巨大モデルを複数同時にロードしようとしている場合は、単一モデル構成や別ポートの単一モデルプロセスへ切り替える。

## 11. アンインストール

Model Registry 構成を削除する場合は、常駐設定、設定ファイル、CLI、モデルデータを分けて扱う。

### 11.1. 常駐設定の停止

```bash
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/org.specdojo.vllm-mlx-registry.plist 2>/dev/null || true
rm ~/Library/LaunchAgents/org.specdojo.vllm-mlx-registry.plist
rm ~/bin/specdojo-vllm-mlx-registry.sh
rm -f ~/.config/specdojo/vllm-mlx/models.yaml
```

### 11.2. vllm-mlx CLIの削除

```bash
uv tool uninstall vllm-mlx
```

pip / venv でインストールしていた場合は、該当環境で削除する。

```bash
pip uninstall vllm-mlx
```

### 11.3. モデルデータとキャッシュの削除（任意）

```bash
rm -rf ~/vllm-mlx-models/qwen3.6-27b-4bit
rm -rf ~/vllm-mlx-models/gemma-4-26b-a4b-it-4bit
rm -rf ~/vllm-mlx-models/gemma-4-e4b-it-4bit
rm -rf ~/.cache/vllm-mlx
```

Hugging Face cache まで削除する場合は、他ツールのモデルも消える可能性があるため、用途を確認してから削除する。

```bash
rm -rf ~/.cache/huggingface
```

### 11.4. ログファイルの削除（任意）

```bash
rm -f /tmp/vllm-mlx-registry.out.log /tmp/vllm-mlx-registry.err.log
```

## 12. 参考

- [vllm-mlx PyPI](https://pypi.org/project/vllm-mlx/)
- [vllm-mlx GitHub](https://github.com/waybarrios/vllm-mlx)
