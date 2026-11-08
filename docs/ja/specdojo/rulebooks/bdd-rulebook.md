---
specdojo:
  id: specdojo:bdd-rulebook
  type: rulebook
  deliverable_type: data
  status: draft
  target_format: yaml
  recipe: not-needed
  sample: specdojo:bdd-sample
  template: not-needed
---

# 業務データ辞書 作成ルール

Business Data Dictionary (BDD) Documentation Rules

本ドキュメントは、業務分析・要求定義・システム設計のために **業務データ辞書（BDD）を記述する標準ルール**です。
業務上の管理単位（エンティティ）とその属性（フィールド）の論理名・物理名・業務的意味・制約などを定義し、データの意味や構造に関する共通理解を関係者間で形成するための基準文書として扱います。

## 1. 全体方針

- **業務概念の基準化**: 業務分析・要求定義・設計で共通利用する業務データ辞書を、YAML形式で統一的に定義する。
- **実装重複の排除**: 実装詳細を再掲するのではなく、schema や実装（TypeScript 型）が存在するエンティティはそれらを正本として参照し、業務データ辞書にはスキーマから読み取れない業務上の意味（項目の業務的定義、enum 値が表す業務状態など）に特化して記述する。
- **完成条件**:
  - 必須メタデータ（`id`, `type`, `title`, `status`, `rulebook`）および各エンティティの必須キー（`logical_name`, `physical_name`, `key_fields`）が充足していること。
  - schema を参照するエンティティ（`schema_ref`）は正本スキーマを参照し、`fields` にスキーマと重複する型・制約定義を含まず、スキーマから読めない業務上の意味のみを記載していること。
  - schema のないエンティティは、選定基準に従ってスタンドアロン定義（`fields` に `type` 等を明記）または TypeScript 型参照（`type_ref`）のいずれかで定義されていること。
  - `docs/specdojo/schemas/v1/bdd.schema.yaml` によるスキーマ検証に合格していること（`npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/bdd.schema.yaml --data <file>`）。
  - 用語集（glossary）および概念クラス図（CCD）と論理名・`glossary_term_id`・`related_terms` が照合・整合していること。
- **`status: ready` への昇格判定条件**:
  - schema（`bdd.schema.yaml`）の正規表現パターン（`id`, `logical_name`, `physical_name` 等）や構造制約に完全に合致していること。
  - ルールブック内の enum 値網羅検証（`npm run validate:schema:rulebook-enums`）に合格していること。
  - 主要関係者（PO, BA, ARC, DEV, QE）のレビュー観点に基づく承認が得られていること。
- **変更時の同期対象（影響範囲）**:
  - スキーマ正本: `docs/specdojo/schemas/v1/bdd.schema.yaml`
  - サンプル: `docs/ja/specdojo/samples/bdd-sample.yaml`
  - テンプレート: `docs/ja/specdojo/templates/dct-data-model-bdd-template.yaml`
  - 成果物カタログ: `dct-data-model-bdd.yaml`
  - 関連仕様: 用語集（`gl-*.yaml`）、概念クラス図（`ccd-*.md`）

## 2. 位置づけと用語定義

- **成果物の種別**: 本ルールは `type: data` の成果物に適用する（成果物メタデータとしての `type` は `data` 固定であり、各フィールドのデータ型を表す `type` と区別する）。
- **機械検証正本との依存関係**: 本ルールに基づく YAML 成果物の機械検証正本（SSOT）は `docs/specdojo/schemas/v1/bdd.schema.yaml` である。ルールブックとスキーマの乖離を防ぐため、スキーマで定義された制約・キー構造を正本として遵守する。
- **主要な関係者（Role code）と確認観点**:
  - **BA（ビジネスアナリスト / 主作成者）**: 業務上の管理単位・フィールドの業務的意味・状態定義の正確性と完全性を記述する（`vp-ba-requirements-completeness`）。
  - **PO（プロダクトオーナー / 確認者）**: 業務概念のスコープ、エンティティ境界、業務用語の整合性を確認・承認する（`vp-po-purpose-alignment`, `vp-po-decision-readiness`）。
  - **ARC（アーキテクト / 確認者・利用者）**: システム設計・データ構造・正本スキーマ参照（`schema_ref`）との整合性、技術制約を確認する（`vp-arc-technical-constraints`）。
  - **DEV（開発者 / 利用者）**: 実装（モデル・型定義・テーブル設計）の基礎情報として参照し、TypeScript 型参照（`type_ref`）やスキーマとの対応を確認する（`vp-dev-implementation-readiness`）。
  - **QE（品質保証 / 確認者）**: 制約条件、許容値、検証可能性を確認する（`vp-qe-verifiability`）。
