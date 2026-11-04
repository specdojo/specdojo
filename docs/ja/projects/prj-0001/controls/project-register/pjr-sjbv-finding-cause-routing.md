---
specdojo:
  id: prj-0001:pjr-sjbv-finding-cause-routing
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
  registered_at: "2026-11-04T11:48:08Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-CYG0
  depends_on:
    - PJR-CYG0
  commit_type: feat
  commit_scope: grade
---

# PJR-SJBV grade の指摘に原因を持たせて Kata の手入れへ振り分ける

## 1. 概要

PJR-CYG0 の決定に沿って、grade の指摘に原因（document または kata:`<kind>`）と Kata の箇所の根拠を持たせ、plan の生成時に Kata が原因の指摘をその Kata の手入れの段へ振り分ける

## 2. 入力

- PJR-CYG0 の決定内容（原因の振り分けの層）を実装の正本とする。冗長さに限らず、どの観点の指摘にも効かせる。Kata の箇所を示せない指摘は document とする（2026-11-04）
- 今は Kata の手入れの plan が読むのは Kata そのものの grade の指摘だけで、成果物の指摘のうち Kata が原因のものが届く道がない（2026-11-04）

## 3. 完了条件

- grade の結果の schema で、指摘に任意の項目として原因を足す。種類は `document` か `kata` とし、`kata` の場合は Kata の種類（rulebook・recipe・sample・template）と Kata の中の箇所を持たせる。原因のない今の結果は `document` として扱う。
- 成果物の grade の plan で、評価する agent に原因を付けさせる。Kata が原因とするのは Kata の箇所を根拠として示せる場合に限る。Kata そのものの grade では原因を付けない。
- 原因は、点数・判定・前の指摘の引き継ぎ・日本語訳に影響させない。
- Kata の手入れの plan（`*-maintenance`）に、その rulebook を宣言している成果物の指摘のうち、原因がその種類の Kata であるものを載せる。成果物が変わっていない最新の grade だけを載せ、1 件ずつ成果物・行・観点・内容・Kata の箇所を示す。
- 磨き込み（`fully-guided`）の plan では、今までどおりその成果物の指摘をすべて載せ、原因を添える。Kata が原因でも成果物の側も直す必要があるため（PJR-CYG0 の決定から利用者と確かめて変えた点）。
- 原因の形（型）は 1 か所に定め、PJR-1BRQ の `condense` の記録が同じ形を使えるようにする。
- [[specdojo:ryu-guide]] の「実践の型メンテナンスの進め方」と grade の結果の説明に、原因と振り分けを書く。
- 単体テストで、原因のある結果とない結果がどちらも schema の検査を通ること、Kata が原因の指摘が手入れの plan に載り `document` の指摘は載らないこと、古い grade の指摘は載らないこと、原因があっても点数が変わらないことを確かめる。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md`・`npm run validate:schema` を通す。親の検証として `test-integration` を通す。
- CHANGELOG の未公開の版の節（Unreleased）に書き、公開済みの版の節は変えない。
- 範囲の外: 既にある grade の結果の評価のし直し、`condense` の段（PJR-1BRQ）、予防の規則（PJR-0MR5）。
- 項目の名前と、plan の中で指摘を載せる節の名前は executor が決め、理由を個票の対応結果に書く。

## 4. 作業内容

| No  | 作業                                                            | 担当 | 状態 | メモ |
| --- | --------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | grade の結果の schema と型に原因を足す                          | ARC  | open | -    |
| 2   | 成果物の grade の plan で原因を付けさせる                       | ARC  | open | -    |
| 3   | Kata の手入れの plan へ振り分け、磨き込みの plan に原因を添える | ARC  | open | -    |
| 4   | ガイドを直し、テストを足して検査を通す                          | ARC  | open | -    |
| 5   | CHANGELOG と対応結果を書く                                      | ARC  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:ryu-guide]]: 実践の型メンテナンスの進め方
- [[specdojo:review-guide]]: grade と review の分担
- PJR-1BRQ: 同じ原因の形を使う `condense` の段
- PJR-CYG0: 冗長さを 3 層で直す決定
