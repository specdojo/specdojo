---
specdojo:
  id: prj-0001:xer-t-business-specs-kata-br-task-selection-strategy-005-20261110t010825z-b293b726
  type: exec-result
  task_id: T-BUSINESS-SPECS-KATA-br-task-selection-strategy-005
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-BUSINESS-SPECS-KATA-br-task-selection-strategy-005/T-BUSINESS-SPECS-KATA-br-task-selection-strategy-005-20261110T010825Z-b293b726/plan.md
  started_at: "2026-11-10T01:08:27.731Z"
  completed_at: "2026-11-10T02:16:02.217Z"
  agent: sol-executor
  execution: agent
  approach: bootstrap
  targets:
    - br-task-selection-strategy
    - specdojo:br-rulebook
    - specdojo:br-sample
---

# Edit Result

## 1. 実施内容

- 代表成果物（タスク選択戦略）および実践の型（rulebook, sample, recipe, template）の整備を完了しました。
- 再開時の指示に基づき、新設した `br-recipe` と `br-template` が文書サイトのサイドバーから漏れていたため、`packages/docs-site/.vitepress/sidebar-config.ts` を修正し登録しました。
- 成果物本体および実践の型については、前回整備した構造を維持し、依存宣言や判断条件、未決事項（`_UNDECIDED_` / `_ASSUMPTION_`）の明示などの記述補正を行いました。
- 型の要否判断として、記述ガイドとしての `br-rulebook`、深掘り手順としての `br-recipe`、完成例としての `br-sample`、骨組みとしての `br-template` をそれぞれ整備し、相互整合性を確保しました。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/030-business-model/br-task-selection-strategy.md`: 依存宣言の追加、条件付き入力および派生ビューの参照経路の明確化、および未決事項の記述補正を行いました。
- `docs/ja/specdojo/rulebooks/br-rulebook.md`: 実践の型としての規定を整備し、`recipe`、`sample`、`template` の完全 ID を宣言しました。
- `docs/ja/specdojo/samples/br-sample.md`: BPS 系統の完成例として、粒度や文体を調整し整備しました。
- `packages/docs-site/.vitepress/sidebar-config.ts`: 新設した `br-recipe` と `br-template` をサイドバーの業務モデル配下に追加登録しました。
- `docs/ja/specdojo/recipes/br-recipe.md`: ビジネスルール作成のための問いやレビュー観点を整理した recipe を整備しました。
- `docs/ja/specdojo/templates/br-template.md`: BR 系統の 6 章構成に基づく骨組みを定義した template を整備しました。

## 3. 申し送り

- 再開時の失敗は、新設した `br-recipe` と `br-template` が sidebar に未登録だったことが原因です。`packages/docs-site/.vitepress/sidebar-config.ts` の業務モデル配下へ、既存の helper と同じ書き方で recipe と template の `br` を追加しました。
- 指定された `npm run test:unit -- tests/packages/docs-site/sidebar-kata.test.ts` は、後段の pipeline 指示と共通規約が親検証の対象限定版も executor で実行しないと定めているため実行していません。親 runner の `test-unit` による再検証で当該 3 テストの通過を確認してください。今回の報告ではテスト通過を主張していません。
- 代表成果物・rulebook・sample・recipe・template は前回整備した内容を読み、作り直さず維持しました。累積変更には依存宣言、条件付き入力、派生ビューの参照経路、判断先・判断時点・下流影響・承認条件が含まれます。カタログの `rulebook` 宣言は既存の `specdojo:br-rulebook` と整合しています。
- 型の要否は `kata-guide` の作成条件に基づきます。判断条件の掘り下げに品質差が生じるため `recipe`、BR 系統の 6 章の骨組みを共有するため `template` が必要です。`rulebook` の `recipe`・`sample`・`template` は実在する完全 ID を宣言済みです。完成例は `sample` に外出しし、記述ガイドには章別の判断基準・良い例・悪い例を置いています。
- 前回記録した構造上の手本は ready の `specdojo:prj-overview-rulebook`・`specdojo:prj-overview-recipe`・`specdojo:prj-overview-template`、`sample` の粒度の手本は plan 指定の `specdojo:clis-sample` です。前回の仕上げ 1 巡で行った重複擬似コードの削除、代替規則の参照への統合、判定規則・判定例の分離、各文書の構造整合を維持しました。今回追加した 2 件の sidebar 項目には独立した説明を重ねていません。
- finding は F001・F002・F004・F007・F008 の記述上の対応を維持しました。F003・F005・F006 の欠損時順位・ID 照合方法・追加判定例、F009 の未決事項と仮説は業務判断待ちです。再開指示に従い、未決のまま理由と影響を明示し、本タスク完了を妨げる条件にはしていません。
- 残る判断は代表成果物の U-01〜U-06 です。U-01 は先行 BPS の整備と適用境界、U-02 は fifo の意味、U-03 は許容戦略の差、U-04 は既定戦略の経路差、U-05 は `slack`・`ES` の一部欠損、U-06 は ID 照合方法です。PO の判断が必要で、PM・Orchestrator は先行仕様と経路の確認、ARC は比較規則と定義整合を支援します。判断後に規則と期待順位を更新してください。
- executor は今回 `result`・評価サイドカー・Git 設定を編集していません。reporter は判断根拠、未決事項と sidebar 修正の経緯を result の「進め方と実践の型の適用」および handoff に反映してください。成果物と型の `status` は `draft` を維持しています。
- 再開時の失敗は、新設した br-recipe と br-template が sidebar に未登録だったことが原因です。packages/docs-site/.vitepress/sidebar-config.ts の業務モデル配下へ、既存の helper と同じ書き方で recipe と template の br を追加しました。
- 指定された npm run test:unit -- tests/packages/docs-site/sidebar-kata.test.ts は、後段の pipeline 指示と共通規約が親検証の対象限定版も executor で実行しないと定めているため実行していません。親 runner の test-unit による再検証で当該3テストの通過を確認してください。今回の報告ではテスト通過を主張していません。
- 代表成果物・rulebook・sample・recipe・template は前回整備した内容を読み、作り直さず維持しました。累積変更には依存宣言、条件付き入力、派生ビューの参照経路、判断先・判断時点・下流影響・承認条件が含まれます。カタログの rulebook 宣言は既存の specdojo:br-rulebook と整合しています。
- 型の要否は kata-guide の作成条件に基づきます。判断条件の掘り下げに品質差が生じるため recipe、BR 系統の6章の骨組みを共有するため template が必要です。rulebook の recipe・sample・template は実在する完全 ID を宣言済みです。完成例は sample に外出しし、記述ガイドには章別の判断基準・良い例・悪い例を置いています。
- 前回記録した構造上の手本は ready の specdojo:prj-overview-rulebook・specdojo:prj-overview-recipe・specdojo:prj-overview-template、sample の粒度の手本は plan 指定の specdojo:clis-sample です。前回の仕上げ1巡で行った重複擬似コードの削除、代替規則の参照への統合、判定規則・判定例の分離、各文書の構造整合を維持しました。今回追加した2件の sidebar 項目には独立した説明を重ねていません。
- 残る判断は代表成果物の U-01〜U-06 です。U-01 は先行 BPS の整備と適用境界、U-02 は fifo の意味、U-03 は許容戦略の差、U-04 は既定戦略の経路差、U-05 は slack・ES の一部欠損、U-06 は ID 照合方法です。PO の判断が必要で、PM・Orchestrator は先行仕様と経路の確認、ARC は比較規則と定義整合を支援します。判断後に規則と期待順位を更新してください。
- executor は今回 result・評価サイドカー・Git 設定を編集していません。reporter は判断根拠、未決事項と sidebar 修正の経緯を result の「進め方と実践の型の適用」および handoff に反映してください。成果物と型の status は draft を維持しています。
- 適用外の検証: `npm run validate:schema:file`（成果物の累積変更は Markdown、今回の追加変更は TypeScript であり、executor が変更した YAML ファイルはありません。）
- 適用外の検証: `npm run validate:catalog`（executor の成果物変更は product・specdojo・packages 配下です。projects 配下の既存差分は実行管理ファイルであり、今回編集していません。）
- 適用外の検証: `npm run validate:history-links`（executor は登録簿履歴および既存の plan・result を今回編集していません。）

## 4. 進め方と実践の型の適用

bootstrap
