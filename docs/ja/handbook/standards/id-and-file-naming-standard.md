---
id: id-and-file-naming-standard
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

## 3. クイックサマリー（要点）

### 3.1. ドキュメントID

#### 3.1.1. プロダクト文書

プロダクト文書は、SpecDojo Unit 内で一意なローカルIDを使用する。

```text
<local-id>
```

例:

```text
uts-index
utd-auth
arc-index
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
prj-0001:wbs-index
prj-0001:sch-index
```

#### 3.1.3. local-id の形式

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
uts-index
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

#### 3.2.3. namespaced-id

プロジェクト文書のIDは、`project-id` と `local-id` をコロンで連結する。

```text
<project-id>:<local-id>
```

例:

```text
prj-0001:prj-overview
```

YAML frontmatter では、コロンを含むIDはクォートで囲む。

```yaml
id: 'prj-0001:prj-overview'
```

### 3.3. ファイル名

- 既定推奨は `ファイル名 = local-id`
- プロジェクト文書でも、ファイル名には `<project-id>:` を含めない
- namespace はディレクトリで表現する

例:

| 種別             | ドキュメントID                     | ファイル名                     |
| ---------------- | ---------------------------------- | ------------------------------ |
| プロダクト文書   | `uts-index`                        | `uts-index.md`                 |
| プロダクト文書   | `utd-auth`                         | `utd-auth.md`                  |
| プロジェクト文書 | `prj-0001:prj-overview`            | `prj-overview.md`              |
| プロジェクト文書 | `prj-0001:prj-charter`             | `prj-charter.md`               |
| プロジェクト文書 | `prj-0001:wbs-business-definition` | `wbs-business-definition.yaml` |
| プロジェクト文書 | `prj-0001:sch-launch`              | `sch-launch.yaml`              |

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
id: 'prj-0001:prj-charter'
based_on:
  - 'prj-overview' # prj-0001:prj-overview として解決
  - 'uts-index' # プロダクト文書ID
---
```

---

<details>
<summary>詳細ルール</summary>

## 4. ドキュメントIDの命名ルール

### 4.1. IDの種類

SpecDojo のドキュメントIDには、次の2種類がある。

| 種類           | 形式                     | 用途                                             |
| -------------- | ------------------------ | ------------------------------------------------ |
| ローカルID     | `<local-id>`             | プロダクト文書、その他プロジェクトに属さない文書 |
| 名前空間付きID | `<namespace>:<local-id>` | プロジェクト文書                                 |

### 4.2. プロダクト文書のID

プロダクト文書は、SpecDojo Unit 内で一意なローカルIDを使用する。

```text
<local-id>
```

例:

```text
uts-index
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
prj-0001:wbs-index
prj-0001:sch-index
```

プロジェクト文書で namespace を付ける理由は、同一 SpecDojo Unit 内に複数プロジェクトが存在し、同じローカルIDが繰り返し使われるためである。

例:

```text
prj-0001:prj-overview
prj-0002:prj-overview
```

### 4.4. local-id の基本構造

```text
<prefix>-<term>
<prefix>-<kind>-<term>
```

- `prefix`: ドキュメント種別を表す固定語
- `kind`: prefixを拡張する固定カテゴリ
- `term`: 内容を表す名詞句

例:

```text
uts-index
br-discount
ifx-api-inventory
ifx-msg-stock-changed
prj-overview
dct-project-definition
```

### 4.5. kind の命名原則

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

### 4.6. term の命名原則

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

### 4.7. index / common の扱い（ID）

#### 4.7.1. `-index`（系列の入口・Hub）

`<prefix>-index` は、系列の入口として以下を満たす。

- 系列の要点を含む
- 系列内の個別ドキュメントへの導線を含む
- 個別が存在しない場合でも `-index` を使用し、入口IDを固定する
- 将来の文書分割に耐えられるようにする

`-index` は単なるリンク集ではなく、**要点（SSOT）＋関連リンク**を持つ Hub とする。

#### 4.7.2. `-common`（横断的・共有定義）

`<prefix>-common` は、系列外も含めて参照される共通定義に用いる。

- 系列の親子関係を持たない
- 参照元が複数系列にまたがる定義を置く

### 4.8. IDに含めない情報

IDには、次の情報を含めない。

| 含めない情報     | 理由                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------ |
| ディレクトリ番号 | 構成変更で変わるため                                                                       |
| 表示順           | 並び替えで変わるため                                                                       |
| 状態             | `draft`, `approved` などは変化するため                                                     |
| 担当者           | 担当変更で変わるため                                                                       |
| 作業アクション   | `create`, `modify`, `review` などは Schedule 側の責務であるため                            |
| 日付             | IDの永続性を損なうため。ただし議事録・進捗レポートなど時点そのものが識別子になる場合を除く |

## 5. ID参照ルール

### 5.1. 正規IDとローカル参照

SpecDojo では、frontmatter の `id` には正規IDを使用する。

一方、参照フィールドでは、同一プロジェクト内に限りローカル参照を許可する。

#### 5.1.1. 正規ID

```yaml
id: 'prj-0001:prj-charter'
```

#### 5.1.2. ローカル参照

```yaml
based_on:
  - 'prj-overview'
