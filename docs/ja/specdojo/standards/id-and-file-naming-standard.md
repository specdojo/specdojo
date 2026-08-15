---
specdojo:
  id: specdojo:id-and-file-naming-standard
  type: standard
  status: draft
---

# ドキュメントIDおよびファイル命名標準

Document ID and File Naming Standard

## 1. 目的

本ルールは、SpecDojo におけるドキュメント間の参照性・可読性・機械処理性・長期運用性を確保するために、

- **ドキュメントID**
- **ファイル名**
- **ID参照**
- **SpecDojo Unit 内での一意性**

の命名規則と両者の関係を明確に定義することを目的とする。

本ルールにより、以下を同時に満たすことを目指す。

- 人間が見て意味を推測できること
- 機械（lint / CI / 生成AI）が安定して扱えること
- 構造変更や文書分割に耐えられること
- プロジェクトが複数存在してもID衝突を避けられること
- モノレポ構成でも、SpecDojo Unit 単位で管理できること

## 2. 基本方針

### 2.1. SpecDojo Unit と ID の一意性

SpecDojo では、1つの `docs/` ルートを **SpecDojo Unit** として扱う。

SpecDojo Unit は、原則として1つのプロダクト文脈を扱う管理単位である。

例:

```text
repo/docs/
repo/apps/product-a/docs/
repo/apps/product-b/docs/
```

ドキュメントIDは、原則として **SpecDojo Unit 内で一意** にする。

npm package が所有する実践体系は、利用プロジェクトの成果物と同じ Unit に展開しても所有元を識別できるよう、package ごとに定めた authority を ID の namespace として持つ。SpecDojo core の authority は `specdojo` とする。

複数の SpecDojo Unit を横断して扱う場合は、必要に応じて Unit ID とドキュメントIDの組み合わせで識別する。

```text
<unit-id>/<document-id>
```

ただし、通常のドキュメント内では Unit ID をIDに含めない。

### 2.2. IDとファイル名の役割分離

- **ドキュメントID**
  - 文書の意味的・論理的な識別子
  - 参照・トレース・整合性検証の軸
  - 原則として変更しない

- **ファイル名**
  - 人間が扱いやすい表示・管理上の名前
  - 配置や構成変更に応じて変更可能
  - 原則としてドキュメントIDのローカルID部分と一致させる

機械判別・参照・トレースは ID を正とし、ファイル名そのものには依存しない。

ただし運用上の既定として、**ファイル名はドキュメントIDのローカルID部分と一致**させる。

### 2.3. IDの不変性・ファイル名の可変性

- ドキュメントIDは一意かつ原則変更不可
- ファイル名は表示改善・構成変更のために変更可
- ファイル名を変更しても、frontmatter の `id` は変更しない
- ID変更が必要な場合は、新IDを作成し、旧IDとの関係を `supersedes` で表現する

### 2.4. 多言語文書のID方針（言語スコープ）

多言語で同一文書を展開する場合、翻訳は同じ論理文書の言語違いであるため、ドキュメントIDは言語をまたいで同一（言語中立）とする。IDに言語を含めない。

- 同一論理IDの言語variant: `docs/ja/<path>.md` とその翻訳 `docs/en/<path>.md` は、同じ `id` を持つ。翻訳のために新しいIDを振らない。
- 一意性の粒度: IDは「SpecDojo Unit 内、かつ同一言語サブツリー内」で一意とする。言語をまたぐ同一IDは同一論理文書の variant として扱い、衝突とみなさない。同一言語サブツリー内での重複はエラーとする。
- 言語サブツリー: `docs/` 直下のロケールディレクトリ（例: `docs/ja/`、`docs/en/`）を言語スコープとする。ロケール集合は `.specdojo/index-config.yaml` の `locales` で宣言する。
- 言語中立文書: ロケールディレクトリに属さない配下（例: `docs/specdojo/` 配下のスキーマ）は言語中立として Unit 全体で一意とする。言語中立IDと言語別IDに同一IDを用いてはならない。
- 参照とID解決: 参照は言語を書かず `[[id]]` で行う。ID解決は参照元ファイルの言語と同一言語の variant を優先し、無ければ既定言語へフォールバックする。これにより翻訳時に本文中の参照を書き換える必要がない。
- `locales` 未宣言時: 言語スコープは無効となり、ID は Unit 全体で一意（従来動作）に扱う。

## 3. クイックサマリー（要点）

### 3.1. ドキュメントID

#### 3.1.1. プロダクト文書

プロダクト文書は、SpecDojo Unit 内で一意なローカルIDを使用する。

```text
<local-id>
```

例:

```text
bdd-sales-management
ifx-index
sysd-index
```

#### 3.1.2. プロジェクト文書

プロジェクト文書は、同一 SpecDojo Unit 内に複数プロジェクトが存在するため、プロジェクトIDを namespace として持つ。

