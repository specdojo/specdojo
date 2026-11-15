---
specdojo:
  id: specdojo:ifx-file-rulebook
  type: rulebook
  deliverable_type: api
  status: draft
  target_format: yaml
  recipe: not-needed
  sample: specdojo:ifx-file-sample
  template: not-needed
---

# 外部ファイル連携仕様作成ルール

External File Exchange Specification Authoring Rulebook

外部システムや独立したサブシステムと外部ファイル連携を行うために、ファイルの形式・項目・制約・受け渡し手順を YAML 形式で定義するための規約です。

## 1. 全体方針

### 1.1. 目的と適用範囲

1. **目的**: 外部システムやサブシステム間で授受されるデータファイルの契約（配置・命名・形式・項目・受け渡し手順・障害対応）を YAML 1 ファイルで明確化し、送受信者間の認識齟齬を防ぎます。
2. **適用範囲**: SpecDojo プロジェクトにおいて、CSV、TSV、JSON、XML 等のファイルを介して行われるバッチ連携、データ受け渡し、エビデンス連携の仕様定義に適用します。
3. **完成例の扱い**: 本書には完成例の章を置かず、独立した sample（[[specdojo:ifx-file-sample|外部ファイル連携仕様 サンプル]]）を正本として参照します。

### 1.2. 記載方針

1. **外部合意に必要な最小十分の記載**: 外部システムや読み手・書き手との合意に必要な項目に集中し、内部実装の都合（DB 物理テーブル名や内部クラス名）は記載しません。
2. **生成・受領の責任境界の明確化**: ファイルの生成者（送信元）、受領者（受信先）、および連携方向を明示し、障害時の一次責任を特定可能にします。
3. **正本の参照**: データ構造やスキーマの完全な定義が外部スキーマ（JSON Schema、XSD 等）やコードに存在する場合は、二重管理を避けるため正本への参照を記載します。

### 1.3. 責務境界の原則

1. **トランスポートと構造の分離**: ファイルの配送手段（SFTP、共有ストレージ、ローカルファイル等）とファイル内の構造定義（スキーマ、フィールド定義）を明確に区別して定義します。
2. **例外・障害時の扱いの規定**: ファイル欠落、フォーマット不正、伝送遅延、保存失敗時の振る舞いと復旧手順を明記します。

## 2. 位置づけと用語定義

### 2.1. 外部システムI/F一覧（ESIL / ifx-index）との関係

```mermaid
flowchart LR
    ESIL["外部システムI/F一覧 (ifx-index)"] -->|"spec_ref で参照"| EFES["外部ファイル連携仕様 (ifx-file-*)"]
    EFES -->|"schema_ref で参照"| SCHEMA["正本スキーマ / コード定義"]
```

1. **一覧からの詳細化**: EFES（External File Exchange Specification）は、外部システムI/F一覧（`ifx-index`）に定義された `kind: ファイル` またはファイル受け渡しを伴う連携の詳細仕様として位置づけられます。
2. **ID の対応**: `ifx-index` の `spec_ref` に指定された ID（例: `prj-0001:ifx-file-agent-evidence`）と、EFES のメタ情報 `id` を一致させます。

### 2.2. 用語定義

1. **EFES**: External File Exchange Specification の略称。ファイル連携仕様書。
2. **送信元（source）**: ファイルを生成し、所定の受け渡し場所へ配置・送信するシステムまたはロール。
3. **受信先（target）**: 受け渡し場所からファイルを取得し、読み取り・検証・処理を行うシステムまたはロール。
4. **連携方向（direction）**: データの流れる向き（`source_to_target`、`target_to_source`、`bidirectional`）。

## 3. ファイル命名・ID規則

### 3.1. ファイル配置と命名規則

1. **配置先**: プロダクトの外部インターフェース仕様ディレクトリ（例: `docs/ja/product/020-external-interface-specs/`）に配置します。
2. **ファイル名**: `ifx-file-<短い英小文字ハイフン>.yaml` とします。
3. **単位**: 原則として 1 ファイル連携契約につき 1 YAML ファイルを作成します。密接に関連する複数ファイル群（例: データファイルと制御ファイル、evidence と pipeline-state）は 1 つの仕様にまとめて定義できます。

### 3.2. 仕様 ID 規則

1. **仕様 ID**: `ifx-file-<短い英小文字ハイフン>`（プロジェクト修飾を伴う場合は `<project-id>:ifx-file-<term>`）とします。
2. **一意性**: プロジェクト内および文書インデックス全体で一意になるように命名します。

## 4. 推奨 Frontmatter・メタ情報項目

### 4.1. メタ情報（x-spec-meta）の構成

YAML 仕様の先頭または `x-spec-meta` キー配下にメタ情報を定義します。

