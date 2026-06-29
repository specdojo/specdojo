---
id: prj-0001:xrp-t-launch-pm-members-090
type: exec-plan
rulebook: xep-rulebook
task_id: T-LAUNCH-pm-members-090
name: 完成版レビュー
mode: review
status: ready
project_id: prj-0001
owner: PO
on_critical_path: true
approach: fully-guided
---

# Review Plan: T-LAUNCH-pm-members-090

## 1. このフェーズで行うこと

レビューエージェントが磨き込み後の内容を確認し、承認・修正指示・差し戻しを判断する。
成果物カタログの done_criteria と関連成果物との整合性を全観点で確認する。
差し戻しの場合は修正箇所と理由を明記する。

## 2. 対象成果物

- `name`: メンバー定義
- `depends_on`:
  - [[prj-0001:pm-organization]]
  - [[prj-0001:pm-roles]]
- `overview`: yaml で実行主体（人間・agent）と担当ロールリスト（roles）を定義
- `path`: `docs/ja/projects/prj-0001/030-project-management/020-organization/pm-members.yaml`
- `rulebook`: `docs/ja/specdojo/rulebooks/pm-members-rulebook.md`
- `result`: `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-pm-members-090-result.md`

## 3. レビュー観点

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID  | ロール | viewpoint_id | 確認基準 |
| --- | ------ | ------------ | -------- |
| RVP-001 | PO | vp-po-decision-readiness | 実行主体（人間・agent）と担当ロールリスト（roles）を承認できること |
| RVP-002 | ARC | vp-arc-cross-document-consistency | pm-roles.yaml の Role code 語彙と member の roles が整合していること |
| RVP-003 | QE | vp-qe-omissions-consistency | 必要なロールを担う member が過不足なく定義されていること |
<!-- prettier-ignore-end -->

<!-- markdownlint-enable MD055 MD056 -->

### RVP-001（PO: vp-po-decision-readiness）

**確認基準**: 実行主体（人間・agent）と担当ロールリスト（roles）を承認できること

**coverage_required:**

- stakeholder: 利用者、意思決定者、確認者、運用者、影響を受ける関係者が識別されているか。
- permission: 実行者、承認者、責任分界、権限チェック、agent と人間の境界が明確か。
- auditability: 判断、承認、変更、実行結果を追跡できる証跡が残るか。

**チェック観点:** PO が承認、保留、差し戻しを判断するための論点、未決事項、影響範囲が明示されているか。

**エビデンス例:** 判断対象、判断者、未決事項、前提、影響、次アクション。

### RVP-002（ARC: vp-arc-cross-document-consistency）

**確認基準**: pm-roles.yaml の Role code 語彙と member の roles が整合していること

**coverage_required:**

- permission: 実行者、承認者、責任分界、権限チェック、agent と人間の境界が明確か。
- traceability: 上位目的から要求、要件、仕様、設計、テスト、運用までの対応を追跡できるか。
- auditability: 判断、承認、変更、実行結果を追跡できる証跡が残るか。

**チェック観点:** 成果物カタログ、Schedule、RACI、組織定義、メンバー定義、生成物と矛盾していないか。

**エビデンス例:** local_id、depends_on、owner、roles、RACI、関連文書、生成元。

### RVP-003（QE: vp-qe-omissions-consistency）

**確認基準**: 必要なロールを担う member が過不足なく定義されていること

**チェック観点:** 必須章、必須キー、参照、責務、禁止事項に抜け漏れや矛盾がないか。

**エビデンス例:** rulebook、schema、関連文書、禁止事項、レビュー履歴。

owner ロールの観点は、成果物がその責務を果たしているかを確認する。owner 以外のロールの観点は、その文書から各ロールが自分の責務の成果物を作成できるかという入力適合性の最低限の確認とし、各ロールの内容まで踏み込む過剰な再レビューはしない（一文書一責務）。

## 4. 進め方

対象成果物に紐づく rulebook / recipe / sample / template は、いずれも指定されたファイルを実際に読み込んだうえで、次の役割に沿って確認の基準にする。読み込まずに記憶や推測で代替しない。レビューでは成果物を組み立てるのではなく、成果物が基準を満たすかを照合する。

参照ファイル（rulebook frontmatter から解決。`_MISSING_` の項目は未宣言・未整備のため「参考資料が存在しない・内容が薄い場合」に従う）:

- rulebook: `docs/ja/specdojo/rulebooks/pm-members-rulebook.md`
- recipe: `docs/ja/specdojo/recipes/pm-members-recipe.md`
- sample: `docs/ja/specdojo/samples/pm-members-sample.yaml`
- template: `docs/ja/specdojo/templates/pm-members-template.yaml`

1. rulebook: 指定された rulebook を読み込み、成果物が必須要素をすべて満たし、禁止事項に抵触していないかを構造面の基準として確認する。
2. recipe: 指定された recipe を読み込み、示された問い・観点に対して成果物の内容が十分かを確認する。
3. sample: 指定された sample を読み込み、粒度・文体・表現・表の書き方と整合しているかを確認する。
4. template: 指定された template を読み込み、章構成と整合しているか、`_TODO_` などのプレースホルダが残っていないかを確認する。

