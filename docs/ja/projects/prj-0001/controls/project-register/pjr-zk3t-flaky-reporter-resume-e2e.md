---
specdojo:
  id: prj-0001:pjr-zk3t-flaky-reporter-resume-e2e
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  registered_at: "2026-11-17T13:24:01Z"
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

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
