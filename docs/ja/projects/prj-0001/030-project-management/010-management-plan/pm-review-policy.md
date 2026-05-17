---
id: prj-0001:pm-review-policy
type: project
status: draft
rulebook: none
based_on:
  - prj-0001:pm-quality-management-plan
  - prj-0001:pm-organization
  - prj-0001:pm-raci
  - prj-0001:dct-project-definition
  - prj-0001:dct-project-management
---

# レビューポリシー

## 1. 目的

本書は、SpecDojo プロジェクトにおいて agent と人が成果物をレビューするときの観点、判定、記録方法を定義する。

レビューの合格条件は成果物カタログの `done_criteria` を正とする。本書は、各 Role code が `done_criteria` をどの観点で確認し、指摘や承認判断をどの形式で残すかを補助する。

最終承認、公開可否判断、説明責任は `PO` の人間メンバーが担う。agent は草案作成、レビュー支援、論点整理、修正案提示を行ってよいが、最終承認者にはならない。

## 2. 適用範囲

本書は、`sch-strategy-launch.yaml` に基づいて作成・レビューする `kind: work` の成果物に適用する。

対象となる主なレビュー単位は次のとおり。

| レビュー単位 | 説明 | 主な判定材料 |
| ------------ | ---- | ------------ |
| 成果物レビュー | 個別成果物のたたき台、一次版、完成版を確認する | 成果物カタログの `done_criteria`、対応 rulebook、関連成果物 |
| ドメイン整合レビュー | 同一ドメイン内の成果物群の整合性を確認する | 成果物カタログ、依存関係、相互リンク、用語、状態 |
| 完成版レビュー | `ready` 化前に重大指摘が残っていないことを確認する | レビュー結果、未解決指摘、PJR、lint / schema 結果 |

## 3. ロール別レビュー観点

| Role code | 主な確認観点 | agent が残すべき結果 |
| --------- | ------------ | -------------------- |
| `PO` | 目的、スコープ、優先順位、公開可否、最終判断に必要な論点 | 承認可否の判断材料、未決論点、PO 判断が必要な事項 |
| `PM` | 計画、依存関係、順序、進捗影響、リスク・課題化すべき事項 | スケジュール影響、PJR 登録候補、次アクション |
| `BA` | 業務目的、利用者視点、要件、受入条件、用語の分かりやすさ | 業務上の不足、利用者に伝わらない表現、受入条件の改善案 |
| `ARC` | 文書構造、ID、ファイル命名、配置、依存関係、技術制約、成果物間整合 | 構造不整合、参照切れ、命名ゆれ、技術前提の不足 |
| `DEV` | 実装・設定作業に必要な具体性、技術的変更影響、作業可能性 | 実装前提の不足、変更影響、追加検討が必要な技術事項 |
| `QE` | `done_criteria` 充足、検証可能性、抜け漏れ、矛盾、境界条件 | pass / fail の根拠、重大指摘、再レビュー要否 |
| `UX` | 読みやすさ、説明導線、初見の理解しやすさ、利用者体験 | 読みにくい箇所、説明順序の改善案、用語補足案 |
| `OPS` | 公開、運用、変更管理、リリース後の扱いやすさ | 公開前確認事項、運用負荷、リリース後の注意点 |

## 4. レビュー確認観点表

レビュー確認観点表は、成果物カタログの `done_criteria` をレビュー実行時に使いやすい粒度へ展開した補助表である。正式な完了条件は `done_criteria` を正とし、本表は agent がレビュー観点を漏らさないためのチェック入口として使う。

表の `—` は、その成果物で当該ロールの明示レビューが不要、または他ロールの確認結果を参照すればよいことを表す。`BA/UX`、`ARC/DEV`、`PO/OPS` のように兼務がある場合でも、レビュー結果には実際に確認した Role code を記録する。

### 4.1. project-definition 成果物

