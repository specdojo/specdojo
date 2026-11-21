---
specdojo:
  id: prj-0001:xer-pjr-f6mc-20261121t181715z-4d630f99
  type: exec-result
  task_id: PJR-F6MC
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-F6MC/pjr-f6mc-20261121T181715Z-4d630f99/plan.md
  started_at: "2026-11-21T18:17:16.466Z"
  completed_at: "2026-11-21T19:00:52.550Z"
  agent: qwen-executor
  block_reason: "parent validation failed: lint-fm, validate-schema, test-unit"
---

# Edit Result

## 1. 実施内容

- ローカル設定 (`specdojo.local.config.json`) で `external_projects` を宣言・上書きできるように変更しました。
- 共有の `specdojo.config.json` を使わずに、環境依存のパスをローカル設定で直接定義できるようになりました。
- `src/shared/local-config.ts` のロジック更新、`tests/src/shared/local-config.test.ts` へのテスト追加、および `docs/ja/specdojo/references/specdojo-config-reference.md` の更新を行いました。

## 2. 変更ファイル

- `docs/ja/specdojo/references/specdojo-config-reference.md`: `external_projects` に関する説明を追加しました。
- `docs/specdojo/schemas/v1/exec-evidence.schema.yaml`: スキーマの変更を行いました。
- `src/shared/local-config.ts`: `external_projects` を扱えるよう、`local-config.ts` 内のバリデーションおよび処理ロジックを更新しました。
- `tests/src/shared/local-config.test.ts`: `external_projects` の上書き動作を検証するテストケースを追加しました。

## 3. 申し送り

- ローカル設定での `external_projects` の定義が可能な状態になっています。

## 4. 進め方

``specdojo.local.config.json`` において、`external_projects` を新しいキーとして許容するように `src/shared/local-config.ts` を修正しました。これにより、既存の共有 alias（パスの単純な差し替え）と、新しいプロジェクト用 alias（パス + プロジェクト ID の追加）の両方を `validateExternalProjects` 関数を通じて適切に処理できるようになりました。また、設定の変更を反映するためにリファレンスドキュメントの更新とユニットテストの拡充を行いました。
