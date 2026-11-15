---
specdojo:
  id: prj-0001:xer-pjr-2c9w-20261115t183258z-931d41d7
  type: exec-result
  task_id: PJR-2C9W
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-2C9W/pjr-2c9w-20261115T183258Z-931d41d7/plan.md
  started_at: "2026-11-15T18:33:15.601Z"
  completed_at: "2026-11-15T19:18:01.199Z"
  agent: opus-executor
  approach: fully-guided
  targets:
    - prj-0001:stsd-task-execution
---

# Edit Result

## 1. 実施内容

- stsd-task-execution に、担当アクター（claim の持ち主）の決まり方・保たれ方・移り方、それに基づく操作権限、同じ時刻の記録の再生の順序を定めた（PJR-M495・T4G3 の実装に合わせた）。互換の扱いと「今後の検討メモ」（上流辞書との照合、PO による承認）も足した。個票の対応結果も書いた。status は draft のまま。直した後の grade はやり直していない。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/020-data-model/stsd-task-execution.md`: 変更、+24 / -16 行

## 3. 申し送り

- 決めたこと: 権限は最新の記録者ではなく claim の持ち主（担当アクター）にあるとした。`note`・`link`・`estimate`・`block`、引き取りを指定しない `unblock` では担当アクターは変わらず、人が引き取りを指定した `unblock` だけで移る。根拠は PJR-M495・T4G3 で統合済みの現在の動作。
- 決めたこと: 同じ時刻の記録の選択の補助には、直前の記録者を使い続ける。PJR-M495 が、既存の順序づけへの影響を避けるために変えなかったため。
- 本文に足さなかった指摘: F011（検証手順への案内）と、F008・F015 のうち実装の関数への案内。rulebook は STSD に検証手順の章を求めず、関数を業務の記述として載せることも禁じているため。並びの規則は業務の言葉で本文に書いた。
- 次の作業: `grade run --target deliverable` で grade をやり直し、結果を PJR-2C9W の対応結果に追記する（executor では実行していない）。
- 留保: 上流の `bdd-exec-state`・`bdd-exec-event` との照合は、両辞書の作成時に BA が行う。権限の規則の業務承認は、PO が 140 で行う（追跡先は PJR-TN43）。

## 4. 進め方と実践の型の適用

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
