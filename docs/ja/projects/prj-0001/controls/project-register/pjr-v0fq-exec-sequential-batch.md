---
specdojo:
  id: prj-0001:pjr-v0fq-exec-sequential-batch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: sol-executor
  registered_at: "2026-11-13T14:08:14Z"
  commit_type: feat
  commit_scope: exec
---

# PJR-V0FQ 複数の exec run・grade を順に流す仕組みを用意する

## 1. 概要

前の run が終わってから次の run・grade・ビルドを順に流し、前が失敗したら止めるか続けるかを選べるようにする（orchestrator のシェルスクリプトの置き換え）

## 2. 入力

- 2026-11-12〜13 の型の整備と夜間の実行で、orchestrator が手作業やシェルスクリプトで補った

## 3. 完了条件

- 複数の実行（`exec run --register`・`exec run --auto --track`・`exec resume --task`・`grade run`・`docs:build` などの検査）を、1 つの定義で順に流せる。定義は、既存の job（`docs/ja/projects/<project-id>/jobs/`）の形を広げるか、新しい種類を足すかを検討し、理由を書く。
- 各段で、前の段が失敗したときに止めるか続けるかを選べる。段の結果（成功・失敗・延期）と理由を、run の記録に残す。
- 前の実行が lock を持っている間は待ってから始め、待つ上限も決められる。完了の判定はログの文字列ではなく、終了コードと実行の状態で行う。
- **agent の種類に頼らない**：Claude Code の「後ろの処理が終わったら会話を再開する」機能などに頼らず、cron と routine（`routine run --due`）だけで最後まで動く。オーケストレーターが Claude Code・Codex・Antigravity のどれでも、同じ定義で同じに動く。
- 今回 orchestrator がシェルスクリプトで行った流れ（例: 止まったタスクの再開 → `--auto --track` のループ → 次の register 項目の実行）を、この仕組みの定義で書けることを確かめ、例として残す。
- 関連する設計・ガイド・CLI リファレンスを直している。
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