```

この場合、参照元が `prj-0001` に属していれば、次のIDとして解決する。

```text
prj-0001:prj-overview
```

### 5.2. 参照解決ルール

| 参照値                  | 参照元          | 解決結果                |
| ----------------------- | --------------- | ----------------------- |
| `prj-overview`          | `prj-0001` 配下 | `prj-0001:prj-overview` |
| `prj-0002:prj-overview` | 任意            | `prj-0002:prj-overview` |
| `uts-index`             | 任意            | `uts-index`             |
| `bdd-common`            | 任意            | `bdd-common`            |

### 5.3. 同一プロジェクト内の参照

同一プロジェクト内の参照では、`<project-id>:` を省略してよい。

例:

```yaml
---
id: 'prj-0001:prj-charter'
based_on:
  - 'prj-overview'
---
```

### 5.4. 他プロジェクトへの参照

他プロジェクトの文書を参照する場合は、完全なIDを使用する。

```yaml
based_on:
  - 'prj-0002:prj-overview'
```

### 5.5. プロダクト文書への参照

プロダクト文書は namespace を持たないため、そのままローカルIDで参照する。

```yaml
based_on:
  - 'uts-index'
  - 'arc-index'
```

### 5.6. 生成物・検証結果での参照

生成物や検証結果では、省略参照を解決した正規IDを出力する。

人が記述する参照:

```yaml
based_on:
  - 'prj-overview'
```

生成物・検証結果での正規化後:

```yaml
based_on:
  - 'prj-0001:prj-overview'
```

## 6. ファイル命名ルール

### 6.1. 基本方針

- ファイル名は人間向けだが、既定はドキュメントIDのローカルIDと同名を推奨する
- 1ファイルは1ドキュメントIDと対応させる
- IDはfrontmatterに保持する
- ファイル名には namespace を含めない
- 日本語ファイル名を使用してよいが、例外運用とする

### 6.2. ファイル名の基本構成（推奨）

```text
<local-id>.md
<local-id>.yaml
```

例:

| 種別             | ドキュメントID                     | 既定のファイル名               |
| ---------------- | ---------------------------------- | ------------------------------ |
| プロダクト文書   | `uts-index`                        | `uts-index.md`                 |
| プロダクト文書   | `bdd-common`                       | `bdd-common.md`                |
| プロジェクト文書 | `prj-0001:prj-overview`            | `prj-overview.md`              |
| プロジェクト文書 | `prj-0001:prj-charter`             | `prj-charter.md`               |
| 成果物カタログ   | `prj-0001:dct-index`               | `dct-index.md`                 |
| プロジェクト文書 | `prj-0001:wbs-business-definition` | `wbs-business-definition.yaml` |
| プロジェクト文書 | `prj-0001:sch-launch`              | `sch-launch.yaml`              |

### 6.3. namespace とディレクトリの関係

プロジェクト文書の namespace は、ファイル名ではなくディレクトリで表現する。

例:

```text
docs/ja/projects/prj-0001/prj-overview.md
```

frontmatter:

```yaml
---
id: 'prj-0001:prj-overview'
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
id: 'prj-0001:prj-overview'
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
020-project-management/wbs-index.yaml
```

NG:

```yaml
id: 'prj-0001:010-prj-overview'
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

## 9. IDの変更・置換ルール

- IDは原則変更不可
- 変更が必要な場合は、新IDを作成し、旧IDとの関係を `supersedes` に記載する
- ID変更後も、既存参照の移行が完了するまで旧IDとの関係を追跡可能にする

例:

