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
- rulebook: [rulebook-metadata-standard.md](rulebook-metadata-standard.md)
- instruction: [instruction-metadata-standard.md](instruction-metadata-standard.md)
- standard: [docs/shared/schemas/standard-frontmatter.schema.yaml](../../../../shared/schemas/standard-frontmatter.schema.yaml)

## 2. 共通原則

- Markdown はファイル先頭に YAML Frontmatter を置く。
- `id` / `type` / `status` は全種別で必須とする。
- `id` は `^[a-z0-9][a-z0-9-]*$` に一致させる。
- `type` は [docs/shared/schemas/common-frontmatter.schema.yaml](../../../../shared/schemas/common-frontmatter.schema.yaml) の `documentType` に定義された種別を使用する。
- `status` は `draft` / `ready` / `deprecated` のいずれかとする。
- ドキュメント名は Frontmatter ではなく本文先頭の H1 に記述する。
