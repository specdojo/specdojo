---
specdojo:
  id: specdojo:document-metadata-standard
  type: standard
  status: draft
---

# ドキュメントメタ情報標準

Document Metadata Standard

Markdown の Frontmatter と YAML・JSON の構造化メタデータに関する共通原則、および成果物ドキュメントの記述ルールを定義します。

## 1. 適用範囲

- 共通原則: Frontmatter を持つすべての Markdown ドキュメント
- 独立 YAML データファイル向け規約: SpecDojo スキーマ（`docs/specdojo/schemas/v1/`）を持つ YAML 成果物（`dct-*.yaml` / `pm-*.yaml` / `sch-*.yaml` / `bdd-*.yaml` など）
- JSON データファイル向け規約: SpecDojo が管理する JSON 文書、実行イベント、設定、インデックス、生成物
- 成果物向け詳細規約: `project` / `flow` / `rule` / `data` / `ui` / `api` / `architecture` / `test` / `operations` / `template` / `sample`
- 成果物スキーマ: [deliverable-frontmatter.schema.yaml](../../../specdojo/schemas/v1/deliverable-frontmatter.schema.yaml)

`rulebook` / `recipe` / `guide` / `reference` / `standard` / `philosophy` は専用スキーマを持つため、成果物向け詳細規約の対象外とします。それぞれの追加規約は次を正本とします。

- rulebook: [rulebook-authoring-standard.md](rulebook-authoring-standard.md) の `Frontmatter 規約`
- recipe: [recipe-authoring-standard.md](recipe-authoring-standard.md) の `Frontmatter 規約`
- guide: [guide-authoring-standard.md](guide-authoring-standard.md) の `Frontmatter 規約`
- reference: [reference-authoring-standard.md](reference-authoring-standard.md) の `Frontmatter 規約`
- standard: [standard-authoring-standard.md](standard-authoring-standard.md) の `Frontmatter 規約`
- philosophy: [philosophy-authoring-standard.md](philosophy-authoring-standard.md) の `Frontmatter 規約`

## 2. 共通原則

- Markdown はファイル先頭に YAML Frontmatter を置く。
- SpecDojo が所有する項目はすべて `specdojo:` 名前空間（ネストしたオブジェクト）配下に置く。トップレベルは他フレームワーク（VitePress 等）の項目に明け渡し、SpecDojo は直接使わない。
- `id` / `type` / `status` は全種別で必須とし、`specdojo:` 配下に置く。
- `id` は共通スキーマの `idRef` に従い、`^[a-z0-9][a-z0-9-:]*$` に一致させる。
- npm package が所有する実践体系文書の `id` は `<authority>:<local-id>` とし、SpecDojo core は `specdojo:` を使用する。これは Frontmatter の親キー `specdojo:` とは別に、ID値の所有元を表す namespace である。
- `type` は各ドキュメント種別のスキーマに定義された値を使用する。
- `status` は `draft` / `ready` / `deprecated` のいずれかとする。
- ドキュメント名は Frontmatter ではなく本文先頭の H1 に記述する。
- `specdojo:` 名前空間の対象は Markdown Frontmatter のみとする。独立 YAML データファイル（`dct-*.yaml` / `pm-*.yaml` / `sch-*.yaml` など）は Markdown ではなく他ツールとの同居も無いため、名前空間化せずトップレベルに項目を置く。
- JSON データファイルは Frontmatter を持たず、用途別のスキーマまたは実装契約が定めるトップレベル項目にメタデータを置く。Markdown の `specdojo:` 名前空間や `id` / `type` / `status` の共通必須条件を一律には適用しない。

```yaml
---
specdojo:
  id: prj-scope
  type: project
  status: ready
  rulebook: specdojo:prj-scope-rulebook
---
```

### 2.1. テンプレート自身のメタ情報と生成物 Frontmatter の分離

テンプレートファイル自身のメタ情報と、テンプレートから生成される成果物の Frontmatter は明確に分離する。

