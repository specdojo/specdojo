---
specdojo:
  id: prj-0001:pjr-0158-exec-run-project-lock
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  completed_at: "2026-08-08T12:00:00Z"
  register_events:
    - v: 1
      id: reg_962cc7858bbcd14fdaec1a3698b4a93f
      ts: "2026-08-07T02:46:14Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "chore(register): PJR-0158 exec runにproject単位実行ロックとroutine busy-skipを起票"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: exec runにproject単位の実行ロックを追加しroutineのbusy-skipを実現
        - field: description
          from: ""
          to: "`exec run` プロセス同士（routine 起動・手動・CI）の重なりを止めるガードが無く、provider の `max_concurrency` は 1 プロセス内でしか効かないため、同時 agent 数とレートリミットが想定を超える。同一タスクの二重実行は claim が防ぐため正しさの問題ではなく、リソース統制の課題である。project 単位の実行ロックを `exec run` に導入し、routine は busy なら skip する運用に統一する。"
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: _TODO_
        - field: registered
          from: ""
          to: _TODO_
        - field: due
          from: ""
          to: _TODO_
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: 34c8c32d4cadba5c0dd2d27421a1e4a0ff72552b
    - v: 1
      id: reg_3454c574ad9bb148c6a20e7632607fc2
      ts: "2026-08-09T10:55:22Z"
      action: close
      actor: SpecDojo Test
      from_status: open
      to_status: done
      reason: "exec(register PJR-9P5Q): 既存登録項目を個票 frontmatter へ一括移行する"
      changes:
        - field: status
          from: open
          to: done
        - field: description
          from: "`exec run` プロセス同士（routine 起動・手動・CI）の重なりを止めるガードが無く、provider の `max_concurrency` は 1 プロセス内でしか効かないため、同時 agent 数とレートリミットが想定を超える。同一タスクの二重実行は claim が防ぐため正しさの問題ではなく、リソース統制の課題である。project 単位の実行ロックを `exec run` に導入し、routine は busy なら skip する運用に統一する。"
          to: exec run全体をproject単位のheartbeatロックで排他。--if-busy skip/wait/fail(手動fail/routine skip)。routine-state.jsonにlast_result=skippedを追加。retryは次のcron tickに委ね待機なし。
        - field: priority
          from: medium
          to: high
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
      previous_event_id: reg_962cc7858bbcd14fdaec1a3698b4a93f
    - v: 1
      id: reg_66879dd3d90965c2148cfc6064b6af37
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: completed
          from: "-"
          to: "2026-08-08"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_3454c574ad9bb148c6a20e7632607fc2
---

# PJR-0158 exec runにproject単位の実行ロックを追加しroutineのbusy-skipを実現

## 1. 概要

exec run全体をproject単位のheartbeatロックで排他。--if-busy skip/wait/fail(手動fail/routine skip)。routine-state.jsonにlast_result=skippedを追加。retryは次のcron tickに委ね待機なし。

`exec run` プロセス同士（routine 起動・手動・CI）の重なりを止めるガードが無く、provider の `max_concurrency` は 1 プロセス内でしか効かないため、同時 agent 数とレートリミットが想定を超える。同一タスクの二重実行は claim が防ぐため正しさの問題ではなく、リソース統制の課題である。project 単位の実行ロックを `exec run` に導入し、routine は busy なら skip する運用に統一する。

## 2. 完了条件

- `exec run` が project スコープの実行ロックを run 全体のライフタイムで保持し、他プロセスの `exec run` を排他する（同一プロセス内の `--parallel` は阻害しない）。
- ロックの stale 判定が固定 age ではなく heartbeat ベースで、長時間 run を stale 誤判定しない。crash 時は finally 解放と stale 奪取で回復する。
- `exec run` に `--if-busy <skip|wait|fail>` を追加し、手動 CLI の既定は `fail`、routine 経由は `skip` を渡す。
- routine の `exec-auto` / `exec-resume` / `register` action が busy 時に skip し、`[routine] skipped <id>: exec busy` をログする。
- `routine-state.json` の `last_result` に `skipped` を追加し、`routine list` で failure と区別して表示する。skip は failure 扱いにしない。
- retry は次の cron tick に委ね、単一 routine 実行内での待機は実装しない。

## 3. 作業内容

| No  | 作業                                                                  | 担当                    | 状態 | メモ                               |
| --- | --------------------------------------------------------------------- | ----------------------- | ---- | ---------------------------------- |
| 1   | project スコープの `exec-run.lock`（heartbeat/stale/finally解放）実装 | codex-expert-edit-agent | done | 既存 `scheduler.lock` とは別レイヤ |
| 2   | `exec run` に `--if-busy <skip\|wait\|fail>` 追加                     | codex-expert-edit-agent | done | 手動既定 fail                      |
| 3   | routine 各 action へ `--if-busy skip` 引き渡しと skip ログ            | codex-expert-edit-agent | done | `buildExecAutoArgs` 等             |
| 4   | `routine-state.json` `last_result` に `skipped` 追加・list 表示       | codex-expert-edit-agent | done | failure と区別して表示             |
| 5   | ガイド更新（exec-operation / exec-config / routine-operation）        | codex-expert-edit-agent | done | 排他モデルと `--if-busy` を記載    |
| 6   | テスト追加（ロック排他・skip 記録・list 表示）                        | codex-expert-edit-agent | done | vitest                             |

## 4. 対応結果

- `execution_path/exec/.locks/exec-run.lock` を追加し、所有トークン、別プロセス heartbeat、stale lock の rename 奪取、所有者一致時だけの解放を実装した。
- `exec run` と `exec resume` の実行全体を project 単位で排他し、`--if-busy skip|wait|fail`（既定 `fail`）を追加した。
- routine の `register` / `exec-auto` / `exec-resume` から `--if-busy skip` を渡し、busy 時に `[routine] skipped <id>: exec busy` を出力して `last_result: skipped` を記録するようにした。
- `routine list` が `(skipped)` を表示し、skip を failure 件数・終了コードに含めないことを実装した。
- [[specdojo:exec-operation-guide]]、[[specdojo:exec-config-guide]]、[[specdojo:routine-operation-guide]] に排他モデルと運用方法を反映した。
- ロック排他、wait、heartbeat、stale 回復、CLI busy 方針、routine 引数・表示のテストを追加した。

## 5. 関連ドキュメント

- [[specdojo:routine-operation-guide]]
- [[specdojo:exec-operation-guide]]
- [[specdojo:exec-config-guide]]
