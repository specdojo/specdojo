---
specdojo:
  id: prj-0001:xer-t-project-kata-pm-roles-040-20261112t212941z-0f9075ca
  type: exec-result
  task_id: T-PROJECT-KATA-pm-roles-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-PROJECT-KATA-pm-roles-040/T-PROJECT-KATA-pm-roles-040-20261112T212941Z-0f9075ca/plan.md
  started_at: "2026-11-12T21:29:46.284Z"
  completed_at: "2026-11-12T21:45:01.716Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:pm-roles
    - specdojo:pm-roles-rulebook
---

# Edit Result

## 1. 実施内容

- `pm-roles-rulebook.md` および対応する `pm-roles-recipe.md` を見直し、提示された 7 件の finding を解消しました。
- Rulebook ではメタ項目の重複を統合して `roles` 固有の要件に整理し、`PO` の必須化、採用判断の正本定義、判断基準（良い例・悪い例）を明確化しました。
- Recipe では `rulebook` の記述を禁止する矛盾した指示を撤去し、構造・必須項目・禁止事項の独自再定義を排除して、問いと作成手順に絞った内容に修正しました。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/pm-roles-recipe.md`: 必須の `rulebook` フィールドを禁止する指示を撤去し、表題・準拠先の入力手順を補完。構造・必須項目・禁止事項の独自再定義を除外し、問いと作成手順に整理しました。
- `docs/ja/specdojo/rulebooks/pm-roles-rulebook.md`: メタ項目の重複を統合し、本文要件を `roles` 固有の内容へ整理。`PO` の必須化、採用判断の正本定義、判断基準と良い例・悪い例、および変更時の追従対象を明確化しました。

## 3. 申し送り

- result の実施内容・変更ファイルへ記録: `docs/ja/specdojo/rulebooks/pm-roles-rulebook.md` はメタ項目の重複を統合し、本文要件を roles 固有の内容へ整理。PO 必須、採用判断の正本、判断基準と良い例・悪い例、変更時の追従対象を明確化した。`docs/ja/specdojo/recipes/pm-roles-recipe.md` は必須の `rulebook` を禁止する指示を撤去し、表題・準拠先の入力手順を補完。構造・必須項目・禁止事項の独自再定義を除き、問いと作成手順に整理した。成果物本体、sample、template、grade サイドカー、result は変更していない。
- result の進め方と実践の型の適用へ記録: [[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]、[[specdojo:recipe-authoring-standard|Recipe 記述標準]]、[[specdojo:people-and-organization-definition-standard|人と組織の定義標準]]、[[specdojo:document-metadata-standard|ドキュメントメタ情報標準]]、対応 schema、PJR-2GD6、共通レビュー観点の各判定根拠を実読した。[[prj-0001:pm-roles|ロール定義]]、[[prj-0001:pm-organization|組織定義]]、[[prj-0001:xrr-t-launch-pm-roles-090|ロール定義レビュー結果]]、過去の maintenance 結果、宣言済み recipe・sample・template、組織定義 rulebook と照合した。実績に整合する短い固有メモ、専任配置とロール採用の分離、人間の PO の最終責任は維持した。値・構文・構造の詳細は schema 等への参照に寄せた。
- finding 対応記録: 根拠は `docs/ja/projects/prj-0001/execution/grade/results/specdojo.pm-roles-rulebook.yaml` の grade。F001・F007 はメタ項目の二重表を解消、F002 は配列の採用集合・一意性と個別コードの許容値を分担、F003 は本文要件で PO を必須化、F004・F005 は rulebook と schema を正として recipe の矛盾する指示・悪い例を修正、F006 は組織定義を採用判断・使用可能な `owner` の正本、YAML を転記先として統一した。文書上の再照合で確認済み。plan に成果物由来の finding・condense 記録はなく、grade サイドカーは再評価待ちとして維持した。
- recipe・template の要否: 採用集合の照合や固有メモを具体化する問いが必要なため `recipe: specdojo:pm-roles-recipe`、独立 YAML のメタ項目と配列の骨組みが必要なため `template: specdojo:pm-roles-template` を維持した。完成例は既存の `sample: specdojo:pm-roles-sample` に外出し済みで、rulebook にサンプル章は設けていない。後続 sample-maintenance では駄菓子屋の文脈で採用結果と具体的な判断条件の充実を確認する。template-maintenance 案として、8 ロールの雛形が全件採用の指示に見えないよう、組織定義に応じて未採用項目を除く案内を検討する。
- 成果物側の追従事項: 現行 [[prj-0001:pm-organization|組織定義]] の「ロール・owner方針」「正本と責任境界」には Role code と責務をロール定義の正本とする記述が残る。上位標準と今回の rulebook が定める採用判断・転記先の分担と整合するよう、PM が成果物の別タスクで採用判断と機械可読一覧の責務を整理する。本フェーズは成果物本体を変更しないため維持した。
- recipe の後続作業案: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.pm-roles-recipe.yaml` も確認した。今回の矛盾修正に加え、recipe-maintenance で同結果の F003（schema 検証コマンド・成功結果・失敗時対応）と F008（更新時の表示ページ再生成・変更記録）を確認し、正本を複製しない手順として具体化する。
- 適用外の検証: `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/pm-roles.schema.yaml --data &lt;対象ファイル&gt;`（変更対象は Markdown 2 件のみで、YAML ファイルを変更していない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は `docs/ja/specdojo/` 配下のみで、`docs/ja/projects/` 配下の成果物を変更していない。）
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル、既存 plan、result を変更していない。）

## 4. 進め方と実践の型の適用

rulebook-maintenance
