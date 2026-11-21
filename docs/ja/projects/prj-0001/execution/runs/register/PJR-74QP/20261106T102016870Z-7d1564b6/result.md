---
specdojo:
  id: prj-0001:xer-pjr-74qp-20261106t102016z-fea095d6
  type: exec-result
  task_id: PJR-74QP
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-74QP/20261106T102016870Z-7d1564b6/plan.md
  started_at: "2026-11-06T10:20:17.451Z"
  completed_at: "2026-11-06T10:37:13.959Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- epic に予定の開始日 `start_on` を持たせるための機能を実装しました。
- `register` コマンドにおける epic の `start_on` の設定・保持・入力検証、および履歴への適用ロジ逻辑を更新しました。
- `dashboard` の生成ロジックにおいて、`start_on` を最優先し、データがない場合に期間を未定として扱うよう変更しました。
- 関連する JSON Schema、各種ガイド、コマンドリファレンス、およびテストコードを更新しました。

## 2. 変更ファイル

- `CHANGELOG.md`: 今回の変更に関する記録を追記しました。
- `docs/ja/specdojo/guides/register-operation-guide.md`: register 操作における epic の `start_on` に関する説明を更新しました。
- `docs/ja/specdojo/guides/timeline-design-guide.md`: タイムライン設計における開始日の扱いに関するガイドを更新しました。
- `docs/ja/specdojo/references/command-reference.md`: `register` コマンドの引数に関する情報を更新しました。
- `docs/ja/specdojo/rulebooks/pjr-rulebook.md`: プロジェクト登録簿の運用ルールを更新しました。
- `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml`: 成果物の frontmatter スキーマを更新しました。
- `docs/specdojo/schemas/v1/register-events.schema.yaml`: 登録イベントのスキーマを更新しました。
- `docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml`: 登録項目の frontmatter スキーマを更新しました。
- `src/dashboard/dashboard.ts`: ダッシュボード生成時の開始日判定ロジックを更新しました。
- `src/dashboard/epic-plan.ts`: epic 計画の期間計算ロジックを更新しました。
- `src/register/command-types.ts`: `register` コマンドの型定義を更新しました。
- `src/register/core.ts`: `register` コア機能のロジックを更新しました。
- `src/register/create-commands.ts`: コマンド生成処理を更新しました。
- `src/register/epic.ts`: epic の登録処理に `start_on` を含めるよう変更しました。
- `src/register/event-merge.ts`: イベントのマージ処理を更新しました。
- `src/register/events.ts`: イベントの定義を更新しました。
- `src/register/external-project.ts`: 外部プロジェクトの処理を更新しました。
- `src/register/item.ts`: 登録項目の管理ロジックを更新しました。
- `src/register/maintenance-commands.ts`: メンテナンスコマンドの定義を更新しました。
- `tests/src/dashboard/epic-plan.test.ts`: ダッシュボードの期間計算に関するテストを追加・更新しました。
- `tests/src/register/commands.test.ts`: `register` コマンドに関するテストを更新しました。
- `tests/src/register/epic.test.ts`: epic 登録のテストを更新しました。
- `tests/src/register/event-merge.test.ts`: イベントマージのテストを更新しました。
- `tests/src/register/external-project.test.ts`: 外部プロジェクトのテストを更新しました。
- `tests/src/register/track-domains.test.ts`: ドメイン追跡のテストを更新しました。

## 3. 申し送り

- なし

## 4. 進め方

epic に `start_on` という属性を持たせるために、まず `register` コマンドのデータ構造とバリデーションを拡張しました。次に、dashboard 生成時にこの `start_on` を最優先で参照するようロジックを変更しました。これにより、着手イベントが存在しない epic でも、手動で設定された開始日に基づいてガントチャートの期間が正しく表示されるようになります。最後に、変更内容を裏付けるためのテストコードの拡充と、関連するドキュメントの更新を行いました。
