---
specdojo:
  id: prj-0001:xer-t-kata-review-all-atc-sample-140-20261124t233100z-de207f46
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-atc-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-atc-sample-140/T-KATA-REVIEW-ALL-atc-sample-140-20261124T233100Z-de207f46/plan.md
  started_at: "2026-11-24T23:31:11.228Z"
  completed_at: "2026-11-24T23:44:26.870Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:atc-sample
    - specdojo:atc-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）の確認を行った。`atc-sample` の事実の主張を正本と突き合わせ、誤りが見つからなかったため sample は変更していない（`changes` は空）。
- F001（概要の分割基準から「金額の提示」が抜けている）は、現行版の概要が `atc-index-sample` の「商品の登録→金額の提示→会計確定→レシートの受け渡し」と一致しており、すでに解消していた。追加の修正は不要。
- 確かめられなかった主張が 1 件ある。確定前の取消の期待結果と、レシートへの取引番号の印字である。業務受入条件にも画面・帳票の設計にも正本がない。

## 2. 変更ファイル

- なし

## 3. 申し送り

- 確かめられなかった主張（C8）の次のアクションは、取消条件の PJR 登録と、画面・帳票の設計での確認である。sample は `_ASSUMPTION_` として明記済み。
- C1: 概要の分割基準「商品の登録→金額の提示→会計確定→レシートの受け渡し」。正本 docs/ja/specdojo/samples/atc-index-sample.md 62行目を grep で読んだ。結果は一致。F001 は今の版で直っており、追加の修正はしていない。
- C2: 必須の章（概要（`&lt;term&gt;`）〜受入観点とケース）、トレース表の列（`trace_key`・仕様ID・要点・備考）、条件・ケース表の10列の順、`case_id` の形式 `at-&lt;term&gt;-&lt;perspective_key&gt;-&lt;nnn&gt;`（10刻み）、`perspective_key` の kebab-case、優先度 P0/P1、実施形態 `manual`。正本 docs/ja/specdojo/rulebooks/atc-rulebook.md の本文要件の章（81-118行）。結果は一致。
- C3: frontmatter の `type: test`、`rulebook: specdojo:atc-rulebook`、`based_on`（tsp-index-sample・atc-index-sample）、`relations.verifies`。正本 atc-rulebook の推奨 Frontmatter 項目の章と docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml（52行目 `verifies`）。結果は一致。lint:fm による schema 検査は runner が実行する。
- C4: TR-01「商品A 2個・60円で販売記録が1件残り、在庫が5個から3個」。正本 docs/ja/specdojo/samples/bac-sample.md 55行目（C-01）と36行目（単価30円・在庫5個）。結果は一致。
- C5: TR-02 AC-01、TR-03 SC-01・AC-03（自力で回復できない事象が0件）、TR-04 AC-04（条件 ID・確認日・確認者）。正本 docs/ja/specdojo/samples/prj-success-criteria-and-acceptance-criteria-sample.md 34・51・53・54行目。結果は一致。
- C6: 対象外の在庫0個の境界ケースを ST の `st-cash-sale-flow-success-020` で確かめること。正本 docs/ja/specdojo/samples/stc-sample.md 81行目（5個・150円で在庫が0個になる）。結果は一致。
- C7: データ `kinuya-at`・`kinuya-test-data`（商品A 単価30円・在庫5個）、P1 の合格基準、確定前の取消を P1 に置くこと、外部依存の店舗プリンタ（実機）、印刷失敗を ST へ送ること。正本 atc-index-sample の40・62・73・98・123行目。結果は一致。
- C8: 確定前の取消の期待結果と、レシートへの取引番号の印字。業務受入条件にも画面・帳票の設計にも正本がなく、確かめられない。sample は `_ASSUMPTION_` と次の手で明記しており、取消条件の PJR 登録と画面・帳票の設計での確認が要る。
- R5 への申し送り: 観点名が atc-sample では「主要操作の自力完了」、atc-index-sample 113行目では「主要操作の自力完了の成立」になっている。R4 の範囲外なので直していない。
- 適用外の検証: `npm run validate:history-links`（plan・result・個票などの履歴ファイルを変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更した `*.yaml` / `*.yml` ファイルがないため）

## 4. 進め方と実践の型の適用

sample-maintenance の R4 として、sample の事実の主張を schema・他 sample・rulebook と照合した。照合の結果、C1〜C7 は正本と一致した。C1 は分割基準（F001 の対象）で、`atc-index-sample` 62 行目と一致する。C2 は章構成・トレース表の列・条件・ケース表の列・`case_id` 形式で、`atc-rulebook` の本文要件と一致する。C3 は frontmatter の項目で、`atc-rulebook` と `deliverable-frontmatter.schema.yaml` に一致する。C4〜C7 は他 sample（`bac-sample`、受入基準の sample、`stc-sample`、`atc-index-sample`）の値と一致する。C8 は正本がなく確かめられなかった。F001 は現行版で解消済みと判断し、grade result サイドカーは直接編集していない。根拠不足で見送った改訂はない。なお、観点名が `atc-sample` では「主要操作の自力完了」、`atc-index-sample` では「主要操作の自力完了の成立」と異なる。これは R4 の範囲外なので直さず、R5 に回す。
