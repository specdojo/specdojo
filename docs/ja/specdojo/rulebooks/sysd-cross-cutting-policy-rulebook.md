---
id: sysd-cross-cutting-policy-rules
type: rulebook
status: draft

---

# システム設計 / 横断ルール 作成ルール

System Design Cross-cutting Policy (SYSD-CCP) Documentation Rules

本ドキュメントは、システム設計情報を **コード（定義ファイル）へ寄せる運用（Code as Spec）** を前提に、
実装全体に影響する共通ルールを最小限でSSOT化する **System Design Cross-cutting Policy (SYSD-CCP)** の記述ルールを定義する。

SYSD-CCP は「詳細実装の手順書」ではない。
**全体に共通する“前提”と“禁止事項”と“例外時の扱い”** を明確にし、実装ブレと事故を防ぐ。

## 1. 全体方針

SYSD-CCP は、以下を目的とする。

- 横断的な実装判断（エラー形式、冪等、リトライ、ログ、認証/認可、トランザクション等）を統一する
- チーム内の暗黙知を減らし、レビュー観点を安定させる
- テスト（ITS/ETS/STC）と運用（OPD/OPR）に必要な共通前提を提供する
- 詳細をコードへ寄せつつ、**“コードから自動生成できない意図”** を残す

基本方針:

- ルールは「最小限」かつ「強い」を原則とし、禁止・必須・例外条件を明確にする
- ルールは可能な限り測定可能/検証可能（CI/lint/テスト）な形で定義する
- 例外は SYSD-CCP 本文に散らさず、DECで理由と影響範囲を管理する

## 2. 位置づけと用語定義（必要に応じて）

### 2.1. 位置づけ

- `sysd-cross-cutting-policy`：実装全体に適用する横断ルールのSSOT
- `sysd-index`：実体定義（OpenAPI/AsyncAPI/schema/workflow など）への導線
- `sysd-critical-flows`：事故予防のための重要フロー（難所）
- `nfr-*`：非機能要件の基準値
- `opd-*` / `opr-*`：運用方針・運用手順
- `dec-*`：例外や設計判断の根拠

### 2.2. 用語定義

| 用語        | 定義                                                          |
| ----------- | ------------------------------------------------------------- |
| 横断ルール  | 複数モジュール/サービスに共通して適用される実装・運用の規約   |
| 例外        | SYSD-CCPの通常ルールから外れる運用。理由と期限をDECで明示する |
| Enforcement | ルールを守らせる検証手段（CI、テスト、レビュー等）            |

## 3. ファイル命名・ID規則

- 生成対象ドキュメントIDは `sysd-cross-cutting-policy` を推奨する。
- ルールIDは `scp-<カテゴリ>-<連番>` を推奨する（例: `scp-ERR-001`）。
- カテゴリ例：`ERR`, `API`, `RET`, `IDM`, `TXN`, `LOG`, `SEC`, `CFG`, `MOD`, `JOB`。
- 1ルール=1論点を原則とし、例外条件と意図は同一ルール内で簡潔に記述する。

## 4. 推奨 Frontmatter 項目

### 4.1. 設定内容

Frontmatter は共通スキーマに従います（参照: [docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml](../../../specdojo/schemas/v1/deliverable-frontmatter.schema.yaml) / [document-metadata-standard.md](../standards/document-metadata-standard.md)）。

| 項目       | 説明                                              | 必須 |
| ---------- | ------------------------------------------------- | ---- |
| id         | SYSD-CCP ID（推奨: `sysd-cross-cutting-policy`）  | ○    |
| type       | `architecture` など、共通スキーマで許容される種別 | ○    |
| title      | システム設計: 横断ルール                          | ○    |
| status     | `draft` / `ready` / `deprecated`                  | ○    |
| based_on   | 根拠となる仕様ID（ID配列。未指定は `[]` 可）      | 任意 |
| supersedes | 置き換え関係（ID配列。未指定は `[]` 可）          | 任意 |

### 4.2. 推奨ルール

