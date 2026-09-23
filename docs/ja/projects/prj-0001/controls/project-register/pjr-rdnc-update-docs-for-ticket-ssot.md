---
specdojo:
  id: prj-0001:pjr-rdnc-update-docs-for-ticket-ssot
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-08-09T08:48:42Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-09T11:39:40Z"
---

# PJR-RDNC rulebook・運用ガイド・テンプレートを個票正本へ更新する

## 1. 概要

PJR-ES57 の分割7。index と個票の同期規則を削除し、個票分離基準の二分を廃止して、テンプレートを新構成へ揃える。

[[prj-0001:pjr-es57-register-file-ssot-migration]] の分割7。個票 frontmatter が正本になることに合わせて、記載ルール・運用手順・テンプレートを更新する。二重管理を前提とした規則と、個票を作るかどうかの判断基準を削除する。

## 2. 完了条件

- [[specdojo:pjr-rulebook]] から index と個票の同期規則が削除され、構造化フィールドの正本が個票 frontmatter であると明示されている。
- 「個票を作る項目／作らない項目」の判断基準が廃止され、全項目が個票を持つ前提で記述されている。
- [[specdojo:register-operation-guide]] の運用手順が新しい構成へ更新され、撤去した機構の記述が残っていない。
- 個票テンプレートと一覧テンプレートが新構成に合わせて更新されている。
- 一覧が生成物であることと、手編集しない旨が文書化されている。

## 3. 作業内容

| No  | 作業                           | 担当 | 状態 | メモ                                               |
| --- | ------------------------------ | ---- | ---- | -------------------------------------------------- |
| 1   | rulebook を更新する            | ARC  | done | 同期規則を削除し、個票 Frontmatter 正本を明示した  |
| 2   | 運用ガイドを更新する           | ARC  | done | 個票分離・予約起票など撤去済み機構の記述を削除した |
| 3   | テンプレートを更新する         | ARC  | done | 全 type 個票と一覧テンプレートを新構成へ揃えた     |
| 4   | 関連する参照文書の記述を揃える | ARC  | done | CLI・quick start・exec ガイドを確認・更新した      |

## 4. 対応結果

- [[specdojo:pjr-rulebook]] を個票 Frontmatter 正本のルールへ更新し、一覧と個票の同期規則および個票分離基準を削除した。生成一覧・派生ビューは `register build` の出力であり、直接編集しないことを明記した。
- [[specdojo:register-operation-guide]] と CLI リファレンスから、`--ticket`、予約起票、統合ブランチ自動ルーティング、同期スクリプトを前提とする説明を削除した。
- 一覧テンプレートと全 type の個票テンプレートを、個票 Frontmatter の初期処理状態・優先度を持つ新構成へ揃えた。

## 5. 関連ドキュメント

- [[prj-0001:pjr-es57-register-file-ssot-migration]]: 分割元の移行タスク
- [[specdojo:pjr-rulebook]]: 更新対象の記載ルール
- [[specdojo:register-operation-guide]]: 更新対象の運用手順
- [[prj-0001:pjr-37wn-remove-id-reservation-mechanisms]]: 記述削除の対象となる機構の撤去
