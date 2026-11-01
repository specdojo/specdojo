---
specdojo:
  id: prj-0001:pjr-z807-resume-edited-plan-lost
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-01T12:30:43Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-RKHR
---

# PJR-Z807 executor から再開したとき、直した plan が統合で元の plan に置き換わる

## 1. 課題内容

exec resume --resume-from executor で worktree の plan を直して再開すると、executor は直した plan を読むが、統合の commit には再生成した元の plan が入り、追加の指示が履歴に残らない

## 2. 入力

- T-DATA-FLOW-USAGE-cdfd-overview-010 を worktree の plan に追加の指示を足して --resume-from executor で再開したところ、統合時に runner が Discarding regenerated files in worktree: …-plan.md と出力し、統合された plan に追加の指示が残らなかった（2026-11-01）
- exec-operation-guide は、worktree の編集済み plan を executor と reporter へ渡すと書いている。今回の経緯は orchestrator が result に追記した（ad2da9ee0）

## 3. 影響範囲

| 観点         | 影響                                                                                                                                                        |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `exec resume --task <task-id> --resume-from executor`（schedule のタスク）と、同じ仕組みを使う `exec run --register --resume --resume-from executor` の統合 |
| スケジュール | なし（今回の経緯は result に手で追記した）                                                                                                                  |
| コスト       | runner の統合処理とテストの修正                                                                                                                             |
| 品質         | executor が実際に読んだ指示が履歴に残らず、成果物の根拠をたどれない                                                                                         |
| 関係者       | DEV、plan を直して再開する orchestrator と利用者                                                                                                            |

## 4. 対応方針

| 項目     | 内容                                                                                                                       |
| -------- | -------------------------------------------------------------------------------------------------------------------------- |
| 原因     | _TODO_: executor が調べて記録する（統合時に、root で再生成した plan を正として worktree の plan を破棄していると見られる） |
| 対応策   | executor から再開した run を統合するときは、worktree の直した plan を記録として残す                                        |
| 依存事項 | なし                                                                                                                       |
| 完了条件 | 下記の条件をすべて満たすこと                                                                                               |

完了条件の内訳。

- `exec resume --task <task-id> --resume-from executor` で、worktree の plan を直してから再開した run を統合すると、統合の commit に直した plan が入る。元の plan で上書きされない
- `exec run --register <PJR-ID> --resume --resume-from executor` でも同じ扱いになる（登録簿の側も同じ問題があれば直す。なければ、ないことを確かめて記録する）
- plan を直さずに再開した場合と、通常の run の統合の動きは変わらない
- 原因を個票の対応結果に記録する
- 実際の worktree を使う統合テストで、直した plan が統合の commit に残ることを確かめる
- `exec-operation-guide` の plan を直して再開する手順が、実際の動きと合っている。CHANGELOG は未公開の版の節に書き、公開済みの版の節は変えない
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と親の検証が通る

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:exec-operation-guide]]
