# @specdojo/docs-lint

SpecDojo 文書向けの remark プラグインと検証 CLI を提供します。

```bash
npm install --save-dev specdojo @specdojo/docs-lint
```

remark プラグインは次の公開 export から参照できます。

- `@specdojo/docs-lint/remark/md-content`
- `@specdojo/docs-lint/remark/no-unescaped-angle-placeholder`
- `@specdojo/docs-lint/remark/frontmatter-ajv2020`

検証コマンドは `specdojo-docs-lint` から実行します。

```bash
npx specdojo-docs-lint yaml-schema --modeline
npx specdojo-docs-lint rulebook-schema-enums
npx specdojo-docs-lint history-links
npx specdojo-docs-lint md-content --schema <schema.yaml> --data <glob>
```

`docs/specdojo/` または `docs/ja/specdojo/` 配下の schema が作業ディレクトリにない場合は、同時に導入した `specdojo` パッケージ内の schema を解決します。