| 成果物 | PO | PM | BA / UX | ARC / DEV | QE | OPS |
| ------ | -- | -- | ------- | --------- | -- | --- |
| `prj-overview` | 目的・背景・ゴールが承認可能か | 計画立案の前提になるか | 業務背景、利用者、価値が読み取れるか | 技術前提・制約が読み取れるか | 成功判定の輪郭があるか | 公開・運用に影響する前提がないか |
| `prj-stakeholder-register` | 合意対象と意思決定者が識別できるか | 連絡・調整対象が明確か | 関係者の役割、関心、影響度が業務観点で妥当か | 技術的意思決定者・承認者が識別できるか | 品質に影響する関係者が識別できるか | 公開後の問い合わせ・運用関係者が識別できるか |
| `prj-charter` | 正式認可、権限委譲、予算枠を判断できるか | 進行管理に必要な権限が明確か | 業務上の目的、認可条件、期待効果が明確か | 技術制約・前提が読み取れるか | 品質目標・受入基準への導線があるか | 公開・リリース判断に必要な条件があるか |
| `prj-scope` | 対象範囲・対象外を承認できるか | スケジュール化できる境界か | 業務スコープ、除外範囲、利用者影響が明確か | 技術的スコープ境界が識別できるか | テスト対象・対象外の境界が判断できるか | 運用対象・対象外が読み取れるか |
| `prj-success-criteria-and-acceptance-criteria` | 成功基準を承認できるか | 完了判断に使える基準か | 業務価値と受入条件が対応しているか | 技術的受入条件が確認できるか | 受入条件が検証可能か | 運用・公開後の成功判定が含まれるか |
| `prj-assumptions-constraints-dependencies` | 重要な前提・制約を受け入れられるか | 依存関係が計画に反映できるか | 業務上の前提・制約が識別できるか | 技術制約・外部依存が識別できるか | テスト実施上の前提・制約が確認できるか | 運用上の制約・外部依存がないか |
| `prj-issues-and-approach` | 主要課題と解決方針を承認できるか | 課題が管理対象として扱えるか | 業務課題と解決アプローチが対応しているか | 技術課題と実現方式の方向性が識別できるか | 解決アプローチが検証可能か | 運用課題・公開後課題が識別されているか |
| `prj-comparison-of-alternatives` | 推奨案を判断できるか | 選択結果が計画に反映できるか | 比較軸・評価根拠が業務価値と対応しているか | 技術的実現可能性・影響が評価されているか | 選択案の検証方針が確認できるか | 運用負荷・リリース影響が比較されているか |

### 4.2. project-management 成果物

| 成果物 | PO | PM | BA / UX | ARC / DEV | QE | OPS |
| ------ | -- | -- | ------- | --------- | -- | --- |
| `pm-plan` | 管理方針・意思決定を承認できるか | 計画・進捗・リスク管理の方針があるか | 業務プロセスとの整合があるか | 構成管理・技術管理の観点があるか | レビュー方針・品質基準への導線があるか | 公開・運用管理の扱いがあるか |
| `pm-communication-plan` | 報告・連絡・会議体を承認できるか | 進捗・課題・リスクの報告経路があるか | 業務観点の連絡・確認経路があるか | 技術チームへの連絡経路が識別できるか | 品質関連の報告経路が確認できるか | 公開・運用時の連絡経路が確認できるか |
| `pm-quality-management-plan` | 品質目標・基準を承認できるか | 品質管理プロセスが全体計画と整合するか | 業務品質基準との整合があるか | 技術品質基準・構造確認が含まれるか | 実施可能な検証・レビュー手順があるか | 公開前・運用時の品質確認があるか |
| `pm-organization` | 兼務構成と最終判断先を承認できるか | 管理責務の所在が分かるか | `pm-roles` / `pm-members` への導線があるか | `pm-roles` / `pm-members` との構造整合があるか | 禁止事項・見直し条件が実施可能か | 公開・運用責任が曖昧でないか |
| `pm-roles` | 全 Role code とプロジェクト固有メモを承認できるか | `PM` ロールまたは兼務方針が確認できるか | `BA` / `UX` の扱いが確認できるか | `ARC` / `DEV` の扱いが確認できるか | `QE` ロールが確認できるか | `OPS` ロールまたは兼務方針が確認できるか |
| `pm-members` | 実行主体と roles を承認できるか | `PM` を担う member または兼務設定が確認できるか | `BA` / `UX` を担う member が確認できるか | `ARC` / `DEV` を担う member が確認できるか | `QE` を担う member が確認できるか | `OPS` を担う member または兼務設定が確認できるか |
| `pm-raci` | 責任分担と `A` を承認できるか | 管理プロセスの責任分担が確認できるか | 業務観点の責任分担が確認できるか | 技術観点の責任分担が確認できるか | 品質観点の責任分担が確認できるか | 公開・運用判断の責任分担が確認できるか |

