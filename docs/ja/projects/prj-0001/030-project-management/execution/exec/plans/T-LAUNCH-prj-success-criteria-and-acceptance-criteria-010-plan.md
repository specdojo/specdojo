---
id: xep-t-launch-prj-success-criteria-and-acceptance-criteria-010
type: exec-plan
rulebook: xep-rulebook
task_id: T-LAUNCH-prj-success-criteria-and-acceptance-criteria-010
name: 一括整備（成果物＋参考資料）
mode: edit
status: ready
project_id: 
owner: BA
approach: bootstrap
---

# Edit Plan: T-LAUNCH-prj-success-criteria-and-acceptance-criteria-010

## 1. このフェーズで行うこと

エージェントが成果物と、それに紐づく参考資料一式（rulebook / recipe / sample / template）を
一貫した一組として作成・整備する。
既存の成果物・参考資料があれば評価し、維持/修正/作り直しを判断する。無ければ新規作成する。
必要に応じて外部情報・関連ドキュメントを調査し、出典とともに反映する。
成果物は owner ロールの責務に集中して記述し、参考資料は丸写しを避け一般化して相互に整合させる。
構造・必須項目・禁止事項は rulebook を正とする。
ここで整備した参考資料は refine-pass では凍結し、保守的に磨き込む。

## 2. 対象成果物と参考資料

このフェーズは、成果物とその参考資料一式を一貫した一組として作成・整備する。成果物本体と、それに紐づく rulebook / recipe / sample / template を同一タスクで編集する。

成果物（主対象）:

- `name`: 成功基準と受入条件
- `depends_on`: `prj-scope`
- `overview`: プロジェクト成功の判定基準と受入条件を明確化
- `path`: `docs/ja/projects/prj-0001/020-project-definition/prj-success-criteria-and-acceptance-criteria.md`

参考資料（rulebook frontmatter から解決。`_MISSING_` は未宣言・未整備のため新規作成する）:

- rulebook: `docs/ja/specdojo/rulebooks/prj-success-criteria-and-acceptance-criteria-rulebook.md`
- recipe: `_MISSING_`
- sample: `docs/ja/specdojo/samples/prj-success-criteria-and-acceptance-criteria-sample.md`
- template: `_MISSING_`

result: `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-prj-success-criteria-and-acceptance-criteria-010-result.md`

## 3. owner ロールとしての記述ポイント

成果物本体は frontmatter の `owner` に記載された role の視点で記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **BA（Business Analyst）**
- 責務: 要件、利用者視点、受入条件を整理する。

このロールが重視するレビュー観点:

- 業務価値との対応: 成果物の記述が業務目的、利用者、業務課題、期待効果と対応しているか。
- 要件・受入条件の充足: 要件、受入条件、対象範囲、対象外が利用者視点で確認できる粒度になっているか。
- 関係者・利用場面の明確性: 関係者、利用場面、確認者、合意対象が読み取れるか。

## 4. 進め方

成果物とその参考資料一式を、相互に矛盾しない一組として作成・整備する。成果物を主対象とし、そこから一般化した規定・作り方・例・雛形を参考資料に反映する。各対象は実際に読み込んだうえで、既存があれば評価し、維持/修正/作り直しを判断する。無ければ新規作成する。

1. 成果物（主対象）: `depends_on` の決定事項・用語・制約と整合させ、owner ロールの責務に集中して記述する。既存記述があれば内容を評価し、活かせる部分は維持、古い・矛盾する部分は修正、前提と合わない場合は作り直す。内部情報だけで判断できない一般的な観点・用語・標準があり、実行 agent が Web 検索能力を持つ場合は、関連情報を取得して出典を添える。
2. rulebook: 成果物の構造を一般化し、章構成・必須項目・禁止事項・判定基準を、同種成果物へ適用できる規定として整理する。
3. recipe: 良い成果物を作るための問い・観点・深掘り手順・レビュー観点を、再利用できる作成手順として整理する。
4. sample: 粒度・文体・表の書き方が伝わる最小の完成例にする。プロジェクト固有の値は一般化またはプレースホルダ化する。
5. template: 章構成の骨組みとプレースホルダを配置した雛形にする。成果物固有の内容は持ち込まない。

参考資料は成果物の丸写しにせず、同種成果物に再利用できる形に一般化する。構造・必須項目・禁止事項は rulebook を正とし、recipe / sample / template は rulebook と矛盾しないように揃える。

