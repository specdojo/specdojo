---
specdojo:
  id: prj-0001:pjr-kvwh-routine-busy-skip-not-retried
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: waiting
  priority: medium
  difficulty: medium
  registered_at: "2026-11-13T14:08:02Z"
  block_reason: "parent validation failed: lint-mermaid, test-integration"
---

# PJR-KVWH routine が busy で skip した回を、空いた次の回で流し直さない

## 1. 課題内容

別の run が lock を持っていて skip した回も済んだと記録され、missed_run が latest でも流し直されない

## 2. 入力

- 2026-11-12〜13 の型の整備と夜間の実行で、orchestrator が手作業やシェルスクリプトで補った

## 3. 影響範囲

| 観点         | 影響                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| スコープ     | `src/routine/`（実行・状態・新しい `routine status`）、dashboard の due 判定、routine の運用ガイドとコマンドリファレンス |
| スケジュール | 夜間の routine が busy で skip した回を、orchestrator の手作業なしで次の `routine run --due` が拾う                      |
| コスト       | busy の間も毎時の `routine run --due` が委譲先を起動し直す（lock の確認だけで終わる）。上限は 24 回                      |
| 品質         | busy の回を済んだ回として記録しなくなり、`routine status` と履歴の `skip_reason` で skip の内訳が分かる                  |
| 関係者       | 夜間の routine を見る orchestrator と利用者                                                                              |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | routine は委譲先の終了コード 75 をすべて `skipped` とし、開始時に進めた `last_run`・`last_scheduled_for` をそのまま残していた。別の run の lock による skip（busy）と Job precondition の skip を区別せず、busy の回も済んだ回になっていた                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 対応策   | 委譲先の出力の `skipped: exec busy` で busy を判別し、busy の回は cron なら `last_scheduled_for` を開始前に戻し、interval なら `busy_skip_count` で次の回を due にする。履歴に `skip_reason` と `retry_pending` を残し、`routine status` を足す                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 依存事項 | exec run / resume の busy skip の出力 `[<command>] skipped: exec busy`（`src/exec/run/shared.ts`）に依存する                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 完了条件 | 別の run が lock を持っていて skip した回（結果が skipped）を済んだ回として記録しない。cron の routine で missed_run が `latest`・`all` のときは空いた次の `routine run --due` でその回を流し直し、interval の routine は次の回で due になる。skip が続いたときの扱い（上限・朝の報告での見せ方）は executor が決める。失敗の回を再試行しない扱いと missed_run が `skip` の扱いは変えない。skip した回を実行の履歴に残し、`routine status` で分かるようにする。skip の後の次の回で流し直されることを回帰テストで確かめる。迷った点は executor が決め、決めた内容と理由を個票の対応結果に書き、報告の `handoff` にも書く。`CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く（影響がなければ「なし」、PJR-EPQ3）。保護された設定（`.specdojo/`・`package.json`・`.agents/`・`.claude/`・`.codex/`・`lefthook.yml` など）は変えず、変更が要る場合は案を個票の対応結果と `handoff` に書く。`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。 |

## 5. 対応結果

### 5.1. 解決内容

- 別の run の lock による skip を、委譲先の出力 `[<command>] skipped: exec busy` で判別する（`isExecBusySkipOutput`）。Job precondition の skip も終了コード 75 を返すため、終了コードでは区別できない。
- `settleRoutineSkip` で skip の回の state を確定する。
  - cron で `missed_run` が `latest`・`all`（省略時を含む）の busy skip は、`last_scheduled_for` を開始前の値へ戻す。空いた次の `routine run --due` でその回が due になる。初回は値を消し、直近の回を due に残す。
  - interval の busy skip は `busy_skip_count` を正にし、`isRoutineEntryDue` が interval の経過を待たずに due とする。`routine list`・`routine run --due`・dashboard の due 判定はこの関数にそろえた。
  - `missed_run: skip` の cron、Job precondition の skip、失敗・部分成功・成功の回は従来どおり済んだ回とする。busy 以外の結果で `busy_skip_count` を消す。
