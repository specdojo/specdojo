---
id: _PROJECT_ID_:pm-raci
type: project
status: ready
rulebook: pm-raci-rulebook
based_on:
  - people-and-organization-definition-standard
  - _PROJECT_ID_:pm-organization
---

# RACI

_TODO_: 対象プロジェクトにおける主要成果物と主要プロセスの責任分担を、PM が計画化、進捗確認、課題・リスク管理に使える粒度で定義する一文を記述する。

## 1. 目的

_TODO_: 本 RACI の目的、管理・報告への使い道、前提となる組織定義の参照先を記述する。Role code や member の一覧は複製しない。

## 2. 適用方針

- _TODO_: RACI 列に使う Role code の範囲。組織定義で採用済みの Role code のみを使う。
- _TODO_: 採用済み Role code の一部を列から省く場合は、省略理由。
- _TODO_: `A` は 1 成果物・1 プロセスにつき 1 Role code に限定する方針。
- _TODO_: Agent は `R`、`C` の支援に留め、`A` を担わない方針。
- _TODO_: 実際の member、agent、兼務割り当てを `pm-members.yaml` 等の正本に委譲する方針。

## 3. RACI の定義

_TODO_: RACI 記号の標準定義を参照するか、下表をプロジェクト用に簡潔に埋める。標準定義と異なる意味を持ち込まない。

| 記号 | 意味 | 説明 |
| --- | --- | --- |
| R | Responsible | _TODO_: 実作業責任の説明 |
| A | Accountable | _TODO_: 最終責任・承認・判断の説明 |
| C | Consulted | _TODO_: 相談・レビュー参加の説明 |
| I | Informed | _TODO_: 結果共有の説明 |

## 4. 成果物別 RACI

_TODO_: 成果物名または成果物 ID を行、採用 Role code を列として責任分担を記述する。各行の `A` は 1 つだけにする。

| 成果物 | _ROLE_1_ | _ROLE_2_ | _ROLE_3_ |
| --- | --- | --- | --- |
| _TODO_: `<deliverable-id>` | A/R | C | I |
| _TODO_: `<deliverable-id>` | C | A/R | C |

## 5. プロセス別 RACI

_TODO_: PM が管理・報告へ接続する主要プロセスを行として記述する。成果物作成、レビュー、変更判断、公開判断など、最終責任者が異なるものは行を分ける。

| プロセス | _ROLE_1_ | _ROLE_2_ | _ROLE_3_ |
| --- | --- | --- | --- |
| _TODO_: 成果物作成の計画化・順序付け | C | A/R | C |
| _TODO_: 課題・リスクの識別と登録 | C | A/R | C |
| _TODO_: 変更要求の採否判断 | A | R | C |

## 6. 見直し条件

_TODO_: RACI を更新するトリガーと見直し内容を記述する。RACI 列、全行の `A`、Schedule `owner`、課題・リスク・変更要求への影響を確認できる内容にする。

| 更新トリガー | 見直し内容 |
| --- | --- |
| _TODO_: 組織定義で採用 Role code を変更した | _TODO_: RACI 列と全行の `A` を見直す |
| _TODO_: 成果物カタログまたは WBS を大幅変更した | _TODO_: 成果物別 RACI の行を追加、削除、統合する |
| _TODO_: 進捗遅延、課題滞留、リスク顕在化が継続した | _TODO_: PM の責任、報告対象、エスカレーション先を見直す |

## 7. 禁止事項

- _TODO_: 組織定義で採用していない Role code を RACI 列に使わない。
- _TODO_: member nickname、人名、agent 名を RACI 列に使わない。
- _TODO_: Agent に `A` を割り当てない。
- _TODO_: 各行の `A` を省略しない。
- _TODO_: 1 行に複数の `A` を置かない。
- _TODO_: Schedule の `owner`、課題・リスク・変更要求の管理単位と矛盾する責任分担を記載しない。
