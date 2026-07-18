---
specdojo:
  id: pm-organization-rulebook
  type: rulebook
  status: ready
  target_format: markdown
  recipe: pm-organization-recipe
  sample: pm-organization-sample
  template: pm-organization-template
  based_on:
    - people-and-organization-definition-standard
---

# 組織定義 作成ルール

Organization Definition Documentation Rulebook

本ドキュメントは、プロジェクト固有の組織定義である `pm-organization.md` を作成・更新するためのルールを定義する。組織設計の方針、採用根拠、使用可能な `owner` 語彙、最終判断の集約先を、後続のロール定義とメンバー定義へ渡せる粒度で整える。

## 1. 全体方針

- `pm-organization.md` には、ロール・メンバー構成の方針、設計根拠、採用する責務語彙、最終判断の集約先を記載する。
- 全 Role code は `pm-roles.yaml`、具体的な member と兼務割り当ては `pm-members.yaml` を正本とし、`pm-organization.md` へ一覧を複製しない。
- 構成の根拠は、プロジェクトの目的、スコープ、優先順位、公開方針と対応させる。個人・小規模運用、複数人運用などの規模は、構成判断に必要な範囲で明示する。
- PO が承認、保留、差し戻しを判断できるよう、未決事項、影響範囲、見直し条件を判定可能な形で残す。
- AI Agent は作業支援の位置づけに留め、最終承認、公開可否、説明責任は人間の PO に残す。
- 公開文書には個人名、連絡先、非公開組織情報、アクセス情報を記載しない。

## 2. 位置づけと用語定義

`pm-organization.md` は、プロジェクトにおける組織設計の方針・根拠文書である。役割と実行主体の詳細を分離して管理し、構成を見直す判断を可能にする。

| 文書                                          | 役割                                       | 正本とする内容                                            |
| --------------------------------------------- | ------------------------------------------ | --------------------------------------------------------- |
| `people-and-organization-definition-standard` | Role、Member、owner、RACI の共通定義を示す | 共通概念、Schedule への展開ルール、標準ロールの扱い       |
| `prj-overview.md`                             | 目的、優先順位、公開方針の前提を定義する   | 組織設計が支える目的と制約                                |
| `pm-organization.md`                          | 組織構成の方針と根拠を記述する             | 構成の採用理由、`owner` 語彙の扱い、最終判断、見直し条件  |
| `pm-roles.yaml`                               | 使用する Role code を管理する              | Schedule の `owner` や RACI で使用できる Role code の語彙 |
| `pm-members.yaml`                             | 実行主体と Role code の対応を管理する      | 具体的な member、兼務、agent の対応                       |
| `pm-raci.md`                                  | 必要時の責任分担を定義する                 | 成果物・プロセスごとの責任分担                            |

用語は、プロジェクト固有の意味を追加する場合だけ定義する。本文構成と記述ガイドで意味が明確な場合は、重複する用語定義を置かない。

## 3. ファイル命名・ID規則

- 推奨パス: `docs/ja/projects/<project-id>/030-project-management/020-organization/pm-organization.md`
- 推奨ファイル名: `pm-organization.md`
- 推奨 ID: `<project-id>:pm-organization`
- `rulebook` は `pm-organization-rulebook` を指定する。
- `based_on` には、組織設計の根拠として参照したプロジェクト概要などの ID を記載する。

## 4. 推奨 Frontmatter 項目

| 項目       | 説明                                       | 必須 |
| ---------- | ------------------------------------------ | ---- |
| `id`       | `<project-id>:pm-organization`             | ○    |
| `type`     | `project`                                  | ○    |
| `status`   | `draft` / `ready` / `deprecated`           | ○    |
| `rulebook` | `pm-organization-rulebook`                 | ○    |
| `based_on` | 組織設計の根拠として参照した方針の ID 配列 | 任意 |

## 5. 本文構成（標準テンプレ）

