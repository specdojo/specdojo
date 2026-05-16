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

本ドキュメントは、`pm-roles.yaml` を一貫した構造で作成・更新するためのルールを定義する。`pm-roles.yaml` は、プロジェクトで採用した Role code の machine-readable な一覧であり、`pm-organization.md` の採用判断を YAML で表現したものである。

## 1. 全体方針

- `pm-roles.yaml` には、プロジェクトで採用した Role code だけを記載する。
- Role code の共通定義・責務・規模別パターンは `people-and-organization-definition-standard` を参照し、本ファイルに再掲しない。
- 未採用ロールと `owner` 利用ルールは `pm-organization.md` を参照し、本ファイルに重複して記載しない。
- `pm-roles.yaml` の `roles[].code` は、Schedule の `owner` および `pm-members.yaml` の `members[].role` で使用できる Role code の正当な一覧として機能する。

## 2. 位置づけと用語定義

`pm-roles.yaml` は、ロール定義の YAML 成果物として次の位置に置かれる。

| ドキュメント                                     | 役割                                                                 |
| ------------------------------------------------ | -------------------------------------------------------------------- |
| `people-and-organization-definition-standard.md` | Role code の共通定義・責務・規模別パターンを定義する                 |
| `pm-organization.md`                             | プロジェクト固有の採用判断、未採用理由、`owner` 利用ルールを記述する |
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
| `roles`      | ○    | 採用 Role の配列 |

`roles[]` は次のフィールドを標準とする。

| フィールド     | 必須 | 内容                                                                                       |
| -------------- | ---- | ------------------------------------------------------------------------------------------ |
| `code`         | ○    | Role code。`people-and-organization-definition-standard` で定義された標準 Role code を使う |
| `name`         | ○    | Role の正式名称                                                                            |
| `project_note` | 任意 | プロジェクト固有の扱いを 1 行で記述する                                                    |

## 6. 記述ガイド

### 6.1. `roles`

- `roles` には採用した Role code のみを記載する。未採用ロールは含めない。
- 記載順は標準ロールの定義順（`PO`, `PM`, `BA`, `ARC`, `DEV`, `QE`, `UX`, `OPS`）に揃えることを推奨する。
- `pm-organization.md` の採用ロール一覧と `roles[].code` の内容を一致させる。

### 6.2. `roles[].code`

- `code` には `people-and-organization-definition-standard` で定義された標準 Role code のみを使用する。
- プロジェクト固有の独自 Role code を定義しない。

### 6.3. `roles[].project_note`

- プロジェクト固有の責務強調、兼務内容、運用上の注意を 1 行で記述する。
- 標準に記載済みの一般的な責務を再掲しない。
- 記載すべき内容がない場合は省略してよい。

## 7. 禁止事項

| 禁止事項                                                                        | 理由                                                                                  |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 未採用ロールを `roles` に含める                                                 | `pm-organization.md` との整合が崩れ、Schedule の `owner` 検証が不正確になるため |
| `people-and-organization-definition-standard` 未定義の独自 Role code を追加する | 標準との整合が取れなくなるため                                                        |
| 未採用ロールの理由や代替方針を本ファイルに記載する                              | `pm-organization.md` の責務であり重複になるため                                       |
| `roles[].code` の値を Schedule の `owner` に使わないまま定義する          | 定義したロールは `owner` で使う前提のため、使わないなら定義しない                     |

## 8. サンプル

- 参照: `../samples/pm-roles-sample.yaml`

## 9. 生成 AI への指示テンプレート

- 参照: `../instructions/pm-roles-instruction.md`
