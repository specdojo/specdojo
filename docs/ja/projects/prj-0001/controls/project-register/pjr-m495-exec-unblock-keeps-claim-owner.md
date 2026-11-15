---
specdojo:
  id: prj-0001:pjr-m495-exec-unblock-keeps-claim-owner
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-15T10:47:37Z"
  derived_from:
    - PJR-T4G3
  commit_type: fix
  commit_scope: exec
---

# PJR-M495 人が unblock しても、agent の run が完了の確認で止まらないようにする

## 1. 概要

unblock を人が行っても、claim の持ち主（agent）を保つか、runner が引き継げるようにする

## 2. 入力

- 2026-11-15、bds-progress-report-005 を人（indie）が exec unblock したところ claim の持ち主が人に替わり、runner の再開が completion preflight の「task is being worked on by another actor: indie」で止まった（PJR-TN43 の E）

## 3. 完了条件

- 人が `exec unblock` しても、claim の持ち主（agent）を保つ。または、runner が再開するときに claim を agent へ引き継ぎ、completion preflight が「task is being worked on by another actor」で止めない。
- 人が別の作業として引き取る場合（人が自分で直して完了する）と、agent の run を続ける場合を区別できる。区別の仕方をガイドに書いている。
- 人が unblock した後の再開と完了を、回帰テストで確かめている。PJR-T4G3（別の agent の段で失敗したときの block）と食い違わない。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。保護された設定の変更は、変更案を書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                            | 担当 | 状態 | メモ |
| --- | ----------------------------------------------- | ---- | ---- | ---- |
| 1   | unblock の後の claim の持ち主の扱いを決めて直す | DEV  | open | -    |
| 2   | ガイドに引き取りと続行の区別を書く              | DEV  | open | -    |
| 3   | 回帰テストを足す                                | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
