---
specdojo:
  id: prj-0001:xer-pjr-sazc-20261020t223735z-e2c0
  type: exec-result
  task_id: PJR-SAZC
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-sazc-20261020T223735Z-e2c0-plan.md
  started_at: "2026-10-20T22:37:35.426Z"
  completed_at: "2026-10-20T22:57:23.443Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- 本リポジトリの `orch:*` スクリプトを `specdojo orchestrator launch` 経由で実行できるように変更し、固定 worktree からの起動（`orch:opus:work` 等）への対応を完了させた。
- これにより、`--add-dir` オプション等を用いた外部プロダクトリポジトリの利用が適切に許可されるようになる。
- また、中断原因となっていた integration test における JSON 解析エラー（worktree 関連の出力処理）を修正した。

## 2. 変更ファイル

- `docs/ja/product/040-system-design/sysd-orchestrator-agent-settings.md`: Orchestrator エージェントの設定に関する設計書を更新した。
- `docs/ja/specdojo/guides/orchestrator-operation-guide.md`: Orchestrator の運用ガイドを更新した。
- `src/commands/orchestrator.ts`: `orchestrator` コマンドの実装を更新し、launch 経由の起動に関するロジックを変更した。
- `src/shared/specdojo-config.ts`: `specdojo-config` の構成定義を更新した。
- `tests/src/commands/orchestrator.test.ts`: `orchestrator` コマンドのユニットテストを更新した。
- `tests/tools/open-agent-worktree.integration.test.ts`: integration test を更新し、worktree 関連の出力解析に関する修正を適用した。
- `tools/worktree/open-agent-worktree.sh`: worktree 操作用のヘルパースクリプトを更新した。

## 3. 申し送り

- `package.json` の一部変更（`orch:*` スクリプトの書き換え）については、直接書き換えず、個票に適用案を記録している。利用者はこの提案を確認し、手動で反映を行った上で、実環境での動作（`npm run orch:opus` 等）を確認する必要がある。
- 人の確認が必要: `SPECDOJO_PROJECT=prj-0002 npm run orch:opus`（承認後に package.json の提案を反映し、実 Claude CLI の対話起動と追加リポジトリ許可を確認する必要がある。）
- 人の確認が必要: `SPECDOJO_PROJECT=prj-0002 npm run orch:opus:work`（承認後に package.json の提案を反映し、固定 worktree からの実 Claude CLI 起動を確認する必要がある。）

## 4. 進め方

まず、`specdojo orchestrator launch` を経由して起動する仕組みを整えるため、`src/commands/orchestrator.ts` および関連する設定ファイルを変更した。その後、固定 worktree からの起動をサポートするための `tools/worktree/open-agent-worktree.sh` の更新および、それに関連する統合テスト（`tests/tools/open-agent-worktree.integration.test.ts`）の修正を行った。テスト実行時に発生していた JSON 解析エラーの解消も含めて実施している。