```text
<project-id>:<local-id>
```

例:

```text
prj-0001:prj-overview
prj-0001:prj-charter
prj-0001:sch-track-project-definition
```

#### 3.1.3. 実践体系文書

npm package が所有する philosophy / standard / rulebook / recipe / sample / template / guide / reference は、authority を namespace として持つ。

```text
<authority>:<local-id>
```

例:

```text
specdojo:document-metadata-standard
specdojo:prj-overview-rulebook
specdojo:track-design-guide
```

authority は論理的な所有元であり、ファイル名には含めない。SpecDojo core をローカルへコピーして明示的に override する場合も、同じ論理文書として同じ完全 ID を維持する。

#### 3.1.4. local-id の形式

`<local-id>` は次の形式を基本とする。

```text
<prefix>-<term>
<prefix>-<kind>-<term>
```

- `<prefix>`: ドキュメント種別
- `<kind>`: prefixを拡張する固定カテゴリ
- `<term>`: 内容を表す名詞句

例:

```text
bdd-sales-management
br-discount
ifx-api-inventory
prj-overview
dct-project-definition
```

### 3.2. 使用可能文字

#### 3.2.1. local-id

`local-id` には以下を使用する。

- 英小文字 `a-z`
- 数字 `0-9`
- ハイフン `-`

```text
^[a-z0-9][a-z0-9-]*$
```

#### 3.2.2. project-id

`project-id` は以下を使用する。

```text
prj-<number>
```

例:

```text
prj-0001
prj-0002
```

#### 3.2.3. namespace付きID

プロジェクト文書とpackage所有の実践体系文書は、namespace と `local-id` をコロンで連結する。

```text
<namespace>:<local-id>
```

例:

```text
prj-0001:prj-overview
specdojo:track-design-guide
```

YAML frontmatter では、コロンを含むIDはクォートで囲む。

```yaml
id: "prj-0001:prj-overview"
```

### 3.3. ファイル名

- 既定推奨は `ファイル名 = local-id`
- プロジェクト文書でも実践体系文書でも、ファイル名には namespace を含めない
- namespace はID上の論理的な所有元を表し、配置先ディレクトリと対応させる

例:

| 種別             | ドキュメントID                          | ファイル名                          |
| ---------------- | --------------------------------------- | ----------------------------------- |
| プロダクト文書   | `bdd-sales-management`                  | `bdd-sales-management.md`           |
| プロダクト文書   | `sysd-index`                            | `sysd-index.md`                     |
| プロジェクト文書 | `prj-0001:prj-overview`                 | `prj-overview.md`                   |
| プロジェクト文書 | `prj-0001:prj-charter`                  | `prj-charter.md`                    |
| プロジェクト文書 | `prj-0001:sch-track-project-definition` | `sch-track-project-definition.yaml` |

### 3.4. 参照ルール

- frontmatter の `id` は正規IDを使用する
- プロジェクト文書の正規IDは `<project-id>:<local-id>` とする
- 同一プロジェクト内の参照では、`<project-id>:` を省略したローカル参照を許可する
- 他プロジェクトの文書を参照する場合は、完全なIDを使用する
- プロダクト文書を参照する場合は、ローカルIDをそのまま使用する
- 生成物・検証結果では、省略参照を解決した正規IDを出力する

例:

```yaml
---
specdojo:
  id: "prj-0001:prj-charter"
  based_on:
    - "prj-overview" # prj-0001:prj-overview として解決
    - "sysd-index" # プロダクト文書ID
---
```

---

<details>
<summary>詳細ルール</summary>

## 4. ドキュメントIDの命名ルール

### 4.1. IDの種類

SpecDojo のドキュメントIDには、次の3種類がある。

| 種類                | 形式                      | 用途                           |
| ------------------- | ------------------------- | ------------------------------ |
| ローカルID          | `<local-id>`              | プロダクト文書                 |
| プロジェクトID      | `<project-id>:<local-id>` | プロジェクト文書               |
| authority付き実践ID | `<authority>:<local-id>`  | package が所有する実践体系文書 |

### 4.2. プロダクト文書のID

プロダクト文書は、SpecDojo Unit 内で一意なローカルIDを使用する。

```text
<local-id>
```

例:

```text
bdd-sales-management
bdd-common
sf-product-register
br-discount
```

プロダクト文書には `product:` のような namespace を付けない。

理由は、SpecDojo Unit 自体が1つのプロダクト文脈を表すためである。

### 4.3. プロジェクト文書のID

プロジェクト文書は、プロジェクトIDを namespace として持つ。

```text
<project-id>:<local-id>
```

例:

```text
prj-0001:prj-overview
prj-0001:prj-charter
prj-0001:dct-index
prj-0001:sch-track-project-definition
```

