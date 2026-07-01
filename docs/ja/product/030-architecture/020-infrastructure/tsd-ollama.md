---
id: tsd-ollama
type: architecture
status: draft
rulebook: tsd-rulebook
---

# Ollama 技術スタック定義

SpecDojoでは、ドキュメント作成、コード生成、レビューなどでLLMを活用することを想定しており、ローカル実行基盤として Ollama を技術スタックの一部として定義する。なお、Ollama の使用は必須ではない。

## 1. Ollama実行環境

Ollama を対象とする。以下、macOSでの設定、常駐のさせ方、devcontainer からの疎通確認、モデル定義をまとめる。LinuxやWindowsでの設定については、今後追記予定。

## 2. mise + uv ベースの共通ツール環境

Ollama 本体は最新版を公式インストールスクリプトで導入し、macOS 上で常駐させる。一方、LLM 周辺の補助CLIや vllm-mlx などの Python ベースのローカルLLMサーバーと合わせて運用できるように、Python と uv は mise で管理する。

SpecDojo では、ローカルLLM関連ツールの標準 Python を **Python 3.12** とする。Python 3.12 は主要な ML / CLI パッケージとの互換性が安定しており、Python 3.13 固有の依存解決差分を避けやすい。

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

Ollama 本体は、公式インストールスクリプトで最新版を導入する。

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

## 3. Ollamaモデルの選定

Ollama では、Ollama の公式ライブラリタグを優先して指定する。vllm-mlx で使う `mlx-community/...` 形式の MLX モデルIDとは異なるため、同じ用途でもランタイムごとにモデル名を分けて管理する。

| 用途                         | 推奨モデル                 | 備考                                                       |
| ---------------------------- | -------------------------- | ---------------------------------------------------------- |
| 通常作業                     | `qwen3.6:27b-mlx`          | 設計、レビュー、通常のコード生成で使う標準モデル           |
| Markdown生成・レビュー       | `gemma4:31b-mlx`           | Markdown の生成・レビューで使う標準モデル                  |
| 軽作業                       | `gemma4:e4b-mlx`           | 短い要約、分類、文面調整、軽いMarkdown整理で使う軽量モデル |
| 重い実装                     | `qwen3.6:27b-coding-mxfp8` | リポジトリ横断の実装、複雑な修正、重いコードレビューで使う |
| 最終判断・難しい設計レビュー | Claude Code / Codex        | ローカルLLMの結果を必要に応じて補完する                    |

SpecDojo では、通常作業を `qwen3.6:27b-mlx`、Markdown の生成・レビューを `gemma4:31b-mlx`、軽作業を `gemma4:e4b-mlx`、重い実装を `qwen3.6:27b-coding-mxfp8` に分担させる。`qwen3.6:27b-coding-mxfp8` はメモリ使用量が大きいため、常用ではなく、実装負荷が高い作業に限定してロードする。

`qwen3.6:27b-mlx` と `qwen3.6:27b-coding-mxfp8` は Ollama 公式ライブラリ側のモデルタグであり、vllm-mlx で使う `mlx-community/...` 形式の MLX モデルIDとは分けて管理する。サードパーティ名前空間のモデルは、公式ライブラリに必要な量子化やタグがない場合の代替候補として扱う。

## 4. メモリ安定化設定

複数Agentを使う場合、重いモデルを常時複数ロードしない方が安定するため、環境変数を設定して Ollama を起動する運用を採用する。

```bash
export OLLAMA_KEEP_ALIVE=10m
export OLLAMA_MAX_LOADED_MODELS=2
```

`OLLAMA_MAX_LOADED_MODELS=2` にしておくと、重いモデルの同時常駐を抑えやすくなる。`qwen3.6:27b-coding-mxfp8` を使う作業では、通常作業用の `qwen3.6:27b-mlx` と同時に長時間常駐させない運用を推奨する。

但し、macOS では Ollama.app として常駐するため、`export` した環境変数は app に引き継がれない。app へ環境変数を渡すには `launchctl setenv` を使い、設定後に app を再起動する（次章参照）。

## 5. macOSでの設定と常駐のさせ方

公式インストールスクリプトは macOS では `/Applications/Ollama.app` を配置し、`/usr/local/bin/ollama` への symlink を作成したうえで Ollama.app を起動する。Ollama.app はメニューバー常駐アプリで、以降はログイン時に自動起動するため、常駐のための追加設定は不要である。

SpecDojo では「メモリ安定化設定」の環境変数を app に反映させる。macOS の GUI アプリは `export` した環境変数を引き継がないため、`launchctl setenv` で設定する。

```bash
launchctl setenv OLLAMA_KEEP_ALIVE 10m
launchctl setenv OLLAMA_MAX_LOADED_MODELS 2
```

設定を反映するため、Ollama.app を再起動する。

```bash
killall Ollama 2>/dev/null || true
open -a Ollama --args hidden
```

