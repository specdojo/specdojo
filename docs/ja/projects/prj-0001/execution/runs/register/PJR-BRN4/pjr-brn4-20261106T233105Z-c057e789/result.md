---
specdojo:
  id: prj-0001:xer-pjr-brn4-20261106t233105z-c057e789
  type: exec-result
  task_id: PJR-BRN4
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-BRN4/pjr-brn4-20261106T233105Z-c057e789/plan.md
  started_at: "2026-11-06T23:31:06.401Z"
  completed_at: "2026-11-06T23:45:47.511Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- worktree の統合時における、許可外の追加（unlisted additions）が自動的に commit される問題を解消しました。
- 許可外の変更が検知された場合、統合を停止して `waiting` ステータスへ遷移し、worktree を保持する仕組みを導入しました。停止時には理由、ログ、変更件数を表示します。
- 承認後に手動で `git commit` を行い、その後で作業を再開するための手順（手順書への記載およびテストコードによる検証）を追加しました。
- PJR-XD12 で発生した、移動（files moved）が削除としてのみ扱われ、新しい配置のファイルが commit されない問題に対する回帰テストを追加しました。

## 2. 変更ファイル

- `CHANGELOG.md`: 今回の変更内容を追記しました。
- `docs/ja/specdojo/guides/exec-operation-guide.md`: worktree 統合時の停止・再開手順に関する運用メモを追記しました。
- `src/exec/register.ts`: 登録処理のロジックを更新しました。
- `src/exec/run/register-state.ts`: 登録状態の管理ロジックを更新しました。
- `src/exec/run/register-worktree.ts`: worktree を用いた登録フローの制御ロジックを更新しました。
- `src/exec/worktree-ops-commit.ts`: worktree 上での commit 操作に関するロジックを更新しました。
- `src/exec/worktree-ops-lifecycle.ts`: worktree のライフサイクル管理ロジックを更新しました。
- `src/exec/worktree-ops.ts`: worktree 操作の基本ロジックを更新しました。
- `tests/src/exec/register-multiple-ids.test.ts`: 複数の ID を扱う際の挙動に関するテストを更新しました。
- `tests/src/exec/register-resume.integration.test.ts`: 中断された作業の再開に関する統合テストを更新しました。
- `tests/src/exec/worktree-ops.integration.test.ts`: worktree 操作の統合テストを追加・更新しました。

## 3. 申し送り

- PJR-XD12 の消失済みファイルは今回復元していません。準備済みの `feature/prj-0001/restore-archived-trash` を利用者の承認後に反映してください。
- runner 変更のため、統合後に運用メモに従って `PJR-JSEY` の対象追加・再開手続きを行い、新しいプロセスで実 agent CLI による確認を実施してから close してください。
- カタログ検査は成功しましたが、既存の参照先未作成・re-export だけの根拠パスなどの警告が残っています。
- PJR-XD12 の消失済みファイルは今回復元していません。準備済みの feature/prj-0001/restore-archived-trash を利用者の承認後に反映してください。
- runner 変更のため、統合後に運用メモに従って PJR-JSEY の対象追加・再開手続きを行い、新しいプロセスで実 agent CLI による確認を実施してから close してください。
- 人の確認が必要: `specdojo exec run --project prj-0001 --register PJR-JSEY --worktree --executor-by claude-executor`（統合後、対象追加・再開手続きのうえ、sandbox 外の新しいプロセスで実 agent CLI による確認が必要です。）

## 4. 進め方

まず、worktree 統合時に未登録のファイルが存在する場合に、自動で commit せずに停止するロジックを `src/exec/` 配下の各モジュールに実装しました。次に、停止後の手動 commit および再開の手順を `docs/ja/specdojo/guides/exec-operation-guide.md` に文書化しました。最後に、PJR-XD12 で発生した「移動による追加が無視される」問題を防ぐための回帰テストを `tests/src/exec/worktree-ops.integration.test.ts` を中心に実装し、正しく停止・再開が行われることを検証しました。