- `based_on` にはルール策定に直接利用した成果物のみ列挙する。
- `based_on` / `supersedes` は ID 配列（未指定は `[]` 可）。

## 5. 本文構成（標準テンプレ）

`sysd-cross-cutting-policy` は以下の見出し構成を **順序固定** で配置する。

| 番号 | 見出し                                                          | 必須 |
| ---- | --------------------------------------------------------------- | ---- |
| 1    | 概要（適用範囲・優先順位）                                      | ○    |
| 2    | ルール一覧（ID/カテゴリ/要約/必須度）                           | ○    |
| 3    | 各ルール詳細（ID単位）                                          | ○    |
| 4    | 例外（DECリンク）                                               | ○    |
| 5    | 関連ドキュメント導線（SDI/SYSD Critical Flows/NFR/OPD/OPR/DEC） | ○    |

補足:

- ルール一覧は「探しやすさ」を最優先し、カテゴリ単位で整理する。
- 例外の詳細本文は書かず、例外条件の入口とDECリンクのみを置く。

## 6. 記述ガイド

### 6.1. 概要（適用範囲・優先順位）

生成する本文の見出しは **## 1. 概要（適用範囲・優先順位）**

- SYSD-CCP が対象とする範囲（横断ルールの適用境界）を 1〜3 段落で明記する。
- 「ルールは最小限」「検証可能性を優先」「例外はDECで管理」の原則を明記する。
- ルール間の優先順位（例: `SEC > ERR > RET > IDM > LOG > CFG > MOD > JOB`）を必要に応じて明示する。

### 6.2. ルール一覧（ID/カテゴリ/要約/必須度）

生成する本文の見出しは **## 2. ルール一覧（ID/カテゴリ/要約/必須度）**

- ルールID、カテゴリ、要約、必須度（MUST/MUST NOT/SHOULD）、Owner を表形式で記載する。
- 一覧は「探しやすさ」を優先し、カテゴリ順または重要度順で並べる。
- ルール詳細本文に飛べる参照（IDの一致）を必ず担保する。

### 6.3. 各ルール詳細（ID単位）

生成する本文の見出しは **## 3. 各ルール詳細（ID単位）**

各ルールは以下を必ず含める。

- **Rule（必須/禁止）**：何を守るか（MUST / MUST NOT / SHOULD）
- **Rationale（意図）**：なぜ必要か（1〜3行）
- **Scope（適用範囲）**：どこに適用するか（API/ジョブ/イベント等）
- **Enforcement（検証）**：どう検証するか（CI/テスト/レビュー）
- **Exception（例外）**：例外条件と参照すべきDEC（ある場合）
- **References（参照）**：SDI/SYSD Critical Flows/NFR/OPD/OPR等への導線

### 6.4. 例外（DECリンク）

生成する本文の見出しは **## 4. 例外（DECリンク）**

- 例外の詳細本文は書かず、例外条件・影響範囲・期限・DECリンクのみを記載する。
- 例外が恒久化しそうな場合は、SYSD-CCP本体ルールへの取り込み可否を定期レビューする。
- 例外未記載の実装差分は不適合として扱う。

### 6.5. 関連ドキュメント導線

生成する本文の見出しは **## 5. 関連ドキュメント導線（SYSD/SYSD-CF/NFR/OPD/OPR/DEC）**

- ルールごとに、SYSD（一次情報）、SYSD Critical Flows（重要フロー）、NFR、OPD/OPR、DEC への導線を明記する。
- 参照先は「ID」または「リポジトリ相対パス」で一意に辿れる形にする。
- 分冊が無い場合でも `（本書のみ）` または `（なし）` を明記し、空欄にしない。

### 6.6. SYSD-CCP が扱う対象（推奨カテゴリ）