- `missed_run: all` で同じ実行内に後の回が残る場合、busy の回より後は流さず次に回す（`deferred` と出力）。後の回だけ進めると `last_scheduled_for` が busy の回を越え、その回が流し直されないため。
- 実行の履歴 `routine-runs.jsonl` の各行に `skip_reason`（`busy` / `precondition`）と、流し直し待ちの `retry_pending: true` を残す。state には `last_skip_reason` と `busy_skip_count` を残す。
- `routine status [--id <routine-id>] [--limit <count>]` を足した。schedule・due・最終実行と skip の内訳・`last_scheduled_for`・busy skip の数・直近の履歴（skip の内訳と流し直し待ち）を表示する。
- 運用ガイドとコマンドリファレンスへ、busy skip の流し直しと `routine status` を書いた。

### 5.2. executor が決めた点

- 流し直しの上限は、続いた busy skip が 24 回（`ROUTINE_BUSY_RETRY_LIMIT`）。devcontainer の cron は毎時 `routine run --due` を呼ぶため、およそ 1 日ぶん試す。超えたらその回を済んだ回として扱い、`last_reason` と履歴の `reason` に `busy skip retry limit (24) reached; occurrence not retried` を残す。上限が無いと、lock が残り続けたときに `missed_run: all` の未処理の回が際限なく積もるため。
- 朝の報告（dashboard の routine 実行状況）の表示は変えない。busy の回は従来どおり `skipped` の行として出て、流し直した回は同じ `scheduled_for` の別の行として出る。内訳は `routine status` と履歴の `skip_reason` で確かめる。dashboard の行に内訳を出す変更は、表示の列を変えるため本件の範囲に含めなかった。
- 流し直す回は同じ `scheduled_for` で起動する。Job Run は同じ入力・実行枠の重複実行を防ぐため、配列 action で先の段が成功済みでも二重に実行されない。そのため、全体の結果が `skipped` で、いずれかの段が busy なら回ごと流し直す。全体の結果が `failure`・`partial` の回は流し直さない。
- `routine run --id` の手動実行が busy で skip した場合も同じく流し直し待ちにする。cron では `last_scheduled_for` を手動実行の前に戻すだけなので、定時の回の判定は手動実行が無かった場合と同じになる。
- busy の判別は exec 側の出力文言に依存する。exec 側に専用の marker を足すと変更範囲が exec に広がるため、既存の出力を使った。

### 5.3. 確認結果

- 回帰テスト（`tests/src/routine/execution.test.ts`）: cron `latest` で 09:00 の回が busy skip し、次の `routine run --due` で同じ 09:00 の回を流し直し、その次は流さないこと。interval で busy skip の次の `--due` が流し直すこと。Job precondition の skip は流し直さないこと。
- 単体テスト（`tests/src/routine/busy-skip.test.ts`）: busy 出力の判別、`settleRoutineSkip` の各場合（cron の戻し・初回・`missed_run: skip`・precondition・失敗・上限）、`isRoutineEntryDue`、`routine status` の表示。
- `npx vitest run tests/src/routine tests/src/dashboard` が通った。`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` は親の runner が実行する。

### 5.4. 再発防止策

- skip の内訳を state と履歴に残し、`routine status` で流し直し待ちを見えるようにした。

### 5.5. CHANGELOG に書く事項

- 区分: 不具合修正
- 文案: `routine` で、別の run が lock を持っていて skip した回を済んだ回として記録しないようにしました。cron の routine は `missed_run` が `latest`・`all` のとき空いた次の `routine run --due` でその回を流し直し、interval の routine は次の回で due になります。続いた busy skip が 24 回を超えたらその回を済んだ回として扱います。
- 区分: 追加機能
- 文案: `routine status` を追加しました。routine の状態、busy skip の流し直し待ち、skip の内訳（`busy` / `precondition`）つきの直近の実行履歴を表示します。

## 6. 関連ドキュメント

- [[specdojo:routine-operation-guide|routine 運用ガイド]]: busy skip の流し直しと `routine status` を追記した。
- [[specdojo:command-reference|CLI コマンドリファレンス]]: `routine status` を追記した。
