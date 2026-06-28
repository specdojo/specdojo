---
id: pm-members-rulebook
type: rulebook
status: ready
target_format: yaml
recipe: pm-members-recipe
sample: pm-members-sample
template: pm-members-template
based_on:
  - people-and-organization-definition-standard
---

# プロジェクトメンバー定義 作成ルール

Project Member Roster Documentation Rulebook

本ドキュメントは、`pm-members.yaml` を一貫した構造で作成・更新するためのルールを定義する。`pm-members.yaml` は、`specdojo exec --by <nickname>` で指定できる実行主体と、各主体が対応できる Role code を管理する YAML 台帳である。

## 1. 全体方針

- `pm-members.yaml` には、実際に作業または支援する人間と agent を記載する。
- Member は実行主体を表し、責務・判断権限を表す Role とは分離する。
- Member が対応できる Role code は `members[].roles` で表す。Schedule の `owner` には member nickname を書かない。
- `members[].roles` には、`pm-roles.yaml` に存在する Role code だけを記載する。特定 Role に固定しない汎用 agent は `roles: []` としてよい。
- agent は草案作成、レビュー支援、整合確認、機械的更新を支援できるが、最終承認、公開可否判断、説明責任は人間の PO が担う。
- 公開文書には、不要な個人名、私用メールアドレス、非公開組織情報、アクセス情報を記載しない。

## 2. 位置づけと用語定義

`pm-members.yaml` は、Role 定義と実行ログの間にある実行主体の台帳である。

| 文書                 | 役割                                                            | 正本とする内容                                                           |
| -------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `pm-organization.md` | ロール・メンバー構成の方針と設計根拠を記述する                  | 採用方針、最終判断の集約先、見直し条件                                   |
| `pm-roles.yaml`      | 採用した Role code を machine-readable な YAML として一覧化する | `owner` 語彙、Role code 名、プロジェクト固有メモ                         |
| `pm-members.yaml`    | 実行主体と対応する Role code の対応を管理する                   | member nickname、人間または agent、兼務割り当て、実行に必要な agent 情報 |
| `pm-raci.md`         | 必要時の責任分担を記述する                                      | 成果物・プロセスごとの責任分担                                           |

用語は次のように使い分ける。

| 用語      | 意味                                     | `pm-members.yaml` での扱い                   |
| --------- | ---------------------------------------- | -------------------------------------------- |
| Role code | 責務・判断権限・専門性を表す短い識別子   | `members[].roles` に列挙する                 |
| Member    | 実際に作業または支援する主体             | `members[]` に列挙する                       |
| nickname  | CLI と実行ログで使う Member の安定識別子 | `members[].nickname` に記載する              |
| Executor  | 実際にタスクを実行する主体               | `specdojo exec --by <nickname>` で指定される |

## 3. ファイル命名・ID規則

- ファイル名は `pm-members.yaml` を推奨する。
- 配置先は `pm-organization.md`、`pm-roles.yaml`、`pm-raci.md` と同じ組織定義ディレクトリに置く。
- 推奨パス: `docs/ja/projects/<project-id>/030-project-management/020-organization/pm-members.yaml`
- `project_id` は配置先プロジェクト ID と一致させる。例: `prj-0001`
- `id` は `<project-id>:pm-members` 形式を推奨する。例: `prj-0001:pm-members`
- `members[].nickname` は英小文字、数字、ハイフン、アンダースコアで記述する。
- 一度実行ログに記録した `nickname` は変更せず、改名が必要な場合は新しい member を追加する。

## 4. 推奨メタ項目

YAML 成果物のため、Markdown Frontmatter ではなく YAML 先頭のメタ項目として記載する。

| 項目         | 説明                                      | 必須 |
| ------------ | ----------------------------------------- | ---- |
| `id`         | `<project-id>:pm-members` 形式の成果物 ID | ○    |
| `type`       | `project` 固定                            | ○    |
| `status`     | `draft` / `ready` / `deprecated`          | ○    |
| `rulebook`   | `pm-members-rulebook`                     | 任意 |
| `based_on`   | 根拠ドキュメント ID の配列                | 任意 |
| `version`    | データバージョン。初期値は `1`            | ○    |
| `project_id` | プロジェクト ID                           | ○    |

## 5. 本文構成（標準テンプレ）

`pm-members.yaml` は次のルート構造を標準とする。

| 要素         | 必須 | 内容                                 |
| ------------ | ---- | ------------------------------------ |
| `id`         | ○    | 成果物 ID                            |
| `type`       | ○    | 成果物種別                           |
| `status`     | ○    | 成果物状態                           |
| `rulebook`   | 任意 | 参照する rulebook ID                 |
| `based_on`   | 任意 | 根拠 ID 配列                         |
| `version`    | ○    | データバージョン                     |
| `project_id` | ○    | プロジェクト ID                      |
| `members`    | ○    | Member 定義の配列                    |
| `rules`      | 任意 | この member 定義を使う際の運用ルール |

`members[]` は次のフィールドを標準とする。

