---
specdojo:
  id: prj-0001:xer-pjr-jjby-20261025t010534z-b41b1a6a
  type: exec-result
  task_id: PJR-JJBY
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-jjby-20261025T010534Z-b41b1a6a-plan.md
  started_at: "2026-10-25T01:06:13.435Z"
  completed_at: "2026-10-25T01:16:13.116Z"
  agent: luna-executor
---

# Edit Result

## 1. 実施内容

- `register update` コマンドの再検証条件を修正しました。
- authoring の kata が作成済みの場合、担当者や期限などの通常属性の更新は「kata id already exists」のエラーを出さずに実行できるように変更しました。
- 一方で、`approach` に関連する変更が行われた場合には、従来通り再検証を行うロジックを維持しています。
- これらの動作を検証するためのテストケースを追加しました。
- `CHANGELOG.md` および個票を更新しました。

## 2. 変更ファイル

- `CHANGELOG.md`: タスクの実施内容を記述するために更新しました。
- `src/register/create-commands.ts`: `register update` の再検証ロジックを修正し、authoring kata 存在時の属性更新を許可するように変更しました。
- `tests/src/register/commands.test.ts`: 修正後の動作（通常属性の更新と `approach` 変更時の再検証）を検証するテストを追加しました。

## 3. 申し送り

- 個票 `docs/ja/projects/prj-0001/controls/project-register/pjr-jjby-update-authoring-revalidation.md` は、実行過程で更新されています。
- 適用外の検証: `npm run lint:ts`（`pipeline.parent_validations` に含まれ、親 runner が実行する）
- 適用外の検証: `npm run lint:fm`（`pipeline.parent_validations` に含まれ、親 runner が実行する）
- 適用外の検証: `npm run lint:md`（`pipeline.parent_validations` に含まれ、親 runner が実行する）
- 適用外の検証: `npm run test:integration`（`pipeline.parent_validations` に含まれ、親 runner が実行する）
- 適用外の検証: `npm run validate:schema`（`pipeline.parent_validations` に含まれ、親 runner が実行する）
- 適用外の検証: `npm run typecheck`（`pipeline.parent_validations` に含まれ、親 runner が実行する）
- 適用外の検証: `npm run test:unit`（`pipeline.parent_validations` に含まれ、親 runner が実行する）

## 4. 進め方

既存の `register update` コマンドのロジックにおいて、authoring の kata が既に存在する場合の条件分岐を緩和する修正を加えました。具体的には、`approach` の変更がない限り、担当者などの属性変更時に「kata id already exists」で停止しないようにしました。また、この変更が既存の動作を破壊していないことを確認するため、ユニットテストを拡充しました。
