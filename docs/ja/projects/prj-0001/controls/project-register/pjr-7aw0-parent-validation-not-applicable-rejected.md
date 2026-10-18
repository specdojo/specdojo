---
specdojo:
  id: prj-0001:pjr-7aw0-parent-validation-not-applicable-rejected
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-18T14:46:06Z"
  derived_from:
    - PJR-Z104
---

# PJR-7AW0 親検証の検査を executor が not_applicable と報告すると runner が退けて止まる

## 1. 課題内容

2026-10-18 23:45 に PJR-WJE6 を qwen-executor で流したところ、qwen は親 runner が流す検査（npm run lint:md など 7 件）を、規約どおり自分では流さず not_applicable（理由: parent runner runs）と報告した。runner は script があるため当てはまると判定して not_applicable を退け、親検証の 7 件はすべて通っていたのに executor validation failed or not run で waiting にした。親検証に設定された検査についての executor の報告は、親 runner の結果で置き換えるか無視するべきである

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