- テンプレートファイル自身のメタ情報も `specdojo:` 配下に置き、`id` / `type` / `status` は実値で記述して通常のメタ情報制約に従う。例: `specdojo.id: specdojo:dct-project-management-template`、`specdojo.type: template`、`specdojo.status: draft`。
- 生成される成果物の Frontmatter は、テンプレート自身の Frontmatter とは別に、生成物側の雛形として表現する。表現方法はテンプレート種別ごとに次のいずれかとする。
  - Markdown 成果物テンプレートは、自身 Frontmatter の `specdojo:` 配下に置いた `frontmatter_template` フィールドに、生成物 Frontmatter の雛形（`specdojo:` ラッパー込み）を記述する（本標準 `生成物 Frontmatter 雛形`）。
  - Markdown の exec / result テンプレートは、本文先頭に `_FRONTMATTER_` を置き、生成処理が `specdojo:` 名前空間形の Frontmatter を注入する。
  - YAML catalog テンプレート（`dct-*`）は独立 YAML データファイルであり名前空間化しない。生成物側フィールドを平坦に記述し、生成処理（`specdojo scaffold`）が `id` / `type` などを変換する。
  - YAML catalog 以外の独立 YAML データファイルのテンプレート（`pm-members-template.yaml` 等）は、自身のメタ情報をトップレベルに実値で記述し、生成物のメタ情報はトップレベルの `metadata_template` フィールドに雛形として記述する（本標準 `生成物メタ情報雛形（metadata_template）`）。
- 生成時に置換する値は `_UPPER_SNAKE_` 形式のプレースホルダで表す。ただし `type: template` を理由に、すべての Frontmatter 項目や ID で大文字・アンダースコアを使用できるわけではない。
- プレースホルダは、個別スキーマが許可したフィールドだけで使用する。許可していないフィールドでは、共通スキーマや成果物スキーマの通常の値制約を適用する。
- プレースホルダを置換して生成した成果物は、生成後のドキュメント種別に対応する通常のスキーマを満たさなければならない。

例えば [dct.schema.yaml](../../../specdojo/schemas/v1/dct.schema.yaml) は、テンプレートの `part_of` などで参照する `DocId` に大文字とアンダースコアを許可し、`local_id` では `_NNNN_` や `_TERM_` を含む値を許可しています。一方、生成後の project 文書には `StrictDocId` と kebab-case の `local_id` が適用されます。

```yaml
id: specdojo:dct-project-management-template
type: template
status: draft
part_of:
  - _PROJECT_ID_:dct-index
```

プレースホルダの命名と雛形での使い方は [template-authoring-standard.md](template-authoring-standard.md) を参照してください。

### 2.2. 生成物 Frontmatter 雛形（`frontmatter_template`）

Markdown 成果物テンプレートは、生成物の Frontmatter を自身 Frontmatter の `specdojo:` 配下に置いた `frontmatter_template` フィールドに雛形として記述する。

- `frontmatter_template` の内容は、生成物の Frontmatter そのもの（`specdojo:` ラッパー込み）とし、生成物のドキュメント種別に対応するスキーマ（成果物なら [deliverable-frontmatter.schema.yaml](../../../specdojo/schemas/v1/deliverable-frontmatter.schema.yaml)）を満たす形にする。
- 生成時に置換する値には生成時プレースホルダ（本標準 `生成時プレースホルダと記入プレースホルダ`）を使う。
- 生成処理は、`frontmatter_template` の生成時プレースホルダを置換した結果を生成物の Frontmatter として出力し、テンプレート自身の Frontmatter（`specdojo.id: *-template` 等）は出力しない。

```yaml
---
specdojo:
  id: specdojo:pm-plan-template
  type: template
  status: draft
  frontmatter_template:
    specdojo:
      id: _PROJECT_ID_:pm-plan
      type: project
      status: ready
      rulebook: specdojo:pm-plan-rulebook
      based_on:
        - _PROJECT_ID_:pm-organization
        - _PROJECT_ID_:pm-roles
      supersedes: []
---
```

### 2.3. 生成時プレースホルダと記入プレースホルダ

プレースホルダは、置換される時点で 2 種類に分ける。

| 区分                 | 置換する主体         | 置換タイミング               | 例                     |
| -------------------- | -------------------- | ---------------------------- | ---------------------- |
| 生成時プレースホルダ | 生成（scaffold）処理 | テンプレート展開時に機械置換 | `_PROJECT_ID_`         |
| 記入プレースホルダ   | 作成者 / AI Agent    | 生成後の本文記入時           | _TODO_, `_RISK_TITLE_` |

- 生成時プレースホルダは `frontmatter_template` と本文の相互参照の両方に現れ、生成処理が一括置換する。
- 記入プレースホルダは生成物に残し、recipe に従って作成者が埋める。生成処理は置換しない。

