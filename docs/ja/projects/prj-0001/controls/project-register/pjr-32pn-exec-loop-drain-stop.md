---
specdojo:
  id: prj-0001:pjr-32pn-exec-loop-drain-stop
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-25T11:11:06Z"
  due_on: "2026-12-31"
  completed_at: "2026-11-25T22:04:21Z"
  conclusion: exec stop で、走っているタスクを統合まで終えてからループを止め、列から再開できるようにした。
  derived_from:
    - PJR-0BGE
---

# PJR-32PN 動いている exec run --auto --loop を、走っているタスクを終えてから安全に止めるコマンドを足す

## 1. 概要

動いている `exec run --auto --loop` を、走っているタスクを壊さずに止めるコマンドを足す。新しいタスクは始めず、走っているタスクを統合まで終えてからループを抜ける止め方（drain）にする。設定の変更・feature ブランチの統合・dist の作り直しなどを、区切りで安全に行えるようにする。

## 2. 入力

- 利用者の問い（2026-11-25）: schedule を途中で安全に止めて設定を変えるコマンドは実装されているか
- 確かめた事実（2026-11-25）: exec queue cancel は次の段の前でしか止まらず、--max-rounds は起動時の値。SIGTERM で止めると走っていたタスクが途中で切れ、exec resume で手当てが要った。exec-defaults は起動時に 1 度だけ読まれる
- 利用者の判断（2026-11-25）: 担当は DEV、期限は 12 月末

## 3. 完了条件

- 止める指示のコマンドを足す。名前と引数は executor が決め、理由を個票の対応結果に書く。対象の run（project・track または予約の列）を指定できる。
- 指示を受けたループは、新しいタスクを claim せず、走っているタスクを統合（reporter と記帳を含む）まで終えてから抜ける。抜けた理由を exec の記録に残し、終了コードで「指示で止まった」ことが分かる。
- 予約の列から流している場合は、その段で止まる。同じ `exec queue run <queueId>` で、止めた段から再開できる。
- `exec status` と `exec queue status` で、止める指示を受けて走っている分を終えるのを待っている状態が分かる。
- 指示を取り消せる（抜ける前なら、ループはそのまま続く）。
- 走っていない run への指示や、二重の指示は、分かるメッセージで扱う。
- 統合テストで、走っているタスクが統合まで終わること、新しい claim が出ないこと、列から再開できることを確かめる。
- 利用者向けの文書（`command-reference`、exec の運用のガイド）に止め方を書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定に変更が要る場合は、案を個票の対応結果と報告の `handoff` に書き、反映は利用者の承認のもとで行う。
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。
- close の前に、実際の `exec run --auto --loop` を止めて再開し、動作を確かめる。

## 4. 作業内容

| No  | 作業                                                 | 担当 | 状態 | メモ                                                                                                                                       |
| --- | ---------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 止める指示の形と記録の設計                           | DEV  | done | `exec stop` と、指示（`exec/.locks/stop-requests/`）・走っている run の印（`exec/.locks/auto-runs/`）・止めた記録（`exec/stops/`）に決めた |
| 2   | ループと予約の列の実装とテスト                       | DEV  | done | `runBatchMode`・`exec cycle`・`runQueue` に組み込み、単体テストと統合テストを足した                                                        |
| 3   | 状態の表示と利用者向けの文書の更新                   | DEV  | done | `exec status` の `stop requests:`、`exec queue status` の `stop=requested`、`command-reference` と exec運用ガイドを更新した                |
| 4   | 実際の `exec run --auto --loop` を止めて再開する確認 | DEV  | open | 実 agent を起動し利用枠を使うため executor の sandbox では行えない。close の前に人か orchestrator が行う                                   |

## 5. 対応結果

### 5.1. 実施内容

