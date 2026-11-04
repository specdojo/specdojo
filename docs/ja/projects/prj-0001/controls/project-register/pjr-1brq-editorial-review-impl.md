---
specdojo:
  id: prj-0001:pjr-1brq-editorial-review-impl
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: ARC
  registered_at: "2026-11-03T23:51:23Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-CYG0
  depends_on:
    - PJR-CYG0
  commit_type: feat
  commit_scope: exec
---

# PJR-1BRQ condense approach を実装する

## 1. 概要

PJR-CYG0 の決定に沿って、1 文書の中の冗長さを直す edit の approach condense を足し、直した箇所と Kata が原因の指摘を result に記録し、標準の流れで磨き込みと review の間に置く

## 2. 入力

- PJR-CYG0 の決定内容（3 層のうち condense の段。名前、edit であること、位置、下限、記録の書式）を実装の正本とする。完了条件は決定のあとに書く（2026-11-04）
- 予防の規則と原因の振り分けは別の todo で実装する。condense の記録の書式は原因の振り分けの書式とそろえる（2026-11-04）

## 3. 完了条件

- edit の approach `condense` を足す。対象は 1 文書の中の冗長さだけとし、文書をまたぐ重複は `cross-deliverable-dedup` の役割として扱わない。
- edit の plan のテンプレート（`xep-condense-template.md`）を作る。冗長な箇所を 5 つの種類（繰り返し、表と本文の二重の説明、図をなぞる文、目的に要らない背景、正本の再掲）で洗い出し、削る・まとめる・参照に置き換えるのどれかで直す。判定の基準は grade の観点 `vp-arc-conciseness` を正本として引き、書き写さない。下限として、判断に要る背景・制約・例外・完了条件は残し、長さだけでは直さない。内容・決定・完了条件の意味を変えず、新しい内容を足さず、ほかの文書は変えない。
- result のテンプレート（`xer-condense-template.md`）を作り、直した箇所とわざと残した箇所を 1 件ずつ、場所・種類・直し方・残した理由・原因で記録させる。原因は PJR-SJBV の `FindingCause` の形を使い、frontmatter に機械で読めるリスト、本文に表を持たせる。Kata が原因とするのは Kata の箇所を示せる場合だけとする。
- Kata の手入れの plan の「成果物から届いた Kata が原因の finding」の節に、その rulebook を宣言している成果物ごとの最新の `condense` の result のうち、原因が Kata の記録も載せる。grade と `condense` のどちらから来たかを示す。
- 標準の流れに `condense-pass`（番号 080、agent、edit、normal）を足し、磨き込み（`refine-pass`）がある流れのすべてで、磨き込みの後・review の前に入るようにする。既にある schedule の strategy は作り直さない。
- register から `--approach condense` で既にある成果物を指定して起票・実行できるようにする。カタログがなくても `fully-guided` と同じく使えるようにする。
- [[specdojo:ryu-guide]]（approach の選び方の図と一覧）、[[specdojo:plan-result-lifecycle-guide]]、[[specdojo:command-reference]]、schedule の設計ガイドの段の説明に `condense` を書く。
- 単体テストで、`condense` の plan が作れること、標準の流れで `condense-pass` が磨き込みと review の間に入ること、result の frontmatter の記録が原因の形の schema の検査を通ること、Kata が原因の記録が手入れの plan に載り `document` の記録は載らないこと、register から `condense` を指定できることを確かめる。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md`・`npm run validate:schema` を通す。親の検証として `test-integration` を通す。
- CHANGELOG の未公開の版の節（Unreleased）に書き、公開済みの版の節は変えない。
- 範囲の外: 予防の規則（PJR-0MR5）、grade の原因の項目（PJR-SJBV）、既にある schedule の作り直し、stsd の試行（PJR-3APD）。
- result の frontmatter のキーの名前と、手入れの plan での記録の出どころの示し方は executor が決め、理由を個票の対応結果に書く。
- 統合の後に、オーケストレーターが既にある成果物 1 件で `condense` を流して動きを確かめる（executor の作業ではない）。

## 4. 作業内容

| No  | 作業                                                  | 担当 | 状態 | メモ |
| --- | ----------------------------------------------------- | ---- | ---- | ---- |
| 1   | approach を足し、plan と result のテンプレートを作る  | ARC  | open | -    |
| 2   | Kata の手入れの plan へ `condense` の記録を振り分ける | ARC  | open | -    |
| 3   | 標準の流れと register に `condense` を足す            | ARC  | open | -    |
| 4   | ガイドを直し、テストを足して検査を通す                | ARC  | open | -    |
| 5   | CHANGELOG と対応結果を書く                            | ARC  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:ryu-guide]]: approach の一覧と実践の型メンテナンスの進め方
- [[specdojo:pm-review-viewpoints]]: 判定の基準の正本とする `vp-arc-conciseness`
- PJR-SJBV: 原因の形（`FindingCause`）と Kata の手入れへの振り分け
- PJR-CYG0: 冗長さを 3 層で直す決定
