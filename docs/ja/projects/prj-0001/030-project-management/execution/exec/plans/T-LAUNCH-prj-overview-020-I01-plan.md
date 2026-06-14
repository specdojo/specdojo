---
id: prj-0001:xep-t-launch-prj-overview-020-i01
type: exec-plan
rulebook: xep-rulebook
task_id: T-LAUNCH-prj-overview-020-I01
name: 調査・補強
mode: edit
status: ready
project_id: prj-0001
owner: BA
on_critical_path: true
approach: recipe-guided
viewpoints_ref: /docs/ja/projects/prj-0001/030-project-management/010-management-plan/pm-review-viewpoints.yaml
---

# Edit Plan: T-LAUNCH-prj-overview-020-I01

## 1. このフェーズで行うこと

エージェントが外部情報・関連ドキュメントを調査し、たたき台の TODO を埋めて内容を補強する。
既存記述との矛盾・抜け漏れも確認し、修正・追記する。
調査結果は出典・根拠とともに記載する。

## 2. 対象成果物

- `name`: プロジェクト概要
- `depends_on`: -
- `overview`: プロジェクトの目的・背景・ゴールを定義
- `path`: `/docs/ja/projects/prj-0001/020-project-definition/prj-overview.md`
- `result`: `/docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-prj-overview-020-I01-result.md`

**done_criteria:**

- プロジェクトの目的・背景・ゴールが業務観点で確認できる粒度で記述されていること
- プロジェクトの目的・スコープを承認できる情報が含まれていること
- 技術的前提・制約を読み取れる情報が含まれていること
- 成功判定の輪郭が確認できること
- プロジェクトの目的・スコープを計画立案の基礎として確認できること

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **BA（Business Analyst）**
- 責務: 要件、利用者視点、受入条件を整理する。

このロールが重視するレビュー観点:

- 業務価値との対応: 成果物の記述が業務目的、利用者、業務課題、期待効果と対応しているか。
- 要件・受入条件の充足: 要件、受入条件、対象範囲、対象外が利用者視点で確認できる粒度になっているか。
- 関係者・利用場面の明確性: 関係者、利用場面、確認者、合意対象が読み取れるか。

## 4. 進め方

対象成果物に紐づく recipe を、指定されたファイルを実際に読み込んだうえで主な基準として参照する。読み込まずに記憶や推測で代替しない。

1. recipe: 指定された recipe を読み込み、示された構成・問い・観点・深掘り手順に沿って成果物を組み立てる。
2. recipe が答えを示さない箇所は、`depends_on` 成果物・類似成果物・プロジェクト文脈との整合で補う。

成果物は、冗長な記述や内容の重複を避け、簡潔でわかりやすく記載する。

rulebook / sample / template は未成熟と判断されているため、存在しても構造・文体・粒度の必須基準としては扱わない。recipe の指示が他の文書と矛盾する場合は recipe を優先する。

本タスクの実行に必要な recipe-guided の参照方針は、このセクションで完結する。approach 全体の定義（他 approach との対比や review への適用）を確認したい場合のみ、参考として [[specdojo-reference-materials-guide]] を参照する。

### 4.1. recipe が存在しない・内容が薄い場合

- recipe は recipe-guided の唯一の主基準であるため、存在しない、または基準として機能しないほど内容が薄い場合は、その事実と判断を result の `参考資料の活用` セクションに記録する。
- その場合は `depends_on` 成果物・類似成果物・プロジェクト文脈を主な根拠に組み立て、何を recipe の代わりに根拠としたかを明示する。
- recipe そのものの整備が必要と判断した場合でも、本タスクの範囲を超える整備は行わず、申し送りに残す。

### 4.2. 既存記述の扱い

- 対象成果物に既存の記述がある場合は、まず内容を確認する。`depends_on` の最新の決定事項やプロジェクト文脈と矛盾する、または前提が変わって古くなった記述は破棄する。
- 古くなっていない記述は活かし、不足分を加筆・補強する。
- 破棄・加筆の判断根拠を result の `参考資料の活用` セクションに残す。

### 4.3. 判断根拠の記録

参照した文書と判断根拠を result に残す。記録先は次のとおり。

- done_criteria の充足状況: result の `done_criteria 確認` セクション。
- recipe を参照した箇所、recipe で判断できず補助材料で判断した箇所、rulebook / sample / template を基準にしなかった理由と代わりに根拠にした内容、既存記述の破棄・加筆の根拠: result の `参考資料の活用` セクション。

