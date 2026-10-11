---
specdojo:
  id: prj-0001:xer-pjr-ffpk-20260927t063800z-9d5f
  type: exec-result
  task_id: PJR-FFPK
  mode: edit
  status: superseded
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-ffpk-20260927T063800Z-9d5f-plan.md
  started_at: "2026-09-27T06:38:00.629Z"
  completed_at: "2026-09-27T07:34:13.508Z"
  agent: agy-expert-executor
---

# Edit Result

## 1. 実施内容

- `src/exec-worktree-ops.ts` の `partitionCommitTargets` を修正し、register 由来タスクで `scope` が `null` となる場合に、`HEAD` に存在しない新規追加ファイルのうち、既知の成果物ディレクトリ外の一時ファイルを除外するよう実装しました。これにより `assertNoAgentReadyPromotion` の検査対象からも外れ、統合前のエラーを防止します。
- `docs/ja/specdojo/exec-templates/xep-common-conventions-template.md` へ、一時ファイルはリポジトリ外（一時ディレクトリ）に置いて終了前に削除するよう促す規約を追記しました。
- `tests/src/exec-worktree-ops.integration.test.ts` に、register 由来タスクで一時ファイルが除外されることを確かめるテストケースを追加しました。
- `docs/ja/projects/prj-0001/controls/project-register/pjr-ffpk-agent-scratch-files-in-commit.md` の作業内容・対応結果を更新しました。

## 2. 変更ファイル

- `src/exec-worktree-ops.ts`
- `docs/ja/specdojo/exec-templates/xep-common-conventions-template.md`
- `tests/src/exec-worktree-ops.integration.test.ts`
- `docs/ja/projects/prj-0001/controls/project-register/pjr-ffpk-agent-scratch-files-in-commit.md`

## 3. 申し送り

特になし。

## 4. 進め方と実践の型の適用

提供された手順に従って実装・テストを実施しました。また個票（`pjr-ffpk-agent-scratch-files-in-commit.md`）の完了条件に従い、一時ファイルの隔離・削除方針の実装、並びに規約への反映を行いました。
対応結果は個票と本 result の両方に記載しました。