複数の文書間で記述に矛盾がある場合は rulebook を正として判定する（template の章構成が rulebook と食い違う場合も rulebook を正とする）。

参照してよい文書は、この plan に記載されたものに限定する。具体的には、本セクションの rulebook / recipe / sample / template と、`対象成果物` セクションの `depends_on` 成果物である。クロス文書整合を確認するレビュー観点では、`depends_on` 成果物を実際に読み込み、対象成果物と突き合わせて整合を判定する。plan に列挙されていない他のプロジェクト文書を独自に探索・参照しない。レビューの判定は plan に記載された資料とこの plan 自身の記述（フェーズ説明・レビュー観点）だけを根拠に行い、不足があっても未記載の文書を追加で読んで補わない。それでも判断できない箇所は憶測で埋めず、該当レビュー観点を unclear とし理由を残す。

本タスクの実行に必要な fully-guided の確認方針は、このセクションで完結する。approach 全体の定義（他 approach との対比や edit への適用）を確認したい場合のみ、参考として [[specdojo-reference-materials-guide]] を参照する。

### 4.1. 参考資料が存在しない・内容が薄い場合

- 指定された rulebook / recipe / sample / template のいずれかが存在しない、または基準として機能しないほど内容が薄い場合は、その事実と判断を review result の `参考資料との整合確認` セクションに記録する。
- 欠落を理由にレビュー観点を unclear のまま放置しない。存在する他の参考資料と `depends_on` 成果物・プロジェクト文脈を基準にして判定根拠を補う。
- template が欠落する場合は、rulebook の構造を骨組みとして整合を確認する。
- 参考資料そのものの整備が必要と判断した場合でも、本タスクの範囲を超える整備は行わず、findings または申し送りに残す。

### 4.2. 判断根拠の記録

確認した文書・確認しなかった文書と、その判断根拠を review result に残す。記録先は次のとおり。

- レビュー観点ごとの pass / fail / unclear 判定と根拠: review result の `レビュー観点別結果` セクション（各 `RVP-NNN`）。
- 参照した rulebook / recipe / sample / template の使い分け、矛盾時に rulebook を正とした箇所、欠落・薄い参考資料の扱い: review result の `参考資料との整合確認` セクション。
- 検出した問題点・指摘事項: review result の `findings` セクション。

## 5. 完了手順

1. レビュー観点ごとに pass / fail / unclear を判定し、根拠を記入する。
2. result の各レビュー観点セクションに記入する。result には各 RVP の `### RVP-NNN（ロール: viewpoint_id）` と `確認基準` が展開済みなので、`result` / `evidence` / `notes` を埋める。
3. `evidence` の参照は `[[id]]` 形式（Obsidian wikilink）で記載する。行番号アンカー（`#L12-L18` など）や絶対パスは使わない。位置の補足が必要な場合は `evidence` 本文で述べる。
4. fail / unclear、または recommendation が revise / reject でも、レビュー結果を記録できた場合は正常終了する（終了コード 0）。

## 6. 異常終了の条件

- 対象ファイル不明・依存未解決・result 更新不能など、レビュー自体を完了できない場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `review-blocked: <reason>; criterion=<id>; ref=<path>`）。
- agent 自身は claim / complete / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

## 共通: 記法・成果物規約

この規約は、生成される全 exec plan に共通で適用される。他文書を参照する際のリンク記法と、成果物の状態（status）の扱いを統一する。

- 文書へのリンクは、対象文書が既に存在する場合は `[[id|title]]` 形式で記載する（`id` は project 修飾 doc id）。
- リンクを表（テーブル）のセル内に置く場合は、区切りの `|` を `[[id\|title]]` のようにエスケープする。エスケープしないと列がずれて表が壊れ、prettier 整形でセルが分割されて固定化される。
- まだ存在しない文書を参照する場合は、`[[...]]` ではなく `` `id` `` または `` `filename` `` のようにバッククォートで仮置きする。
- 成果物 frontmatter の `status` を `ready` に変更しない。`ready` への昇格は人間のみが行うため、`draft` のまま据え置く（exec のコミット時ガードでも昇格はブロックされる）。
- 整形・静的検査は、この plan の完了手順または本共通規約で明示されたコマンドだけを実行する。plan に未記載の追加 test / build / schema 検証を独自に実行しない。追加検証が必要と判断した場合は、実行せず result の申し送りに残す。
- Markdown 成果物を編集した後は、`npx prettier --write <対象ファイル>` で整形し、`npx markdownlint <対象ファイル>` で静的検査を実施する。検査でエラーが出た場合は修正してから完了とする。
- YAML 成果物を編集した後は、対応 schema `docs/specdojo/schemas/v1/pm-members.schema.yaml` に従って記述し、`npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/pm-members.schema.yaml --data <対象ファイル>` で schema 検査を実施する。検査でエラーが出た場合は修正してから完了とする。