プロジェクト文書で namespace を付ける理由は、同一 SpecDojo Unit 内に複数プロジェクトが存在し、同じローカルIDが繰り返し使われるためである。

例:

```text
prj-0001:prj-overview
prj-0002:prj-overview
```

### 4.4. 実践体系文書のID

package が所有する実践体系文書は、package ごとに定めた authority を namespace として持つ。authority と local-id は英小文字、数字、ハイフンで構成し、`prj-` で始まる authority はプロジェクトIDとの混同を避けるため使用しない。

```text
specdojo:<local-id>
```

ファイル名は local-id と一致させる。例えば `specdojo:track-design-guide` のファイル名は `track-design-guide.md` とする。package のバージョンは ID に含めず、npm package version と lockfile で管理する。

### 4.5. local-id の基本構造

```text
<prefix>-<term>
<prefix>-<kind>-<term>
```

- `prefix`: ドキュメント種別を表す固定語
- `kind`: prefixを拡張する固定カテゴリ
- `term`: 内容を表す名詞句

例:

```text
bdd-sales-management
br-discount
ifx-api-inventory
ifx-msg-stock-changed
prj-overview
dct-project-definition
```

### 4.6. kind の命名原則

- `<kind>` は語彙を固定し、同義語の混在を禁止する
  - 例: `api`, `msg`, `file`
  - `message`, `messages`, `files` 等は使用しない

- `<prefix>-<kind>-<term>` 以上の多段 prefix は使用しない

OK:

```text
ifx-api-inventory
```

NG:

```text
ifx-external-api-inventory
```

### 4.7. term の命名原則

- 名詞句で表現する
- 動詞単体で始めない
- 「何についての文書か」が分かることを優先する
- 配置ディレクトリ、表示順、状態、担当者、作業アクションなど、変更されやすい情報を入れない

OK:

```text
product-register
order-summary
inventory-adjustment
```

NG:

```text
register-product
edit-order
create-invoice
```

### 4.8. index / common の扱い（ID）

#### 4.8.1. `-index`（系列の入口・Hub）

`<prefix>-index` は、系列の入口として以下を満たす。

- 系列の要点を含む
- 系列内の個別ドキュメントへの導線を含む
- 個別が存在しない場合でも `-index` を使用し、入口IDを固定する
- 将来の文書分割に耐えられるようにする

`-index` は単なるリンク集ではなく、**要点（SSOT）＋関連リンク**を持つ Hub とする。

#### 4.8.2. `-common`（横断的・共有定義）

`<prefix>-common` は、系列外も含めて参照される共通定義に用いる。

- 系列の親子関係を持たない
- 参照元が複数系列にまたがる定義を置く

### 4.9. IDに含めない情報

IDには、次の情報を含めない。

| 含めない情報         | 理由                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------ |
| ディレクトリ番号     | 構成変更で変わるため                                                                       |
| 表示順               | 並び替えで変わるため                                                                       |
| 状態                 | `draft`, `approved` などは変化するため                                                     |
| 担当者               | 担当変更で変わるため                                                                       |
| 作業アクション       | `create`, `modify`, `review` などは Schedule 側の責務であるため                            |
| 日付                 | IDの永続性を損なうため。ただし議事録・進捗レポートなど時点そのものが識別子になる場合を除く |
| ディレクトリ上の所属 | 配置ディレクトリが表すため。package の論理的な所有元は authority で表す                    |

### 4.10. 実践体系文書のlocal-id

`docs/ja/specdojo/` 配下のフレームワーク文書（guide、standard、reference、rulebook、recipe、sample、template）は、成果物文書の `<prefix>-<term>` とは逆に、主題語の後ろへ文書種別のサフィックスを置く。

```text
<subject>-<type-suffix>
```

- `<subject>`: 文書の主題を表す名詞句
- `<type-suffix>`: `guide`、`standard`、`reference`、`philosophy`、`rulebook`、`recipe`、`sample`、`template`

- package の所有元は `specdojo:` のような authority で表し、local-id に `specdojo-` のような所属接頭辞を重ねない。
- ただし SpecDojo 自体を主題とする文書は、主題語として `specdojo` を用いる。

OK:

```text
specdojo:waza-guide
specdojo:exec-operation-guide
specdojo:guide-authoring-standard
specdojo:specdojo-overview-guide
```

NG:

```text
specdojo-waza-guide
specdojo-exec-operation-guide
```

## 5. ID参照ルール

### 5.1. 正規IDとローカル参照

SpecDojo では、frontmatter の `id` には正規IDを使用する。

一方、参照フィールドでは、同一プロジェクト内に限りプロジェクト文書のローカル参照を許可する。package所有の実践体系文書は、所有元を曖昧にしないため常に authority 付き完全IDで参照する。

#### 5.1.1. 正規ID

```yaml
id: "prj-0001:prj-charter"
```

#### 5.1.2. ローカル参照

