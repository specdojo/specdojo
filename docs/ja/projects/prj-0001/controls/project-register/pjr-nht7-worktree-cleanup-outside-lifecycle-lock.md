---
specdojo:
  id: prj-0001:pjr-nht7-worktree-cleanup-outside-lifecycle-lock
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-16T13:06:20Z"
  derived_from:
    - PJR-30SA
  commit_type: fix
  commit_scope: exec
---

# PJR-NHT7 統合の後の worktree の片付けが登録簿のロックの中で走り、記帳と specdojo git を長く待たせる

## 1. 課題内容

runner が統合の後の git worktree remove を exec-lifecycle のロックの中で行うため、遅いファイルシステムでは片付けの間ずっと記帳と specdojo git が待たされる

## 2. 入力

- 2026-11-16、PJR-1Y1M の統合の後の git worktree remove に 23 分以上かかった。その間の CPU 時間は 4 秒で、ほとんどがディスクの待ちだった（共有フォルダの bind mount、PJR-TATP）
- その間、specdojo git -- worktree add が exec-lifecycle のロックの空きを 25 分待った
- removeWorktree は src/exec/run/register-worktree.ts の finalizeRegisterWorktreeRun の中で呼ばれ、lifecycleLock.runExclusive の中にある

## 3. 影響範囲

| 観点         | 影響                                                                       |
| ------------ | -------------------------------------------------------------------------- |
| スコープ     | register と schedule の worktree 実行の統合段、`exec worktree remove`      |
| スケジュール | 遅いファイルシステムで片付けの間、別の項目の記帳と `specdojo git` が止まる |
| コスト       | なし                                                                       |
| 品質         | 統合と記帳の直列化は保ち、片付けの失敗と再開の扱いは従来どおり             |
| 関係者       | DEV、exec run を並べて使う利用者                                           |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `finalizeRegisterWorktreeRun` の撤去（`removeWorktree`）が、呼び出し側の `lifecycleLock.runExclusive` の中で統合と同じ区間にあった。schedule の `runPreparedTask` も同じ形だった                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 対応策   | 統合と記帳をロックの中に残し、撤去をロックの外へ移す。撤去の後の記帳はロックを取り直して行い、worktree ごとのロックで同じ項目の撤去との重なりを防ぐ                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 依存事項 | PJR-30SA（`specdojo git` が同じロックを待つ）、PJR-TATP（遅いファイルシステム）                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 完了条件 | worktree と branch の片付けを exec-lifecycle のロックの外で行い、統合と記帳はロックの中に残す。片付けの途中で落ちたり失敗したりしても、次の run・再開・cleanup で残りを片付けられ、二重に消さない。片付けの間に同じ項目の再実行や再開が始まっても壊れない。schedule の run の終わりの処理（`src/exec/run/schedule-task.ts`）に同じ形があれば同じ扱いにする。片付けより前にロックが解放されることを回帰テストで確かめる。迷った点は executor が決め、決めた内容と理由を個票の対応結果に書き、報告の `handoff` にも書く。`CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く（PJR-EPQ3）。保護された設定（`.specdojo/`・`package.json`・`.agents/`・`.claude/`・`.codex/`・`lefthook.yml` など）は変えず、変更が要る場合は案を個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもと feature ブランチで行う。`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。 |

## 5. 対応結果

### 5.1. 解決内容

- `src/exec/run/deferred-cleanup.ts` を追加した。`runWithDeferredCleanup` は統合をロックの中で行い、ロックを解放してから片付けを行い、その結果を受けてロックを取り直して記帳を仕上げる。
- register の `finalizeRegisterWorktreeRun` は `lifecycleLock` を受け取り、自分でロックを扱う。統合（commit・merge・review の遷移）はロックの中に残し、`removeWorktree` はロックの外で行う。派生ビューの再生成と post-review はロックを取り直して行う。呼び出し側（通常実行・executor 再開・reporter 再開・統合再開）は `runExclusive` で包まない形にした。
- schedule の `runPreparedTask` も同じ形に揃えた。撤去をロックの外で行い、`spawnComplete` または撤去の失敗の block をロックを取り直して記帳する。
- `src/exec/worktree-cleanup-lock.ts` を追加した。register の撤去は worktree ごとのロック（`exec/.locks/worktree-cleanup/<worktree>`）を exec-lifecycle のロックの中で取ってから始める。同じ項目の再実行（setup）・再開・統合再開・`exec worktree remove` は、このロックが生きている間は撤去済みの worktree を消し始めず、理由を返す。

### 5.2. 判断した点

- post-review は撤去の後に回した。撤去が失敗した場合は従来どおり review を保ち、post-review を走らせない。統合再開が撤去と post-review をやり直すため、post-review を二重に走らせない。
- post-review の差分範囲（`outputCommit`）は merge の直後の HEAD で固定した。撤去を待つ間に別の項目の commit が積まれても、範囲が広がらない。
- 撤去中にプロセスが落ちた場合、worktree ごとのロックは heartbeat が止まって古くなり、次の操作が引き継ぐ。worktree が残っていれば統合再開が撤去をやり直し、残骸だけなら次の run の `discardStaleExecWorktree` か `exec worktree prune` が片付ける。branch は merge 済みのため、二重の削除で成果は失われない。
- schedule の lifecycle ロックは同じプロセスの中の `SerialAsyncLock` で、別のプロセスとは共有しない。schedule には worktree ごとのロックを足さなかった。片付けの間、項目は `doing` のままで、scheduler が同じ項目を選び直さないためである。
- 撤去の失敗の理由の前置きは、register の通常の統合でも `integrate cleanup failed` に揃えた。merge 前の失敗（`integrate failed`）と区別できる。

### 5.3. 残る課題

- `removeWorktree` は `spawnSync` を使うため、撤去の間は同じプロセスの event loop も止まる。別のプロセス（`specdojo git`・`--join` の run・記帳）は待たなくなるが、同じプロセスで並列に走る項目は撤去の間進まない。非同期化は別の項目で扱う。

### 5.4. 確認結果

- 回帰テスト `tests/src/exec/run/deferred-cleanup.test.ts` を追加した。片付けの前にロックが解放され、片付けの後の記帳でロックを取り直すこと、片付けの間に別のロック保持者が進めること、片付けの失敗が記帳の段へ渡ることを確かめる。
- `tests/src/exec/worktree-cleanup-lock.test.ts` で、同じ worktree の二つ目の片付けが拒否され、解放後に再び取れることを確かめる。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` は親 runner が実行する。

### 5.5. CHANGELOG に書く事項

- 区分: Fixed
- 文案: `exec run` の worktree 実行で、統合の後の worktree と exec branch の撤去を exec-lifecycle のロックの外で行うようにした。遅いファイルシステムで撤去に時間がかかっても、別の項目の記帳と `specdojo git` が待たされない。撤去の間は同じ項目の再実行・再開・`exec worktree remove` を拒否する。

## 6. 関連ドキュメント

- 派生元: PJR-30SA（`specdojo git` が同じロックを待つ）
- 関連: PJR-TATP（遅いファイルシステム）
