---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-roles-sample-110-20261125t144915z-7fc8d84d
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-roles-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-roles-sample-110/T-KATA-REVIEW-ALL-pm-roles-sample-110-20261125T144915Z-7fc8d84d/plan.md
  started_at: "2026-11-25T14:49:24.959Z"
  completed_at: "2026-11-25T14:56:13.501Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:pm-roles-sample
    - specdojo:pm-roles-sample
---

# Edit Result

## 1. 実施内容

- R1（目的の過不足）として `docs/ja/specdojo/samples/pm-roles-sample.yaml` を見直した。ARC・UX・OPS の `project_note` から、組織定義が正本の owner 使用可否の記述と、PO の `project_note` と重なる最終判断の記述を削った。
- 足すべき欠けは見つからなかった。採用 8 ロールは組織定義の sample の採用集合と一致し、`code`・`name` は上位標準と一致した。メタ項目と `based_on` も rulebook の要件を満たしている。
- schema 検査と Prettier は通過した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通過した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R1-1 | R1 | `roles[ARC].project_note` | 組織定義が正本の owner 使用可否（「初期は独立タスクの主責任を持たない」）を繰り返している。rulebook の位置づけの表と `roles[].project_note` の節が定める固有の扱いの範囲を超えている。 | 文を削り、「専門支援として」「DEV が主導する設計へ助言する」を残した。選ばなかった案は、組織定義と表現をそろえて残す案。 | vp-arc-single-responsibility, vp-qe-kata-conformance。rulebook の良い例は「専任化の条件」を `project_note` に含めるため、この文を固有の条件と読む余地がある。 | 要判断 |
| R1-2 | R1 | `roles[UX].project_note` | 「独立タスク化は組織定義の見直し後とする」は、組織定義が正本の owner 使用可否と見直しの記述の重複である。 | 文を削り、BA が主導する利用者確認への助言を残した。 | vp-arc-single-responsibility, vp-qe-kata-conformance。R1-1 と同じ理由で、固有の条件と読む余地がある。 | 要判断 |
| R1-3 | R1 | `roles[OPS].project_note` | 「初期は独立した Schedule タスクの主責任を持たず」は組織定義が正本の owner 使用可否の重複である。「公開・継続の最終判断は人間の PO に残す」は PO の `project_note` との重複である。 | 両方を削り、PM が主導するリリース準備へ取り込む記述を残した。 | vp-arc-single-responsibility, vp-arc-conciseness | - |
| R1-4 | R1 | roles 全体・メタ項目 | 欠けの確認をした。採用 8 ロールは組織定義の sample の採用集合と一致し、`code`・`name` は上位標準と一致している。メタ項目と `based_on` は rulebook の推奨メタ項目と `based_on` の制限を満たしている。足すべき内容はない。 | - | vp-po-purpose-alignment, vp-qe-kata-conformance | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-roles-sample.yaml`: ARC・UX・OPS の `project_note` を整理した。組織定義が正本の owner 使用可否や見直しの記述と、PO の `project_note` と重なる最終判断の記述を削り、専門支援・助言・リリース準備への取り込みといった固有の扱いだけを残した（3 行追加・3 行削除）。

## 3. 申し送り

- R1-1 と R1-2 は「要判断」である。rulebook の良い例は「専任化の条件」を `project_note` に含めるため、削った文を固有の条件と読む余地がある。選ばなかった案は、組織定義と表現をそろえて残す案である。
- R1-1: R1 / `roles[ARC].project_note` / 組織定義が正本の owner 使用可否（「初期は独立タスクの主責任を持たない」）を繰り返しており、rulebook の位置づけの表と `roles[].project_note` の節が定める固有の扱いの範囲を超えている / 文を削り、「専門支援として」「DEV が主導する設計へ助言する」を残した / vp-arc-single-responsibility, vp-qe-kata-conformance。rulebook の良い例は「専任化の条件」を `project_note` に含めるため、この文を固有の条件と読む余地がある。選ばなかった案は、組織定義と表現をそろえて残す案 / 要判断
- R1-2: R1 / `roles[UX].project_note` / 「独立タスク化は組織定義の見直し後とする」は、組織定義が正本の owner 使用可否と見直しの記述の重複 / 文を削り、BA が主導する利用者確認への助言を残した / vp-arc-single-responsibility, vp-qe-kata-conformance。R1-1 と同じ理由で、固有の条件と読む余地がある / 要判断
- R1-3: R1 / `roles[OPS].project_note` / 「初期は独立した Schedule タスクの主責任を持たず」は組織定義が正本の owner 使用可否の重複、「公開・継続の最終判断は人間の PO に残す」は PO の `project_note` との重複 / 両方を削り、PM が主導するリリース準備へ取り込む記述を残した / vp-arc-single-responsibility, vp-arc-conciseness / -
- R1-4: R1 / roles 全体・メタ項目 / 欠けの確認: 採用 8 ロールは組織定義の sample の採用集合と一致し、`code`・`name` は上位標準と一致し、メタ項目と `based_on` は rulebook の推奨メタ項目と `based_on` の制限を満たしている。足すべき内容はない / - / vp-po-purpose-alignment, vp-qe-kata-conformance / -

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に従った。対象 sample を rulebook の目的と Sample 記述標準に照らして読み、要る内容の欠けと要らない内容の混入を確かめた。欠けはなく、重複記述だけを削った。構造・必須項目は rulebook を正とし、rulebook など sample 以外は変更していない。展開された grade の finding と condense の finding はなかった。