- API契約の共通ルール（バージョニング、互換性、エラー形式）
- 例外/エラー処理（分類、再試行可否、ユーザ通知）
- タイムアウト/リトライ（回数、バックオフ、打ち切り、冪等前提）
- 冪等（キー、重複排除、整合性）
- トランザクション/整合性（境界、最終的整合性、補償）
- ログ/監査ログ（必須項目、保持、PII取り扱い）
- トレーシング（trace_id、propagation）
- セキュリティ（認証・認可の実装原則、秘密情報、監査）
- 設定（上書き階層、変更反映、デフォルト管理）
- モジュール境界/依存方向（アーキ制約）
- ジョブ運用の共通（再実行性、run_id、失敗時通知）

### 6.7. 必須で定義すべき最小ルールセット（推奨）

1. **共通エラー形式（API）**：error_code / message / detail / trace_id
2. **エラー分類**：再試行可否、ユーザ通知可否、監査要否
3. **タイムアウト既定値**：内部/外部の基準値
4. **リトライ規約**：回数、バックオフ、打ち切り、冪等前提
5. **冪等キー**：どこで必須か、重複時の挙動
6. **トランザクション境界**：commitの責務、跨ぎの扱い（非同期/補償）
7. **ログ必須項目**：trace_id / request_id / entity_id / result 等
8. **監査ログ**：who/when/what/before/after、保持期間、PII
9. **認証/認可の原則**：ポリシーの置き場、権限チェック責務
10. **設定上書き階層**：既定値・環境・テナント等、反映方法
11. **モジュール依存方向**：禁止依存、例外手続き
12. **ジョブ再実行性**：run_id、冪等、失敗時通知

### 6.8. SYSD-CCP に書かないもの

- OpenAPI/AsyncAPI/DB schema の本文コピー（SSOTと二重管理）
- 画面仕様の詳細（UISへ）
- 低レベル実装手順（OPR/Runbookやコードコメントへ）
- プロジェクト固有の一時対応の羅列（運用チケット/OPRへ）

## 7. 禁止事項

| 禁止事項                                      | 理由                         |
| --------------------------------------------- | ---------------------------- |
| ルールを増やし続け、インデックス管理しない    | 探索性が落ちるため           |
| 努力目標表現のみで MUST / MUST NOT を示さない | 実装判断がぶれるため         |
| 例外をSYSD-CCP本文に散在させる                | 例外管理が追跡不能になるため |
| SSOT本文（OpenAPI/DDL等）を貼り付ける         | 二重管理で不整合を招くため   |
| 検証方法（CI/テスト/レビュー）を書かない      | ルールが形骸化するため       |

## 8. サンプル

注：以下はルール文書内の例示です。生成する `sysd-cross-cutting-policy` では `## 1...` から始まります。

```yaml
---
id: sysd-cross-cutting-policy
type: architecture
title: システム設計: 横断ルール
status: draft
based_on: []
supersedes: []
---
```

### 8.1. 概要（適用範囲・優先順位）

本書は、実装全体に適用する横断ルールを統一し、レビュー判断と運用判断を一貫させるための基準である。
優先順位は `SEC > ERR > RET > IDM > LOG > CFG > MOD > JOB` を原則とする。

### 8.2. ルール一覧（ID/カテゴリ/要約/必須度）

<!-- prettier-ignore -->
| Rule ID | Category | Summary | Level | Owner |
| --- | --- | --- | --- | --- |
| scp-API-001 | API | 共通エラー応答形式を統一する | MUST | Dev |
| scp-RET-001 | Retry/Timeout | 外部I/Fのタイムアウトとリトライ規約 | MUST | Dev/Ops |
| scp-IDM-001 | Idempotency | 更新系APIは冪等キーを必須とする | MUST | Dev |
| scp-LOG-001 | Logging | 共通ログ項目（trace_id等） | MUST | Dev |
| scp-SEC-001 | Security | 認可チェック責務と境界 | MUST | Dev |
| scp-CFG-001 | Config | 設定上書き階層と反映方法 | MUST | Dev/Ops |
| scp-MOD-001 | Module | 依存方向（domain←app←interface） | MUST | Dev |
| scp-JOB-001 | Job | run_id と再実行性 | MUST | Ops |

### 8.3. 各ルール詳細（ID単位）

#### scp-API-001: 共通エラー応答形式

