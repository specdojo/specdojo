---
specdojo:
  id: prj-0001:xer-t-kata-review-all-bdd-sample-130-20261125t235543z-3be3ed0e
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-bdd-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-bdd-sample-130/T-KATA-REVIEW-ALL-bdd-sample-130-20261125T235543Z-3be3ed0e/plan.md
  started_at: "2026-11-25T23:55:52.883Z"
  completed_at: "2026-11-26T00:04:15.080Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:bdd-sample
    - specdojo:bdd-sample
---

# Edit Result

## 1. 実施内容

- kata のレビュー段 R3（読みやすさ）として、`docs/ja/specdojo/samples/bdd-sample.yaml` の説明文を文章チェック項目（W1・W2・W3・W4・W5・W6・W8・W10）に沿って直した。
- 意味・判断に要る背景・制約・例外は変えていない。
- executor の検査では、schema 検査（`bdd.schema.yaml`）と prettier 検査が通った。runner の検査では、`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。
- `lint:ts`、`lint:md`、`lint:fm`、`typecheck`、`test:unit`、`test:integration` は、変更種別により非適用だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R3-1 | R3 | entities[商品].description | 「用語参照は〜を対象とする」の主語と述語がねじれている。 | 「用語は [[specdojo:gl-sample\|用語集 在庫・調達]] を参照する。」にした。 | W2 | - |
| R3-2 | R3 | entities[売上記録].description | 「入力途中や取り消した取引」の修飾の係りが曖昧で、受け身の「顧客が特定されない」も主体が消えている。 | 「入力途中の取引と取り消した取引は含めない」「顧客を特定しない現金販売も記録する」にした。 | W5, W6 | - |
| R3-3 | R3 | entities[売上記録`].fields[payment_method].description` | 「本部への登録の受付状態」は「の」が続いて読みにくく、エンティティ名とずれている。 | 「本部売上受付の受付状態とは別の判断軸とする。」にした。 | W8, W10 | - |
| R3-4 | R3 | entities[売上記録`].fields[customer_id].description` | 必要とする理由と未設定の扱いの 2 つを 1 文で述べている。 | 「つけ販売では請求先を特定するために必要とする。未設定を現金販売と読み替えない。」の 2 文に分けた。 | W3 | - |
| R3-5 | R3 | entities[売上明細].fields[quantity].description | 「販売する」が `product_id` の「販売した」と時制がずれている。 | 「この行で販売した商品の個数。」にした。 | W10 | - |
| R3-6 | R3 | entities[本部売上受付`].fields[sale_id].description` | 受け身の「採番される」で、採番と照合の主体が読めない。 | 「本部は店舗の売上記録の売上IDとは別に採番するため、店舗側は両者を同じ値と読み替えずに照合する。」にした。 | W1, W6 | - |
| R3-7 | R3 | entities[本部売上受付].fields[status].description | 「拒否は応答コードで返る」の主体がなく、「この項目」「ここでは」の指す先が曖昧。 | 「本部は拒否を応答コードで返すため、受付状態の値がないことを受付済みと扱わない。」「本辞書では業務上の意味を対応付ける。」にした。 | W1, W4 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bdd-sample.yaml`: 商品・売上記録・売上明細・本部売上受付の各 description を直した。主語と述語のねじれ、受け身で主体が消えた文、1 文に 2 つの内容を述べた文、時制のずれ、指示語の曖昧さを解消した（9 行追加・9 行削除）。

## 3. 申し送り

- R3-1: R3 / entities[商品].description / 「用語参照は〜を対象とする」の主語と述語がねじれている / 「用語は [[specdojo:gl-sample|用語集 在庫・調達]] を参照する。」にした / W2 / -
- R3-2: R3 / entities[売上記録].description / 「入力途中や取り消した取引」の修飾の係りが曖昧で、受け身の「顧客が特定されない」も主体が消えている / 「入力途中の取引と取り消した取引は含めない」「顧客を特定しない現金販売も記録する」にした / W5, W6 / -
- R3-3: R3 / entities[売上記録`].fields[payment_method].description` / 「本部への登録の受付状態」は「の」が続いて読みにくく、エンティティ名とずれている / 「本部売上受付の受付状態とは別の判断軸とする。」にした / W8, W10 / -
- R3-4: R3 / entities[売上記録`].fields[customer_id].description` / 必要とする理由と未設定の扱いの 2 つを 1 文で述べている / 「つけ販売では請求先を特定するために必要とする。未設定を現金販売と読み替えない。」の 2 文に分けた / W3 / -
- R3-5: R3 / entities[売上明細].fields[quantity].description / 「販売する」が `product_id` の「販売した」と時制がずれている / 「この行で販売した商品の個数。」にした / W10 / -
- R3-6: R3 / entities[本部売上受付`].fields[sale_id].description` / 受け身の「採番される」で、採番と照合の主体が読めない / 「本部は店舗の売上記録の売上IDとは別に採番するため、店舗側は両者を同じ値と読み替えずに照合する。」にした / W1, W6 / -
- R3-7: R3 / entities[本部売上受付].fields[status].description / 「拒否は応答コードで返る」の主体がなく、「この項目」「ここでは」の指す先が曖昧 / 「本部は拒否を応答コードで返すため、受付状態の値がないことを受付済みと扱わない。」「本辞書では業務上の意味を対応付ける。」にした / W1, W4 / -
- 適用外の検証: `npm run validate:history-links`（plan・result・個票を変更していないため（変更は samples 配下の YAML だけ））

## 4. 進め方と実践の型の適用

参照の向きを成果物から sample に切り替え、対象 sample を読んで文の直しを入れた。今回の plan には grade や condense 由来の finding がなかったため、R3 の観点（W1〜W10）で読みやすさだけを扱した。sample の意味・構造・必須項目は変えていない。変更後は schema 検査と prettier 検査で整合を確認した。
