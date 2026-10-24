---
specdojo:
  id: prj-0001:pjr-r1fb-completion-record-destination
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  registered_at: "2026-10-24T22:28:40Z"
---

# PJR-R1FB orchestrator が register の完了条件で executor の記録の書き先を誤る

## 1. 課題内容

orchestrator の指示文は完了条件で「result に書く」と指示させるが、executor/reporter の pipeline では executor の記録は result の申し送りに届かず、条件が果たせない。書き先の指示・close の確かめ方・報告の形式・plan の雛形を直す。

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
