---
id: prj-0001-pm-roles
type: project
status: draft
rulebook: pm-roles-rulebook
based_on:
  - people-and-organization-definition-standard
supersedes:
  - prj-0001-prj-organization
---

# ロール定義

本書は、SpecDojo Handbook プロジェクトで使用するロールを定義する。

ロールは、プロジェクトにおける責務、判断権限、タスクの主責任を表す論理的な役割である。
Schedule や WBS の `owner` には、本書で定義したロールコードを使用する。

## 1. 基本方針

- 本プロジェクトでは、ロールを人と組織の定義における中心概念とする。
- ロールは、個人名、担当者名、部署名、agent 名ではなく、責務を表す。
- Schedule / WBS の `owner` は、タスクの主責任ロールを表す。
- 実際にタスクを実行する人間または agent は、`pm-members.yaml` の member として定義する。
- member が担えるロールは、`pm-members.yaml` の `role` で表す。
- ステークホルダー登録簿と RACI は、必要になった場合に追加する拡張情報とする。

## 2. ロール一覧

| ロールコード | 正式名称 | 主な責務 | 備考 |
| --- | --- | --- | --- |
| `PO` | Project Owner | プロジェクトの目的、スコープ、優先順位、公開方針、最終判断、進捗・課題・リスクの管理 | 小規模運用では PM 責務を兼務する |
| `BA` | Business Analyst | 要件、業務仕様、受入条件、利用者視点、ステークホルダー調整 | 仕様内容と利用価値を整理する |
| `ARC` | Architect | 文書体系、構成方針、技術方針、リポジトリ構成、設計判断 | 構造面・技術面の一貫性を担う |
| `QE` | Quality Engineer | 品質基準、レビュー方針、検証観点、受入確認、整合性確認 | 成果物の品質と確認観点を担う |

## 3. PM 責務の扱い

本プロジェクトは個人・小規模プロジェクトとして開始するため、独立した `PM` ロールは定義しない。

計画、進捗、課題、リスク、実行管理に関する PM 的な責務は、当面 `PO` が兼務する。
将来、複数人での運用や管理責務の分離が必要になった場合は、`PM` ロールを追加する。

## 4. owner の意味

`owner` は、WBS / Schedule 上のタスクの主責任ロールを表す。

`owner` には、member nickname、人名、agent 名、ステークホルダー ID を書かない。
必ず本書で定義したロールコードを使用する。

例:

```yaml
tasks:
  - id: T-SCOPE-010
    name: スコープを整理する
    owner: BA
```

この例では、タスクの主責任ロールは `BA` である。
実際に誰が実行するかは、実行時の `--by <nickname>` または scheduler の選択によって決まる。

## 5. member との関係

member は、実際に作業を行う人間または agent を表す。
member は `pm-members.yaml` で定義する。

member が対応できるロールは、`role` にロールコードを記載する。
汎用 agent のように特定ロールへ固定しない場合は、`role: null` としてよい。

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

## 6. owner と --by の違い

| 項目 | 意味 | 値の例 | 管理先 |
| --- | --- | --- | --- |
| `owner` | タスクの主責任ロール | `PO`, `BA`, `ARC`, `QE` | WBS / Schedule |
| `role` | member が対応できるロール | `BA` | `pm-members.yaml` |
| `--by` | 実際にタスクを実行する member | `ba-agent` | 実行コマンド / 実行ログ |

原則:

- `owner` はタスク側だけで使用する。
- `role` は member 側で使用する。
- `--by` は実行主体を指定するために使用する。
- `--by` で指定する nickname は `pm-members.yaml` に存在しなければならない。
- member の `role` が定義されている場合、タスクの `owner` と一致する member を実行候補とする。

## 7. 意思決定責任

| 判断対象 | 主責任ロール | 相談先 | 記録先 |
| --- | --- | --- | --- |
| プロジェクト目的・スコープ | `PO` | `BA` | `prj-charter`, `prj-scope`, decision log |
| 優先順位・公開方針 | `PO` | `BA`, `ARC`, `QE` | decision log, README |
| 要件・受入条件 | `BA` | `PO`, `QE` | requirement docs, acceptance criteria |
| 文書体系・構成方針 | `ARC` | `PO`, `BA` | architecture / structure docs, decision log |
| 技術方針・リポジトリ構成 | `ARC` | `PO` | decision log, repository docs |
| 品質基準・レビュー方針 | `QE` | `PO`, `BA`, `ARC` | quality plan, review records |
| 最終承認 | `PO` | 必要なロール | decision log, PR, release notes |

## 8. agent 委任方針

agent は、対応ロールの作業を支援する実行主体である。
agent は人間の判断や説明責任を代替しない。

| 作業種別 | agent 委任 | 最終判断 |
| --- | --- | --- |
| 草案作成 | 可 | 対応ロールの人間 |
| 表記揺れ確認 | 可 | 対応ロールの人間 |
| 抜け漏れ検出 | 可 | 対応ロールの人間 |
| 既存ルールに基づく機械的更新 | 可 | 対応ロールの人間 |
| スコープ変更 | 不可 | `PO` |
| 公開可否判断 | 不可 | `PO` |
| 技術方針の最終決定 | 原則不可 | `ARC` |
| 品質基準の最終決定 | 原則不可 | `QE` |

## 9. ステークホルダーとの関係

ステークホルダーは、プロジェクトに影響する、または影響を受ける関係者・集団・外部基盤を表す。

ロールは「責務と判断主体」を表し、ステークホルダーは「利害、期待、懸念、合意対象」を表す。
そのため、Schedule / WBS の `owner` にステークホルダー ID は使用しない。

ステークホルダー登録簿は、外部利用者、将来貢献者、公開基盤、外部承認者などを管理する必要が生じた場合に使用する。
個人・小規模運用では、通常は本書のロール定義と `pm-members.yaml` の member 定義だけで開始してよい。

## 10. RACI との関係

RACI は、成果物やプロセスごとに Responsible / Accountable / Consulted / Informed を分けたい場合に使用する。

最小運用では、WBS / Schedule の `owner` だけで主責任を管理する。
レビュー、承認、相談、通知を明確に分離する必要が出た場合に、`pm-raci.md` を追加する。

RACI を使用する場合でも、RACI の列名には本書で定義したロールコードを使用する。

## 11. 整合性ルール

- WBS / Schedule の `owner` は、本書で定義したロールコードでなければならない。
- WBS / Schedule の `owner` に member nickname を書いてはならない。
- `pm-members.yaml` の `role` は、`null` または本書で定義したロールコードでなければならない。
- 1 つのタスクに複数の `owner` を書かない。
- 複数ロールの作業が必要な場合は、タスクを分割する。
- agent に最終承認責任を持たせない。
- 公開文書に不要な個人名、私用メールアドレス、非公開組織情報を書かない。

## 12. 見直し条件

本書は、以下のタイミングで見直す。

| 更新トリガー | 見直し内容 |
| --- | --- |
| プロジェクトスコープ変更 | 必要なロールと責務境界を確認する |
| WBS / Schedule の追加・変更 | `owner` に必要なロールが定義されているか確認する |
| agent の追加・削除 | 対応する `role` と委任方針を確認する |
| 複数人運用の開始 | `PM` ロール、RACI、承認責任の追加を検討する |
| OSS 公開または外部協力の開始 | ステークホルダー登録簿とコミュニケーション要件の追加を検討する |
| ロールコード変更要求 | 原則として変更ではなく新規ロール追加で対応する |
