---
specdojo:
  id: prj-0001:xer-pjr-bvs9-20261107t000912z-28adcfe2
  type: exec-result
  task_id: PJR-BVS9
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-BVS9/pjr-bvs9-20261107T000912Z-28adcfe2/plan.md
  started_at: "2026-11-07T00:09:13.113Z"
  completed_at: "2026-11-07T00:49:18.480Z"
  agent: sol-executor
  block_reason: "parent validation failed: test-integration"
---

# Edit Result

## 1. 実施内容

- 保存する `plan.md` の規約部分を版（ハッシュ）への参照に置き換え、規約の本体を `&lt;execution_path&gt;/conventions/&lt;SHA-256&gt;.txt` に保存する仕組みを実装しました。
- 規約の全文復元、同一ハッシュの再現性、および `Job` における `no-op` 判定と共有版の保持機能を実装しました。
- テストのセットアップによる外部リポジトリへの書き込み問題を、環境変数の除去によって解決しました。
- 統合テストにおける `catalogless` 判定の期待値、`schedule` チェックポイントの解放対象、および `Job no-op` 判定の論理を修正しました。

## 2. 変更ファイル

- `CHANGELOG.md`: 変更履歴の更新。
- `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`: 規約の参照保存に関するライフサイクルガイドの更新。
- `src/exec/agent-plan.ts`: `agent-plan` の生成ロジックの変更。
- `src/exec/plans-generation.ts`: `plans-generation` プロセスの更新。
- `src/exec/plans-storage.ts`: 規約の版管理と保存ロジックの追加。
- `src/exec/register.ts`: 登録処理の更新。
- `src/exec/run/in-place.ts`: `in-place` 実行時の保存処理の修正。
- `src/exec/run/job.ts`: `job` 実行時の `no-op` 判定および共有版保持のロジック実装。
- `src/exec/run/lifecycle-commands.ts`: ライフサイクルコマンドの更新。
- `src/exec/run/register-core.ts`: 登録コアロジックの更新。
- `src/exec/run/register-post-review.ts`: レビュー後の登録処理の修正。
- `src/exec/run/register-resume.ts`: 再開時の処理の更新。
- `src/exec/run/register-worktree.ts`: `worktree` ベースの登録処理の修正。
- `src/exec/run/schedule-prepare.ts`: `schedule` 準備時の処理の更新。
- `src/exec/trial-commands.ts`: 試行コマンドの更新。
- `src/exec/worktree-ops-lifecycle.ts`: `worktree` 操作のライフサイクルの修正。
- `src/job/job.ts`: `job` モジュールの更新。
- `src/job/noop.ts`: `noop` ジョブの更新。
- `src/shared/plan-templates.ts`: `plan` テンプレートの定義の更新。
- `src/shared/run-records.ts`: 実行記録の構成の更新。
- `tests/setup/git-environment.ts`: Git 環境のテストセットアップの修正。
- `tests/src/exec/catalogless-register.integration.test.ts`: `catalogless` 登録の統合テストの修正。
- `tests/src/exec/pipeline-e2e.integration.test.ts`: パイプライン E2E テストの更新。
- `tests/src/exec/plans.test.ts`: `plans` 生成のテストの更新。
- `tests/src/exec/register-pipeline-e2e.integration.test.ts`: 登録パイプライン E2E テストの更新。
- `tests/src/exec/register-plan-escape.test.ts`: `plan` のエスケープに関するテストの更新。
- `tests/src/exec/register-resume.integration.test.ts`: 再開処理の統合テストの更新。
- `tests/src/exec/run/inplace.test.ts`: `inplace` 実行のテストの更新。
- `tests/src/job/noop.test.ts`: `noop` ジョブのテストの更新。
- `tests/src/register/catalogless-target.test.ts`: `catalogless` ターゲットのテストの更新。
- `src/shared/plan-conventions.ts`: 共通の規約定義の追加。
- `tests/src/exec/plan-conventions.test.ts`: 規約に関するテストの追加。

## 3. 申し送り

- 規約は `&lt;execution_path&gt;/conventions/&lt;SHA-256&gt;.txt` に保存し、欠落時に現行テンプレートへフォールバックしません。測定した plan は 9,226 バイトから 5,764 バイトへ、3,462 バイト削減しました。共有規約は 3,643 バイトです。
- 外部書き込みの原因は、テスト setup が親の `SPECDOJO_SCHEDULE_PATH` と `SPECDOJO_EXECUTION_PATH` を残していたことです。除去と保存先の回帰テストを追加しました。前回、統合先に作られたファイルは変更していません。
- 前回失敗した検証に対し、未使用 import、catalogless の期待値、schedule checkpoint の解放対象、旧配置を模擬する相対参照、Job no-op 判定を修正しました。合否の確定には親 runner の再検証結果を使用してください。
- 保護設定の変更は不要です。統合後は運用メモに従い、PJR-JSEY の対象へ追加して実 agent CLI の動作を確認してください。
- 適用外の検証: `npm run validate:schema:file`（executor が変更した成果物に YAML/YML ファイルはありません。既存の event 変更は runner 管理です。）

## 4. 進め方

規約の本体を `plan.md` に直接埋め込むのではなく、版（ハッシュ）を用いた参照形式に変更することで、`plan.md` のサイズ削減と規約の集約管理を実現しました。この変更に伴い、`src/exec/plans-storage.ts` に規約の保存と復元を行うロジックを実装し、`Job` における `no-op` 判定や共有版の扱いに対応させました。また、テスト環境が外部（親のパス）に影響を与えないよう、環境変数の管理を厳密化し、統合テストの期待値や判定ロジックを修正しました。