```yaml
based_on:
  - "prj-overview"
```

この場合、参照元が `prj-0001` に属していれば、次のIDとして解決する。

```text
prj-0001:prj-overview
```

### 5.2. 参照解決ルール

| 参照値                        | 参照元          | 解決結果                      |
| ----------------------------- | --------------- | ----------------------------- |
| `prj-overview`                | `prj-0001` 配下 | `prj-0001:prj-overview`       |
| `prj-0002:prj-overview`       | 任意            | `prj-0002:prj-overview`       |
| `specdojo:track-design-guide` | 任意            | `specdojo:track-design-guide` |
| `sysd-index`                  | 任意            | `sysd-index`                  |
| `bdd-common`                  | 任意            | `bdd-common`                  |

多言語文書では、解決は参照元ファイルの言語と同一言語の variant を優先し、無ければ既定言語へフォールバックする。詳細は `多言語文書のID方針（言語スコープ）` を参照する。

### 5.3. 同一プロジェクト内の参照

同一プロジェクト内の参照では、`<project-id>:` を省略してよい。

例:

```yaml
---
specdojo:
  id: "prj-0001:prj-charter"
  based_on:
    - "prj-overview"
---
```

### 5.4. 他プロジェクトへの参照

他プロジェクトの文書を参照する場合は、完全なIDを使用する。

```yaml
based_on:
  - "prj-0002:prj-overview"
```

### 5.5. プロダクト文書への参照

プロダクト文書は namespace を持たないため、そのままローカルIDで参照する。

```yaml
based_on:
  - "bdd-sales-management"
  - "sysd-index"
```

### 5.6. 生成物・検証結果での参照

生成物や検証結果では、省略参照を解決した正規IDを出力する。

人が記述する参照:

```yaml
based_on:
  - "prj-overview"
```

生成物・検証結果での正規化後:

```yaml
based_on:
  - "prj-0001:prj-overview"
```

## 6. ファイル命名ルール

### 6.1. 基本方針

- ファイル名は人間向けだが、既定はドキュメントIDのローカルIDと同名を推奨する
- 1ファイルは1ドキュメントIDと対応させる
- IDはfrontmatterに保持する
- ファイル名には namespace を含めない
- 日本語ファイル名を使用してよいが、例外運用とする

パスと機械識別子では `specifications` を `specs` と表記します。これは標準用語として認める限定的な短縮であり、`requirements`、`criteria`、`architecture`、`interface`、`operations` は短縮しません。文書タイトルと英語名称では `Specifications` を使用します。

```text
business-specs
external-interface-specs
test-specs
```

`business-specifications`、`external-if-specs`、`test-specifications` のように完全形と別の短縮を混在させません。

### 6.2. ファイル名の基本構成（推奨）

```text
<local-id>.md
<local-id>.yaml
```

例:

| 種別             | ドキュメントID                          | 既定のファイル名                    |
| ---------------- | --------------------------------------- | ----------------------------------- |
| プロダクト文書   | `sysd-index`                            | `sysd-index.md`                     |
| プロダクト文書   | `bdd-common`                            | `bdd-common.md`                     |
| プロジェクト文書 | `prj-0001:prj-overview`                 | `prj-overview.md`                   |
| プロジェクト文書 | `prj-0001:prj-charter`                  | `prj-charter.md`                    |
| 成果物カタログ   | `prj-0001:dct-index`                    | `dct-index.md`                      |
| プロジェクト文書 | `prj-0001:sch-track-project-definition` | `sch-track-project-definition.yaml` |

### 6.3. namespace とディレクトリの関係

プロジェクト文書の namespace は、ファイル名ではなくディレクトリで表現する。

例:

```text
docs/ja/projects/prj-0001/prj-overview.md
```

frontmatter:

```yaml
---
specdojo:
  id: "prj-0001:prj-overview"
  type: project
  status: draft
---
```

ファイル名に `prj-0001:` は含めない。

NG:

```text
prj-0001:prj-overview.md
```

### 6.4. 日本語ファイル名の例外運用

日本語ファイル名は、以下のような理由がある場合に例外として許可する。

- 対外配布
- 業務部門レビュー
- 非エンジニア向け共有
- 可読性を最優先する成果物

日本語ファイル名を使用する場合でも、frontmatter の `id` を正とする。

例:

```yaml
---
specdojo:
  id: "prj-0001:prj-overview"
---
```

ファイル名:

```text
プロジェクト概要.md
```

### 6.5. suffix 表記ルール（ファイル名）

既定運用では、local-idをそのままファイル名として使用する。

```text
xxx-index.md
xxx-common.md
```

日本語ファイル名運用では、次を推奨する。

| 対象      | 推奨                                        |
| --------- | ------------------------------------------- |
| `-index`  | suffix を付けず、自然な日本語タイトルにする |
| `-common` | 識別性のため `-共通` を付けてよい           |
| 個別文書  | `<系列名>-<対象名>.md` とする               |

