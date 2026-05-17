---
id: prj-0001:pm-organization
type: project
status: draft
rulebook: pm-organization-rulebook
based_on:
  - people-and-organization-definition-standard
---

# 組織定義

本書は、本プロジェクトにおけるロール・メンバー構成の方針と設計根拠を定義する。

Role、Member、Task owner、Executor、RACI の共通定義と使い分けは [人と組織の定義標準](../../../../specdojo/standards/people-and-organization-definition-standard.md) を参照する。本書では、共通ルールを再掲せず、本プロジェクトでの設計判断だけを記載する。

## 1. 基本方針

- 本プロジェクトは個人・小規模運用を前提とする。
- プロジェクトで使用する全ロールは `pm-roles.yaml` に定義する。`pm-roles.yaml` に列挙されたロールはすべて Schedule の `owner` として使用できる。
- 実行主体と担当ロールの割り当ては `pm-members.yaml` の `roles` フィールドで管理する。兼務の場合は複数のロールを列挙する。
- 小規模運用のため、`po` が `PM`・`OPS` を、`ba-agent` が `UX` を兼務する構成を採る。
- 最終判断・公開可否判断は `po`（human）が担う。agent はいかなる場合も最終承認しない。

## 2. 関連ドキュメント

| ドキュメント | 役割 |
| ------------ | ---- |
| [pm-roles.yaml](pm-roles.yaml) | プロジェクトで使用する全ロールを machine-readable な YAML として一覧化する |
| [pm-members.yaml](pm-members.yaml) | 実際に作業する人間または agent と担当ロールの対応を定義する |
| [pm-raci.md](pm-raci.md) | 必要時に成果物・プロセスごとの責任分担を定義する |
| [人と組織の定義標準](../../../../specdojo/standards/people-and-organization-definition-standard.md) | Role、Member、Task owner、Executor、RACI の共通ルールを定義する |

## 3. 見直し条件

| 更新トリガー | 見直し内容 |
| ------------ | ---------- |
| 複数人での継続運用を開始した | 兼務構成を解消し、専任メンバーを `pm-members.yaml` に追加する |
| 実装・公開・運用タスクが増えた | `DEV`・`OPS` を担う専任メンバーの追加を検討する |
| `pm-roles.yaml` 未掲載のロールが Schedule に必要になった | `pm-roles.yaml` へのロール追加を検討する |

## 4. 禁止事項

- member nickname、人名、agent 名を Schedule の `owner` に使わない。
- `pm-roles.yaml` に存在しないロールを Schedule の `owner` に使わない。
- agent に最終承認や公開可否判断を委ねない。
