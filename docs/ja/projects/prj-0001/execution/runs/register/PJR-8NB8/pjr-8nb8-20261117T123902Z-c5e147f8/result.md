---
specdojo:
  id: prj-0001:xer-pjr-8nb8-20261117t123902z-c5e147f8
  type: exec-result
  task_id: PJR-8NB8
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-8NB8/pjr-8nb8-20261117T123902Z-c5e147f8/plan.md
  started_at: "2026-11-17T12:39:03.831Z"
  completed_at: "2026-11-17T13:00:55.799Z"
  agent: sol-executor
  block_reason: "parent validation failed: test-integration"
---

# Edit Result

## 1. 実施内容

- 統合済み項目の動作確認（JSEY の手順）を行う新コマンド `specdojo exec smoke` を実装した。確認用個票への対象追記と commit、開き直し、worktree での exec run、今回の start／review と actor の実体名の照合を 1 コマンドで実行する。
- 確認用個票・executor・reporter は引数で指定でき、`--dry-run` に対応する。close は各項目の完了条件の判断が必要なため自動化していない。
- executor の検証では `npm run build`、整形、履歴リンク検証、カタログ検証、登録簿ビルド、JSEY 個票での dry-run、`git diff --check` が成功した。
- runner の `npm run test:integration` は失敗した。`tests/src/exec/register-pipeline-e2e.integration.test.ts` の 931 行目で、出力に `[smoke:run] failed:` が含まれるはずが含まれていない。`npm run lint:ts`、`npm run lint:fm`、`npm run lint:md`、`npm run lint:mermaid`、`npm run lint:d2`、`npm run validate:schema`、`npm run typecheck`、`npm run test:unit` は成功した。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/030-project-management/pm-orchestrator-playbook.md`: JSEY の手作業の手順を、`specdojo exec smoke` を使う手順に更新した。
- `docs/ja/specdojo/references/command-reference.md`: `exec smoke` の使い方と引数をコマンドリファレンスに追記した。
- `src/exec/commands.ts`: `exec smoke` サブコマンドを登録し、確認用個票・対象・executor・reporter・dry-run の引数を追加した。
- `src/register/register.ts`: smoke コマンドから使う register 側の処理を追加または調整した。
- `tests/src/exec/register-pipeline-e2e.integration.test.ts`: smoke の統合テストを追加または更新した。この変更部分が、runner の統合テストで失敗している箇所（931 行目の `[smoke:run] failed:` の検証）である。
- `src/exec/smoke.ts`: 新規。`exec smoke` の本体で、対象一覧への追記と commit、開き直し、exec run、start／review と actor 実体名の照合を実装した。
- `tests/src/exec/smoke.test.ts`: 新規。smoke の単体テスト。

## 3. 申し送り

- `npm run test:integration` が `register-pipeline-e2e.integration.test.ts` の smoke 失敗系ケースで失敗している。出力に `[smoke:run] failed:` が含まれない原因を調べて修正するまで、このタスクは完了にできない。失敗の詳細は `parent-validation-attempt-1-test-integration.log` にある。
- 個票の作業 No. 4（統合後の新しいプロセスでの実 agent による確認）は、実 agent の起動が必要なため open のままである。
- 統合後に本体で npm run build を実行し、新しいプロセスから npx specdojo exec smoke --project prj-0001 --register PJR-JSEY --targets PJR-8NB8 --executor-by claude-executor --reporter-by gemma26-reporter を1回実行してください。実 agent の起動と使用量消費が必要なため、個票の作業 No. 4 は理由付きで open としています。確認後に更新し、result にも引き継いでください。
- 設計判断: 確認用個票・executor・reporter は引数で明示します。対象一覧は専用コメントまたは JSEY の既存書式に対応し、本文の変更を commit に記帳します。今回追加された start／review と実体 actor を照合します。close は各項目の完了条件の判断が必要なため自動化せず、確認後に register close --commit を使います。保護された設定の変更案はありません。
- CHANGELOG 文案（追加）: `specdojo exec smoke` で、統合済み項目の確認用個票への対象追記・記帳、開き直し、worktree 実行、今回の start／review と実体 actor の確認を一括実行できるようにした。確認用個票・executor・reporter の指定と dry-run に対応する。
- 人の確認が必要: `npx specdojo exec smoke --project prj-0001 --register PJR-JSEY --targets PJR-8NB8 --executor-by claude-executor --reporter-by gemma26-reporter`（統合後の新しいプロセスと実 agent による確認を orchestrator に引き継ぐ。）

## 4. 進め方

executor の evidence をもとに、変更ファイルごとの内容と検証結果を整理した。runner の統合テストが失敗しているため、成功とは扱わず、失敗箇所と次の対応を申し送りに記載した。
