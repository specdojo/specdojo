---
specdojo:
  id: prj-0001:xer-pjr-0we7-20261127t233018z-11c29a6a
  type: exec-result
  task_id: PJR-0WE7
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-0WE7/pjr-0we7-20261127T233018Z-11c29a6a/plan.md
  started_at: "2026-11-27T23:30:24.084Z"
  completed_at: "2026-11-27T23:42:10.724Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- watch-diagnosis.ts に中断回復・1 回限りの再診断・起動前の報告保存を実装し、watch-scan.ts に診断節の保持と原子的な報告更新を追加した。単体／統合の回帰テスト、Job実行設計、登録簿運用・exec設定ガイド、PJR-0WE7 個票を更新した。整形と残りの適用検査は成功。親指定の検査は runner に委ねた。

## 2. 変更ファイル

- `docs/ja/product/040-system-design/sysd-job-execution.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/guides/exec-config-guide.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/guides/register-operation-guide.md`: 変更、+5 / -3 行
- `src/exec/watch-diagnosis.ts`: 変更、+66 / -32 行
- `src/exec/watch-scan.ts`: 変更、+10 / -2 行
- `tests/src/commands/watch-diagnosis.integration.test.ts`: 変更、+145 / -1 行
- `tests/src/exec/watch-scan.test.ts`: 変更、+8 / -0 行

## 3. 申し送り

- 中断判定は既存の診断専用ロックの再取得を正本とした。PID の再利用を避け、所有者情報のない既存記録も回復する。初回と再診断は別ファイルに保持し、それぞれ起動した晩の上限に数える。再診断自体が中断しても 3 回目は起動しない。判断理由は個票の対応結果に記載済み。
- 親 runner の型検査・lint・単体／統合テストなどの成功を確認し、個票の作業内容 No.4 を更新すること。result の記入は reporter・runner が行う。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
