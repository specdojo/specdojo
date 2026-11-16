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

### 5.1. 原因

- ZSRD の run では、exec branch に executor の対応結果を含む個票が commit 済みだった（`5c0f7c2dc`）。wait の commit は結果を外したやり直しでも失敗し、orchestrator が waiting の記録を手で commit した（`b241a7a32`）。exec branch へ wait の記録を取り込む同期（`syncExecBranchAfterWait`）は走らず、両側が共通祖先から個票を変えたままになった
- 再開の前の同期（`syncTaskWorktreesWithIntegrationTargets`）は、個票を含む記帳のファイルを `projectTheirsPaths` に渡す。個票が競合すると統合先の版をそのまま採るため、executor の本文が消えた（`398b36318`）

### 5.2. 実施内容

- `src/exec/repo-integration-sync.ts`：同期に `resolvedPaths`（`projectResolvedPaths`）を足した。指定したパスが競合した場合は、exec branch と統合先の内容を resolver で組み合わせて解決する。どちらかの側が削除した場合は統合先を採る。resolver が例外を投げた場合は同期を取り消し、exec branch と未 commit の変更を元に戻す
- `src/exec/run/register-state.ts`：`restorePreservedRegisterTicket` の処理から `overlayRegisterTicketLifecycle` を切り出した。本文は exec branch の版を保ち、frontmatter の状態の欄（登録簿の項目の欄と `block_reason`）だけを統合先の値に揃える
- `src/exec/run/register-resume.ts`：`registerResumeConflictPaths` を足した。再開の前の同期では、個票を `projectTheirsPaths` から外して `overlayRegisterTicketLifecycle` で解決する。個票以外の記帳のファイル（イベントなど）はこれまでどおり統合先を採る
- 回帰テスト：`tests/src/exec/task-repos.integration.test.ts` に、exec branch の個票に executor の本文があり、統合先には waiting の記録だけがある状態で同期する場合を足した。統合後も本文が残り、状態の欄が waiting になることを確かめる。`tests/src/exec/register-resume.test.ts` に `registerResumeConflictPaths` の単体テストを足した

### 5.3. 判断した点

- 対応策の二案のうち、再開の前の同期で個票の本文を保つ案を採った。wait の commit を結果なしでやり直した場合だけでなく、wait の commit 自体が失敗して記帳を手で commit した今回の経路も同じ箇所で防げるためである
- 統合先の個票を解析できない場合は、統合先の版を採らずに同期を失敗させ、再開を拒否する。統合先の版を採ると本文が再び消えるためである。worktree で直してから再開し直す
- イベントのファイル（`events/pjr-*.yaml`）は競合時に統合先を採る扱いを変えていない。exec branch の start・review のイベントが落ちうる点は PJR-9MWH の範囲として残す

### 5.4. CHANGELOG に書く事項

- Fixed: `exec run` の register の再開で、wait の commit を結果なしでやり直した後や記帳を手で commit した後でも、executor が個票に書いた対応結果が再開の前の同期で消えないようにした（PJR-EWZG）

### 5.5. 保護された設定

- 変更なし。変更の案もない

## 6. 関連ドキュメント

- [[prj-0001:pjr-zsrd-review-stage-stale-grade-claim]]
- [[prj-0001:pjr-9mwh-schedule-executor-resume-trailing-record-conflict]]
