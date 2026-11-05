---
specdojo:
  id: prj-0001:pjr-eakn-stsd-mermaid-rulebook-split
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-05T10:45:09Z"
  derived_from:
    - PJR-3APD
    - PJR-00NY
  depends_on:
    - PJR-KBS6
  approach: rulebook-maintenance
  targets:
    - specdojo:stsd-mermaid-rulebook
---

# PJR-EAKN stsd の図の rulebook に、分割した図の初期点と終了点の扱いを足す

## 1. 概要

3APD の段 6。図を分割したときに各図へ初期点を置くか、終了点を置かない境界の書き方を stsd-mermaid-rulebook に足し、stsd-rulebook とそろえる

## 2. 入力

- PJR-Q9AW の磨き込みで、16 遷移を通常系と例外系の 2 図に分けた。初期点を各分割図に置くかが明示されていないため、初期点は通常系に置き、例外系は共有状態でつないだ
- 終了点を置かない境界の書き方は、先に PJR-KBS6 で stsd-rulebook に足す内容とそろえる

## 3. 完了条件

- [[specdojo:stsd-mermaid-rulebook]] の図の分割の規則に、分割したそれぞれの図に初期点を置くか、どの図に置くかを足している。
- 終了点を置かない場合の書き方を、[[specdojo:stsd-rulebook]] に足した内容（PJR-KBS6）とそろえ、同じ説明を 2 つの rulebook で繰り返さず、片方からもう片方を参照している。
- 足した規則が、[[stsd-task-execution]] の 2 つの図の書き方で満たせるか確かめ、満たせない場合はどこが違うかを個票の対応結果に書いている（成果物は変えない）。
- 変えるのは対象の Kata だけで、ほかの Kata と成果物（`docs/ja/product/` 配下）は変えていない。
- `npm run -s lint:md` と `npm run -s lint:fm` が通っている。

## 4. 作業内容

| No  | 作業                                                   | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------ | ---- | ---- | ---- |
| 1   | 分割と初期点・終了点の規則を読み、足りない点を整理する | BA   | open | -    |
| 2   | 規則を足し、検査を通す                                 | BA   | open | -    |

## 5. 対応結果

- [[specdojo:stsd-mermaid-rulebook|STSD の状態遷移図の記法ルール]] に、開始遷移を扱う図だけに初期点を置き、共有状態から続く図には置かない規則を追加した。到達性と終端の判定は全図をつないで行う。終了点の要否と省略時の書き方は、PJR-KBS6 で整備した [[specdojo:stsd-rulebook|ステータス定義作成ルール]] の「状態遷移図」への参照にまとめた。
- [[prj-0001:stsd-task-execution|タスク実行のステータス定義]] の通常系は開始遷移 `T-01`・`T-14` を各一度だけ含み、例外系は初期点を持たず、未着手・着手可能・実行中・完了の同名・同 ID の共有状態で接続する。全 16 遷移と全 6 状態を両図でたどれ、完了は例外系の差し戻しで戻り、中止だけが出力遷移のない継続状態となる。「概要」に到達点と管理継続の理由もあり、追加規則との相違はない。成果物は変更していない。
- 判断根拠は両 rulebook、執筆標準、`vp-arc-conciseness`、関連 recipe・sample・template、PJR-Q9AW と PJR-KBS6 の対応結果・実行結果、および既存 STSD の分割例。開始遷移の重複を避ける既存規則と、sample の単一図での初期点・終了点の書き方を維持した。残課題はなく、`lint:md`・`lint:fm` の合否は親 runner の検証結果に委ねる。

## 6. 関連ドキュメント

- [[specdojo:stsd-mermaid-rulebook]]: 手入れの対象
- [[specdojo:stsd-rulebook]]: そろえる先
