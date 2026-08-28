---
specdojo:
  id: prj-0001:pjr-0134-exec-auto-worker-pool
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  based_on:
    - prj-0001:pjr-0122-review-launch
    - sysd-agent-settings
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  due_on: "2026-07-31"
  completed_at: "2026-07-26T12:00:00Z"
  conclusion: 連続worker pool方式へ変更
  register_events:
    - v: 1
      id: reg_be86ea169d6ccf1fff7c026ed4b9d66f
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
          from: "`exec run --auto --loop --parallel` の固定バッチ方式を、agent の終了ごとに空いた実行枠へ次の Ready task を投入する連続 worker pool 方式へ変更する。長時間実行される task があっても、依存関係のない Ready task を空き枠で継続実行できるようにする。"
          to: parallel実行でagentが完了するたびに空いた実行枠へ次のReady taskを投入できるようにする
        - field: priority
          from: medium
          to: high
        - field: owner
          from: _TODO_
          to: ARC
        - field: due
          from: _TODO_
          to: "2026-07-31"
        - field: conclusion
          from: "-"
          to: 連続worker pool方式へ変更
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
    - v: 1
      id: reg_3473a4d2363ecf36755849b3a5598f75
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: completed
          from: "-"
          to: "2026-07-26"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_be86ea169d6ccf1fff7c026ed4b9d66f
---

# PJR-0134 exec run --autoを連続worker pool化

## 1. 概要

parallel実行でagentが完了するたびに空いた実行枠へ次のReady taskを投入できるようにする

`exec run --auto --loop --parallel` の固定バッチ方式を、agent の終了ごとに空いた実行枠へ次の Ready task を投入する連続 worker pool 方式へ変更する。長時間実行される task があっても、依存関係のない Ready task を空き枠で継続実行できるようにする。

## 2. 完了条件

- `--parallel <n>` が同時実行数の上限として機能し、上限を超えて agent を起動しない。
- `--loop` 指定時は、1件の task が完了するたびに Ready task を再評価し、他の実行中 task の完了を待たずに空き枠へ次の task を投入する。
- `--loop` を指定しない場合は、従来どおり開始時に選択した最大 `n` 件だけを実行する。
- provider capacity、task の claim、worktree の統合、`exec build` が並行完了時にも競合せず、同じ taskを重複実行しない。
- critical task の rate limit または実行失敗で停止条件を満たした場合は新規投入を止め、実行中 task の終了処理を安全に行う。
- 長時間 task と短時間 task を混在させた自動テストで、短時間 task の完了後に次の Ready task が投入されることを確認できる。

## 3. 作業内容

| No  | 作業                                                                                                       | 担当                    | 状態 | メモ                                                                                   |
| --- | ---------------------------------------------------------------------------------------------------------- | ----------------------- | ---- | -------------------------------------------------------------------------------------- |
| 1   | 現在の round と `Promise.allSettled` を中心とした実行制御を、実行中 task を管理する worker pool へ変更する | codex-expert-edit-agent | done | `--loop` なしは開始時の最大 `n` 件のみ実行する経路として維持した                       |
| 2   | task 完了後の merge、complete、Ready 再生成、次 task の claim を安全に直列化する                           | codex-expert-edit-agent | done | agent 終了後の root 側統合処理と次 task 準備を `SerialAsyncLock` で直列化した          |
| 3   | provider capacity をラウンド単位の予約数ではなく現在実行中の数として管理する                               | codex-expert-edit-agent | done | `reserve` に加えて `release` を追加し、agent 終了後に provider 枠を解放する            |
| 4   | 停止条件と実行中 task の drain 方針を実装する                                                              | codex-expert-edit-agent | done | critical task の rate limit / failure 後は新規投入を止め、実行中 task は drain する    |
| 5   | worker pool、依存関係更新、provider capacity、停止条件のテストを追加する                                   | codex-expert-edit-agent | done | 短時間 task 完了後の補充、停止時の drain、provider capacity 解放を単体テストで確認した |

## 4. 対応結果

- `src/exec-run.ts` に completion-driven worker pool を追加し、`--loop --parallel <n>` では agent が1件完了するたびに Ready を再評価して空き枠へ次 task を投入するようにした。
- `--loop` なし、または dry-run は従来どおり開始時に選択した最大 `n` 件だけを実行する経路に据え置いた。
- agent プロセスは並列実行しつつ、claim、checkpoint、merge、complete、`exec build`、次 task の claim / worktree 準備は runner 内の直列ロックで順序化した。
- provider capacity は現在実行中の provider 数として扱い、起動時に `reserve`、終了時に `release` するようにした。
- critical task が rate limit または failure になった場合は新規投入を停止し、既に起動済みの task は終了処理まで drain する方針にした。
- `tests/src/exec-run-worker-pool.test.ts` を追加し、短時間 task 完了後の補充、停止後の新規投入抑止と drain を検証した。`tests/src/exec-agent-config.test.ts` には provider capacity 解放の検証を追加した。
- `specdojo:exec-operation-guide`、`specdojo:command-reference`、`specdojo:exec-config-guide`、`sysd-agent-settings` を worker pool 前提の説明へ更新した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-0122-review-launch|launch trackの振り返り]]
- [[sysd-agent-settings|エージェント共通設定]]
- [[specdojo:exec-operation-guide|SpecDojo exec運用ガイド]]
- [[specdojo:command-reference|SpecDojoコマンドリファレンス]]
