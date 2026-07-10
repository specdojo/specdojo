---
specdojo:
  id: document-metadata-standard
  type: standard
  status: draft
---

# ドキュメントメタ情報標準

Document Metadata Standard

ドキュメントの Frontmatter に関する共通原則と、成果物ドキュメントの記述ルールを定義します。

## 1. 適用範囲

- 共通原則: Frontmatter を持つすべての Markdown ドキュメント
- 独立 YAML データファイル向け規約: SpecDojo スキーマ（`docs/specdojo/schemas/v1/`）を持つ YAML 成果物（`dct-*.yaml` / `pm-*.yaml` / `sch-*.yaml` / `bdd-*.yaml` など）
- 成果物向け詳細規約: `project` / `flow` / `rule` / `data` / `ui` / `api` / `architecture` / `test` / `operations` / `template` / `sample`
- 成果物スキーマ: [deliverable-frontmatter.schema.yaml](../../../specdojo/schemas/v1/deliverable-frontmatter.schema.yaml)

`rulebook` / `recipe` / `guide` / `standard` は専用スキーマを持つため、成果物向け詳細規約の対象外とします。それぞれの追加規約は次を正本とします。

- rulebook: [rulebook-authoring-standard.md](rulebook-authoring-standard.md) の `Frontmatter 規約`
- recipe: [recipe-authoring-standard.md](recipe-authoring-standard.md) の `Frontmatter 規約`
- guide: [guide-authoring-standard.md](guide-authoring-standard.md) の `Frontmatter 規約`
- standard: [standard-authoring-standard.md](standard-authoring-standard.md) の `Frontmatter 規約`

## 2. 共通原則

- Markdown はファイル先頭に YAML Frontmatter を置く。
- SpecDojo が所有する項目はすべて `specdojo:` 名前空間（ネストしたオブジェクト）配下に置く。トップレベルは他フレームワーク（VitePress 等）の項目に明け渡し、SpecDojo は直接使わない。
- `id` / `type` / `status` は全種別で必須とし、`specdojo:` 配下に置く。
- `id` は共通スキーマの `idRef` に従い、`^[a-z0-9][a-z0-9-:]*$` に一致させる。
- `type` は各ドキュメント種別のスキーマに定義された値を使用する。
- `status` は `draft` / `ready` / `deprecated` のいずれかとする。
- ドキュメント名は Frontmatter ではなく本文先頭の H1 に記述する。
- `specdojo:` 名前空間の対象は Markdown Frontmatter のみとする。独立 YAML データファイル（`dct-*.yaml` / `pm-*.yaml` / `sch-*.yaml` など）は Markdown ではなく他ツールとの同居も無いため、名前空間化せずトップレベルに項目を置く。

```yaml
---
specdojo:
  id: prj-scope
  type: project
  status: ready
  rulebook: prj-scope-rulebook
---
```

### 2.1. テンプレート自身のメタ情報と生成物 Frontmatter の分離

テンプレートファイル自身のメタ情報と、テンプレートから生成される成果物の Frontmatter は明確に分離する。

- テンプレートファイル自身のメタ情報も `specdojo:` 配下に置き、`id` / `type` / `status` は実値で記述して通常のメタ情報制約に従う。例: `specdojo.id: dct-project-management-template`、`specdojo.type: template`、`specdojo.status: draft`。
- 生成される成果物の Frontmatter は、テンプレート自身の Frontmatter とは別に、生成物側の雛形として表現する。表現方法はテンプレート種別ごとに次のいずれかとする。
  - Markdown 成果物テンプレートは、自身 Frontmatter の `specdojo:` 配下に置いた `frontmatter_template` フィールドに、生成物 Frontmatter の雛形（`specdojo:` ラッパー込み）を記述する（本標準 `生成物 Frontmatter 雛形`）。
  - Markdown の exec / result テンプレートは、本文先頭に `_FRONTMATTER_` を置き、生成処理が `specdojo:` 名前空間形の Frontmatter を注入する。
  - YAML catalog テンプレート（`dct-*` 等）は独立 YAML データファイルであり名前空間化しない。生成物側フィールドを平坦に記述し、生成処理が `id` / `type` などを変換する。
- 生成時に置換する値は `_UPPER_SNAKE_` 形式のプレースホルダで表す。ただし `type: template` を理由に、すべての Frontmatter 項目や ID で大文字・アンダースコアを使用できるわけではない。
- プレースホルダは、個別スキーマが許可したフィールドだけで使用する。許可していないフィールドでは、共通スキーマや成果物スキーマの通常の値制約を適用する。
- プレースホルダを置換して生成した成果物は、生成後のドキュメント種別に対応する通常のスキーマを満たさなければならない。

例えば [dct.schema.yaml](../../../specdojo/schemas/v1/dct.schema.yaml) は、テンプレートの `part_of` などで参照する `DocId` に大文字とアンダースコアを許可し、`local_id` では `_NNNN_` や `_TERM_` を含む値を許可しています。一方、生成後の project 文書には `StrictDocId` と kebab-case の `local_id` が適用されます。

```yaml
id: dct-project-management-template
type: template
status: draft
part_of:
  - _PROJECT_ID_:dct-index
```

プレースホルダの命名と雛形での使い方は [template-authoring-standard.md](template-authoring-standard.md) を参照してください。

