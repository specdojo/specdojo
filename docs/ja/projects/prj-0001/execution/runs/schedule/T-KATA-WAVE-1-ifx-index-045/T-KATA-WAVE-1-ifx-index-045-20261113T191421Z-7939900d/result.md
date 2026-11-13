---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-ifx-index-045-20261113t191421z-7939900d
  type: exec-result
  task_id: T-KATA-WAVE-1-ifx-index-045
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-ifx-index-045/T-KATA-WAVE-1-ifx-index-045-20261113T191421Z-7939900d/plan.md
  started_at: "2026-11-13T19:14:26.948Z"
  completed_at: "2026-11-13T19:30:16.785Z"
  agent: sol-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - ifx-index
    - specdojo:ifx-index-recipe
---

# Edit Result

## 1. 実施内容

- `ifx-index-recipe` を改訂 `rulebook` に同期し、問い・作成手順・深掘り・レビュー観点を更新しました。
- 管理担当、承認公開判断者、IF ごとの確認者と合意対象、未決事項の解消条件・判断時点・影響・保留範囲、および `Schedule`・`PJR`・決定記録への接続を問いと手順に追加しました。
- 既存の境界分割、方式、発生条件、結果不明時の観点を維持しつつ、規則は `rulebook` を正とし、値域・構文等の詳細は `schema` へ委譲することで冗長性を排除しました。
- 良い例・悪い例の表を各節との重複を減らす形で更新しました。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/ifx-index-recipe.md`: 改訂 `rulebook` への同期を行い、問い、作成手順、深掘り、レビュー観点を更新。正本参照方針に基づき重複を排除し、管理体制や未決事項の解消条件に関する記述を追加。

## 3. 申し送り

- reporter は result の「実施内容」「変更ファイル」「進め方と実践の型の適用」へ本報告を反映すること。変更ファイルは docs/ja/specdojo/recipes/ifx-index-recipe.md のみ。executor は result を編集していない。
- 判断根拠は docs/ja/specdojo/standards/recipe-authoring-standard.md、rulebook-authoring-standard.md、docs/ja/specdojo/rulebooks/ifx-index-rulebook.md、docs/specdojo/schemas/v1/esil.schema.yaml、ryu-guide.md の実践の型メンテナンス手順、および共通レビュー観点の `vp-arc-conciseness`。PJR-2GD6 の正本参照・重複回避方針を維持した。
- 実態の根拠として docs/ja/product/020-external-interface-specs/ifx-index.yaml、既存 sample・template、T-KATA-WAVE-1-ifx-index-005 と 040 の result、AI provider CLI 詳細仕様の既存 review result を確認した。plan に展開された finding・condense 記録はない。旧 rulebook grade と過去 review の検証不能記録は現在の評価結果として扱っていない。
- 管理担当・承認公開判断者、IF ごとの確認者と合意対象、未決事項の解消条件・判断時点・影響・保留範囲、Schedule・PJR・決定記録への接続を問いと手順へ追加した。既存の境界分割・方式・発生条件・結果不明時の観点は維持。規則は rulebook を正とし、値域・構文は schema へ委譲した。良い例・悪い例の表は各節との重複を減らして更新した。
- recipe は境界・連携単位・回復判断を具体化する手順が必要なため、template は同じキー構成から開始するため必要と再判断した。rulebook frontmatter の既存 ID 宣言を維持した。完成例は既存 sample に外出し済み。今回の recipe フェーズでは rulebook・sample・template を変更していない。型メニューは4種類とも登録済みで追加不要。親指定の lint・schema 全件検査・typecheck・単体／統合テストは runner に委ねた。
- 判断根拠は docs/ja/specdojo/standards/recipe-authoring-standard.md、rulebook-authoring-standard.md、docs/ja/specdojo/rulebooks/ifx-index-rulebook.md、docs/specdojo/schemas/v1/esil.schema.yaml、ryu-guide.md の実践の型メンテナンス手順、および共通レビュー観点の vp-arc-conciseness。PJR-2GD6 の正本参照・重複回避方針を維持した。
- 適用外の検証: `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/esil.schema.yaml --data docs/ja/product/020-external-interface-specs/ifx-index.yaml`（変更は Markdown recipe のみで、YAML ファイルを変更していないため。）
- 適用外の検証: `npm run validate:catalog`（executor の成果物変更が docs/ja/projects/ 配下に及ばないため。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存 plan/result を変更していないため。）

## 4. 進め方と実践の型の適用

改訂 `rulebook` および執筆標準に基づき `ifx-index-recipe` を同期。実態の成果物や過去の review result を根拠に、管理体制や未決事項の解消条件などの不足観点を追加しつつ、正本参照方針 (`PJR-2GD6`) に基づき冗長な記述を整理しました。