```yaml
x-spec-meta:
  id: ifx-file-example
  type: api
  status: draft
  title: 外部ファイル連携仕様の例
  rulebook: specdojo:ifx-file-rulebook
  based_on:
    - ifx-index
```

### 4.2. メタ情報の各フィールド定義

| フィールド名 | 必須 | 型     | 説明                                                           |
| ------------ | ---- | ------ | -------------------------------------------------------------- |
| `id`         | ○    | string | 仕様の一意な ID。ファイル名と対応させます。                    |
| `type`       | ○    | string | `api` 固定（rulebook の `deliverable_type` と一致させます）。  |
| `status`     | ○    | string | 文書のライフサイクル状態（`draft` / `ready` / `deprecated`）。 |
| `title`      | ○    | string | 仕様の日本語名称・タイトル。                                   |
| `rulebook`   | ○    | string | 準拠する rulebook ID（`specdojo:ifx-file-rulebook`）。         |
| `based_on`   | 任意 | array  | 根拠となるドキュメント ID（`ifx-index` 等）。                  |

## 5. 本文要件

### 5.1. トップレベル構造

YAML のルートには以下のキーを配置します。

| キー名                | 必須 | 型             | 概要                                                                    |
| --------------------- | ---- | -------------- | ----------------------------------------------------------------------- |
| `x-spec-meta`         | ○    | object         | 仕様のメタ情報。                                                        |
| `file` または `files` | ○    | object / array | 対象ファイルの名称・命名規則・配置場所。                                |
| `source`              | ○    | string         | 送信元・生成元の主体。                                                  |
| `target`              | ○    | string         | 受信先・利用元の主体。                                                  |
| `direction`           | ○    | string         | 連携方向（`source_to_target` / `target_to_source` / `bidirectional`）。 |
| `format`              | ○    | string         | データフォーマット（`CSV` / `TSV` / `JSON` / `XML` / `その他`）。       |
| `timing`              | ○    | string         | 連携が発生する契機・スケジュール。                                      |
| `transport`           | ○    | object         | 受け渡し方法・プロトコル・配置エンドポイント。                          |
| `schema`              | ○    | object         | フォーマット別の構造定義または正本スキーマ参照。                        |
| `error_handling`      | ○    | object         | 異常発生時の扱い・回復手順。                                            |

### 5.2. ファイル基本情報（file / files）

単一ファイルの場合は `file`、複数ファイル群の場合は `files` を用いて定義します。

1. `name`: ファイルの基本名称（例: `orders.csv`、`evidence.json`）。
2. `naming_rule`: タイムスタンプや連番を含む命名規則（例: `orders_YYYYMMDD.csv`）。
3. `location`: ファイルの配置場所・ディレクトリパス。
4. `description`: 当該ファイルの責務と概要。

### 5.3. 連携方向と参加者（direction, source, target）

1. `direction`: `source_to_target`（送信元から受信先へ）、`target_to_source`（受信先から送信元へ）、`bidirectional`（双方向の受け渡し）のいずれかを指定します。
2. `source`: ファイルを作成・出力するシステムまたはコンポーネントを明記します。
3. `target`: ファイルを読み取り・処理するシステムまたはコンポーネントを明記します。

### 5.4. フォーマット宣言（format）

1. 対応フォーマット: `CSV`、`TSV`、`JSON`、`XML`、`その他` から選択します。
2. エンコーディング: 特段の理由がない限り `UTF-8` を推奨とし、改行コード（`LF` / `CRLF`）も規定します。

### 5.5. 連携契機（timing）

1. 実行契機: 日次バッチ、都度（イベント駆動）、タスク終了時などのトリガー条件を記載します。
2. 処理時間帯: 定期バッチの場合は予定時刻（例: `日次 02:00`）を記載します。

### 5.6. 受け渡し方法（transport）

1. `method`: 連携プロトコルや受け渡し手段（`ローカルファイルシステム` / `共有ストレージ` / `SFTP` / `HTTPS` / `S3` / `その他`）。
2. `endpoint`: 格納パスや接続先ホスト（機密情報・認証トークンは直接書かず環境変数名や参照で示す）。
3. `frequency`: 連携頻度（`都度` / `日次` / `週次` / `手動` 等）。

### 5.7. 構造定義（schema）

フォーマットに応じた構造定義を記載します。

1. **フィールド一覧定義（共通）**: `schema.fields` 配列で各項目の `name`, `type`, `description`, `required`, `example`, `constraints` を定義します。
2. **正本スキーマ参照**: 独立したスキーマファイルがある場合は、`schema.schema_ref`（または `json_schema`, `xsd_ref`）として正本を参照し、重複記載を防止します。
3. **フォーマット固有設定**:
   - CSV/TSV: `delimiter`, `header` (true/false), `quote`, `encoding`, `line_ending`。
   - JSON: `root_type` (`object` / `array`), `content_type`。
   - XML: `root_element`, `namespace`, `xsd_ref`。

