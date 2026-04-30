---
id: rulebook-metadata-standard
type: meta
status: draft
---

# Rulebook メタ情報標準

Rulebook Metadata Standard

`*-rulebook.md` の Frontmatter 記述ルールを定義します。rulebook 系ドキュメントに適用します。

## 1. 適用範囲

- 対象: `docs/ja/handbook/rulebooks/` 配下の `*-rulebook.md`
- 共通原則の正本: [document-metadata-standard.md](document-metadata-standard.md)
- 参照スキーマ: [docs/shared/schemas/rulebook-frontmatter.schema.yaml](../../../../shared/schemas/rulebook-frontmatter.schema.yaml)

## 2. 必須項目

| 項目   | 説明                     |
| ------ | ------------------------ |
| id     | ドキュメントID           |
| type   | `rulebook` または `meta` |
| status | ドキュメント状態         |

## 3. 推奨項目

| 項目          | 説明                                   |
| ------------- | -------------------------------------- |
| target_format | ルールの対象ドキュメントのフォーマット |
| based_on      | 上位規約や根拠ドキュメント             |
| supersedes    | 置き換え関係                           |

補足:

- target_format は、ルールの対象となるドキュメントのフォーマットを指定する。例: `yaml` / `json` / `markdown`
- target_format が指定されていない場合はmarkdown形式を対象とするルールであると解釈する。

## 4. 値制約

- `id` は `^[a-z0-9][a-z0-9-]*$` に一致する。
- `status` は `draft` / `ready` / `deprecated` に限定する。
- `type` は `rulebook` または `meta` に限定する。

## 5. 記述例

```yaml
---
id: imp-business-rulebook
type: rulebook
status: draft
---
```

## 6. バリデーション

- `npm run -s lint:md` で Markdown を検証する。
- スキーマ検証を行う場合は `rulebook-frontmatter.schema.yaml` を使用する。
