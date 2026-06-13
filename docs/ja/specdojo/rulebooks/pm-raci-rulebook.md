---
id: pm-raci-rulebook
type: rulebook
status: draft
target_format: markdown
based_on:
  - people-and-organization-definition-standard
---

# RACI 作成ルール

RACI Documentation Rulebook

本ドキュメントは、プロジェクトの主要成果物および主要プロセスに対する責任分担を定義する `pm-raci.md` を作成・更新するためのルールを定める。採用ロール・用語の共通定義は `people-and-organization-definition-standard` を正とし、本ルールでは `pm-raci.md` に何を記載するかを定める。

## 1. 全体方針

- RACI の列には `pm-organization.md` で採用済みの Role code のみを使用する。
- 成果物別 RACI とプロセス別 RACI の両方を記述する。必要に応じて一方を省略してよいが、省略理由を明記する。
- `A`（Accountable）は原則として 1 成果物・1 プロセスに対して 1 Role code に集約する。複数記載する場合は理由を本文に明記する。
- Agent は `R`、`C` を担ってよいが、`A` は担わない。
- 小規模プロジェクトでは RACI は詳細な組織統制ではなく、作成・レビュー・承認・変更判断の責務境界を確認するために使う。
- プロジェクト規模に応じて記述粒度を調整し、過剰な行を追加しない。

## 2. 位置づけと用語定義

`pm-raci.md` は、プロジェクトにおける責任分担マトリクスの文書である。

| ドキュメント                                     | 役割                                                           |
| ------------------------------------------------ | -------------------------------------------------------------- |
| `people-and-organization-definition-standard.md` | Role、Member、RACI 記号の全体ルールを定義する                  |
| `pm-organization.md`                             | プロジェクト固有の採用ロールと未採用ロールを定義する           |
| `pm-raci.md`                                     | 採用ロールを列に使い、成果物・プロセスごとの責任分担を定義する |
| `pm-members.yaml`                                | 実際に作業する人間または agent と Role code の対応を定義する   |

RACI 記号の定義は `people-and-organization-definition-standard` を参照する。本文では下表を概要として記載してよい。

| 記号 | 名称        | 説明                     |
| ---- | ----------- | ------------------------ |
| R    | Responsible | 実作業を担当する         |
| A    | Accountable | 最終責任を持ち、承認する |
| C    | Consulted   | 相談・レビューに参加する |
| I    | Informed    | 結果の共有を受ける       |

## 3. ファイル命名・ID規則

- 推奨パス: `docs/ja/projects/<project-id>/030-project-management/020-organization/pm-raci.md`
- 推奨ファイル名: `pm-raci.md`
- 推奨 ID: `<project-id>:pm-raci`
- `rulebook` は `pm-raci-rulebook` を指定する。
- `based_on` には `people-and-organization-definition-standard` と `<project-id>:pm-organization` を含める。

## 4. 推奨 Frontmatter 項目

| 項目       | 説明                                                                                     | 必須 |
| ---------- | ---------------------------------------------------------------------------------------- | ---- |
| `id`       | `<project-id>:pm-raci`                                                                   | ○    |
| `type`     | `project` 固定                                                                           | ○    |
| `status`   | `draft` / `ready` / `deprecated`                                                         | ○    |
| `rulebook` | `pm-raci-rulebook`                                                                       | ○    |
| `based_on` | `people-and-organization-definition-standard`、`<project-id>:pm-organization` を含む配列 | 任意 |

## 5. 本文構成（標準テンプレ）

| 番号 | 見出し          | 必須 | 内容                                                                |
| ---- | --------------- | ---- | ------------------------------------------------------------------- |
| 1    | 目的            | ○    | 本 RACI の目的、適用プロジェクト、前提となるロール定義の参照先      |
| 2    | 適用方針        | ○    | RACI 列に使う Role code の範囲、`A` の集約方針、Agent の扱い        |
| 3    | RACI の定義     | ○    | R / A / C / I の記号と説明の表（標準参照で省略可）                  |
| 4    | 成果物別 RACI   | ○    | 成果物名または成果物 ID を行、採用 Role code を列とするマトリクス表 |
| 5    | プロセス別 RACI | 任意 | プロセス名を行、採用 Role code を列とするマトリクス表               |
| 6    | 見直し条件      | ○    | RACI を更新するトリガーと見直し内容                                 |
| 7    | 禁止事項        | ○    | プロジェクト固有の禁止事項                                          |

## 6. 記述ガイド

### 6.1. 目的

- 本 RACI を設ける背景と目的を 2〜4 行で記述する。
- `pm-organization.md` を採用ロールの正とすることを明記する。

### 6.2. 適用方針

- RACI 列に使う Role code を明示する。`pm-organization.md` で採用済みのものだけを列挙する。
- 未採用 Role code を列に含めない旨を記載する。
- `A` の集約先（通常は `PO`）と例外条件を記載する。
- Agent に `A` を割り当てない旨を記載する。

### 6.3. RACI の定義

- 標準を参照するだけでもよい。プロジェクト固有の補足がある場合のみ表を追記する。

### 6.4. 成果物別 RACI

- 行は成果物名または `id` とする。
- 列は採用 Role code のみとする。
- セルは R / A / C / I の組み合わせ（例: `A/R`）または空欄とする。
- `A` は各行に必ず 1 つ存在することを確認する。

推奨フォーマット:

| 成果物             | PO  | BA  | ARC | QE  |
| ------------------ | --- | --- | --- | --- |
| `<deliverable-id>` | A/R | C   | I   | C   |

### 6.5. プロセス別 RACI

- 行はプロジェクトで識別したプロセス名とする。
- 成果物別 RACI と同じ列構成にする。
- 成果物別 RACI と矛盾しないようにする。

### 6.6. 見直し条件

- `pm-organization.md` の採用ロール変更、成果物カタログの大幅変更、運用形態の変化などをトリガーとして記載する。

推奨フォーマット:

| 更新トリガー | 見直し内容 |
| ------------ | ---------- |

### 6.7. 禁止事項

- `pm-organization.md` で未採用の Role code を RACI 列に使わない。
- member nickname、人名、agent 名を RACI 列に使わない。
- Agent に `A` を割り当てない。
- 兼務を理由に `A` を複数 Role code に分散させない。
- Schedule の `owner` と矛盾する責任分担を記載しない。

## 7. 禁止事項

| 禁止事項                                             | 理由                                                         |
| ---------------------------------------------------- | ------------------------------------------------------------ |
| `pm-organization.md` で未採用の Role code を列に使う | 責任分担の参照先が一致しなくなるため                         |
| member nickname・人名・agent 名を RACI 列に使う      | ロールと個人を混在させると担当者変更時に更新漏れが生じるため |
| Agent に `A` を割り当てる                            | 最終責任は人間が担うべきであるため                           |
| 各行の `A` を省略する                                | 最終判断者が不明になるため                                   |
| 標準で定義済みの RACI 記号の意味を本文で再定義する   | 定義の不一致が生じるため                                     |
| Schedule の `owner` と矛盾する記載をする       | 実作業責任と管理責任が乖離するため                           |

## 8. サンプル（最小でも可）

- 参照: `../samples/pm-raci-sample.md`