内容の根拠としてよい文書は、この plan に記載された対象（成果物・rulebook / recipe / sample / template）と、`対象成果物` セクションの `depends_on` 成果物に限定する。これら以外を成果物の内容の根拠にしない。ただし bootstrap では例外として、同種で `status: ready` の文書を手本として参照してよい（次項参照）。判断できない箇所は憶測で埋めず `_TODO_` / `_ASSUMPTION_` として論点を残す。

ここで整備した参考資料は後続の refine-pass で凍結し、編集しない。本タスクの実行に必要な bootstrap の進め方は、このセクションで完結する。approach 全体の定義を確認したい場合のみ、参考として [[specdojo-reference-materials-guide]] を参照する。

### 4.1. 同種の ready 文書を手本にする

bootstrap では参考資料が未整備なため、構造・記法・慣行の揺れ（毎回ゼロから設計し直すことによる churn）を避ける目的で、同種で `status: ready` の文書を手本にする。

- 成果物・rulebook・recipe・sample・template のそれぞれについて、同じ種別で `status: ready` の文書があれば、その章構成・粒度・文体・表の書き方・プレースホルダの置き方などを手本にし、確立済みの形に倣う。
- 手本にするのは形（構造・記法・慣行）であり、内容は丸写ししない。当該成果物の内容は `depends_on` とプロジェクト文脈に基づいて書く。
- 手本が複数ある場合は、対象に最も近い種別・粒度のものを優先する。`status: ready` の同種文書が無い場合は、手本なしで `depends_on` と対象領域の慣行から組み立てる。
- 手本にした文書は result の `参考資料の活用` セクションに記録する。

### 4.2. 既存物の評価と作り直しの判断

- 各対象に既存記述がある場合は、まず内容を読み、根拠（成果物・`depends_on`・同種の `ready` 文書・対象領域の慣行）と整合するかを評価する。
- 整合するものは維持し、過不足・陳腐化・矛盾がある部分のみ修正する。基準として機能しないほど内容が古い・薄い場合に限り作り直す。
- 既存が無い、または参照範囲から外れた対象は、成果物・`depends_on`・同種の `ready` 文書を手本に新規作成する。

### 4.3. 判断根拠の記録

成果物と各参考資料について、評価・作成・修正・維持の判断根拠を result に残す。記録先は次のとおり。

- 成果物と各参考資料の作成・修正・維持の判断、手本にした同種 `ready` 文書、相互整合の取り方、矛盾時に rulebook を正とした箇所、丸写しを避けるための一般化、Web 出典: result の `参考資料の活用` セクション。

## 5. 完了の狙い

この成果物が満たすべき狙い（成果物カタログの `done_criteria`）を、owner ロールの狙いと下流ロールの入力適合に分けて示す。「進め方」に従って成果物と参考資料を整備する中で、owner の狙いを作成目標として満たすことを目指す。下流ロールの項目は、その文書から各ロールが自分の責務の成果物を作成できるよう入力として最低限成立させる範囲にとどめ、各ロールの内容を成果物に作り込まない（一文書一責務）。下流ロールの適合性検証や観点別の自己レビュー・修正ループは行わず、多観点での検証は後続の独立した review task に委ねる。

owner として達成する狙い:

- 業務価値と受入条件が対応していること

下流ロールの入力適合（最低ライン。各ロールの内容は作り込まず、入力として成立させる）:

- [PO] 成功基準を承認できること
- [ARC] 技術的受入条件が確認できること
- [QE] 受入条件が検証可能な形で記述されていること

## 6. 完了手順

1. 「このフェーズで行うこと」と「進め方」に従って、成果物と rulebook / recipe / sample / template を更新する。
2. 「完了の狙い」を満たしているかを確認し、不足があれば加筆・補強する（観点別の自己レビューや再確認ループは行わない）。
3. 成果物と各参考資料が相互に矛盾していないかを確認する（構造・必須項目・禁止事項は rulebook を正とする）。
4. 必要な検証と lint を実行する。
5. result に実施内容・変更ファイル・参考資料の活用を記入する。

## 7. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

## 共通: 記法・リンク規約

この規約は、生成される全 exec plan に共通で適用される。成果物および result 内で他文書を参照する際のリンク記法を統一する。

- 文書へのリンクは、対象文書が既に存在する場合は `[[id|title]]` 形式で記載する（`id` は project 修飾 doc id）。
- まだ存在しない文書を参照する場合は、`[[...]]` ではなく `` `id` `` または `` `filename` `` のようにバッククォートで仮置きする。
