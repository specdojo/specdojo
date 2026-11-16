---
specdojo:
  id: prj-0001:xer-pjr-3hxq-20261115t165137z-189cfb3f
  type: exec-result
  task_id: PJR-3HXQ
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-3HXQ/pjr-3hxq-20261115T165137Z-189cfb3f/plan.md
  started_at: "2026-11-15T17:03:31.139Z"
  completed_at: "2026-11-15T20:28:20.435Z"
  agent: opus-executor
  approach: fully-guided
  targets:
    - sld-specdojo
---

# Edit Result

## 1. 実施内容

- sld-specdojo へ F001〜F015 を反映済みであることを確認した（grade 実行時状態と .specdojo 設定の行の追加、generated 削除手順・worktree 記述の訂正、対応表・未決事項の整理）。status は draft のまま。個票の対応結果も記入済み。再 grade は agent 起動が必要なため `requires_human` とした。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/020-data-model/sld-specdojo.md`: 変更、+51 / -47 行

## 3. 申し送り

- 再 grade が未了: `grade run --target deliverable` で sld-specdojo を grade し直し、結果を PJR-3HXQ 個票の「対応結果」へ追記する（agent 起動が必要なため executor では実行していない）。
- executor の判断: CDSD 追加候補の `_TODO_` は、本書側では配置が確定しているため未決ではないと判断して外した。CDSD 側への登録は Schedule の業務データ辞書作成・CDSD 改訂（計画済み作業）で扱い、二重追跡を避けるため管理台帳へは起票しない。該当タスクが Schedule にない場合は PM が追加する。
- 留保: 監視結果・費用作業記録の保管先と保持期間は `_UNDECIDED_` のまま残した。OPS・ARC が方式を比較し、PO が決める。期限は報告・監視の運用開始前で、ready 昇格の判断時点で未決なら PO が留保を続けるかどうかを判断する。追跡先は cdsd-sharing が指す `prj-0001:cdfd-reporting` の未決事項で、期限を過ぎたら PM が decision として起票する。この留保が残るため、F015 相当の指摘は再 grade でもこの範囲で残る見込み。
- grade の `runs/&lt;run-id&gt;/` を削除してよい条件の一部（結果が grade/results/ へ反映済みであること）は、既存本文と src/grade/run.ts の配置から導いた。runs/ を自動で片付ける処理があるかは確認していない。
- 人の確認が必要: `grade run --target deliverable`（agent CLI の起動と利用枠の消費が必要なため、runner または人が sld-specdojo を再 grade して個票の対応結果へ追記する）

## 4. 進め方と実践の型の適用

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
