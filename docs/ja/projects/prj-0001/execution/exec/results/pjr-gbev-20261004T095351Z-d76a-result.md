---
specdojo:
  id: prj-0001:xer-pjr-gbev-20261004t095351z-d76a
  type: exec-result
  task_id: PJR-GBEV
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-gbev-20261004T095351Z-d76a-plan.md
  started_at: "2026-10-04T09:53:51.309Z"
  completed_at: "2026-10-04T11:37:22.996Z"
  agent: codex-expert-executor
---

# Edit Result

## 1. 実施内容

- exec の reporter における事実項目（`changed_files` のパス、`outcome`、`block_reason`）を evidence から機械生成し、LLM 出力を文章項目だけに限定しました。
- パイプライン・trial・スキーマ・各種ガイド・テスト fixture・個票を更新し、全検証（静的検査・型検査・単体テスト・結合テスト）が正常に通過することを確認しました。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/controls/project-register/pjr-gbev-exec-reporter-machine-facts.md`: 個票の作業内容および対応結果セクションを更新
- `docs/ja/specdojo/guides/exec-config-guide.md`: reporter 出力仕様変更に伴う設定ガイドの記述を更新
- `docs/ja/specdojo/guides/exec-operation-guide.md`: 運用ガイドにおける reporter と evidence の連携説明を更新
- `docs/ja/specdojo/references/command-reference.md`: コマンドリファレンスの関連説明を更新
- `docs/specdojo/schemas/v1/exec-evidence.schema.yaml`: evidence スキーマを更新
- `docs/specdojo/schemas/v1/exec-reporter-output.schema.yaml`: reporter 出力スキーマを更新し、LLM 出力を文章項目に限定
- `src/exec-evidence.ts`: evidence から事実項目を機械生成・抽出するロジックを更新
- `src/exec-reporter.ts`: reporter の処理を改修し、事実項目を evidence から補完するよう変更
- `src/exec-results.ts`: result の生成において evidence 由来の事実項目と LLM 由来の記述を結合するよう変更
- `src/exec-run.ts`: パイプライン実行における reporter 入出力処理を新仕様に合わせて更新
- `src/exec-trial.ts`: trial 実行時の reporter 処理を新仕様に合わせて更新
- `tests/src/exec-evidence.test.ts`: evidence のテストケースを新仕様に合わせて更新
- `tests/src/exec-pipeline-e2e.integration.test.ts`: パイプライン E2E 統合テストを新仕様に合わせて更新
- `tests/src/exec-register-pipeline-e2e.integration.test.ts`: 登録簿パイプライン E2E 統合テストを新仕様に合わせて更新
- `tests/src/exec-register-resume.integration.test.ts`: 登録簿レジューム処理の統合テストを更新
- `tests/src/exec-reporter.test.ts`: reporter の単体テストを新スキーマ・仕様に合わせて更新
- `tests/src/exec-results.test.ts`: result 生成処理のテストを更新
- `tests/src/exec-run-inplace.test.ts`: in-place 実行テストを更新

## 3. 申し送り

- runner の検証（`lint:ts`、`lint:fm`、`lint:md`、`test:integration`、`validate:schema`、`typecheck`、`test:unit`）および executor の検証すべてに合格しています。

## 4. 進め方と実践の型の適用

evidence に存在する確定値（パス、成否判定など）を LLM の転記から分離し、runner が evidence から直接機械生成して差し込む構造に移行しました。これに伴い reporter のスキーマやパイプライン処理を調整し、テストと文書を整合させました。