## 5. 全 role 観点による自己レビュー

成果物の更新後、owner の観点だけでなく、done_criteria に割り当てられたすべての role の観点で自己レビューする。この自己レビューは edit task 内で成果物の完成度を高めるために行うものであり、後続の独立した review task を代替しない。

<!-- markdownlint-disable MD055 MD056 -->
| ID | ロール | viewpoint_id | 確認基準 |
|---|---|---|---|
| RVP-001 | BA | vp-ba-business-value | プロジェクトの目的・背景・ゴールが業務観点で確認できる粒度で記述されていること |
| RVP-002 | PO | vp-po-purpose-alignment | プロジェクトの目的・スコープを承認できる情報が含まれていること |
| RVP-003 | ARC | vp-arc-technical-constraints | 技術的前提・制約を読み取れる情報が含まれていること |
| RVP-004 | QE | vp-qe-verifiability | 成功判定の輪郭が確認できること |
| RVP-005 | PM | vp-pm-plan-feasibility | プロジェクトの目的・スコープを計画立案の基礎として確認できること |
<!-- markdownlint-enable MD055 MD056 -->

### RVP-001（BA: vp-ba-business-value）

**確認基準**: プロジェクトの目的・背景・ゴールが業務観点で確認できる粒度で記述されていること

**coverage_required:**

- stakeholder
- business_goal
- use_case
- business_event
- traceability

**チェック観点:** 成果物の記述が業務目的、利用者、業務課題、期待効果と対応しているか。

**エビデンス例:** 背景、目的、利用者、業務フロー、価値、成功基準。

### RVP-002（PO: vp-po-purpose-alignment）

**確認基準**: プロジェクトの目的・スコープを承認できる情報が含まれていること

**coverage_required:**

- business_goal
- scope_boundary
- traceability

**チェック観点:** 成果物の内容がプロジェクト目的、スコープ、優先順位、公開方針と矛盾していないか。

**エビデンス例:** 目的、対象範囲、対象外、判断理由、関連成果物への参照。

### RVP-003（ARC: vp-arc-technical-constraints）

**確認基準**: 技術的前提・制約を読み取れる情報が含まれていること

**coverage_required:**

- scope_boundary
- data
- integration
- non_functional

**チェック観点:** 技術的な前提、制約、外部依存、構成判断が必要な範囲で明示されているか。

**エビデンス例:** 技術制約、外部依存、schema、validate 手順、構成方針。

### RVP-004（QE: vp-qe-verifiability）

**確認基準**: 成功判定の輪郭が確認できること

**coverage_required:**

- exception_case
- state_transition
- non_functional
- acceptance

**チェック観点:** 成功基準、受入条件、品質基準、設定値が pass / fail を判定できる表現になっているか。

**エビデンス例:** 判定条件、数値、状態、必須項目、チェック手順。

### RVP-005（PM: vp-pm-plan-feasibility）

**確認基準**: プロジェクトの目的・スコープを計画立案の基礎として確認できること

**coverage_required:**

_MISSING_

**チェック観点:** 成果物の内容がタスク化、順序付け、所要時間見積もり、進捗確認に使える粒度になっているか。

**エビデンス例:** 依存関係、作業単位、完了条件、担当 Role code、期限または判断タイミング。

### 5.1. 自己レビューと修正の手順

1. 各レビュー観点を pass / fail / unclear で判定し、成果物内の根拠箇所を確認する。
2. fail / unclear がある場合は、その指摘を解消するよう成果物を修正する。
3. 修正後は、指摘箇所だけでなく、変更により新しい矛盾や抜けが発生していないかを全レビュー観点で再確認する。
4. 自己レビューは初回を含めて最大3回まで行う。すべての観点が pass になった場合は、その時点で終了する。
5. 3回実施しても fail / unclear が残る場合は、判定・根拠・未解消理由・必要な次のアクションを result の「自己レビュー結果」と「申し送り」に記録する。

## 6. 完了手順

1. 「このフェーズで行うこと」に従って成果物を更新する。
2. 「全 role 観点による自己レビュー」に従って、必要な修正と再確認を行う。
3. 必要な検証と lint を実行する。
4. result の「done_criteria 確認」と「自己レビュー結果」を記入する。

## 7. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。
