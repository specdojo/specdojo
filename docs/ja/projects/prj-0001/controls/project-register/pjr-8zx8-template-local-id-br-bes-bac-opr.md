---
specdojo:
  id: prj-0001:pjr-8zx8-template-local-id-br-bes-bac-opr
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
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

| No  | 作業                         | 担当 | 状態 | メモ         |
| --- | ---------------------------- | ---- | ---- | ------------ |
| 1   | 4 つの template の id を直す | ARC  | done | -            |
| 2   | 型を grade して確かめる      | ARC  | open | 人が実行する |

## 5. 対応結果

- `br-template.md`・`bes-template.md`・`bac-template.md`・`opr-template.md` の `frontmatter_template` の `id` を `_PROJECT_ID_:_LOCAL_ID_` から `_LOCAL_ID_` に直した。template 自身の `status`（br・bes は `ready`、bac・opr は `draft`）は変えていない。
- 生成される id は、prj-0001 の既存のプロダクト文書の id（`br-task-selection-strategy`・`bes-task-ready-selected`・`bac-task-completion`・`opr-agent-cli-update`）と同じローカル id の形になる。直した sysd-index・sysd-cross-cutting-policy の template とも揃う。
- 決めたこと: `based_on: _BASED_ON_` は今回の指摘（id の書き方）の対象外として変えなかった。理由は、完了条件が `id` だけを求めているためである。
- 決めたこと: template-authoring-standard の予約済みプレースホルダ表の例 `_PROJECT_ID_:_LOCAL_ID_` は、プロジェクト管理文書の template では今も正しい書き方のため変えなかった。
- 残課題: 4 つの型の `grade run --target kata` は agent を起動して利用枠を使うため、executor の sandbox では実行していない。人が実行し、id の書き方の指摘が出ないことを確かめる。

## 6. 関連ドキュメント

- [[prj-0001:pjr-pmk6-release-v0-8-0]]
