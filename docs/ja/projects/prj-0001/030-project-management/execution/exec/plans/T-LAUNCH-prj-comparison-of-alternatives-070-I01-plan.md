---
id: prj-0001:xep-t-launch-prj-comparison-of-alternatives-070-i01
type: exec-plan
rulebook: xep-rulebook
task_id: T-LAUNCH-prj-comparison-of-alternatives-070-I01
name: 磨き込み
mode: edit
status: ready
project_id: prj-0001
owner: ARC
approach: fully-guided
---

# Edit Plan: T-LAUNCH-prj-comparison-of-alternatives-070-I01

## 1. このフェーズで行うこと

磨き込み

## 2. 対象成果物

- `name`: 代替案比較
- `depends_on`: `prj-scope`, `prj-issues-and-approach`
- `overview`: 技術的・方針的な代替案を比較評価
- `path`: `docs/ja/projects/prj-0001/020-project-definition/prj-comparison-of-alternatives.md`
- `result`: `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-prj-comparison-of-alternatives-070-I01-result.md`

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **ARC（Architect）**
- 責務: 文書体系、構成方針、技術制約を整理する。

このロールが重視するレビュー観点:

- 文書構造・配置・命名: frontmatter、ID、ファイル名、配置、見出し、リンクがプロジェクトの文書体系と整合しているか。
- 成果物間整合: 成果物カタログ、Schedule、RACI、組織定義、メンバー定義、生成物と矛盾していないか。
- 技術前提・制約の明確性: 技術的な前提、制約、外部依存、構成判断が必要な範囲で明示されているか。

## 4. 進め方

対象成果物に紐づく rulebook / recipe は、いずれも指定されたファイルを実際に読み込んだうえで、次の役割に沿って参照する。読み込まずに記憶や推測で代替しない。

参照ファイル（rulebook frontmatter から解決。`_MISSING_` の項目は未宣言・未整備のため「参考資料が存在しない・内容が薄い場合」に従う）:

- rulebook: `docs/ja/specdojo/rulebooks/prj-comparison-of-alternatives-rulebook.md`
- recipe: `docs/ja/specdojo/recipes/prj-comparison-of-alternatives-recipe.md`

1. rulebook: 指定された rulebook を読み込み、成果物が必須要素をすべて満たし、禁止事項に抵触していないかを構造面の基準として確認する。
2. recipe: 指定された recipe を読み込み、示された問い・観点・深掘り手順に沿って内容を組み立てる。

磨き込みでは sample / template は読み込まない。粒度・文体・表現・章構成は、既存の対象成果物を基準としてそろえる。複数の文書間で記述に矛盾がある場合は rulebook を正とする。

参照してよい文書は、この plan に記載されたものに限定する。具体的には、本セクションの rulebook / recipe と、`対象成果物` セクションの `depends_on` 成果物である。plan に列挙されていない他のプロジェクト文書を独自に探索・参照しない。不足は plan 記載文書とこの plan 自身の記述（フェーズ説明・レビュー観点）で補い、それでも判断できない箇所は憶測で埋めず `_TODO_` / `_ASSUMPTION_` として論点を残す。

本タスクの実行に必要な fully-guided の参照方針は、このセクションで完結する。approach 全体の定義（他 approach との対比や review への適用）を確認したい場合のみ、参考として [[specdojo-reference-materials-guide]] を参照する。

### 4.1. 参考資料が存在しない・内容が薄い場合

- 指定された rulebook / recipe のいずれかが存在しない、または基準として機能しないほど内容が薄い場合は、その事実と判断を result の `参考資料の活用` セクションに記録する。
- 不足分は、存在する他の参考資料と `depends_on` 成果物（いずれも plan 記載の文書）、および既存の対象成果物で補う。参考資料の欠落を理由にレビュー観点を未達にしない。
- 章構成は既存の対象成果物を骨組みとし、判断に迷う場合は rulebook の構成を正とする。
- 参考資料そのものの整備が必要と判断した場合でも、本タスクの範囲を超える整備は行わず、申し送りに残す。

### 4.2. 既存記述の扱い

- 対象成果物に既存の記述がある場合は、まず内容を確認し、既存記述を尊重する。既存記述の破棄や全面的な書き換えは原則として行わず、既存記述を基礎として不足分を加筆・補強する。
- `depends_on` の最新の決定事項と明確に矛盾する箇所に限り、矛盾を解消する最小限の修正にとどめる。既存記述が古いか判断できない場合は破棄せず、`_TODO_` / `_ASSUMPTION_` で論点を残す。
- 加筆・修正の判断根拠を result の `参考資料の活用` セクションに残す。

### 4.3. 判断根拠の記録

参照した文書・参照しなかった文書と、その判断根拠を result に残す。記録先は次のとおり。

- 参照した rulebook / recipe の使い分け、矛盾時に rulebook を正とした箇所、欠落・薄い参考資料の扱い、既存記述の加筆・修正の根拠: result の `参考資料の活用` セクション。

## 5. 完了の狙い

この成果物が満たすべき狙い（成果物カタログの `done_criteria`）を、owner ロールの狙いと下流ロールの入力適合に分けて示す。「進め方」に従って参考資料に沿って記述する中で、owner の狙いを作成目標として満たすことを目指す。下流ロールの項目は、その文書から各ロールが自分の責務の成果物を作成できるよう入力として最低限成立させる範囲にとどめ、各ロールの内容を成果物に作り込まない（一文書一責務）。下流ロールの適合性検証や観点別の自己レビュー・修正ループは行わず、多観点での検証は後続の独立した review task に委ねる。

owner として達成する狙い:

- 技術的実現可能性・影響が評価されていること

下流ロールの入力適合（最低ライン。各ロールの内容は作り込まず、入力として成立させる）:

- [BA] 比較軸・評価根拠が業務価値と対応していること
- [PO] 推奨案を判断できる情報が含まれていること
- [PM] 案ごとのリスク・トレードオフが比較されていること

## 6. 完了手順

1. 「このフェーズで行うこと」と「進め方」に従って成果物を更新する。
2. 「完了の狙い」を満たしているかを確認し、不足があれば加筆・補強する（観点別の自己レビューや再確認ループは行わない）。
3. 必要な検証と lint を実行する。
4. result に実施内容・変更ファイル・参考資料の活用を記入する。

## 7. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

## 共通: 記法・成果物規約

この規約は、生成される全 exec plan に共通で適用される。他文書を参照する際のリンク記法と、成果物の状態（status）の扱いを統一する。

- 文書へのリンクは、対象文書が既に存在する場合は `[[id|title]]` 形式で記載する（`id` は project 修飾 doc id）。
- まだ存在しない文書を参照する場合は、`[[...]]` ではなく `` `id` `` または `` `filename` `` のようにバッククォートで仮置きする。
- 成果物 frontmatter の `status` を `ready` に変更しない。`ready` への昇格は人間のみが行うため、`draft` のまま据え置く（exec のコミット時ガードでも昇格はブロックされる）。
