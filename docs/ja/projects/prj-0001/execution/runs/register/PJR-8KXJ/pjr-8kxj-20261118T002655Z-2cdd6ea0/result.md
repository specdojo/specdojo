---
specdojo:
  id: prj-0001:xer-pjr-8kxj-20261118t002655z-2cdd6ea0
  type: exec-result
  task_id: PJR-8KXJ
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-8KXJ/pjr-8kxj-20261118T002655Z-2cdd6ea0/plan.md
  started_at: "2026-11-18T00:27:28.994Z"
  completed_at: "2026-11-18T02:12:44.706Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- lint:ts のエラー（post-integration.test.ts の import() 型注釈）を import type に置き換えて解消した。`post_integration` の設定・実行・失敗時の記録・テスト・文書・変更案は前回までに完了していることを確認した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-config-guide.md`: 変更、+9 / -0 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+2 / -0 行
- `docs/specdojo/schemas/v1/exec-defaults.schema.yaml`: 変更、+25 / -0 行
- `src/exec/agent-config.ts`: 変更、+3 / -0 行
- `src/exec/run/job.ts`: 変更、+13 / -1 行
- `src/exec/run/register-worktree.ts`: 変更、+18 / -27 行
- `src/exec/run/schedule-task.ts`: 変更、+29 / -1 行
- `src/shared/dist-freshness.ts`: 変更、+9 / -2 行
- `tests/docs/specdojo/schemas/exec-defaults-schema.test.ts`: 変更、+21 / -0 行
- `tests/src/exec/register-pipeline-e2e.integration.test.ts`: 変更、+69 / -0 行
- `src/exec/post-integration.ts`: 追加、+196 / -0 行
- `tests/src/exec/post-integration.test.ts`: 追加、+249 / -0 行

## 3. 申し送り

- 保護された設定の変更案: prj-0001 の `.specdojo/exec-defaults.yaml` の `pipeline` に `post_integration: [{ id: build-dist, paths: ["src/**", "tsconfig*.json"] }]` を足す。反映は利用者の承認のもと feature ブランチで行う。`package.json` の変更は不要（個票の対応結果「保護された設定の変更案」を参照）。
- CHANGELOG の文案は個票の対応結果「CHANGELOG に書く事項」を参照（区分 Added）。
- 決めた点: 失敗の記録先は run の記録の `post-integration.log`、失敗の印 `dist/.specdojo-build-failed` を dist-freshness の判定に追加、対象は worktree 実行だけ、`paths` は必須（理由は個票の「決めた点と理由」）。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
