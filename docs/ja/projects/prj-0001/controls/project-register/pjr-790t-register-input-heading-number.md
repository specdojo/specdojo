---
specdojo:
  id: prj-0001:pjr-790t-register-input-heading-number
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: easy
  owner: DEV
  registered_at: "2026-10-31T02:43:14Z"
  due_on: "2026-11-30"
  block_reason: "parent validation failed: lint-ts, typecheck"
---

# PJR-790T 入力の章がない種類の個票で入力の見出しに番号を付ける

## 1. 概要

decision など `入力` の章がない種類の個票へ `--input` を書くと、番号のない `## 入力` が末尾に足されるため、番号付きの章として適切な位置に入れる。

## 2. 入力

- src/register/input.ts の setRegisterInput は、入力の章がない個票では本文の末尾に番号のない ## 入力 を足す。Markdown の規約では ## 以下の見出しに連番が要る。todo は 2 章に入るが、decision（PJR-BNMV で発生）では末尾に足された

## 3. 完了条件

- `入力` の章がない個票へ `--input` を書くときは、番号付きの章として入れる。入れる位置は、最初の章（`概要` や `背景`）の直後とし、後ろの章の番号を 1 つずつ繰り下げる。章の番号の振り直しは見出しの番号だけに行い、本文の章の参照は章のタイトルで書かれている前提とする。
- 番号のない `## 入力` がすでにある個票へ `--input` を書くときは、その章を番号付きの章に直して同じ位置へ移す。
- `--input -` で入力を消すときの扱い（章を残して `-` にする今の動き）は変えない。
- register のすべての項目の type（`issue`・`decision`・`todo`・`question`・`risk`・`change-request`・`note`・`epic`）の雛形について、`入力` の章があるかを確かめ、ないものでも上の扱いになることを単体テストで確かめる。
- prj-0001 と prj-0002 の個票で、番号のない `## 入力` が残っているもの（PJR-BNMV など）を直す。直したものを本個票の対応結果に書く。
- `CHANGELOG.md` の `## [Unreleased]` 節に追記する。`0.5.0` と公開済みの版の節は変えない。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と、変更した文書で `npm run lint:md`・`npm run lint:fm` を流して通し、親の検証も通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。
- 保護された設定（`.specdojo/`・`package.json` など）に触れる必要がある場合は、変更せずに案を本個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業                                                              | 担当     | 状態 | メモ |
| --- | ----------------------------------------------------------------- | -------- | ---- | ---- |
| 1   | `setRegisterInput` で番号付きの章として入れ、後ろの章を繰り下げる | executor | open | -    |
| 2   | テストを足し、既存の個票を直す                                    | executor | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-bnmv-product-repo-git-workflow]]
