---
specdojo:
  id: prj-0001:pjr-fk0y-unit-test-timeout-under-load
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-31T02:04:17Z"
  due_on: "2026-11-30"
---

# PJR-FK0Y 負荷で時間切れになる単体テストを直す

## 1. 概要

統合のときの全件テストの負荷で 5 秒の上限を超える `catalogless-target.test.ts` と `grade-per-document.test.ts` を、上限の延長かテストの軽量化で安定させる。

## 2. 入力

- 統合の commit の hook は npm test で単体と統合の全件を流す。その負荷で catalogless-target.test.ts が 2 回、grade-per-document.test.ts の excludes an exhausted stage from retries and reports it が 1 回、Test timed out in 5000ms で落ち、run が waiting になった
- どちらも単独では通る（grade-per-document.test.ts は 32 件で約 8 秒、catalogless-target.test.ts の各テストは約 0.4 秒）
- 上限を延ばすか、テストを軽くするか、両方かは executor が決めてよい

## 3. 完了条件

- `catalogless-target.test.ts` と `grade-per-document.test.ts` が負荷の下で 5 秒の上限を超える原因（重い準備、子プロセスの起動の数など）を調べ、本個票の対応結果に書く。
- 上限を延ばす、テストを軽くする、またはその両方のどれで直すかは executor が決め、理由を本個票の対応結果と報告の `handoff` に書く。上限を延ばす場合は、全体の `testTimeout` ではなく、対象のファイルかテストに限って延ばす。
- テストが確かめている振る舞いは変えない。テストを消したり、`skip` にしたりしない。
- 同じ形（子プロセスの起動や実ファイルの準備が多い）で、単体の設定のまま時間切れになりうるテストがほかにあれば、一覧を本個票の対応結果に書く。直すかどうかは範囲の外とする。
- 負荷をかけた状態を再現して確かめる。例えば `npm run test:unit` を 2 つ同時に流し、対象のテストが通ることを確かめて、結果を本個票の対応結果に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を流して通し、親の検証も通る。
- 利用者に影響しない変更のため、`CHANGELOG.md` は変えない。
- 保護された設定（`package.json` など）に触れる必要がある場合は、変更せずに案を本個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業                                 | 担当     | 状態 | メモ |
| --- | ------------------------------------ | -------- | ---- | ---- |
| 1   | 時間切れの原因を調べ、直し方を決める | executor | open | -    |
| 2   | 直して、負荷をかけた状態で確かめる   | executor | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-ykyk-scaffold-fallback-deliverable-type]]
