---
specdojo:
  id: prj-0001:pjr-p8sx-parallel-validation-slot-held
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: high
  registered_at: "2026-11-25T09:21:32Z"
---

# PJR-P8SX 並列実行で親の検証の枠が、他タスクの統合に止められて長く占有される

## 1. 課題内容

`exec run --auto --parallel 4` で全件レビュー（PJR-0BGE）を流すと、1 件のタスクがちょうど 4 分おきにしか終わらず、並列度を上げても速くならない。

- 親の検証の枠（`parent_validation_concurrency: 1`）を 1 件が約 4 分持ち続ける。内訳は `validate-schema` が毎回約 190 秒、`lint-md-changed` などの lint が約 40 秒（`parent-validation-metrics.jsonl`、2026-11-25 01:54〜03:33 の 25 件）。
- 同じ `npm run validate:schema` の各段を task の worktree で直接流すと、合わせて約 5 秒で終わる。親のリポジトリで流しても約 23 秒。
- 同じ時間帯に、他のタスクの統合の commit が約 53 秒おきに 3 回ずつ並ぶ（commit の hook の時間）。
- 見立て: 1 つのプロセスで並べて流すため、他のタスクの統合（spawnSync の git commit と hook）がイベントループを止め、検証の子プロセスが終わっても runner が気づくのが遅れて、枠を手放せない。PJR-6690 で直したパイプ詰まりと同じ種類の残り。見立ては計測で確かめる。

## 2. 入力

- 利用者の判断（2026-11-25）: 全件レビューの区切りまでは設定も runner も変えずに流し、原因は issue として起票して後で直す

## 3. 影響範囲

- 並列実行の処理量が、1 時間に約 15 件で頭打ちになる。全件レビュー（515 件）では、agent に余裕があっても残りに 1 日以上かかる。
- 並列度を上げると統合の回数が増え、かえって遅くなるおそれがある。
- 親の検証を使う exec run のすべて（register・track）にかかわる。

## 4. 対応方針

- 全件レビューの区切りまでは設定も runner も変えずに流す（利用者の判断、2026-11-25）。
- 枠を持っている間の時間を計測で分ける（子プロセスの実際の時間と、runner が気づくまでの遅れ）。
- 遅れが確かめられたら、統合などの同期の処理が検証の終わりの検出を止めないように直す。直し方は executor に決めさせ、理由を個票の対応結果に書かせる。
- 直した後に `exec run --auto --parallel 4` を流し、検証の時間が直接流した場合と近くなることを確かめてから close する。
- 2 回目の実行（2026-11-25 夜）: 1 回目で足した計測（`validation-exit-timing`）は残し、直しまで行う。見立ての裏付けは次の実測で足りるとし、実際の並列実行での再計測は待たない（オーケストレーターが close の前に流して確かめる）。
  - 2026-11-25 01:54〜03:33 の 25 件で、runner の中の `validate-schema` は毎回 約 180〜230 秒、`lint-md-changed` などは約 40 秒だった（`parent-validation-metrics.jsonl`）。
  - 同じ `npm run validate:schema` の各段を task の worktree で直接流すと合わせて約 5 秒、`lint` 系は数秒だった。
  - 同じ時間帯に、他のタスクの統合の commit（hook を含む）が約 53 秒おきに 3 回ずつ並んでいた。
  - 直し: 統合・準備などで使う同期の子プロセス（`spawnSync` の git の commit・merge、`npm ci`、`specdojo build` など）が、別のタスクの親の検証の終わりの検出を止めないようにする。方法（非同期の子プロセスに変える、検証を別のプロセスで待つなど）は executor が決め、理由を個票の対応結果に書く。挙動（記録・commit の順序・ロック）は変えない。
  - 直しを確かめる単体テストまたは統合テスト（別のタスクの同期の処理が長く続いても、検証の終わりがその分遅れて記録されないこと）を足す。
  - 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。`CHANGELOG.md` は変えず、個票の対応結果に「CHANGELOG に書く事項」の小節を作って文案を書く。

## 5. 対応結果

計測の追加（1 回目）と、統合の commit を event loop を止めない起動にする直し（2 回目）を行った。実際の並列実行での確認は、close の前にオーケストレーターが行う。

### 5.1. 見立ての裏付け

既存の計測（`T-KATA-REVIEW-ALL-utc-sample-150` の `parent-validation-metrics.jsonl`）と統合の commit の時刻を突き合わせた。

- `validate-schema` は 03:17:58Z に始まり 03:21:07Z に終わった（約 190 秒）。その間に、他のタスク（`otp-sample-150`）の統合の commit が 03:18:24Z・03:19:16Z・03:20:11Z に並ぶ。
- 同時に流した 4 本の lint の終わりが、すべて 03:17:43.90Z〜.91Z の 10 ms 内に並ぶ。直前の 03:17:41Z に別タスクの `prepare execution` の commit がある。event loop が止まり、明けた時点でまとめて気づいた形である。
- load average は約 1 で、検証の子が遅くなる要因は見当たらない。

### 5.2. 実施内容

