---
id: pm-roles-rulebook
type: rulebook
status: draft
target_format: yaml
based_on:
  - people-and-organization-definition-standard
---

# プロジェクトロール定義 作成ルール

Project Role Definition Documentation Rulebook

本ドキュメントは、`pm-roles.yaml` を一貫した構造で作成・更新するためのルールを定義する。`pm-roles.yaml` は、プロジェクトで使用する全 Role code の machine-readable な一覧であり、Schedule の `owner` として使用できる Role code の語彙を定義する。兼務の割り当ては `pm-members.yaml` の `roles` フィールドで管理する。

## 1. 全体方針

- `pm-roles.yaml` には、プロジェクトで使用する全 Role code を記載する。現時点で担当メンバーが存在しないロールも含めてよい。
- Role code の共通定義・責務・規模別パターンは `people-and-organization-definition-standard` を参照し、本ファイルに再掲しない。
- 兼務の割り当ては `pm-members.yaml` の `roles` フィールドで管理し、本ファイルに記載しない。
- ロール採用の方針・根拠は `pm-organization.md` を参照し、本ファイルに重複して記載しない。
- `pm-roles.yaml` の `roles[].code` は、Schedule の `owner` および `pm-members.yaml` の `members[].roles` で使用できる Role code の語彙一覧として機能する。

## 2. 位置づけと用語定義

`pm-roles.yaml` は、ロール定義の YAML 成果物として次の位置に置かれる。

| ドキュメント                                     | 役割                                                                 |
| ------------------------------------------------ | -------------------------------------------------------------------- |
| `people-and-organization-definition-standard.md` | Role code の共通定義・責務・規模別パターンを定義する                 |
| `pm-organization.md`                             | ロール・メンバー構成の方針と設計根拠を記述する                       |
| `pm-roles.yaml`                                  | 採用した Role code を machine-readable な YAML として一覧化する      |
| `pm-members.yaml`                                | 実行主体と対応する Role code の対応を管理する                        |

## 3. ファイル命名・ID規則

- ファイル名は `pm-roles.yaml` を推奨する。
- 配置先は `pm-organization.md`、`pm-members.yaml`、`pm-raci.md` と同じ組織定義ディレクトリに置く。
- 推奨パス: `docs/ja/projects/<project-id>/030-project-management/020-organization/pm-roles.yaml`
- `project_id` は配置先プロジェクト ID と一致させる。例: `prj-0001`
- `document.id` は `<project-id>:pm-roles` 形式を推奨する。例: `prj-0001:pm-roles`

## 4. 推奨メタ項目

YAML 成果物のため、Markdown Frontmatter ではなく先頭の `document` ブロックとして記載する。

| 項目                | 説明                             | 必須 |
| ------------------- | -------------------------------- | ---- |
| `version`           | データバージョン                 | ○    |
| `project_id`        | プロジェクト ID                  | ○    |
| `document.id`       | 成果物 ID                        | ○    |
| `document.type`     | `project` 固定                   | ○    |
| `document.status`   | `draft` / `ready` / `deprecated` | ○    |
| `document.based_on` | 根拠ドキュメント ID の配列       | 任意 |

## 5. 本文構成（標準テンプレ）

`pm-roles.yaml` は次のルート構造を標準とする。

| 要素         | 必須 | 内容             |
| ------------ | ---- | ---------------- |
| `version`    | ○    | データバージョン |
| `project_id` | ○    | プロジェクト ID  |
| `document`   | ○    | 成果物メタ情報   |
| `roles`      | ○    | 全 Role の配列   |

`roles[]` は次のフィールドを標準とする。

| フィールド     | 必須 | 内容                                                                                       |
| -------------- | ---- | ------------------------------------------------------------------------------------------ |
| `code`         | ○    | Role code。`people-and-organization-definition-standard` で定義された標準 Role code を使う |
| `name`         | ○    | Role の正式名称                                                                            |
| `project_note` | 任意 | プロジェクト固有の扱いを 1 行で記述する                                                    |

## 6. 記述ガイド

### 6.1. `roles`

- `roles` にはプロジェクトで使用する全 Role code を記載する。
- 記載順は標準ロールの定義順（`PO`, `PM`, `BA`, `ARC`, `DEV`, `QE`, `UX`, `OPS`）に揃えることを推奨する。
- `people-and-organization-definition-standard` で定義された標準 Role code のみを使用する。

### 6.2. `roles[].code`

- `code` には `people-and-organization-definition-standard` で定義された標準 Role code のみを使用する。
- プロジェクト固有の独自 Role code を定義しない。

### 6.3. `roles[].project_note`

- プロジェクト固有の責務強調、現時点での兼務状況（誰が担当するか）、将来の追加条件を 1 行で記述する。
- 標準に記載済みの一般的な責務を再掲しない。
- 記載すべき内容がない場合は省略してよい。

## 7. 禁止事項

| 禁止事項                                                                        | 理由                                                                             |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `people-and-organization-definition-standard` 未定義の独自 Role code を追加する | 標準との整合が取れなくなるため                                                   |
| 兼務の割り当てを本ファイルに記載する                                            | `pm-members.yaml` の `roles` フィールドの責務であり重複になるため                |
| ロール採用の根拠・方針を本ファイルに長く記載する                                | `pm-organization.md` の責務であり重複になるため                                  |

## 8. サンプル

- 参照: `../samples/pm-roles-sample.yaml`

## 9. 生成 AI への指示テンプレート

- 参照: `../instructions/pm-roles-instruction.md`
