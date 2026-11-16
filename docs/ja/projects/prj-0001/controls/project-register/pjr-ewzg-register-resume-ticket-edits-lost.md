---
specdojo:
  id: prj-0001:pjr-ewzg-register-resume-ticket-edits-lost
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
  registered_at: "2026-11-16T04:22:47Z"
  due_on: null
  derived_from:
    - PJR-ZSRD
  commit_type: fix
  commit_scope: exec
---

# PJR-EWZG wait の commit を結果なしでやり直すと、再開の後に executor が書いた個票の本文が消える

## 1. 課題内容

2026-11-16、PJR-ZSRD・5QJ5 の run で、wait の commit が紛れ込んだ grade の進み具合のファイルで失敗し、runner が結果を含めずに commit し直した。再開の前の同期が個票を develop の側に寄せたため、executor が書いた対応結果（原因・実施内容・CHANGELOG に書く事項）が消えた。コードの変更は統合され、本文は orchestrator が executor の commit から戻した（8732bdcdd）。

## 2. 入力

- 2026-11-16、PJR-ZSRD・5QJ5 の wait の commit が、紛れ込んだ grade の進み具合のファイルで失敗し、runner は「failed with the result included; retrying without it」として結果を含めずに commit し直した。develop には executor の対応結果を含まない個票が残った
- 再開の前の同期（register-resume の projectTheirsPaths に記帳のファイル）が個票を develop の側に寄せたため、exec branch にあった executor の対応結果（原因・実施内容・CHANGELOG に書く事項）が消えた。コードの変更は統合された。orchestrator が executor の commit から本文を戻した（8732bdcdd）

## 3. 影響範囲

| 観点         | 影響                                                                                                     |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| スコープ     | register の項目の worktree の run が wait・block で止まり、再開する場合                                  |
| スケジュール | executor が個票に書いた原因・実施内容・CHANGELOG に書く事項が消え、リリースの CHANGELOG の集計から漏れる |
| コスト       | 気づくまで記録が欠けたままになる                                                                         |
| 品質         | 記録の信頼性が下がる                                                                                     |
| 関係者       | orchestrator・PO                                                                                         |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | wait の commit を結果なしでやり直したとき、exec branch の個票の本文と develop の個票が食い違ったまま残り、再開の前の同期が記帳のファイルを develop の側に寄せる                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 対応策   | 再開の前の同期で、個票は状態の欄（frontmatter の状態・イベント）だけを develop に寄せ、本文の章（対応結果など）は exec branch の側を保つ。または wait の commit を結果なしでやり直した場合に、その旨を記録して再開の前に本文を取り込む                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 依存事項 | PJR-9MWH（schedule の再開の記録の衝突）、PJR-DVNV（記帳の commit）                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 完了条件 | wait の commit を結果なしでやり直した後に再開しても、executor が書いた個票の本文が統合後に残ることを回帰テストで確かめる。迷った点は executor が決め、決めた内容と理由を個票の対応結果に書き、報告の `handoff` にも書く。`CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く（影響がなければ「なし」、PJR-EPQ3）。保護された設定（`.specdojo/`・`package.json`・`.agents/`・`.claude/`・`.codex/`・`lefthook.yml` など）は変えず、変更が要る場合は案を個票の対応結果と `handoff` に書く。`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。`npm run check` が通る |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[prj-0001:pjr-zsrd-review-stage-stale-grade-claim]]
- [[prj-0001:pjr-9mwh-schedule-executor-resume-trailing-record-conflict]]
