---
id: pm-roles-instruction
type: instruction
status: draft
rulebook: pm-roles-rulebook
---

# プロジェクトロール定義 作成指示

## 1. 目的と前提

- 目的: プロジェクトで採用する Role code を machine-readable な YAML 一覧として定義し、Schedule の `owner` および `pm-members.yaml` の `members[].role` の参照基準とする。
- 参照ルール: `../rulebooks/pm-roles-rulebook.md`
- 主な内容: 採用 Role code の一覧（`code`・`name`・`project_note`）。
- 未採用ロールの理由・代替方針は `pm-organization.md` に記載し、本ファイルには含めない。
- Role code の共通定義・責務は `people-and-organization-definition-standard` に委ね、再掲しない。

## 2. 入力情報

- `pm-organization.md` に記載されている採用ロール一覧（`code` / 正式名称 / プロジェクトでの扱い）
- プロジェクト ID（`project_id` に使用）
- プロジェクト固有の責務強調・兼務内容・運用注意事項（`project_note` として記載）

## 3. 出力フォーマット

- 出力形式は YAML（`pm-roles.yaml`）。
- ファイル先頭に `version`、`project_id`、`document` ブロックを置く。

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
```

- `roles` には採用 Role code のみを次の構造で記載する。

```yaml
roles:
  - code: PO
    name: Project Owner
    project_note: <プロジェクト固有の扱い（1行）>
```

- `roles` の記載順は標準ロールの定義順（`PO` → `PM` → `BA` → `ARC` → `DEV` → `QE` → `UX` → `OPS`）に揃える。

## 4. 記述ルール

- `roles[].code` は `people-and-organization-definition-standard` で定義された標準 Role code（`PO`, `PM`, `BA`, `ARC`, `DEV`, `QE`, `UX`, `OPS`）のみを使う。独自 Role code は追加しない。
- `roles[].code` の一覧は `pm-organization.md` の採用ロールと一致させる。
- `roles[].project_note` には、標準責務の再掲ではなく、プロジェクト固有の強調点・兼務・注意事項を 1 行で記述する。記載すべき内容がない場合は省略する。
- コメント行（`#`）は最小限に留め、ファイル先頭またはセクション境界にのみ配置する。

## 5. 禁止事項

- 未採用ロールを `roles` に含める（`pm-organization.md` との不整合を招く）。
- `people-and-organization-definition-standard` 未定義の独自 Role code を追加する。
- 未採用ロールの理由・代替方針を本ファイルに記載する（`pm-organization.md` の責務）。
- `roles[].code` に設定した Role code を Schedule の `owner` に一切使わないまま定義する。

## 6. 最終チェック

- `roles` の `code` 一覧が `pm-organization.md` の採用ロールと一致している。
- `roles[].code` がすべて標準 Role code の範囲内である。
- 未採用ロールが `roles` に含まれていない。
- `document.based_on` に `people-and-organization-definition-standard` と `<project-id>:pm-organization` が含まれている。
- YAML 構文エラーがない。