- 計測（1 回目）: 親の検証ごとに `validation-exit-timing` を `parent-validation-metrics.jsonl` へ出す。項目は `duration_ms`（spawn から runner が終わりを処理するまで）、`last_output_ms`（子が最後に出力を書いた時刻まで。出力ファイルの mtime から取る）、`detection_lag_ms`（その差）、`event_loop_delay_max_ms`（検証中に event loop が止まった最長の時間）。計測の処理は `src/exec/validation-exit-timing.ts` に分けた。
- 非同期の git（2 回目）: `gitResultAsync` を足した（`src/shared/git.ts`）。引数・環境・index.lock などの再試行は `gitResult` と同じで、再試行の判断を同期版と共有する関数（`gitTransientRetryPolicy`）に分け、待ち方だけを変えた。
- 統合の commit（2 回目）: `commitWorktreeChangesAsync`・`stabilizeCommitTargetsAsync`・`commitRegisterStateAsync` を足し、hook を走らせる `git commit`（`apply task changes` と review の記帳）と hook の後の `--amend` だけを非同期に待つ。commit の前の検査・stage と後の検査は同期版と同じ関数を使う。exec run の統合段（`src/exec/run/schedule-task.ts`・`src/exec/run/register-worktree.ts`）をこれに切り替えた。手動の `exec worktree commit` は同期版のまま。
- 統合の排他（2 回目）: `integrateTaskRepositories` を非同期にし、`beforeProjectMerge` に非同期の処理を渡せるようにした。同じ process のタスクの統合を 1 件ずつに保つ `withTaskIntegrationLock`（`src/exec/repo-integration.ts`）を足し、統合の前後の HEAD の取得と統合をその内側に置いた。`checkProject` から `mergeProject` までの間に他のタスクの merge は入らない。root への merge の commit は同期のまま排他の内側にある。

直し方を選んだ理由:

- 検証を別のプロセスで待つ案は取らなかった。終わりに気づいても、同期の commit で止まった親の event loop は次の検証を始められず、枠の回転は速くならない。止まりそのものを無くす必要がある。
- 1 タスクで約 160 秒（約 50 秒の commit が 3 回）止まる統合の commit が、枠の占有（約 240 秒）の大半を説明する。hook を走らせる commit だけを非同期にすれば、記録・commit の順序・ロックを変えずに止まりの大半を取り除ける。`npm ci`・`specdojo build`・root への merge など他の同期の処理は、今回の計測で目立たないため残した。

テスト:

- `tests/src/exec/parent-validation-output.integration.test.ts`: 別のタスクの commit の hook が 3 秒走る間も、検証の終わりが遅れず記録されること（`detection_lag_ms` と `event_loop_delay_max_ms` が 1 秒未満）。event loop を止めたときに遅れが記録されることも確かめる（1 回目）。
- `tests/src/exec/repo-integration.test.ts`: `withTaskIntegrationLock` が後の統合を前の統合の終わりまで待たせ、失敗しても排他を解くこと。
- `tests/src/shared/git.test.ts`: `runGitWithTransientRetryAsync` が同期版と同じ間隔で index.lock の取り合いを再試行すること。
- `tests/src/exec/task-repos.integration.test.ts`: `integrateTaskRepositories` の非同期化に合わせて呼び出しを `await` にした。
- `tests/src/exec/parent-validation.test.ts`: `validationExitTiming` の単体テスト（1 回目）。
- `tests/src/exec/parent-validation-timeout.integration.test.ts`: 時間内に終わった検証では、停止の記録が出ず `validation-exit-timing` の 1 行だけが出ることを確かめる形に改めた。計測を毎回出すようになり、以前の「記録が空」の期待と合わなくなったため。

### 5.3. 残る確認

- オーケストレーターが本変更を入れた runner で `exec run --auto --parallel 4` を流し、`validation-exit-timing` の `detection_lag_ms` が小さく、検証の時間が直接流した場合（`validate:schema` は約 5〜23 秒）に近くなることを確かめてから close する。
- 統合の commit の hook が走る間、同じ process の別タスクの同期の処理（`prepare execution` の commit、register の遷移など）が root を変えうる。root への merge は `mergeWorktreeIntoCurrent` が自分の検査（stage 済みの変更など）をしてから行うため、壊れる経路は見当たらない。実際の並列実行で統合の失敗が増えないかもあわせて見る。

### 5.4. CHANGELOG に書く事項

- `exec run --parallel` の統合段で、commit の hook が走る間 runner の処理が止まらないようにした。別のタスクの親の検証が終わったのに、検証の枠を長く手放せなかった問題を直す（PJR-P8SX）。
- 親の検証ごとに、枠を持った時間を子の時間と runner が気づくまでの遅れに分けて `parent-validation-metrics.jsonl` へ記録する（`validation-exit-timing`）。

## 6. 関連ドキュメント

- [[prj-0001:pjr-6690-schema-hang]]（パイプ詰まりの修正。検証の出力をファイルへ書かせた前例）
- [[prj-0001:pjr-0bge-kata-review-all]]（全件レビュー。本件を観測した実行）
