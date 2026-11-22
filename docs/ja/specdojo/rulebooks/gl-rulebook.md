---
schema: docs/specdojo/schemas/v1/gl.schema.yaml
specdojo:
  id: specdojo:gl-rulebook
  type: rulebook
  deliverable_type: glossary
  status: draft
  target_format: yaml
  recipe: not-needed
  sample: specdojo:gl-sample
  template: not-needed
  based_on:
    - specdojo:rulebook-authoring-standard
---

# 用語集（Glossary）作成ルール

Glossary Documentation Rules

業務分析・要求定義・設計・テストで使う概念の意味と境界を YAML で定めます。

## 1. 全体方針

- 業務の概念と、利用者が扱う操作・状態・役割を収録する。
- 定義は `locale` の言語で書く。英語名・コマンド名・固有名詞は併記可。翻訳版は別ファイルにする。
- 横断の概念は `gl-common`（対象付きなら `gl-<対象>-common`）へ集める。翻訳版を除き、同じ概念を複数の用語集に定義しない。
- **共通の運用**: 役割は適用先のメンバー定義、`status` の昇格・承認、改訂と廃止、未決事項の引き継ぎは [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] に従う。整形・lint はリポジトリの検証で扱い、業務の検証に含めない。

## 2. 位置づけ

- 意味の正本とし、判定条件・データ項目・操作手順・実装詳細は各仕様・設計へ委ねる。
- 冒頭のコメントまたは代表用語の注記で、対象範囲と共通・他領域の正本を示す。
- 配置は [[specdojo:docs-structure-guide|ドキュメント構成ガイド]] に従う。

## 3. ファイル命名・ID規則

### 3.1. ファイル命名

- 基本は `gl-<対象領域>.yaml`（例: `gl-sales.yaml`）。
- 翻訳版の併置は `gl-<対象領域>-<locale>.yaml` とし、用語集 ID も区別する。
- 同梱の完成例は `gl-sample.yaml` とする。

### 3.2. ID規約

- 用語集 ID は `^([a-z0-9-]+:)?gl-[a-z0-9-]+$`（完成例は `specdojo:gl-sample`）。
- 用語 ID は `^tm-[a-z0-9-]+$`。新規は `tm-<領域>-<概念>` とし、共通には `common` など共有範囲を使う。
- 参照前に採番し、同一プロジェクトの用語集をまたいで一意にする。確定・参照済み ID は接頭辞がなくても維持する。
- 翻訳版の新規 ID は原語 ID に小文字の言語接尾辞（例: `-en`）を付ける。`source` に原語の用語集リンク・用語 ID を示す。

## 4. 推奨 Frontmatter 項目

メタ情報はルートに置く。下記 schema を正本とし、先頭の modeline に相対パスで指定する。

| 項目       | 説明                                         | 必須 |
| ---------- | -------------------------------------------- | ---- |
| `id`       | 「ID規約」に従う用語集 ID                    | ○    |
| `type`     | `glossary` 固定                              | ○    |
| `rulebook` | `specdojo:gl-rulebook`                       | ○    |
| `title`    | 対象領域を示す用語集名                       | ○    |
| `locale`   | 定義の言語（例: `ja` / `en`）                | ○    |
| `status`   | 文書成熟度。`draft` / `ready` / `deprecated` | ○    |

構造検査は `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/gl.schema.yaml --data <対象.yaml>`、参照検査は `node packages/docs-lint/bin/specdojo-docs-lint.js glossary-references <対象.yaml>`。ともにエラーなし・終了コード 0 を確認する。modeline は `# yaml-language-server: $schema=<相対パス>`。

## 5. 本文要件

### 5.1. ルートキー要件

- ルートの `terms` は必須の用語オブジェクト配列とする。
- 分類や参照先の概念にも定義を持たせる。
- schema にないキーは追加しない。

### 5.2. `terms` の項目

| 項目           | 説明                                                    | 必須 |
| -------------- | ------------------------------------------------------- | ---- |
| `id`           | 安定した用語 ID                                         | ○    |
| `term`         | 利用者が目にする正式な呼び方                            | ○    |
| `englishName`  | 概念の英語名                                            | 任意 |
| `aliases`      | 同じ概念の別名・従来表記の配列                          | 任意 |
| `definition`   | 意味と他の概念との境界が分かる定義                      | ○    |
| `notes`        | 読み手向けの前提・例外・使用文脈                        | 任意 |
| `category`     | 同じ用語集内で分類に使う用語 ID                         | 任意 |
| `relatedTerms` | 同じ用語集内の関連用語 ID の配列                        | 任意 |
| `source`       | 文書リンク・schema のパスと定義名・URL                  | 任意 |
| `status`       | 用語の採用状態。`official` / `deprecated` / `candidate` | 任意 |
| `example`      | 用語を使う短い例文                                      | 任意 |

