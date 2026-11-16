---
specdojo:
  id: prj-0001:xer-pjr-30sa-20261116t112318z-04e75f0f
  type: exec-result
  task_id: PJR-30SA
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-30SA/pjr-30sa-20261116T112318Z-04e75f0f/plan.md
  started_at: "2026-11-16T11:23:18.883Z"
  completed_at: "2026-11-16T11:55:46.765Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- specdojo git、共通ロックの継承、pre-commit 警告と scaffold、単体・結合テストを追加しました。playbook・リファレンス・個票を更新し、保護設定の反映案を記録しました。指定されたテスト・静的検査は親 runner が実行します。result は編集していません。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/030-project-management/pm-orchestrator-playbook.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+19 / -2 行
- `src/shared/cross-process-lock.ts`: 変更、+11 / -1 行
- `src/shared/git-environment.ts`: 変更、+3 / -1 行
- `src/shared/lefthook-scaffold.ts`: 変更、+3 / -0 行
- `src/specdojo.ts`: 変更、+2 / -0 行
- `templates/lefthook/tools/specdojo-pre-commit.mjs`: 変更、+8 / -0 行
- `tests/src/shared/lefthook-scaffold.test.ts`: 変更、+2 / -1 行
- `src/commands/git.ts`: 追加、+213 / -0 行
- `tests/src/commands/git.integration.test.ts`: 追加、+220 / -0 行
- `tests/src/commands/git.test.ts`: 追加、+146 / -0 行

## 3. 申し送り

- 保護設定案: lefthook.yml の pre-commit.commands に git-lock-warning を追加し、run を `node --import tsx src/specdojo.ts git --project prj-0001 --warn-unlocked` とする。既存設定は変更していないため、利用者の承認後に feature ブランチで反映する。
- 保護設定案: .agents/specdojo-orchestrator.agent.md に「orchestrator の commit・merge・add・rm・restore・checkout など、書き込みを伴う Git 操作は `specdojo git --project &lt;id&gt; -- &lt;Git の引数&gt;` を通す。既存の承認・ブランチ方針を守り、register の記帳は引き続き register ... --commit を使う」と追記する。承認後に npm run orchestrator:sync と npm run lint:orchestrator-sync で全ラッパー・配布テンプレートへ同期する。
- 設計判断: 読み取りの許可リストを採用し、alias・未知のサブコマンド、--output、-c / --config-env は書き込みとして扱う。誤った場所での排他を避けるため、未知の Git グローバルオプションと bare repository への書き込みは拒否する。既存の heartbeat 付きロックで異常終了後の回収ができるため依存追加は不要。同じ worktree・project の runner と直列化する。個票5.1節にも記録済み。
- 統合後は運用メモ6.1節に従って PJR-JSEY で確認する。保護設定の反映後、run 中の直接 commit は警告し、specdojo git と runner の commit は警告しないことを確認する。
- CHANGELOG 文案（追加）: `specdojo git -- &lt;Git の引数&gt;` で Git の書き込みを runner と同じ lifecycle ロックに並べ、hook の実行中も排他する。読み取りはロックを待たず、lefthook scaffold は run 中のロックなし commit を警告する。個票5.4節にも記録済み。
- 適用外の検証: `npm run validate:schema:file`（executor 自身が変更した YAML / YML ファイルはない。）
- 人の確認が必要: `npx specdojo exec run --project prj-0001 --register PJR-JSEY --worktree --executor-by claude-executor`（統合後、運用メモ6.1節の対象追加・reopen 後に実行する。実 agent の起動と利用枠の消費を伴うため executor sandbox では実行しない。）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
