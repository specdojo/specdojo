---
specdojo:
  id: prj-0001:xer-t-kata-review-all-bdd-sample-120-20261125t154419z-2846b82e
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-bdd-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-bdd-sample-120/T-KATA-REVIEW-ALL-bdd-sample-120-20261125T154419Z-2846b82e/plan.md
  started_at: "2026-11-25T15:44:30.318Z"
  completed_at: "2026-11-25T15:50:33.020Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:bdd-sample
    - specdojo:bdd-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）として `docs/ja/specdojo/samples/bdd-sample.yaml` を見直した。支払方法（`payment_method`）の項目内の並びを、rulebook「fields の構成」の表の順（`constraints` → `example` → `allowed_values_detailed`）へ直した。
- 辞書全体の前提が商品（`product`）の `description` に置かれている点は、schema のルートに説明キーがなく置き場がないため据え置き、要判断として findings に残した。
- ルートのメタ情報、各エンティティ内の項目順、管理単位の並びは rulebook の表どおりで、変更不要と確認した。
- executor の `validate:schema:file` と `prettier --check` は passed。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も passed。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 業務データ辞書 &gt; 売上記録 &gt; 支払方法（`payment_method`） / `example` | `example` が `allowed_values_detailed` の後ろにあり、rulebook の「fields の構成」の表の順（`constraints` → `example` → `allowed_values_detailed`）と違う。 | `example: cash` を `constraints` の直後、`allowed_values_detailed` の前へ移した（値は変えていない）。 | `vp-arc-document-structure`、rulebook「fields の構成」 | - |
| R2-2 | R2 | 業務データ辞書 &gt; 商品（`product`）の `description` | 辞書全体の前提（商品・売上記録・売上明細を実装前の業務モデルとしてスタンドアロン定義すること、用語参照の対象を `gl-sample` とすること）が、最初のエンティティの説明に入っている。 | -（sample は据え置き）。辞書全体の前提をルートに書けるようにするかは rulebook と schema の側で決める（例: ルートに `description` を足す）。3 つのエンティティの `description` へ書き分ける案は、同じ文の繰り返しになるため採らなかった。 | `vp-arc-document-structure`。bdd.schema.yaml のルートは `additionalProperties: false` で説明キーがなく、ほかに置き場がない。 | 要判断 |
| R2-3 | R2 | 業務データ辞書 全体 | ルートのメタ情報（`id`・`type`・`title`・`status`・`rulebook`・`supersedes`）、各エンティティ内の項目順（`logical_name` → `physical_name` → `description` → `schema_ref` → `related_terms` → `key_fields` → `fields`）、管理単位の並び（商品 → 売上記録 → 売上明細 → 本部売上受付）は rulebook の表どおりで、参照される側から順に読める。template は `template: not-needed` のため照らす対象がない。 | -（変更なし） | `vp-arc-document-structure`、`vp-qe-omissions-consistency` | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bdd-sample.yaml`: 支払方法（`payment_method`）の `example: cash` を `constraints` の直後、`allowed_values_detailed` の前へ移した。値は変えておらず、1 行の移動のみ。

## 3. 申し送り

- 辞書全体の前提の置き場（例: schema のルートへ `description` を足す）は rulebook と schema の側で決める必要がある。本タスクでは sample 以外を変更していない。
- R2-1: R2 / 業務データ辞書 &gt; 売上記録 &gt; 支払方法（`payment_method`） / `example` が `allowed_values_detailed` の後ろにあり、rulebook の「fields の構成」の表の順（`constraints` → `example` → `allowed_values_detailed`）と違う / `example: cash` を `constraints` の直後、`allowed_values_detailed` の前へ移した（値は変えていない） / `vp-arc-document-structure`、rulebook「fields の構成」 / -
- R2-2: R2 / 業務データ辞書 &gt; 商品（`product`）の `description` / 辞書全体の前提（商品・売上記録・売上明細を実装前の業務モデルとしてスタンドアロン定義すること、用語参照の対象を `gl-sample` とすること）が、最初のエンティティの説明に入っている / - / `vp-arc-document-structure`。bdd.schema.yaml のルートは `additionalProperties: false` で説明キーがなく、ほかに置き場がないため据え置いた。選ばなかった案は、3 つのエンティティの `description` へそれぞれ書き分ける案で、同じ文の繰り返しになるため採らなかった。辞書全体の前提をルートに書けるようにするかは、rulebook と schema の側で決める（例: ルートに `description` を足す） / 要判断
- R2-3: R2 / 業務データ辞書 全体 / ルートのメタ情報（`id`・`type`・`title`・`status`・`rulebook`・`supersedes`）、各エンティティの中の項目（`logical_name` → `physical_name` → `description` → `schema_ref` → `related_terms` → `key_fields` → `fields`）、管理単位の並び（商品 → 売上記録 → 売上明細 → 本部売上受付）は rulebook の表どおりで、参照される側から順に読める。template は rulebook で `template: not-needed` のため照らす対象がない / - / `vp-arc-document-structure`、`vp-qe-omissions-consistency` / -
- 適用外の検証: `npx markdownlint`（変更したのは YAML の 1 ファイルだけで、`*.md` の変更がない）
- 適用外の検証: `npm run validate:history-links`（executor は plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

参照の向きを成果物から sample に切り替え、sample を rulebook の「fields の構成」と構成観点（`vp-arc-document-structure`）に照らして確認した。構成が rulebook と食い違う箇所だけを直し、整合する箇所は維持した。rulebook で `template: not-needed` のため、template との照合は対象外とした。schema にないキーを足す案は、rulebook を正とする方針に反するため採らず、要判断として残した。
