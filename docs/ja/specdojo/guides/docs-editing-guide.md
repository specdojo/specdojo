---
specdojo:
  id: specdojo:docs-editing-guide
  type: guide
  status: ready
---

# ドキュメント編集ガイド

Document Editing Guide

SpecDojo で扱うドキュメントの編集に役立つ、Visual Studio Code（VS Code）や各種ツールの設定や操作方法について説明します。

**対象読者**

- VS Code で SpecDojo の Markdown 文書を作成・編集する利用者

**この文書で分かること**

- 文書編集に役立つ VS Code 拡張と SpecDojo 拡張の導入方法・役割
- 見出し番号の付け方、Markdown プレビューの使い方、表の整形方法

**次に読む文書**

- 文書の配置は [ドキュメント構成ガイド](docs-structure-guide.md)、成果物の記述内容は対象の rulebook を参照してください。

## 1. VS Code 拡張を準備する

VS Code を使う場合は、次の拡張を用途に応じて導入してください。拡張の利用は推奨であり、
SpecDojo 文書そのものを VS Code 以外のエディタで編集することもできます。

| 拡張                | 拡張 ID                          | 役割                                                       | 扱い                                         |
| ------------------- | -------------------------------- | ---------------------------------------------------------- | -------------------------------------------- |
| remark              | `unifiedjs.vscode-remark`        | Markdown を remark の設定に従って整形します                | このリポジトリの推奨拡張                     |
| markdownlint        | `davidanson.vscode-markdownlint` | Markdown の記法違反を編集中に表示します                    | このリポジトリの推奨拡張                     |
| Markdown All in One | `yzhang.markdown-all-in-one`     | 見出し番号を追加・更新します                               | 「見出しに番号を付与」の手順を使う場合に導入 |
| SpecDojo            | `specdojo.vscode-specdojo`       | 文書 ID のリンク表示・遷移と Markdown 表の整形を提供します | Marketplace 公開までは VSIX から手動で導入   |

リポジトリを VS Code で開くと、`.vscode/extensions.json` に記載された remark と markdownlint の
インストールが提案されます。Markdown All in One は、「見出しに番号を付与」の操作を使う場合に Marketplace
で拡張 ID を検索してインストールしてください。

### 1.1. SpecDojo 拡張を VSIX から導入する

現時点では SpecDojo 拡張を Marketplace で公開していないため、リポジトリのルートで次を実行して
VSIX を作成し、VS Code へインストールします。

```bash
cd packages/vscode-specdojo
npm ci
npm run package
code --install-extension vscode-specdojo-0.1.0.vsix
```

拡張のバージョンが変わった場合は、`npm run package` が出力した VSIX のファイル名を指定してください。
インストール後は、必要に応じて VS Code のウィンドウを再読み込みします。Marketplace 公開後は、
この手順を Marketplace からのインストールへ差し替え、`.vscode/extensions.json` の推奨拡張へ
SpecDojo を追加します。

### 1.2. SpecDojo 拡張でできること

SpecDojo 拡張は、ワークスペースの `.specdojo/doc-index.json` を使って文書 ID を解決します。
リンクが解決されない場合は、リポジトリのルートで `npx tsx src/specdojo.ts index build` を実行して
インデックスを更新してください。

| 機能                   | 操作                                                                                                |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| 文書リンクの表示・遷移 | Markdown の SpecDojo 文書リンクをクリックして対象文書を開きます。プレビュー内のリンクにも対応します |
| ID で文書を開く        | コマンドパレットで `SpecDojo: Open Document by ID` を実行し、文書 ID を入力します                   |
| Markdown 表の整形      | 表内へカーソルを置き、コマンドパレットで `SpecDojo: Format Markdown Table` を実行します             |

文書リンクは、本文では `[[id]]` または `[[id|表示名]]` と記述します。Markdown 表のセル内では、
列区切りとの衝突を避けるため `[[id\|表示名]]` と記述してください。

