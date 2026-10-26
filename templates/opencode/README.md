---
specdojo:
  id: opencode-provider-templates
  type: guide
  status: draft
---

# OpenCode Provider テンプレート

## 1. 目的

`specdojo exec` が OpenCode CLI を agent として起動する際に使う設定一式の配布原本です。permission は agent 定義の frontmatter に含まれます。

## 2. 構成

| パス            | 利用プロジェクトでの配置先 | 説明                                                                        |
| --------------- | -------------------------- | --------------------------------------------------------------------------- |
| `agents/*.md`   | `.opencode/agents/`        | agent 定義。パス単位の `edit` とコマンド許可リストの `bash` を含む正本      |
| `opencode.json` | `opencode.json`            | Ollama の接続設定（provider: `ollama-local`）と `*-mlx-work-64k` モデル設定 |

配布する role は、成果物編集と検証を担う `opencode-executor`、成果物を変更せずレビューする `opencode-review-executor`、入力された evidence から構造化結果だけを返す `opencode-reporter`、対話型で操作を代行する `specdojo-orchestrator` を含みます。

## 3. 導入手順

利用プロジェクトのルートで scaffold コマンドを実行します。

```sh
specdojo config scaffold --provider opencode
# または specdojo exec scaffold --provider opencode
```

実行すると、`.opencode/agents/*.md` と `opencode.json` が配置されます（既存ファイルは上書きされません）。

コピー後に次を行います。

1. `.specdojo/exec-defaults.yaml` の `providers.opencode.command_template` に `opencode run --agent {agent} --model {model}` を指定し、`command_params.by_mode` で mode から役割の定義を選ぶ。agent の定義は役割ごとの 1 ファイルで model を持たず、model は実体の member の `model` を `--model` で渡す。member 側に `command` は書かない。

   ```yaml
   providers:
     opencode:
       command_template: "opencode run --agent {agent} --model {model}"
       command_params:
         by_mode:
           edit: { agent: opencode-executor }
           review: { agent: opencode-review-executor }
           report: { agent: opencode-reporter }
   ```

2. `.specdojo/agent-members.yaml` を実体と別名の 2 段で書く。実体は model の系統で名付け（`gemma-executor`・`qwen-executor` など）、`model` に `opencode.json` の provider 名を含む ID（`ollama-local/gemma4:31b-mlx-work-64k`、`ollama-local/gemma4:26b-mlx-work-64k`、`ollama-local/qwen3.8:27b-mlx-work-64k` など）を持つ。従来の名前（`opencode-executor` など）は `aliases` で実体を指す別名にする。
3. `opencode.json` の接続先（`baseURL`）を利用環境に合わせて確認・調整する（「接続先の設定手順」を参照）。
4. Ollama で文脈長 64k の派生モデルタグ（`*-mlx-work-64k`）を作成する（「派生タグ作成手順」を参照）。
5. コピーしたファイルをコミットする。worktree はコミット済み内容から作られるため、未コミットだと agent 実行時に設定が読めない。

## 4. 派生タグ作成手順（`*-mlx-work-64k`）

SpecDojo のタスク実行では、rulebook・recipe・依存成果物・対象成果物をまとめて読み込むため、公式モデルの既定文脈長（2k〜32k）では作業セットが収まらず agent が終了する場合があります。そのため、Gemma および Qwen では原則として文脈長を 64k（`65536`）に広げた派生タグ（`*-mlx-work-64k`）を使用します。

> [!IMPORTANT]
> `*-mlx-work-64k` は公式配布タグ（`ollama pull` で直接取得できるタグ）ではありません。公式のベースモデルから利用者の手元で作成するローカル派生タグです。公式配布タグとして扱わないでください。

### 作成コマンド例

```bash
# 1. 公式ベースモデルの取得
ollama pull gemma4:31b-mlx
ollama pull gemma4:26b-mlx
ollama pull qwen3.8:27b-mlx

# 2. Modelfile の作成と派生タグの登録
# Gemma 4 31B:
echo -e "FROM gemma4:31b-mlx\nPARAMETER num_ctx 65536" > Modelfile.gemma31b
ollama create gemma4:31b-mlx-work-64k -f Modelfile.gemma31b

# Gemma 4 26B:
echo -e "FROM gemma4:26b-mlx\nPARAMETER num_ctx 65536" > Modelfile.gemma26b
ollama create gemma4:26b-mlx-work-64k -f Modelfile.gemma26b

# Qwen 3.8 27B:
echo -e "FROM qwen3.8:27b-mlx\nPARAMETER num_ctx 65536" > Modelfile.qwen27b
ollama create qwen3.8:27b-mlx-work-64k -f Modelfile.qwen27b
```

