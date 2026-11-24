---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-imp-data-sample-040-20261123t121906z-db173ba1
  type: exec-result
  task_id: T-KATA-WAVE-5-imp-data-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-imp-data-sample-040/T-KATA-WAVE-5-imp-data-sample-040-20261123T121906Z-db173ba1/plan.md
  started_at: "2026-11-23T12:19:23.430Z"
  completed_at: "2026-11-23T12:29:13.834Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:imp-data-sample
    - specdojo:imp-data-rulebook
---

# Edit Result

## 1. 実施内容

- imp-data-rulebook を簡潔な構成に再編し、記述ガイドを整備しました。
- grade の指摘（F001, F002, F004, F005）を rulebook の判定基準および転記ルールへの反映によって解消しました。
- PJR-76N9 に基づき、文書の役割（確認者・承認者）の割り当てを求めない記述へと変更し、F003 の指摘に対応しました。
- sample 側で対応が必要な項目（F006〜F009）については、rulebook への反映ではなく申し送り事項として整理しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/imp-data-rulebook.md`: rulebook の章構成を整理し、本文の必須項目（未解決事項の判断者・決定期限、転記先の `item_type` 等）の規定、および「分析サマリ」の判定基準を確定させました。また、文書の役割の割り当てを求めない記述へと修正を行いました。

## 3. 申し送り

- F006〜F009（sample 側）: imp-data-sample を rulebook に合わせる必要がある。(1) 「変更要求の概要」に判定可能な成功条件を足す。(2) 「影響分析サマリ」を整合性・可用性・移行難易度・利用者影響の4観点に直し、許容停止時間などの境界値を示す。(3) Frontmatter の `based_on` に `&lt;project-id&gt;:imp-business` と変更要求の個票 ID を記載する。(4) 判断根拠に構造・整合性、データ検証・移行テスト、実装変更への影響を書き、備考に波及先の成果物 ID を書き、対応方針に受入確認を足す。(5) 対応方針・未解決事項の列名を本文要件に合わせる（優先度→影響度、実施時期→期限、処理方針→当面の扱い、判断・対応への影響と転記先の登録項目を追加）。担当は Role code にする。
- F003: 確認者・承認者を Role code で本文に示す要求は、PJR-76N9 と rulebook-authoring-standard の記述ガイド（文書の役割の割り当てや承認の進み具合を成果物本文に求めない）に反するため採らなかった。一般名称の合意者の記述（データ責任者とプロジェクト管理者）を消し、どの利用場面で何を判断するための文書かを示す形に直した。
- 直さなかった箇所と理由: 3章（ファイル命名・ID規則）と7章（禁止事項）の既存項目は、根拠と整合し grade の指摘もないため維持した。
- sample の `based_on` は現在 `cr-2026-004` という形の ID である。変更要求の個票 ID（`PJR-XXXX`）に直すかどうかは sample の段で確認する必要がある。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/rulebooks/imp-data-rulebook.md のみで、plan・result・個票は変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したのは Markdown の rulebook だけで、`*.yaml` / `*.yml` の変更はない）

## 4. 進め方と実践の型の適用

対象の sample が従う rulebook を、grade の指摘と成果物の `done_criteria` に沿って簡潔に整えました。rulebook には完成例を置かず、記述ガイドとして章ごとの判断基準と良い例・悪い例を盛り込み、`docs/ja/specdojo/standards/rulebook-authoring-standard.md` の標準に準拠させました。また、PJR-76N9 に従い、文書の役割（誰が何を判断するか）を本文に求めない記述へと見直しています。
