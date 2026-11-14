---
specdojo:
  id: prj-0001:xer-pjr-n2cp-20261114t114842z-575c5b9e
  type: exec-result
  task_id: PJR-N2CP
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-N2CP/pjr-n2cp-20261114T114842Z-575c5b9e/plan.md
  started_at: "2026-11-14T11:55:42.959Z"
  completed_at: "2026-11-14T12:22:52.371Z"
  agent: sol-executor
  block_reason: "parent validation failed: test-unit"
---

# Edit Result

## 1. 実施内容

- 型整備の段構成、共通説明、一意な suffix、および要否宣言ごとの担当ルールを修正。
- `improve-kata` において、`rulebook`・`recipe`・`sample`・`template` を順に同期する段を追加し、型整備のプロセスを改善。
- 実行時に `not-needed` と判断された型（不要とされた型）は、生成プロセスを省略するようロジックを調整。
- 回帰テスト、ガイド、および個票の更新を実施。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/ryu-guide.md`: 型整備に関する共通説明の更新。
- `docs/ja/specdojo/guides/schedule-design-guide.md`: 型の整備方針および一意な suffix に関する記述の更新。
- `src/schedule/strategy-generate-document.ts`: `improve-kata` における `rulebook` から各構成要素への同期プロセス、および不要な型の省略ロジックの実装。
- `src/schedule/strategy-profiles.ts`: 型の整備に関する属性定義の更新。
- `tests/src/schedule/strategy-generate.test.ts`: 型整備の段構成と省略ロジックに関する回帰テストの追加・更新。

## 3. 申し送り

- 判断: 生成時に `not-needed` の型は見直し段を省略する。実行までに不要と判断された段は変更せず理由を `result` に残して完了する。明示的な `target` / `scope` に不要な型を指定した場合の生成停止は維持する。
- 判断: `improve-kata` の `kata_target: rulebook` は、T88P と同様に `rulebook` → `recipe` → `sample` → `template` を同期してレビュー・確定する。他の型の直接指定は対象範囲を保つ。`bootstrap` は `wave-1` と同じ全9段とした。`prj-0001` 固有のサイドバー更新指示は汎用 `profile` に含めない。
- CHANGELOG に書く事項（不具合修正）: `schedule strategy generate` の `bootstrap-kata-set` と `rulebook` を改善する `improve-kata` に、`rulebook`・`recipe`・`sample`・`template` を順に同期する段を追加。`not-needed` の型は省略し、型の整備方針と一意なタスク `suffix` を生成する。
- 判断: 生成時に not-needed の型は見直し段を省略する。実行までに不要と判断された段は変更せず理由を result に残して完了する。明示 target／scope に不要な型を指定した場合の生成停止は維持する。
- 判断: improve-kata の `kata_target: rulebook` は、T88P と同じく rulebook → recipe → sample → template を同期してレビュー・確定する。他の型の直接指定は対象範囲を保つ。bootstrap は wave-1 と同じ全9段とした。prj-0001 固有のサイドバー更新指示は汎用 profile に含めない。
- CHANGELOG に書く事項（不具合修正）: schedule strategy generate の bootstrap-kata-set と rulebook を改善する improve-kata に、rulebook・recipe・sample・template を順に同期する段を追加。not-needed の型は省略し、型の整備方針と一意なタスク suffix を生成する。
- 適用外の検証: `npm run validate:schema:file`（executor は YAML／YML 成果物を変更していない。生成した strategy は smoke 検証内で schema 検証済み。）

## 4. 進め方

`improve-kata` の戦略において、`rulebook` の変更を `recipe`、`sample`、`template` へと波及させるための同期プロセスを追加しました。また、タスクの効率化と適切性を高めるため、実行時に不要と判断された型（`not-needed`）の生成をスキップするロジックを導入しました。これに伴い、関連するガイド、ソースコード、およびテストコードの更新を行いました。
