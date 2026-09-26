---
specdojo:
  id: prj-0001:xer-pjr-ag7b-20260926t142505z-8bbf
  type: exec-result
  task_id: PJR-AG7B
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-ag7b-20260926T142505Z-8bbf-plan.md
  started_at: "2026-09-26T14:25:05.556Z"
  completed_at: "2026-09-26T14:45:14.854Z"
  agent: codex-expert-executor
  block_reason: "agent exited with non-zero code: 親 runner による検証 `test-unit` が失敗（exit 1）しており、 `tests/src/exec-plans.test.ts` の「review plan はプロジェクト差分から共通レビュー観点を解決して展開する」テストケースにおいて不整合が発生しているため。"
---

# Edit Result

## 1. 実施内容

- `document_kinds` による文書種類別の観点選択を `grade` および `review` に統一して実装し、PJR-AG7B 個票を更新した。
- スキーマ定義の更新、ロジックの実装、および対応するテストコードを追加した。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/controls/project-register/pjr-ag7b-viewpoint-applicability-by-document-kind.md`: 個票の更新
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`: 共通レビュー観点の定義を `document_kinds` 形式に更新
- `docs/ja/specdojo/guides/review-guide.md`: ガイドの更新
- `docs/specdojo/schemas/v1/pm-review-viewpoints.schema.yaml`: スキーマに `document_kinds` フィールドを追加
- `src/exec-plans.ts`: プラン展開ロジックの更新
- `src/exec-run.ts`: 実行ロジックの更新
- `src/exec.ts`: 実行エントリーポイントの更新
- `src/grade.ts`: `grade` 処理への文書種類別フィルタリングを実装
- `src/review-plan.ts`: `review-plan` への文書種類別フィルタリングを実装
- `src/review-types.ts`: 型定義の更新
- `tests/src/exec-plans.test.ts`: プラン展開のユニットテストを追加
- `tests/src/grade.test.ts`: `grade` 処理のユニットテストを追加
- `tests/src/review-plan.test.ts`: `review-plan` のユニットテストを追加

## 3. 申し送り

- `test-unit` が失敗しているため、修正して再検証する必要がある。

## 4. 進め方と実践の型の適用

観点定義に `document_kinds` を導入し、 `grade` および `review-plan` の生成段階で文書の種類に基づいたフィルタリングを行うよう実装を変更した。これにより、個別の `check` 文言での場当たり的な除外条件を宣言的な設定に移行した。
