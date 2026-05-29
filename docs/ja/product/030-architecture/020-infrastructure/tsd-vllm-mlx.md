---
id: tsd-vllm-mlx
type: architecture
status: draft
rulebook: tsd-rulebook
---

# vllm-mlx 技術スタック定義

SpecDojoでは、ドキュメント作成、コード生成、レビューなどでLLMを活用することを想定しており、Apple Silicon 向けのローカル実行基盤として vllm-mlx を技術スタック候補として定義する。なお、vllm-mlx の使用は必須ではない。

SpecDojo の標準構成では、Model Registry 方式は採用せず、`mlx-community/Qwen3.6-27B-4bit` を単一モデルとして起動する。Model Registry は複数モデルを1プロセスで切り替えられる一方で、依存ライブラリやレスポンス生成処理の影響を受けやすいため、まずは単一モデル構成を安定運用の基準とする。

## 1. vllm-mlx実行環境

vllm-mlx は Apple Silicon Mac 上で MLX を利用して LLM を実行するサーバーを対象とする。OpenAI互換の `/v1/*` API と Anthropic互換の `/v1/messages` API を同一プロセスから提供できるため、複数AgentやOpenAI SDK互換ツールから利用しやすい。

Ollama よりも、以下を重視する場合に採用候補とする。

- OpenAI互換APIで既存ツールから接続したい
- Anthropic互換APIで Claude Code / opencode 系ツールから接続したい
- continuous batching や prefix cache を使い、複数リクエストの処理効率を上げたい
- Apple Silicon の unified memory と Metal / MLX を前提にした推論基盤を使いたい

## 2. mise + uv ベースの実行環境

vllm-mlx は Python ベースのCLIとして提供されるため、Python と uv は mise で管理する。PyPI 上の vllm-mlx は Python `>=3.10` を要求し、3.10〜3.13 系に対応しているが、SpecDojo では依存パッケージの安定性を優先して **Python 3.12** を標準とする。

まず、mise をインストールする。

```bash
brew install mise
```

Python 3.12 と uv を mise でインストールする。

```bash
mise install python@3.12 uv@latest
```

グローバル既定として使う場合は、以下を設定する。

```bash
mise use -g python@3.12 uv@latest
```

リポジトリ単位で固定したい場合は、リポジトリルートで以下を実行する。

```bash
mise use python@3.12 uv@latest
```

有効化を確認する。

```bash
python --version
uv --version
mise current
```

vllm-mlx は uv tool としてインストールする。`--python 3.12` を明示し、mise で入れた Python 3.12 を使う前提にする。

```bash
uv tool install --python 3.12 vllm-mlx
```

既にインストール済みの場合は、更新しておく。

```bash
uv tool upgrade vllm-mlx
```

インストール後、CLI が見えることを確認する。

```bash
vllm-mlx --help
```

## 3. 採用モデル

SpecDojo の vllm-mlx 標準モデルは `mlx-community/Qwen3.6-27B-4bit` とする。コーディング、設計書レビュー、Markdown整理を1つのモデルで扱い、モデル切り替えに起因する運用不安定さを避ける。

| 用途                           | 採用モデル                       | 備考                                          |
| ------------------------------ | -------------------------------- | --------------------------------------------- |
| コーディング                   | `mlx-community/Qwen3.6-27B-4bit` | Qwen3.6-27B の mlx-community 版 MLX 4bit 変換 |
| Markdown設計書の作成・レビュー | `mlx-community/Qwen3.6-27B-4bit` | 単一モデル運用を優先                          |
| 軽めの設計書整理・要約         | `mlx-community/Qwen3.6-27B-4bit` | 速度より安定性を優先                          |

Gemma 4 系モデルは、mlx-vlm 側の Attention 実装や vllm-mlx 側の batching patch との組み合わせで不安定になることがあるため、SpecDojo の標準構成からは外す。品質比較や検証目的で追加する場合も、まず Qwen3.6 単一構成の疎通確認が完了してから別ポートで試す。

## 4. 単一モデル構成の方針

SpecDojo では、vllm-mlx の Model Registry 方式を標準採用しない。`vllm-mlx serve <model-path>` で1モデルを1プロセスとして起動し、OpenAI互換APIでは `model` に `default` を指定する。

基本方針:

- vllm-mlx の常駐プロセスは1つにする
- 起動対象は `~/vllm-mlx-models/qwen3.6-27b-4bit` に固定する
- APIの接続先は `http://localhost:8000` に固定する
- OpenAI互換APIの `model` は `default` を使う
- devcontainer からは `http://host.docker.internal:8000` に接続する
- Model Registry の `--models-config` は使わない

複数モデルを同時に扱う必要が出た場合は、Model Registry ではなく、モデルごとに別プロセス・別ポートで起動する。ただし、巨大モデルを複数同時に起動すると unified memory を圧迫するため、常用構成では避ける。

## 5. メモリ安定化設定

