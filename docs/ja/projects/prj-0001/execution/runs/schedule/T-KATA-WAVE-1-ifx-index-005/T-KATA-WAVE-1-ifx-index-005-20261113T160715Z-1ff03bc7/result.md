---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-ifx-index-005-20261113t160715z-1ff03bc7
  type: exec-result
  task_id: T-KATA-WAVE-1-ifx-index-005
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-ifx-index-005/T-KATA-WAVE-1-ifx-index-005-20261113T160715Z-1ff03bc7/plan.md
  started_at: "2026-11-13T16:07:17.976Z"
  completed_at: "2026-11-13T18:13:24.042Z"
  agent: sol-executor
  execution: agent
  approach: bootstrap
  targets:
    - ifx-index
    - specdojo:ifx-index-rulebook
    - specdojo:ifx-index-sample
---

# Edit Result

## 1. 実施内容

- 代表成果物である外部システムI/F一覧を新規作成し、それに基づき実践の型（rulebook, recipe, sample, template）を整備しました。
- rulebook を再構成し、標準章立ての導入と判断基準の具体化を行い、sample は共通文脈を用いて再構成しました。
- レシピおよびテンプレートの必要性を判断し、新規に作成・宣言しました。
- schema の ID 制約を修飾 ID と整合させるため更新しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/ifx-index-rulebook.md`: 標準章立てへの変更、階層別連番の付与、および記入領域ごとの判断基準・良い例・悪い例を整備し、再構成しました。
- `docs/ja/specdojo/samples/ifx-index-sample.yaml`: 共通文脈（駄菓子屋きぬや）を用い、商品照会・売上登録・印字の3連携を例とした完成例に再構成しました。
- `docs/specdojo/schemas/v1/esil.schema.yaml`: 一覧 ID、文書参照、詳細参照の制約を修飾 ID と整合させるため、最小限の更新を行いました。
- `docs/ja/product/020-external-interface-specs/ifx-index.yaml`: 代表成果物として新規作成。AI provider CLI、ローカル Git、GitHub の3連携を整理し、接続・認証・公開条件を設計仮定として明記しました。
- `docs/ja/specdojo/recipes/ifx-index-recipe.md`: 連携単位や境界の定義、結果不明時の扱いなど、品質差が出やすい観点を整理したレシピを新規作成しました。
- `docs/ja/specdojo/templates/ifx-index-template.yaml`: 共通キー構成を維持し、固有データを含まない雛形として新規作成しました。

## 3. 申し送り

- 代表 `docs/ja/product/020-external-interface-specs/ifx-index.yaml` は未存在のため新規作成。AI provider CLI、ローカル Git、GitHub の3連携を整理した。失敗影響が異なる Git/GitHub は分割し、接続・認証・公開条件を推測で確定せず設計仮定として明示した。`based_on` は空配列を維持した。
- 既存 `docs/ja/specdojo/rulebooks/ifx-index-rulebook.md` は項目表中心で判断基準が不足していたため再構成。標準章立て、階層別連番、記入領域ごとの判断基準・良い例・悪い例を整備した。完成例の章は設けず、値域・構文・型は schema へ委譲した。
- recipe は連携単位・境界・結果不明時の扱いが規約だけでは一意にならず、書き手による品質差が生じるため必要と判断。`docs/ja/specdojo/recipes/ifx-index-recipe.md` を作成し、既存の `not-needed` 宣言を完全 ID へ更新した。
- template は同じキー構成から開始する系統のため必要と判断。`docs/ja/specdojo/templates/ifx-index-template.yaml` を作成し、完全 ID を宣言した。自身のメタ情報と `metadata_template` を分離し、固有データを含めていない。
- 既存 `docs/ja/specdojo/samples/ifx-index-sample.yaml` は汎用的な発注・決済の2例から、共通文脈の駄菓子屋きぬやへ再構成した。商品照会・売上登録・印字の3連携について、目的・発生条件・異常時判断・詳細参照を記載。未同梱契約は `TBD` と担当付き確認事項で区別した。
- 形の手本: ready の `tsd-index-rulebook.md`、`ifx-cmd-recipe.md`、`ifx-cmd-sample.yaml`、`ifx-cmd-template.yaml` を参照。指定された `clis-sample.md` は厚さと共通文脈を参照した。同種の ready な代表一覧は見つからなかった。固有の provider 一覧・起動引数・数値は複写していない。
- `docs/specdojo/schemas/v1/esil.schema.yaml` は旧 ID 制約が修飾 ID と不整合だったため、一覧 ID・文書参照・詳細参照の制約を最小限更新した。旧 `esil-` 形式を維持し、未知キー・不正な方式・空一覧の拒否も確認した。カタログの既存 rulebook 宣言は正しいため維持した。
- 仕上げ4操作は1巡実施。旧項目表の重複を schema 参照へ統合し、代表末尾の重複説明を削除。Git/GitHub と記述ガイドを判断単位で分割し、用語・方向・詳細参照を揃えた。構造・必須性・禁止事項は rulebook を正とした。Web 出典は使用していない。
- 後続判断: ARC/DEV が Git・GitHub の詳細契約、権限境界、成功・結果不明の判定とリモート転送方式を整理する。BA/PO は利用場面、採否・公開条件を確認する。本タスクでは業務判断を確定していない。
- executor 指示に従い result は編集していない。上記の変更・判断・仕上げ記録を reporter が result へ反映する。親 runner 指定の lint・schema 全件検査・型検査・単体／統合テストは実行していない。
- reporter 向け判断記録: 代表 `docs/ja/product/020-external-interface-specs/ifx-index.yaml` は未存在のため新規作成。AI provider CLI、ローカル Git、GitHub の3連携を整理した。失敗影響が異なる Git/GitHub は分割し、接続・認証・公開条件を推測で確定せず設計仮定として明示した。`based_on` は空配列を維持した。
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存の plan/result を変更していないため。）

## 4. 進め方と実践の型の適用

代表成果物の新規作成から着手し、それを一般化した `rulebook` の再構成、および実用的であると判断した `recipe`, `sample`, `template` を一貫したセットとして整備しました。既存の `ready` な文書を手本に構造を揃えつつ、内容はプロジェクト文脈に基づき記述し、最終的に仕上げの4操作（削除・統合・分割・整合確認）を実施して品質を向上させました。
