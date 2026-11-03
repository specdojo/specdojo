---
specdojo:
  id: prj-0001:pjr-fyn5-resume-executor-claim-mismatch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: ARC
  registered_at: "2026-11-03T12:53:45Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-GQN3
  commit_type: fix
  commit_scope: exec
---

# PJR-FYN5 executor から再開して executor を替えると統合の前に止まる

## 1. 課題内容

exec resume --resume-from executor --executor-by で別の agent に替えても claim が元の agent のまま残り、完了の前の確認で「別の actor が作業中」として止まる

## 2. 入力

- 2026-11-03 に T-DATA-FLOW-UC-REWRITE-cdfd-uc-schedule-020 を opus-executor の claim のまま exec resume --resume-from executor --executor-by sol-executor で再開したところ、executor・親の検証・reporter は通ったが、「completion preflight failed: task is being worked on by another actor: opus-executor」で統合の前に止まった
- その後、--executor-by なしの exec resume --task で再開すると、claim の持ち主の opus-executor で executor から流し直して完了した（2026-11-03）
- 直し方の案: executor を替えて再開するときは claim を新しい agent へ移す（release と claim の event を残す）、または完了の確認で再開時に指定した executor を許す。PJR-RKHR で入れた --resume-from executor の動きに関わる（2026-11-03）

## 3. 影響範囲

| 観点         | 影響                                                                                                        |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| スコープ     | `exec resume --resume-from executor` と `--executor-by` で executor を替えたときの claim と、完了の前の確認 |
| スケジュール | executor を替えて再開すると、作業と検証が通ったあとに統合の前で止まり、元の agent で流し直す必要がある      |
| コスト       | 中くらい                                                                                                    |
| 品質         | executor を替えた再開が完了できず、作業がやり直しになる                                                     |
| 関係者       | schedule のタスクを再開する利用者                                                                           |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | executor を替えて再開しても claim は元の agent に残り、完了の前の確認が「別の actor が作業中」として止める                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 対応策   | executor を替えて再開するときは、claim を新しい agent へ移す（release と claim の event を残す）か、完了の前の確認で再開時に指定した executor を許す。どちらにするかを選択肢と理由とともに個票の対応結果に記録して決める                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 依存事項 | PJR-MERV と同じ runner の段に触れるため、PJR-MERV の統合のあとに流す                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 完了条件 | claim の持ち主と違う executor を `--executor-by` に指定して `exec resume --task <id> --resume-from executor` で再開したとき、executor・親の検証・reporter・統合まで通り、完了の event がどの actor で記録されたかが分かることを、統合のテストで確かめている。`--executor-by` を指定しない再開の動きは今と変えない。exec の運用ガイドの再開の節に、executor を替えたときの claim の扱いを書いている。作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を流し、親の検証（test-integration を含む）が通る。CHANGELOG は未公開の版の節（Unreleased）に書き、公開済みの版の節を変えない。保護された設定（`.specdojo/**`・`package.json` など）は変えず、必要なら案を個票の対応結果と報告の handoff に書く。未決の点は executor が決め、理由を個票の対応結果に記録する |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-gqn3-data-flow-uc-rewrite]]
- [[prj-0001:pm-orchestrator-playbook]]