Qwen3.6-27B-4bit は軽量モデルではないため、長いコンテキストや複数Agentからの同時利用では unified memory を圧迫しやすい。初期運用では、短いプロンプトと小さめの `max_tokens` で疎通確認し、実測に合わせて運用値を広げる。

基本方針:

- 疎通確認では `max_tokens` を明示する
- 複数Agentから同時に叩く前に、単一リクエストで安定性を確認する
- 長文レビューではレスポンス上限をツール側で制御する
- continuous batching は必要になってから有効化する
- SSD cache は長文・複数リクエスト運用時に使う

安定優先の起動では、まず `--continuous-batching` を付けずに起動する。単一モデルでの通常生成が安定してから、必要に応じて continuous batching を有効化する。

## 6. モデル取得

vllm-mlx は Hugging Face 上の MLX 形式モデルを直接利用できる。SpecDojo ではローカルパスを明示して運用するため、まず `model acquire` で Qwen3.6-27B-4bit を取得する。

```bash
mkdir -p ~/vllm-mlx-models
vllm-mlx model acquire mlx-community/Qwen3.6-27B-4bit \
  --target-dir ~/vllm-mlx-models/qwen3.6-27b-4bit
```

モデル情報を確認する。

```bash
vllm-mlx model inspect ~/vllm-mlx-models/qwen3.6-27b-4bit
```

取得したモデルディレクトリが存在することを確認する。

```bash
ls -la ~/vllm-mlx-models/qwen3.6-27b-4bit
```

## 7. macOSでの起動と常駐

まずはフォアグラウンドで単一モデルを起動する。`vllm-mlx serve` は Model Registry を使わない場合、第一引数にモデルパスまたは Hugging Face のモデルIDを指定する必要がある。さらに、OpenAI互換APIで使う `model` 名を固定するため、`--served-model-name default` を指定する。SpecDojo では再ダウンロードや解決差異を避けるため、取得済みのローカルパスを指定する。

```bash
vllm-mlx serve ~/vllm-mlx-models/qwen3.6-27b-4bit \
  --served-model-name default \
  --port 8000 \
  --ssd-cache-dir ~/.cache/vllm-mlx/kv-cache
```

起動直後は、別ターミナルからモデル一覧を確認する。

```bash
curl http://localhost:8000/v1/models
```

単一モデル起動では、起動時に `--served-model-name default` を指定しているため、OpenAI互換APIの `model` に `default` を指定する。疎通確認では長い生成を避けるため、`max_tokens` を明示する。

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer not-needed" \
  -d '{"model":"default","messages":[{"role":"user","content":"短く疎通確認の返答をしてください。"}],"max_tokens":32,"stream":false}'
```

`choices[0].message.content` に文章が返れば、モデルのロードと生成まで確認できている。

continuous batching を検証する場合は、単一モデル構成で通常生成が安定してから、以下のように起動オプションを追加する。

```bash
vllm-mlx serve ~/vllm-mlx-models/qwen3.6-27b-4bit \
  --served-model-name default \
  --port 8000 \
  --continuous-batching \
  --ssd-cache-dir ~/.cache/vllm-mlx/kv-cache
```

Anthropic互換APIとして使う場合は、ツール側に以下を設定する。

```bash
export ANTHROPIC_BASE_URL=http://localhost:8000
export ANTHROPIC_API_KEY=not-needed
```

### 7.1. LaunchAgentで常駐させる場合

単一モデル構成では、LaunchAgent は1つだけ作成する。

```bash
mkdir -p ~/bin
code ~/bin/specdojo-vllm-mlx-qwen.sh
chmod +x ~/bin/specdojo-vllm-mlx-qwen.sh
```

`~/bin/specdojo-vllm-mlx-qwen.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"

exec vllm-mlx serve "$HOME/vllm-mlx-models/qwen3.6-27b-4bit" \
  --served-model-name default \
  --port 8000 \
  --ssd-cache-dir "$HOME/.cache/vllm-mlx/kv-cache"
```

LaunchAgentを作る。

```bash
code ~/Library/LaunchAgents/org.specdojo.vllm-mlx-qwen.plist
```

`org.specdojo.vllm-mlx-qwen.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>org.specdojo.vllm-mlx-qwen</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>-lc</string>
    <string>$HOME/bin/specdojo-vllm-mlx-qwen.sh</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>/tmp/vllm-mlx-qwen.out.log</string>
  <key>StandardErrorPath</key>
  <string>/tmp/vllm-mlx-qwen.err.log</string>
