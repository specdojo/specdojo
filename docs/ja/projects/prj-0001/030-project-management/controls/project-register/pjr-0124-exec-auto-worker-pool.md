---
specdojo:
  id: prj-0001:pjr-0124-exec-auto-worker-pool
  type: project
  status: draft
  rulebook: pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  based_on:
    - prj-0001:pjr-0122
    - sysd-agent-settings
---

# PJR-0124 exec run --autoを連続worker pool化

## 1. 概要

`exec run --auto --loop --parallel` の固定バッチ方式を、agent の終了ごとに空いた実行枠へ次の Ready task を投入する連続 worker pool 方式へ変更する。長時間実行される task があっても、依存関係のない Ready task を空き枠で継続実行できるようにする。

## 2. 完了条件

- `--parallel <n>` が同時実行数の上限として機能し、上限を超えて agent を起動しない。
- `--loop` 指定時は、1件の task が完了するたびに Ready task を再評価し、他の実行中 task の完了を待たずに空き枠へ次の task を投入する。
- `--loop` を指定しない場合は、従来どおり開始時に選択した最大 `n` 件だけを実行する。
- provider capacity、task の claim、worktree の統合、`exec build` が並行完了時にも競合せず、同じ taskを重複実行しない。
- critical task の rate limit または実行失敗で停止条件を満たした場合は新規投入を止め、実行中 task の終了処理を安全に行う。
- 長時間 task と短時間 task を混在させた自動テストで、短時間 task の完了後に次の Ready task が投入されることを確認できる。

## 3. 作業内容

| No  | 作業                                                                                                       | 担当   | 状態 | メモ                                             |
| --- | ---------------------------------------------------------------------------------------------------------- | ------ | ---- | ------------------------------------------------ |
| 1   | 現在の round と `Promise.allSettled` を中心とした実行制御を、実行中 task を管理する worker pool へ変更する | _TODO_ | open | `--loop` なしの互換性を維持する                  |
| 2   | task 完了後の merge、complete、Ready 再生成、次 task の claim を安全に直列化する                           | _TODO_ | open | scheduler lock と既存の worktree lock を利用する |
| 3   | provider capacity をラウンド単位の予約数ではなく現在実行中の数として管理する                               | _TODO_ | open | agent 終了時に枠を解放する                       |
| 4   | 停止条件と実行中 task の drain 方針を実装する                                                              | _TODO_ | open | 新規投入停止と既存プロセス終了を分ける           |
| 5   | worker pool、依存関係更新、provider capacity、停止条件のテストを追加する                                   | _TODO_ | open | 長短 task の混在を含める                         |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-0122|launch trackの振り返り]]
- [[sysd-agent-settings|エージェント共通設定]]
- [[specdojo-exec-operation-guide|SpecDojo exec運用ガイド]]
- [[specdojo-command-reference-guide|SpecDojoコマンドリファレンス]]
