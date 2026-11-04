---
specdojo:
  id: prj-0001:pjr-y431-split-plan-conventions
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-04T12:10:55Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-0MR5
  commit_type: refactor
  commit_scope: exec
---

# PJR-Y431 exec plan の共通の規約を共通・edit・review の 3 つのファイルに分ける

## 1. 概要

edit と review の plan に入る共通の規約（xep-common-conventions-template.md）を、両方に共通、edit だけ、review だけの 3 つに分け、plan の生成時に共通のファイルと mode に合うほうを組み合わせる

## 2. 入力

- xep-common-conventions-template.md は 2026-09-01 に edit plan の共通の規約として作られた。2026-09-28（PJR-N22N）に review-only の印つきで review の判断の手順が足され、review plan にも入るようになった。今は edit の plan テンプレート 21 個と review の plan テンプレート 10 個が使い、grade の plan は使わない（2026-11-04）
- 利用者の判断: 名前と中身がずれているため、edit だけの印を足す案ではなく、共通・edit・review の 3 つのファイルに分ける。分ける作業と冗長さの規則を足す作業（PJR-0MR5）は別の項目にし、分ける前後で plan の本文が一致することを確かめられるようにする（2026-11-04）

## 3. 完了条件

- 規約を 3 つのファイルに分ける。両方に共通のファイル（新しく作る）、edit だけのファイル（`xep-common-conventions-template.md`）、review だけのファイル（`xrp-common-conventions-template.md`。今の `review-only` の部分を移す）。
- 共通のファイルの名前は、既にある接頭辞の決まり（`xep`・`xrp`・`xer`・`xrr`）に合わせて executor が決め、理由を個票の対応結果に書く。
- 今ある規則を 1 つずつ振り分け、規則・振り分け先・理由の一覧を個票の対応結果に書く。edit だけか迷うものは、今の動きを変えないため共通に置く。
- plan の生成時に、共通のファイルと mode に合うほうを組み合わせる。`review-only` の印はなくす。本文へ写す要点（`plan-essentials`）はファイルごとに持てるようにし、規約の詳細を読む案内には読むべきファイルをすべて示す。
- 分ける前と後で生成される plan を比べ、結果の要約を個票の対応結果に書く。edit の plan（`draft`・`fully-guided`・`retrofit`・`rulebook-maintenance`・`job`・`register`）は本文が一致する。review の plan は、edit だけへ移した規則が消える以外は一致する。
- 単体テストで、edit の plan に review の手順が入らないこと、review の plan に edit だけの規則が入らないこと、両方に共通の規則が入ることを確かめる。
- 古いファイル名を指す箇所（`src/exec/reporter.ts` のコメント、テスト、[[specdojo:plan-result-lifecycle-guide]] の説明）を直す。過去の記録（個票・evidence・過去の版の移行ガイド）は変えない。
- `npm pack --dry-run` で、新しいファイルが npm の配布物に含まれることを確かめる。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通す。親の検証として `test-integration` を通す。
- CHANGELOG の未公開の版の節（Unreleased）に書き、公開済みの版の節は変えない。
- 規則の文言を変えたり、新しい規則を足したりしない。冗長さの規則は PJR-0MR5 で足す。

## 4. 作業内容

| No  | 作業                                                                 | 担当 | 状態 | メモ |
| --- | -------------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 今ある規則を共通・edit・review に振り分け、一覧を対応結果に書く      | ARC  | open | -    |
| 2   | 3 つのファイルに分け、共通のファイルの名前を決める                   | ARC  | open | -    |
| 3   | plan の生成で 2 つのファイルを組み合わせ、`review-only` の印をなくす | ARC  | open | -    |
| 4   | 分ける前後の plan を比べ、テストを足す                               | ARC  | open | -    |
| 5   | 古いファイル名の参照、ガイド、CHANGELOG を直し、検査を通す           | ARC  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:plan-result-lifecycle-guide]]: exec のテンプレートの置き場所と選び方
- PJR-0MR5: 分けたあとに edit だけのファイルへ冗長さの規則を足す
- PJR-CYG0: 冗長さを 3 層で直す決定
