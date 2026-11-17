---
specdojo:
  id: prj-0001:xer-pjr-v0fq-20261116t233621z-123fb668
  type: exec-result
  task_id: PJR-V0FQ
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-V0FQ/pjr-v0fq-20261116T233621Z-123fb668/plan.md
  started_at: "2026-11-16T23:36:22.035Z"
  completed_at: "2026-11-17T00:09:12.990Z"
  agent: sol-executor
  block_reason: "parent validation failed: lint-ts, test-integration"
---

# Edit Result

## 1. 実施内容

- command Job の `task.steps` に、exec・grade・検査を順次実行する仕組みを追加した。段ごとに失敗時の停止／継続を選べ、lock の待機に期限を設けられ、結果・理由・evidence を段別に記録する。
- 既存の command Job の入力検証・冪等性・attempt・routine・lock 継承を再利用した。再試行は新しい attempt で先頭から実行する。
- `grade run --lock-wait-timeout-ms` で project grade lock の待機上限を指定できるようにした。
- schema・設計書・ガイド・CLI リファレンス・定義例・回帰テストを更新した。
- executor 側の検証（build、`job validate`、schema、prettier、catalog、履歴リンク、`git diff --check`）は成功した。runner の `npm run lint:ts` と `npm run test:integration` は failed だった。`lint:ts` は 3 errors、`test:integration` は `tests/src/exec/job-sequence.integration.test.ts` の 114 行目で、`state` が `failed` ではなく `running` だった。未解消である。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/040-user-interface-model/clis-exec-commands.md`: exec コマンドの UI モデルに、順次実行 Job の利用と段ごとの停止／継続の説明を反映した。
- `docs/ja/product/040-system-design/sysd-job-execution.md`: Job 実行の設計に、`task.steps` の順次実行、停止／継続、lock 待機、段別記録を追記した。
- `docs/ja/specdojo/guides/routine-operation-guide.md`: 定期運用ガイドに、複数の run・grade を順に流す運用手順を追記した。
- `docs/ja/specdojo/references/command-reference.md`: コマンドリファレンスに、`grade run` の待機上限オプションと順次実行の挙動を追記した。
- `docs/ja/specdojo/standards/job-definition-standard.md`: Job 定義標準に `task.steps` の記述規則を追加した。
- `docs/specdojo/schemas/v1/job-run.schema.yaml`: Job 実行記録の schema に、段別の steps 記録を追加した。
- `docs/specdojo/schemas/v1/job.schema.yaml`: Job 定義の schema に `task.steps` と、停止／継続、lock 待機の項目を追加した。
- `src/exec/events.ts`: 順次実行の段に関わる event の扱いを調整した。
- `src/exec/run/job.ts`: Job 実行に順次実行の段の処理を組み込んだ。
- `src/exec/run/lock.ts`: lock 取得に、期限付きの待機を使えるようにした。
- `src/exec/run/shared.ts`: 順次実行と lock 待機に必要な共通処理を調整した。
- `src/grade/command-run.ts`: `grade run` に待機上限オプション `--lock-wait-timeout-ms` を追加した。
- `src/grade/run.ts`: grade 実行で project lock の待機上限を受け取れるようにした。
- `src/job/definition.ts`: Job 定義の読み込みと検証で `task.steps` を扱えるようにした。
- `src/job/job.ts`: command Job の実行を、段の順次実行に対応させた。
- `tests/src/exec/run/lock.test.ts`: 期限付き lock 待機のテストを追加・更新した。
- `tests/src/grade/run.test.ts`: `grade run` の待機上限に関するテストを更新した。
- `tests/src/job/job.test.ts`: Job の段実行に関する既存テストを更新した。
- `docs/ja/projects/prj-0001/jobs/job-sequential-batch.yaml`: 順次実行 Job の定義例を新規追加した。schema に適合することを確認した。
- `src/job/sequence.ts`: 段の順次実行、停止／継続の判定、段別結果の記録を担うモジュールを新規追加した。
- `src/shared/lock-wait.ts`: 期限付きの lock 待機を行う共通処理を新規追加した。
- `tests/src/exec/job-sequence.integration.test.ts`: 順次実行を CLI 経由で確認する統合テストを新規追加した。sandbox で実行できなかった CLI smoke の内容を移したもので、runner 実行では失敗している。
- `tests/src/job/sequence.test.ts`: 順次実行ロジックの単体テストを新規追加した。

## 3. 申し送り

- runner の `npm run test:integration` が failed。`tests/src/exec/job-sequence.integration.test.ts` の 114 行目で `record.state` が期待値 `failed` ではなく `running` だった。順次実行の失敗時に状態が確定しない可能性があるため、ログ `parent-validation-attempt-1-test-integration.log` を確認して原因を特定する必要がある。
- runner の `npm run lint:ts` が 3 errors を含んで failed。error の内容は evidence では省略されており、ログ `parent-validation-attempt-1-lint-ts.log` で確認する必要がある。warning 42 件は max-lines 系が中心だった。
- executor の CLI smoke は、sandbox の `spawnSync` が EPERM で実行できず `requires_human` になった。同内容を統合テストへ移したが、その統合テストが runner 実行で失敗している。
- 既存 command Job を拡張し、入力検証・冪等性・attempt・routine・lock 継承を再利用した。再試行は新しい attempt で先頭から実行する。判断理由は個票にも記録済み。
- CLI smoke は sandbox の子プロセス起動が EPERM で実行不可。同内容を `tests/src/exec/job-sequence.integration.test.ts` に追加した。unit／integration test、typecheck、lint、全体 schema 検証は指定どおり親 runner に委譲する。
- CHANGELOG 文案（追加）: command Job の `task.steps` で exec・grade・検査を順次実行し、段ごとの停止／継続、lock 待機上限、結果・理由・evidence を記録できるようにした。
- CHANGELOG 文案（追加）: `grade run --lock-wait-timeout-ms` で project grade lock の待機上限を指定できるようにした。
- 人の確認が必要: `node tmp/pjr-v0fq-smoke.mjs`（sandbox の spawnSync が EPERM。確認内容は integration test に保存し、親 runner の環境へ委譲。一時スクリプトは削除済み。）

## 4. 進め方

既存の command Job を拡張した。新しい Job 種別は作らず、`task.steps` を追加して入力検証・冪等性・attempt・routine・lock 継承を再利用した。順次実行の本体は `src/job/sequence.ts` に分離し、lock 待機は `src/shared/lock-wait.ts` の共通処理にした。あわせて schema・設計書・ガイド・定義例を更新し、回帰テストを追加した。