- 止める指示のコマンドを `specdojo exec stop` とした。既存の `exec queue cancel`（取り消し）と区別し、「区切りで止める」操作を 1 つの名前にまとめるためである。対象は既定で project のすべての auto run、`--track <track>` でその track で起動した run、`--queue <queue-id>` で予約の列とその段の run を指定する。`--msg` を必須にし（`exec queue cancel` と同じ）、`--cancel` で取り消す。
- 指示は `exec/.locks/stop-requests/<対象>.json` に置く。`exec run --auto`（`--loop` を含む）と `exec cycle` の auto の段は、起動時に `exec/.locks/auto-runs/<pid>.json` を置き、各タスクの終わりの区切り（とタスクの準備の前）で指示を読む。指示を見た run は新しいタスクを claim せず、走っているタスクを統合と記帳まで終えてから抜ける。
- 抜けた run は `<execution_path>/exec/stops/<日時>-<対象>.json` に止めた記録（対象・理由・指示と停止の時刻）を残し、終了コード 76 で終わる。走っている間にタスクが失敗した場合は、失敗を隠さないよう 1 を返す。止めた記録は run の終わりの記帳の commit（PJR-DVNV）に含め、`exec validate` の配置検査の対象外に加えた。`exec cycle` は要約に `auto=stopped` を出して 76 で終わる。
- 予約の列は、指示があれば次の段の前で `stopped` になる。段が 76 で抜けた場合は失敗とせず `pending` に戻すため、`--step-continue` の段も飛ばされず、同じ `exec queue run <queue-id>` で止めた段から再開する。列の runner は子プロセスへ `SPECDOJO_EXEC_QUEUE_ID` を渡し、段の auto run が `--queue` の指示に従えるようにした。
- `exec status` の末尾に `stop requests:` を足し、指示を見た run が終わりを待っているタスクを `draining: no new tasks; waiting for <n> running task(s) (<task-id>)` と出す。`exec queue status` は `stop=requested (<理由>)` を出す。
- 取り消しは指示のファイルを消す。抜ける前の run は次の区切りで指示が消えたことを出し（`stop request ... withdrawn — continuing`）、claim を再開する。
- 走っている run（列なら列の runner）がない対象への指示は `Nothing to stop: ...`、二重の指示は `A stop request ... already exists ... Withdraw it with exec stop --cancel`、指示のない対象の取り消しは `No stop request for ...` で、どれも終了コード 1 で拒否する。run より前に残った project・track の指示は、次の run の起動時に警告を出して捨てる。
- 統合テスト `tests/src/exec/run/auto-run-stop.integration.test.ts` で、走っているタスクが統合まで終わること、新しい claim が出ないこと、`exec status` の待ちの表示、取り消し後の続行、track 指定、列の段での停止と同じ `runQueue` での再開を確かめた（agent の起動と統合の段はテスト用に置き換えている）。単体テストは `tests/src/exec/stop-request.test.ts` と `tests/src/exec/queue.test.ts` に足した。
- 利用者向けの文書は [[specdojo:command-reference|コマンドリファレンス]] の「走っている run を区切りで止める（exec stop）」と、[[specdojo:exec-operation-guide|exec運用ガイド]] の「走っている自動実行を区切りで止める」に書いた。
- 保護された設定の変更は要らなかった。

### 5.2. 変更ファイル

- `src/exec/stop-request.ts`（新規）・`src/exec/stop-command.ts`（新規）
- `src/exec/run/schedule-mode.ts`・`src/exec/run/lifecycle-commands.ts`・`src/exec/queue.ts`・`src/exec/queue-command.ts`・`src/exec/commands.ts`・`src/exec/trailing-records.ts`・`src/exec/validate-records.ts`
- `tests/src/exec/stop-request.test.ts`（新規）・`tests/src/exec/run/auto-run-stop.integration.test.ts`（新規）・`tests/src/exec/queue.test.ts`・`tests/src/exec/trailing-records.integration.test.ts`
- `docs/ja/specdojo/references/command-reference.md`・`docs/ja/specdojo/guides/exec-operation-guide.md`

### 5.3. CHANGELOG に書く事項

- 区分: Added
- 行の文案: `exec stop` を追加しました。走っている `exec run --auto`（`--loop`）・`exec cycle`・予約の列に、新しいタスクを claim せず、走っているタスクを統合まで終えてから止まるよう指示できます（`--track`・`--queue` で対象を絞り、`--cancel` で取り消し）。止まった run は終了コード 76 で終わり、予約の列は同じ `exec queue run` で止めた段から再開します。

### 5.4. 残課題

- 完了条件の「close の前に、実際の `exec run --auto --loop` を止めて再開し、動作を確かめる」は、実 agent の起動と利用枠を要するため executor では行っていない（作業内容の 4 行目）。手順は exec運用ガイドの「走っている自動実行を区切りで止める」に従い、`exec stop` → `exec status` で `draining` を確かめる → 終了コード 76 → 起動し直し（列なら同じ `exec queue run`）の順に確かめる。
- 指示は区切りで読むため、`--parallel` の枠がすべて走っている間は、どれかのタスクが終わるまで run は指示を見ない（`exec status` には `requested: applies at the next scheduling point` と出る）。`exec cycle` の auto の段より前（再開・index・refresh の段）にいる間は、auto run の印がまだないため指示は `Nothing to stop` で拒否される。
- 予約の列の runner が書いた止めた記録（`exec/stops/`）と予約ファイルは、列の runner 自身は commit しない。次の run の記帳の commit か、利用者・orchestrator の commit で入る。

## 6. 関連ドキュメント

- [[specdojo:command-reference|コマンドリファレンス]]（「走っている run を区切りで止める（exec stop）」「実行の予約（exec queue）」）
- [[specdojo:exec-operation-guide|exec運用ガイド]]（「走っている自動実行を区切りで止める」）
