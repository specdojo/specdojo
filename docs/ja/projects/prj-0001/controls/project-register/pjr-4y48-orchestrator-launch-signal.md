---
specdojo:
  id: prj-0001:pjr-4y48-orchestrator-launch-signal
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-10-10T01:05:02Z"
  due_on: "2026-10-31"
---

# PJR-4Y48 orchestrator launch が Ctrl-C で先に終了し provider の CLI が取り残される

## 1. 課題内容

specdojo orchestrator launch は SIGINT の既定動作で即座に終了し、Ctrl-C を入力の取り消しに使う claude や codex の CLI だけが動き続けて端末の操作が壊れる。子の実行中は SIGINT/SIGQUIT を無視し、SIGTERM/SIGHUP を転送する。

## 2. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 3. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
