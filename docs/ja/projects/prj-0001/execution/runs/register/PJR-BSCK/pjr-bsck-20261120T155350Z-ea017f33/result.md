---
specdojo:
  id: prj-0001:xer-pjr-bsck-20261120t155350z-ea017f33
  type: exec-result
  task_id: PJR-BSCK
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-BSCK/pjr-bsck-20261120T155350Z-ea017f33/plan.md
  started_at: "2026-11-20T15:53:51.473Z"
  completed_at: "2026-11-20T23:11:37.168Z"
  agent: flash-high-executor
---

# Edit Result

## 1. 実施内容

- 対象9コマンド（`timeline where`・`timeline build`、`exec note`・`exec link`・`exec estimate`、`exec migrate-records`、`grade migrate`、`register migrate`、`config migrate-members`）に非推奨の警告と代わりの操作を出し、リファレンスとガイドを更新した。前回失敗した lint-md（個票 MD032）と test-integration（`where` 別名警告の期待値）を修正した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/guides/register-operation-guide.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/guides/timeline-design-guide.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+41 / -41 行
- `src/dashboard/timeline.ts`: 変更、+2 / -2 行
- `src/exec/commands.ts`: 変更、+34 / -2 行
- `src/exec/migrate-records.ts`: 変更、+8 / -1 行
- `src/grade/command-inspect.ts`: 変更、+8 / -1 行
- `src/register/maintenance-commands.ts`: 変更、+8 / -1 行
- `src/shared/specdojo-config.ts`: 変更、+7 / -1 行
- `src/shared/where-alias.ts`: 変更、+2 / -2 行
- `tests/src/commands/where.integration.test.ts`: 変更、+1 / -1 行

## 3. 申し送り

- 作業 No 3「次の版で消す」は 0.10.0 で行うため `open` のまま残した。消す前に、利用者のリポジトリとガイドでの使われ方をもう一度確かめる。
- CHANGELOG の文案は個票の「CHANGELOG に書く事項」にある。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
