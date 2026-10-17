---
specdojo:
  id: prj-0001:pjr-cy80-checkpoint-inspect-failure-no-detail
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: medium
  owner: DEV
  registered_at: "2026-10-17T11:14:31Z"
  due_on: null
---

# PJR-CY80 checkpoint の確認の git の失敗が原因を残さない

## 1. 課題内容

src/exec/worktree-ops-lifecycle.ts は checkpoint の前に git diff --cached --quiet で変更を確かめ、終了コードが 0 と 1 以外なら Failed to inspect execution checkpoint changes. とだけ出す。git の終了コードと stderr を記録しないため、2026-10-17 の PJR-GBWW で止まった原因を特定できなかった

## 2. 影響範囲

| 観点         | 影響                                                                                                                                                  |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `src/exec/worktree-ops-lifecycle.ts` の checkpoint の確認（`git diff --cached --quiet`）の失敗の扱い。同じように git の失敗を原因なしで投げている箇所 |
| スケジュール | 循環をほどく作業（[[prj-0001:pjr-e025-src-remaining-cycles]]）の前に直す                                                                              |
| コスト       | run が `waiting` になっても原因が分からず、再実行して様子を見るしかない                                                                               |
| 品質         | 失敗の調査に必要な情報（終了コード・stderr）が失われる                                                                                                |
| 関係者       | exec の利用者、orchestrator                                                                                                                           |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                          |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | checkpoint の確認は `git diff --cached --quiet` の終了コードが 0 と 1 以外のとき、`Failed to inspect execution checkpoint changes.` とだけ投げ、git の終了コードと stderr を失敗のログにもメッセージにも含めない。すぐ上の checkpoint の commit の失敗は `appendGitFailureLog` で記録している |
| 対応策   | 確認の失敗でも、commit の失敗と同じく `appendGitFailureLog` で git の終了コード・stdout・stderr を記録し、エラーのメッセージに終了コードと stderr の要約（[[prj-0001:pjr-ry4c-register-commit-git-status-buffer]] の `describeGitProcessFailure` など）を含める                               |
| 依存事項 | なし                                                                                                                                                                                                                                                                                          |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                                                                                                                                        |

### 3.1. 完了条件

- checkpoint の確認の git が 0 と 1 以外で終わったとき、失敗のログに終了コード・stdout・stderr が残り、エラーのメッセージに終了コードと stderr の要約が含まれる。
- `src/exec/` の中で、git の失敗を原因（終了コード・stderr）なしで投げている箇所を調べ、同じく直す。調べた範囲と直した箇所を result に書く。
- 単体テストで、確認の git が失敗したときのメッセージに原因が含まれることを確かめる。
- 動作（成功時の処理と、失敗で止まること）は変えない。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 4. 対応結果

- 解決内容: `gitResult` の異常終了を整形する `formatGitResultFailure` と、終了コード・signal・起動エラー・stdout・stderr を失敗ログへ保存する `appendGitResultFailureLog` を共通化した。checkpoint の `git diff --cached --quiet` が 0・1 以外で終わった場合は、エラーに終了コードと stderr の要約を含め、run 単位の失敗ログへ完全な出力を残すようにした。0（差分なし）と 1（差分あり）の既存処理は変更していない。
- 調査範囲: `src/exec/` 配下で `gitResult` の終了状態を判定して例外を投げる箇所を検索した。同じ固定文言だけで失敗していた staged diff の確認経路（checkpoint、post-hook の収束、task worktree、product worktree、handoff、register commit、register-state、Job Run、trial adopt）を共通の診断形式へ変更した。失敗ログのパスを受け取る経路では完全な出力も保存する。加えて、`trial run` の基準 commit 解決失敗にも同じ診断を付けた。存在確認など、終了コード 1 を通常の「存在しない」として扱う述語は挙動を維持した。
- 確認結果: checkpoint の確認が終了コード 128 と stderr を返すケースについて、エラーメッセージに終了コードと stderr の要約が入り、失敗ログに stdout と stderr が残る単体テストを追加した。終了コード 0・1 を受理することも同じテストで固定した。静的検査とテスト全件は executor/reporter pipeline の親 runner 検証へ委譲する。
- 再発防止: `gitResult` を直接判定する新しい経路でも共通フォーマッタと共通ログ関数を利用できるようにし、診断項目の欠落と経路ごとの表現差を避けた。

## 5. 関連ドキュメント

- [[prj-0001:pjr-gbww-exec-shared-parts-to-shared]]: 事象が起きた実行。
