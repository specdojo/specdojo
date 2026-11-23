---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-design-imp-interface-sample-050-20261123t140155z-8b387d4e
  type: exec-result
  task_id: T-KATA-WAVE-6-DESIGN-imp-interface-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-DESIGN-imp-interface-sample-050/T-KATA-WAVE-6-DESIGN-imp-interface-sample-050-20261123T140155Z-8b387d4e/plan.md
  started_at: "2026-11-23T14:02:03.857Z"
  completed_at: "2026-11-23T14:12:30.686Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:imp-interface-sample
    - specdojo:imp-interface-sample
---

# Edit Result

## 1. 実施内容

- I/F への影響調査の sample (`docs/ja/specdojo/samples/imp-interface-sample.md`) を、他の sample (`ifx-index-sample`, `imp-data-sample`) との構成整合性を高めた完成例として書き換えました。
- grade から指摘された 8 件の finding (`F001`〜`F008`) に対応する修正を実施しました。具体的には、適用範囲の明示、未解決事項における影響の記述、成功条件の追記、関連文書への参照、再評価条件の統一、および I/F 名と担当者名の表記揺れの解消を行いました。
- PJR-76N9 の規定に従い、文書の目的や適用範囲において「誰が合意・承認するか」という記載は含めず、判断のタイミング（改修着手前）に留めています。
- `prettier` および `markdownlint` による検証をパスしています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/imp-interface-sample.md`: 共通サンプル文脈における I/F 影響調査の完成例として、内容を拡充。適用範囲に成功条件や検討対象期間を追記し、未解決事項の表に影響の波及に関する列を追加。また、I/F 名の表記揺れや担当者名の揺れを統一し、再評価の条件を一本化した。

## 3. 申し送り

- F001（`vp-po-decision-readiness`）: 判断の時期（I/F の改修着手 2026-05-11 より前）は本文に書いた。誰が承認するかは PJR-76N9 の決まりに従い sample の本文に書いていない。grade の viewpoint を、文書の承認者を求めない形に直す提案として result に記録してほしい。
- I/F の構成の変更: 元の 4 I/F（POS 連携 API、商品マスタ連携 CSV、通知 Webhook、売上集計バッチ連携）は、ifx-index-sample と imp-data-sample の波及先（`ifx-api-kinuya-products` / `ifx-api-kinuya-sales`）に合わず、取引先との CSV 連携は共通サンプル文脈の対象外とも食い違うため、ifx-index-sample の 3 I/F と検討中の在庫変更イベント（ifx-msg-sample）に置き換えた。
- rulebook の変更案: rulebook の「推奨 Frontmatter 項目」は `based_on` に変更要求の個票 ID（`PJR-XXXX`）を求めているが、`imp-*` の sample はすべて `cr-2026-004` を使っている。sample 群をまとめて個票 ID の形へ直すか、rulebook の例を合わせるかは別のタスクで決める必要がある。
- 決める必要のある値: バーコード照会の応答を待てる時間の上限は `_UNDECIDED_` とし、未解決事項 `PJR-I6Q2`（担当 `PO`）に残した。切替日 2026-06-01 は imp-data・imp-test と同じ `_ASSUMPTION_` としている。
- F001（vp-po-decision-readiness）: 判断の時期（I/F の改修着手 2026-05-11 より前）は本文に書いた。誰が承認するかは PJR-76N9 の決まりに従い sample の本文に書いていない。grade の viewpoint を、文書の承認者を求めない形に直す提案として result に記録してほしい。

## 4. 進め方と実践の型の適用

`docs/ja/specdojo/standards/sample-authoring-standard.md` に基づき、`docs/ja/specdojo/samples/imp-interface-sample.md` を編集。`grade` による指摘事項を解消しつつ、実例としての厚みを持たせるために、成功条件や未解決事項の「影響」に関する記述を拡充した。また、既存の 4 I/F 構成を、他の sample との整合性をとるために変更した。
