---
specdojo:
  id: prj-0001:xer-pjr-wagy-20261028t002502z-9ceee4cb
  type: exec-result
  task_id: PJR-WAGY
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-wagy-20261028T002502Z-9ceee4cb-plan.md
  started_at: "2026-10-28T00:25:02.814Z"
  completed_at: "2026-10-28T00:41:05.487Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- 2 種類の planning approach (`catalog-planning` / `strategy-planning`) を実装しました。
- カタログの `catalog_status` 判定ロジックを実装し、todo の完了から `primary` を導出できるようにしました。
- 新しいテンプレート (`xep-catalog-planning-template.md`, `xep-strategy-planning-template.md`) を追加しました。
- 単体テスト、コマンドリファレンス、`CHANGELOG.md`、および個票の内容を更新しました。
- 空の環境を用いて、カタログの計画策定から strategy および track の生成までの一連のワークフローが正常に動作することを確認しました。

## 2. 変更ファイル

- `CHANGELOG.md`: `CHANGELOG.md` を更新しました。
- `docs/ja/specdojo/references/command-reference.md`: `docs/ja/specdojo/references/command-reference.md` を更新しました。
- `docs/specdojo/schemas/v1/exec-common.schema.yaml`: `docs/specdojo/schemas/v1/exec-common.schema.yaml` を更新しました。
- `docs/specdojo/schemas/v1/exec-plan-frontmatter.schema.yaml`: `docs/specdojo/schemas/v1/exec-plan-frontmatter.schema.yaml` を更新しました。
- `docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml`: `docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml` を更新しました。
- `src/dashboard/timeline-build.ts`: `src/dashboard/timeline-build.ts` を更新しました。
- `src/dashboard/timeline.ts`: `src/dashboard/timeline.ts` を更新しました。
- `src/exec/core.ts`: `src/exec/core.ts` を更新しました。
- `src/exec/plans-generation.ts`: `src/exec/plans-generation.ts` を更新しました。
- `src/exec/plans-storage.ts`: `src/exec/plans-storage.ts` を更新しました。
- `src/exec/register.ts`: `src/exec/register.ts` を更新しました。
- `src/exec/results.ts`: `src/exec/results.ts` を更新しました。
- `src/exec/strategy.ts`: `src/exec/strategy.ts` を更新しました。
- `src/register/approach.ts`: `src/register/approach.ts` を更新しました。
- `src/register/create-commands.ts`: `src/register/create-commands.ts` を更新しました。
- `src/schedule/schedule.ts`: `src/schedule/schedule.ts` を更新しました。
- `src/schedule/strategy-generate-scope.ts`: `src/schedule/strategy-generate-scope.ts` を更新しました。
- `src/schedule/strategy-generate.ts`: `src/schedule/strategy-generate.ts` を更新しました。
- `src/schedule/strategy-profiles.ts`: `src/schedule/strategy-profiles.ts` を更新しました。
- `src/shared/agent-types.ts`: `src/shared/agent-types.ts` を更新しました。
- `docs/ja/specdojo/exec-templates/xep-catalog-planning-template.md`: 新しいカタログ計画用のテンプレートを追加しました。
- `docs/ja/specdojo/exec-templates/xep-strategy-planning-template.md`: 新しい strategy 計画用のテンプレートを追加しました。
- `src/exec/plans-planning.ts`: `src/exec/plans-planning.ts` を新規作成しました。
- `src/register/catalog-status.ts`: `src/register/catalog-status.ts` を新規作成しました。
- `src/register/planning.ts`: `src/register/planning.ts` を新規作成しました。
- `tests/src/dashboard/timeline-catalog-status.test.ts`: `tests/src/dashboard/timeline-catalog-status.test.ts` を新規作成しました。
- `tests/src/register/planning.test.ts`: `tests/src/register/planning.test.ts` を新規作成しました。

## 3. 申し送り

- 名称は `catalog-planning` / `strategy-planning`、対象は `domain:&lt;domain&gt;` / `track:&lt;track&gt;` 各一件としました。未作成文書と物理分割された domain を扱うため、文書 ID ではなく作業単位を指定します。設計理由は個票の対応結果に記録済みです。
- カタログ作成 todo の `done` から domain を `primary` と導きます。対象 todo がない domain は手書き値を保持し、複数 domain は全件 `primary` で着手可能とします。不一致は警告し、`tml-index.yaml` は変更しません。strategy 生成も同じ導出を使用します。
- 空の環境で epic の子 todo、判定計画、DCT、todo の close、timeline、strategy、4 タスクの track と 1 milestone の生成まで成功しました。手順・警告・結果は個票に記録済みです。作業用データは削除しました。
- 親検証 7 件は指示どおり runner に委ねています。result は編集していないため、reporter は実施内容・検証結果・本申し送りを反映してください。
- 適用外の検証: `node --import tsx src/specdojo.ts catalog build --project prj-0001`（`dct-*.yaml` の変更がないため。）
- 適用外の検証: `node --import tsx src/specdojo.ts exec refresh --project prj-0001`（`sch-*.yaml` の変更がないため。）

## 4. 進め方

2 種類の planning approach (`catalog-planning` / `strategy-planning`) を実装し、カタログの `catalog_status` 判定ロジック、および新しいテンプレートの導入を行いました。また、関連するテスト、ドキュメント、コマンドリファレンス、`CHANGELOG.md`、個票の更新も完了しています。
