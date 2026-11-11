# SpecDojo for VS Code

SpecDojo 文書の ID による移動、Markdown 表の整形、対話のプレビューを提供します。

## 1. 導入

リポジトリのルートから次を実行します。

```sh
npm --prefix packages/vscode-specdojo ci
npm --prefix packages/vscode-specdojo run package
code --install-extension packages/vscode-specdojo/vscode-specdojo-0.1.0.vsix
```

更新時も VSIX を作り直してインストールし、VS Code のウィンドウを再読み込みしてください。

## 2. 文書の編集

- `[[id]]` / `[[id|表示名]]` のリンクを編集画面やプレビューから開けます。文書 ID の解決にはワークスペースの `.specdojo/doc-index.json` を使います。
- `SpecDojo: Open Document by ID` で文書を開きます。
- 表内で `SpecDojo: Format Markdown Table` を実行すると、その表を整形します。

## 3. 対話のプレビュー

Markdown のプレビュー（Windows / Linux: `Ctrl + Shift + V`、macOS: `Cmd + Shift + V`）で `chat` を吹き出しとして表示します。利用者は右、相手側は左です。

```chat
あなた: 設定を確認してください。

オーケストレーター: `specdojo.config.json` を確認しました。
  続き行は字下げします。
```

`chat tui` は暗い背景と等幅文字を使い、利用者に `>`、相手側に `●` を付けます。

```chat tui
USER: 実行してください。

AI: 完了しました。
```

話者は行頭の `名前:` または `名前：` で始めます。`あなた`・`利用者`・`ユーザー`・`ユーザ`・`user`・`you`・`me`・`human`・`client` は利用者側（英字は大文字小文字を区別しません）、その他は相手側です。話者名のない冒頭はオーケストレーターの発言になります。

発言の間には 1 行空けます。空行なしでも描画できます。空白・タブだけの行を含む空行は、続き行の間でも読み飛ばし、空行の後の続き行は直前の発言に含めます。それ以外の改行・字下げは維持し、バッククォートで囲んだ箇所はインラインコードとして表示します。HTML は文字列として表示します。

文書サイトと同じ対話記法を使えます。GitHub や拡張を導入していない環境では、元のコードブロックとして読めます。詳しくは [[specdojo:docs-editing-guide|ドキュメント編集ガイド]] を参照してください。
