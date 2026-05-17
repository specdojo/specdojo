---
id: specdojo-review-guide
type: guide
status: draft
---

# SpecDojo レビューガイド

本ドキュメントは SpecDojo における **成果物レビューの進め方**を定義する。

レビューは「問題なし」を宣言する作業ではない。どの観点を確認し、どの根拠を見て、何を未確認として残したかを記録する作業である。

## 1. レビューの役割

SpecDojo のレビューは次を扱う。

| 項目 | 内容 |
| ---- | ---- |
| 完全性 | 要求、要件、仕様、設計、運用に抜けがないか |
| 整合性 | 成果物間で目的、用語、状態、責務、制約が矛盾していないか |
| 妥当性 | 上位目的、業務価値、制約、判断方針に合っているか |
| 検証可能性 | pass / fail を判断できる完了条件、受入条件、証跡があるか |
| 追跡可能性 | 上位目的から要求、要件、仕様、設計、テスト、運用まで対応を追えるか |

レビューの合格条件は、対象プロジェクトの成果物カタログに定義された `done_criteria` を正とする。

## 2. レビューの入力

レビューでは次を入力として扱う。

| 入力 | 役割 |
| ---- | ---- |
| 対象成果物 | レビュー対象の Markdown / YAML / JSON など |
| 成果物カタログ | `done_criteria`、依存関係、成果物の位置づけ |
| rulebook | 必須章、必須キー、禁止事項、構造ルール |
| instruction | agent が成果物を作成・更新するときの指示 |
| sample | 期待する成果物の具体例 |
| review viewpoints | Role code 別の観点、severity、verdict、coverage_types |
| 関連成果物 | 上位・下位・隣接成果物、Schedule、RACI、PJR |
| 機械検証結果 | lint、schema validation、生成確認、リンク確認 |

## 3. レビューの基本パス

レビューは 3 つのパスで行う。

### 3.1. 上位から下位へ

上位成果物の目的、要求、制約が下位成果物に展開されているかを確認する。

主に検出するもの

- 上位要求に対応する要件や仕様がない
- 重要な制約が設計や運用に反映されていない
- 非機能、例外、運用、監査の観点が下位成果物で消えている

### 3.2. 下位から上位へ

下位成果物の記述に、上位根拠のない機能、仕様、設計判断が混ざっていないかを確認する。

主に検出するもの

- 根拠のない仕様追加
- スコープ外の設計判断
- agent の推測による機能追加
- 成果物間で説明されていない制約や例外

### 3.3. 横断観点

成果物の種類にかかわらず、抜けやすい観点を横断して確認する。

主に確認するもの

- ステークホルダー
- 利用シーン
- 業務イベント
- 例外・異常系
- 権限・責務
- 状態遷移
- 入出力・データ
- 外部連携
- 非機能要求
- 運用・保守
- 監査・証跡
- 受入条件
- トレーサビリティ

## 4. coverage_types の使い方

`coverage_types` は、レビュー時に「何の型を確認したか」を記録するための語彙である。

`coverage_types` は観点そのものではなく、レビュー探索の軸である。たとえば `vp-qe-omissions-consistency` を使う場合でも、実際には `stakeholder`、`exception_case`、`non_functional`、`traceability` など、どの型を確認したかを分けて記録する。

例

```yaml
viewpoint_results:
  - viewpoint_id: vp-qe-omissions-consistency
    result: fail
    coverage_checked:
      - stakeholder
      - use_case
      - exception_case
      - non_functional
      - traceability
    evidence:
      - dct-project-definition.yaml の done_criteria
      - prj-scope.md
      - prj-success-criteria-and-acceptance-criteria.md
    notes: 例外ケースと非機能要求の展開に不足がある。
```

`coverage_checked` は確認済みの範囲を示す。未確認の範囲がある場合は `unverified_scope` に残す。

```yaml
unverified_scope:
  - coverage_type: integration
    reason: 外部連携方針の成果物が未作成のため確認できない。
```

## 5. 要求・要件・仕様レビュー

要求、要件、仕様のヌケモレや間違いは、成果物単体だけでは検出しにくい。必ず隣接成果物との対応を確認する。

| 対象 | 主な確認 |
| ---- | -------- |
| 要求 | 業務目的、利用者、業務イベント、制約、成功条件、非機能、運用要求が抜けていないか |
| 要件 | 要求から機能・非機能・権限・データ・受入条件へ展開されているか |
| 仕様 | 要件に対する画面、API、状態、業務ルール、例外、データ、検証条件が明確か |
| 設計 | 仕様を実現する構造、制約、責務、データ、外部依存、運用方法が明確か |
| 運用 | 公開後の変更、問い合わせ、障害対応、監査、保守の扱いが明確か |

## 6. 機械検証とレビューの分担

機械で確認できることは、レビュー判断の前に検証する。

| 確認対象 | 主な方法 |
| -------- | -------- |
| YAML / JSON の必須キー | JSON Schema |
| 型、enum、ID形式 | JSON Schema |
| Markdown の基本構造 | lint、custom validator |
| リンク、参照先 | custom validator |
| IDの一意性 | custom validator |
| 生成物の同期 | generate command、diff |
| 意味の妥当性 | agent / human review |
| 判断責任 | human approver |