</dict>
</plist>
```

読み込み:

```bash
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/org.specdojo.vllm-mlx-qwen.plist
launchctl kickstart -k gui/$(id -u)/org.specdojo.vllm-mlx-qwen
```

ログを見る場合:

```bash
tail -f /tmp/vllm-mlx-qwen.err.log
```

LaunchAgent の設定変更後に再起動する場合は、以下を実行する。

```bash
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/org.specdojo.vllm-mlx-qwen.plist 2>/dev/null || true
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/org.specdojo.vllm-mlx-qwen.plist
launchctl kickstart -k gui/$(id -u)/org.specdojo.vllm-mlx-qwen
```

## 8. devcontainerからの疎通確認

devcontainer 内から Host Mac 上の vllm-mlx に接続する場合、`localhost` は devcontainer 自身を指すため、Docker Desktop が提供する `host.docker.internal` を使う。

まず、devcontainer のターミナルで OpenAI互換APIに到達できることを確認する。

```bash
curl http://host.docker.internal:8000/v1/models
```

生成APIまで確認する場合は、`model` に `default` を指定する。

```bash
curl http://host.docker.internal:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer not-needed" \
  -d '{"model":"default","messages":[{"role":"user","content":"devcontainer から疎通確認しています。短く返答してください。"}],"max_tokens":32,"stream":false}'
```

OpenAI SDK 互換ツールから参照する場合は、devcontainer 内で base URL を設定する。

```bash
export OPENAI_BASE_URL=http://host.docker.internal:8000/v1
export OPENAI_API_KEY=not-needed
```

opencode から使う場合の custom provider 設定は [tsd-vllm-mlx-opencode](tsd-vllm-mlx-opencode.md) を参照する。

Anthropic互換ツールから参照する場合は、devcontainer 内で base URL を設定する。

```bash
export ANTHROPIC_BASE_URL=http://host.docker.internal:8000
export ANTHROPIC_API_KEY=not-needed
```

## 9. トラブルシュート

### 9.1. `model` に何を指定するか

`vllm-mlx serve` の起動時には、第一引数に `~/vllm-mlx-models/qwen3.6-27b-4bit` のようなモデルパスを指定する。`--served-model-name` を指定しない場合、OpenAI互換APIに公開されるモデル名はモデルパスになる。SpecDojo の単一モデル構成では `--served-model-name default` を指定し、APIリクエストの `model` には `default` を使う。

```bash
curl http://localhost:8000/v1/models
```

`/v1/models` で別のIDが返る場合は、そのIDを `model` に指定する。

### 9.2. 生成が長く続く場合

疎通確認やツール設定の確認では、必ず `max_tokens` を明示する。短い確認では `32` から始め、実運用ではタスクに応じて上限を調整する。

### 9.3. メモリ不足や応答遅延が出る場合

他のローカルLLMプロセスを止め、まず `--continuous-batching` なしで起動する。長文レビューや複数Agentからの同時利用をする場合は、ツール側の並列数と `max_tokens` を下げる。

### 9.4. Model Registry を使いたくなった場合

Model Registry は複数モデルを1プロセスで切り替えられるが、モデル実装やレスポンス生成処理の互換性問題を受けやすい。SpecDojo の標準手順では使わない。複数モデル検証が必要な場合は、まず別ポートの単一モデルプロセスとして起動する。

## 10. アンインストール

vllm-mlx を削除する場合は、常駐設定、CLI、モデルデータを分けて扱う。モデルデータは容量が大きく、削除すると再ダウンロードが必要になるため、必要な場合だけ削除する。

### 10.1. 常駐設定の停止

SpecDojo 用の LaunchAgent を使っている場合は、先に停止する。

```bash
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/org.specdojo.vllm-mlx-qwen.plist 2>/dev/null || true
rm ~/Library/LaunchAgents/org.specdojo.vllm-mlx-qwen.plist
rm ~/bin/specdojo-vllm-mlx-qwen.sh
```

### 10.2. vllm-mlx CLIの削除

`uv tool` でインストールした vllm-mlx を削除する。

```bash
uv tool uninstall vllm-mlx
```

pip / venv でインストールしていた場合は、該当環境で削除する。

```bash
pip uninstall vllm-mlx
```

削除後、API が応答しないことを確認する。

```bash
curl http://localhost:8000/v1/models
```

接続エラーになれば、常駐プロセスは停止している。

### 10.3. モデルデータとキャッシュの削除（任意）

明示的に取得したモデルや cache も削除する場合は、作成したディレクトリを削除する。

```bash
rm -rf ~/vllm-mlx-models/qwen3.6-27b-4bit
rm -rf ~/.cache/vllm-mlx
```

Hugging Face cache まで削除する場合は、他ツールのモデルも消える可能性があるため、用途を確認してから削除する。

```bash
rm -rf ~/.cache/huggingface
```

### 10.4. ログファイルの削除（任意）

LaunchAgent で出力していたログが不要なら削除する。

```bash
rm -f /tmp/vllm-mlx-qwen.out.log /tmp/vllm-mlx-qwen.err.log
```

## 11. 参考

- [vllm-mlx PyPI](https://pypi.org/project/vllm-mlx/)
- [vllm-mlx GitHub](https://github.com/waybarrios/vllm-mlx)
