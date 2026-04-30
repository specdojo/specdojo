---
id: instruction-metadata-standard
type: meta
status: draft
---

# Instruction メタ情報標準

Instruction Metadata Standard

`*-instruction.md` の Frontmatter 記述ルールを定義します。

## 1. 適用範囲

- 対象: `docs/ja/handbook/instructions/` 配下の `*-instruction.md`
- 共通原則の正本: [document-metadata-standard.md](document-metadata-standard.md)
- 参照スキーマ: [docs/shared/schemas/instruction-frontmatter.schema.yaml](../../../../shared/schemas/instruction-frontmatter.schema.yaml)

## 2. 必須項目

| 項目     | 説明                        |
| -------- | --------------------------- |
| id       | ドキュメントID              |
| type     | `instruction` 固定          |
| status   | ドキュメント状態            |
| rulebook | 対応する `*-rulebook` の ID |

## 3. 推奨項目

| 項目       | 説明         |
| ---------- | ------------ |
| supersedes | 置き換え関係 |

補足:

- instruction は対応する rulebook を根拠に作成するため、`rulebook: <name>-rulebook` を使用する。
- 例外的に、対応 rules がない instruction は `rulebook: none` を使用する。

## 4. 値制約

- `id` は `^[a-z0-9][a-z0-9-]*$` に一致する。
- `status` は `draft` / `ready` / `deprecated` に限定する。
- `type` は `instruction` 固定とする。

## 5. 記述例

```yaml
---
id: imp-business-instruction
type: instruction
status: draft
rulebook: imp-business-rulebook
based_on: []
supersedes: []
---
```

## 6. バリデーション

- `npm run -s lint:md` で Markdown を検証する。
- スキーマ検証を行う場合は `instruction-frontmatter.schema.yaml` を使用する。
