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

| パス          | 利用プロジェクトでの配置先 | 説明                                                                   |
| ------------- | -------------------------- | ---------------------------------------------------------------------- |
| `agents/*.md` | `.opencode/agents/`        | agent 定義。パス単位の `edit` とコマンド許可リストの `bash` を含む正本 |

配布する role は、従来の edit / review に加え、成果物編集と検証だけを担う `opencode-executor`、入力された evidence から構造化結果だけを返す `opencode-reporter` を含みます。

## 3. 導入手順

利用プロジェクトのルートで scaffold コマンドを実行します。

```sh
specdojo exec scaffold --provider opencode
```

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

2. `.specdojo/agent-members.yaml` を実体と別名の 2 段で書く。実体は model の系統で名付け（`gemma-executor`・`qwen-executor` など）、`model` に `opencode.json` の provider 名を含む ID（`ollama-local/gemma4:31b-mlx-work-64k` など）を持つ。従来の名前（`opencode-executor` など）は `aliases` で実体を指す別名にする。
3. モデル接続設定（`opencode.json` の provider / model）を利用環境に合わせて作成する。ローカル Ollama の接続先などマシン固有の値を含むため、このテンプレートには含めていない。
4. コピーしたファイルをコミットする。worktree はコミット済み内容から作られるため、未コミットだと agent 実行時に設定が読めない。

## 4. カスタマイズ

- edit agent の `permission.edit` は既定で `docs/**`、`src/**`、`tests/**` を許可する。`permission.edit` / `permission.bash` のパターンは、利用プロジェクトの成果物・execution ディレクトリ配置に合わせて調整する。
- 従来の `opencode run --agent {nickname}` と model を持つ定義ファイルで組んだ 1 段の名簿は、そのまま動く。scaffold は既存ファイルを上書きしないため、`--force` で役割ごとの定義（model を持たない）に置き換える場合だけ、上の `command_template` と 2 段の名簿へ移す。
- executor の result パス deny と reporter の全ツール deny は、pipeline の責務境界なので維持する。
- `bash` は deny 基点の許可リストを維持する。`git add` / `git commit` を許可しないこと（許可すると specdojo CLI の commit 許可リストを迂回できる）。
- 権限設計の背景は `exec-config-guide.md` の `agent 権限とプロンプトインジェクション対策` を参照する。