任意項目は必要なものだけ記載し、用語の `status` と文書成熟度を区別する。`candidate` は業務の利用者・確認者と用例・根拠を照合し、意味・境界・呼び方の合意後に `official` にする。未合意なら候補に留め、`notes` に論点と利用への影響を示す。

## 6. 記述ガイド

### 6.1. 全体方針・位置づけの判断

- 良い例: 「商品」は共通、「つけ残高」は販売へ置く。
- 悪い例: 販売と在庫で同じ「商品」を別々に定義する。

### 6.2. ファイル命名・ID の判断

新規 ID は名詞を基本とし、難解な略語は避ける。

- 良い例: 新規は `tm-sales-credit-limit`、既存の `tm-accounts-receivable` は維持する。
- 悪い例: 領域ごとに `tm-status` を新設する、整形で確定 ID を改名する。

### 6.3. メタ情報・ルート構造の判断

- 良い例: `title: 用語集（販売）`、`locale: ja` とルートの `terms`。
- 悪い例: `specdojo:` で全体を包む、`terms` を文章で代用する。

### 6.4. 用語の見出し・英語名の判断

`term` はガイド・画面・CLI での呼び方に合わせ、言い換えや過去の表記は `aliases` に置く。英語名と英語の用語（見出し・`englishName`・本文中の英語表記）は小文字で書く。SpecDojo の概念の名前として大文字で定着しているもの（Kata など）と固有名詞（SpecDojo など）だけを例外とする。

- 良い例: `term: つけ`、`englishName: sale on credit`、`aliases: [ツケ, 掛け売り]`。
- 悪い例: 「つけ」を `term: 売掛債権取引`、英語名を `Sale On Credit` とする。

### 6.5. 定義・注記・根拠の判断

`definition` は一文を基本とする。`notes` は定義を繰り返さず、読み手向けの補足（前提・例外・使う文脈）だけを書く。`category` や `relatedTerms` の指定のしかたなど YAML の書き方のメモは書かない。設定・コマンドとの対応は理解に必要な範囲に絞り、独立した概念は分ける。

- 良い例: つけの注記は「店主が認めた常連客だけが利用する。」とし、残高・限度額は別の用語にする。
- 悪い例: 定義を「つけとはツケのこと。」で済ませる、注記に「構成要素の `category` に本用語を指定する」と書く。
- schema の条件付き規則は用語間の関係で短く説明し、厳密な条件は `source` へ委ねる。
- 良い例: 「つけは常連客に認める後払いの販売で、つけ残高を管理する。」
- 悪い例: schema の `if` / `then` と必須キー一覧を注記へ写す。

### 6.6. 分類・関連用語の判断

`category`・`relatedTerms` は同じ用語集の ID に限り、関連語は同じ文脈で理解すべきものに絞る。領域外の関係は `notes` または `source` に正本リンクと必要な用語 ID を示す。

- 良い例: 同じファイルの「販売」を分類に使い、別ファイルの「商品」は文書リンクで案内する。
- 悪い例: 未定義の分類名や別ファイルの ID を指定する、分類のためだけに共通用語を複製する。
- 参照検査が扱うのはファイル内の ID 重複と参照先の存在だけで、BDD・BR の参照は検査しない。業務の受入確認では用語集を横断して ID の一意性・翻訳以外の概念重複を照合し、参照元で意味と呼び方が一致すれば合格とする。

### 6.7. 改訂・廃止時の判断

ID・意味・採用状態の変更影響は、BDD・BR の用語参照、画面・CLI、実装、テスト・受入条件、表示ページで照合する。表示ページは YAML から `specdojo build --only yaml-pages` で再生成し、定義・分類・関連用語の一致を確認する。

- 良い例: 意味が変わる語は新 ID とし、旧用語は `status: deprecated` と後継の注記を持ち、参照元を更新する。
- 悪い例: 旧 ID を別の意味に上書きする、参照元を確認せず削除する。

## 7. 禁止事項

- 用語 ID の未採番・重複・意味の異なる語への再利用・確定後の改名。
- 意味を識別できない定義（「いい感じの在庫」など）。
- 別名を別概念として定義すること、翻訳以外で領域間に同じ概念を複製すること。
- 概念の説明を実装詳細・条件一覧で代用すること、編集手順・YAML 記法を `notes` に書くこと。
