---
specdojo:
  id: prj-0001:pjr-hz4c-tmux-terminal-npm-run-docs-dev-port-forwarding
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-08-12T22:17:50Z"
  due_on: "2026-08-31"
---

# PJR-HZ4C tmuxのterminalからnpm run docs:devを起動してもport forwardingを機能させる

## 1. 概要

現状、npm run docs:devはvscodeのterminalで実行し、vscodeのport forwarding機能でホスト/リモート端末からWebページを表示している。tmuxのterminalから起動した場合も同様にport forwardingできるようにする。

## 2. 完了条件

- `docs:dev`（`vitepress dev . --host 0.0.0.0 --port 5173`）を tmux のターミナルから起動した場合でも、VS Code の Ports パネルにポート 5173 が自動登録され、ホスト/リモート端末からブラウザでアクセスできる。
- vscode の統合ターミナルから起動した場合と同様の挙動になることを確認する。

## 3. 作業内容

| No  | 作業                                                                                    | 担当 | 状態 | メモ                                   |
| --- | --------------------------------------------------------------------------------------- | ---- | ---- | -------------------------------------- |
| 1   | `.devcontainer/devcontainer.json` に `forwardPorts: [5173]` と `portsAttributes` を追加 | ARC  | open | vitepress の固定ポート 5173 を明示登録 |
| 2   | Dev Container を Rebuild し、設定が反映されることを確認                                 | ARC  | open | 既存起動中コンテナには反映されないため |
| 3   | tmux ターミナルから `npm run docs:dev` を起動し、Ports パネルへの自動登録を確認         | ARC  | open | -                                      |
| 4   | ホスト/リモート端末のブラウザから転送URLでアクセスできることを確認                      | ARC  | open | -                                      |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
