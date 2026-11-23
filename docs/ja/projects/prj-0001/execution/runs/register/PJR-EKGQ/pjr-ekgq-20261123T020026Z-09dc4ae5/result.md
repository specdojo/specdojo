---
specdojo:
  id: prj-0001:xer-pjr-ekgq-20261123t020026z-09dc4ae5
  type: exec-result
  task_id: PJR-EKGQ
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-EKGQ/pjr-ekgq-20261123T020026Z-09dc4ae5/plan.md
  started_at: "2026-11-23T02:00:28.112Z"
  completed_at: "2026-11-23T02:05:37.567Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- 外部プロジェクトの path を linked worktree では主の作業ツリーのルートから解決するよう修正した（案 a）。テスト・設定リファレンス・個票の対応結果（CHANGELOG 事項を含む）を更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/references/specdojo-config-reference.md`: 変更、+2 / -0 行
- `src/shared/specdojo-config.ts`: 変更、+7 / -3 行
- `tests/src/shared/specdojo-config-external-projects.test.ts`: 変更、+34 / -0 行

## 3. 申し送り

- CHANGELOG に書く事項（区分 Fixed）: `external_projects` の `path` を、linked worktree では主の作業ツリーのルートから解決する。`exec run --register --worktree` の worktree の準備が止まる問題を修正（PJR-EKGQ）。個票の対応結果の小節にも同文を記載済み。
- 対応策は案 (a) を採用。案 (b)・(c) は採用していない。理由は個票の対応結果に記載。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
