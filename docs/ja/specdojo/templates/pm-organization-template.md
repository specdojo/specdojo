---
id: _PROJECT_ID_:pm-organization
type: project
status: ready
rulebook: pm-organization-rulebook
based_on:
  - _PROJECT_ID_:prj-overview
---

# 組織定義

_TODO_: プロジェクトの目的、優先順位、公開方針を支える組織構成の方針と設計根拠を一文で記述する。Role code や具体的な member の一覧は書かず、公開可能な組織定義としての判断方針だけを示す。

## 1. 基本方針

_TODO_: 運用規模、兼務の方針、構成を採用する根拠を記述する。目的、スコープ、優先順位、公開方針と対応させ、PO の最終判断と AI Agent の支援範囲を明示する。

- _TODO_: 運用規模と兼務の方針。
- _TODO_: `pm-roles.yaml` が Role code の正本であり、`pm-members.yaml` が実行主体・割り当ての正本であること。
- _TODO_: PO が確認する承認判断の論点（未決事項、影響範囲を含む）。
- _TODO_: AI Agent の支援範囲と、人間の PO が担う最終判断・公開可否・説明責任。

## 2. 採用ロールと owner 語彙

_TODO_: `pm-roles.yaml` に定義した Role code を、Schedule の `owner` や RACI の列として使用できる責務語彙として扱うかを記述する。採用と専任 member 配置を混同せず、`owner` の実体は `roles[].code` に限定する。

- _TODO_: 使用可能な `owner` 語彙の正本は `pm-roles.yaml` であること。
- _TODO_: 採用する責務語彙と、専任 member 配置の違い。
- _TODO_: 具体的な実行主体と兼務割り当ては `pm-members.yaml` に委譲する方針。
- _TODO_: `owner` に使ってはいけない値（member nickname、agent 名、個人名、未定義 Role code）。

## 3. 関連ドキュメント

_TODO_: 各文書の内容を複製せず、正本と役割への導線を置く。存在する文書は `[[id|title]]`、未作成の文書はバッククォートで記述する。

| ドキュメント      | 役割                                             |
| ----------------- | ------------------------------------------------ |
| `prj-overview.md` | _TODO_: 組織設計が支える目的、優先順位、公開方針 |
| `pm-roles.yaml`   | _TODO_: Role code と `owner` 語彙の正本          |
| `pm-members.yaml` | _TODO_: 実行主体と担当 Role code の正本          |
| `pm-raci.md`      | _TODO_: 必要時の責任分担                         |

## 4. 見直し条件

_TODO_: 構成を見直すトリガー、PO が確認する影響範囲、更新対象を対応付ける。具体的な Role code や member の割り当ては書かない。

| 更新トリガー                                       | PO が確認する影響範囲              | 更新対象             |
| -------------------------------------------------- | ---------------------------------- | -------------------- |
| _TODO_: 目的、スコープ、優先順位、公開方針の変更   | _TODO_: 構成と最終判断の妥当性     | _TODO_: 更新する正本 |
| _TODO_: 兼務による判断または実行の滞留             | _TODO_: 分担の必要性と公開可否判断 | _TODO_: 更新する正本 |
| _TODO_: 継続参加者または運用責任の増加             | _TODO_: 役割と責任分担             | _TODO_: 更新する正本 |
| _TODO_: 新しい Role code が必要になった            | _TODO_: 標準語彙で代替可能か       | _TODO_: 更新する正本 |
| _TODO_: 公開対象に非公開情報が含まれる可能性が出た | _TODO_: 公開可否、匿名化の要否     | _TODO_: 更新する正本 |

## 5. 禁止事項

- _TODO_: Role code の一覧、具体的な member、兼務の割り当てを本書に複製しない。
- _TODO_: 個人名、member nickname、agent 名を Schedule の `owner` として扱わない。
- _TODO_: 正本にない Role code を Schedule の `owner` として扱わない。
- _TODO_: AI Agent に最終承認、公開可否、説明責任を委ねない。
- _TODO_: 個人情報、連絡先、非公開組織情報、アクセス情報を記載しない。