表整形の詳細と Prettier を併用する場合の注意点は「Markdown 表フォーマットガイド」を参照してください。

## 2. 見出しに番号を付与

### 2.1. コマンドで一括付与（いちばん簡単）

1. コマンドパレットを開く
   - Windows / Linux: `Ctrl + Shift + P`
   - macOS: `Cmd + Shift + P`

2. `section numbers` と入力
3. `Markdown All in One: Add/Update section numbers` を実行

これで例えば、

```md
## セクション1

### 小見出し
```

が、

```md
## 1. セクション1

### 1.1. 小見出し
```

### 2.2. 「#（タイトル）は番号なし、## から番号にしたい」場合

「ドキュメントのタイトル（`#`）は番号を付けず、`##` から 1, 1.1…にしたい」ケースが多いです。
その場合は見出しレベルの対象範囲を設定してから、上の `Add/Update section numbers` を実行します。

`settings.json` に例としてこれを追加：

```json
"markdown.extension.toc.levels": "2..6"
```

これで `##`〜`######` を対象にしやすくなります（タイトル `#` を“番号の起点”にしない運用）。

### 2.3. 注意点（地味にハマりどころ）

- この機能は「表示だけで番号を出す」のではなく、見出しテキスト自体を書き換えます（`## 1. 見出し` のように）。
  → 見出しへのリンク（`[...](#見出し)`）を手で書いていると、番号付与後にズレることがあります。

## 3. Markdown プレビューの使い方

VS Code では、Markdown ファイルを編集しながら、
リアルタイムで表示結果を確認できます。

ドキュメント作成・レビュー時には、必ずプレビューを併用してください。

### 3.1. 基本操作

#### 3.1.1. プレビューを開く

- Windows / Linux: `Ctrl + Shift + V`
- macOS: `Cmd + Shift + V`

現在の Markdown ファイルのプレビューが開きます。

#### 3.1.2. 編集画面とプレビューを並べて表示（推奨）

- Windows / Linux: `Ctrl + K` → `V`
- macOS: `Cmd + K` → `V`

画面が左右に分割され、

- 左：Markdown 編集
- 右：プレビュー

という構成になります。

このモードで編集すると、変更内容が即座にプレビューへ反映されるため、
レイアウト・表・見出し構成を確認しながら作業できます。

### 3.2. おすすめの使い方

1. ドキュメントを開く
2. `Ctrl/Cmd + K` → `V` で分割プレビュー
3. 表や見出しを編集
4. プレビューで表示を最終確認

### 3.3. よくあるミス

| ミス                           | 防止策                     |
| ------------------------------ | -------------------------- |
| 表のレイアウト崩れに気づかない | 常に分割プレビューを使う   |
| 見出し階層の誤り               | プレビューの目次表示で確認 |
| 空行不足による段落崩れ         | プレビューで段落境界を確認 |

### 3.4. なぜプレビューが重要か

Markdown は書いた内容＝表示結果ではありません。
特に以下は、必ずプレビューで確認してください。

- 表の崩れ
- 箇条書きのネスト
- 見出しレベル
- 改行位置

## 4. Markdown 表フォーマットガイド

本プロジェクトでは、Markdown の表を常に読みやすく・統一された形式に保つため、
専用の表フォーマット機能を用意しています。

VS Code の拡張機能で用意されている表のフォーマッターは多々ありますが、
列幅を合わせるために一行の変更が表全てに及ぶことがあり、Git の差分が大きくなりがちです。
本機能は、表内の不要な差分を最小化することに特化しています。

- 列数が少ない表（5列以下が目安）については、VS Code 標準の表フォーマッターを使ってください。
- 列数が多い表については、本機能を使ってください。なお、本プロジェクトでは Prettier を使っているため、競合を避けるには表の直前に `<!-- prettier-ignore -->` のコメントを挿入してください。

このガイドでは、本機能の使い方と設計思想を説明します。

この機能は SpecDojo VS Code 拡張の `SpecDojo: Format Markdown Table` コマンドとして提供します。