### 2.2. 生成物 Frontmatter 雛形（`frontmatter_template`）

Markdown 成果物テンプレートは、生成物の Frontmatter を自身 Frontmatter の `specdojo:` 配下に置いた `frontmatter_template` フィールドに雛形として記述する。

- `frontmatter_template` の内容は、生成物の Frontmatter そのもの（`specdojo:` ラッパー込み）とし、生成物のドキュメント種別に対応するスキーマ（成果物なら [deliverable-frontmatter.schema.yaml](../../../specdojo/schemas/v1/deliverable-frontmatter.schema.yaml)）を満たす形にする。
- 生成時に置換する値には生成時プレースホルダ（本標準 `生成時プレースホルダと記入プレースホルダ`）を使う。
- 生成処理は、`frontmatter_template` の生成時プレースホルダを置換した結果を生成物の Frontmatter として出力し、テンプレート自身の Frontmatter（`specdojo.id: *-template` 等）は出力しない。

```yaml
---
specdojo:
  id: pm-plan-template
  type: template
  status: draft
  frontmatter_template:
    specdojo:
      id: _PROJECT_ID_:pm-plan
      type: project
      status: ready
      rulebook: pm-plan-rulebook
      based_on:
        - _PROJECT_ID_:pm-organization
        - _PROJECT_ID_:pm-roles
      supersedes: []
---
```

### 2.3. 生成時プレースホルダと記入プレースホルダ

プレースホルダは、置換される時点で 2 種類に分ける。

| 区分                 | 置換する主体         | 置換タイミング               | 例                       |
| -------------------- | -------------------- | ---------------------------- | ------------------------ |
| 生成時プレースホルダ | 生成（scaffold）処理 | テンプレート展開時に機械置換 | `_PROJECT_ID_`           |
| 記入プレースホルダ   | 作成者 / AI Agent    | 生成後の本文記入時           | `_TODO_`, `_RISK_TITLE_` |

- 生成時プレースホルダは `frontmatter_template` と本文の相互参照の両方に現れ、生成処理が一括置換する。
- 記入プレースホルダは生成物に残し、recipe に従って作成者が埋める。生成処理は置換しない。

## 3. 独立 YAML データファイルのメタ情報

独立 YAML データファイルは Frontmatter を持たないため、ファイル先頭のトップレベル項目でメタ情報を表す。

- 名前空間化せず、トップレベルに項目を置く（共通原則を参照）。
- `id` / `type` / `status` は Markdown Frontmatter と同じ制約に従う。
- `title` を必須とし、ドキュメント名を記述する。Markdown における本文先頭の H1 に相当し、表示ページ生成（`specdojo yaml-pages build`）が生成ページの H1 として使用する。
- `rulebook` を必須とし、準拠する rulebook の ID を指定する。該当する rulebook がない場合のみ `none` を許可する（成果物の必須項目と同じ制約）。
- テンプレートファイル（`*-template.yaml`）では、`title` / `rulebook` は生成物側フィールドとして生成物の値を平坦に記述する（テンプレート自身のメタ情報と生成物 Frontmatter の分離を参照）。
- 上記以外の項目（`based_on` / `supersedes` / `version` / `project_id` など）の許可項目と型は各スキーマを正本とする。
- OpenAPI / AsyncAPI など外部標準形式の YAML（`ifx-*` 等）は本規約の対象外とし、`info.title` や `x-spec-meta` など各形式の慣行に従う。

```yaml
id: prj-0001:pm-roles
type: project
status: draft
title: ロール一覧
rulebook: pm-roles-rulebook
version: 1
project_id: prj-0001
```

## 4. 成果物の必須項目

| 項目     | 説明                    |
| -------- | ----------------------- |
| id       | ドキュメント ID         |
| type     | ドキュメント種別        |
| status   | ドキュメント状態        |
| rulebook | 準拠する rulebook の ID |

- `rulebook` は `none` または `*-rulebook` 形式の ID を指定する。
- 該当する rulebook がない場合のみ `rulebook: none` を許可する。

## 5. 成果物の任意項目

| 項目       | 説明                         |
| ---------- | ---------------------------- |
| part_of    | 一覧・親ドキュメントへの所属 |
| based_on   | 根拠ドキュメント             |
| supersedes | 置き換え対象ドキュメント     |

成果物種別によって追加項目を使用できる場合があります。正確な許可項目と型は成果物スキーマを正本とします。

## 6. 成果物の値制約

- `type` は `適用範囲` に列挙した成果物種別のいずれかとする。
- `specdojo:` 配下では未定義プロパティを使用しない（`unevaluatedProperties: false`）。トップレベルには他フレームワークの項目を置いてよい。
- 配列項目は重複させない。
- 項目ごとの型、列挙値、パターンは成果物スキーマに従う。

## 7. 成果物の記述例

```yaml
---
specdojo:
  id: imp-business
  type: project
  status: draft
  rulebook: imp-business-rulebook
  part_of: []
  based_on: []
  supersedes: []
---
```

## 8. バリデーション

- `npm run -s lint:md` で Markdown を検証する。
- Frontmatter の機械検証では、ドキュメント種別に対応するスキーマを使用する。
- 成果物には `deliverable-frontmatter.schema.yaml` を使用する。