## 3. 独立 YAML データファイルのメタ情報

独立 YAML データファイルは Frontmatter を持たないため、ファイル先頭のトップレベル項目でメタ情報を表す。

- 名前空間化せず、トップレベルに項目を置く（共通原則を参照）。
- `id` / `type` / `status` は Markdown Frontmatter と同じ制約に従う。
- `title` を必須とし、ドキュメント名を記述する。Markdown における本文先頭の H1 に相当し、表示ページ生成（`specdojo yaml-pages build`）が生成ページの H1 として使用する。
- `rulebook` を必須とし、準拠する rulebook の ID を指定する。該当する rulebook がない場合のみ `none` を許可する（成果物の必須項目と同じ制約）。
- YAML catalog テンプレート（`dct-*-template.yaml`）では、`title` / `rulebook` は生成物側フィールドとして生成物の値を平坦に記述する（テンプレート自身のメタ情報と生成物 Frontmatter の分離を参照）。それ以外のテンプレート（`*-template.yaml`）では、`title` はテンプレート自身の名前を実値で記述し、生成物のメタ情報は `metadata_template` に記述する（本標準 `生成物メタ情報雛形（metadata_template）`）。
- 上記以外の項目（`based_on` / `supersedes` / `version` / `project_id` など）の許可項目と型は各スキーマを正本とする。
- OpenAPI / AsyncAPI など外部標準形式の YAML（`ifx-*` 等）は本規約の対象外とし、`info.title` や `x-spec-meta` など各形式の慣行に従う。

```yaml
id: prj-0001:pm-roles
type: project
status: draft
title: ロール一覧
rulebook: specdojo:pm-roles-rulebook
version: 1
project_id: prj-0001
```

### 3.1. 生成物メタ情報雛形（`metadata_template`）

YAML catalog（`dct-*`）を除く独立 YAML データファイルのテンプレート（`pm-members-template.yaml` 等）は、生成物のメタ情報をトップレベルの `metadata_template` フィールドに雛形として記述する。Markdown 成果物テンプレートの `frontmatter_template` に対応する仕組みである。

- テンプレート自身のメタ情報はトップレベルに実値で記述する。`id` / `type` / `status` は通常のメタ情報制約に従い（例: `id: specdojo:pm-members-template`、`type: template`）、`title` はテンプレート自身の名前を記述する。`rulebook` はテンプレート自身が準拠する rulebook が無いため `none` とする。
- `metadata_template` の内容は、生成物のトップレベルメタ情報そのもの（`id` / `type` / `status` / `title` / `rulebook` / `based_on` / `version` / `project_id` など）とし、生成物のスキーマが定めるメタ項目の制約を満たす形にする。
- 生成時に置換する値には生成時プレースホルダ（本標準 `生成時プレースホルダと記入プレースホルダ`）を使う。
- 生成処理は、`metadata_template` の生成時プレースホルダを置換した内容をトップレベルに平坦化して出力し、続けて本文キー（テンプレート自身のメタ情報 `id` / `type` / `status` / `title` / `rulebook` と `metadata_template` を除いたトップレベルキー）を出力する。テンプレート自身のメタ情報は出力しない。

```yaml
id: specdojo:pm-roles-template
type: template
status: draft
title: ロール一覧テンプレート
rulebook: none
metadata_template:
  id: _PROJECT_ID_:pm-roles
  type: project
  status: draft
  title: ロール一覧
  rulebook: specdojo:pm-roles-rulebook
  version: 1
  project_id: _PROJECT_ID_

# 以下、本文キー（roles など雛形本体）が続く
```

## 4. JSONデータファイルのメタ情報

JSON データファイルは Frontmatter を持たないため、トップレベルの構造化項目でメタデータを表す。
JSON オブジェクトのプロパティ順序には意味がないため、メタデータ項目を表示上ファイル先頭へ置く場合でも、その順序を識別や検証の条件にしない。

JSON は用途によって責務と必要な識別情報が異なるため、Markdown や独立 YAML 成果物の `id` / `type` / `status` を一律の必須項目としない。

| 区分               | メタデータの例                             | 正本                                         |
| ------------------ | ------------------------------------------ | -------------------------------------------- |
| JSON 成果物・定義  | `id`、`type`、`status`、スキーマバージョン | 対応する成果物スキーマ、rulebook             |
| 実行イベント       | `v`、`ts`、`type`、`task_id`、`by`         | イベント形式のスキーマまたは実装上の検証契約 |
| 設定・インデックス | バージョン、対象、生成元など               | 各ファイル形式のスキーマ                     |
| 生成物・派生ビュー | スキーマバージョン、生成元、対象など       | 生成処理と出力形式のスキーマ                 |