### 4.1. この機能で何が起きるか

表をフォーマットすると、以下のルールが適用されます。

- 左寄せ

- 各セルの左右に必ず1スペース

- 区切り行は必ず次の形式に統一

  ```text
  | --- | --- | --- |
  ```

- 列幅の自動調整は行わない
  - （Git の差分が不要に大きくならないため）

- セルの内容は一切変更されない
  - `_` や `*` などの文字もそのまま保持されます

#### 4.1.1. 例

フォーマット前：

```text
|a|bbb|c|
|-|--|----|
|1|  2|3|
```

フォーマット後：

```text
| a | bbb | c |
| --- | --- | --- |
| 1 | 2 | 3 |
```

### 4.2. 使い方

#### 4.2.1. Step 1：カーソルを表の中に置く

Markdown ファイルを開き、
フォーマットしたい表の中にカーソルを置きます。

> このとき、カーソルが置かれている表だけが整形されます。
> ファイル内の他の表は一切変更されません。

#### 4.2.2. Step 2：コマンドを実行

コマンドパレットを開きます。

- Windows / Linux: `Ctrl + Shift + P`
- macOS: `Cmd + Shift + P`

次のコマンドを実行してください。

```text
SpecDojo: Format Markdown Table
```

即座に表が整形されます。

### 4.3. この仕組みを使う理由

この方式により、次のメリットがあります。

- ドキュメントの可読性が向上
- 表の形式がチーム全体で統一
- Git の差分が最小化
- フォーマッタによる意図しない変換（`\_` など）を防止

### 4.4. （任意）ショートカットの設定

よく使う場合は、各自でショートカットを設定できます。

1. `Keyboard Shortcuts` を開く

2. 次のコマンドを検索

   ```text
   SpecDojo: Format Markdown Table
   ```

3. 好きなキーを割り当てる

### 4.5. 注意事項

- 標準的な GitHub Flavored Markdown の表に対応しています
- Prettier と競合するため、この機能を使う場合は、表の直前に `<!-- prettier-ignore -->` のコメントを挿入して Prettier の整形を無効化してください
- 表以外の文章には影響しません

## 5. 文書 lint を導入する

SpecDojo の schema と文書 lint を利用するリポジトリでは、CLI 本体と lint パッケージを開発依存へ追加します。

```bash
npm install --save-dev specdojo @specdojo/docs-lint
```

リポジトリルートの `.remarkrc.yaml` では、remark プラグインを公開 export から参照します。次の例は、山括弧プレースホルダ、文書構成 schema、frontmatter schema を検査する構成です。

```yaml
plugins:
  - remark-parse
  - - remark-frontmatter
    - type: yaml
      marker: "-"
  - remark-gfm
  - remark-lint
  - "@specdojo/docs-lint/remark/no-unescaped-angle-placeholder"
  - - "@specdojo/docs-lint/remark/md-content"
    - schemas:
        docs/ja/specdojo/schemas/v1/guide-content.schema.yaml:
          - docs/ja/specdojo/guides/*-guide.md
  - - "@specdojo/docs-lint/remark/frontmatter-ajv2020"
    - strict: true
      schemaRules:
        - glob: docs/ja/specdojo/guides/**/*.md
          schema: docs/specdojo/schemas/v1/guide-frontmatter.schema.yaml
          require_frontmatter: true
```

設定内の `docs/specdojo/` または `docs/ja/specdojo/` 配下の schema がリポジトリ内にない場合、プラグインと CLI は `specdojo` パッケージに同梱された schema を解決します。検証コマンドは次のように実行します。

```bash
npx remark "docs/**/*.{md,mdx}" --quiet --frail
npx specdojo-docs-lint yaml-schema --modeline
npx specdojo-docs-lint rulebook-schema-enums
npx specdojo-docs-lint history-links
npx specdojo-docs-lint md-content \
  --schema docs/ja/specdojo/schemas/v1/guide-content.schema.yaml \
  --data "docs/ja/specdojo/guides/*-guide.md"
```
