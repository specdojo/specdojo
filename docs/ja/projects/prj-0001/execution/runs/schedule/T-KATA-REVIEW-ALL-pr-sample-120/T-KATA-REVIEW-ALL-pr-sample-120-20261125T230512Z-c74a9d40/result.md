---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pr-sample-120-20261125t230512z-c74a9d40
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pr-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pr-sample-120/T-KATA-REVIEW-ALL-pr-sample-120-20261125T230512Z-c74a9d40/plan.md
  started_at: "2026-11-25T23:05:23.031Z"
  completed_at: "2026-11-25T23:10:14.147Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pr-sample
    - specdojo:pr-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として pr-sample の章の順・粒度・表の列・表と本文の配置を、pr-rulebook の本文要件と記述ガイドに照らして確認した。5 章が必須の順にそろい、4 つの表の列名も記述ガイドと一致しており、章の移動・分割・統合の差分はなかった。そのため sample は変更していない。
- template は not-needed のため照合対象はない。
- grade finding F001（報告者・報告先の欠落、`vp-ba-stakeholder-clarity`）は、kata-guide が kata の段のレビューで使わない観点であり、R2 の観点にも当たらない。このため R2 では直さず、R5 へ申し送った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 全章（1. 報告期間〜5. 次期予定） | 章の順・粒度・表の列・表の前の 1 文を pr-rulebook の本文要件と記述ガイドに照らした。5 章が必須の順にそろい、4 つの表の列名も記述ガイドと一致するため、構成上の指摘はない。 | - | `vp-arc-document-structure`、`vp-qe-omissions-consistency`（pr-rulebook の本文要件・記述ガイド、sample-authoring-standard の構成の原則・記述ガイド。template は not-needed） | - |
| R2-2 | R2 | H1 直下の導入文 | grade finding F001（報告者と報告先がない）は観点 `vp-ba-stakeholder-clarity` の指摘。kata-guide の「kata の観点の組」はこの観点を kata の段のレビューで使わない観点としており、R2 の観点にも当たらない。pr-rulebook の本文要件・記述ガイドにも報告者・報告先を書く求めはないため、R2 では直さない。 | 申し送り: rulebook の求めとして要るかを R5（`vp-qe-kata-conformance`）で確かめる。要る場合は rulebook 側の本文要件または記述ガイドに報告者・報告先の記述を加える案を検討する。 | kata-guide の「kata の観点の組」、pr-rulebook の本文要件・記述ガイド | - |

## 2. 変更ファイル

- なし

## 3. 申し送り

- R5（`vp-qe-kata-conformance`）で、報告者・報告先の記述が rulebook の求めとして要るかを確かめる。要る場合は pr-rulebook の本文要件または記述ガイドに加える案を検討する。
- grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集していない。
- R2-1: R2 / 全章（1. 報告期間〜5. 次期予定） / 章の順・粒度・表の列・表の前の 1 文を pr-rulebook の本文要件と記述ガイドに照らした。5 章が必須の順にそろい、4 つの表の列名も記述ガイドと一致するため、構成上の指摘はない / - / vp-arc-document-structure、vp-qe-omissions-consistency（pr-rulebook の本文要件・記述ガイド、sample-authoring-standard の構成の原則・記述ガイド。template は not-needed） / -
- R2-2: R2 / H1 直下の導入文 / grade finding F001（報告者と報告先がない）は観点 `vp-ba-stakeholder-clarity` の指摘。kata-guide の「kata の観点の組」はこの観点を kata の段のレビューで使わない観点としており、R2 の観点（`vp-arc-document-structure`・`vp-qe-omissions-consistency`）にも当たらない。pr-rulebook の本文要件・記述ガイドにも報告者・報告先を書く求めはないため、R2 では直さない / - / 申し送り: rulebook の求めとして要るかを R5（vp-qe-kata-conformance）で確かめる。要る場合は rulebook 側の 4. 本文要件または 5. 記述ガイドに報告者・報告先の記述を加える案を検討する。grade result サイドカーは再評価時に更新されるため直接編集しない / -
- 適用外の検証: `npx markdownlint-cli2 docs/ja/specdojo/samples/pr-sample.md`（変更した `*.md` ファイルがなく、markdownlint の適用条件を満たさない。Markdown の lint は親 runner の lint-md / lint-md-changed で実行される）
- 適用外の検証: `npx prettier --check docs/ja/specdojo/samples/pr-sample.md`（変更したファイルがなく、Prettier の適用条件を満たさない）

## 4. 進め方と実践の型の適用

根拠は pr-rulebook の本文要件と記述ガイド、sample-authoring-standard の構成の原則・記述ガイド、kata-guide の観点の組。構成は rulebook に一致しているため維持した。F001 は R2 の観点外として見送り、R5 に申し送った。
