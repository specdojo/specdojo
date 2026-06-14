---
applyTo: 'docs/ja/specdojo/rulebooks/**/*-rulebook.md'
---

# Rulebook 記述ルール

`docs/ja/specdojo/rulebooks` 配下の `*-rulebook.md` を作成/更新するための作業手順です。章構成・記述品質・Frontmatter の規範は standards を正本とし、本書は作業の進め方のみを定義します。

## 1. 目的と適用範囲

- 目的は、`*-rulebook.md` を SSOT の standards に準拠させて作成/更新すること。
- 本ルールは `docs/ja/specdojo/rulebooks/` 配下の `*-rulebook.md` に適用する。

## 2. 入力情報

- 対象ファイル: `docs/ja/specdojo/rulebooks/<prefix>-rulebook.md`
- 章立て・記述ルールの正本: `docs/ja/specdojo/standards/rulebook-authoring-standard.md`
- Frontmatter 規約の正本: `docs/ja/specdojo/standards/rulebook-metadata-standard.md`
- ファイル名・ディレクトリ構成基準: `docs/ja/specdojo/guides/docs-structure-guide.md`
- Frontmatter スキーマ: `docs/specdojo/schemas/v1/rulebook-frontmatter.schema.yaml`
- 参照先（必要に応じて）: `[*-sample](../samples/*-sample.md)`

## 3. 作成・更新手順

1. 対象 `*-rulebook.md` を特定し、既存ファイル有無を確認する。
2. 章立て・記述ルールは `rulebook-authoring-standard.md`、Frontmatter は `rulebook-metadata-standard.md` と差分を洗い出す。
3. 新規作成またはアップサートで章構成・記述・Frontmatter を反映する。
4. sample ファイルが存在する場合は、サンプルリンクを更新する。
5. 変更点を要約し、最終チェック結果を記録する。

## 4. 最終チェック

- Frontmatter が `rulebook-metadata-standard.md` の要件（`id` / `type` / `status`）を満たしている。
- 章構成が `rulebook-authoring-standard.md` に準拠し、`## 1.` からの連番で必須章が欠落していない。
- `rulebook-authoring-standard.md` の禁止事項に該当する記述がない。
- `サンプル` が存在し、リンクが有効。
- `npm run -s lint:md` を実行し、エラーがない。
- `target_format` が `yaml` / `json` の場合は、対応する sample が schema と整合することを確認する。
  - schema がある場合は `npm run validate:schema:file -- --schema <schema-path> --data <sample-path>` を実行する。
