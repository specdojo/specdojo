---
specdojo:
  id: prj-0001:pjr-a0ne-not-applicable-check-blocks
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-08T14:40:34Z"
  due_on: null
---

# PJR-A0NE 適用されない検査を executor が not_run と記録すると、作業が済んでいても止まる

## 1. 課題内容

公開物での実地の確認（2026-10-08、claude）で、executor が共通規約の「適用条件を満たさない検査は記録しない」に従わず、prettier を「package.json にないので適用外」として not_run と記録し、runner の判定で waiting になった。agent が規約に従わないと止まるため、適用外を表す検証の状態（例: not_applicable）を加えて block しないようにするか、規約の伝え方を強めるかを決める。利用者の判断を待つ。

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
