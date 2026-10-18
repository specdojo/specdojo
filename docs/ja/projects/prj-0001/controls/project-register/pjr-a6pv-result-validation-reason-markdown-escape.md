---
specdojo:
  id: prj-0001:pjr-a6pv-result-validation-reason-markdown-escape
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-18T18:07:57Z"
  derived_from:
    - PJR-8WBN
---

# PJR-A6PV result に書く検査の理由の文で * などがエスケープされず、統合の前に止まる

## 1. 課題内容

2026-10-19 03:07 の PJR-EVAX で、executor が validate:schema:file の not_applicable の理由に「No `*.yaml` or `*.yml` files were changed」と書き、runner がそれをそのまま result に描いたため、_.yaml or * が強調と読まれて markdownlint の MD037 に当たり、統合の前の記法の検査で止まった。8WBN・Z104 の後は executor が not_applicable の理由を書くことが増えたため起きやすい

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
