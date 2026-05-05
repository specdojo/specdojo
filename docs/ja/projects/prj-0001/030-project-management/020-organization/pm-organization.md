---
id: prj-0001:pm-organization
type: project
status: draft
rulebook: pm-organization-rulebook
based_on:
  - people-and-organization-definition-standard
---

# 組織定義

本書は、SpecDojo Handbook プロジェクトにおけるロール採用方針と最小限の責務境界を定義する。

Role、Member、Task owner、Executor、RACI の共通定義と使い分けは [人と組織の定義標準](../../../../specdojo/standards/people-and-organization-definition-standard.md) を参照する。本書では、共通ルールを再掲せず、本プロジェクトでの採用判断だけを記載する。

## 1. 基本方針

- 本プロジェクトは個人・小規模運用を前提とする。
- WBS / Schedule の `owner` には、採用ロールの Role code のみを使用する。
- 1 人の人間または agent が複数ロールの作業を支援してよい。ただし最終判断は `PO` が担う。
- `owner`、`role`、`--by` の使い分けは、標準の定義に従う。

## 2. 採用ロール

| Role code | 正式名称         | 本プロジェクトでの扱い                           |
| --------- | ---------------- | ------------------------------------------------ |
| `PO`      | Project Owner    | 採用。最終判断を担い、`PM`・`OPS` 責務を兼務する |
| `BA`      | Business Analyst | 採用。要件、利用者視点、受入条件を整理する       |
| `ARC`     | Architect        | 採用。文書体系、構成方針、技術制約を整理する     |
| `QE`      | Quality Engineer | 採用。品質基準、レビュー観点、整合性を確認する   |

## 3. 未採用ロール

| Role code | 正式名称                     | 未採用理由・代替方針                       |
| --------- | ---------------------------- | ------------------------------------------ |
| `PM`      | Project Manager              | 小規模運用のため未採用。`PO` が兼務する    |
| `DEV`     | Developer                    | 実装タスクが増えた場合に追加を検討する     |
| `UX`      | UX / Documentation Designer  | 必要に応じて `BA` または `PO` が兼務する   |
| `OPS`     | Operations / Release Manager | 公開・配布・リリース判断は `PO` が兼務する |

## 4. 本プロジェクトで使用できる `owner`

WBS / Schedule の `owner` として使用できる Role code は次の 4 つに限定する。

- `PO`
- `BA`
- `ARC`
- `QE`

`PM`、`DEV`、`UX`、`OPS` は現時点では `owner` として使用しない。

## 5. 関連ドキュメント

| ドキュメント | 役割 |
| ------------ | ---- |
| [pm-members.yaml](pm-members.yaml) | 実際に作業する人間または agent と Role code の対応を定義する |
| [pm-raci.md](pm-raci.md) | 必要時に成果物・プロセスごとの責任分担を定義する |
| [人と組織の定義標準](../../../../specdojo/standards/people-and-organization-definition-standard.md) | Role、Member、Task owner、Executor、RACI の共通ルールを定義する |

## 6. 見直し条件

| 更新トリガー | 見直し内容 |
| ------------ | ---------- |
| WBS / Schedule の `owner` に未採用ロールが必要になった | 採用ロールと未採用ロールの見直し |
| 複数人での継続運用を開始した | `PM` の独立採用と RACI の追加要否 |
| 実装・公開・運用タスクが増えた | `DEV`、`UX`、`OPS` の追加要否 |

## 7. 禁止事項

- 未採用ロール（`PM`、`DEV`、`UX`、`OPS`）を WBS / Schedule の `owner` に使わない。
- member nickname、人名、agent 名を WBS / Schedule の `owner` に使わない。
- agent に最終承認や公開可否判断を委ねない。