| フィールド           | 必須       | 内容                                                |
| -------------------- | ---------- | --------------------------------------------------- |
| `nickname`           | ○          | `--by` で指定する安定識別子                         |
| `display_name`       | ○          | 表示名。公開文書では個人名を避けてよい              |
| `email`              | 任意       | 公開可能な連絡先。非公開または不要なら `null`       |
| `roles`              | ○          | 対応する Role code のリスト。汎用 agent は `[]` 可  |
| `type`               | ○          | `human` または `agent`                              |
| `priority`           | agent 推奨 | 同条件の agent 候補間での優先度。小さい値を優先する |
| `mode`               | agent 推奨 | `edit` または `review`。担当できる実行モードを表す  |
| `proficiency`        | agent 推奨 | `normal` / `expert` などの品質 tier                 |
| `persona`            | 任意       | 実行姿勢やレビュー観点を表す短いラベル              |
| `focus`              | 任意       | 重視する観点の配列                                  |
| `capabilities`       | agent 推奨 | `web_search` などのツール能力                       |
| `command`            | agent 推奨 | `exec run` が呼び出すシェルコマンド                 |
| `scheduler_strategy` | 任意       | 既定の scheduler 戦略                               |
| `note`               | 任意       | 補足。責務境界や公開上の注意を簡潔に書く            |

## 6. 記述ガイド

### 6.1. `members`

- `members` には、実行ログに残る可能性がある人間と agent を過不足なく記載する。
- PO などの人間 member は、最終判断・公開可否・説明責任を担う範囲を `note` で明示する。
- agent member は、支援範囲、実行モード、能力、実行コマンドが分かる粒度で記載する。
- 一時的に使うだけの個人名、ローカル端末名、秘密情報を member として記載しない。

### 6.2. `members[].nickname`

- `nickname` は CLI、実行ログ、イベント履歴で参照されるため、短く安定した値にする。
- 人間の member には `po`、agent には `ba-agent` のように、用途が分かる値を使う。
- 表示名や担当範囲が変わっても、実行ログ記録後の `nickname` は変更しない。
- 大文字、空白、記号を含む表示名を `nickname` にしない。

### 6.3. `members[].roles`

- `members[].roles` には、`pm-roles.yaml` の `roles[].code` に存在する Role code だけを記載する。
- 兼務がある場合は複数の Role code を列挙する。
- 特定 Role に固定しない汎用 agent は `roles: []` としてよい。
- `roles` は member 側の対応ロールを表す。Schedule の `owner` の代替として使わない。

### 6.4. `members[].type` と agent 用フィールド

- 人間の実行主体は `human`、自動化または生成 AI 支援主体は `agent` とする。
- `exec run --auto` の候補にする agent には、`priority`、`mode`、`proficiency`、`capabilities`、`command` を記載する。
- `capabilities` はツールアクセスの能力だけを表し、成果物の責務や承認権限を表さない。
- `command` には実行に必要なコマンドを記載するが、認証情報、秘密鍵、トークン、個人環境に閉じたパスを含めない。

### 6.5. `persona`、`focus`、`scheduler_strategy`

- `persona` は実行姿勢を表す短い kebab-case のラベルにする。例: `risk-averse-reviewer`
- `focus` は agent や member が重視する観点を配列で列挙する。
- `scheduler_strategy` は実行順序の既定方針に限定し、個別タスクの判断理由を詰め込まない。
- scheduler 戦略は、プロジェクトで使う語彙に限定する。例: `critical-first`, `dependency-first`, `fifo`, `manual`

### 6.6. `rules`

- `rules` には、この member 定義を使う際に検証可能な運用ルールを箇条書きで記載する。
- `owner`、`roles`、`--by` の使い分けを明記する。
- agent が支援できる作業と、人間の PO が担う最終判断を分けて記載する。
- 公開文書で扱わない個人情報や非公開組織情報を記載しない方針を含める。

## 7. 禁止事項

| 禁止事項                                                           | 理由                                                                       |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `pm-members.yaml` の member 側で `owner` フィールドを使う          | `owner` は Schedule の主責任ロールであり、member 側では `roles` を使うため |
| Schedule の `owner` に `nickname`、人名、agent 名を書く            | タスク責任が Role code で追跡できなくなるため                              |
| `members[].roles` に `pm-roles.yaml` で未定義の Role code を書く   | 実行候補の判定が不整合になるため                                           |
| agent に最終承認や公開可否判断を割り当てる                         | 人間の判断責任を代替してしまうため                                         |
| 公開文書に不要な個人名、私用メールアドレス、非公開組織情報を書く   | 公開範囲とプライバシーに反するため                                         |
| `command` に認証情報、秘密鍵、トークン、個人環境に閉じたパスを書く | 秘密情報の漏えいと再利用不能な構成を招くため                               |
| 実行ログ記録後に `nickname` を変更する                             | 履歴との対応が壊れるため                                                   |

## 8. サンプル

- 参照先: [pm-members-sample](../samples/pm-members-sample.yaml)

## 9. 作成レシピ

- 参照: [[pm-members-recipe|メンバー定義 作成レシピ]]

## 10. テンプレート

- 参照: [[pm-members-template|メンバー定義 template]]
