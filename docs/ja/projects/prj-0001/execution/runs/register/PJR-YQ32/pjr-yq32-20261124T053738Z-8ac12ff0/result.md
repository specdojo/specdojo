---
specdojo:
  id: prj-0001:xer-pjr-yq32-20261124t053738z-8ac12ff0
  type: exec-result
  task_id: PJR-YQ32
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-YQ32/pjr-yq32-20261124T053738Z-8ac12ff0/plan.md
  started_at: "2026-11-24T05:37:39.428Z"
  completed_at: "2026-11-24T06:01:14.986Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- 同じ run 内の待ち合わせを保ち、準備失敗の予約を run 終了時に解放するよう修正しました。回帰テスト・設計文書・個票を更新し、sandbox 内の適用検査は成功しました。親検証は runner が再実行します。

## 2. 変更ファイル

- `docs/ja/product/040-system-design/sysd-critical-flows.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/guides/exec-operation-guide.md`: 変更、+4 / -4 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+1 / -1 行
- `src/exec/run/change-scope.ts`: 変更、+36 / -24 行
- `src/exec/run/register-mode.ts`: 変更、+10 / -1 行
- `src/exec/run/register-worktree.ts`: 変更、+1 / -0 行
- `src/exec/run/schedule-mode.ts`: 変更、+16 / -4 行
- `src/exec/run/shared.ts`: 変更、+1 / -0 行
- `tests/src/exec/run/change-scope.test.ts`: 変更、+68 / -0 行
- `tests/src/exec/run/human-task-skip.test.ts`: 変更、+117 / -3 行
- `tests/src/exec/run/track-filter.test.ts`: 変更、+45 / -15 行
- `src/exec/run/change-scope-state.ts`: 追加、+39 / -0 行
- `tests/src/exec/run/register-scope.test.ts`: 追加、+163 / -0 行

## 3. 申し送り

- schedule の準備失敗は失敗直後に解放せず、worker pool 終了時の `finally` で取り消す。`--unknown-scope serialize` の既存の待ち合わせを維持するためであり、既存テストの期待は変更していない。失敗戻り値・例外と loop 有無の4通りで、同じ run 内の待機、終了後の予約・lock 不在、次の run での実行を検査する。
- 再実行の準備失敗では以前の未統合予約を復元する。古い予約は schedule の todo または register の open で、exec worktree と予約 lock がない場合だけ回収する。状態・worktree を確認できない場合や heartbeat が止まった lock が残る場合は保持する。
- 単体テスト・型検査・lint など設定済みの親検証は、指示に従い executor では実行していない。前回失敗した `track-filter.test.ts` を含む親検証の再実行結果を確認する。
- 統合後に orchestrator が実 agent CLI を使う `exec smoke` を実行し、成功を確認してから close する。個票の該当作業行は理由付きで open のまま残した。
- CHANGELOG に書く事項（v0.10.0、不具合修正）: `exec run`（`--auto`・`exec cycle` を含む）の準備失敗で変更範囲の予約が残って後続を止める問題を修正。未着手で worktree と予約 lock のない古い予約も自動で回収する。
- 適用外の検証: `npm run validate:schema:file`（既存差分のイベント YAML は runner 管理の状態遷移記録であり、今回の成果物編集には含まれない。）
- 人の確認が必要: `exec smoke`（統合後に orchestrator が実 agent CLI を起動して確認する。）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
