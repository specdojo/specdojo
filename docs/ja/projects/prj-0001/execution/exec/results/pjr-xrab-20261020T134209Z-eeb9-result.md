---
specdojo:
  id: prj-0001:xer-pjr-xrab-20261020t134209z-eeb9
  type: exec-result
  task_id: PJR-XRAB
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-xrab-20261020T134209Z-eeb9-plan.md
  started_at: "2026-10-20T13:42:09.188Z"
  completed_at: "2026-10-20T21:24:20.593Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- exec run コマンドにおいて、プロダクトリポジトリの統合先ブランチを `--integration-branch &lt;repo&gt;=&lt;branch&gt;` の形式で run ごとに指定できる機能を実装しました。
- これに伴い、`pipeline-state.schema.yaml` の更新、`src/exec/` 配下の各コンポーネント（`pipeline-state.ts`, `repo-integration.ts`, `run/` 内の各コマンド等）の修正を行い、指定されたブランチ情報が各 run のコンテキストに保持されるようにしました。
- 関連するドキュメント（`branch-workflow-guide.md`, `command-reference.md`, `specdojo-config-reference.md`）および `CHANGELOG.md` を更新しました。
- 既存のテストセット（`pipeline-state.test.ts`, `task-repos.integration.test.ts`, `task-repos.test.ts`）を更新し、新しい機能の動作を確認しました。

## 2. 変更ファイル

- `CHANGELOG.md`: 機能追加に関する変更を記録。
- `docs/ja/specdojo/guides/branch-workflow-guide.md`: 統合先ブランチの指定に関するワークフローの記載を更新。
- `docs/ja/specdojo/references/command-reference.md`: `exec run` コマンドの引数として `--integration-branch` が追加されたことを記載。
- `docs/ja/specdojo/references/specdojo-config-reference.md`: `pipeline-state` 内の関連する設定項目の変更を記載。
- `docs/specdojo/schemas/v1/pipeline-state.schema.yaml`: 統合先ブランチ情報を保持するためのスキーマ定義を更新。
- `src/exec/pipeline-state.ts`: 統合先ブランチ情報を保持するプロパティの追加。
- `src/exec/repo-integration.ts`: 指定された統合先ブランチを処理するロジックを追加。
- `src/exec/run/agent-pipeline.ts`: 実行パイプラインにおけるブランチ情報の伝搬処理を更新。
- `src/exec/run/register-command.ts`: `--integration-branch` オプションのパース処理を追加。
- `src/exec/run/register-resume.ts`: レジューム時のデータ構造への対応。
- `src/exec/run/register-worktree.ts`: ワークツリー作成時のブランチ指定に関する対応。
- `src/exec/run/shared.ts`: 共通の型定義またはヘルパー関数の更新。
- `src/exec/task-repos.ts`: タスクリポジトリに関するロジックを更新。
- `tests/src/exec/pipeline-state.test.ts`: 新しいデータ構造に関するユニットテストを追加。
- `tests/src/exec/task-repos.integration.test.ts`: 統合ブランチ指定を含む結合テストを追加。
- `tests/src/exec/task-repos.test.ts`: リポジトリ操作に関するユニットテストを更新。

## 3. 申し送り

- 実装は完了しました。次のステップとして、実際に指定した統合先ブランチに対して正しくプルリクエストやマージが行われるかを、実環境（PJR-JSEY 等）を用いて検証してください。
- 人の確認が必要: `specdojo exec run --project &lt;project-id&gt; --register &lt;PJR-ID&gt; --worktree --integration-branch &lt;repo&gt;=&lt;branch&gt;`（統合後に実 agent CLI を起動する確認は PJR-JSEY として実施する必要がある。）

## 4. 進め方

1. `specdojo exec run` コマンドに `--integration-branch &lt;repo&gt;=&lt;branch&gt;` オプションを追加するため、CLI 引数をパースする `register-command.ts` を修正しました。 2. パースした情報を `pipeline-state` に格納して各 run で保持できるよう、`pipeline-state.schema.yaml` と `pipeline-state.ts` を拡張しました。 3. `repo-integration.ts` および関連する実行ロジックを修正し、指定されたブランチを動的に適用できるようにしました。 4. 実装内容の正当性を担保するため、ユニットテストおよびインテグレーションテストを拡充しました。
