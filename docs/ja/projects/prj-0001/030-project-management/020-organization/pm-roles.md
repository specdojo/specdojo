---
id: prj-0001-prj-roles
type: project
status: draft
rulebook: prj-roles-rulebook
based_on:
  - people-and-organization-definition-standard
---

# ロール定義

本書は、SpecDojo Handbook プロジェクトで使用するロールを定義する。

本プロジェクトは、現時点では個人・小規模プロジェクトとして運用する。そのため、本書では **小規模運用で必要なロールのみ** を採用する。

ロールは、個人名、担当者名、部署名、agent 名ではなく、プロジェクト上の責務・判断権限・専門性を表す論理的な役割である。WBS / Schedule の `owner` には、本書で定義した Role code を使用する。

## 1. 基本方針

- 本プロジェクトでは、ロールを人と組織の定義における中心概念とする。
- Schedule / WBS の `owner` は、タスクの主責任ロールを表す。
- `owner` には、member nickname、人名、agent 名、stakeholder ID を書かない。
- 実際に作業する人間または agent は、`pm-members.yaml` の member として定義する。
- member が対応できるロールは、`pm-members.yaml` の `role` で表す。
- 小規模運用では、同じ人間または agent が複数ロールの作業を実行してよい。
- 兼務する場合でも、Schedule / WBS の `owner` には、作業の性質に最も近い Role code を記載する。
- RACI と詳細な stakeholder register は、必要になった時点で拡張する。

## 2. 標準ロールと小規模運用での扱い

SpecDojo では、次の標準ロールを基準にする。

本プロジェクトでは、小規模運用のため、`PO`, `BA`, `ARC`, `QE` を採用し、`PM`, `DEV`, `UX`, `OPS` は現時点では独立ロールとして採用しない。

| Role code | 正式名称                     | 標準的な主な責務                                               | 小規模運用での扱い                               |
| --------- | ---------------------------- | -------------------------------------------------------------- | ------------------------------------------------ |
| `PO`      | Project Owner                | 目的、スコープ、優先順位、公開方針、成果物価値、最終判断       | 採用。`PM` 責務も兼務する                        |
| `PM`      | Project Manager              | 計画、進捗、課題、リスク、実行管理、横断調整                   | 未採用。現時点では `PO` が兼務する               |
| `BA`      | Business Analyst             | 要件、業務仕様、受入条件、利用者視点、関係者調整               | 採用。要件・利用者視点・文書の実用性を整理する   |
| `ARC`     | Architect                    | 文書体系、構成方針、技術方針、リポジトリ構成、設計判断         | 採用。構成・技術・リポジトリ観点を整理する       |
| `DEV`     | Developer                    | 実装、設定、変更作業、技術的な成果物作成                       | 未採用。実装タスクが増えた場合に追加する         |
| `QE`      | Quality Engineer             | 品質基準、レビュー方針、検証観点、受入確認、整合性確認         | 採用。品質・レビュー・整合性確認を担う           |
| `UX`      | UX / Documentation Designer  | 利用者導線、説明、文書体験、読みやすさ、サンプルの分かりやすさ | 未採用。必要に応じて `BA` または `PO` が兼務する |
| `OPS`     | Operations / Release Manager | 公開、配布、リリース、変更管理、運用手順、公開前確認           | 未採用。必要に応じて `PO` が兼務する             |

## 3. 本プロジェクトで採用するロール

### 3.1. `PO` Project Owner

`PO` は、プロジェクトの目的、スコープ、優先順位、公開方針、成果物の最終判断を担う。

小規模運用では、`PO` が `PM` 的な管理責務も兼務する。

主な責務:

- プロジェクト目的とスコープを決める。
- 成果物の優先順位を決める。
- 公開方針、ライセンス、公開範囲を判断する。
- 計画、進捗、課題、リスクを管理する。
- 主要成果物の最終承認を行う。
- agent に委任できる作業と、人間が判断すべき事項を区別する。

### 3.2. `BA` Business Analyst

`BA` は、要件、利用者視点、受入条件、文書の実用性を整理する。

主な責務:

- Handbook の利用者像を整理する。
- 利用手順、テンプレート、サンプルが実務で使いやすいかを確認する。
- 要件、受入条件、用語、前提条件を整理する。
- 将来利用者や将来貢献者の視点から不足や分かりにくさを指摘する。
- 必要に応じて stakeholder register の整理を支援する。

