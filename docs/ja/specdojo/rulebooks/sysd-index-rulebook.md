---
id: sysd-index-rules
type: rulebook
status: draft

---

# システム設計-全体構成 作成ルール

System Design (SYSD) Index Documentation Rules

本ドキュメントは、システム設計情報を **コード（定義ファイル）へ寄せる運用（Code as Spec）** を前提に、
「どこに一次情報（SSOT）があるか」を迷わず辿れるようにする **System Design (SYSD) Index** の記述ルールを定義する。

## 1. 全体方針

SYSD Index は、実装・運用・テスト・レビューに必要な設計情報の **入口（Index）** を 1 箇所に集約し、

- 設計情報の迷子（どこが正か分からない）を防ぐ
- ドキュメントとコードの二重管理を避ける
- 変更時に追随すべき場所を明確にする

ことを目的とする。

Code as Spec の原則:

- SYSD Index は「一次情報」ではなく「導線」とし、仕様本文（詳細）は書かない
- SYSD Index は SSOT（一次情報）へのリンクと最小限の補足のみを記載する
- SSOT は機械可読・差分検知可能な定義を優先する（OpenAPI / migration / workflow / schema など）
- 補足は意図・境界・ルールに限定し、詳細は SSOT に寄せる

## 2. 位置づけと用語定義

### 2.1. 位置づけ

- `sysd-index`：システム設計情報の導線を集約する Index（本書）
- API仕様、DBスキーマ、ジョブ定義、設定スキーマなど：実体を持つ一次情報（SSOT）
- C4 / NFR / OPD / DEC：背景・方針・判断記録の関連ドキュメント

### 2.2. 用語定義

| 用語         | 定義                                                                          |
| ------------ | ----------------------------------------------------------------------------- |
| SYSD Index   | System Design Index。一次情報そのものではなく、設計情報への導線をまとめる文書 |
| SSOT         | Single Source of Truth。仕様の正本となる一次情報                              |
| Code as Spec | コード/定義ファイルを仕様の正本として扱う運用方針                             |

## 3. ファイル命名・ID規則

- SYSD本体の`id` は `sysd-index` （単一の入口文書を前提）。
- ファイル名はプロジェクト内で一意になるよう命名する（例: `システム設計-全体構成リンク集.md`）。
- 並び順が必要な場合は接頭辞の番号付与（例: `sysd-010-...`）を任意で用いてよい。
- `id`（参照用の不変キー）とファイル名（可読性/並び順）は独立であり、ファイル名変更は許容する。

## 4. 推奨 Frontmatter 項目

### 4.1. 設定内容

Frontmatter は共通スキーマに従います（参照: [docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml](../../../specdojo/schemas/v1/deliverable-frontmatter.schema.yaml) / [deliverable-metadata-standard.md](../standards/deliverable-metadata-standard.md)）。

| 項目       | 説明                                                   | 必須 |
| ---------- | ------------------------------------------------------ | ---- |
| id         | SYSD ID（推奨: `sysd-index`）                          | ○    |
| type       | `architecture` など、共通スキーマで許容される種別      | ○    |
| title      | システム設計: 全体構成（リンク集）など対象が分かる名称 | ○    |
| status     | `draft` / `ready` / `deprecated`                       | ○    |
| based_on   | 根拠となる仕様ID（ID配列。未指定は `[]` 可）           | 任意 |
| supersedes | 置き換え関係（ID配列。未指定は `[]` 可）               | 任意 |

### 4.2. 推奨ルール

- `based_on` には導線設計の判断に直接利用した成果物のみ列挙する。
- `based_on` / `supersedes` は ID 配列（未指定は `[]` 可）。

## 5. 本文構成（標準テンプレ）

`sysd-index` は以下の見出し構成を **順序固定** で配置する。

| 番号 | 見出し                                           | 必須 |
| ---- | ------------------------------------------------ | ---- |
| 1    | 概要（対象範囲・更新責任）                       | ○    |
| 2    | SSOT 一覧（表形式）                              | ○    |
| 3    | 自動生成物（生成コマンド/生成先/閲覧先）         | 任意 |
| 4    | 変更の入口（どこを修正すればよいか：典型ケース） | ○    |
| 5    | 関連ドキュメント導線（C4 / NFR / OPD / DEC 等）  | ○    |

補足:

- 本文は「リンク集」としての導線に徹し、仕様本文の再掲はしない。
- `3. 自動生成物` を省略する場合は `（なし）` または `（該当なし）` を明記する。

## 6. 記述ガイド

### 6.1. 概要（対象範囲・更新責任）

生成する本文の見出しは **## 1. 概要（対象範囲・更新責任）**

- SDI が扱う範囲（内部API、内部イベント、外部I/F、DB、ジョブ、設定、モジュール境界）を明記する。
- 更新責任（Owner）を role ベースで明記する。

### 6.2. SSOT 一覧（表形式）

生成する本文の見出しは **## 2. SSOT 一覧（表形式）**

SDI の中核は **SSOT 一覧表** とする。

必須列:

- 種別（Category）
- SSOT（一次情報の種類）
- 参照先（パス/場所/リンク）
- 更新責任（Owner：role でよい）
- 備考（最小補足：任意）

種別（Category）の推奨値:

- Internal API
- Internal Events
- External I/F
- Database Schema
- Jobs / Batch
- Configurations
- Observability（ログ/監査/トレースの定義がある場合）
- Module Boundary（依存方向・構成の規約）

参照先の書き方:

- 原則：リポジトリ相対パス（例：`api/openapi.yaml`）
- 外部URLは最小限（SaaSの画面リンク等）。可能なら repo 内に保存する
- 複数ある場合は代表を1つ示し、備考で派生を列挙する

備考（書いてよい補足）:

