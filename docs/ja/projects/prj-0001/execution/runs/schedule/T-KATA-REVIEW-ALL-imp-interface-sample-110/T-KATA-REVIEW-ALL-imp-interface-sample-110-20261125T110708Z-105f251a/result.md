---
specdojo:
  id: prj-0001:xer-t-kata-review-all-imp-interface-sample-110-20261125t110708z-105f251a
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-imp-interface-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-imp-interface-sample-110/T-KATA-REVIEW-ALL-imp-interface-sample-110-20261125T110708Z-105f251a/plan.md
  started_at: "2026-11-25T11:07:21.344Z"
  completed_at: "2026-11-25T11:20:29.309Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:imp-interface-sample
    - specdojo:imp-interface-sample
---

# Edit Result

## 1. 実施内容

- R1（目的の過不足）を確かめた。rulebook の各章の記述ガイドが求める内容は sample にそろっており、要らない内容もないため、sample は変更していない（`evidence.changes` は空）。
- grade の指摘 F001（`based_on` が `cr-2026-004` で、rulebook が求める個票 ID `PJR-XXXX` と異なる）は、同系列の sample にも同じ書き方があり系列の整合（R5）にかかわるため、この段では直さず、案を要判断として申し送った。
- 実施内容の指摘表（No・段・箇所・指摘・直した案・根拠・印）: R1-1 は R1 / 目的と適用範囲（ファイル先頭の `based_on`、本文 1 行目の変更要求 ID） / F001 の個票 ID 形式の不一致 / 案は後述の案A（要判断）/ 根拠 `vp-qe-kata-conformance` / 印は要判断。R1-2 は R1 / 全章 / 記述ガイドが求める内容に欠けも過剰もない / 直した案なし / 根拠 `vp-po-purpose-alignment`・`vp-arc-single-responsibility`・`vp-qe-kata-conformance` / 印なし。

## 2. 変更ファイル

- なし

## 3. 申し送り

- 案A: 変更要求の個票 ID を 1 つ決め（例: `PJR-C004`。ID 自体は人が決める）、5 つの imp sample（`imp-business-sample`・`imp-data-sample`・`imp-test-sample`・`imp-operations-sample`・本 sample）の `based_on` と本文を同時に直す（R5 で扱う）。案B: rulebook に、sample では変更要求の ID の表記を問わないという例外を足す。rulebook の求めを正とし、案A を推奨する。
- R1-1: R1 / 目的と適用範囲（ファイル先頭の `based_on`、本文 1 行目の変更要求 ID） / grade の指摘 F001: rulebook の「推奨 Frontmatter 項目」は `based_on` に変更要求の個票 ID（`PJR-XXXX`）を求めるが、sample は `cr-2026-004` を使っている / 直した案: - （この sample だけを直すと、同じ系列の sample と食い違うため） / 根拠: `vp-qe-kata-conformance`。`imp-business-sample`・`imp-data-sample`・`imp-test-sample`・`imp-operations-sample` も `based_on` と本文で `cr-2026-004` を使っている。案A: 変更要求の個票 ID を 1 つ決め（例: `PJR-C004`。ID 自体は人が決める）、5 つの imp sample の `based_on` と本文を同時に直す（R5 で扱う）。案B: rulebook に、sample では変更要求の ID の表記を問わないという例外を足す。rulebook の求めを正とし、案A を推す / 印: 要判断
- R1-2: R1 / 全章 / rulebook の記述ガイド（目的と適用範囲〜未解決事項）が求める内容（対象外 I/F の区分、対象期間の終わり、判定方法つきの成功条件、3 観点の尺度と集約規則、波及先の ID、再評価の条件と期限、転記先の `item_type`）は欠けておらず、Sample 記述標準と rulebook の禁止事項に当たる要らない記述もない / 直した案: - / 根拠: `vp-po-purpose-alignment`、`vp-arc-single-responsibility`、`vp-qe-kata-conformance`（種別の責務） / 印: -
- 適用外の検証: `npx prettier --check docs/ja/specdojo/samples/imp-interface-sample.md`（変更した `*.md` などのファイルがない）
- 適用外の検証: `npm run validate:history-links`（plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

根拠とした規範は rulebook の記述ガイド、Sample 記述標準、`vp-po-purpose-alignment`、`vp-arc-single-responsibility`、`vp-qe-kata-conformance` である。維持した記述は、対象外 I/F の区分、対象期間の終わり、判定方法つきの成功条件、3 観点の尺度と集約規則、波及先の ID、再評価の条件と期限、転記先の `item_type` で、いずれも rulebook の求めと整合する。F001 は未解消のまま残した。理由は、この sample だけを直すと同系列の sample と食い違うためである。次のアクションは R5 で 5 つの imp sample を同時に直すか、rulebook に例外を足すかの人による判断である。rulebook と sample の記述が矛盾する箇所は F001 のみで、rulebook を正とする。runner の検証は passed または `not_applicable` で、失敗はない。
