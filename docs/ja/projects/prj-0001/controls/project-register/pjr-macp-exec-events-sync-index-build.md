---
specdojo:
  id: prj-0001:pjr-macp-exec-events-sync-index-build
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  owner: DEV
  registered_at: "2026-11-28T08:47:36Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-QCJ5
---

# PJR-MACP exec のイベントの同期ブランチで、人の記帳の commit が index-build の hook で止まる

## 1. 課題内容

人が exec reopen などを記帳すると、同期用の worktree に登録簿の一覧（git 管理外の pjr-index.md）がなく、pre-commit の index-build で commit が止まる。記帳は手元に残り、手で register build してから commit と branch-push をやり直す必要がある

## 2. 入力

- 2026-11-28 に indie が exec reopen --task T-KATA-REVIEW-CALIBRATION-opr-sample-150 を流したところ git commit failed で止まった。hook の index-build が「Generated project register index is missing or invalid: .../generated/pjr-index.md。Run: specdojo register build」で失敗していた
- 回避: 同期用の worktree（.git/specdojo/sync/exec-events/…/worktree）で register build を流してから commit し、register branch-push --sync exec-events で push した（5767e550de）
- 直し方の案: 同期用の worktree で commit する前に runner が一覧を作る、または同期のブランチではこの hook を飛ばす。どちらにするかは executor が決めて理由を記録する
- 担当 DEV・期限 2026-11-30 は indie の指示（2026-11-28）

## 3. 影響範囲

| 観点         | 影響                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------ |
| スコープ     | 同期ブランチへ commit する exec のイベントの記帳・個票の対応結果の公開・`register ... --commit`  |
| スケジュール | 人の記帳が止まるたびに、手で `register build` と `register branch-push` をやり直す手間が出ていた |
| コスト       | 一覧の生成は同期用の worktree ごとに最初の 1 回だけで、以後は存在の確認だけ                      |
| 品質         | 記帳が手元に残ったまま push されず、ほかの worktree から見えない状態が生じていた                 |
| 関係者       | 記帳を流す人（indie）とオーケストレーター、同期ブランチを使う runner                             |

## 4. 対応方針

| 項目     | 内容                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 同期用の worktree には git 管理外の生成物（`pjr-index.md`）がなく、pre-commit の index-build（`index build`）が一覧の欠落で失敗する |
| 対応策   | 同期のブランチへの記帳の commit が、生成物の有無に左右されずに通るようにする                                                        |
| 依存事項 | なし                                                                                                                                |
| 完了条件 | 下の一覧のとおり                                                                                                                    |

- 人や runner が exec のイベント（reopen・claim・complete など）や登録簿の記帳を同期のブランチへ commit するとき、同期用の worktree に一覧の生成物がなくても commit が通るようにする。runner が commit の前に一覧を作るか、同期のブランチでは index-build の hook を飛ばすか（`lefthook.yml` は保護された設定のため、hook を変える場合は案を個票の対応結果と報告の `handoff` に書く）は executor が決め、理由を個票の対応結果に書く。
- 回避の手順（同期用の worktree で `register build` を流してから commit し、`register branch-push` で送る）が要らなくなることを、統合テストか単体テストで確かめる。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。
- 統合の後に、オーケストレーターが人の actor の exec の記帳（例: 終わったタスクの `exec reopen` と、元に戻す記帳）を 1 回流し、止まらずに同期のブランチへ送られることを確かめてから close する。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。

## 5. 対応結果

### 5.1. 解決内容

- 同期用の worktree で commit する前に、runner が登録簿の一覧を作る方式にした。新しい `src/register/sync-worktree-index.ts` の `ensureSyncWorktreeRegisterIndexes` が、設定の全 project のうち `generated/pjr-index.md` が無いか壊れている登録簿だけ、その worktree を起点に `register build` と同じ派生ビュー（scope `all`）を書く。
- 呼び出し元は、同期ブランチで commit する 3 か所である。exec のイベントの記帳（`src/exec/events.ts` の `writeEventFile`）、個票の対応結果の公開（`src/exec/run/register-sync.ts` の `publishRegisterTicket`）、`register ... --commit` の記帳（`src/register/register.ts`）。
- 生成に失敗しても警告だけを出して commit へ進む。hook のない利用先リポジトリでは一覧が要らないため、記帳を止めない。hook のあるリポジトリでは hook 自身のエラーが出る。

### 5.2. 方式を選んだ理由

- hook を飛ばす案は採らなかった。`--no-verify` は `evidence-secret-scan` などほかの hook もまとめて飛ばす。`LEFTHOOK_EXCLUDE=index-build` は、配布する CLI がこのリポジトリの hook 名に依存することになる。
- 一覧を作る案なら `lefthook.yml`（保護された設定）を変えずに済み、`index build` を pre-commit に置くどのリポジトリでも効く。
- 一覧は git 管理外で同期用の worktree に残るため、作り直すのは最初の 1 回だけになる。2 回目以降は存在の確認だけで済む。

### 5.3. 確認結果

- `tests/src/register/sync-branches.integration.test.ts` に、`generated/pjr-index.md` が無いと失敗する pre-commit hook を置いたうえで exec のイベントを記帳するテストを足した。手で `register build` を流さずに commit と push が通り、同期用の worktree に一覧ができることを確かめた。
- 修正を外すと同じテストが `git commit failed: index missing` で失敗し、報告どおりの症状を再現することも確かめた。
- `npx tsc -b`・変更したファイルへの `npx eslint`・`tests/src/exec/events.test.ts`・`tests/src/register/register-branch.integration.test.ts` は通った。全件の検証は親の runner が流す。
- 実機での確認（人の actor による `exec reopen` と元に戻す記帳）は、統合の後にオーケストレーターが行う。

### 5.4. CHANGELOG に書く事項

- 区分: Fixed
- 文案: exec のイベントや登録簿の記帳を同期ブランチへ commit するとき、同期用の worktree に登録簿の一覧（`generated/pjr-index.md`）が無いと pre-commit の `index build` で止まっていた問題を直した。commit の前に一覧を作るため、手で `register build` を流してから commit と `register branch-push` をやり直す必要がなくなった（PJR-MACP）。

### 5.5. 再発防止策

- 上記の統合テストで、同期用の worktree の commit が git 管理外の生成物を要求する hook の下でも通ることを継続して確かめる。

## 6. 関連ドキュメント

- 派生元: PJR-QCJ5