| 番号 | 見出し                  | 必須 | 内容                                                                         |
| ---- | ----------------------- | ---- | ---------------------------------------------------------------------------- |
| 1    | 基本方針                | ○    | プロジェクト規模、兼務構成の根拠、PO の最終判断と公開方針                    |
| 2    | 採用ロールと owner 語彙 | ○    | 採用する責務語彙、Schedule の `owner` に使える値、専任 member 配置との違い   |
| 3    | 関連ドキュメント        | ○    | `prj-overview.md`、`pm-roles.yaml`、`pm-members.yaml`、`pm-raci.md` への導線 |
| 4    | 見直し条件              | ○    | 構成を見直すトリガー、PO が確認する影響範囲、更新対象                        |
| 5    | 禁止事項                | ○    | 正本の重複、責務の混同、公開不適切情報の記載を防ぐ                           |

## 6. 記述ガイド

### 6.1. 基本方針

- プロジェクト規模を明示する。例: 個人・小規模運用、複数人運用、外部関係者あり。
- 目的、スコープ、優先順位、公開方針から、採用する構成と兼務の方針を説明する。具体的な member や割り当ては書かない。
- `pm-roles.yaml` と `pm-members.yaml` が何を管理するかを 1 行ずつ示し、`pm-organization.md` が設計根拠を扱うことを明示する。
- PO が最終判断、公開可否、説明責任を担うことと、AI Agent が支援する範囲を明記する。
- 未決事項がある場合は、`_UNDECIDED_:` として判断者または判断時点を添える。

### 6.2. 採用ロールと owner 語彙

- `pm-roles.yaml` に定義した Role code を、Schedule の `owner` や RACI の列で使用できる責務語彙として扱うかを明記する。
- 採用した Role code は、専任 member の配置を意味しないことを明示する。兼務や実行主体の対応は `pm-members.yaml` に委譲する。
- Schedule の `owner` に使える値は `pm-roles.yaml` の `roles[].code` に限定する。
- member nickname、agent 名、個人名、未定義の独自 Role code を `owner` にしないことを明記する。

### 6.3. 関連ドキュメント

- `prj-overview.md`、`pm-roles.yaml`、`pm-members.yaml`、`pm-raci.md` への導線を置く。
- 関連ドキュメントの本文を要約しすぎず、役割を 1 行で示す。

推奨表:

| ドキュメント | 役割 |
| ------------ | ---- |

### 6.4. 見直し条件

- 目的、スコープ、優先順位、公開方針の変更をトリガーに含める。
- 参加者の増加、兼務による滞留、公開・運用責任の増加など、構成の再設計が必要になる事象を書く。
- 各トリガーには、PO が確認する影響範囲と更新対象を添える。

推奨表:

| 更新トリガー | PO が確認する影響範囲 | 更新対象 |
| ------------ | --------------------- | -------- |

### 6.5. 禁止事項

対象文書の `禁止事項` 章には、プロジェクト運用上の禁止事項を記載する。文書作成時の禁止事項は本 rulebook の `禁止事項` 章が定めるため、対象文書へ複製しない。

- Role code 一覧、具体的な member、兼務の割り当てを本書へ複製しないことを、更新時の運用ルールとして記載する。
- Schedule の `owner` に member nickname、agent 名、個人名、未定義の Role code を使わないことを記載する。
- AI Agent に最終承認、公開可否、説明責任を委ねないことを記載する。
- 公開文書に個人情報、連絡先、非公開組織情報、アクセス情報を記載しないことを記載する。
- プロジェクト固有の禁止事項を追加する場合は、`基本方針` および `見直し条件` と矛盾しないことを確認する。

## 7. 禁止事項

本章は、`pm-organization.md` を作成・更新する際の禁止事項を定義する。プロジェクト運用上の禁止事項は、対象文書の `禁止事項` 章に記載する（記述ガイドの `禁止事項` 参照）。

| 禁止事項                                                                  | 理由                                           |
| ------------------------------------------------------------------------- | ---------------------------------------------- |
| 全 Role code の一覧を `pm-organization.md` に記載する                     | `pm-roles.yaml` が正本であり重複管理になるため |
| 兼務の具体的な割り当てや member 一覧を複製する                            | `pm-members.yaml` の正本性が分散するため       |
| `owner` / `roles` / 実行主体の共通定義表を再掲する                        | 定義変更時に不整合が起きるため                 |
| `pm-roles.yaml` にない値を Schedule の `owner` に使える語彙として記載する | タスク責任が追跡できなくなるため               |
| 個人情報、連絡先、非公開組織情報を記載する                                | 公開文書としての安全性と説明責任を損なうため   |
