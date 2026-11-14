---
specdojo:
  id: prj-0001:pjr-1gcd-exec-condense-records-missing-retry
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
  registered_at: "2026-11-14T22:52:38Z"
  derived_from:
    - PJR-52EE
  commit_type: fix
  commit_scope: exec
---

# PJR-1GCD condense_records がない executor の結果を executor の段からやり直す

## 1. 概要

condense_records 欠落を reporter の失敗ではなく executor の失敗として扱う

## 2. 入力

- 2026-11-15 の夜間に bes-index-080 で、qwen が `condense_records` を出さず reporter で止まった。reporter の再実行では直らず、orchestrator が opus で executor の段から手でやり直した

## 3. 完了条件

- condense の approach で executor の evidence に `condense_records` がない（または形式が正しくない）とき、reporter の失敗にせず executor の段の失敗として記録する。
- 失敗の理由と次の操作（`exec resume --task <id> --resume-from executor`、必要なら `--executor-by` で agent を替える）を、block の理由と result に残す。
- 再開したとき、reporter だけを流し直して同じ失敗を繰り返さない。
- 同じ evidence の形式の欠けを reporter の段より前に検査する仕組みを、ほかの approach の必須項目にも当てはめられるか検討し、結論を対応結果に書いている。
- 欠けた場合と正しい場合を、回帰テストで確かめている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                                    | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------- | ---- | ---- | ---- |
| 1   | condense_records の欠けを executor の段の失敗として扱う | DEV  | open | -    |
| 2   | block の理由と再開の案内を足す                          | DEV  | open | -    |
| 3   | 回帰テストを足す                                        | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- PJR-52EE（失敗の見張りと自動の立て直し）
