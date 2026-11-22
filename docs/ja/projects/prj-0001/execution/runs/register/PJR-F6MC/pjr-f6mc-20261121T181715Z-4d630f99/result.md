---
specdojo:
  id: prj-0001:xer-pjr-f6mc-20261121t181715z-4d630f99
  type: exec-result
  task_id: PJR-F6MC
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-F6MC/pjr-f6mc-20261121T181715Z-4d630f99/plan.md
  started_at: "2026-11-21T18:17:16.466Z"
  completed_at: "2026-11-22T00:28:32.329Z"
  agent: qwen-executor
---

# Edit Result

## 1. 実施内容

- ローカル設定で `external_projects` を宣言・上書きできるようにし、前回の test-unit 失敗（スキーマの `oneOf` 分岐の誤った `not` 条件、ローカル専用別名の `project_id` 拒否、テスト fixture のディレクトリ不足）を修正した。

## 2. 変更ファイル

- `docs/ja/specdojo/references/specdojo-config-reference.md`: 変更、+13 / -7 行
- `docs/specdojo/schemas/v1/exec-evidence.schema.yaml`: 変更、+48 / -28 行
- `src/shared/local-config.ts`: 変更、+143 / -12 行
- `tests/src/shared/local-config.test.ts`: 変更、+91 / -0 行

## 3. 申し送り

- ローカル専用の `external_projects` 別名は `path` 以外のキー（`project_id` など）も受け付ける。共有の別名の上書きは `path` のみ。
- 設定リファレンスと個票の更新は初回の試行で済んでおり、この再開では再編集していない。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
