---
id: prj-assumptions-constraints-dependencies-rulebook
type: rulebook
status: draft
based_on:
  - people-and-organization-definition-standard
---

# 前提・制約・依存関係 作成ルール

Assumptions, Constraints and Dependencies Documentation Rulebook

本ドキュメントは、プロジェクトの前提、制約、依存関係を明確化するためのルールです。
計画の破綻要因を早期に把握し、影響と対応方針を管理することを目的とします。

## 1. 全体方針

- 本ルールの対象は、前提条件、制約事項、外部依存の管理です。
- 目的は、計画成立条件を可視化し、変更時の影響判断を可能にすることです。
- PMBOK 観点では、リスク管理、依存管理、変更統制に必要な情報を含めます。
- 各項目は「内容」「影響」「監視方法」「トリガー」「責任者」「対応方針」を 1 セットで定義します。
- 責任者は `pm-organization` で採用済みの Role code で記述し、未採用 Role code は使わない。
- AI Agent は作業支援・レビュー支援を担ってよいが、最終判断は人間の `PO` が行うことを明記する。
- 公開リポジトリに配置される場合は、個人名、個人連絡先、非公開の組織情報を記載しない。
- 前提が崩れた場合のエスカレーション条件を必ず記載します。

## 2. 位置づけと用語定義

### 2.1. 位置づけ（他ドキュメントとの関係）

```mermaid
flowchart LR
  PSC["プロジェクトスコープ"]
  ACD["前提・制約・依存関係"]
  RSK["リスク登録簿"]
  CRL["変更要求ログ"]

  PSC --> ACD --> RSK --> CRL

  classDef target stroke-width:4px
  class ACD target
```

### 2.2. 用語定義（本ルール内）

| 用語     | 定義                                           |
| -------- | ---------------------------------------------- |
| 前提     | 計画が成立するために真とみなす条件             |
| 制約     | 予算、期限、制度等の守るべき制限条件           |
| 依存関係 | 外部組織や他チーム等に依存する条件             |
| 影響     | 条件未達時に発生する遅延、コスト、品質への影響 |
| トリガー | 監視対象のしきい値や発火条件                   |

## 3. ファイル命名・ID規則

### 3.1. 配置（推奨）

- `docs/ja/projects/<project-id>/020-project-definition/` 配下への配置を推奨します。
- 外部依存先との合意資料は参照リンクで紐付けます。

### 3.2. ドキュメントID（推奨）

- 推奨: `<project-id>:prj-assumptions-constraints-dependencies`
  - 例: `prj-0001:prj-assumptions-constraints-dependencies`

### 3.3. ファイル名（推奨）

- 推奨: `prj-assumptions-constraints-dependencies.md`
- 日本語ファイル名の場合: `前提・制約・依存関係.md`

## 4. 推奨 Frontmatter 項目

### 4.1. 設定内容

- 参照スキーマ: [docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml](../../../specdojo/schemas/v1/deliverable-frontmatter.schema.yaml)
- メタ情報標準: [deliverable-metadata-standard.md](../standards/deliverable-metadata-standard.md)

| 項目       | 説明                                                    | 必須 |
| ---------- | ------------------------------------------------------- | ---- |
| id         | `<project-id>:prj-assumptions-constraints-dependencies` | ○    |
| type       | `project` 固定                                          | ○    |
| status     | `draft` / `ready` / `deprecated`                        | ○    |
| rulebook   | `prj-assumptions-constraints-dependencies-rulebook`     | ○    |
| based_on   | `prj-overview`、`prj-charter`、`prj-scope` を含む配列   | 任意 |
| supersedes | 置き換え対象の旧文書 ID                                 | 任意 |

### 4.2. 推奨ルール

- 前提、制約、依存を同一列で混在させず、種別を明示します。
- 各項目に見直し周期と更新責任者を設定します。

## 5. 本文構成（標準テンプレ）

### 5.1. 前提・制約・依存関係（Assumptions, Constraints and Dependencies）

| 番号 | 見出し             | 必須 | 内容（要点）                   |
| ---- | ------------------ | ---- | ------------------------------ |
| 1    | 前提条件           | ○    | 前提内容、妥当性根拠、監視方法 |
| 2    | 制約事項           | ○    | 制約内容、適用範囲、遵守条件   |
| 3    | 依存関係           | ○    | 依存先、期限、受領条件         |
| 4    | 影響評価と対応方針 | ○    | 影響、回避策、軽減策、責任者   |
| 5    | 監視・変更管理     | 任意 | 見直し周期、トリガー、変更手順 |

## 6. 記述ガイド

### 6.1. 共通

- 各項目を登録簿形式で管理し、ID を付与します。
- 章参照は章番号ではなく章タイトルで記述します。
- 未確定値は `_UNDECIDED_:` を用い、確定期限を明示します。

### 6.2. 前提/制約/依存の記述

- 「成立条件」「崩壊条件」「監視方法」を明示します。
- 依存先が外部組織の場合は、合意窓口と SLA/期限を記載します。

推奨表（ACD 登録簿）:

| ID  | 種別 | 内容 | 影響 | 監視方法 | トリガー | 責任者 | 対応方針 |
| --- | ---- | ---- | ---- | -------- | -------- | ------ | -------- |

### 6.3. 影響評価と対応方針

- 影響は工数、期日、品質、運用への影響で明示します。
- 対応方針は回避、軽減、受容、移転のいずれかを明示します。

## 7. 禁止事項

| 項目                                                           | 理由                               |
| -------------------------------------------------------------- | ---------------------------------- |
| 種別未分類の記述                                               | 対応優先度が判断できないため       |
| 影響評価なしの登録                                             | 変更判断に使えないため             |
| 責任者なしの対応方針                                           | 実行されず放置されるため           |
| トリガーなしの監視項目                                         | 発火条件が曖昧になるため           |
| Agent に最終判断・エスカレーション判断を委ねる                 | 人間の判断責任を代替してしまうため |
| `pm-organization` で未採用の Role code を責任者に使う          | 体制定義との不整合が生じるため     |
| 公開リポジトリに個人名・個人連絡先・非公開の組織情報を記載する | 公開範囲とプライバシーに反するため |

## 8. サンプル（最小でも可）

- 参照: [prj-assumptions-constraints-dependencies-sample.md](../samples/prj-assumptions-constraints-dependencies-sample.md)