- **用語定義**:
  - **エンティティ（entities）**: 業務上の独立した管理単位・データオブジェクト。
  - **フィールド（fields）**: エンティティを構成する個々のデータ項目。
  - **論理名（`logical_name`）**: 業務利用者が直感的に理解できる日本語名称（単数形）。
  - **物理名（`physical_name`）**: DB 列名やシステム識別子として互換性のある英語 lower_snake_case 名称。
  - **キー項目（`key_fields`）**: エンティティを一意に識別する業務上のキー項目のリスト。
  - **用語集参照キー（`glossary_term_id`）**: 用語集（glossary）に登録された正式な用語 ID（`tm-...`）。
  - **関連用語（`related_terms`）**: 関連する用語集の用語 ID リスト。

## 3. ファイル命名・ID規則

### 3.1. ID規約

- `id` は正規表現 `^(?:[a-z][a-z0-9-]*:)?bdd-[a-z0-9-]+$` に合致する一意 ID を用いる。
  - プロジェクト成果物: `<project-id>:bdd-<name>`（例: `prj-0001:bdd-project-config`）
  - SpecDojo 同梱成果物: `specdojo:bdd-<name>`（例: `specdojo:bdd-sample`）
  - 単体 ID: `bdd-<name>`
- 成果物メタデータの `type` は `data` 固定とする。
- **変更管理手順**:
  - 置き換えによる大幅な改訂がある場合は `supersedes` に旧 ID を列挙する。
  - 用語集（`gl-*.yaml`）や概念クラス図（CCD）が改訂された場合は、保守担当（BA / ARC）が関連する `bdd-*.yaml` の `logical_name`, `glossary_term_id`, `related_terms` を同期更新する。
  - フィールドの非推奨・廃止時は、直接削除せず `description` に非推奨理由および代替フィールドを明記して移行期間を設ける。

### 3.2. ファイル命名規約

- **配置ディレクトリ**: プロジェクト内の業務データ辞書は、成果物カタログの `base_path`（通常は `docs/ja/product/010-business-specs/020-data-model/`）直下に配置する。
- **ファイル形式**: YAML 形式（`.yaml`）で管理する。
- **ファイル名**: `bdd-<term>.yaml`（英小文字 kebab-case）とする（例: `bdd-project-config.yaml`, `bdd-payment.yaml`）。

## 4. 推奨 Frontmatter 項目

YAML ドキュメントの先頭メタデータとして、以下の項目を定義する（必須/任意の区分は表の定義に従う）。

| 項目       | 説明                                     | 必須 |
| ---------- | ---------------------------------------- | ---- |
| id         | データ辞書ID（`bdd-...`）                | ○    |
| type       | 成果物種別（`data` 固定）                | ○    |
| title      | ドキュメント名（表示ページの見出し）     | ○    |
| status     | 状態（`draft` / `ready` / `deprecated`） | ○    |
| rulebook   | 準拠ルール（`specdojo:bdd-rulebook`）    | ○    |
| supersedes | 置き換え関係（旧IDの配列）               | 任意 |

## 5. 本文要件

業務データ辞書のルートには `entities` キーを配置し、各エンティティの構成要素を定義する。

| キー     | 説明                         | 必須 |
| -------- | ---------------------------- | ---- |
| entities | 業務データエンティティの一覧 | ○    |

### 5.1. entities の構成

各エンティティには以下のサブ項目を定義する。

| サブ項目         | 説明                                                                   | 必須     |
| ---------------- | ---------------------------------------------------------------------- | -------- |
| logical_name     | 業務上の論理名（日本語単数形）                                         | ○        |
| physical_name    | DB互換の物理名（lower_snake_case）                                     | ○        |
| description      | 業務データエンティティの説明・役割                                     | 任意     |
| schema_ref       | 正本スキーマへの参照パス（JSON Schema / YAML Schema 等）               | 任意     |
| type_ref         | 正本型定義への参照パス（TypeScript 等、例: `src/types/xxx.ts#Type`）   | 任意     |
| glossary_term_id | 用語集の用語ID（`tm-...`）                                             | 任意     |
| related_terms    | 関連用語IDのリスト                                                     | 任意     |
| key_fields       | キー項目（`physical_name` のリスト）                                   | ○        |
| fields           | 業務データフィールドの一覧（スタンドアロン定義では必須、参照時は任意） | 条件付き |

※ `schema_ref` と `type_ref` は同時に指定できない。どちらも指定しない場合（スタンドアロン定義）は `fields` の定義が必須となる。

### 5.2. fields の構成

各フィールドには以下のサブ項目を定義する。

