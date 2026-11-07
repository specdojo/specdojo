---
specdojo:
  id: prj-0001:xer-pjr-9by9-20261107t011738z-f0ee4d58
  type: exec-result
  task_id: PJR-9BY9
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-9BY9/pjr-9by9-20261107T011738Z-f0ee4d58/plan.md
  started_at: "2026-11-07T01:17:39.007Z"
  completed_at: "2026-11-07T02:17:40.679Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- 既存の実行記録を `execution/runs/` 配下の run 単位のディレクトリに移行する仕組みを実装し、関連する各種ツールとテストを更新しました。
- `exec migrate-records` による移行作業の検証（dry-run）を行い、5,576 件の移行・参照更新が正常に行われることを確認しました。
- 進行中の run (worktree が残る run) が存在する場合、移行対象から除外して停止する安全策を導入し、これに伴うテストケースの追加・更新を行いました。

## 2. 変更ファイル

- `CHANGELOG.md`: 実行記録の移行に関する変更を記録しました。
- `docs/ja/specdojo/guides/docs-structure-guide.md`: ドキュメントの構造に関するガイドを更新しました。
- `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`: plan と result のライフサイクルに関するガイドを更新しました。
- `src/dashboard/exec-records.ts`: ダッシュボードの実行記録表示ロジックを変更しました。
- `src/exec/commands.ts`: `exec` コマンドの登録および実行に関する処理を更新しました。
- `src/exec/plans-core.ts`: plan のコアロジックを更新しました。
- `src/exec/plans-storage.ts`: plan のストレージ操作に関する処理を変更しました。
- `src/exec/register-resume.ts`: 実行記録の再開に関するロジックを更新しました。
- `src/exec/run/register-worktree.ts`: worktree を用いた実行記録の管理ロジックを変更しました。
- `src/exec/worktree-ops-commit.ts`: worktree の操作に伴うコミット処理を更新しました。
- `src/job/noop.ts`: noop ジョブの定義を更新しました。
- `src/shared/run-records.ts`: run 記録の共有型定義を更新しました。
- `tests/src/dashboard/dashboard.test.ts`: ダッシュボード表示に関するテストを更新しました。
- `tests/src/exec/condense.test.ts`: 記録の集約に関するテストを更新しました。
- `tests/src/exec/deliverable.test.ts`: 成果物に関するテストを更新しました。
- `tests/src/exec/plan-conventions.test.ts`: plan の規約に関するテストを更新しました。
- `tests/src/exec/register-resume.integration.test.ts`: 再開処理の統合テストを、進行中の run を除外する安全策のテストに置き換えました。
- `tests/src/exec/register-resume.test.ts`: 再開に関する単体テストを更新しました。
- `tests/src/exec/release-reset-worktree.integration.test.ts`: worktree 解放の統合テストを更新しました。
- `tests/src/exec/run-records.test.ts`: run 記録に関するテストを更新しました。
- `tests/src/exec/worktree-command.integration.test.ts`: worktree コマンドの統合テストを更新しました。
- `tests/src/exec/worktree-ops.integration.test.ts`: worktree 操作の統合テストを更新しました。
- `tests/src/exec/worktree-ops.test.ts`: worktree 操作の単体テストを更新しました。
- `tests/src/job/noop.test.ts`: noop ジョブのテストを更新しました。
- `src/exec/migrate-records.ts`: 実行記録の移行を行う `migrate-records` コマンドの実装を追加しました。
- `tests/src/exec/migrate-records.test.ts`: `migrate-records` コマンドのテストを追加しました。

## 3. 申し送り

- 判断: 進行中のrunを移行せず、対象のexec worktreeが残る場合はdry-runでも項目ID・パス・ブランチと撤去指示を示して停止する方式を選択した。PJR-VH8Dの移行中はほかのrunを止める方針に沿い、再開用の未コミット成果や独立したindexを移行対象に含めないため。個票にも記録済み。
- 実移動はorchestratorがcommit `d17dcdeba`で完了済みの5,576件。内容保持2,458件、パス更新3,118件、job状態の参照更新96件、ログ本文更新0件、移せなかったもの0件。本試行では移動を再実行せず、dry-runで移動・更新・欠落・除外がすべて0件と確認した。
- exec/eventsの791件はタスクの状態遷移の正本として保持する。exec/trialsの40件は比較実験独自の形式として移行対象外とした。旧plans・results・evidenceにはファイルが残っていない。移行前の対の欠落18件は個票に列挙済み。
- 単体・統合テスト、lint、型検査、schemaは指定された親runnerの検証に委ねた。前回失敗した2件の成功は未確認であり、修正後の親検証結果を正とする。result記入と状態遷移もreporter／runnerが行う。
- 実移動はorchestratorがcommit d17dcdebaで完了済みの5,576件。内容保持2,458件、パス更新3,118件、job状態の参照更新96件、ログ本文更新0件、移せなかったもの0件。本試行では移動を再実行せず、dry-runで移動・更新・欠落・除外がすべて0件と確認した。
- 保護された設定の変更案と未決の判断はない。統合後は運用メモに従いPJR-JSEYでrunnerの動作を確認してからcloseする。
- 適用外の検証: `npm run validate:schema:file`（差分のYAMLはrunner管理の登録イベントのみ。全体のschema検査は親runnerが担当する。）

## 4. 進め方

既存の実行記録を新しい run 単位のディレクトリ構造へ安全に移行するため、まず `exec migrate-records` コマンドを実装しました。このコマンドは、進行中の run (worktree が残っているもの) が存在する場合、誤った移行を防ぐためにエラーを出力して停止する安全策を備えています。作業にあたっては、orchestrator によって実施済みの実移動結果（5,576 件）を確認し、本タスクでは `dry-run` による検証と、移行後のシステム整合性の確認（`exec validate`, `dashboard build` 等）に注力しました。また、既存のテストスイートのうち、進行中の run 移行に関連する失敗していたテストを、新しく導入した安全策を検証するテストへと置き換えました。
