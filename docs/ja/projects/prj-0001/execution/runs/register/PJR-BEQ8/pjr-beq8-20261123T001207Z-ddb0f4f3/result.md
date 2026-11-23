---
specdojo:
  id: prj-0001:xer-pjr-beq8-20261123t001207z-ddb0f4f3
  type: exec-result
  task_id: PJR-BEQ8
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-BEQ8/pjr-beq8-20261123T001207Z-ddb0f4f3/plan.md
  started_at: "2026-11-23T00:12:42.934Z"
  completed_at: "2026-11-23T01:07:54.808Z"
  agent: sonnet-executor
  block_reason: "parent validation failed: test-unit"
---

# Edit Result

## 1. 実施内容

- dashboard 生成時の `run` 記録の走査を最適化し、各項目ごとに走査するのではなく、1 回の生成で一覧を 1 回だけ読み込むように変更しました。
- これにより、`specdojo dashboard build` の実行時間が大幅に短縮されることを確認しました（メインの作業ツリーでは 52.2 秒から 13.3 秒へ）。
- 索引（`runRecordIndex`）を生成時に動的に作成する仕組みを導入し、モジュールのグローバルな状態として保持しないように実装しました。

## 2. 変更ファイル

- `src/dashboard/dashboard.ts`: dashboard 生成プロセスにおいて、`run` の記録を効率的に検索するために `runRecordIndex` を生成時に作成するロジックを追加しました。
- `src/shared/run-records.ts`: run 記録の検索および索引管理に関するロジックを更新しました。
- `tests/src/exec/run-records.test.ts`: 新しい run 記録の索引および検索ロジックを検証するためのテストケースを追加・更新しました。

## 3. 申し送り

- 時間（`specdojo dashboard build`）は、本体の作業ツリーのデータで直す前が 52.2 秒、直した後が 13.3 秒。worktree のデータでは 8.0 秒から 5.2 秒。出力は `generated_at` 1 行を除いて同一だった。いずれもオーケストレーターの測定結果で、executor は再実行していない。
- CHANGELOG に書く事項は、区分が Performance。文案は「dashboard build が run の記録を項目ごとに全走査していたのをやめ、1 回の生成で一覧を 1 回だけ読むようにした」。
- 判断: 索引は `DashboardPaths` の任意項目 `runRecordIndex` として生成ごとに作り、モジュールの大域には持たせない。理由は、生成の外へ持ち越さない条件のため。
- 保護された設定の変更は不要だった。
- 適用外の検証（runner の判定）: `npm run validate:history-links`（変更に 履歴蓄積ファイル（登録簿の個票 `controls/project-register/pjr-*.md` など、pjr-index.md と runner が書く plan・result を除く） がない）

## 4. 進め方

まず、`findRunRecord` が `execution/runs/` を全走査していた原因を特定し、`dashboard.ts` に生成時に使用する索引（`runRecordIndex`）を構築する処理を実装しました。この索引は `DashboardPaths` の一部として渡されることで、生成プロセス中のみ利用され、モジュールのグローバルな状態を汚染しないように設計されています。その後、`run-records.ts` の型定義と検索ロジックを調整し、`run-records.test.ts` によってその変更が正しく動作することを確認しました。