Linux や Windows などの非 MLX 環境で標準のベースモデル（`gemma4:31b` 等）を使う場合は、`FROM gemma4:31b` を指定した Modelfile から同様に `*-mlx-work-64k` タグを作成するか、`opencode.json` と名簿のモデル名を環境に合わせて変更してください。

作成後の確認:

```bash
ollama list
```

## 5. 接続先の設定手順

scaffold で生成される `opencode.json` は、devcontainer からホスト側の Ollama に接続することを前提として `http://host.docker.internal:11434/v1` を既定値に設定しています。

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "ollama-local": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama Local",
      "options": {
        "baseURL": "http://host.docker.internal:11434/v1",
        "apiKey": "not-needed"
      },
      "models": {
        "gemma4:31b-mlx-work-64k": {
          "name": "Gemma 4 31B MLX Work (64k)"
        },
        "gemma4:26b-mlx-work-64k": {
          "name": "Gemma 4 26B MLX Work (64k)"
        },
        "qwen3.8:27b-mlx-work-64k": {
          "name": "Qwen3.8 27B MLX Work (64k)"
        }
      }
    }
  },
  "model": "ollama-local/gemma4:31b-mlx-work-64k"
}
```

環境に応じた調整:

- **Docker Desktop 上の devcontainer**: 既定値 `http://host.docker.internal:11434/v1` のまま使用できます。
- **Linux ホスト / ローカル直接実行**: `http://127.0.0.1:11434/v1` または `http://localhost:11434/v1` に変更します。Ollama サービスが外部からの接続を受け付けるよう、`OLLAMA_HOST=0.0.0.0:11434` が設定されていることを確認してください。
- **リモートホストの Ollama**: `http://<リモートホストIPまたはFQDN>:11434/v1` を指定します。

### 疎通確認

```bash
curl http://host.docker.internal:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer not-needed" \
  -d '{
    "model": "gemma4:26b-mlx-work-64k",
    "messages": [{"role": "user", "content": "疎通確認"}],
    "max_tokens": 16,
    "stream": false
  }'
```

## 6. 既存環境の修正手順

`specdojo config scaffold` および `specdojo init` は、既存の `opencode.json` や `.specdojo/agent-members.yaml` を既定では上書きしません。

既に OpenCode 設定を導入済みのプロジェクトで、接続設定や `*-mlx-work-64k` モデル指定へ移行する場合は、以下の手順を手動で実施します。

1. **`opencode.json` の作成・更新**:
   リポジトリ直下に `opencode.json` がない場合は作成し、既存の `opencode.json` がある場合は `provider.ollama-local` と `*-mlx-work-64k` モデル定義を追加します。
2. **`.specdojo/agent-members.yaml` のモデル更新**:
   各 member の `model` を `ollama-local/gemma4:31b-mlx-work-64k`、`ollama-local/gemma4:26b-mlx-work-64k`、`ollama-local/qwen3.8:27b-mlx-work-64k` に更新します。
3. **`.opencode/agents/specdojo-orchestrator.md` の更新**:
   オーケストレーターの agent 定義がある場合は、frontmatter の `model` を `ollama-local/gemma4:31b-mlx-work-64k` に更新します。
4. **派生モデルの作成**:
   手元の Ollama で「派生タグ作成手順」に従い `*-mlx-work-64k` タグを作成します。

## 7. カスタマイズ

- edit agent の `permission.edit` は既定で `docs/**`、`src/**`、`tests/**` を許可する。`permission.edit` / `permission.bash` のパターンは、利用プロジェクトの成果物・execution ディレクトリ配置に合わせて調整する。
- 従来の `opencode run --agent {nickname}` と model を持つ定義ファイルで組んだ 1 段の名簿は、そのまま動く。scaffold は既存ファイルを上書きしないため、`--force` で役割ごとの定義（model を持たない）に置き換える場合だけ、上の `command_template` と 2 段の名簿へ移す。
- executor の result パス deny と reporter の全ツール deny は、pipeline の責務境界なので維持する。
- executor・review executor の `bash` は deny 基点の許可リストを維持する。`git add` / `git commit` を許可せず、末尾の `git push` と全 `gh` の明示 deny も維持する（許可リストの追加で remote 操作を誤って開かないため）。
- orchestrator は利用者の承認後に保護設定も変更できるよう `edit` をリポジトリ全体で allow する。`gh pr view`・`gh pr list`・`gh run list`・`gh run view`・`gh release view` などの読み取りだけを allow し、`git push`、`gh api`、PR・release・repository などの書き込みサブコマンドは明示 deny する。それ以外の `gh` は先頭の `"*": deny` により拒否する。
- 権限設計の背景は `exec-config-guide.md` の `agent 権限とプロンプトインジェクション対策` を参照する。
