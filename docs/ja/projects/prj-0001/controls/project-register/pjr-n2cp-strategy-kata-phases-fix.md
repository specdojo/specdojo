---
specdojo:
  id: prj-0001:pjr-n2cp-strategy-kata-phases-fix
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
  registered_at: "2026-11-13T21:53:08Z"
  derived_from:
    - PJR-J0VS
  commit_type: fix
  commit_scope: schedule
---

# PJR-N2CP 型を直す intent の strategy に、recipe・template・sample の手直しの段を作る

## 1. 概要

PJR-J0VS の修正

## 2. 入力

- PJR-J0VS の修正。kata-wave-1 の後、wave-2 を作る前に流す（indie が 2026-11-14 に承認）

## 3. 完了条件

- `schedule strategy generate` が、intent `improve-kata` と `bootstrap-kata-set` で、型の手直しの段（rulebook・recipe・sample・template）を作る。今は orchestrator が T88P の phase_sets を写して手で足している。
- 型が recipe・template を持たない（`not-needed`）場合の段の扱いを決める（段を作らない、または「変えない」と書いて終える）。
- 生成される段の説明に、Rulebook 記述標準の章立て・sample の厚さ・正本を参照する方針など、T88P の段の説明にある共通の決まりを入れる。
- 生成した strategy を、手で足した `sch-strategy-kata-wave-1.yaml` と比べ、同じ段が並ぶことを確かめる。回帰テストを足す。
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