| サブ項目                | 説明                                                                                                          | 必須     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- | -------- |
| logical_name            | 業務上の論理名（日本語単数形）                                                                                | ○        |
| physical_name           | DB互換の物理名（lower_snake_case）                                                                            | ○        |
| glossary_term_id        | 用語集の用語ID（`tm-...`）                                                                                    | 任意     |
| type                    | データ型（`integer` / `string` / `boolean` / `date` / `datetime` / `enum` / `money`。スタンドアロン時は必須） | 条件付き |
| description             | フィールドの業務的説明・役割                                                                                  | 任意     |
| unit                    | 単位（該当時、例: 円、個、kg）                                                                                | 任意     |
| constraints             | フィールドの制約条件（スタンドアロン定義時）                                                                  | 任意     |
| example                 | フィールドの例値                                                                                              | 任意     |
| allowed_values          | 許容値リスト（簡易列挙。`type: enum` または状態定義時）                                                       | 条件付き |
| allowed_values_detailed | 許容値と業務ラベルのリスト（詳細列挙。`type: enum` または状態定義時）                                         | 条件付き |

※ `type: enum` を指定する場合、またはスキーマ参照エンティティで業務状態の許容値を定義する場合、`allowed_values` または `allowed_values_detailed` のいずれか一方を必須とする。
※ `schema_ref` または `type_ref` を指定したエンティティでは、`type` や `constraints` は参照先で定義されているため省略し、業務上の意味（`description` や `allowed_values_detailed`）のみを記述する。

### 5.3. constraints の構成

スタンドアロン定義で制約条件を明記する場合、以下のサブ項目を用いる。

| サブ項目 | 説明                             | 必須 |
| -------- | -------------------------------- | ---- |
| required | 必須入力かどうか（true / false） | 任意 |
| unique   | 一意性制約（true / false）       | 任意 |
| min      | 最小値                           | 任意 |
| max      | 最大値                           | 任意 |
| pattern  | 正規表現パターン                 | 任意 |

## 6. 記述ガイド

### 6.1. 記述の基本方針

- **業務視点の重視**: 実装要素を無目的に転記するのではなく、業務視点での論理名・役割・状態の意味を簡潔明確に記述する。
- **整合性の維持**: エンティティおよびフィールドの論理名・説明は、概念クラス図（CCD）や用語集（glossary）と完全に整合させる。

### 6.2. スキーマ・実装参照と選定基準

エンティティの定義形態は、対象データの仕様管理状況に応じて次の3通りから選定する。

#### 1. schema があるエンティティ（スキーマ参照: `schema_ref`）

- **選定基準**: 対象エンティティの JSON Schema / YAML Schema / OpenAPI 仕様が既に存在し、物理構造・制約の正本として管理されている場合に選択する。
- **記述規則**:
  - `schema_ref` に正本スキーマのファイルパス（例: `schemas/payment.schema.yaml`）またはポインタ（例: `schemas/order.schema.yaml#/$defs/Payment`）を明記する。
  - `fields` には、スキーマから読み取れない業務上の意味（項目の業務的定義、enum の値が表す業務上の状態遷移や業務ルール上の分岐など）だけを書く。
  - データ型（`type`）、必須（`required`）、最小/最大（`min` / `max`）、パターン（`pattern`）など、スキーマに定義済みの制約は絶対に繰り返さない。

#### 2. schema のないエンティティの選定基準（スタンドアロン定義 vs TypeScript 型参照）

スキーマが存在しないエンティティは、開発フェーズや正本の所在に応じて次のいずれかを選択する。

| 方式                                | 選定基準                                                                                                                                            | 記述規則                                                                                                                  |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **スタンドアロン定義（今の形）**    | 実装（コードやDB）が未着手の企画・要求分析初期フェーズ、または特定の実装言語に依存しない純粋なドメイン概念モデルを独立して定義したい場合に選択する  | `fields` に `type`、`constraints`、`example` などの物理・論理仕様を直接定義する。                                         |
| **TypeScript 型参照（`type_ref`）** | すでに TypeScript で `interface` や `type` が正本として実装・運用されており、JSON Schema がない内部モデルや設定値の業務仕様を整理する場合に選択する | `type_ref` に型定義パス（例: `src/types/xxx.ts#Type`）を明記し、`fields` にはコードから読めない業務的意味のみを記述する。 |

### 6.3. 命名と参照の指針

