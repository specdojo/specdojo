---
specdojo:
  id: prj-0001:xer-pjr-160d-20261114t114840z-7c3be232
  type: exec-result
  task_id: PJR-160D
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-160D/pjr-160d-20261114T114840Z-7c3be232/plan.md
  started_at: "2026-11-14T11:51:08.884Z"
  completed_at: "2026-11-14T20:54:22.105Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- executor の変更が commit の対象外である場合に統合を停止する仕様を維持しつつ、再開（resume）時の E2E テストの fixture および停止ログの保存先パスを修正しました。
- 既存の stage 再利用、試行数、および commit 数に関する期待値を維持するように、成功系の fixture を `docs/test/doc.md` に揃えました。
- 対象外の変更が発生した際に、統合（integration）のみを再開できるようにする回帰テストを追加しました。
- 停止ログの保存先を、現在実行中の `result` と同じ `run` に修正し、`task_id` や `run_id` が異なる場合でも再開を妨げないようにしました。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-config-guide.md`: executor の設定ガイドを更新しました。
- `docs/ja/specdojo/guides/exec-worktree-guide.md`: executor の worktree に関するガイドを更新しました。
- `src/exec/protection-handoff.ts`: 保護のハンドオフ処理に関するソースコードを変更しました。
- `src/exec/repo-integration.ts`: リポジトリ統合に関するソースコードを変更しました。
- `src/exec/run/register-worktree.ts`: register プロセスにおける worktree 管理のソースコードを変更しました。
- `src/exec/run/schedule-task.ts`: タスクのスケジュール実行に関するソースコードを変更しました。
- `src/exec/worktree-ops-commit.ts`: worktree の commit 操作に関するソースコードを変更しました。
- `src/exec/worktree-ops-lifecycle.ts`: worktree のライフサイクル管理に関するソースコードを変更しました。
- `src/exec/worktree-ops-merge.ts`: worktree のマージ操作に関するソースコードを変更しました。
- `src/exec/worktree-ops.ts`: worktree 操作全般の共通ロジックを変更しました。
- `tests/src/exec/pipeline-e2e.integration.test.ts`: pipeline の E2E 統合テストを更新しました。
- `tests/src/exec/worktree-ops.integration.test.ts`: worktree 操作の統合テストを更新しました。

## 3. 申し送り

- 前回失敗した再開 E2E 5 件では、fake executor が plan の対象外の `pipeline-artifact.md` を作っていた。成功系 fixture を宣言済みの `docs/test/doc.md` に揃え、既存の stage 再利用・試行数・commit 数の期待を維持した。対象外変更の停止と、確認後に統合だけを再開する回帰テストを追加した。
- 停止ログの既定パスを選択中の `result` と同じ `run` に修正した。`task_id` と `run_id` が異なる場合も、別 `run` のログを作って再開を妨げない。
- bootstrap / maintenance の catalog・schema・型メニューの一括許可は採用しない。対象外の変更は、理由・対象パス・提案差分・必要な検証を個票と報告へ記載する。未解決 ID の警告は個別パス解決の失敗を示し、approach のディレクトリ許可と独立する。
- 親検証との二重実行禁止に従い、統合テストの個別実行も行っていない。親 runner の `test-integration` で `pipeline-e2e.integration.test.ts` と `worktree-ops.integration.test.ts` を含む修正後の結果を確認する。統合後は PJR-JSEY で実 agent の start から review までを確認してから close する。
- CHANGELOG 文案（不具合修正）: executor が commit 対象外の変更を残した場合、schedule 由来のタスクでも統合と worktree 撤去を停止し、対象パスと次のアクションを `result` とログへ記録する。型の対象 ID を解決できない場合の警告を、approach によるディレクトリ許可と整合する説明に修正する。
- 前回失敗した再開 E2E 5 件では、fake executor が plan の対象外の pipeline-artifact.md を作っていた。成功系 fixture を宣言済みの docs/test/doc.md に揃え、既存の stage 再利用・試行数・commit 数の期待を維持した。対象外変更の停止と、確認後に統合だけを再開する回帰テストを追加した。
- 停止ログの既定パスを選択中の result と同じ run に修正した。task ID と run ID が異なる場合も、別 run のログを作って再開を妨げない。
- bootstrap / maintenance の catalog・schema・型メニューの一括許可は採用しない。対象外の変更は、理由・対象パス・提案差分・必要な検証を個票と報告へ記載する。未解決 ID の警告は個別パス解決の失敗を示し、approach のディレクトリ許可とは独立する。
- 親検証との二重実行禁止に従い、統合テストの個別実行も行っていない。親 runner の test-integration で pipeline-e2e.integration.test.ts と worktree-ops.integration.test.ts を含む修正後の結果を確認する。統合後は PJR-JSEY で実 agent の start から review までを確認してから close する。
- CHANGELOG 文案（不具合修正）: executor が commit 対象外の変更を残した場合、schedule 由来のタスクでも統合と worktree 撤去を停止し、対象パスと次のアクションを result とログへ記録する。型の対象 ID を解決できない場合の警告を、approach によるディレクトリ許可と整合する説明に修正する。
- 適用外の検証: `npm run validate:schema:file`（今回の executor 成果物は Markdown と TypeScript。開始時から存在する登録簿イベント YAML は runner 管理の変更であり、編集していない。）

## 4. 進め方

対象外の変更が含まれている場合に統合プロセスを停止する仕様を維持しつつ、再開（resume）フローが正しく動作するように修正しました。具体的には、E2E テスト用の fixture を整理し、停止ログの保存先を現在の `run` に動的に合わせることで、中断後の再開を容易にしました。また、この振る舞いを保証するための回帰テストを追加しています。
