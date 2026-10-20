---
specdojo:
  id: prj-0001:pjr-3k1x-register-actor-roster-validation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-20T12:59:05Z"
---

# PJR-3K1X register の --by の actor が名簿と照らし合わされず、書き方がばらばらになっている

## 1. 課題内容

register の --by に渡した値は、項目別のイベントの actor にそのまま記録され、人の名簿（pm-members.yaml）とも agent の名簿（agent-members.yaml）とも照らし合わされない。本リポジトリのイベントでは、オーケストレーターが orchestrator・claude-orchestrator・specdojo-orchestrator、人が naoji3x・manual・PO（役割の名前）、同じ agent が 2 段構成の前後で codex-expert-executor と sol-executor と記録され、誰が決めて誰が close したかを名簿からたどれない（2026-10-20、利用者の質問で分かった）

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
