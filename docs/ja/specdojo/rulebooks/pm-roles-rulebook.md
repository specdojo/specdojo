---
id: pm-roles-rulebook
type: rulebook
status: ready
target_format: yaml
recipe: pm-roles-recipe
sample: pm-roles-sample
template: pm-roles-template
based_on:
  - people-and-organization-definition-standard
---

# プロジェクトロール定義 作成ルール

Project Role Definition Documentation Rulebook

本ドキュメントは、`pm-roles.yaml` を一貫した構造で作成・更新するためのルールを定義する。`pm-roles.yaml` は、プロジェクトで使用する全 Role code の machine-readable な一覧であり、Schedule の `owner` や RACI の列として使用できる責務語彙を定義する。実行主体と兼務の割り当ては `pm-members.yaml` の `members[].roles` で管理する。

## 1. 全体方針

- `pm-roles.yaml` には、プロジェクトで使用する全 Role code を記載する。現時点で専任 member が存在しない Role code も、Schedule の `owner` 語彙として必要なら含める。
- 標準 Role code は `PO`, `PM`, `BA`, `ARC`, `DEV`, `QE`, `UX`, `OPS` を基本セットとし、プロジェクト内で採用する責務語彙をこの集合から選ぶ。
- Role code の共通定義・責務・規模別パターンは上位標準を参照し、本ファイルに再掲しない。
- 兼務の割り当て、member nickname、agent 名、個人名は `pm-members.yaml` で管理し、本ファイルに記載しない。
- ロール採用の方針・根拠、最終判断の集約先、見直し条件は `pm-organization.md` を参照し、本ファイルに重複して記載しない。
- `pm-roles.yaml` の `roles[].code` は、Schedule の `owner` および `pm-members.yaml` の `members[].roles` で使用できる Role code の語彙一覧として機能する。
- PO が全 Role code とプロジェクト固有メモを承認できるよう、各 `project_note` は公開可能な内容だけで簡潔に記載する。
- AI Agent が作成・検証を支援する場合でも、最終判断、公開可否、説明責任は人間の PO に残す前提で記載する。

## 2. 位置づけと用語定義

`pm-roles.yaml` は、ロール定義の YAML 成果物として次の位置に置かれる。

| 文書                 | 役割                                                            | 正本とする内容                                   |
| -------------------- | --------------------------------------------------------------- | ------------------------------------------------ |
| `pm-organization.md` | ロール・メンバー構成の方針と設計根拠を記述する                  | 採用方針、最終判断の集約先、見直し条件           |
| `pm-roles.yaml`      | 採用した Role code を machine-readable な YAML として一覧化する | `owner` 語彙、Role code 名、プロジェクト固有メモ |
| `pm-members.yaml`    | 実行主体と対応する Role code の対応を管理する                   | member nickname、agent、人間、兼務割り当て       |
| `pm-raci.md`         | 必要時の責任分担を記述する                                      | 成果物・プロセスごとの責任分担                   |

用語は次のように使い分ける。

| 用語         | 意味                                                   | `pm-roles.yaml` での扱い                 |
| ------------ | ------------------------------------------------------ | ---------------------------------------- |
| Role code    | 責務・判断権限・専門性を表す短い識別子                 | `roles[].code` に列挙する                |
| Role name    | Role code の正式名称                                   | `roles[].name` に記載する                |
| Project note | 当該プロジェクトでの扱い、専任化条件、公開判断上の注意 | `roles[].project_note` に 1 行で記載する |

## 3. ファイル命名・ID規則

- ファイル名は `pm-roles.yaml` を推奨する。
- 配置先は `pm-organization.md`、`pm-members.yaml`、`pm-raci.md` と同じ組織定義ディレクトリに置く。
- 推奨パス: `docs/ja/projects/<project-id>/030-project-management/020-organization/pm-roles.yaml`
- `project_id` は配置先プロジェクト ID と一致させる。例: `prj-0001`
- `id` は `<project-id>:pm-roles` 形式を推奨する。例: `prj-0001:pm-roles`
- `roles[].code` は標準 Role code の表記に合わせ、大文字の短いコードにする。例: `PO`, `PM`, `BA`

## 4. 推奨メタ項目

YAML 成果物のため、Markdown Frontmatter ではなく YAML 先頭のメタ項目として記載する。
機械検証は `docs/specdojo/schemas/v1/pm-roles.schema.yaml` を正本とする。

