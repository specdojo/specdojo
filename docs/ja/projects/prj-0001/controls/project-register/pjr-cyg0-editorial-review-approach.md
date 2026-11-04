---
specdojo:
  id: prj-0001:pjr-cyg0-editorial-review-approach
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: medium
  owner: ARC
  registered_at: "2026-11-03T23:50:48Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-04T11:46:37Z"
  conclusion: 予防・原因の振り分けの一般化・冗長さを直す edit の段 condense の 3 層で直す。condense は書き足しの最後の edit の後、review の前に置く
  commit_type: docs
  commit_scope: register
---

# PJR-CYG0 冗長さを抜き出して原因を分ける review approach（editorial-review）の仕様を決める

## 1. 背景

人の代わりに成果物の冗長さを箇所ごとに抜き出し、原因を「この文書だけ」と「Kata が原因」に分け、磨き込みと Kata の手入れの段へ渡す review approach の名前、指摘の書式、渡し方、判定の基準を決める

## 2. 入力

- 利用者の課題: agent が作る文書は冗長なことが多い。review task で冗長な部分を抽出して磨き込みで直したい。冗長な記述のレビューは専用の人間代替の review approach を新設し、Kata の maintenance に回したい（2026-11-04）
- 既存の仕組み: rulebook / recipe / sample / template-maintenance は review result や finding を根拠に Kata を見直す作りだが、schedule に明示した段でしか動かない。成果物の review の指摘を Kata が原因かその文書だけの問題かに分けて手入れへ渡す仕組みはない（ryu-guide の「実践の型メンテナンスの進め方」、2026-11-04）
- 案: 新しい approach（仮名 editorial-review）は、冗長さ（重複、表と本文の二重の説明、図をなぞる文、目的に要らない背景など）を箇所ごとに抜き出し、直し方の案（削る・まとめる・参照に置き換える）と原因の分類（この文書だけ／Kata が原因。Kata の場合はどの Kata か）を付ける。この文書だけの指摘は fully-guided の磨き込みへ、Kata が原因の指摘は対象の Kata の手入れの段へ渡す（2026-11-04）
- 論点: 名前、指摘の書式と原因の分類、手入れと磨き込みの段への渡し方（plan への取り込み）、冗長さの判定の基準を何に置くか（standards・rulebook・review の観点）、grade や既存の review との役割の分け方（2026-11-04）

## 3. 検討した選択肢

| 選択肢 | 内容                                                                                                   | 利点                                                                  | 懸念                                                                            |
| ------ | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| A      | 冗長さ専用の review の段（editorial-review）で書いた後に抜き出し、磨き込みと Kata の手入れへ振り分ける | 実装が 1 か所で済む                                                   | 後追いで、書く時点の原因が残る。review は品質を評価しないという分担に例外が要る |
| B      | grade の指摘に原因の項目を足すだけで、新しい段を作らない                                               | 新しい段が要らない                                                    | 冗長さを深く見る段にならない                                                    |
| C      | 書くときの規範だけを足す                                                                               | 小さく済む                                                            | 効いたかが測れず、Kata へ戻る道がないまま                                       |
| D      | 予防・原因の振り分けの一般化・冗長さを直す edit の段（condense）の 3 層で直す                          | 書く時点から直り、Kata が冗長さ以外の指摘からも育つ。役割の分担を保つ | 実装が 3 件に分かれる                                                           |

## 4. 決定内容

D を採る。

- 予防: 何を書かないかの規則（繰り返し、表と本文の二重の説明、図をなぞる文、目的に要らない背景、正本の再掲）を、edit plan の共通の規約の断片に 1 か所で定め、すべての edit plan へ載せる。規則の正本は grade の観点 `vp-arc-conciseness` とし、種類の一覧をこの観点の確かめる材料（`evidence`）に書き足す。
- 原因の振り分け: grade の指摘に原因（`document` または `kata:<kind>`）を持たせる。Kata が原因とするのは Kata の箇所を根拠として示せる場合に限る。plan の生成時に、Kata が原因の指摘をその Kata の手入れの段へ振り分ける。冗長さに限らず、どの観点の指摘にも効かせる。
- condense: 1 文書の中の冗長さを直す edit の approach `condense` を足す。直した箇所と Kata が原因の指摘を result に記録し、書式は原因の振り分けとそろえる。
- condense の位置: 内容を書き足す最後の edit の後、review の前に置く。標準の流れでは磨き込み（`refine-pass`）と review の間とする。
- 下限: 判断に要る背景・制約・例外・完了条件は残し、長さだけでは直さない（`vp-arc-conciseness` と `cross-deliverable-dedup` と同じ）。
- 役割の分担: grade は点数を付け、review は完了の可否だけを判断する。review ガイドに例外は設けない。

## 5. 採択理由

- 冗長さの原因は、書くときの規範がないこと、Kata が冗長さを誘うこと、成果物の指摘を Kata へ戻す道がないことの 3 層にある。後追いの段だけでは書く時点の原因が残る。
- 品質を見て成果物を直すのは edit の役割であり、複数文書の重複を直す `cross-deliverable-dedup` も edit の段である。review にすると、grade・review・edit の分担に例外が要る。
- draft の後は内容がまだ書き換わり、磨き込みは完了条件を満たそうとして書き足しやすい。直すのは書き足しの最後の後がよい。
- LLM の冗長さは規範だけでは消えないため、予防と直す段の両方を置く。

## 6. 承認

| 項目     | 内容                                         |
| -------- | -------------------------------------------- |
| 決定者   | indie                                        |
| 決定日   | 2026-11-04                                   |
| 承認方式 | commit                                       |
| 証跡     | この個票を decided にした register の commit |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。足す項目はどれも任意の項目で既存を壊さないため、commit とする。

## 7. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | edit plan の共通の規約、grade の観点と指摘の項目、Kata の手入れの plan の生成、approach と標準の流れ          |
| 必要な対応 | condense の実装（PJR-1BRQ）、予防の規則の追加、原因の振り分けの実装。stsd の試行（PJR-3APD）はこの 3 件を待つ |
| 追跡先     | PJR-1BRQ、PJR-3APD、本決定から起票する 2 件の todo                                                            |

## 8. 関連ドキュメント

- [[specdojo:review-guide]]: grade と review の分担
- [[specdojo:ryu-guide]]: approach の一覧と実践の型メンテナンスの進め方
- [[specdojo:pm-review-viewpoints]]: 判定の基準の正本とする `vp-arc-conciseness`
