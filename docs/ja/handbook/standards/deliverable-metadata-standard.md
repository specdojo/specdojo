---
id: deliverable-metadata-standard
type: standard
status: draft
---

# 成果物メタ情報標準

Deliverable Metadata Standard

成果物ドキュメントの Frontmatter 記述ルールを定義します。本書は deliverable 系ドキュメントに適用します。

## 1. 適用範囲

- 対象: `project` / `screen` / `api` / `domain` / `data` / `test` / `flow` / `rule` / `architecture` / `decision` / `meta` / `guide` / `migration` / `operations` / `template`
- 共通原則の正本: [document-metadata-standard.md](document-metadata-standard.md)
- 参照スキーマ: [docs/shared/schemas/deliverable-frontmatter.schema.yaml](../../../../shared/schemas/deliverable-frontmatter.schema.yaml)

補足: `standard` は handbook 共通標準用の種別であり、[docs/shared/schemas/standard-frontmatter.schema.yaml](../../../../shared/schemas/standard-frontmatter.schema.yaml) を使用する。

## 2. 必須項目

| 項目     | 説明                    |
| -------- | ----------------------- |
| id       | ドキュメントID          |
| type     | ドキュメント種別        |
| status   | ドキュメント状態        |
| rulebook | 準拠する rulebook の ID |

補足:

- `rulebook` は `none` または `*-rulebook` 形式の ID を指定する。
- 該当する rules がない場合のみ `rulebook: none` を許可する。

## 3. 任意項目

| 項目       | 説明                        |
| ---------- | --------------------------- |
| part_of    | 一覧/親ドキュメントへの所属 |
| based_on   | 根拠ドキュメント            |
| supersedes | 置き換え対象ドキュメント    |

## 4. 値制約

- `id` は `^[a-z0-9][a-z0-9-]*$` に一致する。
- `status` は `draft` / `ready` / `deprecated` に限定する。
- 未定義プロパティは許可しない。
- 配列項目は重複を許可しない。

## 5. 記述例

```yaml
---
id: imp-business
type: project
status: draft
rulebook: imp-business-rulebook
part_of: []
based_on: []
supersedes: []
---
```

## 6. バリデーション

- `npm run -s lint:md` で Markdown を検証する。
- スキーマ検証を行う場合は `deliverable-frontmatter.schema.yaml` を使用する。