例:

| ドキュメントID          | 既定ファイル名             | 日本語ファイル名例                           |
| ----------------------- | -------------------------- | -------------------------------------------- |
| `mip-index`             | `mip-index.md`             | `移行計画.md`                                |
| `mtp-index`             | `mtp-index.md`             | `移行テスト計画.md`                          |
| `mtp-cutover-rehearsal` | `mtp-cutover-rehearsal.md` | `移行テスト計画-カットオーバーリハーサル.md` |
| `bdd-common`            | `bdd-common.md`            | `業務データ辞書-共通.md`                     |

### 6.6. 連番プレフィックス（任意）

並び順が重要であれば、ファイル名またはディレクトリ名に `010-` 等の連番を付けてよい。

ただし、連番はIDには含めない。

OK:

```text
010-project-definition/prj-overview.md
```

NG:

```yaml
id: "prj-0001:010-prj-overview"
```

## 7. IDとファイル名の対応ルール

- すべてのドキュメントは frontmatter またはメタ情報として `id` を保持する
- Markdown文書は frontmatter に `id` を持つ
- YAML文書はトップレベルに `id` を持つ
- ファイル名変更時も ID は不変とする
- 参照・リンク・トレースは ID を正とする
- 機械判別は ID に基づいて行い、ファイル名には依存しない
- 既定としては `ファイル名 = local-id` を推奨する

## 8. 参照構造ルール

| 種別          | 構造的参照                         |
| ------------- | ---------------------------------- |
| index         | index ⇄ 下位（term）               |
| common        | 他 → common（構造親子なし）        |
| project       | 同一プロジェクト内はローカル参照可 |
| cross-project | 完全ID参照必須                     |

運用ルール:

- 系列の入口は `-index` に集約する
- `-index` は関連ドキュメントへの導線を必ず持つ
- 個別文書は、必要に応じて `-index` を参照して共通方針・全体基準の重複を避ける
- 同一プロジェクト内の参照はローカルIDでよい
- 他プロジェクトへの参照は `<project-id>:<local-id>` を使用する
- 作成時の根拠は `based_on`、要求・仕様・テスト・実装の意味付き関係は `relations.satisfies` / `relations.verifies` / `relations.implements` を使用する
- トレース表はID参照から導出する派生ビューとし、独立した手編集のSSOTにしない

## 9. IDの変更・置換ルール

- IDは原則変更不可
- 変更が必要な場合は、新IDを作成し、旧IDとの関係を `supersedes` に記載する
- ID変更後も、既存参照の移行が完了するまで旧IDとの関係を追跡可能にする
- 呼び方や置き場所を変えたいだけか、文書を作り直したいかで 9.1（経路A）と 9.2（経路B）を使い分ける

例:

```yaml
supersedes:
  - "prj-0001:api-order-get-v1"
```

### 9.1. 経路A: ファイル名のみの変更（表示改善・構成変更）

用語や置き場所を変えたいだけで、文書としての同一性が変わらない場合に使う。`id`（成果物カタログでは `local_id`）を変更しないため、Schedule のタスクIDにも影響しない、最も影響範囲が小さい経路である。

1. `id`（成果物カタログのエントリなら `local_id`）は変更しない（2.3 参照）。
2. ファイルは `git mv` でリネームし、履歴を保持する。
3. 成果物カタログ（`dct-*.yaml`）の該当エントリは `path` だけを新しいファイル名に更新し、`local_id` は変更しない。
4. Schedule（`sch-strategy-<track>.yaml` / `sch-track-<track>.yaml`）は変更不要（`local_id` が不変のため、タスクIDも変わらない）。
5. wikilink は `[[id|新しい表示名]]` の表示名部分だけを更新する（id 自体は変わらないためリンク解決は保たれる）。
6. sidebar 設定（`.vitepress/sidebar-config.ts` の `PRODUCT_FILE_MENU` / `PROJECTS_FILE_MENU`）のキーを新しいファイル名（拡張子なし）に更新し、表示名も合わせる。
7. `specdojo index build` → `specdojo catalog validate` → `npm run lint:md` → `npm run docs:build` の順で解決を確認する。

### 9.2. 経路B: 新IDへの切替（文書の再定義・分割・統合）

文書として作り直したい、または新IDを別立てしたい場合に使う。成果物カタログで Schedule によりタスク化されている deliverable の場合、タスクIDは `local_id` から生成されるため、`local_id` を変更すると生成元が変わり、既存の完了実績とは切り離された新規タスクチェーン（フルフェーズの再展開）が生成される点に注意する。

