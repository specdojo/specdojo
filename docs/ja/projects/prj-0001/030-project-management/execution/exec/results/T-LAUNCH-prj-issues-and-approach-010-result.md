---
id: prj-0001:xer-t-launch-prj-issues-and-approach-010
type: exec-result
task_id: T-LAUNCH-prj-issues-and-approach-010
mode: edit
status: complete
project_id: prj-0001
plan_ref: exec/plans/T-LAUNCH-prj-issues-and-approach-010-plan.md
started_at: "2026-06-25T12:07:48.817Z"
completed_at: "2026-06-25T12:15:20.358Z"
agent: claude-expert-edit-agent
approach: bootstrap
---
## 1. 実施内容

成果物「プロジェクト課題と解決アプローチ」と、それに紐づく参考資料一式（rulebook / recipe / sample / template）を、相互に整合する一組として整備した（approach: bootstrap、owner: BA）。

- 成果物（`prj-issues-and-approach.md`）: 既存内容を評価し、骨子（課題一覧・原因・解決策候補・採用アプローチ・トレードオフ/リスク・ToDo）は妥当だったため維持した。depends_on（`prj-scope`、`prj-assumptions-constraints-dependencies`）との整合を高めるため、(1) frontmatter の `based_on` に `prj-0001:prj-assumptions-constraints-dependencies` を追加、(2) H1 直下に、スコープと前提・制約・依存関係を前提とし利用者視点で課題を整理する旨の導入文を wikilink 付きで追加、(3) Japanese 文中に英語のまま混入していた `Schedule` を「スケジュール」へ修正した。
- rulebook（`prj-issues-and-approach-rulebook.md`）: 章構成・必須項目・禁止事項は充実していたため内容は維持し、frontmatter を sibling の ready 文書に合わせて `target_format` / `recipe` / `sample` / `template` / `based_on` / `supersedes` を補い、`status` を `ready` に更新。参考資料参照を「サンプル / 作成レシピ / テンプレート」の 3 節へ整理した。
- recipe（新規作成）: 問い・深掘り手順・良い例/悪い例・レビュー観点・仕上げチェックを、同種成果物に再利用できる作成手順として整理した。
- sample: 既存はメタ説明的で rulebook の章構成に沿わず完成例として機能していなかったため作り直し、共通サンプル文脈（駄菓子屋きぬや）の最小完成例として全必須章を記述した。
- template（新規作成）: 章構成の骨組みとプレースホルダ（`_PROJECT_ID_` / `_PROJECT_NAME_` / `_TODO_`）のみを配置し、成果物固有の内容は持ち込まない雛形とした。

検証: 対象 5 ファイルに対し `markdownlint`・`remark`（lint:fm）がエラーなし、`npm run validate:catalog` が OK。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/020-project-definition/prj-issues-and-approach.md`（修正）
- `docs/ja/specdojo/rulebooks/prj-issues-and-approach-rulebook.md`（修正）
- `docs/ja/specdojo/recipes/prj-issues-and-approach-recipe.md`（新規）
- `docs/ja/specdojo/samples/prj-issues-and-approach-sample.md`（作り直し）
- `docs/ja/specdojo/templates/prj-issues-and-approach-template.md`（新規）

## 3. 申し送り

- 成果物本体・rulebook の `status` は本タスクで `ready` 相当へ整えたが、成果物 `prj-issues-and-approach.md` 自体の `status` は `draft` のまま据え置いた（後続の review task の判断に委ねる）。
- 成果物本文の ToDo「初回公開に必要な最小成果物セットの確定」「README / LICENSE / CONTRIBUTING の整備方針」は未確定論点として残っており、`PO` / `ARC` の判断が必要。

## 4. 参考資料の活用

- 進め方: bootstrap として、同種で `status: ready` の sibling 文書を「形（構造・記法・慣行）」の手本にした。内容は depends_on（`prj-scope`、`prj-assumptions-constraints-dependencies`）とプロジェクト文脈に基づいて記述し、丸写しはしていない。
- 手本にした ready 文書:
  - rulebook frontmatter 構成: `prj-scope-rulebook` / `prj-assumptions-constraints-dependencies-rulebook`（`target_format` / `recipe` / `sample` / `template` の付与、参考資料節の置き方）。
  - recipe 構成: `prj-scope-recipe`（使い方・収集情報・作成手順・各章の問いと書き方・深掘り・良い例/悪い例・レビュー観点・仕上げチェックの章立て）。
  - sample 文脈と粒度: `prj-scope-sample` / `prj-assumptions-constraints-dependencies-sample`（駄菓子屋きぬやの共通文脈、`based_on: prj-scope-sample`、最小完成例の粒度）。
  - template 形式: `prj-scope-template`（`_PROJECT_ID_` / `_PROJECT_NAME_` / `_TODO_` プレースホルダの置き方）。
- 一般化（丸写し回避）: 成果物本体は SpecDojo 固有の課題（文書体系・AI Agent 適合・整合性維持）を扱う一方、sample は駄菓子屋文脈の別事例にし、recipe/template はプロジェクト非依存の問い・骨組みへ抽象化した。
- 相互整合と rulebook を正とした判断: 章構成・必須項目・禁止事項は rulebook（本文構成「課題一覧/原因/解決策候補/採用アプローチと理由/トレードオフ・リスク/次の検討事項」）を正とし、recipe・sample・template の章見出しと必須・任意の区別を rulebook に合わせた。既存 sample は rulebook 章構成と不整合だったため、rulebook を正として作り直した。
- 参照範囲: 内容の根拠は本 plan に記載の対象（成果物・参考資料一式）と depends_on（`prj-scope`、`prj-assumptions-constraints-dependencies`）に限定した。Web 検索は不要と判断し未使用。
