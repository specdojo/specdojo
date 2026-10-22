---
specdojo:
  id: prj-0001:pjr-98sq-quick-start-register-use-cases
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-10-22T13:18:07Z"
  derived_from:
    - PJR-H72A
---

# PJR-98SQ Quick Start を register のユースケース別の使い方を中心に組み替える

## 1. 概要

Quick Start は register の使い方が最初の体験とカタログ作成への道筋に分かれ、approach・difficulty・post-review・夜間の実行・別の project への起票などの使い方が載っていない。register のユースケース別に、こんなとき・チャットでの頼み方・具体的なコマンドを並べる章を中心に置き、カタログと schedule 以降は発展として後ろに回す

## 2. 完了条件

- 次の版の範囲とする（2026-10-22、利用者が承認）。PJR-ZH7Q と PJR-47S6（Quick Start の Dev Container の節に触れる）の統合の後に行う。
- [[specdojo:quick-start-guide]] を次の順に組み替える。
  1. 10 分で体験する（今の内容と流れのまま）
  2. 初期設定（今の内容を保ち、冗長な説明は短くしてよい）
  3. register のユースケース別の使い方（新しい章）
  4. 以降は「発展」として、成果物カタログから schedule へ、worktree での隔離実行、routine を今の内容のまま後ろに置く
- 3 章には少なくとも次のユースケースを節として置き、各節に「こんなとき」「チャットでの頼み方（`# チャット:`）」「コマンド」をそろえる。コマンドは `--project` などを省かない、そのまま打てる形で書く。
  - 作業を起票して AI に任せる（`register add --type todo --difficulty` → `exec run --register --worktree`、振り分けの表）
  - 問題を調べて直す（issue）
  - 決めることを残す（question・decision。1 章への案内でよい）
  - 合意した範囲を変える（change-request）
  - リスクと気づきを残す（risk・note）
  - 成果物を作る・直す（`--approach fully-guided`・`recipe-guided`・`retrofit` と `--target <成果物の doc id>`。PJR-H72A の決定）
  - kata を直す（`--approach rulebook-maintenance` などと `--target <kata の id>`）
  - 統合後に review の agent に確かめさせる（`--post-review`）
  - 夜の間に流す（`register update --autopilot approved` → `orchestrator night`）
  - 止まった項目を再開する（`--resume`・`--resume-from executor`・`--force-restart` の使い分け）
  - 別の project・別のリポジトリへ起票する（`register add --project <id> --commit`、`external_projects` の宣言、`--from <id>:PJR-XXXX`）
- 載せるコマンドとオプションは、どれも実際の CLI（`--help`、書き込まない `--dry-run` がある場合はそれ）で確かめ、確かめた方法を result に書く。CLI にないオプションや動きを書かない。
- 今の 3 章（issue・decision・todo を起票してカタログ作成へ進む流れ）の内容は、新しい 3 章か 4 章の発展のどちらかに移し、失わない。
- [[specdojo:use-case-guide]] とは内容を重ねず、必要な箇所で相互に案内する。
- `npm run lint:md` と `npm run docs:build` が通る。見出しの番号の付け替えで壊れた章の参照（`[[#...]]` など）がない。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                                 | 担当 | 状態 | メモ            |
| --- | ---------------------------------------------------- | ---- | ---- | --------------- |
| 1   | Quick Start を register のユースケース別に組み替える | DEV  | open | ZH7Q・47S6 の後 |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:quick-start-guide]]
- [[specdojo:use-case-guide]]
- PJR-H72A（approach の方針の決定）
