---
specdojo:
  id: specdojo:pm-members-rulebook
  type: rulebook
  status: ready
  target_format: yaml
  recipe: specdojo:pm-members-recipe
  sample: specdojo:pm-members-sample
  template: specdojo:pm-members-template
  based_on:
    - specdojo:people-and-organization-definition-standard
---

# プロジェクトメンバー定義 作成ルール

Project Human Member Roster Documentation Rulebook

`pm-members.yaml` を、人間の実行主体と対応 Role code を管理するプロジェクト成果物として作成・更新するためのルールです。実行可能な agent の定義は、リポジトリ共通の保護設定へ分離します。

## 1. 全体方針

- `pm-members.yaml` には人間の member だけを記載し、`members[].type` は `human` とします。
- 実行可能な agent は `.specdojo/agent-members.yaml` を正本とし、`pm-members.yaml` に複製しません。
- Member は実行主体、Role code は責務を表します。Schedule の `owner` には member nickname を書きません。
- `members[].roles` には `pm-roles.yaml` に存在する Role code だけを記載します。
- 公開文書には、不要な個人名、私用メールアドレス、非公開組織情報、アクセス情報を記載しません。
- 人間の最終承認、公開可否、説明責任は agent 定義へ移しません。

## 2. 位置づけと用語定義

| 情報                          | 正本                           | 粒度       |
| ----------------------------- | ------------------------------ | ---------- |
| 人間の identity・連絡先・兼務 | `pm-members.yaml`              | project    |
| agent の identity・選択属性   | `.specdojo/agent-members.yaml` | repository |
| provider の起動コマンド       | `.specdojo/exec-defaults.yaml` | repository |
| Role code と責務              | `pm-roles.yaml`                | project    |
| Schedule の主責任             | Schedule の `owner`            | task       |

`loadMemberRoster` は人間名簿と agent 定義を schema 検証した後に合成します。合成後の nickname は一意でなければならず、`--by` と実行イベントはこの合成名簿を参照します。

## 3. ファイル命名・ID規則

- ファイル名は `pm-members.yaml` とします。
- 配置は `docs/ja/projects/<project-id>/030-project-management/pm-members.yaml` を推奨します。
- `id` は `<project-id>:pm-members`、`project_id` は配置先 project ID と一致させます。
- `members[].nickname` は英小文字または数字で始め、英小文字、数字、ハイフン、アンダースコアだけを使います。
- 実行ログへ記録済みの nickname は変更せず、交代時は新しい member を追加します。
- 同じ nickname を `.specdojo/agent-members.yaml` に定義しません。

## 4. 推奨メタ項目

| 項目         | 必須 | 内容                             |
| ------------ | ---- | -------------------------------- |
| `id`         | ○    | `<project-id>:pm-members`        |
| `type`       | ○    | `project`                        |
| `status`     | ○    | `draft` / `ready` / `deprecated` |
| `title`      | ○    | 名簿の表示名                     |
| `rulebook`   | ○    | `specdojo:pm-members-rulebook`   |
| `based_on`   | 任意 | 根拠文書 ID                      |
| `version`    | ○    | 1 以上のデータ版                 |
| `project_id` | ○    | 対象 project ID                  |

schema にないメタ項目は追加しません。成果物の `status` は作成中は `draft` とし、`ready` への変更は人間が判断します。

## 5. 本文要件

| 要素      | 必須 | 内容                                  |
| --------- | ---- | ------------------------------------- |
| `members` | ○    | 人間 member の配列                    |
| `rules`   | 任意 | 名簿利用時の project 固有の運用ルール |

`members[]` は次のフィールドを使用します。

| フィールド           | 必須 | 内容                                                      |
| -------------------- | ---- | --------------------------------------------------------- |
| `nickname`           | ○    | CLI と履歴で使う安定識別子                                |
| `display_name`       | ○    | 公開可能な表示名                                          |
| `email`              | 任意 | 公開可能な連絡先。不要または非公開なら `null`             |
| `roles`              | ○    | 対応可能な Role code の配列                               |
| `type`               | ○    | `human` 固定                                              |
| `persona`            | 任意 | 作業姿勢を示す短いラベル                                  |
| `focus`              | 任意 | 重視する観点の配列                                        |
| `scheduler_strategy` | 任意 | `critical-first` / `dependency-first` / `fifo` / `manual` |
| `note`               | 任意 | 稼働条件や最終判断範囲などの公開可能な補足                |

## 6. 記述ガイド

### 6.1. 人間 member

- 個人名を必要としない場合は、`po` や `store-owner` のような役割ベースの nickname と表示名を使います。
- `roles` は兼務を表し、責務定義そのものは `pm-roles.yaml` に委ねます。
- 最終判断、公開可否、説明責任を担う範囲は `note` に短く記載します。
- 連絡先を公開できない場合は推測で補わず `email: null` とします。

### 6.2. 合成名簿との整合

- nickname が `.specdojo/agent-members.yaml` と重複しないことを確認します。
- `--by` に人間または agent の nickname を指定する場合、合成名簿に一意に存在する値を使います。
- `pm-members.yaml` に `type: agent` が残る場合は、`specdojo config migrate-members --dry-run` で移行内容を確認します。
- agent の追加・優先度・能力変更は、保護設定を変更できる人間または orchestrator が行います。

### 6.3. 運用ルール

- `rules` には `owner`、`roles`、`--by` の使い分けを判定可能な文として記載します。
- project 固有の公開制約や交代時の扱いだけを記載し、共通 schema を再掲しません。
- agent の provider、モデル、起動 command は記載しません。
- 名簿の変更理由は project の変更管理記録に残します。

## 7. 禁止事項

| 禁止事項                                               | 理由                                     |
| ------------------------------------------------------ | ---------------------------------------- |
| `type: agent` の member を記載する                     | 保護設定との責務境界が崩れるため         |
| `provider`、`command`、`mode`、`stage_role` を記載する | agent 実行設定を成果物から変更できるため |
| Schedule の `owner` に nickname や人名を書く           | 責務と実行主体を混同するため             |
| 未定義の Role code を `roles` に書く                   | ロール正本との整合が失われるため         |
| 実行ログ記録後の nickname を変更する                   | 履歴の参照先が不明になるため             |
| 秘密情報、私用連絡先、非公開組織情報を記載する         | 公開適性と安全性を損なうため             |
