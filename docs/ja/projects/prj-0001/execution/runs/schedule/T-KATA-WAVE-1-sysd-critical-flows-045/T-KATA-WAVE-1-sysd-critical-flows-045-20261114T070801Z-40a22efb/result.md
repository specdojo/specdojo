---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-sysd-critical-flows-045-20261114t070801z-40a22efb
  type: exec-result
  task_id: T-KATA-WAVE-1-sysd-critical-flows-045
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-sysd-critical-flows-045/T-KATA-WAVE-1-sysd-critical-flows-045-20261114T070801Z-40a22efb/plan.md
  started_at: "2026-11-14T07:08:16.572Z"
  completed_at: "2026-11-14T07:21:53.528Z"
  agent: sol-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - sysd-critical-flows
    - specdojo:sysd-critical-flows-recipe
---

# Edit Result

## 1. 実施内容

- 重要フローの `recipe` を現行の `rulebook` に同期し、内容を具体化しました。
- 候補の絞り込み基準、境界・永続化、相関、検証、変更影響を導き出す問いと手順を補い、重複していた具体例を整理することで、実効性の高い作成ガイドへと更新しました。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/sysd-critical-flows-recipe.md`: 重要フロー `recipe` を現行 `rulebook` に同期。各章を「問い・具体化・対比」の構成で整理し、候補整理、同期／非同期と受付／完了の区別、`trace` 代替相関、監視の判定条件、管理記録・検証・互換性への引渡しに関する記述を補完しました。

## 3. 申し送り

- reporter へ: 変更ファイルは `docs/ja/specdojo/recipes/sysd-critical-flows-recipe.md` のみ。各章を問い・具体化・対比で整理し、現行根拠の確認、候補整理、同期／非同期と受付／完了の区別、`trace` の代替相関、監視の測定・判定条件、管理記録・検証・互換性への引渡しを補った。
- result の「進め方と実践の型の適用」へ: 根拠は `recipe-authoring-standard`、`rulebook-authoring-standard`、`xp`／`xep-common-conventions-template`、`pm-review-viewpoints` の `vp-arc-conciseness`／`vp-qe-kata-conformance`、現行 `sysd-critical-flows-rulebook`、`sysd-index`、成果物 `sysd-critical-flows`、対応 `sample`・`template`、`clis-sample`、`PJR-2GD6`。規則の再定義や値・構文・構造の再掲を避け、既存の損失起点・保持／再開・人間責任・証跡区別を維持した。
- result へ要否判断を記録: `recipe` は重要フローの選定・失敗境界の具体化に必要、`template` は5章とフローごとの記入欄の骨組みに必要。現行 `rulebook` の対応 `ID` 宣言を維持した。`rulebook` は標準章立て・章別判断基準と例・完成例の外出しを満たし、`sample` は2フローの図・検証・運用・未決事項を含む完成例のため変更不要。型メニューには `rulebook`・`recipe`・`sample`・`template` が登録済みで追加不要。
- result へレビュー根拠を記録: `execution/grade/results` の `sysd-critical-flows.yaml`、`specdojo.sysd-critical-flows-rulebook.yaml`、`specdojo.sysd-critical-flows-sample.yaml` を過去の不足傾向として確認した。`plan` に展開された `finding` はなし。過去の `title` 追加要求は現行 `rulebook` と矛盾するため採用せず、現行規約を正とした。`grade` サイドカーと `result` は編集していない。親 `runner` の検証結果は後段で追記する。
- reporter へ: 変更ファイルは docs/ja/specdojo/recipes/sysd-critical-flows-recipe.md のみ。各章を問い・具体化・対比で整理し、現行根拠の確認、候補整理、同期／非同期と受付／完了の区別、trace の代替相関、監視の測定・判定条件、管理記録・検証・互換性への引渡しを補った。
- result の「進め方と実践の型の適用」へ: 根拠は recipe-authoring-standard、rulebook-authoring-standard、xp／xep-common-conventions-template、pm-review-viewpoints の vp-arc-conciseness／vp-qe-kata-conformance、現行 sysd-critical-flows-rulebook、sysd-index、成果物 sysd-critical-flows、対応 sample・template、clis-sample、PJR-2GD6。規則の再定義や値・構文・構造の再掲を避け、既存の損失起点・保持／再開・人間責任・証跡区別を維持した。
- result へ要否判断を記録: recipe は重要フローの選定・失敗境界の具体化に必要、template は5章とフローごとの記入欄の骨組みに必要。現行 rulebook の対応 ID 宣言を維持した。rulebook は標準章立て・章別判断基準と例・完成例の外出しを満たし、sample は2フローの図・検証・運用・未決事項を含む完成例のため変更不要。型メニューには rulebook・recipe・sample・template が登録済みで追加不要。
- result へレビュー根拠を記録: execution/grade/results の sysd-critical-flows.yaml、specdojo.sysd-critical-flows-rulebook.yaml、specdojo.sysd-critical-flows-sample.yaml を過去の不足傾向として確認した。plan に展開された finding はなし。過去の title 追加要求は現行 rulebook と矛盾するため採用せず、現行規約を正とした。grade サイドカーと result は編集していない。親 runner の検証結果は後段で追記する。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown recipe のみで、YAML／YML ファイルの変更がない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存 plan／result を変更していない。）
- 適用外の検証: `npm run validate:catalog`（成果物の変更が docs/ja/projects/ 配下に及ばない。）
- 適用外の検証: `node tools/check-evidence-secrets.mjs --staged`（executor の変更は recipe のみで、検査対象の execution 配下の記録を変更していない。）

## 4. 進め方と実践の型の適用

現行の `rulebook` および執筆標準に基づき、`recipe` の責務を「問い」と「作成手順」に絞って同期しました。過去のレビュー傾向（`grade` 結果）から不足していた具体化の観点（境界条件や検証方法など）を盛り込みつつ、正本の再掲を避ける簡潔な構成へと見直しました。
