---
specdojo:
  id: prj-0001:xer-pjr-dxdc-20261012t092447z-ed76
  type: exec-result
  task_id: PJR-DXDC
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-dxdc-20261012T092447Z-ed76-plan.md
  started_at: "2026-10-12T09:24:47.624Z"
  completed_at: "2026-10-12T09:34:35.399Z"
  agent: codex-expert-executor
---

# Edit Result

## 1. 実施内容

- 親プロセスで確定した `scheduled_at` を worktree 内の子プロセスへ継承し、手動 Job 実行時の Run ID 不一致を修正しました。
- `--scheduled-at` 省略時にも Run ID が一致し、Job Run record が作成されることを統合テストで検証しました。

## 2. 変更ファイル

- `src/exec-run.ts`: 親で確定した `scheduled_at` を worktree 内の子プロセスへ引き継ぐようにしました。
- `tests/src/exec-job-worktree.integration.test.ts`: `--scheduled-at` を省略した Job 実行で Run ID が一致し、Job Run record が作成される統合テストを追加しました。

## 3. 申し送り

- Prettier、登録簿派生ビュー生成、カタログ検証、差分空白検査、および runner 実行の lint・型検査・単体／統合テスト・スキーマ検証はすべて成功しました。

## 4. 進め方と実践の型の適用

親プロセスで一度確定した実行時刻を子プロセスにも渡すことで、worktree 作成時と子プロセス実行時で同一の実行枠から Run ID を導出するようにしました。
