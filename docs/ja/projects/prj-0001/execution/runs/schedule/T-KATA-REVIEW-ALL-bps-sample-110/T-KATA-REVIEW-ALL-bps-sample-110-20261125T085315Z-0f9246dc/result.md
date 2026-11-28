---
specdojo:
  id: prj-0001:xer-t-kata-review-all-bps-sample-110-20261125t085315z-0f9246dc
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-bps-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-bps-sample-110/T-KATA-REVIEW-ALL-bps-sample-110-20261125T085315Z-0f9246dc/plan.md
  started_at: "2026-11-25T08:53:25.586Z"
  completed_at: "2026-11-25T09:08:01.854Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:bps-sample
    - specdojo:bps-sample
---

# Edit Result

## 1. 実施内容

- R1（目的の過不足）を確かめ、`bps-sample` の「概要」を 2 点直した。業務目的を実質のある文に書き換え、対象外に実装方式を足した。
- rulebook など sample 以外は変更していない。指摘 4 件のうち 2 件を sample に反映し、1 件は R2 での判断、1 件は R5 での確認に回した。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | - | - | - | - | - | - | - | | 1 | R1 | 「概要」の業務目的 | `cdfd-inventory` の `P-06` に任せる一文だけで、何のための流れかがない。参照先の CDFD の sample も活動を書くだけで目的を書いていない | 「人気商品の欠品を減らすため、補充基準を下回った商品を店主代表の記憶に頼らず補充依頼へ変え、仕入グループへ漏れなく渡す。」へ置き換えた（反映済み） | bps-rulebook「導入文と概要」、sample-authoring-standard「共通サンプル文脈」の期待効果（欠品削減）、`vp-po-purpose-alignment` | なし | | 2 | R1 | 「概要」の対象外 | rulebook が対象外に書くよう求める「実装方式」がない | 「補充依頼を記録・参照する画面や保存の方式（機能設計が扱う）」を対象外に足した（反映済み） | bps-rulebook「導入文と概要」、`vp-qe-kata-conformance` | なし | | 3 | R1 | 「前提条件」の 2・3 項目め（依頼数量、未完了依頼の定め） | yes / no で判定できる前提条件ではなく、用語の定めになっている | 流れの中で使うため直していない。残すか、置く場所を変えるか（R2 で扱う）を決める | bps-rulebook「トリガーと前提条件」 | 要判断 | | 4 | R1（R5 へ回す） | 「トリガー」の `T-01` | 同じ系列の bes-index-sample に `bes-stock-below-threshold` があるのに、業務イベント ID と名称を添えていない | 直していない。ほかの sample との整合なので R5 で、`T-01` に `bes-stock-below-threshold` を添えるかを確かめる | bps-rulebook「トリガーと前提条件」、kata-guide「段と渡す材料」の R5 | なし |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bps-sample.md`: 「概要」の業務目的を、欠品削減という目的と補充依頼を仕入グループへ漏れなく渡す内容に書き換えた。対象外には、rulebook が求める実装方式（補充依頼を記録・参照する画面や保存の方式）を足した。差分は 2 行の追加と 2 行の削除。

## 3. 申し送り

- 指摘 No.3（「前提条件」の依頼数量と未完了依頼の定めが、yes / no で判定できる前提条件になっていない）は、R2 で残すか置き場所を変えるかを判断してください。
- 指摘 No.4（`T-01` に `bes-stock-below-threshold` を併記するか）は、ほかの sample との整合なので R5 で確かめてください。
- No: 1 / 段: R1 / 箇所: 「概要」の業務目的 / 指摘: `cdfd-inventory` の `P-06` に任せる一文だけで、何のための流れかがない。参照先の CDFD の sample も活動を書くだけで目的を書いていない / 直した案: 「人気商品の欠品を減らすため、補充基準を下回った商品を店主代表の記憶に頼らず補充依頼へ変え、仕入グループへ漏れなく渡す。」へ置き換えた（sample に反映済み） / 根拠: bps-rulebook「導入文と概要」（概要に業務目的を示す）、sample-authoring-standard「共通サンプル文脈」の期待効果（欠品削減）、`vp-po-purpose-alignment` / 印: なし
- No: 2 / 段: R1 / 箇所: 「概要」の対象外 / 指摘: rulebook が対象外に書くよう求める「実装方式」がない / 直した案: 「補充依頼を記録・参照する画面や保存の方式（機能設計が扱う）」を対象外に足した（sample に反映済み） / 根拠: bps-rulebook「導入文と概要」（対象外には前後のプロセス、横断フロー、実装方式を明記）、`vp-qe-kata-conformance` / 印: なし
- No: 3 / 段: R1 / 箇所: 「前提条件」の 2・3 項目め（依頼数量、未完了依頼の定め） / 指摘: yes / no で判定できる前提条件ではなく、用語の定めになっている / 直した案: 流れの中で使うため直していない。残すか、置く場所を変えるか（R2 で扱う）を決める / 根拠: bps-rulebook「トリガーと前提条件」（前提条件は yes / no で判定できる文にし、不成立時の扱いを示す） / 印: 要判断
- No: 4 / 段: R1（R5 へ回す） / 箇所: 「トリガー」の `T-01` / 指摘: 同じ系列の bes-index-sample に `bes-stock-below-threshold`（在庫が補充基準を下回った）があるのに、業務イベント ID と名称を添えていない / 直した案: 直していない。ほかの sample との整合なので R5 で、`T-01` の出来事に `bes-stock-below-threshold` を添えるかを確かめる / 根拠: bps-rulebook「トリガーと前提条件」（BES がある場合は業務イベント ID と名称を併記）、kata-guide「段と渡す材料」の R5 / 印: なし
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/bps-sample.md だけで、plan / result / 個票を変えていない）

## 4. 進め方と実践の型の適用

根拠にした規範は、bps-rulebook の「導入文と概要」と「トリガーと前提条件」、sample-authoring-standard の共通サンプル文脈、kata-guide の R1 の確かめ、観点 `vp-po-purpose-alignment` と `vp-qe-kata-conformance` です。維持した記述は、目的の過不足に当たらない箇所です。矛盾する箇所はなく、rulebook を正として扱いました。plan に展開された grade と condense の finding はありません。evidence の検証では、`npx prettier --check` と runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通っています。`validate:history-links` は履歴ファイルを変えていないため `not_applicable` です。
