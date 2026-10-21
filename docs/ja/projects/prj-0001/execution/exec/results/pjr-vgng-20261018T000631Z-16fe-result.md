---
specdojo:
  id: prj-0001:xer-pjr-vgng-20261018t000631z-16fe
  type: exec-result
  task_id: PJR-VGNG
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-vgng-20261018T000631Z-16fe-plan.md
  started_at: "2026-10-18T00:09:01.241Z"
  completed_at: "2026-10-18T04:39:41.878Z"
  agent: agy-claude-expert-executor
---

# Edit Result

## 1. 実施内容

- Job Run において、一部の文書の評価が失敗しても、成功した文書の結果を `review` ステータスで統合できるように機能を拡張しました。
- これに伴い、`job-run.schema.yaml` や `routine-run.schema.yaml` などのスキーマ定義を更新し、`job` や `routine` の実装、およびそれらに関連する `dashboard` や `tests` を修正しました。
- また、前回失敗した evidence 判定に関する修正も実施しました。

## 2. 変更ファイル

- `docs/ja/product/040-system-design/sysd-job-execution.md`: Job Run の実行と結果の統合に関する設計ドキュメントを更新しました。
- `docs/ja/projects/prj-0001/jobs/job-grade-deliverable.yaml`: Project 0001 の `job-grade-deliverable` の定義を更新しました。
- `docs/ja/projects/prj-0001/jobs/job-grade-kata.yaml`: Project 0001 の `job-grade-kata` の定義を更新しました。
- `docs/ja/specdojo/exec-templates/xrp-job-template.md`: Job 実行用のテンプレートを更新しました。
- `docs/ja/specdojo/guides/routine-operation-guide.md`: ルーチン操作のガイドを更新しました。
- `docs/ja/specdojo/standards/job-definition-standard.md`: Job 定義の標準仕様を更新しました。
- `docs/specdojo/schemas/v1/job-run.schema.yaml`: `job-run` のスキーマに部分的な成功を許容する定義を追加しました。
- `docs/specdojo/schemas/v1/job.schema.yaml`: `job` のスキーマを更新しました。
- `docs/specdojo/schemas/v1/routine-run.schema.yaml`: `routine-run` のスキーマを更新しました。
- `src/dashboard/routines.ts`: ダッシュボードのルーチン表示に関する実装を更新しました。
- `src/exec/evidence.ts`: evidence の収集ロジックを修正しました。
- `src/exec/run/job.ts`: Job 実行時の結果統合ロジックを実装しました。
- `src/job/definition.ts`: Job 定義の実装を更新しました。
- `src/job/job.ts`: Job の実行管理クラスを更新しました。
- `src/routine/definition.ts`: Routine 定義の実装を更新しました。
- `src/routine/routine.ts`: Routine の実行処理を更新しました。
- `tests/src/dashboard/dashboard.test.ts`: ダッシュボードのテストケースを追加・更新しました。
- `tests/src/exec/job-worktree.integration.test.ts`: Job 実行の統合テストを更新しました。
- `tests/src/exec/run/inplace.test.ts`: インプレース更新のテストを更新しました。
- `tests/src/job/job.test.ts`: Job のユニットテストを更新しました。
- `tests/src/routine/routine.test.ts`: Routine のユニットテストを更新しました。
- `tests/tools/grade-per-document.test.ts`: ドキュメントごとの評価ツールのテストを更新しました。
- `tools/grade/run-per-document.sh`: 評価実行スクリプトを更新しました。

## 3. 申し送り

- Job Run の部分的な成功（一部の文書が失敗しても、他が成功していれば統合可能）を実現するための実装が完了しました。
- `review` ステータスでの統合が可能になりました。

## 4. 進め方と実践の型の適用

まず、`job-run.schema.yaml` および `routine-run.schema.yaml` を修正し、一部の文書が失敗（`failed`）していても、他の文書の結果を `review` として統合できる仕組みを定義しました。次に、`src/exec/run/job.ts` 等の実行ロジックにおいて、この新しい状態に基づいた結果の集計・統合処理を実装しました。最後に、変更内容の有効性を確認するために、各種テスト（`tests/` 配下）を実行して検証を行いました。
