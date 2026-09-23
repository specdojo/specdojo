# @specdojo/docs-site

SpecDojo の VitePress 文書サイトと Mermaid SVG 生成を提供する任意パッケージです。CLI 本体の
`specdojo` には Chromium を必要とする依存を含めず、文書サイトを構築する環境だけへ明示的に
導入します。

```sh
npm install --save-dev @specdojo/docs-site
npx specdojo-docs-site build .
```

開発サーバは `npx specdojo-docs-site dev .`、Mermaid SVG の生成だけを行う場合は
`npx specdojo-docs-site mermaid .` を使います。分離パッケージが未導入ならこれらのコマンドは
利用できませんが、`specdojo` の `register` / `exec` / `catalog` / `grade` には影響しません。