| 項目         | 説明                                    | 必須 |
| ------------ | --------------------------------------- | ---- |
| `id`         | `<project-id>:pm-roles` 形式の成果物 ID | ○    |
| `type`       | `project` 固定                          | ○    |
| `status`     | `draft` / `ready` / `deprecated`        | ○    |
| `based_on`   | 根拠ドキュメント ID の配列              | 任意 |
| `version`    | データバージョン。初期値は `1`          | ○    |
| `project_id` | プロジェクト ID                         | ○    |

`rulebook` など schema に定義されていないメタ項目は `pm-roles.yaml` には追加しない。参照する rulebook は成果物カタログや計画側で管理する。

## 5. 本文構成（標準テンプレ）

`pm-roles.yaml` は次のルート構造を標準とする。

| 要素         | 必須 | 内容             |
| ------------ | ---- | ---------------- |
| `id`         | ○    | 成果物 ID        |
| `type`       | ○    | 成果物種別       |
| `status`     | ○    | 成果物状態       |
| `based_on`   | 任意 | 根拠 ID 配列     |
| `version`    | ○    | データバージョン |
| `project_id` | ○    | プロジェクト ID  |
| `roles`      | ○    | 全 Role の配列   |

`roles[]` は次のフィールドを標準とする。

| フィールド     | 必須 | 内容                                                                  |
| -------------- | ---- | --------------------------------------------------------------------- |
| `code`         | ○    | Role code。標準 Role code を使う                                      |
| `name`         | ○    | Role の正式名称                                                       |
| `project_note` | 任意 | プロジェクト固有の扱い、専任化条件、公開判断上の注意を 1 行で記述する |

## 6. 記述ガイド

### 6.1. `roles`

- `roles` にはプロジェクトで使用する全 Role code を過不足なく記載する。
- 記載順は標準ロールの定義順（`PO`, `PM`, `BA`, `ARC`, `DEV`, `QE`, `UX`, `OPS`）に揃えることを推奨する。
- 標準 Role code のみを使用し、プロジェクト固有の独自コードを追加しない。
- `roles[].code` は重複させない。
- 専任 member がいない Role code でも、Schedule の `owner`、RACI、レビュー観点、下流文書で責務語彙として使う場合は残す。

### 6.2. `roles[].code`

- `code` には標準 Role code のみを使用する。
- プロジェクト固有の独自 Role code を定義しない。
- 小文字、member nickname、agent 名、個人名、stakeholder ID を `code` にしない。
- Schedule の `owner` や RACI の列で使う値と同じ表記にする。

### 6.3. `roles[].name`

- `name` には Role code の正式名称を記載する。
- 略称だけ、プロジェクト固有の担当者名、組織内の職位名に置き換えない。
- Role code と対応が分かる一般的な英語名を使う。

### 6.4. `roles[].project_note`

- プロジェクト固有の責務強調、専任化を検討する条件、公開判断上の注意を 1 行で記述する。
- 標準に記載済みの一般的な責務を長く再掲しない。
- member nickname、agent 名、個人名、具体的な兼務割り当ては書かない。
- PO が承認、保留、差し戻しを判断できるよう、未決事項がある場合は `_UNDECIDED_:` または `_TODO_:` として残す。
- 公開文書として再利用できる粒度にし、個別組織の内部事情や非公開運用を含めない。
- 記載すべき内容がない場合は省略してよい。

## 7. 禁止事項

| 禁止事項                                                                   | 理由                                                |
| -------------------------------------------------------------------------- | --------------------------------------------------- |
| 標準にない独自 Role code を追加する                                        | Schedule、RACI、member 定義との接続が壊れるため     |
| `roles[].code` に member nickname、agent 名、個人名、stakeholder ID を書く | Role と実行主体が混同されるため                     |
| 兼務の割り当てや実行主体を本ファイルに記載する                             | `pm-members.yaml` の責務であり重複管理になるため    |
| ロール採用の根拠・方針・見直し条件を長く記載する                           | `pm-organization.md` の責務であり重複管理になるため |
| 公開できない個人情報、連絡先、非公開組織情報、アクセス情報を記載する       | PO の公開可否判断と説明責任を損なうため             |
| AI Agent に最終承認、公開可否、説明責任を持たせる記述を置く                | 人間の PO が最終判断を担う前提に反するため          |
| schema にない任意メタ項目を追加する                                        | 機械検証と下流処理の互換性が壊れるため              |

## 8. サンプル

- 参照先: [pm-roles-sample](../samples/pm-roles-sample.yaml)

## 9. 作成レシピ

- 参照: [[pm-roles-recipe|ロール定義 作成レシピ]]

## 10. テンプレート

- 参照: [[pm-roles-template|ロール定義 template]]
