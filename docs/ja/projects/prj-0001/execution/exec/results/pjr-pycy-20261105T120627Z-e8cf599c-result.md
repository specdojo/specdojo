---
specdojo:
  id: prj-0001:xer-pjr-pycy-20261105t120627z-e8cf599c
  type: exec-result
  task_id: PJR-PYCY
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-pycy-20261105T120627Z-e8cf599c-plan.md
  started_at: "2026-11-05T12:06:35.957Z"
  completed_at: "2026-11-05T12:16:34.702Z"
  agent: sol-executor
  approach: retrofit
  targets:
    - prj-0001:stsd-job-run
---

# Edit Result

## 1. 実施内容

- `stsd-job-run` を新設し、5状態（`running`, `succeeded`, `partial`, `failed`, `noop`）と `attempt`（試行）、`checkpoint`（チェックポイント）の管理を含む状態遷移を定義しました。
- 実装エビデンス `src/job/job.ts` および `src/job/definition.ts` に基づき、状態遷移のロジックを正確に反映しました。
- 状態遷移図が複雑になったため、`stsd-mermaid-rulebook.md` の規定に基づき、2つの図に分割して構成しました。
- 成果物に対する整形（`prettier`）を確認済みです。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/020-data-model/stsd-job-run.md`: `stsd-job-run` を新規作成しました。5つの状態定義、試行（`attempt`）およびチェックポイント（`checkpoint`）の管理、およびそれらに関連する状態遷移図（図の分割を含む）を記載しました。

## 3. 申し送り

- 判断は新設。対象文書は存在せず、カタログに `path`・`done_criteria` が定義済み。変更は `docs/ja/product/010-business-specs/020-data-model/stsd-job-run.md` のみ。result・実装・Kata は編集していない。
- 実装エビデンス `src/job/job.ts` と `src/job/definition.ts` を全読した。5状態と試行の型、開始時の試行追加、最新試行への結果記録、成功・部分成功・処理不要の重複抑止、失敗・実行中の再試行、checkpoint 更新条件、状態を変えないレビュー記録を反映した。実行中への接続が6本を超えるため図を2分割した。
- 意図との照合: カタログの5状態・`attempt` を含む範囲と実装は一致。既存文書との乖離は対象文書がないため該当なし。依存先 `prj-0001:bdd-job-run` は未作成で、業務上の状態名・受入条件の合意は確認不能。`based_on` は空とし、作成後の照合を記載した。
- 未確認・判断待ち: 呼出元による結果選択、排他制御、残留試行の復旧は指定エビデンス外であり調査していない。結果保存に遷移元の制限がない点は未決事項とした。BA・PO・ARC 等による合意後、文書への結果訂正遷移追加または別タスクでの実装制限を検討する。
- 判断は新設。対象文書は存在せず、カタログに path・`done_criteria` が定義済み。変更は docs/ja/product/010-business-specs/020-data-model/stsd-job-run.md のみ。result・実装・Kata は編集していない。
- 実装エビデンス src/job/job.ts と src/job/definition.ts を全読した。5状態と試行の型、開始時の試行追加、最新試行への結果記録、成功・部分成功・処理不要の重複抑止、失敗・実行中の再試行、checkpoint 更新条件、状態を変えないレビュー記録を反映した。実行中への接続が6本を超えるため図を2分割した。
- 意図との照合: カタログの5状態・attempt を含む範囲と実装は一致。既存文書との乖離は対象文書がないため該当なし。依存先 `prj-0001:bdd-job-run` は未作成で、業務上の状態名・受入条件の合意は確認不能。`based_on` は空とし、作成後の照合を記載した。
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/product/ 配下のみで、docs/ja/projects/ 配下の変更はない。）
- 適用外の検証: `npm run validate:history-links`（executor は登録簿個票・既存 plan・result を変更していない。）

## 4. 進め方と実践の型の適用

新設（対象文書が存在しなかったため、カタログの `path` と `done_criteria` に基づき、rulebook に則って新規作成）