### 5.8. 失敗時の扱いとエラーハンドリング（error_handling）

1. **ファイル欠落時（missing）**: 予定時刻にファイルが存在しない場合の検知、再試行、アラート通知を規定します。
2. **フォーマット・スキーマ不正時（malformed）**: パースエラーや項目不足時のフォールバック、不正ファイルの退避（quarantine）、エラーログ出力を規定します。
3. **伝送・保存失敗時（transport failure）**: ネットワーク切断やディスク容量不足時の再試行方針、作業中断、リカバリ手順を規定します。

## 6. 記述ガイド

### 6.1. 章ごとの判断基準

1. **連携対象の単位**: 業務上の 1 取引・1 バッチ処理で完結するファイル群を 1 つの仕様書にまとめます。無関係な複数の連携を 1 ファイルに混在させないでください。
2. **詳細度の下限**: 下流の設計者（DEV）がパース・検証ロジックを実装でき、テスト担当（QE）が正常系・異常系のテストケースを導出できる粒度を担保します。
3. **スキーマ再掲の防止**: すでに TypeScript 型定義や JSON Schema が存在する場合、その全項目を YAML に手動で書き写すのではなく、主要な契約項目・必須項目を示した上で正本を参照します。

### 6.2. フォーマット別の構造定義手法（CSV / TSV / JSON / XML）

1. **CSV / TSV**: カラム順序とヘッダ行の有無を明記し、各列の型と桁数制約を定義します。
2. **JSON**: オブジェクトの階層構造（ルートが object か array か）、キーの命名規約（camelCase / snake_case）、日付形式（ISO 8601 等）を規定します。
3. **XML**: ルート要素、子要素の出現回数（minOccurs, maxOccurs 相当）、属性（attribute）と要素（element）の使い分けを規定します。

### 6.3. 良い例と悪い例

#### 6.3.1. 良い例: 正本参照と責務の明確化

```yaml
# 良い例: 責任境界と失敗時の扱いが明確で、詳細は正本を参照している
files:
  - name: evidence.json
    location: execution/runs/<origin>/<item>/<run>/evidence.json
    description: executor の実行結果エビデンス
    writer: runner (agent stdout 抽出)
    reader: runner / reporter
schema:
  format: JSON
  schema_ref: src/exec/evidence.ts#ExecEvidence
  required_fields: [schema_version, task_id, run_id, stage, validations]
error_handling:
  missing:
    action: 構造化報告を空として扱い、親プロセスの終了コードと検証で合否を判定する
  malformed:
    action: 解析エラーログを出力し、成果物変更を保持したまま手動確認へ引き継ぐ
```

#### 6.3.2. 悪い例: 実装詳細の埋め込みと責任境界の曖昧さ

```yaml
# 悪い例: SQL や内部クラス名が混入し、失敗時の扱いが書かれていない
file:
  name: data.json
  query: SELECT * FROM orders WHERE status = 'DONE' # 禁止: SQLの記述
  handler_class: com.example.OrderHandlerImpl # 禁止: 内部実装クラス名
transport:
  method: 適切に転送する # 曖昧: 手段が不明
error_handling:
  action: 問題ないように処理する # 曖昧: 判定不能
```

## 7. 禁止事項

### 7.1. 構造・記法に関する禁止事項

1. **章番号ルールの違反**: Markdown の見出しに階層連番（`## 1.`, `### 1.1.`）を付けない、または末尾の `.` を省略することを禁止します。
2. **Frontmatter 不整合**: rulebook の `deliverable_type: api` と異なる `type` を成果物に指定することを禁止します。
3. **本文内への sample リンク章の設置**: 本文中に `## サンプル` のような完成例リンク章を置くことを禁止します（Frontmatter の `sample` 宣言で対応付けます）。

### 7.2. 記述内容に関する禁止事項

1. **内部実装詳細の混入**: DB 物理テーブル名、SQL 文、内部モジュール/クラス名、関数シグネチャを仕様に記載することを禁止します。
2. **機密情報の記載**: 接続パスワード、API 秘密鍵、個人情報の実データを YAML 内に直接記述することを禁止します。
3. **曖昧語による完了**: 「適切に処理する」「問題ないようにする」「十分に検証する」など、検証不能な記述で終わらせることを禁止します。
4. **正本の過剰な複製**: 外部のスキーマやリファレンスの全文をそのままコピー＆ペーストして二重管理にすることを禁止します。
