---
specdojo:
  id: prj-0001:pjr-rdnc-update-docs-for-ticket-ssot
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-RDNC rulebook・運用ガイド・テンプレートを個票正本へ更新する

## 1. 概要

[[prj-0001:pjr-es57-register-file-ssot-migration]] の分割7。個票 frontmatter が正本になることに合わせて、記載ルール・運用手順・テンプレートを更新する。二重管理を前提とした規則と、個票を作るかどうかの判断基準を削除する。

## 2. 完了条件

- [[specdojo:pjr-rulebook]] から index と個票の同期規則が削除され、構造化フィールドの正本が個票 frontmatter であると明示されている。
- 「個票を作る項目／作らない項目」の判断基準が廃止され、全項目が個票を持つ前提で記述されている。
- [[specdojo:register-operation-guide]] の運用手順が新しい構成へ更新され、撤去した機構の記述が残っていない。
- 個票テンプレートと一覧テンプレートが新構成に合わせて更新されている。
- 一覧が生成物であることと、手編集しない旨が文書化されている。

## 3. 作業内容

| No  | 作業                           | 担当 | 状態 | メモ                                        |
| --- | ------------------------------ | ---- | ---- | ------------------------------------------- |
| 1   | rulebook を更新する            | ARC  | open | 同期規則の削除と正本の明示                  |
| 2   | 運用ガイドを更新する           | ARC  | open | 撤去した機構に関する記述の削除を含む        |
| 3   | テンプレートを更新する         | ARC  | open | 個票テンプレートと一覧テンプレートが対象    |
| 4   | 関連する参照文書の記述を揃える | ARC  | open | 配置規約や CLI リファレンスの記述を確認する |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-es57-register-file-ssot-migration]]: 分割元の移行タスク
- [[specdojo:pjr-rulebook]]: 更新対象の記載ルール
- [[specdojo:register-operation-guide]]: 更新対象の運用手順
- [[prj-0001:pjr-37wn-remove-id-reservation-mechanisms]]: 記述削除の対象となる機構の撤去
