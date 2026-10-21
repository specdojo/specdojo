---
specdojo:
  id: prj-0001:pjr-6sqh-register-index-escape-emphasis
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-21T13:56:54Z"
  derived_from:
    - PJR-A6PV
---

# PJR-6SQH 登録簿の一覧のセルで強調の記号がエスケープされず lint-md が止まる

## 1. 課題内容

一覧の生成はセルの縦棒はエスケープするが、アスタリスクとアンダースコアはしない。説明や結論に orch: のあとにアスタリスクを付けた書き方が 2 つあると強調と解釈され、MD037 で親の検証の lint-md が止まり、develop から分かれた run がすべて止まる

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
