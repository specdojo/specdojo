---
id: prj-0001:pm-organization
type: project
status: draft
rulebook: pm-organization-rulebook
based_on:
  - people-and-organization-definition-standard
---

# 組織定義

## 1. 基本方針

駄菓子屋きぬや販売管理システム構築プロジェクトは、店主代表と生成 AI 支援 agent を中心に進める個人・小規模運用とする。単一店舗、店頭タブレット 1 台、販売・在庫・つけ管理の初期リリースを前提に、判断責任を人間の `po` に集約する。

`pm-roles.yaml` は、Schedule の `owner` と `pm-members.yaml` の `members[].roles` で使用できる Role code の語彙一覧を管理する。`pm-members.yaml` は、人間または agent の実行主体と対応 Role code を管理する。本書は、そのロール・メンバー構成を採用する理由と見直し条件を記録する。

小規模運用のため、`PO` が目的、優先順位、進捗管理、公開判断、初期運用判断を兼務する。要件整理は `BA`、構成方針と実装関連の整理は `ARC` と `DEV`、品質確認は `QE` の観点で分け、実行主体の具体的な対応 Role code は `pm-members.yaml` に委ねる。agent は草案作成とレビュー支援を担うが、最終判断、公開可否判断、説明責任は人間の `po` が担う。

## 2. 関連ドキュメント

| ドキュメント | 役割 |
| ------------ | ---- |
| `pm-roles.yaml` | 本プロジェクトで使用する Role code の語彙一覧を管理する |
| `pm-members.yaml` | 実行主体と対応 Role code を管理し、`specdojo exec --by <nickname>` の指定候補を定義する |
| `pm-raci.md` | 必要時に主要成果物・プロセスごとの責任分担を定義する |
| [people-and-organization-definition-standard.md](../standards/people-and-organization-definition-standard.md) | Role、Member、Task owner、Executor、RACI の共通定義を参照する |

## 3. 見直し条件

| 更新トリガー | 見直し内容 |
| ------------ | ---------- |
| 外部開発メンバーが継続参加し、実装タスクの判断責任を分離する必要が出た | `DEV` の位置づけ、`pm-members.yaml` の対応 Role code、RACI の列構成を見直す |
| 店頭運用の説明、画面文言、操作導線の改善タスクが継続的に増えた | `UX` を独立させるか、`BA` が兼務する範囲に留めるかを判断する |
| リリース手順、障害一次対応、変更管理を定常運用する必要が出た | `OPS` の独立要否と、運用関連文書の追加要否を見直す |
| 週次の進捗・課題・リスク管理が `PO` 兼務では滞る状態になった | `PM` を独立させるか、`PO` 兼務を継続するかを見直す |
| `pm-roles.yaml` に Role code を追加または削除した | `pm-members.yaml`、Schedule の `owner`、必要に応じて `pm-raci.md` を更新する |

## 4. 禁止事項

- 全 Role code の一覧を本書に複製しない。
- 具体的な member 一覧や兼務の割り当てを本書に複製しない。
- `owner` / `roles` / `--by` の共通定義表を本書に再掲しない。
- 個人名、member nickname、agent 名を Schedule の `owner` として使えるように記述しない。
- `pm-roles.yaml` 未掲載の Role code を Schedule の `owner` に使えるように記述しない。
- agent に最終判断、公開可否判断、説明責任を委ねない。
