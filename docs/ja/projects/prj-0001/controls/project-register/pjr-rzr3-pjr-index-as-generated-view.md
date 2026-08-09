---
specdojo:
  id: prj-0001:pjr-rzr3-pjr-index-as-generated-view
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: ARC
  registered_on: "2026-08-09"
  due_on: "2026-08-31"
---

# PJR-RZR3 pjr-index を generated 配下の生成ビューへ移す

## 1. 概要

[[prj-0001:pjr-es57-register-file-ssot-migration]] の分割3。個票群から登録項目一覧を生成し、`pjr-index.md` を `generated/` 配下の非追跡な派生ビューへ移す。既存の派生ビュー（状態別・優先度別・担当者別、controls 全体の type 別ビュー）も同じ入力から生成されるようにする。

## 2. 完了条件

- 個票群から一覧が生成され、`generated/` 配下へ出力される。
- 出力が決定的である。同一入力から同一出力が得られ、ファイル列挙順に依存しない。
- 生成物が追跡対象から外れている。
- 既存の派生ビューが個票群を入力として生成される。
- 一覧を手編集する運用が残っていない。手編集しても次回生成で失われることが文書化されている。

## 3. 作業内容

| No  | 作業                                         | 担当 | 状態 | メモ                                             |
| --- | -------------------------------------------- | ---- | ---- | ------------------------------------------------ |
| 1   | 個票群を入力とする一覧生成処理を実装する     | ARC  | open | ソート順を明示的に固定する                       |
| 2   | 出力先を `generated/` へ変更する             | ARC  | open | 既存の非追跡ルールに従う                         |
| 3   | 既存の派生ビュー生成の入力を個票群へ変更する | ARC  | open | controls 全体の type 別ビューを含む              |
| 4   | 文書内リンクと参照の解決先を確認する         | ARC  | open | 個票からの参照、他文書からの参照の双方を確認する |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-es57-register-file-ssot-migration]]: 分割元の移行タスク
- [[prj-0001:pjr-rf3b-register-item-frontmatter-schema]]: 生成の入力となるスキーマ定義
- [[specdojo:directory-layout-reference]]: 生成物の配置規約
