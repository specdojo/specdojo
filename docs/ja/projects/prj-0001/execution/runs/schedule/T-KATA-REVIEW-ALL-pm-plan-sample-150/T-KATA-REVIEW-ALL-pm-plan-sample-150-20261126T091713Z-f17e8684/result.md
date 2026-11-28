---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-plan-sample-150-20261126t091713z-f17e8684
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-plan-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-plan-sample-150/T-KATA-REVIEW-ALL-pm-plan-sample-150-20261126T091713Z-f17e8684/plan.md
  started_at: "2026-11-26T09:17:24.178Z"
  completed_at: "2026-11-26T09:26:20.283Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pm-plan-sample
    - specdojo:pm-plan-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `pm-plan-sample.md` を、同じ接頭辞の sample、参照先、登録簿の規範と照らして見直し、食い違い 4 件を sample 側で直した。
- 相手側の sample を直す案 1 件は変更せずに指摘へ残した（要判断）。
- `npx prettier --write` で整形し、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は passed だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 4.1. 更新先と報告（課題・リスク・変更・決定の行） | リンク先の `pm-issue-log-sample`、`pm-risk-register-sample`、`pm-change-request-log-sample` はどれも `status: deprecated` で、正本はプロジェクト登録簿の項目だと本文に書かれている。決定の「該当記録に付記」も、決定記録（登録簿の `decision`）と食い違う。 | 正本を `[[specdojo:pjr-rulebook\|プロジェクト登録簿]]` の `issue`・`risk`・`change-request`・`decision` の項目に替えた。 | `vp-qe-kata-conformance`（kata 相互）、`pjr-rulebook` の `item_type` 表、非推奨 sample 冒頭の注記（PJR-X141） | - |
| R5-2 | R5 | 2. 統合管理方針（M-10） | 正本を登録簿へ替えたため、逸脱時対応の「各管理簿へ分け」が付け替え後の正本と合わない。 | 「登録簿の項目種別へ分け」にした。 | `vp-dev-change-impact` | - |
| R5-3 | R5 | 2. 統合管理方針（M-01） | 優先が BV-01・BV-02 だけで、初期リリースで確かめる BV-04（つけ残高）が抜けている。M-07 では SC-09（BV-04）が初期受入の条件で、スコープの境界の判断基準 2 にもつけ残高の記録継続がある。 | 「BV-01・BV-02・BV-04 を優先」にした。 | `vp-qe-kata-conformance`、`prj-success-criteria-and-acceptance-criteria-sample` の業務価値の表（BV-04 は初期リリース・中長期）、`prj-scope-sample` の境界の判断基準 | - |
| R5-4 | R5 | 5. 未決事項 | 成功条件の「例外条件と未解決事項」にある論点のうち、長期滞留の定義（SC-05）と繁忙期にかかるベースライン（SC-04・SC-05）が載っていない。「運用前の準備」が扱う SC-05 のベースラインに影響する。 | 人気商品の行を「人気商品の対象範囲、長期滞留の定義、繁忙期にかかるベースラインの扱い」に広げ、変わる対象を「運用前の準備」の SC-04・SC-05 にした。 | `vp-qe-kata-conformance`、`prj-success-criteria-and-acceptance-criteria-sample` の例外条件と未解決事項 | - |
| R5-5 | R5 | 相手側の sample（`pm-plan-sample` は変更していない） | `prj-success-criteria-and-acceptance-criteria-sample`（判定手順と証跡の手順 6）は、非推奨の `pm-change-request-log-sample` と `dec-sample` にリンクしている。`prj-scope-sample`（スコープ変更方針）は、`pm-issue-log-sample`、`pm-change-request-log-sample`、`dec-sample` にリンクしている。同じ `pm-issue-log-sample` への wikilink の表示名も「課題ログ」「課題一覧」と揺れている。 | -（案: 相手側の 2 つの sample で、課題・変更要求・決定の記録先を `[[specdojo:pjr-rulebook\|プロジェクト登録簿]]` の `issue`・`change-request`・`decision` の項目に替える。担当の段か別の todo で扱う） | `vp-dev-change-impact` | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-plan-sample.md`: 非推奨の課題ログ・リスク登録簿・変更要求ログへのリンクを、プロジェクト登録簿の項目種別（`issue`・`risk`・`change-request`・`decision`）へ付け替えた。M-10 の逸脱時対応を「登録簿の項目種別へ分け」に言い換えた。M-01 の優先に BV-04 を追加した。未決事項に長期滞留の定義と繁忙期にかかるベースラインの扱いを追加し、変わる対象を「運用前の準備」の SC-04・SC-05 にした。

## 3. 申し送り

- R5-5 の相手側 sample（`prj-success-criteria-and-acceptance-criteria-sample`、`prj-scope-sample`）の付け替えは、人の判断を待つ。
- R5-1: 段 R5 / 箇所 4.1. 更新先と報告（課題・リスク・変更・決定の行） / 指摘 リンク先の pm-issue-log-sample・pm-risk-register-sample・pm-change-request-log-sample はどれも `status: deprecated` で、正本はプロジェクト登録簿の項目だと本文に書かれている。決定も「該当記録に付記」とあり、決定記録（登録簿の `decision`）と食い違う / 直した案 正本を `[[specdojo:pjr-rulebook|プロジェクト登録簿]]` の `issue`・`risk`・`change-request`・`decision` の項目に替えた / 根拠 `vp-qe-kata-conformance`（kata 相互）、pjr-rulebook の `item_type` 表、非推奨 sample 冒頭の注記（PJR-X141） / 印 -
- R5-2: 段 R5 / 箇所 2. 統合管理方針（M-10） / 指摘 正本を登録簿へ替えたため、逸脱時対応の「各管理簿へ分け」が付け替え後の正本と合わない / 直した案 「登録簿の項目種別へ分け」にした / 根拠 `vp-dev-change-impact` / 印 -
- R5-3: 段 R5 / 箇所 2. 統合管理方針（M-01） / 指摘 優先が BV-01・BV-02 だけで、初期リリースで確かめる BV-04（つけ残高）が抜けている。M-07 では SC-09（BV-04）が初期受入の条件で、スコープの境界の判断基準 2 にもつけ残高の記録継続がある / 直した案 「BV-01・BV-02・BV-04 を優先」にした / 根拠 `vp-qe-kata-conformance`、prj-success-criteria-and-acceptance-criteria-sample の業務価値の表（BV-04 は初期リリース・中長期）、prj-scope-sample の境界の判断基準 / 印 -
- R5-4: 段 R5 / 箇所 5. 未決事項 / 指摘 成功条件の「例外条件と未解決事項」にある論点のうち、長期滞留の定義（SC-05）と繁忙期にかかるベースライン（SC-04・SC-05）が載っていない。「運用前の準備」が扱う SC-05 のベースラインに影響する / 直した案 人気商品の行を「人気商品の対象範囲、長期滞留の定義、繁忙期にかかるベースラインの扱い」に広げ、変わる対象を「運用前の準備」の SC-04・SC-05 にした / 根拠 `vp-qe-kata-conformance`、prj-success-criteria-and-acceptance-criteria-sample の例外条件と未解決事項 / 印 -
- R5-5: 段 R5 / 箇所 相手側の sample（pm-plan-sample は変更していない） / 指摘 prj-success-criteria-and-acceptance-criteria-sample（判定手順と証跡の手順 6）は非推奨の pm-change-request-log-sample と dec-sample に、prj-scope-sample（スコープ変更方針）は pm-issue-log-sample・pm-change-request-log-sample・dec-sample にリンクしている。同じ pm-issue-log-sample への wikilink の表示名も「課題ログ」「課題一覧」と揺れている / 直した案 - / 根拠 `vp-dev-change-impact`。相手側の 2 つの sample で、課題・変更要求・決定の記録先を `[[specdojo:pjr-rulebook|プロジェクト登録簿]]` の `issue`・`change-request`・`decision` の項目に替える案。担当の段か別の todo で扱う / 印 要判断（相手側の sample を一括で付け替えるか、非推奨 sample の削除時にまとめるかは人の判断が要るため）

## 4. 進め方と実践の型の適用

根拠にしたのは、同じ接頭辞の sample、`pjr-rulebook` の `item_type` 表、非推奨 sample の冒頭の注記、成功条件 sample の業務価値の表と例外条件、スコープ sample の境界の判断基準である。非推奨 sample を正本にしていた参照は登録簿の項目へ替えた。BV-04 と未決事項は、成功条件 sample に合わせて補った。相手側の sample は変更せず、案だけを残した。grade と condense の finding は plan になかった。
