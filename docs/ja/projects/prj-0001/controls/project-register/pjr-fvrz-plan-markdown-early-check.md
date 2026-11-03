---
specdojo:
  id: prj-0001:pjr-fvrz-plan-markdown-early-check
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-03T05:23:56Z"
  due_on: "2026-11-07"
  derived_from:
    - PJR-GQN3
  commit_type: feat
  commit_scope: schedule
---

# PJR-FVRZ phase の説明の Markdown の誤りが実行するまで分からない

## 1. 課題内容

schedule の phase の説明は plan の本文に入るが、Markdown の誤りは exec run の checkpoint の commit で初めて分かる。schedule build か exec plan の時点で plan の Markdown を検査して失敗させる

## 2. 入力

- 2026-11-03 に track data-flow-uc-rewrite の 3 タスクを exec run --auto --parallel 3 で流したところ、3 タスクとも checkpoint の commit が markdownlint の MD032 で拒否されて始まる前に失敗した（原因は phase の説明で箇条書きの前に空行がなかったこと、72749b20e で修正済み）
- exec run --dry-run は plan を作るだけで、checkpoint の commit とその検査までは試さないため、事前に見つけられなかった（2026-11-03）

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
