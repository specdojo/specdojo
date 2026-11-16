---
specdojo:
  id: prj-0001:pjr-964d-git-index-lock-wait-longer
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-16T03:13:34Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-G90K
  commit_type: fix
  commit_scope: exec
---

# PJR-964D 統合の git 操作が index.lock の長い保持を待てるようにする

## 1. 概要

runner の統合の git 操作の index.lock の待ち時間を延ばし、hook の実行中の lock で失敗せずに待つ

## 2. 入力

- 2026-11-15、orchestrator の手の commit で lefthook の pre-commit の npm test が負荷の下で 17 分ほど index.lock を握り、runner の統合の git restore・merge が「Unable to create index.lock」で失敗した（sld-090 などが blocked）。PJR-G90K で入れた再試行は短い取り合いだけを吸収し、長い保持を越えられない
- 本命の直列化（PJR の specdojo git）が入るまでの手当てとして、待ち時間を延ばす。利用者が 2026-11-16 に起票を依頼した

## 3. 完了条件

- runner の統合・記帳の git 操作（`src/shared/git.ts` の index.lock の再試行）が、既定で 20 分程度まで lock の解放を待ってから再試行する。待ち時間は exec-defaults で変えられる。
- 待っている間は「index.lock を待っている」旨と経過時間を定期的に出し、黙って止まって見えない。
- 待ち時間を越えた場合は、従来どおり lock のパスと原因の候補を示して失敗する。
- lock を握ったまま残った古い index.lock（プロセスがいない）を誤って待ち続けない扱いを決め、テストで確かめる。
- `npm run check` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                  | 担当 | 状態 | メモ                                            |
| --- | ----------------------------------------------------- | ---- | ---- | ----------------------------------------------- |
| 1   | 待ち時間の既定と exec-defaults の設定を決めて実装する | DEV  | done | 既定 1200 秒、`run.git_index_lock_wait_seconds` |
| 2   | 待機中の表示と、古い lock の扱いを実装する            | DEV  | done | 30 秒ごとの告知、`/proc` で git の不在を判定    |
| 3   | 回帰テストと文書（exec-config-guide など）を更新する  | DEV  | done | `tests/src/shared/git.test.ts` ほか             |

## 5. 対応結果

- `src/shared/git.ts` の index.lock の再試行を、回数の上限から時間の上限へ変えた。最初の 10 回は従来どおり 1.5 秒間隔、その後は 5 秒間隔で、既定 20 分まで解放を待つ。
- 待ち時間は exec-defaults の `run.git_index_lock_wait_seconds`（0 以上の整数、既定 1200）で変えられる。`loadExecDefaultsConfig` が値を検査し、その process の git 操作へ反映する（`src/shared` は exec を import できないため `configureIndexLockWait` で渡す）。schema にも項目を足した。
- 待っている間は、最初の取り合いと 30 秒ごとに `warning: waiting for index.lock to be released (elapsed … / limit …, lock: …)` を stderr に出す。
- 上限を越えたときは `error: index.lock was not released within …` を stderr に足して失敗する。失敗の要約は lock のパスと原因の候補（pre-commit などの hook の実行中、または異常終了した git が残した古い lock）を先頭に示す。
- 古い lock の扱い: 最初の 10 回（約 15 秒）の後、lock のファイルが残っているのに Linux の `/proc` に git のプロセスが 1 つもないときは古い lock とみなし、上限を待たずに `index.lock looks stale` で失敗する。git はロックを握るプロセスを記録しないため、git が 1 つでも動いていれば（別の run の git を含む）待ち続ける保守的な判定とした。`/proc` を読めない環境では上限まで待つ。lock のファイルは従来どおり消さない。
- テスト: 17 分の保持を越えて成功すること、告知の間隔、上限での失敗、設定の反映、古い lock での早期の失敗、`/proc` の模擬による判定、設定値の検査を追加した。
- 文書: `exec-config-guide.md`・`schedule-operation-guide.md`・`CHANGELOG.md` を更新した。`.specdojo/exec-defaults.yaml` は既定値で足りるため変更していない。
- _ASSUMPTION_: 別の run の git が並行して動くと古い lock の判定は働かず、上限まで待つ。本命の直列化（PJR-30SA）が入るまでの手当てとして許容した。

## 6. 関連ドキュメント

- [[prj-0001:pjr-g90k-integrate-index-lock-retry]]
- [[prj-0001:pjr-30sa-specdojo-git-serialized]]
