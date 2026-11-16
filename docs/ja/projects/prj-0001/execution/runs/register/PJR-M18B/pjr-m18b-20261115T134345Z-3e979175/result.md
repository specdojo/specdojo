---
specdojo:
  id: prj-0001:xer-pjr-m18b-20261115t134345z-3e979175
  type: exec-result
  task_id: PJR-M18B
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-M18B/pjr-m18b-20261115T134345Z-3e979175/plan.md
  started_at: "2026-11-15T13:43:52.239Z"
  completed_at: "2026-11-15T15:31:25.324Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- review の前の grade を合計 3 回まで再試行するようにした。再試行しても失敗した場合と、verdict が grade-stale / grade-unavailable / changed-during-review の場合は、schedule の review タスクを done にせず blocked にし、理由と次の操作を block の理由と result の `block_reason` に残す。回帰テスト・review-guide・個票の対応結果も更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/review-guide.md`: 変更、+2 / -2 行
- `src/exec/run/in-place.ts`: 変更、+17 / -1 行
- `src/exec/run/schedule-prepare.ts`: 変更、+7 / -2 行
- `src/exec/run/schedule-task.ts`: 変更、+12 / -0 行
- `src/review/grade.ts`: 変更、+41 / -13 行
- `tests/src/review/grade.test.ts`: 変更、+64 / -4 行
- `src/exec/review-completion.ts`: 追加、+64 / -0 行
- `tests/src/exec/review-completion.test.ts`: 追加、+93 / -0 行

## 3. 申し送り

- 再試行の回数は合計 3 回（`REVIEW_GRADE_MAX_ATTEMPTS`）とした。形式の誤りは試行ごとにばらつき、grade は agent を呼ぶため回数を増やしすぎない。各試行は別の run ID（末尾 -a&lt;n&gt;）を使う。
- grade が失敗しても review の agent は実行し、完了の段（schedule-task の finalize と in-place の完了処理）で blocked にする。claim の前に止める案は変更が大きくなるため採らなかった。
- done にしない verdict は grade-stale に加え、同じく保留を表す grade-unavailable と changed-during-review も含めた。incomplete の扱いは変えていない。
- register の post-review と Job Run の review には判定を入れていない。これらの verdict を既に受け入れていないため。
- schedule の review タスク全体（runPreparedTask）を通す統合テストはない。判定は単体テストで、組み込みは型検査とコードの確認で確かめた。
- tests/src/exec/worktree-ops.integration.test.ts の grade 失敗ケースは、再試行が入ったので失敗するまでに 3 回起動する。各試行は別の run ID なので期待値は変わらない見込みだが、親 runner の test-integration の結果で確かめる必要がある。
- CHANGELOG に書く事項は個票の対応結果「CHANGELOG に書く事項」の節に書いた。CHANGELOG.md は変えていない。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
