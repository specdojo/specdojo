---
specdojo:
  id: prj-0001:pjr-30sa-specdojo-git-serialized
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-16T03:13:37Z"
  due_on: null
  derived_from:
    - PJR-G90K
  commit_type: feat
  commit_scope: exec
---

# PJR-30SA git の書き込みを runner と同じロックで直列化する specdojo git を足す

## 1. 概要

orchestrator や人の commit・merge も exec-lifecycle のロックの下で流し、runner の統合と順番に並べる

## 2. 入力

- runner の統合と register の記帳は exec-lifecycle のロックで直列化されているが、orchestrator や人が直接流す git commit・merge はロックを取らず、runner の統合と同時に走る。lefthook の hook の実行中は index.lock を長く握るため、runner 側が失敗する（2026-11-15 の sld-090）
- OSS を調べた（2026-11-16）: git 本体に index.lock を待つ設定はない。git-wait（Rust）は空くのを待つだけでロックを持たず、flock は Linux 向け、GNU parallel の sem は Perl に依存し、どれも runner のロックとは別の列になる。そのため specdojo のコマンドとして作り、ロックの部品が足りなければ proper-lockfile（npm）を使う方針とした
- 利用者が 2026-11-16 に起票を依頼した。0.8.0 の後に行う

## 3. 完了条件

- `specdojo git -- <git の引数>` で、書き込みを伴う git 操作（commit・merge・add・rm・restore・checkout など）を exec-lifecycle のロックを取ってから流せる。読み取りの操作（status・log・diff など）はロックなしでそのまま流す。
- lefthook の hook を含む commit の全体がロックの中で流れ、その間 runner の統合はロックを待って失敗しない。
- ロックを握ったまま落ちたプロセスのロックは、時間がたてば取り直せる。
- run の最中に、ロックを取らない手の git commit を pre-commit hook で警告する。
- pm-orchestrator-playbook とオーケストレーターの定義に、orchestrator の commit・merge は `specdojo git` を通すことを書く。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合（pre-commit hook の追加、オーケストレーターの定義の追記、依存の追加など）は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                             | 担当 | 状態 | メモ |
| --- | ---------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | コマンドの設計（書き込みの判定、ロックの部品の選定）             | DEV  | open | -    |
| 2   | specdojo git を実装し、runner と同じロックを使う                 | DEV  | open | -    |
| 3   | pre-commit の警告と playbook・オーケストレーターの定義を更新する | DEV  | open | -    |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[prj-0001:pjr-g90k-integrate-index-lock-retry]]
- [[prj-0001:pjr-964d-git-index-lock-wait-longer]]
