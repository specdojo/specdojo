---
specdojo:
  id: prj-0001:xer-pjr-genj-20261001t115359z-9eae
  type: exec-result
  task_id: PJR-GENJ
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-genj-20261001T115359Z-9eae-plan.md
  started_at: "2026-10-01T11:53:59.482Z"
  completed_at: "2026-10-01T19:46:03.293Z"
  agent: claude-expert-executor
---

# Edit Result

## 1. 実施内容

- PJR-GENJ: `exec run --resume` で register の reporter 段・統合段から再開する際、親検証の前に統合先ブランチの最新を exec branch と worktree へ取り込むようにした。複数リポジトリの場合はプロダクトごとの統合先も取り込む。
- 取り込みで新しい commit が入った場合は親検証をやり直す。これにより、統合先で直した不具合が反映されないまま同じ失敗を繰り返す問題を解消した。
- 統合段の再開でも親検証を実行し、失敗時は waiting へ戻す。
- 未コミット成果と重なる場合や記帳ファイル以外の競合では、merge を中止し、register の状態を変えずに再開を拒否する。
- 互換性への影響: 記帳ファイルが未コミットのまま残る中断 run は、以前は再開できたが、統合先がそれらのファイルを変更していると再開を拒否される。
- 検証: runner 検証（`lint-ts`、`lint-fm`、`lint-md`、`test-integration`、`validate-schema`、`typecheck`、`test-unit`）はすべて passed。executor の整形、markdownlint、`catalog validate`、`index build` も passed。

## 2. 変更ファイル

- `src/exec-repo-integration.ts`: 統合先ブランチの最新を exec branch と worktree へ取り込む処理を追加した（約 141 行）。
- `src/exec-run.ts`: reporter 段・統合段からの再開時に、親検証の前に取り込みを行い、新しい commit があれば親検証をやり直すようにした。統合段の再開でも親検証を実行し、失敗時は waiting へ戻す。競合時は再開を拒否する。
- `tests/src/exec-register-resume.integration.test.ts`: reporter 段再開の E2E テストを追加した。
- `tests/src/exec-task-repos.integration.test.ts`: 取り込み処理のテストを 6 件追加した。
- `docs/ja/specdojo/guides/exec-operation-guide.md`: 再開時の取り込みと親検証の挙動を追記した。
- `docs/ja/specdojo/references/command-reference.md`: `exec run --resume` の挙動の記述を更新した。
- `docs/ja/projects/prj-0001/controls/project-register/pjr-genj-resume-validation-before-develop-sync.md`: 個票の対応結果を更新した。

## 3. 申し送り

- 未対応: Schedule タスクの再開は対象外のままである。
- 未対応: 統合段再開の E2E テストは未追加である。
- 記帳ファイルが未コミットのまま残る中断 run は、統合先がそれらを変更していると再開できなくなる。運用上の影響を確認すること。
- 登録簿の行と個票のステータス項目は変更していない。状態遷移は runner と人間が行う。

## 4. 進め方と実践の型の適用

完了条件の仮説として、親検証の前に統合先の最新を取り込むか、取り込み後に検証し直すことを置いた。取り込み後に新しい commit があれば親検証をやり直す方式を採用した。
