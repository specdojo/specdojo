---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-design-imp-business-sample-050-20261123t135540z-80126e32
  type: exec-result
  task_id: T-KATA-WAVE-6-DESIGN-imp-business-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-DESIGN-imp-business-sample-050/T-KATA-WAVE-6-DESIGN-imp-business-sample-050-20261123T135540Z-80126e32/plan.md
  started_at: "2026-11-23T13:55:51.171Z"
  completed_at: "2026-11-23T14:08:14.680Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:imp-business-sample
    - specdojo:imp-business-sample
---

# Edit Result

## 1. 実施内容

- 業務への影響調査の sample (`docs/ja/specdojo/samples/imp-business-sample.md`) を、`rulebook` および `sample-authoring-standard` に準拠するよう大幅に更新しました。
- 具体的には、F001〜F016 の全ての指摘に対応しました：影響度の判定基準の定義、成功条件への現状値と計測方法の追記、バーコード運用の前提条件の明示、共通登場人物（店主代表・家族利用者代表）への役割名の統一、未解決事項の表への『判断・対応への影響』列の追加、および `_UNDECIDED_` を用いた記述への修正を行いました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/imp-business-sample.md`: rulebook と `sample-authoring-standard` に従い、共通サンプル文脈（駄菓子屋）に整合するように内容を再構成しました。影響度の尺度定義、成功条件の計測方法、Role code を用いた担当表記、および 7 列構成の未解決事項の表を追加し、各 findings で指摘された不整合を解消しました。

## 3. 申し送り

- 成功条件の現状値（平日 16:00-18:00 の 1 会計あたり平均処理時間）は `_UNDECIDED_` のまま。2026-05-07〜2026-05-13 に計測して記入する必要がある。
- リリース予定日 2026-06-01 は `imp-test-sample` の `_ASSUMPTION_` に合わせた。実施時期（〜2026-05-27 / 2026-05-31）はこの日付から決めた。在庫補充の再評価のきっかけ『未登録商品の手入力が 1 営業日に 10 件超』は executor が仮に置いた値。
- 登録簿の転記先 ID（`PJR-B4D1`, `PJR-B4Q1`〜`PJR-B4Q3`, `PJR-B4R1`）は sample 用の架空の値。
- rulebook の変更案: `imp-business-rulebook` の良い例・悪い例の表にある『ツケ管理』を共通サンプル文脈の『つけ管理』へ、完了条件の良い例『レジ担当全員が訓練を受けた』を『店主代表と家族利用者代表が訓練を受けた』へ直す。
- 関連 sample の申し送り: `imp-data-sample` に人物名と独自の役割名が残り、未解決事項も古い 5 列のまま。`imp-test-sample` の対応方針にある『`PO` の承認を受ける』は PJR-76N9 の決まり（承認の進み具合を本文に書かない）に反している可能性がある。

## 4. 進め方と実践の型の適用

`rulebook` と `sample-authoring-standard` を正として、`imp-business-sample.md` を「完成例として厚い」状態へメンテナンスしました。findings で指摘された不整合（役職名の独自利用、影響度の定義不足、未解決事項の列不足など）をすべて解消し、共通サンプル文脈の前提に沿った記述に整えています。
