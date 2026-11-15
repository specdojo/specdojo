---
specdojo:
  id: prj-0001:pjr-q2at-exec-parent-validation-aggregate-not-run
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-14T22:51:42Z"
  block_reason: "parent validation failed: validate-schema"
  commit_type: fix
  commit_scope: exec
---

# PJR-Q2AT 親の検証をまとめた not_run の行で executor の検証を失敗と取り違えない

## 1. 概要

親 runner の検証を 1 行にまとめた not_run を親の検証の結果で読み替える

## 2. 入力

- 2026-11-15 の夜間に cnd-080 が、親の検証 9 件がすべて通ったのに「executor validation failed or not run」で止まった

## 3. 完了条件

- executor の evidence に、親 runner の検証 ID をまとめて書いた 1 行（例: `parent runner: lint-ts, lint-fm, …`）が `not_run` で含まれていても、親の検証がすべて通っていれば「executor validation failed or not run」で止めない。
- まとめた行の判定は、行に挙がった検証 ID がすべて `pipeline.parent_validations` に含まれる場合に限る。設定にない検証や、親 runner の結果がない検証が混じる場合は、今どおり止める。
- 1 件ずつ書いた `not_run` の行と、まとめた 1 行の両方を、回帰テストで確かめている。
- 親の検証を evidence に書くときの決まり（書かない、または 1 件ずつ書く）を、exec plan の共通規約か executor の指示に明記し、まとめた行が生まれにくくしている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                            | 担当 | 状態 | メモ |
| --- | ----------------------------------------------- | ---- | ---- | ---- |
| 1   | まとめた not_run 行を親の検証の結果で読み替える | DEV  | open | -    |
| 2   | 回帰テストと共通規約の記述を足す                | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- PJR-52EE（失敗の見張りと自動の立て直し）
