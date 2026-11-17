---
specdojo:
  id: prj-0001:xer-pjr-jkqx-20261117t035709z-7aabcef3
  type: exec-result
  task_id: PJR-JKQX
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-JKQX/pjr-jkqx-20261117T035709Z-7aabcef3/plan.md
  started_at: "2026-11-17T03:57:10.290Z"
  completed_at: "2026-11-17T04:14:27.643Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- where &lt;kind&gt; を実装し、旧6入口を非推奨の互換入口として維持。文書・テスト・個票を更新した。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/040-user-interface-model/clis-exec-commands.md`: 変更、+3 / -3 行
- `docs/ja/product/040-system-design/sysd-orchestrator-agent-settings.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/guides/routine-operation-guide.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/guides/waza-guide.md`: 変更、+2 / -0 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+19 / -8 行
- `src/catalog/catalog.ts`: 変更、+13 / -12 行
- `src/dashboard/timeline.ts`: 変更、+17 / -16 行
- `src/exec/commands.ts`: 変更、+16 / -15 行
- `src/job/job.ts`: 変更、+15 / -16 行
- `src/routine/routine.ts`: 変更、+18 / -18 行
- `src/schedule/schedule.ts`: 変更、+35 / -35 行
- `src/specdojo.ts`: 変更、+2 / -0 行
- `templates/opencode/agents/specdojo-orchestrator.md`: 変更、+1 / -1 行
- `src/commands/where.ts`: 追加、+30 / -0 行
- `src/shared/where-alias.ts`: 追加、+22 / -0 行
- `tests/src/commands/where.integration.test.ts`: 追加、+150 / -0 行

## 3. 申し送り

- 実装変更: `src/commands/where.ts` と `src/shared/where-alias.ts` を追加。`src/specdojo.ts`、`src/catalog/catalog.ts`、`src/dashboard/timeline.ts`、`src/exec/commands.ts`、`src/job/job.ts`、`src/routine/routine.ts`、`src/schedule/schedule.ts` を更新。各種類の既存表示・project解決・終了コードを共有し、最上位の `where &lt;kind&gt;` へ集約した。旧入口は導入版の1版だけ残し、次版で削除する。
- 文書変更: command-reference、waza-guide、routine-operation-guide、clis-exec-commands、sysd-orchestrator-agent-settings、配布用 `templates/opencode/agents/specdojo-orchestrator.md` と個票を更新。`tests/src/commands/where.integration.test.ts` に互換性・エラー・一覧・副作用・ヘルプの回帰テストを追加。実行は親runnerに委ねる。
- 保護設定の変更案: 承認後のfeatureブランチで、`.agents/specdojo-orchestrator.agent.md` のコマンド地図に `where &lt;kind&gt; --project &lt;project-id&gt;` を追加する。`.opencode/agents/gemma-orchestrator.md` と `.opencode/agents/qwen-orchestrator.md` の `permission.bash` は旧許可を `"specdojo where *": allow` へ置換する。その後 `npm run orchestrator:sync` と `npm run lint:orchestrator-sync` を実行する。詳細は個票5.2節に記録済み。
- CHANGELOG案（個票5.4節にも記録）: 追加—`specdojo where &lt;kind&gt;` で6種類の保存先を確認できる。変更—旧 `&lt;kind&gt; where` は1版だけ残し、標準エラーへ移行先と削除予定を警告する。通常のヘルプ・利用文書は新構文へ移行する。
- `npm run check` の型検査・lint・schema・単体／統合テストは重複実行禁止に従って親runnerへ委ねた。残りの検査は通過。集約コマンド自体はホスト側で確認する。catalogには既存の未作成文書・再エクスポート参照に関する警告が残るが、エラーはない。resultは編集していない。
- 適用外の検証: `npm run validate:schema:file`（executor自身が変更した `*.yaml` / `*.yml` ファイルはない。既存のイベント変更はrunner管理分。）
- 人の確認が必要: `npm run check`（子プロセス起動がsandboxでEPERMになるため、集約確認はホスト側で実施する。指定された型検査・lint・schema・単体／統合テストは親runnerが実行する。）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
