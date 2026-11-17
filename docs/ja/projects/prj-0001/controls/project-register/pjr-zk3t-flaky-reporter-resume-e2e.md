---
specdojo:
  id: prj-0001:pjr-zk3t-flaky-reporter-resume-e2e
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-11-17T13:24:01Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-8NB8
  commit_type: test
  commit_scope: exec
---

# PJR-ZK3T pipeline-e2e の reporter の再開のテストが、時々 reporter を 1 回多く呼んで落ちる

## 1. 課題内容

tests/src/exec/pipeline-e2e.integration.test.ts の reporter の再開のテストが偶然で落ち、並べて流した run の親の検証（test-integration）を止める

## 2. 入力

- 2026-11-17 の PJR-8NB8 の 2 回目の親の検証で、「executor / reporter pipeline resume E2E (worktree) > blocks non-target changes after reporter resume and resumes only integration after review」が落ちた。期待した agent の呼び出しは 3 件だが、4 件目として local-gemma-reporter（gemma3-12b、role reporter）が呼ばれていた。時間切れではなかった（timed out: no、テストは約 6.7 秒）
- orchestrator が同じテストだけを手元で流し直すと、8NB8 の worktree では 6 回中 5 回、develop では 5 回中 5 回通った。8NB8 の変更（exec smoke の登録と、register の関数を失敗時に例外で止める形にしたこと）は reporter の再試行に関わらないため、偶然の失敗と判断して --resume で親の検証を流し直した
- 親の検証が落ちると、その項目の変更範囲の予約が残り、範囲が重なると判定された後続の項目も止まる（PJR-9JN6）。偶然の失敗でも、並べて流した複数の run が止まる

## 3. 影響範囲

| 観点         | 影響                                                                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `tests/src/exec/pipeline-e2e.integration.test.ts` の reporter の再開のテストと、原因が runner にある場合は reporter の選択・再試行の処理 |
| スケジュール | 偶然の失敗のたびに親の検証が止まり、`--resume` での流し直しが要る                                                                        |
| コスト       | 流し直しの間、run が長くなる。agent の利用枠の追加の消費は小さい                                                                         |
| 品質         | 偶然の失敗と本当の失敗を見分けにくくなる。runner が実際に余分な reporter を呼んでいる場合は、実際の run にも影響する                     |
| 関係者       | exec run を流す orchestrator と利用者、runner の保守者                                                                                   |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | まだ特定していない。候補は、テストの中の agent の選び方が時刻や順番で変わること、前の試行の状態が残って reporter の失敗と見なされ、代わりの reporter が呼ばれること                                                                                                                                                                                                                                                                                                       |
| 対応策   | テストを繰り返し流して失敗を再現し、4 回目の reporter の呼び出しが起きる条件を突き止める。原因をテストか runner の側で直し、結果が毎回同じになるようにする。runner が時々余分に reporter を呼ぶ場合は、実際の run にも影響するため runner を直す                                                                                                                                                                                                                          |
| 依存事項 | reporter の代わりの agent の選択（`--fallback-reporter-by`・名簿の自動選択）と、reporter の段からの再開の処理                                                                                                                                                                                                                                                                                                                                                             |
| 完了条件 | 原因と再現の条件を個票の対応結果に書いている。このテストだけを 20 回続けて流してすべて通る。同じファイルのほかのテストも通る。保護された設定は変えず、変更が要る場合は変更案を個票の対応結果と報告の `handoff` に書く。迷った点は executor が決めて理由を個票の対応結果に書く。`CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」に文案を書く（PJR-EPQ3）。`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[prj-0001:pjr-8nb8-exec-smoke-command]]
- [[prj-0001:pjr-9jn6-change-scope-protected-list-overlap]]
