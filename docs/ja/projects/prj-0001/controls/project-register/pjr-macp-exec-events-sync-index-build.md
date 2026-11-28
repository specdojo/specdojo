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

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

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

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
