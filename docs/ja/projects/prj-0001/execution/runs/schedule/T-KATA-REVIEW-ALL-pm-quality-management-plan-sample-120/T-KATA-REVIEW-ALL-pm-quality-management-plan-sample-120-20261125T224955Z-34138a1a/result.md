---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-quality-management-plan-sample-120-20261125t224955z-34138a1a
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-quality-management-plan-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-quality-management-plan-sample-120/T-KATA-REVIEW-ALL-pm-quality-management-plan-sample-120-20261125T224955Z-34138a1a/plan.md
  started_at: "2026-11-25T22:50:04.144Z"
  completed_at: "2026-11-25T22:57:40.613Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pm-quality-management-plan-sample
    - specdojo:pm-quality-management-plan-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として sample を見直した。未決事項と保留の表を、template の 4 列（論点、正本と判断材料の担当、決定時期・判断者、未決中に保留する判定・作業）へ組み替えた（F003）。
- F001・F002 が指摘したオフライン時の運用・受入範囲の判断材料の担当と提示時点は、同じ組み替えの中で補った。
- ほかの章の順・粒度・表の配置は rulebook の本文要件と template に沿っているため動かしていない。
- rulebook は変更せず、直す案を handoff の指摘に残した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 5.2. 未決事項と保留 | 未決事項の表が「論点」「影響・未決中に保留する判定」の 2 列で、template の 4 列と合わず、担当・決定時期・判断者の記入例がない（F003）。 | 表を template の 4 列へ組み替えた。`_UNDECIDED_:` の印は「正本と判断材料の担当」の列へ移した。表の前の 1 文も 4 列に合わせた。U-01〜U-03 と人気商品の行の担当・時期・判断者は、pm-plan-sample と成功条件サンプルから写した。 | `vp-arc-document-structure`、`vp-qe-kata-conformance`、pm-quality-management-plan-template の未決事項と保留の表 | - |
| R2-2 | R2 | 5.2. 未決事項と保留（オフライン時の運用・受入範囲の行） | 判断材料を整理する担当がなく、保留を解くための検討を誰に頼むかが読めない（F001・F002）。 | 「`BA` が運用案と追加する受入条件の案を整理する」「運用開始前 / 人間の `PO`」と書いた。選ばなかった案は、担当は成功条件に定めがないと未決のまま書く案である。完成例として担当の記入例にならないため採らなかった。 | F001・F002 の観点（`vp-po-decision-readiness`、`vp-pm-plan-feasibility`）は kata の段のレビューから外れるため、F003 の列の組み替えの中で扱った。`BA` は人気商品の行で `BA` が候補を整理する役割から類推した。 | 要判断 |
| R2-3 | R2 | rulebook 6.5. 見直し条件と未決事項・5. 本文要件（sample の外） | rulebook は未決事項を「論点」「影響・未決中に保留する判定」の 2 列で書き、template の 4 列と食い違う。 | rulebook は変更していない。直す案は、6.5 の 3 つ目の箇条を「未決事項は論点、正本と判断材料の担当、決定時期・判断者、未決中に保留する判定・作業を示し、決定時に直す条件・証跡を特定します」とすること。5. 本文要件の「見直し条件と未決事項（未決）」の行の「記載する判断・根拠」にも、判断材料の担当と決定時期・判断者を足す。 | rulebook の本文要件の冒頭は、表の骨組みの正本を template としている。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-quality-management-plan-sample.md`: 5.2. 未決事項と保留の表を 2 列から template の 4 列に組み替えた。`_UNDECIDED_:` の印を「正本と判断材料の担当」の列へ移し、表の前の 1 文も 4 列に合わせた。オフライン時の運用・受入範囲の行には `BA` が案を整理することと、運用開始前に人間の `PO` が決めることを書いた。ほかの未決の行の担当・時期・判断者は、pm-plan-sample の未決事項・品質ゲートと成功条件の未解決事項から写した。

## 3. 申し送り

- F001・F002 は、kata-guide で kata の段のレビューから外れる観点のため、独立した指摘にせず F003 の列の組み替えの中で扱った。
- オフライン行の担当 `BA` は成功条件のサンプルに書かれておらず、人気商品の行の役割から類推したものである。採る場合は R5 で、成功条件サンプルのオフライン時の記録方法の行と pm-plan-sample の未決事項のオフライン行にも足す案を検討する。
- R2-1: 段 R2 / 箇所 5.2. 未決事項と保留 / 指摘: 未決事項の表が「論点」「影響・未決中に保留する判定」の 2 列で、template の 4 列（論点、正本と判断材料の担当、決定時期・判断者、未決中に保留する判定・作業）と合わず、担当・決定時期・判断者の記入例がない（F003） / 直した案: 表を template の 4 列へ組み替えた。`_UNDECIDED_:` の印を論点の列から「正本と判断材料の担当」の列へ移した（template の記入欄と同じ位置）。表の前の 1 文も 4 列に合わせた。U-01〜U-03 と人気商品の行の担当・時期・判断者は、pm-plan-sample の未決事項・品質ゲートと、prj-success-criteria-and-acceptance-criteria-sample の未解決事項から写した / 根拠: `vp-arc-document-structure`、`vp-qe-kata-conformance`、pm-quality-management-plan-template の未決事項と保留の表 / 印: -
- R2-2: 段 R2 / 箇所 5.2. 未決事項と保留（オフライン時の運用・受入範囲の行） / 指摘: 判断材料を整理する担当がなく、保留を解くための検討を誰に頼むかが読めない（F001・F002） / 直した案: 「`BA` が運用案と追加する受入条件の案を整理する」「運用開始前 / 人間の `PO`」と書いた / 根拠: F001・F002 の観点（`vp-po-decision-readiness`、`vp-pm-plan-feasibility`）は kata-guide で kata の段のレビューから外すため、独立した指摘にせず F003 の列の組み替えの中で扱った。`BA` は成功条件のサンプルに書かれておらず、人気商品の行で `BA` が候補を整理する役割から類推した。選ばなかった案は「担当は成功条件に定めがない」と未決のまま書く案（完成例として担当の記入例にならないため採らなかった）。採る場合は、R5 で prj-success-criteria-and-acceptance-criteria-sample のオフライン時の記録方法の行と、pm-plan-sample の未決事項のオフライン行にも `BA` が案を整理することを足す案を検討する / 印: 要判断
- R2-3: 段 R2 / 箇所 rulebook 6.5. 見直し条件と未決事項・5. 本文要件（sample の外） / 指摘: rulebook は未決事項を「論点」「影響・未決中に保留する判定」の 2 列で書き、template の 4 列（正本と判断材料の担当、決定時期・判断者を含む）と食い違う / 直した案: - / 根拠: rulebook の本文要件の冒頭で、表の骨組みは template を正本としている。相手側の pm-quality-management-plan-rulebook を直す案: 6.5 の 3 つ目の箇条を「未決事項は論点、正本と判断材料の担当、決定時期・判断者、未決中に保留する判定・作業を示し、決定時に直す条件・証跡を特定します」とする。5. 本文要件の「見直し条件と未決事項（未決）」の行の「記載する判断・根拠」に、判断材料の担当と決定時期・判断者を足す / 印: -

## 4. 進め方と実践の型の適用

根拠は、kata-guide の R2 の段の定義、pm-quality-management-plan の rulebook の本文要件と template の未決事項と保留の表、pm-plan-sample の未決事項・品質ゲート、成功条件サンプルの未解決事項である。F003 は template を正として表を 4 列に組み替えて解消した。F001・F002 は同じ組み替えで担当と判断時期を補った。ただし担当 `BA` は類推によるため、要判断として残す。その他の章は rulebook の本文構成と template に整合しており、維持した。executor が整形と markdownlint を実行し、runner の検査も通っている。
