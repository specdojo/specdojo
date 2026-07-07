---
specdojo:
  id: prj-0001:xep-t-launch-prj-comparison-of-alternatives-140
  type: exec-plan
  rulebook: xep-rulebook
  task_id: T-LAUNCH-prj-comparison-of-alternatives-140
  name: 完成版確定
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  on_critical_path: true
  approach: bootstrap-finalize
---

# Finalize Plan: T-LAUNCH-prj-comparison-of-alternatives-140

## 1. このタスクで行うこと

担当ロールがレビュー後の内容を最終確認し、完成版として確定する。
bootstrap で整備し consolidate で最終調整した参考資料（rulebook / recipe / sample / template）も
あわせて確認し、成果物と参考資料それぞれの frontmatter の status を ready に更新する。

このタスクは bootstrap と対になる確定作業である。bootstrap で一式として整備し、consolidate で最終調整した成果物と参考資料（rulebook / recipe / sample / template）を、まとめて完成版として確定する。

## 2. 対象成果物と参考資料

成果物（主対象）:

- `name`: 代替案比較
- `path`: `docs/ja/projects/prj-0001/020-project-definition/prj-comparison-of-alternatives.md`
- `result`: `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-prj-comparison-of-alternatives-140-result.md`

参考資料（rulebook frontmatter から解決。`_MISSING_` はこの成果物には存在しないためスキップする）:

- rulebook: `docs/ja/specdojo/rulebooks/prj-comparison-of-alternatives-rulebook.md`
- recipe: `docs/ja/specdojo/recipes/prj-comparison-of-alternatives-recipe.md`
- sample: `docs/ja/specdojo/samples/prj-comparison-of-alternatives-sample.md`
- template: `docs/ja/specdojo/templates/prj-comparison-of-alternatives-template.md`

## 3. 最終確認チェックリスト

レビュー後の成果物が、成果物カタログの `done_criteria` を満たしているかを確認する。各項目を満たしていれば確定へ進み、満たしていない箇所があれば「確定手順」で最小限の修正を加える。

- [ ] 比較軸・評価根拠が業務価値と対応していること
- [ ] 推奨案を判断できる情報が含まれていること
- [ ] 技術的実現可能性・影響が評価されていること
- [ ] 案ごとのリスク・トレードオフが比較されていること

参考資料については、種別ごとに次を確認する。

- [ ] rulebook: 章構成・必須項目・禁止事項・判定基準が完成版の成果物と整合している
- [ ] recipe: 問い・観点・深掘り手順が完成版の作成過程に照らして有効である
- [ ] sample: 粒度・文体・表の書き方が完成例として適切である
- [ ] template: 章構成の骨組みとプレースホルダが雛形として再利用できる
- [ ] 共通: プロジェクト固有の内容が一般化されており、他プロジェクトでも再利用できる

## 4. 確定手順

1. 「このタスクで行うこと」に従い、レビュー後の成果物と参考資料を最終確認する。
2. 「最終確認チェックリスト」で満たせていない箇所があれば、既存記述を尊重して最小限の修正を加える。
3. 成果物 frontmatter の `status` を `ready` に更新する（この昇格は human のみが行える）。差し戻す場合は昇格させず、理由を result に記載する。
4. 存在する参考資料それぞれの frontmatter の `status` を `ready` に更新する。既に `ready` の参考資料は、consolidate の修正で劣化がないことの確認のみでよい。確定できない参考資料は昇格させず、理由を result に記載する。
5. result の `実施内容`・`変更ファイル` セクションを記入する。対象ごとの確認結果と確定判断（承認 / 差し戻し）、修正した場合はその内容を残す。

## 共通: 記法・確定時の規約

この規約は、生成される execution: human の exec plan（最終確認・確定）に共通で適用される。result の完了条件、他文書を参照する際のリンク記法、成果物の状態（status）の扱いを統一する。

- result への記入は、タスク完了に必須の作業である。成果物の確認・修正とは別に、最後に必ず実施する。
- result の必須セクションをすべて実際の内容で埋め、プレースホルダ（`_TODO_` など）や未記入のセクションを残さない。
- 成果物に修正が不要と判断した場合でも、result の記入は省略しない。確認した結果と確定判断（承認）を result に記入してから完了する。
- plan の「確定手順」に記載された確定対象（成果物、および対象に参考資料を含む場合は参考資料）の frontmatter の `status` を `ready` に更新することが、この確定タスクの完了条件である。`ready` への昇格は human のみが行える（agent 実行では exec のコミット時ガードで昇格がブロックされる）。差し戻す場合は `ready` に昇格させず、理由を result に記載する。
- 文書へのリンクは、対象文書が既に存在する場合は `[[id|title]]` 形式で記載する（`id` は project 修飾 doc id）。
- リンクを表（テーブル）のセル内に置く場合は、区切りの `|` を `[[id\|title]]` のようにエスケープする。エスケープしないと列がずれて表が壊れ、prettier 整形でセルが分割されて固定化される。
- 成果物を修正した場合は、確定前に整形・静的検査を実施してエラーを解消する。Markdown は `npx prettier --write <対象ファイル>` と `npx markdownlint <対象ファイル>`、YAML は対応 schema による検査を行う。
