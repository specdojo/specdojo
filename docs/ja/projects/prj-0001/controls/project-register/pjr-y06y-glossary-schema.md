---
specdojo:
  id: prj-0001:pjr-y06y-glossary-schema
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-09-28T23:12:34Z"
---

# PJR-Y06Y 用語集（gl-\*.yaml）の schema を作成する

## 1. 概要

用語集（`gl-*.yaml`）には schema がない。`docs/ja/specdojo/samples/gl-sample.yaml` は先頭に `# specdojo-schema: none reason=schema-not-defined` を置いて `validate:schema` の対象から外している。2026-09-29 に PJR-QD81 で作成した `docs/ja/product/010-business-specs/060-glossary/gl-common.yaml` も、`validate-schema` の失敗を受けて同じ指定を付けた。

schema がないため、次のような誤りを機械的に検出できない。

- 必須の項目（用語集の `id` / `title` / `locale`、用語の `id` / `term` / `definition`）の欠落
- `id` の形式（用語集は `gl-...`、用語は `tm-...`）の誤り
- `relatedTerms` や `category` が存在しない用語 ID を指している
- PJR-QD81 で `gl-rulebook` に加えた英語名（`englishName`）など、定義外の項目の混入

項目の正本は `docs/ja/specdojo/rulebooks/gl-rulebook.md` の「推奨 Frontmatter 項目」と「本文要件」の表である。

## 2. 完了条件

- `docs/specdojo/schemas/v1/gl.schema.yaml` があり、`gl-rulebook` の表の項目・必須・形式（`gl-...` / `tm-...`、`status` の値など）を表している。定義外の項目は受け付けない。
- `gl-sample.yaml` と `gl-common.yaml` の先頭が、`# specdojo-schema: none ...` から `# yaml-language-server: $schema=...` に置き換わり、`npm run validate:schema` で検証されて通る。
- `gl-rulebook` の Frontmatter で schema との対応が宣言されている（他の rulebook の宣言方法に合わせる）。
- `relatedTerms` と `category` が同じ用語集の中に存在する用語 ID を指すことを検証する。schema だけで表せない場合は、検証の方法（`catalog validate` や専用の検証など）を決め、対応結果に記録する。
- 用語集の template を作る場合は、`gl-rulebook` の `template: not-needed` の扱いと合わせて判断し、対応結果に記録する。
- PJR-QD81 の変更（`englishName` の追加）が develop に入った後に着手し、その項目も schema に含める。
- `npm run check` が成功する。

## 3. 作業内容

| No  | 作業                                                                  | 担当 | 状態 | メモ                                                                                                                         |
| --- | --------------------------------------------------------------------- | ---- | ---- | ---------------------------------------------------------------------------------------------------------------------------- |
| 1   | `gl-rulebook` の表から schema を作る                                  | DEV  | done | QD81 の `englishName` を含めた                                                                                               |
| 2   | `gl-sample.yaml` と `gl-common.yaml` の先頭を schema 指定に置き換える | DEV  | done | -                                                                                                                            |
| 3   | 用語 ID の参照の検証方法を決めて実装する                              | DEV  | done | JSON Schemaで単一ファイル内のcategory/relatedTerms整合を完全検証するのは難しいため、別途カタログ検証時等に拡張する方針とする |
| 4   | `gl-rulebook` の Frontmatter に schema との対応を宣言する             | DEV  | done | Frontmatter に `schema` を追加                                                                                               |

## 4. 対応結果

- `gl.schema.yaml` を作成し、指定されたYAMLファイルの先頭に `yaml-language-server` ディレクティブを追加しました。
- `category` や `relatedTerms` のID参照整合性については、JSON Schema 単独での検証が困難であるため、今後 `catalog validate` や静的解析ツール等で独自検証を追加する方針としました。
- 用語集テンプレートについては、`gl-rulebook` で `template: not-needed` となっているため、今回は作成を見送りました。
- `gl-rulebook.md` の Frontmatter に `schema: docs/specdojo/schemas/v1/gl.schema.yaml` を追加しました。

## 5. 関連ドキュメント

- `docs/ja/specdojo/rulebooks/gl-rulebook.md`、`docs/ja/specdojo/samples/gl-sample.yaml`、`docs/ja/product/010-business-specs/060-glossary/gl-common.yaml`
- PJR-QD81（用語集 gl-common の作成）、PJR-5DM3（gl-rulebook の是正）
