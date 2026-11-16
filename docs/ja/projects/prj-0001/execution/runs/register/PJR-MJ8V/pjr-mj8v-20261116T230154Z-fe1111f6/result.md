---
specdojo:
  id: prj-0001:xer-pjr-mj8v-20261116t230154z-fe1111f6
  type: exec-result
  task_id: PJR-MJ8V
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-MJ8V/pjr-mj8v-20261116T230154Z-fe1111f6/plan.md
  started_at: "2026-11-16T23:01:55.959Z"
  completed_at: "2026-11-16T23:35:26.558Z"
  agent: sol-executor
  block_reason: "parent validation failed: lint-ts, test-integration"
---

# Edit Result

## 1. 実施内容

- 並列実行（register の並列・join 実行と schedule の自動実行）で、変更範囲が重なる項目を同時に流さず、先行項目の統合後に順番に流す仕組みを実装した。
- 変更範囲の予約を新規モジュール `src/exec/run/change-scope.ts` に切り出し、register・schedule の各経路から使うようにした。範囲が不明な項目は `--unknown-scope parallel|serialize` で扱いを選べる。
- 待機記録、回帰テスト（単体・統合）、設計書・運用ガイド・CLI リファレンス・playbook・個票を更新した。
- 親 runner の `npm run lint:ts` と `npm run test:integration` は failed。単体テスト、型検査、lint:md、lint:fm、lint:mermaid、lint:d2、validate:schema は passed。executor 側の検査は passed（`npm run validate:schema:file` は YAML 非変更のため `not_applicable`）。

## 2. 変更ファイル

- `docs/ja/product/040-system-design/sysd-critical-flows.md`: 変更範囲が重なる項目を統合後まで待機させる流れを、重要フローの設計に反映した。
- `docs/ja/projects/prj-0001/030-project-management/pm-orchestrator-playbook.md`: orchestrator の運用手順に、範囲が重なる項目の直列化と、統合後に PJR-JSEY の対象へ含めて実 agent CLI で確認する手順を追記した。
- `docs/ja/specdojo/guides/exec-operation-guide.md`: 変更範囲の予約、待機、`--unknown-scope` の使い分けを運用ガイドに追記した。
- `docs/ja/specdojo/references/command-reference.md`: `exec run` の `--unknown-scope parallel|serialize` オプションと待機の挙動を CLI リファレンスに追記した。
- `src/exec/run/register-command.ts`: register の実行コマンドに `--unknown-scope` を追加し、範囲予約へ受け渡すようにした。
- `src/exec/run/register-mode.ts`: register の並列・join 実行で、範囲が重なる項目を先行項目の統合後まで待機させるようにした。
- `src/exec/run/register-worktree.ts`: worktree 実行の流れに範囲予約と待機の処理を組み込んだ。
- `src/exec/run/schedule-mode.ts`: schedule の自動実行にも範囲が重なる項目の直列化を適用した。
- `src/exec/run/schedule-prepare.ts`: schedule の準備段階で、項目の変更範囲を求めて予約に使えるようにした。
- `src/exec/run/schedule-task.ts`: schedule のタスク実行に、範囲の待機結果を反映する処理を追加した。
- `src/exec/run/shared.ts`: 範囲予約・待機記録に使う共通の型と処理を追加・調整した。
- `tests/src/exec/register-pipeline-e2e.integration.test.ts`: register パイプラインの E2E に、範囲が重なる項目の順番待ちの回帰ケースを追加・調整した。
- `tests/src/exec/run/track-filter.test.ts`: 範囲予約の追加に合わせて、選択ロジックの期待値を更新した。
- `src/exec/run/change-scope.ts`: 新規。項目の変更範囲を求め、範囲が重なる項目を判定して予約・待機させるロジックを実装した。
- `tests/src/exec/run/change-scope.integration.test.ts`: 新規。実 Git を使い、範囲が重なる項目の待機を検証する統合テスト。
- `tests/src/exec/run/change-scope.test.ts`: 新規。範囲の重なり判定と不明範囲の扱いを検証する単体テスト。

## 3. 申し送り

- 親 runner の `npm run lint:ts` は exit 1 で failed。出力に 1 error と 42 warnings があるが、error の箇所は省略されていて evidence からは特定できない。ログは `parent-validation-attempt-1-lint-ts.log` にある。
- 親 runner の `npm run test:integration` は exit 1 で failed。`tests/src/exec/register-pipeline-e2e.integration.test.ts` の `item_status: review` の期待値が外れた失敗を含む。出力は 3 件の失敗を示すが、残りは省略されている。ログは `parent-validation-attempt-1-test-integration.log` にある。この 2 件を解消するまで完了とは判断できない。
- executor は実 agent を使う `npx specdojo exec run --project prj-0001 --register PJR-JSEY ...` を `requires_human` としている。統合後に人が実行して確認する。
- 主な変更ファイル: src/exec/run/change-scope.ts、register-command.ts、register-mode.ts、register-worktree.ts、schedule-mode.ts、schedule-prepare.ts、schedule-task.ts、shared.ts。テストは change-scope.test.ts、change-scope.integration.test.ts、track-filter.test.ts、register-pipeline-e2e.integration.test.ts。設計・運用ガイド・CLI リファレンス・playbook・個票も更新した。
- 完了条件の npm run check は二重実行禁止に従って分解した。型検査・lint・schema・unit/integration test は親 runner に委ね、残りの検査は executor で成功した。親の結果を合わせて完了判定する。result は編集していない。
- CHANGELOG 文案（追加）: register の並列・join 実行と schedule の自動実行で、変更範囲が重なる項目を先行項目の統合後まで待機させる。不明な変更範囲は --unknown-scope parallel|serialize で扱いを選べる。
- 統合後は playbook に従い PJR-JSEY の対象へ本項目を含め、実 agent CLI で確認する。利用枠を消費するため executor では起動していない。
- 適用外の検証: `npm run validate:schema:file`（executor は YAML 成果物を変更していない。）
- 人の確認が必要: `npx specdojo exec run --project prj-0001 --register PJR-JSEY --worktree --executor-by claude-executor --reporter-by gemma26-reporter`（統合後に対象を更新・reopen して実行する。実 agent の利用枠を消費する確認のため後続へ申し送る。）

## 4. 進め方

executor が出した evidence の変更一覧、検証結果、handoff だけを根拠に、ファイルごとの変更内容を整理した。evidence にない内容は補っていない。失敗した親検証は、そのまま handoff に残した。
