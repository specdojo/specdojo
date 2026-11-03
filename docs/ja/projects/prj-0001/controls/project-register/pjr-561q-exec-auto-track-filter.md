---
specdojo:
  id: prj-0001:pjr-561q-exec-auto-track-filter
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-03T05:23:03Z"
  due_on: "2026-11-07"
  derived_from:
    - PJR-GQN3
  commit_type: feat
  commit_scope: exec
---

# PJR-561Q exec run --auto で選ぶタスクを track で絞れない

## 1. 課題内容

exec run --auto は対象のタスクが失敗すると、ほかの track の ready のタスクへ進む。--track で選ぶタスクを 1 つの track に限れるようにする

## 2. 入力

- 2026-11-03 に track data-flow-uc-rewrite の 3 タスクを exec run --auto --parallel 3 で流したところ、3 タスクとも checkpoint の commit が markdownlint の MD032 で拒否されて始まる前に失敗した（原因は phase の説明で箇条書きの前に空行がなかったこと、72749b20e で修正済み）
- その後 --auto が launch の track の review タスク 3 件（T-LAUNCH-pm-communication-plan-105・pm-members-105・pm-organization-105）を claim し、worktree を作って agent を動かし始めた。オーケストレーターが止めて claim を release した（628f502e3）。execution: human のタスク 8 件は自動で飛ばされた
- 利用者は、この不具合を直してから 3 タスクを並列で流すと判断した。直し方の案は exec run --auto に --track `<track>` を足し、選ぶタスクをその track に限る形（2026-11-03）

## 3. 影響範囲

| 観点         | 影響                                                                                |
| ------------ | ----------------------------------------------------------------------------------- |
| スコープ     | exec run --auto の選択と、command-reference・exec の運用ガイドの記述                |
| スケジュール | track data-flow-uc-rewrite の 3 タスク（epic PJR-GQN3）の並列の実行がこの修正を待つ |
| コスト       | 小さい（選択の絞り込みと引数の追加）                                                |
| 品質         | --auto が利用者の意図しないタスクに agent を動かし、利用枠と成果物の状態を乱す      |
| 関係者       | exec run --auto を使う利用者、夜間の実行                                            |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | --auto はすべての track の ready のタスクから戦略（critical-first / fifo）で選び、選んだタスクが失敗すると次の ready のタスクへ進む。選ぶ範囲を限る指定がない                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 対応策   | exec run --auto に --track <track> を足し（繰り返し指定できるかは executor が決める）、選ぶタスクを指定した track に限る。--parallel・--loop・--dry-run と組み合わせて使えるようにする                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 完了条件 | exec run --auto --track <track> で、指定した track 以外のタスクが選ばれない（--dry-run と実際の選択の両方）。対象のタスクが失敗しても、ほかの track のタスクへ進まないことを単体または統合のテストで確かめている。存在しない track を指定したときは、claim の前にエラーで止まる。--track なしの動きは今と変えない。command-reference と exec の運用ガイドに --track を書いている。作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を流し、親の検証（test-integration を含む）が通る。CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えない。保護された設定（`.specdojo/**`・`package.json` など）は変えず、必要なら案を個票の対応結果と報告の handoff に書く。未決の点は executor が決め、理由を個票の対応結果に記録する |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-gqn3-data-flow-uc-rewrite]]
- [[prj-0001:pm-orchestrator-playbook]]