1. 旧IDの成果物カタログエントリ（`local_id` / `path` / `done_criteria` など）は削除せず維持する。すでに Schedule に焼き込まれた過去のタスクIDの参照整合性を保つため。
2. 新しい `local_id` で成果物カタログへ新規エントリを追加し、新しいファイルを正本にする。
3. 新ファイルの frontmatter に `supersedes: [<旧id>]` を設定する。
4. 旧ファイルは `status: deprecated` にし、新IDへの移行を示す最小限の内容（H1 と移行先への案内）へ縮小する。物理配置を `trash` ディレクトリへ移す場合は 9.3 の手順を使う。
5. 旧IDの実績を新 `local_id` へ引き継ぐ場合は、Schedule 戦略（`sch-strategy-<track>.yaml`）の `initial_state.completed_deliverables` に新 `local_id` を登録する。これにより新 `local_id` はフルフェーズのタスクチェーンを再生成せず、完了済みを示す単一の軽量タスクだけが生成される（フィールド定義は `sch-strategy.schema.yaml` の `initial_state`、運用の考え方は schedule-design-guide.md を参照）。
6. 旧IDを参照している既存の wikilink・成果物カタログの `depends_on` は、順次新IDへ更新する。旧IDのまま残しても Schedule 上は解決できるが、今後の主参照は新IDに揃えるのが望ましい。
7. `specdojo schedule build --track <track> --force` → `specdojo exec refresh` → `specdojo catalog validate` の順で整合性を確認する。

### 9.3. `trash` ディレクトリへの移動

`status: deprecated` にした成果物ファイルを、通常の成果物と混在させたままにすると、ディレクトリを一覧したときに現行文書と誤認されやすい。`id` は変更しない配置変更（経路A の一種）として、`trash` ディレクトリへ移す。

- 置き場所は `docs/ja/product/trash/`（プロダクト文書）または `docs/ja/projects/<project-id>/trash/`（プロジェクト文書）とする。連番プレフィックスは付けない。
- 移動には専用コマンド `specdojo deliverable trash --project <project-id> --local-id <local-id>` を使う。`--dry-run` で移動計画だけ確認できる。
- このコマンドは、成果物カタログ（`dct-*.yaml`）中の該当エントリを検出し、`git mv` でファイルを移動したうえで、そのエントリの `path` フィールドだけを新しい絶対パスへ書き換える（`local_id` は変更しないため、他のフィールドや YAML 中のコメント・整形はそのまま残る）。
- `status` の変更はコマンドの対象外である。`status: deprecated` への変更は 9.2 の手順（または該当文書の finalize/確定手順）で別途行う。コマンドは `specdojo.status` が `deprecated` でない場合に警告を出すのみで、値は書き換えない。
- 対応先が `docs/ja/product/**` でも `docs/ja/projects/<project-id>/**` でもない場合はエラーで終了する（対象外の配置）。

```sh
specdojo deliverable trash --project prj-0001 --local-id cdfd-register-operation --dry-run
specdojo deliverable trash --project prj-0001 --local-id cdfd-register-operation
```

## 10. NGパターン

| パターン                                            | 理由                                                               |
| --------------------------------------------------- | ------------------------------------------------------------------ |
| `Order_API_v1`                                      | 大文字・アンダースコア・記号                                       |
| `create-order-api`                                  | 動詞主導                                                           |
| `sf-list`                                           | 一覧・入口は `index` を使う                                        |
| `bdd-main`                                          | 役割が曖昧                                                         |
| `ifx-inventory-api`                                 | kind は prefix 直後に置く                                          |
| `product:sf-index`                                  | SpecDojo Unit がプロダクト文脈を表すため、product namespace は不要 |
| `prj-overview` を複数プロジェクトの正本IDとして使う | プロジェクト間で衝突する                                           |
| `prj-0001-prj-overview`                             | project-id と local-id の境界が曖昧                                |
| `prj-0001:010-prj-overview`                         | 表示順をIDに含めている                                             |
| `prj-0001:prj-overview-draft`                       | 状態をIDに含めている                                               |
| `prj-0001:prj-overview.md`                          | ファイル名に namespace を含めている                                |
| `specdojo-waza-guide`                               | authority と local-id の境界が曖昧。`specdojo:waza-guide` とする   |

## 11. 運用指針

- 迷ったら「これは何についての文書か？」を名詞で考える
- プロダクト文書はローカルIDを使う
- プロジェクト文書は `<project-id>:<local-id>` を使う
- package 所有の実践体系文書は `<authority>:<local-id>` を使い、SpecDojo core は `specdojo:` とする
- 同一プロジェクト内の参照では `<project-id>:` を省略してよい
- 他プロジェクトへの参照では完全IDを使う
- 入口は `-index`、横断定義は `-common` を使う
- IDは設計資産、ファイル名は表示資産として扱う
- lint / CI / 生成AI は ID を正として扱う
- 新規作成時は原則として `ファイル名 = local-id` を採用する
- 既存文書は段階的に移行する
- 日本語ファイル名は例外として許可するが、frontmatter の `id` は必ず保持する