`launchctl setenv` はログインセッション単位のため、再起動すると設定が消える。ログインごとに自動で反映するには、環境変数の設定と Ollama.app の再起動だけを行う専用の LaunchAgent を用意する（Ollama 本体は app が常駐するため、この LaunchAgent はサーバを起動しない）。

環境変数設定用の LaunchAgent を作る。

```bash
code ~/Library/LaunchAgents/org.specdojo.ollama-env.plist
```

内容は `ops/local/launchd/org.specdojo.ollama-env.plist` を参照。ログイン時に `launchctl setenv` で環境変数を設定し、Ollama.app を再起動する。app のログイン項目より先に起動しても、この再起動で環境変数が確実に反映される。

読み込む。

```bash
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/org.specdojo.ollama-env.plist
launchctl kickstart -k gui/$(id -u)/org.specdojo.ollama-env
```

環境変数が設定されたことを確認する。

```bash
launchctl getenv OLLAMA_KEEP_ALIVE
launchctl getenv OLLAMA_MAX_LOADED_MODELS
```

常駐と API 到達を確認する。

```bash
curl http://localhost:11434/api/tags
```

モデル一覧の JSON が返れば、常駐と環境変数の反映まで確認できている。

ログを見る場合：

```bash
tail -f ~/.ollama/logs/server.log
```

## 6. devcontainerからの疎通確認

devcontainer 内から Host Mac 上の Ollama に接続する場合、`localhost` は devcontainer 自身を指すため、Docker Desktop が提供する `host.docker.internal` を使う。

まず、devcontainer のターミナルで Ollama API に到達できることを確認する。

```bash
curl http://host.docker.internal:11434/api/tags
```

モデル一覧の JSON が返れば、devcontainer から Host Mac の Ollama に疎通できている。

生成APIまで確認する場合は、軽量モデルで短いプロンプトを送る。

```bash
curl http://host.docker.internal:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"gemma4:e4b-mlx","prompt":"devcontainer から疎通確認しています。短く返答してください。","stream":false}'
```

`response` フィールドに文章が返れば、モデルのロードと生成まで確認できている。

CLIやアプリケーションから Ollama を参照する場合は、devcontainer 内で `OLLAMA_HOST` を設定する。

```bash
export OLLAMA_HOST=http://host.docker.internal:11434
ollama list
```

`ollama` CLI が devcontainer 内にない場合でも、HTTP API の `curl` 確認が通れば、アプリケーションからは同じURLで接続できる。

接続できない場合は、Host Mac 側で以下を確認する。

- Ollama が起動していること: `curl http://localhost:11434/api/tags`
- devcontainer が Docker Desktop 上で動作していること
- `host.docker.internal` が名前解決できること: `getent hosts host.docker.internal`

## 7. モデルのダウンロードとチューニング

Ollama のモデルは Host Mac 側でダウンロードする。devcontainer から利用する場合でも、モデル実体は Host Mac 上の Ollama が管理する。

まず、利用する元モデルを `ollama pull` で取得する。

```bash
ollama pull qwen3.6:27b-mlx
ollama pull gemma4:e4b-mlx
ollama pull gemma4:31b-mlx
ollama pull qwen3.6:27b-coding-mxfp8
```

取得済みモデルを確認する。

```bash
ollama list
```

モデルを試しに実行し、初回ロードまで確認する。

```bash
ollama run qwen3.6:27b-mlx "通常作業用として、TypeScript の関数例を1つ示してください。"
ollama run gemma4:e4b-mlx "軽作業用として、短い設計書のタイトル案を3つ出してください。"
ollama run gemma4:31b-mlx "中量作業用として、設計書の要約を3文でまとめてください。"
ollama run qwen3.6:27b-coding-mxfp8 "重い実装用として、TypeScript のリファクタリング観点を箇条書きで出してください。"
```

不要になった元モデルまたは派生モデルは `ollama rm` で削除する。

```bash
ollama rm qwen3.6:27b-mlx
ollama rm gemma4:e4b-mlx
ollama rm gemma4:31b-mlx
ollama rm qwen3.6:27b-coding-mxfp8
```

複数Agent運用前提のため、すべてのモデルを巨大コンテキストで動かさない設定を適用する。ダウンロード済みの元モデルを `FROM` に指定し、用途ごとにコンテキスト長と生成パラメータを分けた派生モデルを作成する。

Host Mac で以下のディレクトリを作成して、そこに以下のモデルファイルを作成する。

```bash
mkdir -p ~/ollama-modelfiles
cd ~/ollama-modelfiles
```

### 7.1. Qwen3.6-27B 通常作業用

`qwen3.6-27b-mlx-work-32k/Modelfile`:

```text
FROM qwen3.6:27b-mlx
PARAMETER num_ctx 32768
PARAMETER temperature 0.2
PARAMETER top_p 0.9
PARAMETER repeat_penalty 1.05
```

