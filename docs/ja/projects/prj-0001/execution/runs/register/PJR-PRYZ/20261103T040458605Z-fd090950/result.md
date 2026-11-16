---
specdojo:
  id: prj-0001:xer-pjr-pryz-20261103t040458z-d2a6207a
  type: exec-result
  task_id: PJR-PRYZ
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-PRYZ/20261103T040458605Z-fd090950/plan.md
  started_at: "2026-11-03T04:04:59.000Z"
  completed_at: "2026-11-03T04:23:19.616Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- cdfd-uc の Kata（rulebook, recipe, sample, template）および D2 共通規定（rulebook）を更新し、全体概要の書き方に合わせた形式へ変更しました。
- 目的の定義を、読み手向けから「業務の存在理由・成果」へと変更し、引き渡し・例外時の戻りに関する章や特定のイベント ID、引き渡し ID を廃止しました。
- データの流れを図の線のラベルで表現するように変更し、重要な戻りについては、任意の図（戻り図）として定義できるようにしました。
- 図の構成から Orchestrator を外し、全体概要の Kata へと役割を委ねました。
- D2 図のレイアウトについて、縦方向の流れ（在庫→仕入→販売）やラベル配置、および SVG の寸法確認を行いました。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/cdfd-uc-recipe.md`: `cdfd-uc` の Kata を更新するためのレシピを修正しました。
- `docs/ja/specdojo/rulebooks/cdfd-d2-rulebook.md`: D2 を用いた図の構成規約（縦の流れ、ラベルの使用、Orchestrator の扱いなど）を更新しました。
- `docs/ja/specdojo/rulebooks/cdfd-uc-rulebook.md`: `cdfd-uc` の Kata（目的の定義や章構成）に関する規約を変更しました。
- `docs/ja/specdojo/samples/cdfd-uc-sample.md`: 新しい Kata に基づいた業務フローのサンプル図（通常図および戻り図）を更新しました。
- `docs/ja/specdojo/templates/cdfd-uc-template.md`: 新しい Kata に基づく、通常図と任意の戻り図のテンプレートを更新しました。

## 3. 申し送り

- result は編集していません。個票「対応結果」の文書別変更表、整合確認、SVG 出力結果、executor の判断を reporter が result へ反映してください。
- 目的を業務の存在理由・成果へ変更し、引き渡し／戻り先の章、引き渡し ID、条件イベントを廃止しました。受け渡しは線のラベルで表し、重要な戻りは任意の図で表します。Orchestrator は全体概要へ委ね、区分と任意の PDCA 列、有効な参照先、短いイベントを規定しました。
- sample の業務内容を維持しました。ELK 出力は通常図 931×1732、戻り図 942×810。在庫→仕入→販売の上下順、イベントの改行、ラベル配置を確認しました。template の 2 図も出力成功。確認用ファイルは削除済みです。
- 判断理由は個票に記録済みです。関連引き渡しを参加単位へ変更し、重要な戻りを図として保持しました。複数の起点イベントは原文を保って分割し、粒度・方向・イベントは主 rulebook を優先します。分割図・戻り図への開始と終了の再掲は不要としました。
- 4 文書の status は draft を維持しています。全体概要の Kata・全体概要・詳細 3 文書は未変更です。詳細 3 文書の改訂は後続の epic・schedule に委ねます。未決事項や保護設定の変更提案はありません。
- 目的を業務の存在理由・成果へ変更し、引き渡し／戻り先の章、引き渡し ID、条件イベントを廃止しました。受け渡しは線のラベル、重要な戻りは任意の図で表します。Orchestrator は全体概要へ委ね、区分と任意の PDCA 列、有効な参照先、短いイベントを規定しました。
- 親 runner は指定の lint・テスト等を実行し、その結果を result に反映してください。カタログ検査には、今回変更していない未作成文書の参照警告があります。
- 適用外の検証: `npm run validate:schema:file`（今回の編集は Markdown のみで、YAML ファイルを変更していません。）
- 適用外の検証: `npx tsx src/specdojo.ts catalog build`（`dct-*.yaml` を変更していません。）
- 適用外の検証: `npx tsx src/specdojo.ts exec refresh`（`sch-*.yaml` を変更していません。）

## 4. 進め方

まず、Kata の各文書（`rulebook`, `recipe`, `sample`, `template`）および D2 共通の `rulebook` を調査し、目的の定義変更、Orchestrator の除外、および図の構成ルール（章の廃止とラベルによる表現への移行）を反映させました。次に、`sample` と `template` において、新しい規約に沿った図の生成と、図の寸法・レイアウト（縦の流れやラベルの配置）の検証を行いました。最後に、個票 `pjr-pryz-cdfd-uc-kata-align.md` に、実施した変更内容と判断根拠を記録しました。