- CIで検証されること（lint/互換性チェック/差分検知）
- バージョニング方針の入口（詳細はSCR/DECへ）
- 読者や利用方法の要点（1〜2行）

### 6.3. 自動生成物（任意）

生成する本文の見出しは **## 3. 自動生成物（生成コマンド/生成先/閲覧先）**

- OpenAPI → HTML/Swagger UI
- AsyncAPI → HTML
- migration → schema dump / ERD
- config schema → 設定一覧ドキュメント

`生成コマンド` と `生成先` を記載し、CI更新であればその旨を明記する。

### 6.4. 変更の入口（典型ケース）

生成する本文の見出しは **## 4. 変更の入口（典型ケース）**

- SSOT を追加/移動/削除したら、必ず SDI を更新する。
- SDI 更新はリンク表の差分を中心とし、仕様本文は更新対象に含めない。
- 典型ケース（例: API追加、テーブル追加、ジョブ追加）ごとに「どこを修正するか」を短く記述する。

### 6.5. 関連ドキュメント導線

生成する本文の見出しは **## 5. 関連ドキュメント導線）**

- C4 / NFR / OPD / DEC など、判断・方針系ドキュメントへの導線を明記する。
- 分冊が無い場合でも `（なし）` または `（本書のみ）` を明記する。

## 7. 禁止事項

| 禁止事項                               | 理由                                   |
| -------------------------------------- | -------------------------------------- |
| SDI に API/DB の詳細仕様本文を再掲する | SSOTとの二重管理となり不整合を招くため |
| 実装クラス図や画面分割の詳細を列挙する | SDIの責務（導線）を逸脱するため        |
| 古い/未使用/不明確なリンクを残す       | Indexとしての信頼性が低下するため      |
| Owner を未記載にする                   | 更新責任が不明となり形骸化するため     |
| 備考に詳細仕様を書き始める             | 本文肥大化と責務混在を招くため         |

## 8. サンプル

注：以下はルール文書内の例示です。生成する `sysd-index` では `## 1...` から始まります。

```yaml
---
id: sysd-index
type: architecture
title: システム設計: 全体構成リンク集
status: draft
based_on: []
supersedes: []
---
```

### 8.1. 概要（対象範囲・更新責任）

本書は、システム設計情報のSSOTを参照するための導線を一元化する。
更新責任: Dev Lead（構成管理）/ Ops Lead（運用系SSOT）

### 8.2. SSOT 一覧（例）

<!-- prettier-ignore -->
| 種別 | SSOT | 参照先 | 更新責任 | 備考 |
| --- | --- | --- | --- | --- |
| Internal API | OpenAPI | `api/openapi.yaml` | Dev | CIでlint、破壊的変更はDEC必須 |
| Internal Events | AsyncAPI + CloudEvents | `api/asyncapi.yaml` | Dev | schema互換性チェックを実施 |
| External I/F | 外部連携定義 | `spec/external-if/` | Dev | 接続先契約変更時は `dec-*` を更新 |
| Database Schema | migrations | `db/migrations/` | Dev | schema dumpはCI生成 |
| Jobs / Batch | workflow | `ops/workflows/` | Ops | 失敗時通知・リトライもここで定義 |
| Configurations | config schema | `config/schema.yaml` | Dev/Ops | 上書き階層はSCR参照 |
| Observability | ログ/監査定義 | `ops/observability/` | Ops | 監査ログ保持方針は `opd-*` 参照 |
| Module Boundary | package rule | `docs/architecture/module-boundary.md` | Dev | 依存方向はSCR参照 |

### 8.3. 自動生成物（例）

| 生成物        | 入力SSOT            | 生成コマンド            | 生成先                     | 閲覧先                               | 更新方式 |
| ------------- | ------------------- | ----------------------- | -------------------------- | ------------------------------------ | -------- |
| OpenAPI Docs  | `api/openapi.yaml`  | `npm run docs:openapi`  | `docs/generated/openapi/`  | `docs/generated/openapi/index.html`  | CI       |
| AsyncAPI Docs | `api/asyncapi.yaml` | `npm run docs:asyncapi` | `docs/generated/asyncapi/` | `docs/generated/asyncapi/index.html` | CI       |
| ERD           | `db/migrations/`    | `npm run docs:erd`      | `docs/generated/erd/`      | `docs/generated/erd/index.html`      | CI       |

### 8.4. 変更の入口（典型ケース例）

| 変更トリガ            | 最初に直す場所（SSOT） | 併せて更新する場所                       | 完了条件（最低限）        |
| --------------------- | ---------------------- | ---------------------------------------- | ------------------------- |
| APIエンドポイント追加 | `api/openapi.yaml`     | `docs/generated/openapi/`, SDIのSSOT一覧 | API lint通過、SDI導線追加 |
| テーブル追加          | `db/migrations/`       | `docs/generated/erd/`, SDIのSSOT一覧     | migration適用可、ERD更新  |
| バッチ新設            | `ops/workflows/`       | 監視設定、SDIのSSOT一覧                  | 実行定義・通知先が明記    |
| 設定項目追加          | `config/schema.yaml`   | 設定一覧生成物、SDIのSSOT一覧            | 既定値・型・説明が確定    |

### 8.5. 関連ドキュメント導線（例）

| 種別     | ドキュメントID      | 目的                           | 備考                   |
| -------- | ------------------- | ------------------------------ | ---------------------- |
| アーキ   | cpd-business-domain | 外部境界・依存先の把握         | 入口として必須         |
| 品質     | nfr-index           | 非機能要件との整合確認         | 可用性・性能の判断基準 |
| 運用方針 | opd-index           | 運用統制（監視/証跡/権限）確認 | 監査観点で参照         |
| 決定記録 | dec-index           | 設計判断の背景追跡             | 破壊的変更時に必須     |
