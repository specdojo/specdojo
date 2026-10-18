---
specdojo:
  id: prj-0001:xer-pjr-vgng-20261018t000631z-16fe
  type: exec-result
  task_id: PJR-VGNG
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-vgng-20261018T000631Z-16fe-plan.md
  started_at: "2026-10-18T00:09:01.241Z"
  completed_at: "2026-10-18T04:34:57.396Z"
  agent: agy-claude-expert-executor
  block_reason: "agent exited with non-zero code: parent validation failed: test-unit"
---

# Edit Result

## 1. 実施内容

- Job Run の一部の文書が失敗した場合でも、完了した文書の結果を `review` して統合できる機能を実装しました。
- `src/exec/run/job.ts` を修正し、`job-run` のステータスが `failed` であっても、一部の文書が成功していればその結果を保持・統合できるように変更しました。
- `src/exec/evidence.ts` を更新し、失敗した Run に対する证据判定のロジックを修正しました。
- 関連するスキーマファイル (`job-run.schema.yaml` 等) および、`job-grade` 用の定義・ジョブ設定ファイルを更新しました。
- `tests/src/exec/run/inplace.test.ts` 等のテストコードを更新し、新しい挙動が正しく動作することを確認しました。
- また、`tools/grade/run-per-document.sh` を更新し、文書ごとの評価を適切に扱えるようにしました。

## 2. 変更ファイル

- `docs/ja/product/040-system-design/sysd-job-execution.md`: Job Run の実行に関するシステム設計書を更新しました。
- `docs/ja/projects/prj-0001/jobs/job-grade-deliverable.yaml`: grade ジョブの定義ファイルを更新しました。
- `docs/ja/projects/prj-0001/jobs/job-grade-kata.yaml`: grade ジョブの定義ファイルを更新しました。
- `docs/ja/specdojo/exec-templates/xrp-job-template.md`: ジョブ実行テンプレートを更新しました。
- `docs/ja/specdojo/guides/routine-operation-guide.md`: 定型業務の運用ガイドを更新しました。
- `docs/ja/specdojo/standards/job-definition-standard.md`: ジョブ定義の標準仕様を更新しました。
- `docs/specdojo/schemas/v1/job-run.schema.yaml`: job-run のスキーマ定義を更新しました。
- `docs/specdojo/schemas/v1/job.schema.yaml`: job のスキーマ定義を更新しました。
- `docs/specdojo/schemas/v1/routine-run.schema.yaml`: routine-run のスキーマ定義を更新しました。
- `src/dashboard/routines.ts`: ダッシュボードのルーチン表示に関するコードを更新しました。
- `src/exec/evidence.ts`: evidence の判定ロジックを更新しました。
- `src/exec/run/job.ts`: Job Run の実行および統合ロジックを更新しました。
- `src/job/definition.ts`: ジョブの定義に関するコードを更新しました。
- `src/job/job.ts`: ジョブ本体の実装を更新しました。
- `src/routine/definition.ts`: ルーチンの定義に関するコードを更新しました。
- `src/routine/routine.ts`: ルーチンの実装を更新しました。
- `tests/src/dashboard/dashboard.test.ts`: ダッシュボードのテストコードを更新しました。
- `tests/src/exec/job-worktree.integration.test.ts`: ジョブワークツリーの統合テストを更新しました。
- `tests/src/exec/run/inplace.test.ts`: インプレース実行のテストコードを更新しました。
- `tests/src/job/job.test.ts`: ジョブのテストコードを更新しました。
- `tests/src/routine/routine.test.ts`: ルーチンのテストコードを更新しました。
- `tests/tools/grade-per-document.test.ts`: grade per-document のテストコードを更新しました。
- `tools/grade/run-per-document.sh`: grade 実行用のシェルスクリプトを更新しました。

## 3. 申し送り

- `test-unit` が失敗しているため、原因の調査と修正が必要です。`tests/src/exec/register-plan-escape.test.ts` においてタイムアウトが発生しています。

## 4. 進め方と実践の型の適用

1. `docs/ja/projects/prj-0001/controls/project-register/pjr-vgng-job-run-partial-failure-integration.md` を読み、完了条件を確認しました。 2. ジョブ実行時の `job-run` のステータス管理と、失敗時における `evidence` の生成ロジックを分析しました。 3. `src/exec/run/job.ts` において、`failed` ステータスの Run でも成功した文書の結果を統合可能にする変更を行いました。 4. `src/exec/evidence.ts` を修正し、部分的な成功を正しく判定するようにしました。 5. 既存のジョブ定義、スキーマ、およびテストコードの更新を行いました。 6. `specdojo catalog validate` や `specdojo register build`、各種 Lint 等の検証を実行して、整合性を確認しました。
