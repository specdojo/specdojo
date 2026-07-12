---
specdojo:
  id: copilot-provider-templates
  type: guide
  status: draft
---

# GitHub Copilot Provider テンプレート

## 1. 目的

`specdojo exec` が GitHub Copilot CLI を agent として起動する際の設定の配布原本です。copilot は agent 定義ファイルを持たず、permission は `pm-members.yaml` の `command` フラグがすべてです。

## 2. 構成

| パス                      | 利用プロジェクトでの配置先 | 説明                                                              |
| ------------------------- | -------------------------- | ----------------------------------------------------------------- |
| `pm-members-snippet.yaml` | `.specdojo/copilot/`       | member 定義のスニペット。`pm-members.yaml` へコピーして使う参照用 |

## 3. 導入手順

利用プロジェクトのルートで scaffold コマンドを実行します。

```sh
specdojo exec scaffold --provider copilot
```

コピー後に次を行います。

1. `.specdojo/copilot/pm-members-snippet.yaml` の member 定義を `pm-members.yaml` の `members` へコピーし、使う場合は `disabled: false` にする。
2. `copilot login` で認証する（premium request の課金が発生する）。
3. 最初のタスクで permission ログを確認し、`shell(...)` パターンのマッチ粒度が不足していれば `--allow-tool` を追記する。

## 4. カスタマイズ

- `--allow-all` / `--yolo` / `--allow-all-tools` / `--allow-all-paths` / 環境変数 `COPILOT_ALLOW_ALL` は使わない。
- `--deny-tool` の `git add` / `git commit` / `git push` は維持する。deny は `--allow-all-tools` より優先されるため、許可リストの追記で誤って開くことを防ぐ保険になる。
- 権限設計の背景は `specdojo-exec-config-guide.md` の `agent 権限とプロンプトインジェクション対策` を参照する。
