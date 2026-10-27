---
specdojo:
  id: prj-0001:pjr-ab1y-register-centric-guides
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-10-27T22:58:44Z"
  derived_from:
    - PJR-NJJ7
  depends_on:
    - PJR-WAGY
---

# PJR-AB1Y ガイドを register を起点とする構成へ書き換える

## 1. 概要

register-operation、exec-operation の実行経路の使い分け、timeline-design、command-reference を、register と epic を起点とする構成へ書き換える

- PJR-NJJ7 の決定と、PJR-B4Y4・PJR-WAGY の実装に合わせて、ガイドを register を起点とする構成へ書き換える。

## 2. 完了条件

- register-operation-guide の `登録簿の位置づけ` で、「schedule へ移った作業は二重に管理しない」を「register が起点と完了の判断を持ち、途中の進み具合は schedule が持つ」に書き換える。
- exec-operation-guide の `実行経路の使い分け` で、register と schedule を同格の 2 経路ではなく親と子として説明する。
- timeline-design-guide の `運用タイミング` の図と表を、「`epic` の起票 → 子 todo でカタログ → strategy → sch-track → schedule」の流れに書き換え、`catalog_status` を register から導くことを書く。
- specdojo-overview-guide と quick-start-guide の基本的な流れと技の説明を、上の 3 本と食い違わないようにそろえる。
- 名前とコマンドは PJR-B4Y4 と PJR-WAGY で実装したものに合わせ、実装にない機能は書かない。
- `npm run lint:md` と `npm run docs:build` が通り、親の検証 7 件が通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。

## 3. 作業内容

| No  | 作業                                                    | 担当     | 状態 | メモ |
| --- | ------------------------------------------------------- | -------- | ---- | ---- |
| 1   | register-operation-guide を書き換える                   | executor | open | -    |
| 2   | exec-operation-guide を書き換える                       | executor | open | -    |
| 3   | timeline-design-guide を書き換える                      | executor | open | -    |
| 4   | specdojo-overview-guide と quick-start-guide をそろえる | executor | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:register-operation-guide]]
- [[specdojo:exec-operation-guide]]
- [[specdojo:timeline-design-guide]]
- [[specdojo:specdojo-overview-guide]]
- [[specdojo:quick-start-guide]]