### 3.3. `ARC` Architect

`ARC` は、文書体系、構成方針、技術方針、リポジトリ構成を整理する。

主な責務:

- Handbook 全体の文書構造を設計する。
- ルールブック、テンプレート、サンプル、プロジェクト文書の関係を整理する。
- ファイル命名、ID、参照関係、ディレクトリ構成の方針を決める。
- 技術的な制約、実行方式、CLI 連携、スケジューラ連携の観点を整理する。
- 技術方針に関する判断材料を提示する。

### 3.4. `QE` Quality Engineer

`QE` は、品質基準、レビュー方針、検証観点、整合性確認、受入確認を担う。

主な責務:

- 文書の品質基準を定義する。
- レビュー観点、受入条件、チェック項目を整理する。
- ID、用語、参照関係、ファイル構成の不整合を確認する。
- 過剰な複雑化、抜け漏れ、曖昧な責務境界を検出する。
- 公開前確認の観点を整理する。

## 4. 小規模運用での兼務方針

本プロジェクトでは、現時点では個人・小規模運用を前提とするため、1 人の人間または agent が複数ロールの作業を支援してよい。

ただし、ロールは責務を分けるための概念である。兼務を理由に責務境界を曖昧にしない。

| 標準ロール | 小規模運用での扱い | 備考                                          |
| ---------- | ------------------ | --------------------------------------------- |
| `PO`       | 採用               | 最終判断を担う。`PM`, `OPS` 的責務も兼務する  |
| `PM`       | 省略               | 計画・進捗・課題・リスク管理は `PO` が担う    |
| `BA`       | 採用               | 必要に応じて `PO` または BA agent が支援する  |
| `ARC`      | 採用               | 必要に応じて `PO` または ARC agent が支援する |
| `DEV`      | 省略               | 実装作業が増えた場合に追加する                |
| `QE`       | 採用               | 必要に応じて `PO` または QE agent が支援する  |
| `UX`       | 省略               | 利用者導線や文書体験は `BA` が兼ねる          |
| `OPS`      | 省略               | 公開・配布・リリース判断は `PO` が兼ねる      |

## 5. owner の意味

`owner` は、WBS / Schedule 上のタスクの主責任ロールを表す。

`owner` には、本書で採用した Role code を使用する。

使用できる `owner`:

- `PO`
- `BA`
- `ARC`
- `QE`

現時点では、次の Role code は Schedule / WBS の `owner` として使用しない。

- `PM`
- `DEV`
- `UX`
- `OPS`

例:

```yaml
tasks:
  - id: T-SCOPE-010
    name: スコープを整理する
    owner: BA

  - id: T-STRUCTURE-010
    name: 文書構成を整理する
    owner: ARC

  - id: T-REVIEW-010
    name: 整合性を確認する
    owner: QE

  - id: T-APPROVE-010
    name: 公開判断を行う
    owner: PO
```

## 6. member との関係

member は、実際に作業を行う人間または agent を表す。member は `pm-members.yaml` で定義する。

member が対応できるロールは、`role` に Role code を記載する。汎用 agent のように特定ロールへ固定しない場合は、`role: null` としてよい。

例:

```yaml
members:
  - nickname: po
    display_name: Project Owner
    role: PO
    type: human

  - nickname: ba-agent
    display_name: Business Analyst Agent
    role: BA
    type: agent

  - nickname: copilot
    display_name: General Copilot Agent
    role: null
    type: agent
```

## 7. owner、role、--by の違い

| 項目    | 意味                          | 値の例                  | 管理先                  |
| ------- | ----------------------------- | ----------------------- | ----------------------- |
| `owner` | タスクの主責任ロール          | `PO`, `BA`, `ARC`, `QE` | WBS / Schedule          |
| `role`  | member が対応できるロール     | `BA`                    | `pm-members.yaml`       |
| `--by`  | 実際にタスクを実行する member | `ba-agent`              | 実行コマンド / 実行ログ |

原則:

- `owner` はタスク側だけで使用する。
- `role` は member 側で使用する。
- `--by` は実行主体を指定するために使用する。
- `--by` で指定する nickname は `pm-members.yaml` に存在しなければならない。
- member の `role` が定義されている場合、タスクの `owner` と一致する member を実行候補とする。
- `role: null` の汎用 agent は、実行時の文脈で対象ロールを明示する。

## 8. 意思決定責任