- **Rule（MUST）**
  すべてのHTTP APIは、エラー時に共通フォーマットで応答する。
  必須フィールド：`error_code`, `message`, `detail`, `trace_id`

- **Rationale（意図）**
  クライアント実装の分岐を減らし、障害解析を高速化する。

- **Scope（適用範囲）**
  内部API・外部公開API（REST）すべて。

- **Enforcement（検証）**
  OpenAPIにエラースキーマを共通定義し、CIでlintする。
  ITSで代表エラーケースを検証する。

- **Exception（例外）**
  例外が必要な場合はDECを起票し、影響範囲と移行方針を明記する。

- **References（参照）**
  SDI：OpenAPI定義（`api/openapi.yaml`）
  テスト：ITC（エラー系） / 運用：OPD（アラート）

#### scp-RET-001: 外部I/Fのタイムアウトとリトライ

- **Rule（MUST）**
  外部I/F呼び出しはタイムアウトを必ず設定し、最大3回まで指数バックオフでリトライする。
  リトライは **冪等が担保できる場合のみ** 実施する。

- **Rationale（意図）**
  ハング/遅延の波及を防ぎ、外部障害時の影響を限定する。

- **Scope（適用範囲）**
  外部API、外部メッセージ送信、外部ファイル転送。

- **Enforcement（検証）**
  ETSでタイムアウト/リトライ/二重送信防止を検証する。
  リトライ回数・待機は設定で制御し、既定値をconfig schemaで固定する。

- **Exception（例外）**
  課金など二重実行が致命的な場合は、DECで別方式（補償/確認照会）を定義する。

- **References（参照）**
  SDI：外部I/F仕様（OpenAPI/AsyncAPI/EFES）
  SYSD Critical Flows：外部決済フロー（存在する場合）
  OPD：外部I/Fの監視指標（エラー率/レイテンシ）

#### scp-MOD-001: モジュール依存方向

- **Rule（MUST NOT / MUST）**
  `domain` は `application` / `interface` に依存してはならない。
  依存方向は **domain ← application ← interface** を守る。

- **Rationale（意図）**
  ドメインロジックを技術詳細から分離し、変更耐性とテスト容易性を高める。

- **Scope（適用範囲）**
  全コード（ビルド単位/パッケージ/ディレクトリ）。

- **Enforcement（検証）**
  静的解析/アーキテクチャテスト（例：依存ルールテスト）で検証する。
  PRレビューで違反をブロックする。

- **Exception（例外）**
  例外は原則認めない。やむを得ない場合はDECで期限付き例外とする。

- **References（参照）**
  SDI：モジュール境界ドキュメント/規約へのリンク
  テスト：UTS（層別テスト方針）

### 8.4. 例外（DECリンク）

| Rule ID     | 例外条件                 | 影響範囲            | 期限       | DEC                                 |
| ----------- | ------------------------ | ------------------- | ---------- | ----------------------------------- |
| scp-RET-001 | 外部課金APIで再送が不可  | 決済機能のみ        | 2026-12-31 | `dec-00xx-payment-retry-exception`  |
| scp-MOD-001 | 移行期間中の一時依存許容 | legacy adapter のみ | 2026-06-30 | `dec-00yy-legacy-dependency-waiver` |

### 8.5. 関連ドキュメント導線（SYSD/SYSD-CF/NFR/OPD/OPR/DEC）

| 種別       | ドキュメントID/参照先                                  | 目的                         | 備考 |
| ---------- | ------------------------------------------------------ | ---------------------------- | ---- |
| SSOT       | sysd-index / `api/openapi.yaml` / `config/schema.yaml` | 一次情報参照                 | 必須 |
| 重要フロー | sysd-critical-flows                                    | 難所フローでのルール適用確認 | 必須 |
| 非機能     | nfr-index                                              | タイムアウト/SLA/SLO整合     | 必須 |
| 運用       | opd-index / opr-index                                  | 監視・障害対応・証跡運用     | 必須 |
| 判断記録   | dec-index                                              | 例外・設計判断の追跡         | 必須 |