作成:

```bash
ollama create qwen3.6:27b-mlx-work-32k -f qwen3.6-27b-mlx-work-32k/Modelfile
```

### 7.2. Qwen3.6-27B 通常作業用（レビュー・長文向け 64k）

`qwen3.6-27b-mlx-work-64k/Modelfile`:

```text
FROM qwen3.6:27b-mlx
PARAMETER num_ctx 65536
PARAMETER temperature 0.2
PARAMETER top_p 0.9
PARAMETER repeat_penalty 1.05
```

作成:

```bash
ollama create qwen3.6:27b-mlx-work-64k -f qwen3.6-27b-mlx-work-64k/Modelfile
```

### 7.3. Gemma 4 E4B 軽作業用

`gemma4-e4b-mlx-light-8k/Modelfile`:

```text
FROM gemma4:e4b-mlx
PARAMETER num_ctx 8192
PARAMETER temperature 0.3
PARAMETER top_p 0.9
```

作成:

```bash
ollama create gemma4:e4b-mlx-light-8k -f gemma4-e4b-mlx-light-8k/Modelfile
```

### 7.4. Gemma 4 31B Markdown生成・レビュー用（64k）

`gemma4-31b-mlx-work-64k/Modelfile`:

```text
FROM gemma4:31b-mlx
PARAMETER num_ctx 65536
PARAMETER temperature 0.2
PARAMETER top_p 0.9
PARAMETER repeat_penalty 1.05
```

作成:

```bash
ollama create gemma4:31b-mlx-work-64k -f gemma4-31b-mlx-work-64k/Modelfile
```

### 7.5. Qwen3.6-27B Coding MXFP8 重い実装用

`qwen3.6-27b-coding-mxfp8-64k/Modelfile`:

```text
FROM qwen3.6:27b-coding-mxfp8
PARAMETER num_ctx 65536
PARAMETER temperature 0.2
PARAMETER top_p 0.9
PARAMETER repeat_penalty 1.05
```

作成:

```bash
ollama create qwen3.6:27b-coding-mxfp8-64k -f qwen3.6-27b-coding-mxfp8-64k/Modelfile
```

### 7.6. 動作確認

```bash
ollama run qwen3.6:27b-mlx-work-32k "通常作業用として、TypeScriptのテスト設計の観点を出してください。"
```

```bash
ollama run qwen3.6:27b-mlx-work-64k "レビュー用として、このMarkdownの構成上の問題点を指摘してください。"
```

```bash
ollama run gemma4:31b-mlx-work-64k "Markdown生成・レビュー用として、この設計書の構成上の改善点を挙げてください。"
```

```bash
ollama run gemma4:e4b-mlx-light-8k "軽作業用として、短い設計書のタイトル案を3つ出してください。"
```

```bash
ollama run qwen3.6:27b-coding-mxfp8-64k "重い実装用として、既存コードを安全に変更する観点を箇条書きで出してください。"
```

## 8. アンインストール

Ollama を削除する場合は、常駐設定、Ollama.app 本体、モデルデータを分けて扱う。モデルデータは容量が大きく、削除すると再ダウンロードが必要になるため、必要な場合だけ削除する。

### 8.1. 常駐設定の停止

Ollama.app を終了する。

```bash
killall Ollama 2>/dev/null || true
```

環境変数設定用の LaunchAgent を作成している場合は、停止・削除する。

```bash
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/org.specdojo.ollama-env.plist 2>/dev/null || true
rm -f ~/Library/LaunchAgents/org.specdojo.ollama-env.plist
```

自動起動を止めるため、ログイン項目から Ollama を外す（システム設定 > 一般 > ログイン項目、または以下）。

```bash
osascript -e 'tell application "System Events" to delete login item "Ollama"' 2>/dev/null || true
```

「メモリ安定化設定」で設定した環境変数を解除する。

```bash
launchctl unsetenv OLLAMA_KEEP_ALIVE
launchctl unsetenv OLLAMA_MAX_LOADED_MODELS
```

### 8.2. Ollama 本体の削除

公式インストールスクリプトで配置した Ollama.app と symlink を削除する。

```bash
rm -rf /Applications/Ollama.app
sudo rm -f /usr/local/bin/ollama
```

削除後、API が応答しないことを確認する。

```bash
curl http://localhost:11434/api/tags
```

接続エラーになれば、常駐プロセスは停止している。

### 8.3. モデルデータの削除（任意）

モデルデータも削除する場合は、Ollama のデータディレクトリを削除する。ログ（`~/.ollama/logs`）もこのディレクトリに含まれる。

```bash
rm -rf ~/.ollama
```

SpecDojo 用に作成した Modelfile 作業ディレクトリも不要なら削除する。

```bash
rm -rf ~/ollama-modelfiles
```
