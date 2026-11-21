---
specdojo:
  id: prj-0001:xer-pjr-d948-20261116t005410z-2164d220
  type: exec-result
  task_id: PJR-D948
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-D948/pjr-d948-20261116T005410Z-2164d220/plan.md
  started_at: "2026-11-16T00:54:32.851Z"
  completed_at: "2026-11-16T01:05:43.601Z"
  agent: opus-executor
  approach: sample-maintenance
  targets:
    - specdojo:bds-sample
---

# Edit Result

## 1. 実施内容

- bds-sample に 09:50 の grade の F001〜F004 を取り込み（数量を確認版の販売集合と基準時点で固定、前週の不一致時の比較不可、不明・不完全の並び順）、個票の作業内容 No 5 を done、対応結果を追記した。再 grade の No 6 は orchestrator 待ちで open。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bds-sample.md`: 変更、+19 / -18 行

## 3. 申し送り

- `grade run --target kata` での bds-sample の再 grade は orchestrator が流す。個票 PJR-D948 の作業内容 No 6 は open のまま。
- 決定: 確定した確認版がある日の販売数は、その版が参照する日次販売集計の販売集合（売上 ID の集合）の明細を、集計の基準時点の状態で合計する（cdsd-sample の日次販売集計の定義を流用し、新しい記録を発明しない）。
- 決定: 締めの確定後の訂正・追加は新しい確認版の確定まで反映せず、記録の注意に「締め後の訂正あり」と載せて再出力を促す（cdsd-sample の締め確定後の訂正の扱いに合わせた）。
- 決定: 「不完全」はその数値で並べ、「不明」は数値を持つ商品の後に五十音順で並べる。
- 決定: 前週の報告に販売件数の不一致の日があるときは、前週の明細にない商品も「比較不可」とする。

## 4. 進め方と実践の型の適用

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
