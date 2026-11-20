---
specdojo:
  id: prj-0001:xer-pjr-5f1y-20261120t145155z-f0342a35
  type: exec-result
  task_id: PJR-5F1Y
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-5F1Y/pjr-5f1y-20261120T145155Z-f0342a35/plan.md
  started_at: "2026-11-20T14:51:56.329Z"
  completed_at: "2026-11-20T15:06:33.539Z"
  agent: opus-executor
  block_reason: "executor validation failed or not run: npm run validate:schema:file"
---

# Edit Result

## 1. 実施内容

- `exec run --register` コマンドに `--resume-note &lt;text&gt;` オプションを追加しました。
- このオプションにより、`exec resume` を実行する前に、`plan` の共通規約の参照前へ再開の指示を挿入できます。指示内容は `pipeline-state.json` の `resume_notes` に保存されます。
- 関連する設計書、コマンドリファレンス、およびテストコード、スキーマ定義を更新しました。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-operation-guide.md`: `exec` 操作ガイドに `--resume-note` オプションに関する記述を追加しました。
- `docs/ja/specdojo/references/command-reference.md`: コマンドリファレンスに `--resume-note` オプションの情報を追加しました。
- `docs/specdojo/schemas/v1/pipeline-state.schema.yaml`: `pipeline-state.json` で使用する `resume_notes` フィールドを追加するためのスキーマ定義を更新しました。
- `src/exec/pipeline-state.ts`: `PipelineState` 型に `resume_notes` プロパティを追加しました。
- `src/exec/run/agent-pipeline.ts`: `agent-pipeline.ts` において、`resume_notes` を用いて `plan` に指示を挿入するロジックを実装しました。
- `src/exec/run/register-command.ts`: `register-command.ts` に `--resume-note` オプションの解析処理を追加しました。
- `src/exec/run/register-resume.ts`: `register-resume.ts` の実装を、新しいオプションに対応するよう調整しました。
- `src/exec/run/shared.ts`: `shared.ts` 内の関連する共通処理を更新しました。
- `src/shared/plan-conventions.ts`: 再開指示の挿入位置を決定するための規約に関連する定義を更新しました。
- `src/exec/run/resume-notes.ts`: 再開指示の生成と挿入を行うための新しい機能を実装しました。
- `tests/src/exec/run/resume-notes.test.ts`: `--resume-note` オプションの動作を検証するためのユニットテストを追加しました。

## 3. 申し送り

- Decision: the option is named `--resume-note &lt;text&gt;` and is limited to `exec run --register`, as the completion conditions specify. Schedule `exec resume --task` was not extended; handle that in a separate item if needed.
- Decision: `--resume-note` requires exactly one `--register` ID, cannot be combined with `--register-filter`, and requires `--resume --resume-from executor`. A note is item-specific, so applying the same note to several items is rejected.
- Decision: the record is `resume_notes` (an array of `at` and `notes`) in `pipeline-state.json`. Later resumes carry earlier entries over even though the previous state is archived to `pipeline-state.attempt-N.json`. The schema and `isPipelineState` were extended accordingly.
- Decision: the section is written to the worktree plan, which is the prompt input for an executor resume and is allowed by the commit scope (`allowEditedPlan`). It is inserted after register start and before the executor launch, and the prompt is rebuilt from the updated plan. Plans without a conventions reference get the section appended at the end. The heading is unnumbered to match the existing runner-written section for change-scope waits.
- CHANGELOG draft (Added): `exec run --register &lt;PJR-ID&gt; --resume --resume-from executor` に `--resume-note &lt;text&gt;`（繰り返し可）を追加。再開の前に、run の plan の共通規約の参照の前へ再開の指示の節を足し、指示と日時を `pipeline-state.json` の `resume_notes` に記録する（PJR-5F1Y）。
- Validation note: two plan-applicable checks were not completed as recorded commands. (1) `npm run validate:history-links` was run, but the sandbox prevented capturing its exit code; its output contained no non-valid lines. (2) `npm run validate:schema:file` was not run for the changed `pipeline-state.schema.yaml`. Both are reported as `not_run`, which the runner treats as validation failure. Run them before or during review if the task does not advance.
- 適用外の検証（runner の判定）: `npm run validate:history-links`（変更に 履歴蓄積ファイル（登録簿の個票 `controls/project-register/pjr-*.md` など、pjr-index.md と runner が書く plan・result を除く） がない）

## 4. 進め方

1. `src/exec/run/register-command.ts` に `--resume-note` オプションを追加し、引数をパースできるようにしました。 2. `src/exec/run/resume-notes.ts` を作成し、`pipeline-state.json` に記録された `resume_notes` を用いて、`plan` の共通規約の参照（`plan-conventions.ts`）の直前に指示を挿入するロジックを実装しました。 3. `src/exec/pipeline-state.ts` とスキーマファイルを更新し、`resume_notes` の保持を可能にしました。 4. `src/exec/run/agent-pipeline.ts` で、指示の挿入プロセスを組み込みました。 5. 最後に各種ドキュメント（ガイド、リファレンス）の更新と、ユニットテストによる動作検証を行いました。
