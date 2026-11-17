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
  completed_at: "2026-11-17T13:11:38.887Z"
  agent: sol-executor
  block_reason: "parent validation failed: test-integration"
---

# Edit Result

## 1. 実施内容

- JSEY（runner 変更の統合後の動作確認）の手作業を、新コマンド `specdojo exec smoke` として実装しました。このコマンドは、確認用個票への対象 ID 追記と記帳、done 時の reopen、worktree での `exec run --register`、start / review の確認、actor の実体名の確認を一括で行います。
- `--dry-run` で全段の手順表示と、`claude-executor` から実体 actor `sonnet-executor` への解決を確認しました。
- 親 runner の `npm run test:integration` は失敗しました。失敗箇所は `tests/src/exec/pipeline-e2e.integration.test.ts` の resume 後の invocation 比較です。executor は、前回失敗した `smoke` 関連 fixture の文書 ID 不一致を修正しています。この結合テスト失敗が今回の変更によるものかは、evidence だけでは判断できません。
- `npm run lint:ts`、`lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`validate:schema`、`typecheck`、`test:unit` は runner 検証で passed でした。
- 実 agent を起動する実機の smoke 実行は、使用量を消費するため executor では未実行です。orchestrator が実行します。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/030-project-management/pm-orchestrator-playbook.md`: 運用メモの JSEY の手作業手順を、`exec smoke` コマンドを使う手順へ置き換えました。
- `docs/ja/specdojo/references/command-reference.md`: `exec smoke` のコマンドリファレンスを追記しました。引数、動作、dry-run を記載しています。
- `src/exec/commands.ts`: `exec smoke` サブコマンドを登録しました。`--project`、`--register`、`--targets`、`--executor-by`、`--reporter-by`、`--dry-run` を受け付けます。
- `src/register/register.ts`: smoke コマンドが利用できるよう、register 側の処理を調整しました。
- `tests/src/exec/register-pipeline-e2e.integration.test.ts`: smoke の結合テストの fixture を修正しました。文書 ID とファイル名の不一致を直し、正常系 assertion に標準エラーも表示するようにしました。
- `src/exec/smoke.ts`: 新規追加。`exec smoke` の本体です。確認用個票への対象一覧の追記（明示マーカーと既存 JSEY 書式に対応し、重複追記しない）、done 時のみの reopen、worktree での exec run、start / review と実体 actor の確認を担います。レートリミット時は stop します。
- `tests/src/exec/smoke.test.ts`: 新規追加。smoke の対象追記、重複回避、状態判定などの単体テストです。

## 3. 申し送り

- 親 runner の `npm run test:integration` は失敗しています。失敗箇所は `pipeline-e2e.integration.test.ts` の resume 後の invocation 比較です。本タスクの変更との関係は未確認なので、統合前に原因を切り分けてください。
- `catalog validate` の未変更の参照に関する警告は残っています。
- 統合後に npm run build を実行し、新しいプロセスから npx specdojo exec smoke --project prj-0001 --register PJR-JSEY --targets PJR-8NB8 --executor-by claude-executor --reporter-by gemma26-reporter を実行する。実 agent の起動・使用量消費を伴うため executor では未実行。個票の作業 No. 4 は理由付きで open を維持した。結果を確認して No. 4 を更新し、JSEY と PJR-8NB8 の完了条件を確認して close する。この申し送りを result に記載する。
- 設計判断: コマンド名は exec smoke。確認用個票は必須の --register、対象は --targets、executor と reporter は明示指定する。対象は review / done、確認用個票は done / open / review の edit タスクを受け付ける。done の場合だけ reopen する。対象一覧は明示マーカーと既存 JSEY 書式に対応し、重複追記しない。レートリミットは stop。close は他の完了条件を人が判断する必要があるため自動化しない。保護された設定の変更案はない。詳細は個票の対応結果に記録済み。
- CHANGELOG 文案（追加）: specdojo exec smoke で、統合済み項目の確認用個票への対象追記・記帳、開き直し、worktree 実行、今回の start / review と実体 actor の確認を一括実行できるようにした。確認用個票・executor・reporter の指定と dry-run に対応する。
- 前回の親の結合テスト 2 件は、確認用 fixture の文書 ID とファイル名の不一致で対象追記の段に失敗していた。fixture の ID を修正し、正常系 assertion に標準エラーも表示するよう変更した。修正後のテスト結果は親 runner の検証で確認する。カタログ検証は成功したが、未変更の参照に関する警告が残る。
- 適用外の検証: `npm run validate:schema:file`（累積差分の register event YAML は runner 管理の状態遷移記録であり、executor の編集対象外。）
- 人の確認が必要: `npx specdojo exec smoke --project prj-0001 --register PJR-JSEY --targets PJR-8NB8 --executor-by claude-executor --reporter-by gemma26-reporter`（本タスク統合後の新しいプロセスと実 agent 起動・使用量消費が必要。orchestrator が実行し、個票の作業 No. 4 を更新する。）

## 4. 進め方

個票と関連設計を確認し、手作業の JSEY 手順を `src/exec/smoke.ts` の独立コマンドに切り出しました。コマンドは `exec` に登録しています。dry-run、単体テスト、結合テストの fixture 修正、リファレンスと運用メモの更新で裏付けています。実 agent を使う実機確認は、使用量を消費するため orchestrator に委ねました。
