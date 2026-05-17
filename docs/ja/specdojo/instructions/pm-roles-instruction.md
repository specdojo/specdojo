---
id: pm-roles-instruction
type: instruction
status: draft
rulebook: pm-roles-rulebook
---

# プロジェクトロール定義 作成指示

## 1. 目的と前提

- 生成対象は `pm-roles.yaml` とする。
- 目的は、プロジェクトで使用する全 Role code を machine-readable な YAML として一覧化し、Schedule の `owner` および `pm-members.yaml` の `members[].roles` で使用できる語彙を定義することとする。
- 参照ルールは [pm-roles-rulebook.md](../rulebooks/pm-roles-rulebook.md) とし、Role code の共通定義・責務・規模別パターンは `people-and-organization-definition-standard` を正として扱う。
- 兼務の割り当ては `pm-members.yaml` の `members[].roles` で管理し、本ファイルには記載しない。
- ロール採用の方針・根拠は `pm-organization.md` に委ね、本ファイルには重複して記載しない。
- 対象外は、未採用ロールの理由、代替方針、member への割り当て、RACI の責任分担とする。

## 2. 入力情報

- プロジェクト ID。
- プロジェクトで使用する Role code 一覧。現時点で担当 member が存在しないロールも、Schedule の `owner` や将来の責務分担で使うなら含める。
- 各 Role code の正式名称。
- 各 Role code のプロジェクト固有の扱い、責務強調、将来の追加条件など、`project_note` に 1 行で記述できる補足。
- `pm-organization.md` に記載されたロール・メンバー構成の設計根拠。
- 未確定事項は `_TODO_:`, `_UNDECIDED_:`, `_ASSUMPTION_:` のいずれかで明示する。

## 3. 出力フォーマット

- 出力形式は YAML とし、ファイル名は `pm-roles.yaml` を基本とする。
- ファイル先頭に `version`、`project_id`、`document`、`roles` を置く。
- YAML 成果物のため Markdown Frontmatter は使わず、先頭の `document` ブロックとしてメタ情報を記述する。

```yaml
version: 1
project_id: <project-id>
document:
  id: <project-id>:pm-roles
  type: project
  status: draft
  based_on:
    - people-and-organization-definition-standard
    - <project-id>:pm-organization
roles:
  - code: PO
    name: Project Owner
    project_note: <プロジェクト固有の扱い（任意・1行）>
```

- `roles[]` は次のフィールドを標準とする。

| フィールド | 必須 | 記述内容 |
| ---------- | ---- | -------- |
| `code` | ○ | Role code。`people-and-organization-definition-standard` で定義された標準 Role code を使う |
| `name` | ○ | Role の正式名称 |
| `project_note` | 任意 | プロジェクト固有の扱いを 1 行で記述する |

- `roles` の記載順は標準ロールの定義順（`PO` → `PM` → `BA` → `ARC` → `DEV` → `QE` → `UX` → `OPS`）に揃える。

## 4. 記述ルール

- `roles` にはプロジェクトで使用する全 Role code を記載する。現時点で担当 member が存在しないロールも、プロジェクトで使用するなら含めてよい。
- `roles[].code` は `people-and-organization-definition-standard` で定義された標準 Role code（`PO`, `PM`, `BA`, `ARC`, `DEV`, `QE`, `UX`, `OPS`）のみを使う。
- プロジェクト固有の独自 Role code は追加しない。
- `roles[].name` は標準にある正式名称と整合させる。
- `roles[].project_note` には、プロジェクト固有の責務強調、現時点での兼務状況、将来の追加条件、運用上の注意を 1 行で記述する。標準に記載済みの一般責務は再掲しない。
- `project_note` に記載すべきプロジェクト固有の補足がない場合は省略してよい。
- 兼務の具体的な割り当て、member nickname、人名、agent 名は `pm-members.yaml` に委ねる。
- ロール採用の長い根拠や未採用ロールの代替方針は `pm-organization.md` に委ねる。
- コメント行（`#`）は最小限に留め、ファイル先頭またはセクション境界に限定する。
- 章への参照は章番号ではなく章タイトルで記載する。

## 5. 禁止事項

- `people-and-organization-definition-standard` 未定義の独自 Role code を追加しない。
- 兼務の割り当て、member nickname、人名、agent 名を本ファイルに記載しない。
- ロール採用の根拠・方針を長く記載しない。
- 未採用ロールの理由・代替方針を本ファイルに記載しない。
- 標準に記載済みの一般的な責務を `project_note` に再掲しない。
- Schedule の `owner` や `pm-members.yaml` の `members[].roles` で使う予定の Role code を `roles` から漏らさない。

## 6. 最終チェック

- `version`、`project_id`、`document`、`roles` がある。
- `document.id` が `<project-id>:pm-roles` 形式である。
- `document.type` が `project`、`document.status` が `draft` / `ready` / `deprecated` のいずれかである。
- `document.based_on` に `people-and-organization-definition-standard` と `<project-id>:pm-organization` が含まれている。
- `roles[].code` がすべて標準 Role code の範囲内である。
- `roles` の記載順が標準ロールの定義順に揃っている。
- 兼務の具体的な割り当て、member nickname、人名、agent 名が含まれていない。
- `project_note` が標準責務の再掲ではなく、プロジェクト固有の補足になっている。
- YAML 構文エラーがない。
