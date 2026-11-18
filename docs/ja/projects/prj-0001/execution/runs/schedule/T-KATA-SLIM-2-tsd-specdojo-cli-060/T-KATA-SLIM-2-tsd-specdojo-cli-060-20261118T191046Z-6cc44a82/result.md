---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-tsd-specdojo-cli-060-20261118t191046z-6cc44a82
  type: exec-result
  task_id: T-KATA-SLIM-2-tsd-specdojo-cli-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-tsd-specdojo-cli-060/T-KATA-SLIM-2-tsd-specdojo-cli-060-20261118T191046Z-6cc44a82/plan.md
  started_at: "2026-11-18T19:10:55.772Z"
  completed_at: "2026-11-18T19:40:49.194Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - tsd-specdojo-cli
    - specdojo:tsd-recipe
---

# Edit Result

## 1. 実施内容

- recipe から文書共通の運用記述、`rulebook` と重複する判断基準の言い直し、未決事項管理台帳の列定義、および冗長な確認事項を削除し、スリム化しました。
- finding F001 に基づき、章番号のみによる参照（「例: 第 4 章で」）を章タイトルによる指定（「「採用技術・設定」に」）へ修正しました。
- 空白および表の区切り行を除いた文字数を 9,178 字から 4,537 字（約 49.4%）に削減しました。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/tsd-recipe.md`: 共通の運用記述、`rulebook` と重複する判断基準、管理台帳の列定義、冗長な確認項目を削除し、章番号参照を章タイトル参照に修正しました。

## 3. 申し送り

- 大きさ: 空白を除き、表の区切り行（`| --- |`）を除いた文字数で、前 9,178 字、後 4,537 字、比 49.4%（PJR-7M9J と同じ測り方）。
- F001（章番号での参照「例: 第 4 章で」）は「「採用技術・設定」に」へ直して解消した。集める情報の表にあった「第 N 章」の書き方も、置き場所の列ごと外した。
- rulebook・sample・template の変更案はない。tsd-rulebook は table の列を正本として持つため、recipe から外しても作成に支障はないと判断した。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/recipes/tsd-recipe.md だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

recipe-maintenance