小規模運用では、`PO` が最終判断と管理責務を担う。ただし、判断材料の整理やレビューは、作業の性質に応じて `BA`, `ARC`, `QE` が支援する。

| 判断対象                   | 主責任ロール | 相談先            | 記録先                                   |
| -------------------------- | ------------ | ----------------- | ---------------------------------------- |
| プロジェクト目的・スコープ | `PO`         | `BA`              | `prj-charter`, `prj-scope`, decision log |
| 優先順位・公開方針         | `PO`         | `BA`, `ARC`, `QE` | decision log, README                     |
| 計画・進捗・課題・リスク   | `PO`         | 必要なロール      | `pm-plan`, issue, decision log           |
| 要件・受入条件             | `BA`         | `PO`, `QE`        | requirement docs, acceptance criteria    |
| 文書体系・構成方針         | `ARC`        | `PO`, `BA`        | structure docs, decision log             |
| 品質基準・レビュー方針     | `QE`         | `PO`, `BA`, `ARC` | quality plan, review records             |
| 公開前確認                 | `QE`         | `PO`, `BA`, `ARC` | review records, release checklist        |
| 最終承認                   | `PO`         | 必要なロール      | decision log, PR, release notes          |

## 9. Agent 委任方針

Agent は実行支援者であり、人間の判断や説明責任を代替しない。

| 作業種別                     | agent 委任 | 最終判断                                      |
| ---------------------------- | ---------- | --------------------------------------------- |
| 草案作成                     | 可         | 対応ロールの人間または `PO`                   |
| 表記揺れ確認                 | 可         | 対応ロールの人間または `PO`                   |
| 抜け漏れ検出                 | 可         | 対応ロールの人間または `PO`                   |
| 既存ルールに基づく機械的更新 | 可         | 対応ロールの人間または `PO`                   |
| スコープ変更                 | 不可       | `PO`                                          |
| 公開可否判断                 | 不可       | `PO`                                          |
| 技術方針の最終判断           | 原則不可   | `PO`。必要に応じて `ARC` が判断材料を提示する |
| 品質基準の最終判断           | 原則不可   | `PO`。必要に応じて `QE` が判断材料を提示する  |

## 10. エスカレーション

小規模運用では、判断不能、責務の競合、遅延、品質上の懸念が発生した場合、最終的には `PO` に集約する。

| 状況                        | 一次対応ロール | 最終判断 | 記録先                          |
| --------------------------- | -------------- | -------- | ------------------------------- |
| 要件が曖昧                  | `BA`           | `PO`     | issue, decision log             |
| 構成方針が曖昧              | `ARC`          | `PO`     | decision log                    |
| 品質基準が曖昧              | `QE`           | `PO`     | review records, decision log    |
| タスク owner が決められない | `PO`           | `PO`     | WBS / Schedule notes            |
| agent 出力の採否に迷う      | 対応ロール     | `PO`     | review records                  |
| 公開可否に迷う              | `QE`           | `PO`     | release checklist, decision log |

## 11. 見直し条件

本書は、次のタイミングで見直す。

| 更新トリガー                                         | 見直し内容                                            |
| ---------------------------------------------------- | ----------------------------------------------------- |
| プロジェクトスコープを変更した                       | 採用ロール、責務境界、意思決定責任                    |
| WBS / Schedule の owner に未定義ロールが必要になった | ロール追加の要否                                      |
| 複数人での継続運用を開始した                         | `PM` の独立採用、RACI の追加                          |
| 実装タスクが増えた                                   | `DEV` の採用要否                                      |
| 利用者導線や文書体験を独立管理したくなった           | `UX` の採用要否                                       |
| リリース・公開・運用管理が複雑になった               | `OPS` の採用要否                                      |
| 外部利用者・貢献者の関与が始まった                   | stakeholder register の拡張、communication 文書の追加 |

## 12. 禁止事項

- Schedule / WBS の `owner` に個人名を書くこと。
- Schedule / WBS の `owner` に member nickname を書くこと。
- Schedule / WBS の `owner` に agent 名を書くこと。
- Schedule / WBS の `owner` に stakeholder ID を書くこと。
- `pm-members.yaml` の member 側で `owner` フィールドを使うこと。
- 未採用ロールを Schedule / WBS の `owner` に使うこと。
- agent に最終承認責任を持たせること。
- 兼務を理由に責務境界を曖昧にすること。
- 公開文書に不要な個人情報や非公開組織情報を書くこと。