- JSON 成果物として文書IDや状態を管理する場合は、対応するスキーマで `id` / `type` / `status` の必須性と値制約を定義する。
- イベントの `type` など、同名でも文書種別とは意味が異なる項目があるため、項目名だけで共通メタデータと判断しない。
- スキーマバージョンの項目名は、既存形式との互換性を維持するため、用途別スキーマが定める `v`、`version`、`schema_version` などを使用する。
- 自動生成される JSON のメタデータは生成元から導出し、生成物を直接編集して同期しない。
- JSON Lines（`.jsonl`）は複数の JSON 値を行単位で格納する形式であり、各レコードのスキーマまたは生成処理の契約に従う。

例として、exec イベントではイベント形式の契約に従い、次のようにバージョン、発生日時、イベント種別、対象タスクをトップレベル項目で表す。

```json
{
  "v": 1,
  "ts": "2026-07-16T11:06:10Z",
  "type": "claim",
  "task_id": "T-LAUNCH-prj-charter-140",
  "by": "agent",
  "msg": "claim task"
}
```

## 5. 成果物の必須項目

| 項目     | 説明                    |
| -------- | ----------------------- |
| id       | ドキュメント ID         |
| type     | ドキュメント種別        |
| status   | ドキュメント状態        |
| rulebook | 準拠する rulebook の ID |

- `rulebook` は `none` または `*-rulebook` 形式の ID を指定する。
- 該当する rulebook がない場合のみ `rulebook: none` を許可する。

## 6. 成果物の任意項目

| 項目       | 説明                               |
| ---------- | ---------------------------------- |
| part_of    | 一覧・親ドキュメントへの所属       |
| based_on   | 作成時に直接の根拠とした文書       |
| supersedes | 置き換え対象ドキュメント           |
| relations  | 充足・検証・実装を表す型付きID参照 |

成果物種別によって追加項目を使用できる場合があります。正確な許可項目と型は成果物スキーマを正本とします。

### 6.1. 型付き参照（`relations`）

`based_on` は作成時に参照した直接の根拠を表し、要求の充足や検証を意味しません。要求・仕様・テスト・実装の追跡には `relations` を使用します。

| 関係         | 参照元の意味                           | 主な参照先               |
| ------------ | -------------------------------------- | ------------------------ |
| `satisfies`  | この成果物が要求・要件・条件を充足する | 要求、要件、受入条件のID |
| `verifies`   | この成果物が対象を検証する             | 要求、仕様、受入条件のID |
| `implements` | この成果物が仕様・設計を実現する       | 仕様、設計のID           |

```yaml
---
specdojo:
  id: atc-order-registration
  type: test
  status: ready
  rulebook: specdojo:atc-rulebook
  based_on:
    - tsp-index
  relations:
    verifies:
      - req-order-registration
      - bac-order-registration
---
```

参照の正本は各成果物の `relations` とします。要求から仕様・テストへの対応表、カバレッジ、未充足項目はこれらの参照から導出する派生ビューであり、独立した手編集のSSOTを作りません。成果物本文に項目単位のトレース列を持つ場合も、安定したIDを記載し、同じ関係を別の状態情報として重複管理しないようにします。

### 6.2. 継続品質評価（`grade`）

Markdown 文書の最新の継続品質評価は `specdojo.grade` に記録します。これは履歴ではなく状態のスナップショットであり、`specdojo grade apply` は同じキーを冪等に上書きします。履歴と合意形成は review result が担います。

| 項目           | 意味                                                      |
| -------------- | --------------------------------------------------------- |
| `rubric`       | 判定に使った共通 rubric の版                              |
| `target`       | `kata` または `deliverable`                               |
| `verdict`      | `pass` / `needs-work` / `fail`                            |
| `score`        | category の重み付き総合点（0-100）                        |
| `graded_at/by` | 評価日時と判定主体                                        |
| `content_hash` | grade と finding コメントを除く内容の SHA-256             |
| `categories`   | category 別 score                                         |
| `viewpoints`   | viewpoint 別 level / score                                |
| `findings`     | `blocker` / `major` / `minor` / `note` の本文コメント件数 |

