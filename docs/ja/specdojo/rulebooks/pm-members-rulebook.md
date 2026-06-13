---
id: pm-members-rulebook
type: rulebook
status: draft
target_format: yaml
based_on:
  - people-and-organization-definition-standard
---

# プロジェクトメンバー定義 作成ルール

Project Member Roster Documentation Rulebook

本ドキュメントは、`pm-members.yaml` を一貫した構造で作成・更新するためのルールを定義する。Member は実際に作業する人間または agent を表し、Schedule の `owner` で使う Role code とは分けて管理する。

## 1. 全体方針

- `pm-members.yaml` は、`specdojo exec --by <nickname>` で指定できる実行主体の machine-readable な一覧として管理する。
- Member は人間または agent を表し、責務・判断権限を表す Role とは分離する。
- Member が対応できる Role code は `members[].roles` で表し、兼務の場合は複数記載する。Schedule の `owner` には member nickname を書かない。
- 公開文書では個人名、私用メールアドレス、非公開組織情報を記載しない。

## 2. 位置づけと用語定義

`pm-members.yaml` は、Role 定義と実行ログの間にある実行主体の台帳である。

| 用語       | 意味                                     | 管理先                                     |
| ---------- | ---------------------------------------- | ------------------------------------------ |
| Role       | 責務・判断権限・専門性を表す論理的な役割 | `pm-roles.yaml`                            |
| Member     | 実際に作業する人間または agent           | `pm-members.yaml`                          |
| Task owner | Schedule 上の主責任ロール                | Schedule                                   |
| Executor   | 実際にタスクを実行する主体               | `specdojo exec --by <nickname>` / 実行ログ |

`owner`、`roles`、`--by` は次のように使い分ける。

| 項目    | 意味                                    | 値の例                  | 管理先                  |
| ------- | --------------------------------------- | ----------------------- | ----------------------- |
| `owner` | タスクの主責任ロール                    | `BA`                    | Schedule                |
| `roles` | member が対応できる Role code のリスト  | `[BA]`, `[PO, PM, OPS]` | `pm-members.yaml`       |
| `--by`  | 実行主体の nickname                     | `ba-agent`              | 実行コマンド / 実行ログ |

## 3. ファイル命名・ID規則

- ファイル名は `pm-members.yaml` を推奨する。
- 推奨パス: `docs/ja/projects/<project-id>/030-project-management/020-organization/pm-members.yaml`
- 配置先はプロジェクトの管理領域配下に置き、同じ組織定義群の `pm-organization.md`、`pm-raci.md` と近接させる。
- `project_id` は配置先プロジェクト ID と一致させる。例: `prj-0001`
- `document.id` は `<project-id>:pm-members` 形式を推奨する。例: `prj-0001:pm-members`
- `members[].nickname` は実行ログに残る安定識別子とし、英小文字、数字、ハイフン、アンダースコアで記述する。
- 一度実行ログに記録した `nickname` は変更せず、改名が必要な場合は新しい member を追加する。

## 4. 推奨 Frontmatter 項目

YAML 成果物のため、Markdown Frontmatter ではなく先頭メタ項目として記載する。

| 項目                | 説明                             | 必須 |
| ------------------- | -------------------------------- | ---- |
| `version`           | メンバー定義のデータバージョン   | ○    |
| `project_id`        | プロジェクト ID                  | ○    |
| `document.id`       | 成果物 ID                        | ○    |
| `document.type`     | `project`                        | ○    |
| `document.status`   | `draft` / `ready` / `deprecated` | ○    |
| `document.rulebook` | `pm-members-rulebook`            | 任意 |
| `document.based_on` | 根拠ドキュメント ID の配列       | 任意 |

## 5. 本文構成（標準テンプレ）

`pm-members.yaml` は次のルート構造を標準とする。

| 要素         | 必須 | 内容                                 |
| ------------ | ---- | ------------------------------------ |
| `version`    | ○    | データバージョン                     |
| `project_id` | ○    | プロジェクト ID                      |
| `document`   | ○    | 成果物メタ情報                       |
| `members`    | ○    | Member 定義の配列                    |
| `rules`      | 任意 | この member 定義を使う際の運用ルール |