### 4.3. schedule 成果物

| 成果物 | PO | PM | BA / UX | ARC / DEV | QE | OPS |
| ------ | -- | -- | ------- | --------- | -- | --- |
| `sch-milestones` | マイルストーンを承認できるか | 進捗管理の節目として使えるか | ビジネスマイルストーンが含まれるか | 技術マイルストーンが含まれるか | 品質ゲートが含まれるか | リリース・公開の節目が含まれるか |
| `sch-defaults` | カレンダー・開始日を承認できるか | 計画作成の既定値として妥当か | 業務稼働日・休日設定が確認できるか | schema 検証を通過するか | 設定値が妥当か | 運用上の休日・作業可能日と矛盾しないか |
| `sch-track-launch` | Launch タスク・マイルストーン計画を承認できるか | 依存関係・順序・所要時間が妥当か | ビジネスタスクの順序・依存関係が確認できるか | 技術タスクのスコープと順序が確認できるか | 品質ゲート・レビュータスクが含まれるか | リリース・公開関連タスクが識別できるか |
| `sch-config-launch` | 担当チーム・agent mode を承認できるか | 実行管理に必要な設定があるか | 担当割り当てが確認できるか | schema 検証を通過するか | 設定値が妥当か | 運用実行時の例外条件がないか |
| `sch-agent-overrides-launch` | 例外的な agent mode 上書きを承認できるか | 手動確認や承認が必要なタスクが分かるか | 手動確認が必要な業務タスクが識別されているか | schema 検証を通過するか | 品質関連タスクの agent mode が妥当か | 公開・運用判断を agent に委ねていないか |

## 5. レビュー手順

1. レビュー対象の成果物、版、関連する成果物カタログを確認する。
2. 対象成果物の `done_criteria` から、自分の Role code に関係する条件を抽出する。
3. 対応 rulebook、instruction、sample がある場合は、構造と禁止事項を確認する。
4. 関連成果物、Schedule、RACI、組織定義、メンバー定義との矛盾を確認する。
5. 指摘を `blocker`、`major`、`minor`、`note` に分類する。
6. レビュー判定を `pass`、`conditional_pass`、`changes_requested`、`blocked` のいずれかで記録する。
7. `blocker` または `major` がある場合は、修正後に同じ Role code で再レビューする。
8. `PO` は各 Role code のレビュー結果を確認し、完成版または `ready` 化の可否を判断する。

## 6. 指摘区分

| 区分 | 意味 | 扱い |
| ---- | ---- | ---- |
| `blocker` | 完了判断、公開判断、後続作業を止める不備 | 修正完了まで `ready` にしない。必要に応じて PJR に登録する |
| `major` | `done_criteria` 未充足、文書間矛盾、責任分担の不整合など重要な不備 | 修正完了まで完成版扱いにしない。対応方針を記録する |
| `minor` | 誤字、表記ゆれ、補足不足など、意味や判断を大きく変えない不備 | 可能な限り同一サイクルで修正する。PO 判断で次回送り可 |
| `note` | 改善提案、将来検討、補足コメント | 必要に応じて PJR または関連文書へ転記する |

## 7. レビュー判定

| 判定 | 意味 | 次アクション |
| ---- | ---- | ------------ |
| `pass` | 対象 Role code の観点では修正不要 | 次の Role code または PO 判断へ進める |
| `conditional_pass` | 軽微な修正または PO 判断待ちを条件に進めてよい | 条件を明記し、必要に応じて minor 指摘を残す |
| `changes_requested` | 修正後の再レビューが必要 | 修正担当 Role code と再レビュー観点を明記する |
| `blocked` | 前提不足、依存成果物未整備、重大矛盾によりレビュー継続不可 | PJR 登録または PO 判断を依頼する |

