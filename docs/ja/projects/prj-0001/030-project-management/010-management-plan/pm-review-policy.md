---
id: prj-0001:pm-review-policy
type: project
status: draft
rulebook: none
based_on:
  - prj-0001:pm-review-viewpoints
  - prj-0001:pm-quality-management-plan
  - prj-0001:pm-organization
  - prj-0001:pm-raci
  - prj-0001:dct-project-definition
  - prj-0001:dct-project-management
---

# レビューポリシー

## 1. 目的

本書は、SpecDojo プロジェクトにおいて agent と人が成果物をレビューするときの手順、記録方法、完了条件を定義する。

レビューの合格条件は成果物カタログの `done_criteria` を正とする。観点語彙（`vp-*`）、severity、verdict の定義は `pm-review-viewpoints.yaml` を参照する。

最終承認、公開可否判断、説明責任は `PO` の人間メンバーが担う。agent は草案作成、レビュー支援、論点整理、修正案提示を行ってよいが、最終承認者にはならない。

## 2. 適用範囲

本書は、`sch-strategy-launch.yaml` に基づいて作成・レビューする `kind: work` の成果物に適用する。

対象となる主なレビュー単位は次のとおり。

| レビュー単位 | 説明 | 主な判定材料 |
| ------------ | ---- | ------------ |
| 成果物レビュー | 個別成果物のたたき台、一次版、完成版を確認する | 成果物カタログの `done_criteria`、対応 rulebook、関連成果物 |
| ドメイン整合レビュー | 同一ドメイン内の成果物群の整合性を確認する | 成果物カタログ、依存関係、相互リンク、用語、状態 |
| 完成版レビュー | `ready` 化前に重大指摘が残っていないことを確認する | レビュー結果、未解決指摘、PJR、lint / schema 結果 |

## 3. レビュー手順

1. レビュー対象の成果物、版、関連する成果物カタログを確認する。
2. `pm-review-viewpoints.yaml` の `role_viewpoint_sets` から自分の Role code に対応する観点一覧（`vp-*`）を確認する。
3. 対応 rulebook、instruction、sample がある場合は、構造と禁止事項を確認する。
4. 関連成果物、Schedule、RACI、組織定義、メンバー定義との矛盾を確認する。
5. 各観点の結果を `pass`、`fail`、`skip` で記録し、`fail` には findings を残す。
6. findings を `blocker`、`major`、`minor`、`note` に分類する。
7. レビュー判定（`status`）を `pass`、`conditional_pass`、`changes_requested`、`blocked` のいずれかで記録する。
8. `blocker` または `major` がある場合は、修正後に同じ Role code で再レビューする。
9. `PO` は各 Role code のレビュー結果を確認し、完成版または `ready` 化の可否を判断する。

## 4. レビュー結果の記録方法

レビュー結果の正本は、成果物単位・版単位・Role code 単位の YAML として残す。

推奨配置:

```text
docs/ja/projects/prj-0001/030-project-management/controls/reviews/
```

ファイル名:

```text
rev-<local_id>-<stage>-<role>.yaml
```

例:

```text
rev-prj-overview-draft-ba.yaml
rev-pm-members-final-qe.yaml
```

### 4.1. YAML 記録テンプレート

```yaml
id: rev-<local_id>-<stage>-<role>
project_id: prj-0001
target:
  local_id: <local_id>
  path: <成果物パス>
  stage: draft | first | final | ready-candidate
review:
  role: <Role code>
  reviewer: <member nickname>
  status: pass | conditional_pass | changes_requested | blocked
  reviewed_at: <YYYY-MM-DD>
viewpoint_results:
  - viewpoint_id: <vp-*>
    result: pass | fail | skip
    notes: <判定根拠>
findings:
  - id: F-001
    viewpoint_id: <vp-*>
    severity: blocker | major | minor | note
    category: purpose | planning | business | architecture | implementation | quality | usability | operations | consistency
    location: <見出し、行、キー、またはファイル全体>
    summary: <指摘概要>
    recommendation: <修正方針>
decision:
  recommendation: approve | revise | defer | escalate
  approver_required: PO | none
```