`members[]` は次のフィールドを標準とする。

| フィールド           | 必須 | 内容                                                                    |
| -------------------- | ---- | ----------------------------------------------------------------------- |
| `nickname`           | ○    | `--by` で指定する安定識別子                                             |
| `display_name`       | ○    | 表示名。公開文書では個人名を避けてよい                                  |
| `email`              | 任意 | 公開可能な連絡先。非公開または不要なら `null`                           |
| `roles`              | 任意 | 対応する Role code のリスト。兼務の場合は複数記載する。汎用 agent は `[]` 可 |
| `type`               | ○    | `human` または `agent`                                                  |
| `persona`            | 任意 | 実行姿勢やレビュー観点を表す短いラベル                                  |
| `focus`              | 任意 | 重視する観点の配列                                                      |
| `scheduler_strategy` | 任意 | 既定の scheduler 戦略                                                   |
| `note`               | 任意 | 補足。責務境界や公開上の注意を簡潔に書く                                |

## 6. 記述ガイド

### 6.1. `members[].roles` と `pm-roles.yaml` の関係

- `members[].roles` には、`pm-roles.yaml` に存在する Role code のみを記載する。
- 兼務がある場合は複数の Role code を列挙する。例: `roles: [PO, PM, OPS]`
- 特定ロールに固定しない汎用 agent は `roles: []` としてよい。
- `roles: []` の member を実行に使う場合は、実行時の文脈またはタスク owner で対象 Role を明示する。

### 6.2. `members[].nickname`

- `nickname` は CLI、実行ログ、イベント履歴で参照されるため、短く安定した値にする。
- 人間の member には `po`、agent には `ba-agent` のように、用途が分かる値を使う。
- 表示名や実名を変更しても `nickname` は変更しない。

### 6.3. `members[].roles`

- `roles` には `pm-roles.yaml` に含まれる Role code を記載する。
- 兼務がある場合は複数の Role code を列挙する。
- 特定ロールに固定しない汎用 agent は `roles: []` としてよい。
- `roles` は member 側の対応ロールを表す。Schedule の `owner` の代替として使わない。

### 6.4. `members[].type`

- 人間の実行主体は `human`、自動化または生成 AI 支援主体は `agent` とする。
- agent は草案作成、レビュー支援、整合性確認、機械的更新を支援できる。
- agent に最終承認、公開可否判断、説明責任を持たせない。

### 6.5. `persona`、`focus`、`scheduler_strategy`

- `persona` は実行姿勢を表す短い kebab-case のラベルにする。例: `risk-averse-reviewer`
- `focus` は agent や member が重視する観点を配列で列挙する。
- `scheduler_strategy` は実行順序の既定方針に限定し、個別タスクの判断理由を詰め込まない。
- scheduler 戦略は、プロジェクトで使う語彙に限定する。例: `critical-first`, `dependency-first`, `fifo`, `manual`

### 6.6. `rules`

- `rules` には、この member 定義を使う際に検証可能な運用ルールを箇条書きで記載する。
- `owner`、`roles`、`--by` の使い分けを明記する。
- 公開文書で扱わない個人情報や非公開組織情報を明記しない方針を含める。

## 7. 禁止事項

| 禁止事項                                                             | 理由                                                                     |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `pm-members.yaml` の member 側で `owner` フィールドを使う            | `owner` は Schedule の主責任ロールであり、member 側では `roles` を使うため |
| Schedule の `owner` に `nickname`、人名、agent 名を書く              | タスク責任が Role code で追跡できなくなるため                            |
| `members[].roles` に `pm-roles.yaml` で未定義の Role code を書く     | 実行候補の判定が不整合になるため                                         |
| agent に最終承認や公開可否判断を割り当てる                           | 人間の判断責任を代替してしまうため                                       |
| 公開文書に不要な個人名、私用メールアドレス、非公開組織情報を書く     | 公開範囲とプライバシーに反するため                                       |
| 実行ログ記録後に `nickname` を変更する                               | 履歴との対応が壊れるため                                                 |

## 8. サンプル

- 参照: `../samples/pm-members-sample.yaml`