</details>

---

## 12. 用語の対応表

日本語の用語と英語の予約語・用語は以下のように対応させてください。

### 12.1. 予約語と日本語名称との対応（更新）

| 予約語         | 日本語名称       | 意味・役割                         |
| -------------- | ---------------- | ---------------------------------- |
| **index**      | **入口（全体）** | 系列の入口（要点SSOT＋関連リンク） |
| **common**     | **共通**         | 横断的・共有定義                   |
| **rules**      | **ルール**       | 強制ルール・規約（逸脱不可）       |
| **guide**      | **ガイド**       | 案内・読み物・使い方               |
| **reference**  | **リファレンス** | 一覧・比較・値の参照               |
| **philosophy** | **考え方**       | 規約の前提となる方針・概念         |

## 13. 主要な英語用語と日本語用語との対応

| 英語用語                | 日本語用語   | 意味                                               |
| ----------------------- | ------------ | -------------------------------------------------- |
| **need**                | **要求**     | ユーザー・業務の目的・欲求・困りごと               |
| **requirement**         | **要件**     | システムとして満たすべき条件                       |
| **specification**       | **仕様**     | システムに守らせるルール（テストで合否判定できる） |
| **design**              | **設計**     | 構造・方式・構成としてどう実現するか               |
| **implementation**      | **実装**     | コード・設定としての実現                           |
| **definition**          | **定義**     | 世界の言葉・概念（正誤や合否を判定しない）         |
| **constraint**          | **制約**     | 設計・実装に課される制限条件                       |
| **acceptance criteria** | **受入条件** | 利用者視点での合格基準                             |

## 14. ドキュメント種別とプレフィックスの対応表（更新）

### 14.1. プロジェクト関係ドキュメント

<!-- prettier-ignore -->
| 種別 | English | prefix | local-id例 | プロジェクト文書ID例 |
| --- | --- | --- | --- | --- |
| プロジェクト概要 | Project Overview | prj- | prj-overview | prj-0001:prj-overview |
| プロジェクト憲章 | Project Charter | prj- | prj-charter | prj-0001:prj-charter |
| ステークホルダー登録簿 | Stakeholder Register | prj- | prj-stakeholder-register | prj-0001:prj-stakeholder-register |
| プロジェクトスコープ | Project Scope | prj- | prj-scope | prj-0001:prj-scope |
| 成功条件・受入条件 | Success Criteria and Acceptance Criteria | prj- | prj-success-criteria-and-acceptance-criteria | prj-0001:prj-success-criteria-and-acceptance-criteria |
| 成果物カタログ | Deliverables Catalog | dct- | dct-index, dct-project-definition | prj-0001:dct-index, prj-0001:dct-project-definition |
| プロジェクト課題と解決アプローチ | Project Issues and Approach | prj- | prj-issues-and-approach | prj-0001:prj-issues-and-approach |
| 前提・制約・依存 | Assumptions, Constraints, and Dependencies | prj- | prj-assumptions-constraints-dependencies | prj-0001:prj-assumptions-constraints-dependencies |
| 代替案の比較 | Comparison of Alternatives | prj- | prj-comparison-of-alternatives | prj-0001:prj-comparison-of-alternatives |
| 現状定義 | Current State Definition | - | cdfd-sales-management | prj-0001:cdfd-sales-management |
| 影響調査 | Impact Analysis | imp- | imp-business | prj-0001:imp-business |
| プロジェクトマネジメント計画 | Project Management Plan | pm- | pm-plan | prj-0001:pm-plan |
| スケジュール | Schedule | sch- | sch-milestones, sch-defaults, sch-track-project-definition, sch-strategy-project-definition | prj-0001:sch-track-project-definition |
| トラック順序計画 | Timeline | tml- | tml-index | prj-0001:tml-index |
| エージェント実行戦略 | Exec Strategy | exec-strategy- | exec-strategy-launch | prj-0001:exec-strategy-launch |
| コミュニケーション計画 | Communication Plan | pm- | pm-communication-plan | prj-0001:pm-communication-plan |
| 品質管理計画 | Quality Management Plan | pm- | pm-quality-management-plan | prj-0001:pm-quality-management-plan |
| リスク登録簿 | Risk Register | pm- | pm-risk-register | prj-0001:pm-risk-register |
| 課題ログ | Issue Log | pm- | pm-issue-log | prj-0001:pm-issue-log |
| 変更要求ログ | Change Request Log | pm- | pm-change-request-log | prj-0001:pm-change-request-log |
| 決定ログ | Decision Log | pm- | pm-decision-log | prj-0001:pm-decision-log |
| プロジェクト登録簿 | Project Register | pjr- | pjr-index, pjr-0001-auth | prj-0001:pjr-index, prj-0001:pjr-0001-auth |
| 進捗レポート | Progress Report | pr- | pr-2026-03-01-01 | prj-0001:pr-2026-03-01-01 |
| 議事録 | Meeting Minutes | mm- | mm-2026-03-01-01 | prj-0001:mm-2026-03-01-01 |
| 体制・RACI | Organization and RACI | pm- | pm-organization | prj-0001:pm-organization |

