---
specdojo:
  id: prj-0001:xer-pjr-aar2-20260823t001957z-cec8
  type: exec-result
  task_id: PJR-AAR2
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-aar2-20260823T001957Z-cec8-plan.md
  started_at: "2026-08-23T00:19:58.193Z"
  completed_at: "2026-08-23T00:30:39.642Z"
  agent: codex-expert-executor
---

# Edit Result

## 1. 実施内容

- sch-milestones.yaml の status が最後に build したトラックの strategy に引きずられる不具合を修正し、既存 status を保持したまま新規トラックのみ draft を初期値とする実装に変更した。
- src/schedule.ts と src/schedule-build.ts を修正し、schedule build 実行時に doc.status を対象トラックの strategy.status で無条件上書きしないようにした。
- tests/src/schedule-command.test.ts に既存 status 保持・新規 draft 作成を検証するテストケースを追加した。
- docs/ja/specdojo/guides/schedule-design-guide.md に status の扱いに関する設計上の補足を追記した。
- 個票 pjr-aar2-milestones-status-follows-last-built-track.md を作業内容に基づき更新した。
- dry-run 実行で draft の planning strategy を build しても既存 sch-milestones の ready が保持されることを確認した。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/controls/project-register/pjr-aar2-milestones-status-follows-last-built-track.md`: 個票の作業内容・対応結果セクションを実施内容に基づき更新した。
- `docs/ja/specdojo/guides/schedule-design-guide.md`: sch-milestones の status を strategy から切り離す設計方針を2行追記した。
- `src/schedule-build.ts`: schedule build 呼び出し箇所で status 上書き処理の呼び出し方を修正した（1行変更）。
- `src/schedule.ts`: doc.status を対象トラックの strategy.status で無条件上書きしていた処理を削除・修正し、既存 status を保持しつつ新規ドキュメントは draft を初期値とするロジックに変更した（11行変更）。
- `tests/src/schedule-command.test.ts`: 既存 status 保持・新規トラックの draft 初期化を検証するテストケースを追加した（66行追加）。

## 3. 申し送り

- executor は sandbox 上で `npm run test:unit` がフルスイート実行時に Vitest worker が残留し完走しなかったが、原因は sandbox 環境制約であり、関連する tests/src/schedule-command.test.ts と tests/src/doc-index.test.ts を個別実行し36テストとも成功していることを確認済み。
- 親 runner による `npm run test:integration`（runner validation, test-integration）は passed で完了している。
- `npx tsx src/specdojo.ts register build` は sandbox の tsx IPC ソケット制約で EPERM となったため、`node --import tsx` を用いた同等コマンドで register build / catalog validate / index build を代替実行し成功している。

## 4. 進め方と実践の型の適用

sch-milestones.yaml の集約 status がトラック単位の strategy.status に引きずられる不具合について、src/schedule.ts / src/schedule-build.ts の status 決定ロジックを変更し、build のたびに strategy.status で無条件上書きするのではなく、既存ドキュメントの status を保持し新規作成時のみ draft を初期値とする方式に修正した。テストを追加し、typecheck・関連 unit test・dry-run 実行による目視確認・親 runner の test:integration ですべて成功を確認した。
