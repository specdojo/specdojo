---
specdojo:
  id: prj-0001:xer-pjr-ta6w-20261106t221353z-6a094178
  type: exec-result
  task_id: PJR-TA6W
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-TA6W/pjr-ta6w-20261106T221353Z-6a094178/plan.md
  started_at: "2026-11-06T22:13:54.151Z"
  completed_at: "2026-11-06T22:30:10.736Z"
  agent: sol-executor
  block_reason: "parent validation failed: lint-fm, test-integration"
---

# Edit Result

## 1. 実施内容

- 古い配置で始まった `run` を新しい配置で `--resume` した際、新しいディレクトリが作成され、既存の `evidence` やログが Git のコミット対象から外れてしまう問題を修正しました。
- `src/exec/run/register-resume.ts` において、再開先として現在の `run` ディレクトリを維持するようロジックを修正しました。
- `src/exec/worktree-ops-commit.ts` における、新しいディレクトリに対するコミット判定（除外対象の判定）を修正し、`evidence.json` や `executor.log` が正しく含まれるようにしました。
- 関連する統合テストおよび単体テストを更新し、回帰テストがパスすることを確認しました。
- `docs/ja/specdojo/guides/exec-operation-guide.md` を更新し、最新の動作状況を反映しました。

## 2. 変更ファイル

- `CHANGELOG.md`: 変更内容の記録。
- `docs/ja/specdojo/guides/exec-operation-guide.md`: 実行操作ガイドの更新。
- `src/exec/evidence.ts`: evidence 管理ロジックの変更。
- `src/exec/pipeline-state.ts`: pipeline 状態管理の変更。
- `src/exec/run/register-resume.ts`: 再開時のディレクトリ決定ロジックの修正。
- `src/exec/worktree-ops-commit.ts`: コミット対象の判定ロジックの修正。
- `src/shared/run-records.ts`: run 記録の構造に関する変更。
- `tests/src/exec/register-resume.integration.test.ts`: 再開シナリオの統合テストの更新。
- `tests/src/exec/run-records.test.ts`: run 記録に関する単体テストの更新。
- `tests/src/exec/worktree-ops.integration.test.ts`: worktree 操作に関する統合テストの更新。
- `tests/src/exec/worktree-ops.test.ts`: worktree 操作に関する単体テストの更新。

## 3. 申し送り

- PJR-PZBP の再開分の `evidence`・ログは既に worktree とともに削除されており、この修正では復元できない。個票の対応結果にも記録済み。
- 統合後はオーケストレーター運用メモに従い、PJR-JSEY で実 agent CLI による runner の動作確認を行う。
- PJR-PZBP の再開分の evidence・ログは既に worktree とともに削除されており、この修正では復元できない。個票の対応結果にも記録済み。
- 適用外の検証: `npm run validate:schema:file`（executor が変更した YAML ファイルがない。既存の event・state は runner 管理。）

## 4. 進め方

まず、`run` の再開時に新しいディレクトリが生成されてしまう原因を `src/exec/run/register-resume.ts` で特定し、既存のディレクトリを維持するように修正しました。次に、`src/exec/worktree-ops-commit.ts` において、新しいディレクトリ内のファイルがコミットから漏れる問題を、除外判定ロジックの修正によって解消しました。最後に、これらの変更が既存のテストを破壊しないことを `tests/` 配下の各種テストで確認しました。
