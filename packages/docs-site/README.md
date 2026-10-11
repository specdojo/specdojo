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

`build` と `dev` は、ページを走査する前に `specdojo` package が同梱する
`docs/ja/specdojo` 配下（rulebook / standard / recipe / sample / template などの kata と、
kata からリンクされる guide / reference）のうち、利用リポジトリに無いものを workspace 直下の
`specdojo-kata-staging/` へ複製し、`/ja/specdojo/...` の URL で配信します。eject 済みの
ファイルは利用リポジトリ側を採用し、package 側では上書きしません。ステージングは毎回作り直し、
内部の `.gitignore` で Git 管理対象から外れるため、`kata install --all` を実行する必要は
ありません。参照元の package は `SPECDOJO_PACKAGE_ROOT`、未指定なら workspace から辿った
`node_modules/specdojo` です。

サイドバーは URL の範囲ごとに分かれ、`/ja/specdojo/` では SpecDojo 文書、
`/ja/projects/<project-id>/` では対象 project の文書だけを表示します。plan / result / event などの
実行記録はページとしてビルドしますが、サイドバーには列挙しません。project の dashboard から
`exec-records.md` を経由して参照できます。

ローカル検索には SpecDojo 文書と登録簿一覧 `pjr-index` を含め、登録簿の個票、派生ビュー、管理ログ、
実行記録を含めません。登録項目は `pjr-index` のタイトル・説明・結論から検索し、一覧のリンクから
個票へ移動します。
