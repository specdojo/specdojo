---
specdojo:
  id: prj-0001:pjr-8wbn-conditional-not-applicable-rejected
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-18T14:51:17Z"
  derived_from:
    - PJR-Z104
---

# PJR-8WBN 変更の種類で決まる検査の not_applicable を runner が script の有無だけで退ける

## 1. 課題内容

2026-10-18 23:50 に PJR-WSET を agy-expert-executor で流したところ、agy は npm run validate:schema:file を「YAML の成果物を変えていない」として not_applicable と報告した（規約の「YAML 成果物を編集した場合」に従った判断）。runner は script が package.json にあるため当てはまると判定して退け、親検証 7 件が通っていたのに executor validation failed or not run で waiting にした。規約の検査の多くは変更したファイルの種類で当てはまるかが決まるが、runner は script の有無しか見ていない

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
