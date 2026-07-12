---
specdojo:
  id: bdd-rulebook
  type: rulebook
  status: draft
  target_format: yaml
---

# 業務データ辞書 作成ルール

Business Data Dictionary (BDD) Documentation Rules

本ドキュメントは、業務分析・要求定義・システム設計のために **業務データ辞書を記述する標準ルール**です。
業務上の管理単位（エンティティ）とその属性（項目）の論理名・物理名・説明・制約などを定義します。
データの意味や構造に関する共通理解を関係者間で図り、システム設計や実装の基礎情報として活用します。

## 1. 全体方針

- 業務分析・要求定義・設計で共通利用する業務データ辞書を、YAMLで統一的に定義する。
- 業務上の管理単位（エンティティ）と属性（フィールド）の意味・制約・例値を、判断可能な粒度で記述する。
- 実装詳細の仕様書ではなく、業務概念とデータ定義の共通理解を形成するための基準文書として扱う。

## 2. 位置づけと用語定義

- 本ルールは `type: data` の成果物に適用する。
- `logical_name` は業務利用者が理解できる論理名、`physical_name` はDB列互換の物理名を指す。
- `glossary_term_id` は用語集との参照キー、`related_terms` は関連用語への補助参照を指す。

## 3. ファイル命名・ID規則

### 3.1. ID規約

- `id` は正規表現 `^bdd-[a-z0-9-]+$` に合致する一意IDを用いる。
- `type` は `domain` 固定とする。
- 置き換えがある場合は `supersedes` に旧IDを列挙する。

### 3.2. ファイル命名規約

- ファイルは YAML 形式（`.yaml`）で管理する。
- ファイル名は、idと同じ名称 `bdd-<term>.yaml` を推奨。日本語の場合は、`業務データ辞書-<用語>.yaml` のように、一貫性を持たせて命名する。

## 4. 推奨 Frontmatter 項目

Frontmatter と同等の以下の項目をYAMLドキュメントの先頭に必ず定義してください。

| 項目       | 説明                                     | 必須 |
| ---------- | ---------------------------------------- | ---- |
| id         | データ辞書ID（`bdd-...`）                | ○    |
| type       | `domain` 固定                            | ○    |
| title      | ドキュメント名。表示ページの見出しになる | ○    |
| status     | `draft` / `ready` / `deprecated`         | ○    |
| rulebook   | `bdd-rulebook` 固定                      | ○    |
| supersedes | 置き換え関係（古仕様→新仕様）            | 任意 |

## 5. 本文構成（標準テンプレ）

| キー     | 説明                         | 必須 |
| -------- | ---------------------------- | ---- |
| entities | 業務データエンティティの一覧 | ○    |

### 5.1. entities の標準構成

| サブ項目         | 説明                                 | 必須 |
| ---------------- | ------------------------------------ | ---- |
| logical_name     | 業務上の論理名（日本語単数形）       | ○    |
| physical_name    | DB互換の物理名（lower_snake_case）   | ○    |
| description      | 業務データの説明                     | 任意 |
| glossary_term_id | 用語集の用語ID                       | 任意 |
| related_terms    | 関連用語IDリスト                     | 任意 |
| key_fields       | キー項目（`physical_name` のリスト） | ○    |
| fields           | 業務データフィールドの一覧           | ○    |

### 5.2. fields の標準構成

| サブ項目         | 説明                                                                    | 必須 |
| ---------------- | ----------------------------------------------------------------------- | ---- |
| logical_name     | 業務上の論理名（日本語単数形）                                          | ○    |
| physical_name    | DB互換の物理名（lower_snake_case）                                      | ○    |
| glossary_term_id | 用語集の用語ID                                                          | 任意 |
| type             | データ型（integer / string / boolean / date / datetime / enum / money） | ○    |
| description      | フィールドの説明                                                        | 任意 |
| unit             | 単位（該当時）                                                          | 任意 |
| constraints      | フィールドの制約条件                                                    | 任意 |
| example          | フィールドの例値                                                        | 任意 |

### 5.3. constraints の標準構成

| サブ項目 | 説明                             | 必須 |
| -------- | -------------------------------- | ---- |
| required | 必須入力かどうか（true / false） | 任意 |
| unique   | 一意性制約（true / false）       | 任意 |
| min      | 最小値                           | 任意 |
| max      | 最大値                           | 任意 |
| pattern  | 正規表現パターン                 | 任意 |

## 6. 記述ガイド

### 6.1. 記述の基本方針

- 業務視点の論理名・説明を重視し、実装要素は必要最小限に留める。
- データ項目の意味・制約・例値・関連情報を簡潔かつ明確に記述する。
- エンティティ・項目の論理名と説明は、概念クラス図（CCD）と用語集（glossary）に整合させる。

### 6.2. 命名と参照の指針

- 論理名は日本語単数形で記載する。
- 物理名（`physical_name`）は entity / field とも lower_snake_case を用いる（例: `product_code`, `credit_balance`, `payment_status`）。
- アプリケーション（TypeScript等）で利用する場合は、`physical_name` を lowerCamelCase に変換して扱う。
- `key_fields` は `physical_name` を参照する。
- `glossary_term_id` は用語集で定義されたIDと一致させる。

### 6.3. enum の記述方法

- `type: enum` のフィールドは許容値を必ず明示する。
- 記述方式は次のいずれかを採用する。
  - 簡易列挙: `allowed_values: [PENDING, PAID, CANCELED]`
  - 詳細列挙: `allowed_values_detailed:` に `value` と `label` を持つ配列を記述する。

## 7. 禁止事項

- 技術的属性（`created_at`, `updated_at`, `deleted_at` など）を原則含めない。
- 実装都合のカラムや API 用の構造体をそのまま記載しない。
- 用語集や CCD と不整合な用語・IDを使わない。
- 物理名と論理名で英語・日本語を無秩序に混在させない。
- 意味が曖昧な説明や略語のみの記載をしない。

## 8. サンプル

- 参照先: [[bdd-sample]]
