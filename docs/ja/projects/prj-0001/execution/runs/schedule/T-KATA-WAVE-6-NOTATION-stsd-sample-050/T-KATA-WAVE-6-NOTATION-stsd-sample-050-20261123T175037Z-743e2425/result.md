---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-notation-stsd-sample-050-20261123t175037z-743e2425
  type: exec-result
  task_id: T-KATA-WAVE-6-NOTATION-stsd-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-NOTATION-stsd-sample-050/T-KATA-WAVE-6-NOTATION-stsd-sample-050-20261123T175037Z-743e2425/plan.md
  started_at: "2026-11-23T17:50:45.652Z"
  completed_at: "2026-11-23T18:00:20.192Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:stsd-sample
    - specdojo:stsd-sample
---

# Edit Result

## 1. 実施内容

- stsd-sample の `grade` による指摘事項（F001〜F005）を解消し、sample を厚くしました。
- 対象の単位を個品（1個）と定義し、数量をまとめる際の前提を追加しました（F003 への対応）。
- 「未成立時の扱い」の記述を、一意判定の記述へ統合・整理しました（F002 への対応）。
- 返品理由における過剰納品と納品不足の条件を書き分けました（F001 への対応）。
- 状態の値をテンプレートに従い、インラインコード形式（`_UNDECIDED_` 型の骨組み）に統一しました（F004 への対応）。
- 補足説明における呼称を、定義された「店番担当」に統一しました（F005 への対応）。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/stsd-sample.md`: `grade` の指摘（F001〜F005）に基づき、対象の単位の定義、未成立時の扱いの整理、返品条件の書き分け、状態値の表記統一、および呼称の統一を行いました。

## 3. 申し送り

- F003 の対応で対象の単位を個品（1 個）とし、記録は同じ納品明細で同じ状態の個品を数量でまとめる前提を置いた。rulebook の「適用範囲」の記述ガイドに、数量を持つ対象の判定単位と分割時の扱いを示す観点を足すか検討する（変更案）。
- F002 の対応で sample の「状態の判定」を template と同じ 3 項目（正本・一意判定・互換）にした。
- 利用者が決める値（`_UNDECIDED_`）はこの sample になく、決める必要のある値はない。

## 4. 進め方と実践の型の適用

rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。`grade` の指摘事項を解消し、`_UNDECIDED_` を用いた値の補完が必要な箇所がないことを確認した。
