---
specdojo:
  id: specdojo:pm-members-rulebook
  type: rulebook
  deliverable_type: project
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

`pm-members.yaml` に人間の実行主体と対応 Role code を定義する基準です。

## 1. 全体方針

- 対象は project の人間名簿です。agent の実行定義は含めません。
- Role・Member・`owner` の区別と公開情報の扱いは [[specdojo:people-and-organization-definition-standard|人と組織の定義標準]] に従います。
- **共通の運用**: 役割の割り当ては適用先のメンバー定義に、`status`・承認・改訂と廃止・未決事項の引き継ぎは [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] に従います。文書の整形・lint はリポジトリの検証で扱います。

## 2. 位置づけと用語定義

| 情報                          | 正本                           |
| ----------------------------- | ------------------------------ |
| 人間の identity・連絡先・兼務 | project の `pm-members.yaml`   |
| agent の identity・選択属性   | `.specdojo/agent-members.yaml` |
| provider の起動コマンド       | `.specdojo/exec-defaults.yaml` |

## 3. ファイル命名・ID規則

- ファイル名は `pm-members.yaml`、推奨配置は `docs/ja/projects/<project-id>/030-project-management/` です。
- `id` は `<project-id>:pm-members`、`project_id` は配置先 project ID と一致させます。
- `members[].nickname` は1〜63文字、先頭は英小文字か数字、以降は英小文字・数字・`_`・`-` とします。

## 4. 推奨メタ項目

許可キーと型は `docs/specdojo/schemas/v1/pm-members.schema.yaml` を正本とし、メタ項目はルートに置きます。

| 項目         | 必須 | 内容                             |
| ------------ | ---- | -------------------------------- |
| `id`         | ○    | `<project-id>:pm-members`        |
| `type`       | ○    | `project`                        |
| `status`     | ○    | `draft` / `ready` / `deprecated` |
| `title`      | ○    | 名簿の表示名                     |
| `rulebook`   | ○    | `specdojo:pm-members-rulebook`   |
| `based_on`   | 任意 | 根拠文書 ID の配列               |
| `supersedes` | 任意 | 置き換える旧文書 ID の配列       |
| `version`    | ○    | 1 以上の整数                     |
| `project_id` | ○    | 対象 project ID                  |

## 5. 本文要件

| 要素      | 必須 | 内容                                  |
| --------- | ---- | ------------------------------------- |
| `members` | ○    | 人間 member の配列                    |
| `rules`   | 任意 | 名簿利用時の project 固有の運用ルール |

`members[]` の必須性は対応 schema を優先します。上位の人と組織の定義標準では任意の `roles` も、本形式では必須です。

| フィールド           | 必須 | 内容                                                      |
| -------------------- | ---- | --------------------------------------------------------- |
| `nickname`           | ○    | CLI と履歴で使う安定識別子                                |
| `display_name`       | ○    | 公開可能な表示名                                          |
| `email`              | 任意 | 公開可能な連絡先または `null`                             |
| `roles`              | ○    | `pm-roles.yaml` に存在する Role code の重複なし配列       |
| `type`               | ○    | `human` 固定                                              |
| `persona`            | 任意 | 作業姿勢を示す短いラベル                                  |
| `focus`              | 任意 | 重視する観点の配列                                        |
| `scheduler_strategy` | 任意 | `critical-first` / `dependency-first` / `fifo` / `manual` |
| `note`               | 任意 | 稼働条件や最終判断範囲などの公開可能な補足                |

## 6. 記述ガイド

### 6.1. 人間 member

- 個人名を必要としない場合は、`po` や `store-owner` のような役割ベースの nickname と表示名を使います。
- 兼務は `roles: [PO, BA]` のように記載します。
- 連絡先を公開できない場合は推測で補わず `email: null` とします。

### 6.2. 合成名簿との整合

- 人間名簿と agent 定義の合成後、全 nickname が一意であり、`--by`・実行イベントが登録値を使うことを照合します。
- `pm-members.yaml` に `type: agent` が残る場合は、`.specdojo/agent-members.yaml` へ手作業で移します。

### 6.3. 運用ルール

- `rules` は project 固有の公開制約や交代時の扱いに限定し、共通標準・schema を再掲しません。

## 7. 禁止事項

| 禁止事項                                                         | 理由                                     |
| ---------------------------------------------------------------- | ---------------------------------------- |
| `type: agent` の member を記載する                               | 保護設定との責務境界が崩れるため         |
| `provider`、`command`、`mode`、`stage_role` を記載する           | agent 実行設定を成果物から変更できるため |
| 実行ログ記録後の nickname を変更する（交代時は新 member を追加） | 履歴の参照先が不明になるため             |
