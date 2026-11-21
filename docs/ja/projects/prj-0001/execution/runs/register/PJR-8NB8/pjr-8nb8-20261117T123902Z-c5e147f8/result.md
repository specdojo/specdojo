---
specdojo:
  id: prj-0001:xer-pjr-8nb8-20261117t123902z-c5e147f8
  type: exec-result
  task_id: PJR-8NB8
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-8NB8/pjr-8nb8-20261117T123902Z-c5e147f8/plan.md
  started_at: "2026-11-17T12:39:03.831Z"
  completed_at: "2026-11-17T13:22:22.441Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- exec smoke の実装と関連文書を確認し、前回の結合テスト失敗原因だった fixture の文書 ID 不一致を修正しました。build・整形・追加検証・dry-run は成功しました。単体・結合テスト等の再実行は親 runner に委ねます。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/030-project-management/pm-orchestrator-playbook.md`: 変更、+10 / -4 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+35 / -0 行
- `src/exec/commands.ts`: 変更、+2 / -0 行
- `src/register/register.ts`: 変更、+3 / -2 行
- `tests/src/exec/register-pipeline-e2e.integration.test.ts`: 変更、+201 / -1 行
- `src/exec/smoke.ts`: 追加、+252 / -0 行
- `tests/src/exec/smoke.test.ts`: 追加、+84 / -0 行

## 3. 申し送り

- 統合後に npm run build を実行し、新しいプロセスから npx specdojo exec smoke --project prj-0001 --register PJR-JSEY --targets PJR-8NB8 --executor-by claude-executor --reporter-by gemma26-reporter を実行する。実 agent の起動・使用量消費を伴うため executor では未実行。個票の作業 No. 4 は理由付きで open を維持した。結果を確認して No. 4 を更新し、JSEY と PJR-8NB8 の完了条件を確認して close する。この申し送りを result に記載する。
- 設計判断: コマンド名は exec smoke。確認用個票は必須の --register、対象は --targets、executor と reporter は明示指定する。対象は review / done、確認用個票は done / open / review の edit タスクを受け付ける。done の場合だけ reopen する。対象一覧は明示マーカーと既存 JSEY 書式に対応し、重複追記しない。レートリミットは stop。close は他の完了条件を人が判断する必要があるため自動化しない。保護された設定の変更案はない。詳細は個票の対応結果に記録済み。
- CHANGELOG 文案（追加）: specdojo exec smoke で、統合済み項目の確認用個票への対象追記・記帳、開き直し、worktree 実行、今回の start / review と実体 actor の確認を一括実行できるようにした。確認用個票・executor・reporter の指定と dry-run に対応する。
- 前回の親の結合テスト 2 件は、確認用 fixture の文書 ID とファイル名の不一致で対象追記の段に失敗していた。fixture の ID を修正し、正常系 assertion に標準エラーも表示するよう変更した。修正後のテスト結果は親 runner の検証で確認する。カタログ検証は成功したが、未変更の参照に関する警告が残る。
- 適用外の検証: `npm run validate:schema:file`（累積差分の register event YAML は runner 管理の状態遷移記録であり、executor の編集対象外。）
- 人の確認が必要: `npx specdojo exec smoke --project prj-0001 --register PJR-JSEY --targets PJR-8NB8 --executor-by claude-executor --reporter-by gemma26-reporter`（本タスク統合後の新しいプロセスと実 agent 起動・使用量消費が必要。orchestrator が実行し、個票の作業 No. 4 を更新する。）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
