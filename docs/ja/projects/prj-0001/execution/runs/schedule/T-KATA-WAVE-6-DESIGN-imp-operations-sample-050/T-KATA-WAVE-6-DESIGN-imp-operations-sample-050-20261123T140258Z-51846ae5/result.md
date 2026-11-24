---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-design-imp-operations-sample-050-20261123t140258z-51846ae5
  type: exec-result
  task_id: T-KATA-WAVE-6-DESIGN-imp-operations-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-DESIGN-imp-operations-sample-050/T-KATA-WAVE-6-DESIGN-imp-operations-sample-050-20261123T140258Z-51846ae5/plan.md
  started_at: "2026-11-23T14:03:05.786Z"
  completed_at: "2026-11-23T14:20:12.882Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:imp-operations-sample
    - specdojo:imp-operations-sample
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/samples/imp-operations-sample.md` を、駄菓子屋の共通サンプル文脈（店主一人・タブレット1台）に適合するように大幅に改訂しました。
- 具体的には、人物名（井上・山本等）や特定の組織・体制（SRE・シフト体制）を、役割名（`PO`・`OPS` 等）や Job code に置き換え、技術的前提を `_ASSUMPTION_` で明示しました。
- また、`specdojo:imp-operations-rulebook` の要求に基づき、判定基準、境界値、成功条件、対象期間、および `rulebook` の 4 観点（運用品質・障害対応力・継続運用性・利用者影響）に沿った判定項目を追加しました。
- 未解決事項については、具体的な数値や判断基準の代わりに `_UNDECIDED_` を用いることで、ルールに則った完成例としての厚みを持たせています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/imp-operations-sample.md`: 共通の駄菓子屋文脈（店主一人・タブレット1台）に基づき、内容を大幅に拡充。人名を役割名へ、技術的前提（監視基盤の定義等）を `_ASSUM_` 記述へ修正し、`rulebook` が求める 4 観点や成功条件、未解決事項の扱いを反映させた。

## 3. 申し送り

- F003・F023（承認者の明記）は PJR-76N9 に従い sample 本文に足していない。対応方針を確定させる承認者と承認前の確認事項は、登録簿の個票で追う。
- 利用者が決める値: 初動開始の上限時間（未解決事項 `PJR-O4Q1`、期限 2026-05-15、担当 `PO`）。sample では `_UNDECIDED_` とし、決まるまでは「その日の閉店までに把握する」を下限として判定している。
- rulebook 変更案: 対応方針の必須列に「完了条件」を加えるか検討する。sample では完了判定ができるよう列を足したが、rulebook の必須列にはない（F004 への対応）。
- rulebook と兄弟 sample の不整合: rulebook は `based_on` に変更要求の個票 ID（`PJR-XXXX`）を求めるが、`imp-*` の sample 群はどれも `cr-2026-004` を使っている。本 sample は兄弟と揃えて `cr-2026-004` を残し、前提とした影響調査（業務・データ）の sample ID を追加した。sample 群でまとめて `PJR-XXXX` 形式へ揃えるか判断が必要。
- sample 内の `PJR-O4Q1`・`PJR-O4R1`・`PJR-O4D1` は架空の登録項目 ID。切替日 2026-06-01 は影響調査（データ）の sample と同じ仮定。

## 4. 進め方と実践の型の適用

`docs/ja/specdojo/samples/imp-operations-sample.md` を、`specdojo:imp-operations-rulebook` の内容および `specdojo:downloads/sample-authoring-standard.md` の記述規約に則って、駄菓子屋プロジェクトの完成例として厚くする。`finding` で指摘された不整合（人名の使用、評価観点の不足、判定基準の未定義など）を解消し、`_UNDECIDED_` を適切に用いて、実用的なサンプルへと更新する。