- 論理名は日本語単数形とする（例: `商品`, `支払い`）。
- 物理名（`physical_name`）は entity / field とも lower_snake_case を用いる（例: `product_code`, `credit_balance`, `payment_status`）。
- アプリケーションコード（TypeScript 等）で参照する場合は、`physical_name` を lowerCamelCase に相互変換して扱う。
- `key_fields` は `physical_name` を指定する。
- `glossary_term_id` は用語集で定義された ID（`tm-...`）と厳密に一致させる。

### 6.4. enum および業務ステータスの記述方法

- enum フィールドや状態遷移を持つ項目では、許容値を必ず明示する。
- 記述方式は用途に応じて選択する:
  - **簡易列挙（`allowed_values`）**: 値の名称自体で意味が自明な場合（例: `allowed_values: [PENDING, PAID, CANCELED]`）。
  - **詳細列挙（`allowed_values_detailed`）**: 各値が表す業務上の状態や画面表示名を明示する場合（`value` と `label` を指定）。スキーマ参照エンティティで状態の業務的意味を定義する際は、原則として詳細列挙を用いる。

### 6.5. 成果物の検証手順

作成・改訂した業務データ辞書 YAML は、以下の手順で合否を確認する。

1. **個別スキーマ検証**:

   ```bash
   npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/bdd.schema.yaml --data <作成したYAMLファイルパス>
   ```

   - **期待結果**: `<ファイルパス>: valid` と表示され、終了コード 0 で正常終了すること。

2. **全体スキーマ・網羅性検証**:

   ```bash
   npm run validate:schema
   ```

   - **期待結果**: YAML スキーマ検証、enum 網羅検証、用語集参照検証がすべてエラーなく完了すること。

3. **構文・フォーマット検証**:

   ```bash
   npm run format:check
   ```

   - **期待結果**: 差分なくフォーマット整合性が保たれていること。

## 7. 禁止事項

- **技術的属性の無断追加の禁止**: 業務要件として監査証跡や有効期限管理・世代管理が明示的に要求され、プロダクトオーナー（PO）またはアーキテクト（ARC）が認めた場合を除き、技術的属性（`created_at`, `updated_at`, `deleted_at` 等）を含めない。例外として含める場合は、業務上の必要性（法的要件・監査要件等）をフィールドの説明（`description`）に明記する。
- **スキーマ・実装定義の二重管理・重複記述の禁止**: `schema_ref` や `type_ref` を指定したエンティティにおいて、正本側に既に定義されているデータ型（`type`）や制約条件（`constraints`）を `fields` 内に再掲・重複記述しない。
- **言語混在・不規則な命名の禁止**: 論理名（`logical_name`）に英数字のみの識別子を記述したり、物理名（`physical_name`）に日本語や lower_snake_case 以外の記法（UpperCamelCase、kebab-case、空白混在等）を使用したりしない。
- **用語集・CCD との不整合の禁止**: 用語集や CCD で定義された用語・ID と異なる名称や略称を使用しない。
- **曖昧な説明・略語のみの記述の禁止**: 意味が不明瞭な説明や、業務的な文脈を欠いた略語のみの記述をしない。

## 8. サンプル

完成例の正本は `specdojo:bdd-sample`（`docs/ja/specdojo/samples/bdd-sample.yaml`）を参照する。以下に、3つのエンティティ定義形態の最小例を示す。

```yaml
# yaml-language-server: $schema=../../../specdojo/schemas/v1/bdd.schema.yaml
id: bdd-sample-minimal
type: data
title: 業務データ辞書（最小例）
status: draft
rulebook: specdojo:bdd-rulebook

entities:
  # 1. スタンドアロン定義（schema のないエンティティ）
  - logical_name: 商品
    physical_name: product
    description: 取扱商品情報
    key_fields: [product_code]
    fields:
      - logical_name: 商品コード
        physical_name: product_code
        type: string
        constraints:
          required: true
      - logical_name: 価格
        physical_name: price
        type: integer
        unit: 円

  # 2. TypeScript 型参照（schema のないエンティティ）
  - logical_name: 取引
    physical_name: transaction
    description: 購買取引記録
    type_ref: src/types/transaction.ts#TransactionRecord
    key_fields: [transaction_id]
    fields:
      - logical_name: 取引種別
        physical_name: transaction_type
        description: 店頭現金販売、掛売り、返品の業務区分

  # 3. スキーマ参照（schema があるエンティティ）
  - logical_name: 支払い
    physical_name: payment
    description: 顧客からの支払い情報
    schema_ref: schemas/payment.schema.yaml
    key_fields: [payment_id]
    fields:
      - logical_name: 支払ステータス
        physical_name: payment_status
        description: 支払い処理の現在状態
        allowed_values_detailed:
          - value: PENDING
            label: 未処理
          - value: PAID
            label: 支払済
          - value: CANCELED
            label: 取消
```
