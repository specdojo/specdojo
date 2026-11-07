---
specdojo:
  id: prj-0001:xer-pjr-bvs9-20261107t000912z-28adcfe2
  type: exec-result
  task_id: PJR-BVS9
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-BVS9/pjr-bvs9-20261107T000912Z-28adcfe2/plan.md
  started_at: "2026-11-07T00:09:13.113Z"
  completed_at: "2026-11-07T01:00:57.084Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- 保存する `plan.md` の規約を版（ハッシュ）への参照に変更し、規約本体を `execution/conventions/&lt;SHA-256&gt;.txt` として共有保存する仕組みを導入しました。
- 規約の版計算において、モード・スキーマ解決後の本文と末尾改行を使用するように調整しました。
- 再開時の指示に基づき、統合テスト実行時に外部（親 runner の環境変数）へファイルを書き込んでしまう問題を修正しました。具体的には、`tests/setup/git-environment.ts` および 各テストスイートにおいて、`SPECDOJO_SCHEDULE_PATH` および `SPECDOJO_EXECUTION_PATH` を除去・復元する処理を追加しました。
- 規約の版による `plan.md` のサイズ削減効果を確認しました（1件あたり約 3.5 KB の削減）。

## 2. 変更ファイル

- `CHANGELOG.md`: 変更履歴の更新。
- `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`: plan のライフサイクルに関するガイドの更新。
- `src/exec/agent-plan.ts`: agent に渡す plan の生成ロジックの更新。
- `src/exec/plans-generation.ts`: plan 生成プロセスの更新。
- `src/exec/plans-storage.ts`: plan の保存・版管理ロジックの更新。
- `src/exec/register.ts`: 登録プロセスの更新。
- `src/exec/run/in-place.ts`: in-place 実行に関するロジックの更新。
- `src/exec/run/job.ts`: job 実行に関するロジックの更新。
- `src/exec/run/lifecycle-commands.ts`: ライフサイクルコマンドの更新。
- `src/exec/run/register-core.ts`: 登録コア機能の更新。
- `src/exec/run/register-post-review.ts`: レビュー後の登録処理の更新。
- `src/exec/run/register-resume.ts`: 再開処理の更新。
- `src/exec/run/register-worktree.ts`: worktree 関連の登録処理の更新。
- `src/exec/run/schedule-prepare.ts`: スケジュール準備処理の更新。
- `src/exec/trial-commands.ts`: 試行コマンドの更新。
- `src/exec/worktree-ops-lifecycle.ts`: worktree 操作のライフサイクル管理の更新。
- `src/job/job.ts`: job モジュールの更新。
- `src/job/noop.ts`: noop job の更新。
- `src/shared/plan-templates.ts`: plan テンプレートの更新。
- `src/shared/run-records.ts`: 実行記録に関する共有実装の更新。
- `tests/setup/git-environment.ts`: テスト実行時の Git 環境設定（環境変数のクリーンアップ）の追加。
- `tests/src/exec/catalogless-register.integration.test.ts`: 統合テストの更新。
- `tests/src/exec/pipeline-e2e.integration.test.ts`: E2E 統合テストの更新。
- `tests/src/exec/plans.test.ts`: plan に関する単体テストの更新。
- `tests/src/exec/register-pipeline-e2e.integration.test.ts`: 登録パイプラインの E2E テストの更新。
- `tests/src/exec/register-plan-escape.test.ts`: 変更、+2 / -1 行
- `tests/src/exec/register-resume.integration.test.ts`: 再開に関する統合テストの更新。
- `tests/src/exec/run/inplace.test.ts`: in-place 実行に関するテストの更新。
- `tests/src/job/noop.test.ts`: noop job に関するテストの更新。
- `tests/src/register/catalogless-target.test.ts`: カタログレス登録に関するテストの更新。
- `src/shared/plan-conventions.ts`: 規約管理に関するソースコードの追加。
- `tests/src/exec/plan-conventions.test.ts`: 規約管理に関するテストコードの追加。

## 3. 申し送り

- 規約は `&lt;execution_path&gt;/conventions/&lt;SHA-256&gt;.txt` に共有保存する。mode・schema 解決後の本文と末尾改行から版を計算し、資源への参照はリポジトリ相対または package 内の相対パスにする。欠落・改変時に現在のテンプレートへフォールバックしない。保護設定の変更は不要。
- 外部への書き込み原因は、親 runner の `SPECDOJO_SCHEDULE_PATH`・`SPECDOJO_EXECUTION_PATH` がテストへ継承されたこと。さらに CLI が設定した両パスがテスト間に残り、直近の統合テスト 7 件が最初の fixture を再利用していた。共通 setup で親の値を除去し、対象スイートでも各テストで除去・復元する。統合先に前回作成されたファイルは変更していない。
- 個票に記録した削減例は、freeform の edit plan 1 件で復元後 9,226 バイト、保存時 5,764 バイト、差分 3,462 バイト。共有ファイルは 3,643 バイトで、同じ版の次の plan から再利用する。
- 前回失敗した lint・単体／統合テストを含む親検証は、指示に従い runner の再実行に委ねる。実 agent CLI の確認は統合後に PJR-JSEY で行う。
- 適用外の検証: `npm run validate:schema:file`（差分にある登録簿イベント YAML は runner が管理する状態遷移ファイルであり、executor は編集していない。）

## 4. 進め方

まず、規約の版管理のための新モジュール `src/shared/plan-conventions.ts` を導入し、`plan.md` の生成時に規約本文の SHA-256 ハッシュを計算して、`execution/conventions/` 配下に保存する仕組みを実装しました。次に、テスト実行時に環境変数が残ることで発生していた外部ファイル書き込み問題を解決するため、`tests/setup/git-environment.ts` を通じて `SPECDOJO_SCHEDULE_PATH` 等の環境変数をテストごとに適切に制御するよう修正しました。最後に、実装した機能が正しく動作することを確認するため、ハッシュ計算、保存、および環境変数除去に関する各種テストを実行しました。