```yaml
supersedes:
  - 'prj-0001:api-order-get-v1'
```

## 10. NGパターン

| パターン                                            | 理由                                                               |
| --------------------------------------------------- | ------------------------------------------------------------------ |
| `Order_API_v1`                                      | 大文字・アンダースコア・記号                                       |
| `create-order-api`                                  | 動詞主導                                                           |
| `uts-list`                                          | 一覧・入口は `index` を使う                                        |
| `bdd-main`                                          | 役割が曖昧                                                         |
| `ifx-inventory-api`                                 | kind は prefix 直後に置く                                          |
| `product:uts-index`                                 | SpecDojo Unit がプロダクト文脈を表すため、product namespace は不要 |
| `prj-overview` を複数プロジェクトの正本IDとして使う | プロジェクト間で衝突する                                           |
| `prj-0001-prj-overview`                             | project-id と local-id の境界が曖昧                                |
| `prj-0001:010-prj-overview`                         | 表示順をIDに含めている                                             |
| `prj-0001:prj-overview-draft`                       | 状態をIDに含めている                                               |
| `prj-0001:prj-overview.md`                          | ファイル名に namespace を含めている                                |

## 11. 運用指針

- 迷ったら「これは何についての文書か？」を名詞で考える
- プロダクト文書はローカルIDを使う
- プロジェクト文書は `<project-id>:<local-id>` を使う
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

| 予約語          | 日本語名称           | 意味・役割                         |
| --------------- | -------------------- | ---------------------------------- |
| **index**       | **入口（全体）**     | 系列の入口（要点SSOT＋関連リンク） |
| **common**      | **共通**             | 横断的・共有定義                   |
| **rules**       | **ルール**           | 強制ルール・規約（逸脱不可）       |
| **instruction** | **指示テンプレート** | 作成手順・生成AI向け指示           |
| **guide**       | **ガイド**           | 案内・読み物・使い方               |

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
| WBS | Work Breakdown Structure | wbs- | wbs-auth | prj-0001:wbs-auth |
| プロジェクト課題と解決アプローチ | Project Issues and Approach | prj- | prj-issues-and-approach | prj-0001:prj-issues-and-approach |
| 前提・制約・依存 | Assumptions, Constraints, and Dependencies | prj- | prj-assumptions-constraints-dependencies | prj-0001:prj-assumptions-constraints-dependencies |
| 代替案の比較 | Comparison of Alternatives | prj- | prj-comparison-of-alternatives | prj-0001:prj-comparison-of-alternatives |
| 現状定義 | As-Is Definition | asis- | asis-cdfd-index | prj-0001:asis-cdfd-index |
| 影響調査 | Impact Analysis | imp- | imp-business | prj-0001:imp-business |
| プロジェクトマネジメント計画 | Project Management Plan | pm- | pm-plan | prj-0001:pm-plan |
| スケジュール | Schedule | sch- | sch-project-definition | prj-0001:sch-project-definition |
| コミュニケーション計画 | Communication Plan | pm- | pm-communication-plan | prj-0001:pm-communication-plan |
| 品質管理計画 | Quality Management Plan | pm- | pm-quality-management-plan | prj-0001:pm-quality-management-plan |
| リスク登録簿 | Risk Register | pm- | pm-risk-register | prj-0001:pm-risk-register |
| 課題ログ | Issue Log | pm- | pm-issue-log | prj-0001:pm-issue-log |
| 変更要求ログ | Change Request Log | pm- | pm-change-request-log | prj-0001:pm-change-request-log |
| 進捗レポート | Progress Report | pr- | pr-2026-03-01-01 | prj-0001:pr-2026-03-01-01 |
| 議事録 | Meeting Minutes | mm- | mm-2026-03-01-01 | prj-0001:mm-2026-03-01-01 |
| 体制・RACI | Organization and RACI | pm- | pm-organization-and-raci | prj-0001:pm-organization-and-raci |
| 決定記録 | Decision Log | dec- | dec-0001-auth | prj-0001:dec-0001-auth |

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
| システム設計-重要フロー / フロー| System Design Critical Flows / Flow | sysd- / scf- | sysd-critical-flows / scf-001|
| システム設計-横断ルール / ルール | System Design Cross-cutting Policy / Policy | sysd- / scp- | sysd-cross-cutting-policy / scp-API-001 |
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
| 運用手順 | Operations Runbook | opr- | opr-index, opr-restore |
