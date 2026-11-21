---
specdojo:
  id: prj-0001:pjr-77jb-exec-run-named-disabled-member
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-11-21T00:23:41Z"
  derived_from:
    - PJR-XA6Y
---

# PJR-77JB exec run が名前で指定された無効な member をそのまま起動する

## 1. 課題内容

agent-members.yaml で disabled にした member でも、exec run --executor-by や --reporter-by で名前を指定すると起動前に断られない。grade run の --by は断る

## 2. 入力

- 2026-11-21、agy の member を disabled にした後、exec run --register PJR-XA6Y --executor-by flash-high-executor --reporter-by gemma26-reporter --dry-run が通った。grade run --by flash-high-executor は「--by agent is disabled in agent-members.yaml」で断られた
- src/exec/run/shared.ts は自動選択でだけ disabled を除き、コメントに Named selections resolve outside this function とある。src/exec/agent-plan.ts と src/exec/trial-core.ts は disabled を確かめている
- 当面の回避策として、exec-defaults の antigravity の `command_template` を外し、起動コマンドを解決できなくして断っている（afbebe967）

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
