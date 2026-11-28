---
specdojo:
  id: prj-0001:xer-t-kata-review-all-itc-index-sample-120-20261124t183135z-6f64fb14
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-itc-index-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-itc-index-sample-120/T-KATA-REVIEW-ALL-itc-index-sample-120-20261124T183135Z-6f64fb14/plan.md
  started_at: "2026-11-24T18:31:43.467Z"
  completed_at: "2026-11-24T18:43:31.258Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:itc-index-sample
    - specdojo:itc-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）を実施した。指摘は下表の1件で、F006 の分割・統合基準の不足を扱った。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | - | - | - | - | - | - | - | | R2-1 | R2 | 2. テスト対象の括り方と分割基準 | F006（source=grade）。依存境界・環境要件が混在する場合の分割候補と、1〜2ケースの単位の原則統合が欠けていた。既存の分割基準も適用例の後に置かれていた。 | 分割・統合基準を括り方の表より前に集約した。依存境界・環境要件の混在を分割候補に加えた。少数ケースは同じ結合境界・データ境界の既存 term へ原則統合するとし、統合先を `itc-sales-checkout`（販売記録・在庫）と `itc-credit-balance`（つけ記録・残高）に具体化した。 | `vp-qe-omissions-consistency`、`vp-arc-document-structure`、itc-index-rulebook 5・6.2、Sample 記述標準5・6 | - |
- 変更したのは `docs/ja/specdojo/samples/itc-index-sample.md` の2章のみ。Prettier 整形と `git diff --check` は成功した。runner の親検証では、lint:md:changed、lint:fm:changed、lint:mermaid、lint:d2、test:docs、validate:schema が passed だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/itc-index-sample.md`: 2章「テスト対象の括り方と分割基準」を再構成した。分割・統合基準を括り方の表より前へ移し、依存境界・環境要件の混在を分割候補に加えた。1〜2ケースの単位は原則として既存 term へ統合する基準も加え、統合先を `itc-sales-checkout` と `itc-credit-balance` で具体化した。R1 が追加した照合待ちの観点・分配とケース表の例は維持した。

## 3. 申し送り

- F004 は R3、F003・F005 は R4 の扱い。F002 の `vp-pm-control-reporting` は段レビューの使用対象外のため、既存個票 `kinuya:pjr-i003` との参照整合は R5 で確認する。
- 保全取得（`PATH-04`）・復元回復（`PATH-07`）の範囲不整合は未解消のまま R5 へ引き継ぐ。最新 TSP 4.2 は両経路を IT とするが、対象 sample の1〜3章には ET とする記述が残っている。
- R2-1: R2 / 箇所: 2. テスト対象の括り方と分割基準 / 指摘: F006（source=grade）。依存境界・環境要件が混在する場合の分割候補と、1〜2ケースの単位の原則統合が欠け、既存の分割基準も適用例の後に置かれていた。 / 直した案: 分割・統合基準を括り方の表より前に集約。依存境界・環境要件の混在を分割候補に加え、少数ケースは同じ結合境界・データ境界の既存 term へ原則統合するとした。販売記録・在庫は `itc-sales-checkout`、つけ記録・残高は `itc-credit-balance` を統合先として具体化した。 / 根拠: `vp-qe-omissions-consistency`、`vp-arc-document-structure`、itc-index-rulebook 5・6.2、Sample 記述標準5・6。 / 印: -
- 変更ファイル: `docs/ja/specdojo/samples/itc-index-sample.md` の2章のみ。result・grade サイドカー・設定は変更していない。
- 進め方と実践の型の適用: kata-guide 6.1・6.3・6.5、itc-index-rulebook、Sample 記述標準、ryu-guide のメンテナンス手順、dct-kata.yaml の対象 `done_criteria`、grade サイドカー、R1 result、tsp-index-sample を確認した。recipe と template は rulebook で `undecided` のため参照対象なし。rulebook を正として必須章の順序と表構造を照合し、既存の章立ては維持した。F006 の不足を解消し、R1 が追加した照合待ちの観点・分配とケース表の例を維持した。R2 範囲に判断保留・根拠不足はない。reporter は指摘を実施内容の表へ1回だけ記載すること。
- 後続段への引継ぎ: F004 は R3、F003・F005 は R4 に委ねる。F002 の `vp-pm-control-reporting` は段レビューの使用対象外であり、既存個票 `kinuya:pjr-i003` との参照整合は R5 で確認する。R1 が申し送った保全取得（`PATH-04`）・復元回復（`PATH-07`）の範囲不整合も継続して R5 へ渡す。最新 TSP 4.2 は両経路を IT とするが、対象 sample の1〜3章には ET とする記述が残る。これらを今回解消したとは扱わない。
- 検証: Prettier 整形と `git diff --check` は成功。差分を読み、必須章・表の列構成・R1 の修正を維持していることを確認した。指定された lint・schema・テスト等の親検証は runner に委ねた。
- 適用外の検証: `npm run validate:schema:file`（変更した成果物は Markdown のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/samples/ 配下のみで、docs/ja/projects/ 配下の成果物を変更していない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存 plan・result を変更していない。）

## 4. 進め方と実践の型の適用

根拠として kata-guide 6.1・6.3・6.5、itc-index-rulebook、Sample 記述標準、ryu-guide のメンテナンス手順、`dct-kata.yaml` の対象 `done_criteria`、grade サイドカー、R1 result、tsp-index-sample を確認した。recipe と template は rulebook で `undecided` のため参照対象がない。構造・必須章の順序・表構造は rulebook を正として照合し、既存の章立ては維持した。F006 の不足を解消し、R1 が追加した記述は整合するため維持した。R2 の範囲で判断保留・根拠不足とした finding はない。F001 は R1 で対応済みの記述を維持した。