要修正箇所の直前には独立行で次のコメントを置きます。`rule` は共通 viewpoint ID です。`grade validate` は Frontmatter の severity 別件数、本文コメント数、内容ハッシュを突き合わせます。

```markdown
<!-- specdojo:finding id=F001 severity=major rule=vp-qe-omissions-consistency 必須の禁止事項が欠落している。 -->
```

YAML / JSON は Markdown Frontmatter と HTML コメントの契約を持たないため、現行 grade のインライン記録対象外です。別形式を黙って書き換えず、将来のサイドカー schema 導入まではエラーとして扱います。

## 7. 成果物の値制約

- `type` は `適用範囲` に列挙した成果物種別のいずれかとする。
- `specdojo:` 配下では未定義プロパティを使用しない（`unevaluatedProperties: false`）。トップレベルには他フレームワークの項目を置いてよい。
- 配列項目は重複させない。
- 項目ごとの型、列挙値、パターンは成果物スキーマに従う。
- `status` の値は `draft` / `ready` / `deprecated` で共通だが、意味の重みは成果物カタログの `kind` によって異なる。
  - `kind: work`（人や agent が書く成果物）: `ready` は内容を確認して確定したことを表す。`ready` への昇格は人だけが行い、agent の実行では行わない。
  - `kind: generated`（コマンドが再生成する成果物）: `ready` はその生成物を運用に使える状態であることを表す。再生成のたびに内容が変わることは正常であり、`ready` のまま内容が更新されてよい。
- 生成コマンドは、既存ファイルの `status` を書き換えない。新規作成時に `draft` を書き、以後の昇格と降格は人の判断に委ねる。生成対象が複数のファイルから集約される場合も、特定の入力ファイルの `status` を集約ファイルへ反映しない。

## 8. 成果物の記述例

```yaml
---
specdojo:
  id: imp-business
  type: project
  status: draft
  rulebook: specdojo:imp-business-rulebook
  part_of: []
  based_on: []
  supersedes: []
---
```

## 9. バリデーション

- `npm run -s lint:md` で Markdown を検証する。
- Frontmatter の機械検証では、ドキュメント種別に対応するスキーマを使用する。
- 成果物には `deliverable-frontmatter.schema.yaml` を使用する。
- 独立 YAML データファイルは、ファイル形式に対応するスキーマで検証する。
- JSON データファイルは、用途別の JSON Schema または実装上の検証契約で必須項目、型、列挙値を検証する。
- JSON に対応するスキーマがない場合でも、JSON 構文として読み込めることを検証する。
- YAML データファイルのスキーマ対応は、各 YAML 先頭の
  `# yaml-language-server: $schema=<schema-path>` modeline を正本とする。スキーマを追加したときは、
  対象 YAML または template の modeline を更新する。Frontmatter 用スキーマの場合は
  `.remarkrc.yaml` の `remark-frontmatter-ajv2020` の `schemaRules` へ対象 glob を追加する。
  - `docs/specdojo/schemas/v1/`（言語中立。YAML データファイルと Frontmatter 用）: YAML データファイルでは modeline、Frontmatter 用スキーマでは `.remarkrc.yaml` の `schemaRules` を更新する。
  - `docs/ja/specdojo/schemas/v1/`（言語別。Markdown 本文の構成検証用）: `.remarkrc.yaml` の `remark-md-content` の `schemas` へ、スキーマと対象 glob の対応を追加する。
- `.remarkrc.yaml` の `schemaRules` は配列を上から評価し、最初に一致したスキーマだけを適用する。対象を追加するときは、より限定的な glob を先に置く。
- `.vscode/settings.json` の `yaml.schemas` へ YAML データファイルの対応表を重複管理しない。VS Code の YAML 拡張は modeline を読み、CLI 検証も同じ宣言を読む。
- schema 検証が不要な YAML には `# specdojo-schema: none reason=<reason>` を先頭コメントで明示する。template のように modeline は必要だが完成前プレースホルダにより検証対象外とする YAML には `# specdojo-schema: validate=false reason=template` を併記する。
- スキーマの適用状況は、対象ファイルへ一時的に不正なキー（YAML データファイル・Frontmatter）や不足した章（Markdown 本文）を作り、エディタまたは検証コマンドがエラーを報告するかで確認できる。エラーが出ない場合は、意図したスキーマが適用されていない。
