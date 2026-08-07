---
specdojo:
  id: prj-0001:pjr-0158-exec-run-project-lock
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0158 exec runにproject単位の実行ロックを追加しroutineのbusy-skipを実現

## 1. 概要

`exec run` プロセス同士（routine 起動・手動・CI）の重なりを止めるガードが無く、provider の `max_concurrency` は 1 プロセス内でしか効かないため、同時 agent 数とレートリミットが想定を超える。同一タスクの二重実行は claim が防ぐため正しさの問題ではなく、リソース統制の課題である。project 単位の実行ロックを `exec run` に導入し、routine は busy なら skip する運用に統一する。

## 2. 完了条件

- `exec run` が project スコープの実行ロックを run 全体のライフタイムで保持し、他プロセスの `exec run` を排他する（同一プロセス内の `--parallel` は阻害しない）。
- ロックの stale 判定が固定 age ではなく heartbeat ベースで、長時間 run を stale 誤判定しない。crash 時は finally 解放と stale 奪取で回復する。
- `exec run` に `--if-busy <skip|wait|fail>` を追加し、手動 CLI の既定は `fail`、routine 経由は `skip` を渡す。
- routine の `exec-auto` / `exec-resume` / `register` action が busy 時に skip し、`[routine] skipped <id>: exec busy` をログする。
- `routine-state.json` の `last_result` に `skipped` を追加し、`routine list` で failure と区別して表示する。skip は failure 扱いにしない。
- retry は次の cron tick に委ね、単一 routine 実行内での待機は実装しない。

## 3. 作業内容

| No  | 作業                                                                  | 担当   | 状態 | メモ                               |
| --- | --------------------------------------------------------------------- | ------ | ---- | ---------------------------------- |
| 1   | project スコープの `exec-run.lock`（heartbeat/stale/finally解放）実装 | _TODO_ | open | 既存 `scheduler.lock` とは別レイヤ |
| 2   | `exec run` に `--if-busy <skip\|wait\|fail>` 追加                     | _TODO_ | open | 手動既定 fail                      |
| 3   | routine 各 action へ `--if-busy skip` 引き渡しと skip ログ            | _TODO_ | open | `buildExecAutoArgs` 等             |
| 4   | `routine-state.json` `last_result` に `skipped` 追加・list 表示       | _TODO_ | open | スキーマ拡張                       |
| 5   | ガイド更新（exec-operation / exec-config / routine-operation）        | _TODO_ | open | 排他モデルと `--if-busy` を記載    |
| 6   | テスト追加（ロック排他・skip 記録・list 表示）                        | _TODO_ | open | vitest                             |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:routine-operation-guide]]
- [[specdojo:exec-operation-guide]]
- [[specdojo:exec-config-guide]]
