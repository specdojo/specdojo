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

`build` の結果は閲覧対象の workspace（コマンドに渡したディレクトリ）の `.vitepress/dist`、
cache は `.vitepress/cache`、Mermaid SVG と manifest は `.vitepress/mermaid`、
閲覧用ステージングは `.vitepress/kata-staging` へ出力します。package の中（`node_modules/@specdojo/docs-site/`）
へは書き込まないため、`npm ci` や再導入で消えず、package を共有する複数の workspace でも出力が
混ざりません。VitePress は閲覧用ステージングだけを走査し、出力・cache・利用者の設定ファイルを
ページに含めません。`specdojo config init` は生成物だけを除外する次の行を `.gitignore` に
追記します。既存のリポジトリでは再実行するか、手動で追加してください。`.vitepress/` 全体を
除外すると利用者の設定も Git 管理できなくなるため、生成ディレクトリごとに指定します。

```text
/.vitepress/dist/
/.vitepress/cache/
/.vitepress/mermaid/
/.vitepress/kata-staging/
```

`build` と `dev` は、ページを走査する前に `specdojo` package が同梱する
`docs/ja/specdojo` 配下（rulebook / standard / recipe / sample / template などの kata と、
kata からリンクされる guide / reference）のうち、利用リポジトリに無いものを
`.vitepress/kata-staging/docs/` へ利用側の `docs/` と重ねて複製し、`/ja/specdojo/...` の URL で配信します。eject 済みの
ファイルは利用リポジトリ側を採用し、package 側では上書きしません。ステージングは起動時に作り直し、
`dev` 中の利用側文書の編集・追加・削除も同期します。
内部の `.gitignore` で Git 管理対象から外れるため、`kata install --all` を実行する必要は
ありません。種類ディレクトリの authority サブディレクトリは core の同梱 kata ではないため、
`specdojo` package からはステージングしません。参照元の package は `SPECDOJO_PACKAGE_ROOT`、未指定なら workspace から辿った
`node_modules/specdojo` です。

`mermaid` コマンドも `.vitepress/mermaid` に出力します。図の公開 URL は
`/mermaid/<hash>.svg` のままで、`build` は `.vitepress/dist/mermaid` へ SVG だけを含め、
`dev` は同じ URL で配信します。利用者の `public/` は従来どおり配信し、生成処理で変更・削除しません。
旧配置の `public/mermaid/` と `specdojo-kata-staging/` は自動削除しないため、移行時に内容を
確認し、不要な生成物だけを手動で片付けてください。

Mermaid 図の生成に失敗した場合、`dev` は起動時・文書の追加や変更時とも、文書のパス・図の番号・
エラーの要点を警告し、その図を飛ばしてほかの図とページの表示を続けます。図を修正すると、次の
変更検知で再生成します。`build` と `mermaid` はすべての図を処理してから、失敗した図をまとめて
表示し、終了コード 1 で失敗します。構文エラーのある図を含むサイトの公開を防ぐためです。
失敗した図の途中生成 SVG は削除し、manifest には成功した図のハッシュだけを記録します。
一部の図が失敗した文書は成功済みとしてスキップせず、次の生成時に再試行します。
走査中に Markdown が削除された場合は、従来どおり警告して飛ばします。

サイドバーは URL の範囲ごとに分かれ、`/ja/specdojo/` では SpecDojo 文書、
`/ja/projects/<project-id>/` では対象 project の文書だけを表示します。exec の plan / result は
ページとしてビルドせず、`exec-records.md` などからのリンクを GitHub 上の正本へ置き換えます。
event などの実行記録はページとして残しますが、サイドバーには列挙しません。project の dashboard
から `exec-records.md` を経由して参照できます。

ローカル検索には SpecDojo 文書と登録簿一覧 `pjr-index` を含め、登録簿の個票、派生ビュー、管理ログ、
実行記録を含めません。登録項目は `pjr-index` のタイトル・説明・結論から検索し、一覧のリンクから
個票へ移動します。
