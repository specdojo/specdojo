---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-organization-sample-120-20261125t224441z-aa37ee7a
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-organization-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-organization-sample-120/T-KATA-REVIEW-ALL-pm-organization-sample-120-20261125T224441Z-aa37ee7a/plan.md
  started_at: "2026-11-25T22:44:50.655Z"
  completed_at: "2026-11-25T22:50:51.357Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pm-organization-sample
    - specdojo:pm-organization-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）を実施し、`docs/ja/specdojo/samples/pm-organization-sample.md` の章内の配置を rulebook と template に合わせて直した。
- 「ロール・owner方針」の表の列を template に合わせ、使用可能な `owner` を表の後の 1 行に分けた。
- 「組織モデル」の表の後にあった段落を表の前へ移し、前提から表の順に読めるようにした。
- sample 以外は変更していない。指摘は findings に渡した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 2. ロール・owner方針 | 表の列が template と rulebook の「記述ガイド」と合っていない。「未採用時の代替方針」の列がなく、template にない「`owner` 使用可否」の列があり、使用可能な `owner` を表の後の 1 行で示していない（R1 の申し送り No.2）。 | 列を「Role code」「採用／未採用」「判断理由・プロジェクトでの扱い」「未採用時の代替方針」にした。全ロールを採用しているので代替方針は全行 `-` とした。表の後を「未採用はなし」「使用可能な `owner`: `PO`、`PM`、`BA`、`DEV`、`QE`。専門支援の `ARC`、`UX`、`OPS` は `owner` に使わない」「初期 RACI の列と専門支援の意見の扱い」の 3 段落に分け、template の順にそろえた。選ばなかった案は、「`owner` 使用可否」の列を残し、template と rulebook の推奨列に足すこと。sample 以外の変更になるので人の判断に回す。 | `vp-arc-document-structure`、`docs/ja/specdojo/templates/pm-organization-template.md` の「ロール・owner方針」、rulebook の「本文要件」と「記述ガイド」の「ロール・owner方針」。 | 要判断 |
| R2-2 | R2 | 1. 組織モデル | 兼務方針、利用者の確認、人間と AI Agent の境界の段落が表の後にある。template では前提の記述を表の前に置いており、前提から表の順に読めない。 | 表の後の段落を、表の前の体制方針の段落につなげて移した。 | `vp-arc-document-structure`、`docs/ja/specdojo/templates/pm-organization-template.md` の「組織モデル」（`_TODO_` が表の前にある）。 | - |
| R2-3 | R2 | 4. 見直し条件 | 表の前の確認時期の段落と、表の後の追従確認の段落は template にない。ただし rulebook の「本文要件」の「体制の見直し」が求める追従確認であり、結論として末尾に置く順も合っているので、直す必要はない。 | - | `vp-qe-omissions-consistency`、rulebook の「本文要件」の「体制の見直し」。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-organization-sample.md`: 「ロール・owner方針」の表の列を「Role code」「採用／未採用」「判断理由・プロジェクトでの扱い」「未採用時の代替方針」にした。表の後は「未採用はなし」「使用可能な `owner`」「初期 RACI の列と専門支援の意見の扱い」の 3 段落にした。「組織モデル」の表の後の段落（兼務方針、利用者の確認、人間と AI Agent の境界）は表の前へ移した。

## 3. 申し送り

- R3 への申し送り: 「ロール・owner方針」と「正本と責任境界」の表の前に、何の表かを示す 1 文がない（Sample 記述標準「表の前の 1 文」）。R3 の観点なので R2 では直していない。
- No: R2-1 / 段: R2 / 箇所: 2. ロール・owner方針 / 指摘: 表の列が template と rulebook の「記述ガイド」と合っていない。「未採用時の代替方針」の列がなく、template にない「`owner` 使用可否」の列があり、使用可能な `owner` を表の後の 1 行で示していない（R1 の申し送り No.2） / 直した案: 列を「Role code」「採用／未採用」「判断理由・プロジェクトでの扱い」「未採用時の代替方針」にした。全ロールを採用しているので代替方針は全行 `-` とした。表の後を「未採用はなし」「使用可能な `owner`: `PO`、`PM`、`BA`、`DEV`、`QE`。専門支援の `ARC`、`UX`、`OPS` は `owner` に使わない」「初期 RACI の列と専門支援の意見の扱い」の 3 段落に分け、template の順にそろえた / 根拠: `vp-arc-document-structure`、`docs/ja/specdojo/templates/pm-organization-template.md` の「ロール・owner方針」、rulebook の「本文要件」（骨組みは template を正本とする）と「記述ガイド」の「ロール・owner方針」。迷った理由: 採用しても `owner` に使わない専門支援ロールがあるので、元の「`owner` 使用可否」の列も読みやすかった。選ばなかった案: その列を残し、template と rulebook の推奨列に「`owner` 使用可否」を足す（sample 以外の変更になるので、人の判断に回す） / 印: 要判断
- No: R2-2 / 段: R2 / 箇所: 1. 組織モデル / 指摘: 兼務方針、利用者の確認、人間と AI Agent の境界の段落が表の後にある。template では前提の記述を表の前に置いており、前提から表の順に読めない / 直した案: 表の後の段落を、表の前の体制方針の段落につなげて移した / 根拠: `vp-arc-document-structure`、`docs/ja/specdojo/templates/pm-organization-template.md` の「組織モデル」（`_TODO_` が表の前にある） / 印: -
- No: R2-3 / 段: R2 / 箇所: 4. 見直し条件 / 指摘: 表の前の確認時期の段落と、表の後の追従確認の段落は template にないが、rulebook の「本文要件」の「体制の見直し」が求める追従確認であり、結論として末尾に置く順も合っている / 直した案: - / 根拠: `vp-qe-omissions-consistency`、rulebook の「本文要件」の「体制の見直し」 / 印: -
- 適用外の検証: `npm run validate:history-links`（executor は plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

根拠は `vp-arc-document-structure`、`docs/ja/specdojo/templates/pm-organization-template.md`、rulebook の「本文要件」と「記述ガイド」。骨組みは template を正本とし、sample の章の順と表の列をそれに合わせた。R1 の申し送り No.2 は R2-1 で解消した。「見直し条件」の構成は rulebook の「体制の見直し」に沿っているので維持した。「`owner` 使用可否」の列を template と rulebook の推奨列に足す案は sample 以外の変更になるため、人の判断に回した。
