---
specdojo:
  id: prj-0001:xer-pjr-m18b-20261115t134345z-3e979175
  type: exec-result
  task_id: PJR-M18B
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-M18B/pjr-m18b-20261115T134345Z-3e979175/plan.md
  started_at: "2026-11-15T13:43:52.239Z"
  completed_at: "2026-11-15T14:04:54.393Z"
  agent: opus-executor
  block_reason: "parent validation failed: validate-schema"
---

# Edit Result

## 1. 実施内容

- review の前の grade を合計 3 回まで再試行するように改修した。
- 再試行後も失敗した場合、および verdict が `grade-stale` / `grade-unavailable` / `changed-during-review` の場合は、review タスクを `done` にせず `blocked` に変更し、理由を記録する仕組みを導入した。
- 再試行ロジックの実装に伴い、`src/exec/run/in-place.ts`、`src/exec/run/schedule-prepare.ts`、`src/exec/run/schedule-task.ts`、`src/review/grade.ts` および関連するテストコード、ならびに `docs/ja/specdojo/guides/review-guide.md` を更新した。
- 新たに `src/exec/review-completion.ts` を作成し、レビュー完了判定のロジックを分離した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/review-guide.md`: grade の再試行および `blocked` 判定に関する記述を追加した。
- `src/exec/run/in-place.ts`: `grade` の結果を受けて `blocked` 判定を行うための処理を組み込んだ。
- `src/exec/run/schedule-prepare.ts`: タスク実行の準備プロセスにおける `grade` 再試行の検討事項として更新した。
- `src/exec/run/schedule-task.ts`: タスク完了判定のロジックにおいて、`grade` の結果に基づく `blocked` 遷移をサポートするように更新した。
- `src/review/grade.ts`: 再試行回数の定数管理や判定ロジックの変更に対応した。
- `tests/src/review/grade.test.ts`: `grade` の再試行を含むテストケースを追加した。
- `src/exec/review-completion.ts`: レビュー完了時の状態判定（`done` か `blocked` か）を行う新しいモジュールを実装した。
- `tests/src/exec/review-completion.test.ts`: `review-completion.ts` の判定ロジックを検証するためのテストを追加した。

## 3. 申し送り

- 再試行の回数は合計 3 回（`REVIEW_GRADE_MAX_ATTEMPTS`）とした。形式の誤りは試行ごとにばらつき、grade は agent を呼ぶため回数を増やしすぎない。各試行は別の run ID（末尾 `-a&lt;n&gt;`）を使う。
- grade が失敗しても review の agent は実行し、完了の段（`schedule-task` の `finalize` と `in-place` の完了処理）で `blocked` にする。claim の前に止める案は変更が大きくなるため採らなかった。
- done にしない verdict は `grade-stale` に加え、同じく保留を表す `grade-unavailable` と `changed-during-review` も含めた。incomplete の扱いは変えていない。
- register の post-review と Job Run の review には判定を入れていない。これらの verdict を既に受け入れていないため。
- schedule の review タスク全体（`runPreparedTask`）を通す統合テストはない。判定は単体テストで、組み込みは型検査とコードの確認で確かめた。
- tests/src/exec/worktree-ops.integration.test.ts の grade 失敗ケースは、再試行が入ったので失敗するまでに 3 回起動する。各試行は別の run ID なので期待値は変わらない見込みだが、親 runner の `test-integration` の結果で確かめる必要がある。
- CHANGELOG に書く事項は個票の対応結果「CHANGELOG に書く事項」の節に書いた。CHANGELOG.md は変えていない。
- 再試行の回数は合計 3 回（`REVIEW_GRADE_MAX_ATTEMPTS`）とした。形式の誤りは試行ごとにばらつき、grade は agent を呼ぶため回数を増やしすぎない。各試行は別の run ID（末尾 -a&lt;n&gt;）を使う。
- grade が失敗しても review の agent は実行し、完了の段（schedule-task の finalize と in-place の完了処理）で blocked にする。claim の前に止める案は変更が大きくなるため採らなかった。
- done にしない verdict は grade-stale に加え、同じく保留を表す grade-unavailable と changed-during-review も含めた。incomplete の扱いは変えていない。
- schedule の review タスク全体（runPreparedTask）を通す統合テストはない。判定は単体テストで、組み込みは型検査とコードの確認で確かめた。
- tests/src/exec/worktree-ops.integration.test.ts の grade 失敗ケースは、再試行が入ったので失敗するまでに 3 回起動する。各試行は別の run ID なので期待値は変わらない見込みだが、親 runner の test-integration の結果で確かめる必要がある。

## 4. 進め方

まず、`grade` の失敗に対する耐性をつけるために、最大試行回数による再試行ロジックを検討した。次に、再試行が尽きた場合や、特定の `verdict`（`grade-stale` 等）が得られた場合に、タスクを `done` ではなく `blocked` として扱うためのロジックを実装した。判定ロジックの複雑化を防ぐため、`src/exec/review-completion.ts` を新たに作成して状態遷移の判定をそこに集約した。最後に、既存の実行フロー（`in-place` や `schedule-task`）からこの新しい判定モジュールを呼び出すように変更し、ユニットテストによって期待通りの `blocked` 判定が行われることを確認した。
