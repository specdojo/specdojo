---
specdojo:
  id: prj-0001:pjr-22n9-grade-kata-kind-ignored
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-11-22T13:16:07Z"
  derived_from:
    - PJR-7M9J
---

# PJR-22N9 grade run の --kata と --kind を一緒に指定すると、--kind が無視される

## 1. 課題内容

grade run --target kata --kata prj-charter --kind recipe は、recipe ではなく rulebook と sample を評価した。--kind で型の種類を選べず、recipe と template を --kata で評価できない。

## 2. 入力

- 2026-11-22 の grade（run id prj-charter-recipe-20261122、opus-review-executor）で、ログに rulebook（pass 90）と sample（needs-work 83）だけが出て、recipe の結果のファイルは更新されなかった。
- --kata のヘルプは「Grade rulebook and sample for this kata name」で、--kind は rulebook・recipe・sample・template・all を受け付ける。
- 利用者の承認（2026-11-22、indie）で起票した。担当と期限は未定。

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