現状定義は専用prefixを設けず、`040-current-state/` 配下に必要なプロダクト文書を同じ local-id で配置する。

### 14.2. プロダクト関係ドキュメント

<!-- prettier-ignore -->
| 種別 | English | prefix | 例 |
| --- | --- | --- | --- |
| 概念データフロー図 | Conceptual Data Flow Diagram | cdfd- | cdfd-index |
| 概念クラス図 | Conceptual Class Diagram | ccd- | ccd-customer |
| 業務データ辞書 | Business Data Dictionary | bdd- | bdd-common, bdd-sales |
| 概念データストア定義 | Conceptual Data Store Definition | cdsd- | cdsd-common, cdsd-sales |
| 保管場所定義 | Storage Location Definition | sld- | sld-common, sld-sales |
| ステータス定義 | Status Definition | stsd- | stsd-product |
| 分類定義 | Classification Definition | cld- | cld-product |
| 概念状態遷移図 | Conceptual State Transition Diagram | cstd- | cstd-product |
| 業務プロセス仕様 | Business Process Specification | bps- | bps-order-flow |
| ビジネスルール | Business Rule | br- | br-discount |
| 画面仕様 | UI Specification | uis- | uis-order-edit |
| 帳票仕様 | Business Document Specification | bds- | bds-order-summary |
| システム化機能 | System Function | sf- | sf-index, sf-product-register |
| 業務イベント仕様 | Business Event Specification | bes- | bes-index, bes-order-approved |
| 業務受入条件 | Business Acceptance Criteria | bac- | bac-order-approved |
| 用語集 / 用語 | Glossary / Term | gl- / tm- | gl-sales / tm-reorder-point |
| 外部システムI/F | External System Interface | ifx- | ifx-index |
| 外部API仕様 | External API Specification | ifx-api- | ifx-api-inventory |
| 外部ファイル連携仕様 | External File Exchange Specification | ifx-file- | ifx-file-order |
| 外部メッセージ仕様 | External Message Specification | ifx-msg- | ifx-msg-stock-changed |
| コンテキスト図 | Context Diagram | cxd- | cxd-customer |
| コンテナ図 | Container Diagram | cnd- | cnd-customer |
| コンポーネント図 | Component Diagram | cpd- | cpd-inventory |
| インフラ構成図 | Infrastructure Diagram | ifd- | ifd-index |
| 技術スタック定義 | Technology Stack Definition | tsd- | tsd-index |
| システム設計-全体構成 | System Design Index | sysd- | sysd-index |
| システム設計-重要フロー | System Design Critical Flows | sysd- | sysd-critical-flows |
| システム設計-横断ルール | System Design Cross-cutting Policy | sysd- | sysd-cross-cutting-policy |
| 非機能要件 | Non-Functional Requirements | nfr- | nfr-performance |
| システム受入条件 | System Acceptance Criteria | sac- | sac-performance |
| テスト戦略・方針 | Test Strategy and Policy | tsp- | tsp-index |
| 単体テストカタログ | Unit Test Catalog | utc- | utc-index, utc-product-service |
| 内部結合テストカタログ | Internal Integration Test Catalog | itc- | itc-index, itc-product-service |
| 外部結合テストカタログ | External Integration Test Catalog | etc- | etc-index, etc-product-service |
| 総合テストカタログ | System Test Catalog | stc- | stc-index, stc-product-service |
| 受入テストカタログ | Acceptance Test Catalog | atc- | atc-index, atc-product-service |

### 14.3. 移行関係ドキュメント

<!-- prettier-ignore -->
| 種別 | English | prefix | 例 |
| --- | --- | --- | --- |
| 移行計画 | Migration Plan | mip- | mip-index |
| データ移行設計 | Data Migration Design | dmd- | dmd-index, dmd-order-data |
| 移行テスト計画（リハーサル計画） | Migration Test Plan | mtp- | mtp-index, mtp-cutover-rehearsal |
| カットオーバー計画（本番切替手順） | Cutover Plan | cop- | cop-index, cop-cutover-runbook |
| 運用切替計画（ハイパーケア含む） | Operations Transition Plan | otp- | otp-index |

### 14.4. 運用関係ドキュメント

<!-- prettier-ignore -->
| 種別 | English | prefix | 例 |
| --- | --- | --- | --- |
| 運用方針・設計 | Operations Policy and Design | opd- | opd-index, opd-monitoring |
| 運用手順 | Operations Runbook | opr- | opr-index, opr-incident, opr-backup-restore |