## 8. レビュー結果の記録方法

レビュー結果の正本は、成果物単位・版単位・Role code 単位の YAML として残すことを推奨する。

推奨配置:

```text
docs/ja/projects/prj-0001/030-project-management/controls/reviews/
```

ファイル名は次の形式を推奨する。

```text
rev-<local_id>-<stage>-<role>.yaml
```

例:

```text
rev-prj-overview-draft-ba.yaml
rev-pm-members-final-qe.yaml
```

### 8.1. YAML 記録テンプレート

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
criteria:
  - text: <done_criteria の該当文>
    result: pass | fail | not_applicable
    notes: <判定根拠>
findings:
  - id: F-001
    severity: blocker | major | minor | note
    category: structure | content | consistency | quality | usability | operations
    location: <見出し、行、キー、またはファイル全体>
    summary: <指摘概要>
    recommendation: <修正方針>
decision:
  recommendation: approve | revise | defer | escalate
  approver_required: PO | none
```

## 9. 人向けサマリ

人が確認するためのサマリは、レビュー YAML から作成する Markdown として残すことを推奨する。

推奨配置:

```text
docs/ja/projects/prj-0001/030-project-management/controls/reviews/rev-summary-launch.md
```

サマリには、少なくとも次を記載する。

| 項目 | 内容 |
| ---- | ---- |
| 対象成果物 | `local_id`、パス、レビュー対象版 |
| Role code 別判定 | `PO`、`PM`、`BA`、`ARC`、`DEV`、`QE`、`UX`、`OPS` の判定 |
| 未解決指摘 | `blocker` / `major` を優先して一覧化する |
| PO 判断待ち | `PO` の人間判断が必要な事項を分離する |
| 次アクション | 修正担当 Role code、再レビュー要否、PJR 登録要否 |

## 10. PJR への転記ルール

レビュー指摘は、すべてを PJR に登録しない。レビュー詳細は review YAML に残し、プロジェクト管理対象だけを PJR に転記する。

PJR に登録する条件は次のとおり。

| 条件 | PJR 分類の目安 |
| ---- | -------------- |
| 後続成果物、Schedule、公開判断に影響する | `issue` または `todo` |
| PO 判断なしに進められない | `decision` |
| スコープ、成果物追加、責任分担に影響する | `change_request` |
| 将来リスクとして監視が必要 | `risk` |
| 今回は対応しないが記録すべき | `memo` または `todo` |

## 11. 完成版・ready 化の条件

成果物を完成版または `ready` 候補にするには、次を満たすこと。

- 対象成果物の `done_criteria` に関係する Role code のレビューが完了している。
- `blocker` と `major` の未解決指摘が 0 件である。
- `conditional_pass` の条件が PO により許容または対応済みと判断されている。
- 関連する PJR がある場合、対応方針、担当 Role code、期限が記録されている。
- `npm run -s lint:md`、必要な YAML schema 検証、生成物再作成など、対象成果物に必要な機械検証が完了している。
- 最終承認、公開可否判断、説明責任を人間の `PO` が担っている。

## 12. 関連ドキュメント

| ドキュメント | 役割 |
| ------------ | ---- |
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

## 13. 見直し条件

| 更新トリガー | 見直し内容 | 責任ロール |
| ------------ | ---------- | ---------- |
| 成果物カタログの `done_criteria` を変更した | ロール別レビュー観点と記録テンプレートを見直す | `QE`, `ARC` |
| `pm-roles.yaml` または `pm-members.yaml` を変更した | reviewer 候補、Role code 別観点、承認責任を見直す | `PO`, `QE` |
| `sch-strategy-launch.yaml` の作成・レビュー・承認フローを変更した | レビュー単位、stage、ready 化条件を見直す | `PM`, `QE` |
| PJR の項目分類や生成ビューを変更した | PJR 転記条件とサマリの出力項目を見直す | `PM`, `ARC` |
| レビュー指摘の手戻りが多発した | severity、判定、完了条件の粒度を見直す | `PO`, `QE` |