## 5. PJR への転記ルール

レビュー指摘は、すべてを PJR に登録しない。レビュー詳細は review YAML に残し、プロジェクト管理対象だけを PJR に転記する。

| 条件 | PJR 分類の目安 |
| ---- | -------------- |
| 後続成果物、Schedule、公開判断に影響する | `issue` または `todo` |
| PO 判断なしに進められない | `decision` |
| スコープ、成果物追加、責任分担に影響する | `change_request` |
| 将来リスクとして監視が必要 | `risk` |
| 今回は対応しないが記録すべき | `memo` または `todo` |

## 6. 完成版・ready 化の条件

成果物を完成版または `ready` 候補にするには、次を満たすこと。

- 対象成果物の `done_criteria` に関係する Role code のレビューが完了している。
- `blocker` と `major` の未解決指摘が 0 件である。
- `conditional_pass` の条件が PO により許容または対応済みと判断されている。
- 関連する PJR がある場合、対応方針、担当 Role code、期限が記録されている。
- `npm run -s lint:md`、必要な YAML schema 検証、生成物再作成など、対象成果物に必要な機械検証が完了している。
- 最終承認、公開可否判断、説明責任を人間の `PO` が担っている。

## 7. 関連ドキュメント

| ドキュメント | 役割 |
| ------------ | ---- |
| [specdojo-review-guide.md](../../../../specdojo/guidelines/specdojo-review-guide.md) | レビューの具体的な進め方、coverage_types の使い方、レビュー結果の記録形式を定義する |
| [pm-review-viewpoints.yaml](pm-review-viewpoints.yaml) | 観点語彙（`vp-*`）、severity、verdict の定義 |
| [pm-quality-management-plan.md](pm-quality-management-plan.md) | 品質目標、レビュー方針、品質メトリクス、是正プロセスを定義する |
| [pm-plan.md](pm-plan.md) | プロジェクト全体の管理方針、意思決定、レポーティングを定義する |
| [pm-organization.md](../020-organization/pm-organization.md) | ロール・メンバー構成の方針と設計根拠を定義する |
| [pm-roles.yaml](../020-organization/pm-roles.yaml) | 使用可能な Role code の語彙を定義する |
| [pm-members.yaml](../020-organization/pm-members.yaml) | Role code と実行主体 nickname の対応を定義する |
| [pm-raci.md](../020-organization/pm-raci.md) | 成果物別、プロセス別の責任分担を定義する |
| [sch-strategy-launch.yaml](../schedule/sch-strategy-launch.yaml) | ローンチフェーズの成果物作成・レビュー・承認フローを定義する |
| [dct-project-definition.yaml](../../010-deliverables-catalog/dct-project-definition.yaml) | project-definition ドメインの成果物と `done_criteria` を定義する |
| [dct-project-management.yaml](../../010-deliverables-catalog/dct-project-management.yaml) | project-management ドメインの成果物と `done_criteria` を定義する |
| [pjr-index.md](../controls/project-register/pjr-index.md) | プロジェクト管理対象の未解決事項、課題、リスク、変更要求、決定を管理する |

## 8. 見直し条件

| 更新トリガー | 見直し内容 | 責任ロール |
| ------------ | ---------- | ---------- |
| 成果物カタログの `done_criteria` を変更した | ロール別レビュー観点と記録テンプレートを見直す | `QE`, `ARC` |
| `pm-roles.yaml` または `pm-members.yaml` を変更した | reviewer 候補、Role code 別観点、承認責任を見直す | `PO`, `QE` |
| `sch-strategy-launch.yaml` の作成・レビュー・承認フローを変更した | レビュー単位、stage、ready 化条件を見直す | `PM`, `QE` |
| PJR の項目分類や生成ビューを変更した | PJR 転記条件とサマリの出力項目を見直す | `PM`, `ARC` |
| レビュー指摘の手戻りが多発した | severity、判定、完了条件の粒度を見直す | `PO`, `QE` |
