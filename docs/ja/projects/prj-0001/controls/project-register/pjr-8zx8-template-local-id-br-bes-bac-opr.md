---
specdojo:
  id: prj-0001:pjr-8zx8-template-local-id-br-bes-bac-opr
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: easy
  owner: ARC
  registered_at: "2026-11-15T13:41:48Z"
  commit_type: fix
  commit_scope: kata
---

# PJR-8ZX8 br・bes・bac・opr の template の frontmatter の id を、プロダクト文書の書き方（_LOCAL_ID_）に直す

## 1. 概要

4 つの template の id を _LOCAL_ID_ に直し、生成される文書の id がプロダクト文書の決まりに合うことを確かめる

## 2. 入力

- 2026-11-15、sysd-index の型の grade で、template の `frontmatter_template` の id が `_PROJECT_ID_:_LOCAL_ID_` のため、プロダクト文書の id（ローカル id）と食い違う指摘が出た。sysd-index と sysd-cross-cutting-policy は直した
- 同じ書き方が br-template・bes-template・bac-template・opr-template に残る。0.8.0（PJR-PMK6）に入れる

## 3. 完了条件

- `br-template.md`・`bes-template.md`・`bac-template.md`・`opr-template.md` の `frontmatter_template` の id を `_LOCAL_ID_` に直し、template 自身の status は変えない。
- 生成される文書の id が、プロダクト文書の決まり（ローカル id）に合う。prj-0001 の既存の br・bes・bac・opr の文書の id と食い違わない。
- 4 つの型を `grade run --target kata` で grade し、id の書き方の指摘が出ない。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run test:unit` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                         | 担当 | 状態 | メモ |
| --- | ---------------------------- | ---- | ---- | ---- |
| 1   | 4 つの template の id を直す | ARC  | open | -    |
| 2   | 型を grade して確かめる      | ARC  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-pmk6-release-v0-8-0]]
