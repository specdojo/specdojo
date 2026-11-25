---
specdojo:
  id: prj-0001:xer-t-kata-review-all-dmd-sample-150-20261125t024255z-b156d3fe
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-dmd-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-dmd-sample-150/T-KATA-REVIEW-ALL-dmd-sample-150-20261125T024255Z-b156d3fe/plan.md
  started_at: "2026-11-25T02:43:05.437Z"
  completed_at: "2026-11-25T02:56:21.076Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:dmd-sample
    - specdojo:dmd-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `dmd-sample` を `dmd-index-sample`・`mtp-sample`・`cop-sample` と突き合わせ、判定者の分担と氏名の許容差の食い違い 2 件を sample 側で直した。
- 相手側を直すべき点はなかった。
- grade の F001（`vp-pm-plan-feasibility`、手順表の担当不足）は kata-guide「kata の観点の組」で kata の段のレビューに使わない観点とされているため、この段では直していない。要判断として残した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/dmd-sample.md`: 検証方法の表の前の文を、合否を店主代表がすべて決める記述から、`dmd-index` の分担（件数照合は DEV、サンプル照合と重要値照合は PO）に従う記述へ直した。サンプル照合の合格基準には、氏名の許容差として長音記号の違いを足した。変更は 8 行の差し替えで、整形は prettier で行った。

## 3. 申し送り

- F001（手順 1・3・4・5 の担当不足）は未対応で、要判断。採る場合は、cop-sample の手順表に合わせて手順 1・3・4・5 の備考に「開発担当」を足す案が evidence にある。
- No: 1 / 段: R5 / 箇所: dmd-sample「検証方法（件数照合/サンプル照合/重要値）」の表の前の文 / 指摘: 合否をすべて店主代表が決めるとしており、dmd-index-sample「検証の共通方針」と mtp-sample「合否基準」の分担（件数照合は DEV、サンプル照合と重要値照合は PO）と食い違う / 直した案: 「合否は `dmd-index` の判定の分担に従い、件数照合は開発担当（DEV）、サンプル照合と重要値照合は店主代表（PO）が照合表を見て決める。」に直した（反映済み） / 根拠: dmd-index-sample の「合否の判定」の箇条、mtp-sample の合否基準の表（件数差異は DEV、つけ残高は PO） / 印: 反映済み
- No: 2 / 段: R5 / 箇所: dmd-sample「検証方法」の表のサンプル照合の行の合格基準 / 指摘: 許容差を氏名の全角と半角の違いだけとしており、dmd-index-sample と mtp-sample が許容する長音記号の違いが抜けている / 直した案: 「氏名の全角と半角、長音記号の違いだけは差分に数えない」に直した（反映済み） / 根拠: dmd-index-sample「検証の共通方針」の 1 段落目、mtp-sample「検証観点」の差分検知（サンプル）の行 / 印: 反映済み
- No: 3 / 段: R5（対象外の finding） / 箇所: dmd-sample「移行手順（手動/バッチ/ツール）」の表 / 指摘: grade の F001（`vp-pm-plan-feasibility`）は手順 1・3・4・5 の担当がないと指摘している。kata-guide「kata の観点の組」はこの観点を kata の段のレビューで使わないとしているため、この段では直さない / 直した案: 採る場合は、cop-sample の手順表に合わせて手順 1・3・4・5 の備考に「開発担当」を足す / 根拠: kata-guide「kata の観点の組」の外す観点の表、cop-sample の手順 3・5・6 の担当 / 印: 要判断
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/dmd-sample.md だけで、plan・result・個票を変えていない）
- 適用外の検証: `npm run validate:schema:file`（変更した YAML・YML のファイルがない）

## 4. 進め方と実践の型の適用

根拠にしたのは `dmd-index-sample` の「検証の共通方針」と「合否の判定」、`mtp-sample` の検証観点と合否基準、`cop-sample` の手順表の担当、kata-guide の「kata の観点の組」である。判定者の分担と氏名の許容差は index と mtp-sample の記述を正として dmd-sample を合わせた。両者が一致していたためである。整合している記述は維持した。F001 は kata の段で扱わない観点のため修正せず、理由と案を申し送りに残した。実行した検査は、executor の prettier 整形と、runner の `npm run lint:md:changed`、`npm run lint:fm:changed`、`npm run lint:mermaid`、`npm run lint:d2`、`npm run test:docs`、`npm run validate:schema` で、すべて passed だった。変更種別に合わない検査は `not_applicable` になっている。
