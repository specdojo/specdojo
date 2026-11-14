---
specdojo:
  id: prj-0001:pjr-e4r5-kata-review-grade-kata-fix
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: hard
  owner: sol-executor
  registered_at: "2026-11-13T21:53:14Z"
  derived_from:
    - PJR-ZZVE
  commit_type: fix
  commit_scope: schedule
---

# PJR-E4R5 型の schedule の review の段で、型そのものを grade する

## 1. 概要

PJR-ZZVE の修正

## 2. 入力

- PJR-ZZVE の修正。kata-wave-1 の後、wave-2 を作る前に流す（indie が 2026-11-14 に承認）

## 3. 完了条件

- 型を直す schedule（intent `improve-kata`・`bootstrap-kata-set`）の review の段で、代表の文書だけでなく、型そのもの（対応する rulebook と sample の組）も grade する。今は orchestrator が review の後に別に `grade run --target kata` を流している。
- 型の grade が pass でなければ、review の判定を完了にしない。判定の区別（`complete`・`incomplete` など）との関係を決める。
- 型の grade を流すときに、ほかの grade と取り合わない（PJR-36PW・PJR-X04G との関係を確かめる）。
- 回帰テストを足している。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
