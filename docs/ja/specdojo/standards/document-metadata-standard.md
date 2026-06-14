---
id: document-metadata-standard
type: standard
status: draft
---

# ドキュメントメタ情報標準

Document Metadata Standard

ドキュメントの Frontmatter に関する共通原則と、成果物ドキュメントの記述ルールを定義します。

## 1. 適用範囲

- 共通原則: Frontmatter を持つすべての Markdown ドキュメント
- 成果物向け詳細規約: `project` / `flow` / `rule` / `data` / `ui` / `api` / `architecture` / `test` / `operations` / `template` / `sample`
- 成果物スキーマ: [deliverable-frontmatter.schema.yaml](../../../specdojo/schemas/v1/deliverable-frontmatter.schema.yaml)

`rulebook` / `recipe` / `guide` / `standard` は専用スキーマを持つため、成果物向け詳細規約の対象外とします。それぞれの追加規約は次を正本とします。

- rulebook: [rulebook-authoring-standard.md](rulebook-authoring-standard.md) の `Frontmatter 規約`
- recipe: [recipe-authoring-standard.md](recipe-authoring-standard.md) の `Frontmatter 規約`
- guide: [guide-frontmatter.schema.yaml](../../../specdojo/schemas/v1/guide-frontmatter.schema.yaml)
- standard: [standard-frontmatter.schema.yaml](../../../specdojo/schemas/v1/standard-frontmatter.schema.yaml)

## 2. 共通原則

- Markdown はファイル先頭に YAML Frontmatter を置く。
- `id` / `type` / `status` は全種別で必須とする。
- `id` は共通スキーマの `idRef` に従い、`^[a-z0-9][a-z0-9-:]*$` に一致させる。
- `type` は各ドキュメント種別のスキーマに定義された値を使用する。
- `status` は `draft` / `ready` / `deprecated` のいずれかとする。
- ドキュメント名は Frontmatter ではなく本文先頭の H1 に記述する。

### 2.1. テンプレートのプレースホルダ

テンプレートでは、生成時に置換する値を `_UPPER_SNAKE_` 形式のプレースホルダで表現できます。ただし、`type: template` であることを理由に、すべての Frontmatter 項目や ID で大文字・アンダースコアを使用できるわけではありません。

- テンプレートファイル自身の `id` / `type` / `status` は実値で記述し、通常のメタ情報制約に従う。例: `id: dct-project-management-template`。
- プレースホルダは、個別スキーマが許可したフィールドだけで使用する。
- 個別スキーマがプレースホルダを許可していないフィールドでは、共通スキーマや成果物スキーマの通常の値制約を適用する。
- プレースホルダを置換して生成した成果物は、生成後のドキュメント種別に対応する通常のスキーマを満たさなければならない。

例えば [dct.schema.yaml](../../../specdojo/schemas/v1/dct.schema.yaml) は、テンプレートの `part_of` などで参照する `DocId` に大文字とアンダースコアを許可し、`local_id` では `_NNNN_` や `_TERM_` を含む値を許可しています。一方、生成後の project 文書には `StrictDocId` と kebab-case の `local_id` が適用されます。

```yaml
id: dct-project-management-template
type: template
status: draft
part_of:
  - _PRJ-0000_:dct-index
```

プレースホルダの命名と雛形での使い方は [template-authoring-standard.md](template-authoring-standard.md) を参照してください。

## 3. 成果物の必須項目

| 項目     | 説明                    |
| -------- | ----------------------- |
| id       | ドキュメント ID         |
| type     | ドキュメント種別        |
| status   | ドキュメント状態        |
| rulebook | 準拠する rulebook の ID |

- `rulebook` は `none` または `*-rulebook` 形式の ID を指定する。
- 該当する rulebook がない場合のみ `rulebook: none` を許可する。

## 4. 成果物の任意項目

| 項目       | 説明                        |
| ---------- | --------------------------- |
| part_of    | 一覧・親ドキュメントへの所属 |
| based_on   | 根拠ドキュメント            |
| supersedes | 置き換え対象ドキュメント    |

成果物種別によって追加項目を使用できる場合があります。正確な許可項目と型は成果物スキーマを正本とします。

## 5. 成果物の値制約

- `type` は `適用範囲` に列挙した成果物種別のいずれかとする。
- 未定義プロパティは使用しない。
- 配列項目は重複させない。
- 項目ごとの型、列挙値、パターンは成果物スキーマに従う。

## 6. 成果物の記述例

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

## 7. バリデーション

- `npm run -s lint:md` で Markdown を検証する。
- Frontmatter の機械検証では、ドキュメント種別に対応するスキーマを使用する。
- 成果物には `deliverable-frontmatter.schema.yaml` を使用する。