機械検証で失敗した成果物は、意味レビューの前に修正する。ただし、検証不能な前提や設計判断は review result に残してよい。

## 7. レビュー結果の残し方

レビュー結果は、成果物単位、版単位、Role code 単位で記録する。

推奨ファイル名

```text
rev-<local_id>-<stage>-<role>.yaml
```

推奨構造

```yaml
id: rev-<local_id>-<stage>-<role>
project_id: <project_id>
target:
  local_id: <local_id>
  path: <target-path>
  stage: draft | first | final | ready-candidate
review:
  role: <Role code>
  reviewer: <member nickname>
  status: pass | conditional_pass | changes_requested | blocked
  reviewed_at: <YYYY-MM-DD>
inputs:
  deliverable_catalog: <dct-path>
  rulebook: <rulebook-path | none>
  viewpoints: <pm-review-viewpoints.yaml>
  related_documents:
    - <path>
machine_checks:
  - name: lint:md
    result: pass | fail | skipped
    notes: <補足>
viewpoint_results:
  - viewpoint_id: <vp-*>
    result: pass | fail | skip
    coverage_checked:
      - <coverage_type>
    evidence:
      - <確認した根拠>
    notes: <判定根拠>
unverified_scope:
  - coverage_type: <coverage_type>
    reason: <未確認理由>
findings:
  - id: F-001
    viewpoint_id: <vp-*>
    coverage_type: <coverage_type>
    severity: blocker | major | minor | note
    category: purpose | planning | business | architecture | implementation | quality | usability | operations | consistency
    location: <見出し、行、キー、またはファイル全体>
    summary: <指摘概要>
    recommendation: <修正方針>
decision:
  recommendation: approve | revise | defer | escalate
  approver_required: PO | none
```

## 8. finding の分類

| 種別 | 内容 |
| ---- | ---- |
| missing | 必要な要求、要件、仕様、章、キー、参照がない |
| inconsistency | 成果物間で矛盾している |
| unsupported | 上位根拠のない記述がある |
| ambiguous | 判断、実装、検証に必要な具体性が不足している |
| unverifiable | pass / fail を判断できない |
| risk | 後続作業、公開、運用で問題になる可能性がある |
| policy_violation | 禁止事項、承認責任、agent 委任境界に違反している |

## 9. PJR への転記

すべてのレビュー指摘を PJR に転記しない。review result には詳細を残し、プロジェクト管理対象だけを PJR に転記する。

PJR に転記する条件

- PO 判断が必要
- 後続成果物、Schedule、公開判断に影響する
- スコープ、責任分担、成果物追加に影響する
- 重大な矛盾によりレビュー継続ができない
- 将来リスクとして監視する必要がある

## 10. Agent への指示テンプレート

### 10.1. 単体レビュー

```text
対象成果物をレビューしてください。
成果物カタログの done_criteria、対応 rulebook、pm-review-viewpoints.yaml の Role code 観点を使って確認してください。

結果には viewpoint_id、coverage_checked、evidence、findings、unverified_scope、verdict を含めてください。
```

### 10.2. トレーサビリティレビュー

```text
対象成果物を単体でレビューせず、上位成果物と下位成果物の対応を確認してください。
上位から下位への未展開、下位から上位への根拠なし、横断観点の抜けを findings として整理してください。
```

### 10.3. 差分レビュー

```text
前回レビュー結果と現在の成果物を比較してください。
解消済み、未解消、新規発生、再発を分類し、再レビューが必要な viewpoint_id を明示してください。
```

### 10.4. 再レビュー

```text
前回 findings の対応結果だけでなく、修正により新しい矛盾や抜けが発生していないかを確認してください。
変更箇所、関連成果物、coverage_types を根拠付きで記録してください。
```

## 11. 完了条件

レビューを完了とするには、次を満たす。

- 対象成果物の `done_criteria` に対応する観点を確認している。
- 使用した `viewpoint_id` と `coverage_checked` が記録されている。
- pass / fail の根拠となる `evidence` が記録されている。
- 未確認範囲がある場合は `unverified_scope` に残している。
- `blocker` と `major` の未解決指摘が扱われている。
- PO 判断が必要な事項は PJR または decision に接続されている。
- agent が最終承認者になっていない。

## 12. 関連ドキュメント

| ドキュメント | 役割 |
| ------------ | ---- |
| `pm-review-policy.md` | プロジェクトごとのレビュー運用、判定、PJR連携を定義する |
| `pm-review-viewpoints.yaml` | Role code 別の観点、severity、verdict、coverage_types を定義する |
| `dct-*.yaml` | 成果物、依存関係、done_criteria を定義する |
| `*-rulebook.md` | 成果物ごとの構造、必須項目、禁止事項を定義する |
| `pjr-index.md` | プロジェクト管理対象の未解決事項、課題、リスク、変更要求、決定を管理する |
