---
specdojo:
  id: copilot-provider-templates
  type: guide
  status: draft
---

# GitHub Copilot Provider テンプレート

## 1. 目的

`specdojo exec` が GitHub Copilot CLI を agent として起動する際の設定と、対話用オーケストレーターの配布原本です。exec の executor / reporter は個別の agent 定義ファイルを使わず、permission は `.specdojo/exec-defaults.yaml` の `providers.copilot.command_template` のフラグが正本です。オーケストレーターだけは Copilot CLI の custom agent として `.github/agents/specdojo-orchestrator.md` を使います。

## 2. 構成

| パス                         | 利用プロジェクトでの配置先 | 説明                                                                                                              |
| ---------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `agent-members-snippet.yaml` | `.specdojo/copilot/`       | agent 定義のスニペット。`.specdojo/agent-members.yaml` へ統合して使う参照用                                       |
| `exec-defaults-snippet.yaml` | `.specdojo/copilot/`       | `providers.copilot`（command template・rate limit 検出）のスニペット。`exec-defaults.yaml` へコピーして使う参照用 |
| 同梱 orchestrator wrapper    | `.github/agents/`          | `npm run orch:copilot` が参照する `specdojo-orchestrator` custom agent                                            |

## 3. 導入手順

利用プロジェクトのルートで scaffold コマンドを実行します。

```sh
specdojo config scaffold --provider copilot
```

コピー後に次を行います。

1. `.specdojo/copilot/exec-defaults-snippet.yaml` の `providers.copilot` を `.specdojo/exec-defaults.yaml` の `providers` へコピーする。
2. `.specdojo/copilot/agent-members-snippet.yaml` の member 定義をリポジトリ共通の `.specdojo/agent-members.yaml` の `members` へコピーし、使う場合は `disabled: false` にする。agent は project ごとの `pm-members.yaml` へ書かない。
3. `copilot login` で認証する（premium request の課金が発生する）。
4. `npm run orch:copilot` でオーケストレーターを起動できることを確認する。
5. VS Code から使う場合は、Copilot Chat を開き、agent の選択肢から `specdojo-orchestrator` を選ぶ（`.github/agents/specdojo-orchestrator.md` が読み込まれます）。
6. 最初のタスクで permission ログを確認し、`shell(...)` パターンのマッチ粒度が不足していれば `--allow-tool` を追記する。

## 4. カスタマイズ

- フラグの追加・変更は `providers.copilot.command_template` の1箇所で行う（member 側に `command` を書かない）。
- `--allow-all` / `--yolo` / `--allow-all-tools` / `--allow-all-paths` / 環境変数 `COPILOT_ALLOW_ALL` は使わない。
- `--deny-tool` の `git add` / `git commit` / `git push` は維持する。deny は `--allow-all-tools` より優先されるため、許可リストの追記で誤って開くことを防ぐ保険になる。
- 権限設計の背景は `exec-config-guide.md` の `agent 権限とプロンプトインジェクション対策` を参照する。
