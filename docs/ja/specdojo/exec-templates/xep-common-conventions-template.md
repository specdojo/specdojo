## edit: 成果物の編集規約

<!-- plan-essentials:start -->

- YAML 成果物を編集した場合、対応 schema `_SCHEMA_REF_` に従って記述する。`package.json` に `validate:schema:file` script がある場合だけ、`npm run validate:schema:file -- --schema _SCHEMA_REF_ --data <対象ファイル>` で schema 検査を実施する。適用した検査でエラーが出た場合は修正してから完了とする。

<!-- plan-essentials:end -->

- plan に「プロジェクトコンテキスト」章がある場合、そこに挙がる文書はプロジェクト共通の前提を読むための参照であり、成果物 frontmatter の `based_on` へ転記しない。参照して得た前提は本文の記述内容へ反映する。
- 成果物 frontmatter の `based_on` に書けるのは、その成果物の `depends_on` の推移閉包に含まれる先行成果物だけである。閉包外の ID を書くと `catalog validate` が「`based_on` が `depends_on` の推移閉包に含まれていません」としてエラーになり、コミットがブロックされる。`based_on` を増やす必要が生じた場合は、自分で転記せず、根拠不足として result に記録する。
- Markdown 成果物を編集した場合、Prettier が導入されているときだけ `npx prettier --write <対象ファイル>` で整形する。`markdownlint-cli` または `markdownlint` が導入されているときだけ `npx markdownlint <対象ファイル>` を実行し、`markdownlint-cli2` を採用するリポジトリでは、そのリポジトリで定めた CLI2 のコマンドを実行する。適用した検査でエラーが出た場合は修正してから完了とする。
