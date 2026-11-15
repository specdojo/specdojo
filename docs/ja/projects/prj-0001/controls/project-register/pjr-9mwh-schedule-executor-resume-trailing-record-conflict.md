---
specdojo:
  id: prj-0001:pjr-9mwh-schedule-executor-resume-trailing-record-conflict
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-15T17:01:33Z"
  due_on: "2026-11-16"
  derived_from:
    - PJR-ED0K
    - PJR-DVNV
  commit_type: fix
  commit_scope: exec
---

# PJR-9MWH schedule の executor の再開が、develop に commit 済みの run の記録との衝突で止まる

## 1. 課題内容

DVNV と ED0K の組み合わせで pipeline-e2e の統合テストが落ち、develop の test-integration が失敗する

## 2. 入力

- 2026-11-16 01:54、develop（47676ea25）で tests/src/exec/pipeline-e2e.integration.test.ts の「resumes the executor after a failed integration, syncing the integration target」が落ちる。親の検証の test-integration が全件失敗するため、0.8.0 の phase 2 の run がすべて止まる
- 原因: PJR-DVNV で runner は block の後の run の記録（execution/runs/schedule/`<task>`/`<run>`/result.md など）を develop へ commit するようになった。PJR-ED0K の schedule の --resume-from executor は、再開の前に develop を exec branch へ merge する（syncTaskWorktreesWithIntegrationTargets）。worktree 側にも同じ run の記録が commit されているため、result.md が add/add で衝突し「merge conflicts with main: execution/runs/schedule/T-TEST-doc-010/.../result.md」で止まる
- register の再開（src/exec/run/register-resume.ts）は projectTheirsPaths に bookkeeping のパスを渡して統合先の側を採っているが、schedule の再開（src/exec/run/lifecycle-commands.ts の executor 再開前の同期）は渡していない。同じ考え方で、そのタスク自身の run の記録（DVNV が commit する範囲）の衝突を解いて再開できるように直す。どちらの側を採るかは、再開した executor が result を書き直すことと、後の統合の merge が衝突しないことから決める
- 完了条件: 上記の E2E を含む npm run test:integration が通る。DVNV の trailing-records の統合テストと ED0K の再開のテストも通る。register の再開に同じ穴がないかも確かめる

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
