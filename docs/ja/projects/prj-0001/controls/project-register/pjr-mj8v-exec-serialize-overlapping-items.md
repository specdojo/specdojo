---
specdojo:
  id: prj-0001:pjr-mj8v-exec-serialize-overlapping-items
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-16T03:22:47Z"
  due_on: null
  derived_from:
    - PJR-1GCD
  commit_type: feat
  commit_scope: exec
---

# PJR-MJ8V 同じ範囲を触る項目を並べて流さず、順番に流す

## 1. 概要

並列の run で、同じファイルや同じ範囲を変えそうな項目を同時に流さず、先の項目の統合の後に流す

## 2. 入力

- 2026-11-15〜16、PJR-1GCD と PJR-ED0K が同じ develop から分かれて src/exec/run/lifecycle-commands.ts・in-place.ts・register-resume.ts などの同じ関数を書き換えた。ED0K が先に統合されたため、1GCD は再開の前の同期でコードの衝突になり、orchestrator が手で両方の規則を合わせて解いた
- merge を直列化しても（PJR-30SA）、同じ起点から同じ範囲を変えた 2 件目の衝突は防げない。防ぐには、流す前に範囲が重なる項目を順番にするか、衝突を executor に解かせる必要がある。まず前者を入れ、後者は起きたときの手当てとして別に扱う（2026-11-16、利用者が起票を依頼）

## 3. 完了条件

- `exec run --register`・schedule の並列の run で、変更の範囲が重なりそうな項目（個票や plan に書いた対象のファイル・ディレクトリ、成果物の対象から推定）を同時に流さず、先の項目の統合の後に流す。
- 範囲の推定の仕方（明示した対象、approach の既定の範囲、推定できない場合の扱い）を決めて文書に書く。推定できない項目は従来どおり並べてよいかを選べる。
- 順番を待たせた項目と理由（重なった範囲と相手の項目）を run の出力と記録に残す。
- 1GCD と ED0K の形（同じ関数を書き換える 2 件）を再現するテストで、2 件目が先の統合の後に流れ、衝突しない。
- `npm run check` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                      | 担当 | 状態 | メモ |
| --- | --------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 範囲の推定の仕方を設計する（対象の宣言、approach の既定） | DEV  | open | -    |
| 2   | 並列の run の並べ方に、範囲の重なりによる順番待ちを入れる | DEV  | open | -    |
| 3   | 記録・出力と文書を更新し、回帰テストを足す                | DEV  | open | -    |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[prj-0001:pjr-1gcd-exec-condense-records-missing-retry]]
- [[prj-0001:pjr-ed0k-exec-resume-executor-from-integrate]]
- [[prj-0001:pjr-30sa-specdojo-git-serialized]]
