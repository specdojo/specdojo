---
specdojo:
  id: prj-0001:xer-pjr-eewp-20261123t234329z-059cefad
  type: exec-result
  task_id: PJR-EEWP
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-EEWP/pjr-eewp-20261123T234329Z-059cefad/plan.md
  started_at: "2026-11-23T23:43:30.158Z"
  completed_at: "2026-11-23T23:48:12.730Z"
  agent: sonnet-executor
  block_reason: "parent validation failed: test-integration"
---

# Edit Result

## 1. 実施内容

- `summarizeGitHookFailure` を修正し、hook やテストの失敗の要約が、`unknown option` などテストの通常の出力ではなく FAIL の行を最初の原因として選ぶようにした。
- 単体テストに、今回の出力から作った要約が FAIL の行から始まるケースを足し、既存の期待を更新した。
- executor は `tests/src/exec/worktree.test.ts` の 47 件が通ったと報告している。runner の `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` は通過した。
- runner の `npm run test:integration` は失敗した。関連テストのみの実行で、`tests/src/exec/worktree-ops.integration.test.ts` の期待メッセージ（`typecheck: src/a.ts(1,1): error TS2322: ...`）と実際の出力（`typecheck: FAIL tests/src/doc-index.test.ts &gt; project register references; ...`）が食い違った。

## 2. 変更ファイル

- `src/shared/git.ts`: `summarizeGitHookFailure` が、出力中の FAIL の行を最初の原因として要約の先頭に選ぶように変更した。`unknown option '--reserve'` のような CLI の引数の誤りを確かめるテストの通常の出力は、要約の先頭に出ない。
- `tests/src/exec/worktree.test.ts`: 今回の出力から作った要約が FAIL の行から始まることを確かめるケースを追加し、既存の期待を新しい選び方に合わせて更新した。

## 3. 申し送り

- `npm run test:integration` が失敗している。`tests/src/exec/worktree-ops.integration.test.ts` の 888 行付近で、`git merge failed: typecheck: src/a.ts(1,1): error TS2322: intentional merge failure` を期待したのに、実際は `git merge failed: typecheck: FAIL tests/src/doc-index.test.ts &gt; project register references; ...` だった。要約の選び方の変更が、この統合テストの期待と食い違っている可能性が高い。ただし、証跡だけでは原因を断定できない。次のアクションは、統合テストの期待を FAIL の行を優先する新しい挙動に合わせるか、typecheck の失敗の要約に FAIL の行が混ざる条件を見直すかの判断である。
- CHANGELOG.md は変更していない。個票の対応結果 5.2 に区分 Fixed と文案を記載した。
- npm run typecheck、npm run lint:ts、npm run test:unit、npm run test:integration は親 runner の検証結果を正とする。

## 4. 進め方

原因は、要約が出力の先頭付近の行を選び、テストの通常の出力を拾っていたことと整理した。FAIL の行を優先して選ぶように `src/shared/git.ts` を直し、単体テストで挙動を固定した。親 runner の統合テストで食い違いが見つかったため、申し送りに残した。
