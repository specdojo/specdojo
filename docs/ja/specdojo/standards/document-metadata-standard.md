---
id: document-metadata-standard
type: standard
status: draft
---

# ドキュメントメタ情報標準

Document Metadata Standard

## 1. 目的

本書は、Frontmatter ルールの共通原則のみを定義するハブです。各ドキュメント種別の詳細ルールは、以下のファイルを正とします。

- 成果物（deliverable）: [deliverable-metadata-standard.md](deliverable-metadata-standard.md)
- rulebook: [rulebook-authoring-standard.md](rulebook-authoring-standard.md) の `Frontmatter 規約`
- recipe: [recipe-authoring-standard.md](recipe-authoring-standard.md) の `Frontmatter 規約`
- standard: [docs/specdojo/schemas/v1/standard-frontmatter.schema.yaml](../../../specdojo/schemas/v1/standard-frontmatter.schema.yaml)

## 2. 共通原則

- Markdown はファイル先頭に YAML Frontmatter を置く。
- `id` / `type` / `status` は全種別で必須とする。
- `id` は `^[a-z0-9][a-z0-9-]*$` に一致させる。
- `type` は各ドキュメント種別の専用スキーマに定義された値を使用する（[deliverable-metadata-standard.md](deliverable-metadata-standard.md) 参照）。
- `status` は `draft` / `ready` / `deprecated` のいずれかとする。
- ドキュメント名は Frontmatter ではなく本文先頭の H1 に記述する。
