---
specdojo:
  id: prj-0001:pjr-7vtz-register-sync-busy-no-wait
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-27T12:32:07Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-86RK
---

# PJR-7VTZ 専用ブランチが使用中だと、exec のイベントの書き込みが待たずに失敗する

## 1. 課題内容

inRegisterBranchSync が使用中ならすぐ例外を投げるため、register の記帳と重なった exec refresh が worktree の用意の段で失敗し、run が waiting になる

## 2. 入力

- 2026-11-27 の PJR-86RK の 2 回目で、worktree の用意の exec refresh が「Register branch project/prj-0001/register is busy; retry the schedule operation.」で失敗し、run が waiting になった。同じ時刻にオーケストレーターが PJR-G5DY の close を register ... --commit で記帳していた
- エラーは src/shared/register-branch.ts の inRegisterBranchSync が tryAcquirePoolSlot で枠を取れないときに投げる。非同期の inRegisterBranch は CrossProcessMutex で待つ

## 3. 影響範囲

| 観点         | 影響                                                                                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `src/shared/register-branch.ts` の `inRegisterBranchSync` と、`src/shared/cross-process-lock.ts` に足した同期の待機。呼び出し側（`src/exec/events.ts`）は変えない |
| スケジュール | 期限（2026-11-30）内に対応した                                                                                                                                    |
| コスト       | 書き込みが重なったときだけ、使用中の操作が終わるまで待つ時間が増える                                                                                              |
| 品質         | 記帳と重なった `exec refresh`・claim・complete などが失敗せず、run が waiting にならない                                                                          |
| 関係者       | DEV、exec run を回すオーケストレーター                                                                                                                            |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                     |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `src/shared/register-branch.ts` の `inRegisterBranchSync` は、専用ブランチの枠が使用中だと待たずに「busy; retry the schedule operation」を投げる。exec のイベントを書く API が同期のため |
| 対応策   | 使用中のときは、上限の時間まで待ってから書く。待ち方（同期のまま待つか、呼び出し側を非同期にするか）は executor が決め、理由を個票の対応結果に書く                                       |
| 依存事項 | なし                                                                                                                                                                                     |
| 完了条件 | 下の一覧のとおり                                                                                                                                                                         |

完了条件:

- 専用ブランチへ exec のイベントを書く操作（`exec refresh`・claim・complete など）は、同期の枠が別の操作（`register ... --commit` など）で使用中でも、すぐ失敗せず、上限の時間まで待ってから書く。
- 上限の時間を超えたら、今と同じく、対象のブランチと待った時間を含むエラーで止まる。上限の既定値と設定の要否は executor が決め、理由を個票の対応結果に書く。
- `exec run --register --worktree` の worktree の用意の段で `exec refresh` が使用中に当たっても、run が waiting にならない。
- 単体テストか統合テストで、枠が使用中の間に書き込みが待ち、解放後に書けること、上限を超えると止まることを確かめている。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定（`.specdojo/`・`.github/`・`.agents/`・`.claude/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。

## 5. 対応結果

解決内容:

- `src/shared/cross-process-lock.ts` に `acquirePoolSlotSync` を足した。枠が取れるまで `Atomics.wait` でスレッドを止めて `LOCK_POLL_MS`（200 ms）ごとに取り直し、上限の時間を超えたら `timeout` を返す。
- `inRegisterBranchSync` はこの関数で待つ。上限を超えたら「`Register branch <branch> is still busy after waiting <n>s (limit <m>s); retry the schedule operation.`」で止まり、対象のブランチと待った時間を出す。
- 待ち方は同期のまま待つ方式にした。exec のイベントを書く API（`writeEventFile`・`readAllEventFiles`）は同期で、claim・complete・`exec refresh` などの多くの呼び出し元が同期で使っているため、非同期にすると変更が広がる。別プロセスの `register ... --commit` は heartbeat を別プロセスで持つため、こちらのスレッドを止めても解放は進む。
- 同じプロセスの非同期の書き手（`inRegisterBranch`）が枠を持っている場合は、スレッドを止めると解放されないため、待たずに「`is busy in this process`」で止まる。従来の即時失敗が残るのはこの場合だけである。
- 上限の既定値は `REGISTER_BRANCH_SYNC_WAIT_MS` の 120 秒とし、設定は設けない。1 回の `register ... --commit` が枠を持つのは fetch・rebase・push の間で、通常は数秒、遅くても 1 分程度のため。止まった持ち主の枠は 30 秒の stale 判定で奪えるので、長い上限で待ち続けることもない。設定が要るほどのばらつきは今は観測していない。
- `exec run --register --worktree` の worktree の用意の段の `exec refresh` も同じ `inRegisterBranchSync` を通るため、記帳と重なっても待ってから書き、run は waiting にならない。

確認結果:

- `tests/src/exec/slot-lock.test.ts` に `acquirePoolSlotSync` の単体テストを足した。使用中の間は待って解放後に取る、上限を超えると待った時間とともに `timeout` を返す、同じプロセスが持つときは待たずに返す、の 3 件である。
- `tests/src/register/register-branch.integration.test.ts` に統合テストを 2 件足した。別プロセスが 1.5 秒後に枠を解放するとき `writeEventFile` が待ってから専用ブランチへ push すること、上限（テストでは 0.3 秒）を超えるとブランチ名と待った時間を含むエラーで止まり操作を実行しないこと、を確かめた。
- `npx tsc -b`・`npx eslint`（変更ファイル）・`npx vitest run`（上記 2 ファイルの該当テスト）が通った。`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run test:integration` は親 runner が実行する。

再発防止策:

- 同期の書き込みは即時失敗せず、上限まで待つ形に統一した。

### 5.1. CHANGELOG に書く事項

- 区分: 利用者から見て動きが変わる点
- 文案: `exec refresh`・claim・complete などの exec のイベントの書き込みは、専用ブランチが `register ... --commit` などで使用中でも、すぐ失敗せずに最大 120 秒待ってから書きます。上限を超えると、ブランチ名と待った時間を示して止まります（PJR-7VTZ）。

### 5.2. 作業内容

| 作業                                              | 状態 | メモ                                    |
| ------------------------------------------------- | ---- | --------------------------------------- |
| 同期の枠の待機（`acquirePoolSlotSync`）を足す     | done | `src/shared/cross-process-lock.ts`      |
| `inRegisterBranchSync` を上限付きで待つ形に変える | done | 既定 120 秒、超えたらブランチと待ち時間 |
| 単体テスト・統合テストを足す                      | done | 単体 3 件、統合 2 件                    |
| 個票の対応結果と CHANGELOG の文案を書く           | done | `CHANGELOG.md` は変えていない           |

## 6. 関連ドキュメント

- PJR-86RK（2 回目の run で本事象を観測した項目）。
