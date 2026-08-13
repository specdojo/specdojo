---
specdojo:
  id: prj-0001:pjr-hz4c-tmux-terminal-npm-run-docs-dev-port-forwarding
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
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

| No  | 作業                                                                                    | 担当 | 状態    | メモ                                                                 |
| --- | --------------------------------------------------------------------------------------- | ---- | ------- | -------------------------------------------------------------------- |
| 1   | `.devcontainer/devcontainer.json` に `forwardPorts: [5173]` と `portsAttributes` を追加 | ARC  | done    | `VitePress docs` として固定ポート 5173 を明示登録                    |
| 2   | Dev Container を Rebuild し、設定が反映されることを確認                                 | ARC  | handoff | 現行の agent 実行環境を再作成できないため、次回 rebuild 時に確認する |
| 3   | tmux ターミナルから `npm run docs:dev` を起動し、Ports パネルへの自動登録を確認         | ARC  | handoff | VS Code の Dev Container 接続後に実機確認する                        |
| 4   | ホスト/リモート端末のブラウザから転送URLでアクセスできることを確認                      | ARC  | handoff | Ports パネルに表示された転送 URL で実機確認する                      |

## 4. 対応結果

- `.devcontainer/devcontainer.json` に `forwardPorts: [5173]` を追加し、terminal のポート自動検出に依存せず、VS Code がコンテナ接続時にポート 5173 を転送する構成にした。
- `portsAttributes` にラベル `VitePress docs` と `onAutoForward: notify` を設定し、Ports パネル上の識別と転送開始の通知を明示した。
- tmux からの起動手順、VS Code の接続が必要な範囲、転送 URL の確認方法を[[tsd-home-mac-dev-server-usage|自宅 MacBook Pro 開発サーバ運用ガイド]]へ追記した。
- JSONC/Markdown の整形・静的検査と register/catalog/index の検証は完了した。Dev Container の rebuild、VS Code Ports パネル、接続元ブラウザは現行の agent 実行環境から操作できないため、上表 No. 2〜4 を実機確認の申し送りとした。

## 5. 関連ドキュメント

- [[tsd-home-mac-dev-server|自宅 MacBook Pro 開発サーバ技術スタック定義]]
- [[tsd-home-mac-dev-server-usage|自宅 MacBook Pro 開発サーバ運用ガイド]]
