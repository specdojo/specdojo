---
specdojo:
  id: prj-0001:xer-t-project-kata-pm-plan-040-20261112t215933z-aebae94e
  type: exec-result
  task_id: T-PROJECT-KATA-pm-plan-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-PROJECT-KATA-pm-plan-040/T-PROJECT-KATA-pm-plan-040-20261112T215933Z-aebae94e/plan.md
  started_at: "2026-11-12T21:59:37.058Z"
  completed_at: "2026-11-12T22:14:07.293Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:pm-plan
    - specdojo:pm-plan-rulebook
---

# Edit Result

## 1. 実施内容

- `pm-plan-rulebook` の見直しを行い、記述標準への準拠と Finding の解消に向けた改訂を実施しました。
- `based_on` の必須化、統合管理方針における根拠・証跡の追跡要件の定義、および構成管理・技術管理の視点に関する記述を整備しました。
- template と重複していた骨組み情報を削除し、意味要件と判断基準を中心とした構成へ整理しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/pm-plan-rulebook.md`: 記述標準に基づき章構成を整理し、意味要件、追跡方法（根拠・証跡）、判断基準（良い例／悪い例）を具体化した。特に `based_on` の必須化や統合管理表の構造定義、構成管理・技術管理の確認契機などの不足項目を補完した。

## 3. 申し送り

- 変更ファイル: docs/ja/specdojo/rulebooks/pm-plan-rulebook.md。成果物本体、recipe、sample、template、grade サイドカー、result は編集していません。reporter は以下の判断根拠と後続作業を result の「進め方と実践の型の適用」に記録してください。
- 確認した規範: [[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]、[[specdojo:document-metadata-standard|ドキュメントメタ情報標準]]、[[specdojo:people-and-organization-definition-standard|人と組織の定義標準]]、共通レビュー観点の `vp-arc-conciseness`、`vp-qe-verifiability`、`vp-qe-omissions-consistency`、`vp-qe-kata-conformance`、`vp-ux-readability`。PJR-2GD6 の重複回避方針に従い、共通メタ情報の値・構文は標準・schema への参照へ置き換えました。
- 実績・評価根拠: [[prj-0001:pm-plan|プロジェクト管理計画]]、[[prj-0001:pm-organization|組織定義]]、[[prj-0001:pm-roles|ロール定義]]、対象系統の recipe・sample・template、組織定義と成功基準の sample、配布・実プロジェクトの管理カタログ、execution/grade/results/ 配下の `specdojo.pm-plan-rulebook.yaml`、`specdojo.pm-plan-sample.yaml`、`prj-0001.pm-plan.yaml` を確認しました。plan の finding は対象 Kata 自身の grade に由来し、成果物から届いた grade／condense の原因記録はありません。
- F001・F005・F014: template と重複する見出し一覧・空表を削除し、「本文要件」を意味・必須条件中心へ改訂しました。F002: 管理行に根拠と証跡・正本を保持するか、結合 ID から一意に追跡する要件を定義。F003: 概要・スコープ・成功基準を含む `based_on` を必須化。F007: 構成管理・技術管理の確認契機、責任、記録先と委譲条件を追加しました。各ガイド節に判断基準と良い例・悪い例を記載しました。
- F004 はカタログ側が未解消です。rulebook の直接根拠方針を維持し、依存関係の整備を先行作業としました。後続では `docs/ja/specdojo/templates/dct-project-management-template.yaml` の `pm-plan` の空の `depends_on` に概要・スコープ・成功基準への依存を反映し、実プロジェクトのカタログも既存依存を保って整合させてください。循環がないことと Schedule・scaffold への展開を確認してから、成果物の `based_on` を追従します。
- recipe と template は必要と判断し、frontmatter の既存 ID 宣言を維持しました。recipe は価値・リスクから管理・証跡を導く作成手順、template は繰り返し利用する骨組みを担うためです。F006 は rulebook 側の追跡要件を整備しましたが、template 側は未解消です。後続の template-maintenance で統合表へ「根拠」「証跡・正本」列または結合 ID 欄を追加し、recipe-maintenance で根拠・証跡の収集と構成管理・技術管理の確認を手順へ反映してください。
- F008〜F013 は後続の sample-maintenance で解消します。現金支出・準備等の作業時間・継続運用負荷を分離し、初期受入に実在する `SC-01` と `AC-01`〜`AC-04`、試用継続に `SC-02`・`SC-03` を対応付け、未達・証跡不足時の保留と再判定を明記してください。RACI と Schedule の正本を分け、未決事項の現状に `_UNDECIDED_:` を付けます。更新後の追跡要件・構成管理・技術管理も適用し、clis-sample 程度の判断情報を持つ完成例へ充実させます。
- 費用・負荷の分離、条件 ID による判定、人間の最終判断、RACI と Task owner の区別は規範と整合するため維持しました。sample 側との矛盾では rulebook を正としています。未決事項のラベル欠落は成果物と sample の不備と判断し、規定を緩和せず、他の正本で追跡済みの場合は論点を参照して決定時期・判断者を複製しない扱いを明確化しました。正式な再評価と親検証は runner が実施します。
- 確認した規範: [[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]、[[specdojo:document-metadata-standard|ドキュメントメタ情報標準]]、[[specdojo:people-and-organization-definition-standard|人と組織の定義標準]]、共通レビュー観点の vp-arc-conciseness、vp-qe-verifiability、vp-qe-omissions-consistency、vp-qe-kata-conformance、vp-ux-readability。PJR-2GD6 の重複回避方針に従い、共通メタ情報の値・構文は標準・schema への参照へ置き換えました。
- 実績・評価根拠: [[prj-0001:pm-plan|プロジェクト管理計画]]、[[prj-0001:pm-organization|組織定義]]、[[prj-0001:pm-roles|ロール定義]]、対象系統の recipe・sample・template、組織定義と成功基準の sample、配布・実プロジェクトの管理カタログ、execution/grade/results/ 配下の specdojo.pm-plan-rulebook.yaml、specdojo.pm-plan-sample.yaml、prj-0001.pm-plan.yaml を確認しました。plan の finding は対象 Kata 自身の grade に由来し、成果物から届いた grade／condense の原因記録はありません。
- F004 はカタログ側が未解消です。rulebook の直接根拠方針を維持し、依存関係の整備を先行作業としました。後続では docs/ja/specdojo/templates/dct-project-management-template.yaml の pm-plan の空の `depends_on` に概要・スコープ・成功基準への依存を反映し、実プロジェクトのカタログも既存依存を保って整合させてください。循環がないことと Schedule・scaffold への展開を確認してから、成果物の `based_on` を追従します。
- F008〜F013 は後続の sample-maintenance で解消します。現金支出・準備等の作業時間・継続運用負荷を分離し、初期受入に実在する SC-01 と AC-01〜AC-04、試用継続に SC-02・SC-03 を対応付け、未達・証跡不足時の保留と再判定を明記してください。RACI と Schedule の正本を分け、未決事項の現状に `_UNDECIDED_:` を付けます。更新後の追跡要件・構成管理・技術管理も適用し、clis-sample 程度の判断情報を持つ完成例へ充実させます。
- 適用外の検証: `npm run validate:schema:file`（executor が変更したファイルは Markdown のみで、YAML の変更がないため。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下の成果物を変更していないため。）
- 適用外の検証: `npm run validate:history-links`（履歴ファイル、plan、result を変更していないため。）

## 4. 進め方と実践の型の適用

rulebook-maintenance
