---
specdojo:
  id: prj-0001:pjr-tm1b-claude-edit-allowlist-too-narrow
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-08T14:40:23Z"
  due_on: null
---

# PJR-TM1B claude の provider の既定の書き込み許可が狭く、利用者のリポジトリの多くの作業ができない

## 1. 課題内容

公開物での実地の確認（2026-10-08）で、init が claude 用に作る .specdojo/claude/settings.edit.json の許可が Edit(docs/**)・Edit(src/**)・Edit(tests/**) だけのため、README.md への 1 行の追記もできず項目が waiting になった。ルートのファイルや app/・lib/ など別のディレクトリの成果物も編集できない。保護機構（agent-config-write の検査）との兼ね合いで、既定でどこまで書き込みを許すか（例: リポジトリ全体を許し、保護対象は deny と runner の検査で守る）を決める必要がある。利用者の判断を待つ。

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
