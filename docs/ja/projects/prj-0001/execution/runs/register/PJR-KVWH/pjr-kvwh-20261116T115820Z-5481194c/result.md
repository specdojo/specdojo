---
specdojo:
  id: prj-0001:xer-pjr-kvwh-20261116t115820z-5481194c
  type: exec-result
  task_id: PJR-KVWH
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-KVWH/pjr-kvwh-20261116T115820Z-5481194c/plan.md
  started_at: "2026-11-16T12:00:04.223Z"
  completed_at: "2026-11-16T12:45:45.271Z"
  agent: opus-executor
  block_reason: "parent validation failed: lint-mermaid, test-integration"
---

# Edit Result

## 1. 実施内容

- routine が別の run の lock で busy skip した回を済んだ回として記録しないよう修正した。cron の `missed_run` が latest・all のときは `last_scheduled_for` を開始前の値へ戻し、次の `routine run --due` でその回を流し直す。interval は `busy_skip_count` が正の間 due になる。
- 流し直しの上限は続いた busy skip 24 回とし、履歴に `skip_reason` と `retry_pending` を残す。`routine status` を追加した。
- 回帰テストと単体テストを追加し、ガイドとリファレンスを更新した。executor の検証（vitest 141 件、tsc、markdownlint など）は通過した。
- runner の検証では `lint:mermaid` がタイムアウトで failed になった。`test:integration` も exit 1 で failed になり、`tests/src/commands/git.integration.test.ts` の1件が 30000ms でタイムアウトしている。いずれも evidence の出力は一部省略されている。この変更との関係は evidence からは判断できない。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/routine-operation-guide.md`: busy skip した回の流し直しの挙動、上限、`routine status` の使い方をガイドに追記した。
- `docs/ja/specdojo/references/command-reference.md`: `routine status` コマンドと、流し直しに関する説明をリファレンスに追加した。
- `src/dashboard/routines.ts`: busy skip の履歴項目（`skip_reason`、`retry_pending`）に合わせて dashboard 側の routine 実行状況の処理を調整した。表示自体は変えていない。
- `src/routine/definition.ts`: 流し直し上限 `ROUTINE_BUSY_RETRY_LIMIT`（24）と、busy skip の状態を扱う定義を追加した。
- `src/routine/routine.ts`: busy skip の判別を実装した。cron の `missed_run` が latest・all のときは `last_scheduled_for` を元に戻し、interval は `busy_skip_count` で due 判定する。上限到達時は済んだ回として理由を残す。
- `tests/src/routine/execution.test.ts`: busy skip の回帰テストを追加した。busy の回が済んだ回として記録されず、流し直されることを検証する。
- `src/routine/status.ts`: 新規ファイル。`routine status` で busy skip の流し直し待ちの内訳を出力する処理を追加した。
- `tests/src/routine/busy-skip.test.ts`: 新規ファイル。busy skip の判別、流し直しの上限、`routine status` の出力を検証する単体テストを追加した。

## 3. 申し送り

- runner 検証の `npm run lint:mermaid`（タイムアウト）と `npm run test:integration`（`git.integration.test.ts` の1件が 30000ms でタイムアウト）が failed になっている。再実行して、この変更が原因かを確認する必要がある。evidence の出力は一部省略されている。
- 流し直しの上限を、続いた busy skip 24 回（`ROUTINE_BUSY_RETRY_LIMIT`）に決めた。毎時の `routine run --due` でおよそ 1 日ぶん試す。超えたらその回を済んだ回とし、`last_reason` と履歴の `reason` に上限到達を残す。
- 朝の報告（dashboard の routine 実行状況）の表示は変えていない。busy の回は `skipped` の行のままで、内訳は `routine status` と履歴の `skip_reason` で確かめる。dashboard に内訳の列を出すかは別の項目で判断する。
- busy の判別は exec の出力 `[&lt;command&gt;] skipped: exec busy`（`src/exec/run/shared.ts`）に依存する。この文言を変えるときは `isExecBusySkipOutput` も合わせて変える。
- 配列 action は全体の結果が `skipped` で、いずれかの段が busy なら同じ `scheduled_for` で回ごと流し直す。Job Run の重複実行の防止を前提にしている。`routine run --id` の手動実行が busy で skip した場合も流し直し待ちにする。
- CHANGELOG の文案（不具合修正・追加機能の 2 件）は、個票の対応結果「CHANGELOG に書く事項」にある。CHANGELOG.md と保護された設定は変えていない。

## 4. 進め方

routine 実行時に、exec が出力する busy の skip を判別する。busy skip なら `last_scheduled_for` を開始前の値に戻し、履歴に `skip_reason` と `retry_pending` を記録する。次の `routine run --due` でその回を流し直し、続いた busy skip が24回に達したら済んだ回とみなす。`routine status` を追加して内訳を確認できるようにし、テストとドキュメントを更新した。
