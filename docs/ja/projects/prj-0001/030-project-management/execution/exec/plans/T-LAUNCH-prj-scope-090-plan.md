---
specdojo:
  id: prj-0001:xrp-t-launch-prj-scope-090
  type: exec-plan
  rulebook: xep-rulebook
  task_id: T-LAUNCH-prj-scope-090
  name: 完成版レビュー
  mode: review
  status: ready
  project_id: prj-0001
  owner: BA
  on_critical_path: true
  approach: fully-guided
  targets:
    - prj-0001:prj-scope
---

# Review Plan: T-LAUNCH-prj-scope-090

## 1. このフェーズで行うこと

レビューエージェントが磨き込み後の内容を確認し、承認・修正指示・差し戻しを判断する。
成果物カタログの done_criteria と関連成果物との整合性を全観点で確認する。
差し戻しの場合は修正箇所と理由を明記する。

## 2. 対象成果物

- `name`: プロジェクトスコープ
- `depends_on`:
  - [[prj-0001:prj-overview]]
- `overview`: プロジェクトの対象範囲と除外範囲を定義
- `path`: `docs/ja/projects/prj-0001/020-project-definition/prj-scope.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/prj-scope-rulebook.md`
- `result`: `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-prj-scope-090-result.md`

## 3. レビュー観点

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID  | ロール | viewpoint_id | 確認基準 |
| --- | ------ | ------------ | -------- |
| RVP-001 | BA | vp-ba-requirements-completeness | 業務スコープ・除外範囲・利用者影響が業務観点で確認できること |
| RVP-002 | PO | vp-po-purpose-alignment | 対象範囲・対象外を承認できること |
| RVP-003 | ARC | vp-arc-technical-constraints | 技術的スコープ境界（外部連携の有無など）が識別できること |
| RVP-004 | PM | vp-pm-plan-feasibility | スコープ境界をスケジュール計画の前提として確認できること |
<!-- prettier-ignore-end -->

<!-- markdownlint-enable MD055 MD056 -->

### RVP-001（BA: vp-ba-requirements-completeness）

**確認基準**: 業務スコープ・除外範囲・利用者影響が業務観点で確認できること

**coverage_required:**

- stakeholder: 利用者、意思決定者、確認者、運用者、影響を受ける関係者が識別されているか。
- scope_boundary: 対象範囲、対象外、前提、制約、依存関係が判断できるか。
- use_case: 主要な利用シーン、利用者行動、期待結果が具体化されているか。
- business_event: 業務上の開始条件、完了条件、発生イベント、トリガーが識別されているか。
- exception_case: 例外ケース、異常系、境界条件、失敗時の扱いが確認できるか。
- non_functional: 性能、可用性、セキュリティ、保守性、拡張性、互換性などの品質要求が確認できるか。
- operations: 継続運用、変更管理、問い合わせ、障害時対応、再生成、公開後の保守が考慮されているか。
- acceptance: pass / fail を判断できる受入条件、完了条件、検証手順があるか。
- traceability: 上位目的から要求、要件、仕様、設計、テスト、運用までの対応を追跡できるか。

**チェック観点:** 要件、受入条件、対象範囲、対象外が利用者視点で確認できる粒度になっているか。

**エビデンス例:** 要件、受入条件、対象範囲、除外範囲、用語定義。

### RVP-002（PO: vp-po-purpose-alignment）

**確認基準**: 対象範囲・対象外を承認できること

**coverage_required:**

- business_goal: 業務目的、課題、期待効果、成功条件との対応が説明できるか。
- scope_boundary: 対象範囲、対象外、前提、制約、依存関係が判断できるか。
- traceability: 上位目的から要求、要件、仕様、設計、テスト、運用までの対応を追跡できるか。

**チェック観点:** 成果物の内容がプロジェクト目的、スコープ、優先順位、公開方針と矛盾していないか。

**エビデンス例:** 目的、対象範囲、対象外、判断理由、関連成果物への参照。

### RVP-003（ARC: vp-arc-technical-constraints）

**確認基準**: 技術的スコープ境界（外部連携の有無など）が識別できること

**coverage_required:**

- scope_boundary: 対象範囲、対象外、前提、制約、依存関係が判断できるか。
- data: 入力、出力、データ項目、保持、更新、削除、整合性の扱いが確認できるか。
- integration: 外部システム、API、ファイル、通知、手動連携などの依存が識別されているか。
- non_functional: 性能、可用性、セキュリティ、保守性、拡張性、互換性などの品質要求が確認できるか。

**チェック観点:** 技術的な前提、制約、外部依存、構成判断が必要な範囲で明示されているか。

**エビデンス例:** 技術制約、外部依存、schema、validate 手順、構成方針。

### RVP-004（PM: vp-pm-plan-feasibility）

**確認基準**: スコープ境界をスケジュール計画の前提として確認できること

**チェック観点:** 成果物の内容がタスク化、順序付け、所要時間見積もり、進捗確認に使える粒度になっているか。

**エビデンス例:** 依存関係、作業単位、完了条件、担当 Role code、期限または判断タイミング。

owner ロールの観点は、成果物がその責務を果たしているかを確認する。owner 以外のロールの観点は、その文書から各ロールが自分の責務の成果物を作成できるかという入力適合性の最低限の確認とし、各ロールの内容まで踏み込む過剰な再レビューはしない（一文書一責務）。

## 4. 進め方

対象成果物に紐づく rulebook / recipe / sample / template は、いずれも指定されたファイルを実際に読み込んだうえで、次の役割に沿って確認の基準にする。読み込まずに記憶や推測で代替しない。レビューでは成果物を組み立てるのではなく、成果物が基準を満たすかを照合する。

参照ファイル（rulebook frontmatter から解決。`_MISSING_` の項目は未宣言・未整備のため「参考資料が存在しない・内容が薄い場合」に従う）:

- rulebook: `docs/ja/specdojo/rulebooks/prj-scope-rulebook.md`
- recipe: `docs/ja/specdojo/recipes/prj-scope-recipe.md`
- sample: `docs/ja/specdojo/samples/prj-scope-sample.md`
- template: `docs/ja/specdojo/templates/prj-scope-template.md`

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
