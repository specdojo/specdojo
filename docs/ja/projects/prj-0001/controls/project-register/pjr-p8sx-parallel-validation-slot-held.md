---
specdojo:
  id: prj-0001:pjr-p8sx-parallel-validation-slot-held
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: waiting
  priority: high
  registered_at: "2026-11-25T09:21:32Z"
  block_reason: "executor reported incomplete: 親の検証ごとに、検証を終えるまでの時間を `duration_ms`（全体）、`last_output_ms`（子の時間）、`detection_lag_ms`（runner が気づくまでの遅れ）、`event_loop_delay_max_ms`（処理が止まった最長の時間）に分けて記録する `validation-exit-timing…"
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

未解決。計測の追加までを行い、直す処理は計測の後に回した（対応方針の順序のとおり）。

完了条件の仮説: 枠を持つ時間を「子プロセスの実際の時間」と「runner が気づくまでの遅れ」に分けて記録できること。遅れが確かめられたら、統合の同期の処理が検証の終わりの検出を止めないように直し、`exec run --auto --parallel 4` で検証の時間が直接流した場合に近くなることを確かめること。

既存の計測（`T-KATA-REVIEW-ALL-utc-sample-150` の `parent-validation-metrics.jsonl`）と統合の commit の時刻を突き合わせた結果は次のとおり。

- `validate-schema` は 03:17:58Z に始まり 03:21:07Z に終わった（約 190 秒）。その間に、他のタスク（`otp-sample-150`）の統合の commit が 03:18:24Z・03:19:16Z・03:20:11Z に並ぶ。終わりの記録はその後の同期の処理が明けた時刻に出ている。
- 同時に流した 4 本の lint（`lint-md-changed` など）の終わりが、すべて 03:17:43.90Z〜.91Z の 10 ms 内に並ぶ。直前の 03:17:41Z に別タスクの `prepare execution` の commit がある。子はそれぞれ別の時刻に終わるはずなので、event loop が止まっていて、明けた時点でまとめて気づいた形である。
- 負荷は load average 約 1 で、検証の子が遅くなる要因は見当たらない。
- 以上から見立て（他のタスクの統合の spawnSync が event loop を止め、終わりの検出が遅れる）は確からしいが、子の実際の時間は記録が無く、まだ数値で分けられていない。

実施内容:

- 親の検証ごとに `validation-exit-timing` の計測を `parent-validation-metrics.jsonl` へ出すようにした（`src/exec/parent-validation.ts`）。項目は `duration_ms`（spawn から runner が終わりを処理するまで）、`last_output_ms`（spawn から子が最後に出力を書いた時刻まで）、`detection_lag_ms`（その差）、`event_loop_delay_max_ms`（検証中に event loop が止まった最長の時間）。
- 子の最後の書き込み時刻は、出力ファイルの mtime から取る（`ValidationOutputFiles.lastWriteAt`、`src/exec/parent-validation-output.ts`）。出力はファイルなので、event loop が止まっていても kernel が mtime を進める。
- event loop の止まりは、unref した 20 ms の interval の間隔で測る。止まりが明けた同じ周回で検証の終わりを処理する場合に備え、止めた時点で開いている間隔も含める。`monitorEventLoopDelay` では、この場合に記録が 0 になることを確かめた。
- テスト: `validationExitTiming` の単体テスト（`tests/src/exec/parent-validation.test.ts`）と、event loop を 3 秒止めたときに `detection_lag_ms` と `event_loop_delay_max_ms` が記録される統合テスト（`tests/src/exec/parent-validation-output.integration.test.ts`）を足した。

直し方の案（計測で遅れを確かめた後に行う）:

- 統合の commit（task worktree での `apply task changes` の commit と、hook の後の `--amend`）を、hook が走る間 event loop を止めない非同期の起動にする。1 回約 50 秒の commit が 1 タスクにつき 3 回あり、合わせて約 160 秒止まる。これが検証の枠の占有時間（約 240 秒）の大半を説明する。
- 非同期にすると、これまで同期だったことで暗黙に保たれていたタスク間の統合の直列が崩れる。`integrateTaskRepositories` の `checkProject` と `mergeProject` の間に他のタスクの merge が入らないよう、process 内の統合の排他を明示する必要がある。root への merge の commit は排他の内側に残す。
- 呼び出し元は `src/exec/run/schedule-task.ts`・`src/exec/run/register-worktree.ts`・`src/exec/worktree-command.ts` と結合テストで、`commitWorktreeChanges` と `integrateTaskRepositories` の `beforeProjectMerge` の非同期化が及ぶ。

次のアクション:

1. 本変更を入れた runner で `exec run --auto --parallel 4` を流し、`validation-exit-timing` の `detection_lag_ms` と `event_loop_delay_max_ms` が統合の commit の時間に近いことを確かめる。
2. 確かめられたら、上の案で統合の commit を非同期にする（別の実行で行う）。
3. 直した後に `exec run --auto --parallel 4` を流し、検証の時間が直接流した場合に近くなることを確かめてから close する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-6690-schema-hang]]（パイプ詰まりの修正。検証の出力をファイルへ書かせた前例）
- [[prj-0001:pjr-0bge-kata-review-all]]（全件レビュー。本件を観測した実行）
