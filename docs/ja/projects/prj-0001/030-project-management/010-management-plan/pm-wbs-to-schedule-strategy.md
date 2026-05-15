---
id: prj-0001:pm-wbs-to-schedule-strategy
type: project
status: draft
rulebook: pm-wbs-to-schedule-strategy-rulebook
---

# WBS から Schedule への展開戦略

WBS to Schedule Strategy

本ドキュメントは、`030-project-management/wbs/` 配下の WBS 定義を `030-project-management/schedule/` 配下の Schedule 定義へ落とし込む際のタスク分解方針、依存関係、タスク長、`id` 命名規則を定義します。

## 1. 目的と適用範囲

- 入力は `docs/ja/projects/prj-0001/030-project-management/wbs/` 以下の `wbs-<domain>.yaml` です。
- 出力は `docs/ja/projects/prj-0001/030-project-management/schedule/` 配下の Schedule 定義ファイルです。
- Schedule 定義ファイルはファイル種別ごとの Schedule スキーマに従います。
- WBS が定義する **WHAT（何を作るか）** を、Schedule では **WHEN（いつ）** と **ORDER（どの順序で行うか）** に展開します。

## 2. 基本方針

| 観点       | 方針                                                                 |
| ---------- | -------------------------------------------------------------------- |
| 展開単位   | `1 WBS Item = 1〜3 Task` を基本とする                                |
| 対象範囲   | WBS 定義ファイルに存在する WBS Item のみを対象とする                 |
| 実行性     | 各 Task は 1 回の作業または 1 回のレビューで完了確認できる単位にする |
| 依存最小化 | 真に着手不能となる前提のみ `depends_on` に記述する                   |
| 並列性     | 同時に進められる Task は直列化せず、並列実行可能にする               |
| 判定可能性 | Task 完了は成果物レビューまたは検証結果で確認できる状態にする        |
| 責務分離   | WBS は成果物単位、Schedule は実行順序・期間・依存関係を扱う          |
| 管理単位   | Schedule は `schedule_track` 単位で管理する                          |

## 3. Schedule 定義ファイルの種類

Schedule 定義ファイルは、`schedule_level` により粒度を区別します。

| schedule_level    | 役割                               | 主な内容                                       |
| ----------------- | ---------------------------------- | ---------------------------------------------- |
| `milestones`      | 管理単位内のゲート定義             | 開始、レビュー、承認、完了などのマイルストーン |
| `domain`          | 単一ドメインのスケジュール         | ドメイン内の Task                              |
| `container`       | 単一コンテナの詳細スケジュール     | サービス、機能、モジュール単位の Task          |
| `cross-domain`    | 複数ドメインを横断するスケジュール | ドメイン間の依存や横断 Task                    |
| `cross-container` | 複数コンテナを横断するスケジュール | コンテナ間の依存や横断 Task                    |

`schedule_level` はスケジュールの粒度を表します。
一方、`schedule_track` はスケジュールの管理単位を表します。

例:

```yaml
schedule_track: launch
schedule_track_code: LCH
```

```yaml
schedule_track: release-001
schedule_track_code: REL001
```

## 4. Schedule ファイル分割ルール

Schedule ファイル名は、`schedule_track` と `schedule_level` が分かる形式にします。

### 4.1. Milestones Schedule

```text
sch-<schedule-track>-milestones.yaml
```

例:

```text
sch-launch-milestones.yaml
```

`schedule_level` は `milestones` とします。
`domain` と `container` は記述しません。

### 4.2. Domain Schedule

```text
sch-<schedule-track>-<domain>.yaml
```

例:

```text
sch-launch-project-definition.yaml
sch-launch-project-management.yaml
```

`schedule_level` は `domain` とし、`domain` を必ず記述します。

### 4.3. Container Schedule

```text
sch-<schedule-track>-<domain>-<container>.yaml
```

例:

```text
sch-launch-business-specifications-order.yaml
sch-release-001-system-design-auth-api.yaml
```

`schedule_level` は `container` とし、`domain` と `container` を必ず記述します。

### 4.4. Cross-domain Schedule

```text
sch-<schedule-track>-cross-domain.yaml
```

例:

```text
sch-launch-cross-domain.yaml
```

`schedule_level` は `cross-domain` とし、対象ドメインを `domains` に列挙します。

### 4.5. Cross-container Schedule

```text
sch-<schedule-track>-<domain>-cross-container.yaml
```

例:

```text
sch-release-001-system-design-cross-container.yaml
```

`schedule_level` は `cross-container` とし、対象コンテナを `containers` に列挙します。

## 5. WBS から Task への分解ルール

### 5.1. 原則

Schedule 化の対象は、WBS 定義ファイルに存在する WBS Item のみとします。

```text
1 WBS Item = 1〜3 Task
```

1 つの WBS Item をそのまま 1 Task にしてよいのは、1 回の作業またはレビューで完了確認できる場合です。

### 5.2. 分割する条件

次のいずれかに該当する場合は、Task を分割します。

1. 1 回の作業で完了確認まで到達しない
2. 中間成果物にレビューゲートが必要
3. 担当ロールや専門性が途中で切り替わる
4. 依存関係を切り出した方が並列化または再計画しやすい
5. 作成とレビューを分けた方が完了状態を判断しやすい

### 5.3. 推奨パターン

| パターン | 使いどころ                 | Task 例                        |
| -------- | -------------------------- | ------------------------------ |
| 1 Task   | 軽量な単独成果物           | 作成・レビューを 1 Task で扱う |
| 2 Task   | 通常の文書成果物           | 作成 → レビュー                |
| 3 Task   | 段階的な整備が必要な成果物 | 作成 → 検証 → レビュー         |

Task を細かくしすぎると依存関係が増えるため、原則として 1 WBS Item あたり 3 Task 以内に収めます。

## 6. Task `id` 命名規則

### 6.1. 基本形式

Task の `id` は次の形式を基本とします。

```text
T-<TRACK>-<SUBJECT>-<NNN>
```

例:

```text
T-LCH-PRJ-OVERVIEW-010
T-LCH-PRJ-SCOPE-020
T-LCH-PM-PLAN-030
T-LCH-PM-COMMUNICATION-PLAN-040
T-REL001-AUTH-API-IFX-010
```

### 6.2. 各要素

| 要素      | ルール                                                        |
| --------- | ------------------------------------------------------------- |
| `TRACK`   | `schedule_track_code` を使用する                              |
| `SUBJECT` | `schedule_track` 内で一意に作業対象を識別できるキーを使用する |
| `NNN`     | 3 桁、`010` 刻みで採番する                                    |

`SUBJECT` は、必要に応じて domain、container、成果物名、作業種別を含めてよいものとします。

例:

| 対象                          | SUBJECT 例        |
| ----------------------------- | ----------------- |
| プロジェクト概要              | `PRJ-OVERVIEW`    |
| プロジェクトスコープ          | `PRJ-SCOPE`       |
| プロジェクト管理計画          | `PM-PLAN`         |
| 注文業務仕様                  | `BSP-ORDER-BPS`   |
| 認証 API インターフェース設計 | `AUTH-API-IFX`    |
| 決済 API インターフェース設計 | `PAYMENT-API-IFX` |

### 6.3. WBS Item との対応

Task は、`wbs` フィールドで対応する WBS Item を参照します。

```yaml
id: T-LCH-PRJ-OVERVIEW-010
wbs: WBS-PJD-PRJ-OVERVIEW-010
```

Task ID は Schedule 側の実行管理 ID であり、WBS Item ID と完全一致させる必要はありません。
トレーサビリティは `wbs` により担保します。

### 6.4. 複数 Task に分割する場合

1 つの WBS Item を複数 Task に分割する場合は、同じ `SUBJECT` を維持し、`NNN` で区別します。

```text
WBS-PJD-PRJ-OVERVIEW-010
  → T-LCH-PRJ-OVERVIEW-010
  → T-LCH-PRJ-OVERVIEW-020
```

作業種別を明示した方が分かりやすい場合は、`SUBJECT` に作業種別を含めてもよいものとします。

```text
T-LCH-PRJ-OVERVIEW-DRAFT-010
T-LCH-PRJ-OVERVIEW-REVIEW-020
```

ただし、ID が長くなりすぎる場合は、作業種別を `name` や `tags` で表現し、`SUBJECT` は短く保ちます。

### 6.5. 不変性

Task の `id` は、並び順変更だけを理由に変更しません。
既存 `id` は依存関係や実行ログから参照されるため、原則として不変とします。

## 7. Milestone `id` 命名規則

Milestone の `id` は次の形式を基本とします。

```text
M-<TRACK>-<SUBJECT>-<NNN>
```

例:

```text
M-LCH-START-010
M-LCH-PRJ-DEFINITION-READY-020
M-LCH-LAUNCH-READY-090
M-REL001-RELEASE-READY-090
```

| 要素      | ルール                                 |
| --------- | -------------------------------------- |
| `TRACK`   | `schedule_track_code` を使用する       |
| `SUBJECT` | ゲートや節目を識別できるキーを使用する |
| `NNN`     | 3 桁、`010` 刻みで採番する             |

Milestone は 0 日タスクの代替として使用します。

## 8. 依存関係の考え方

### 8.1. 原則

- WBS Item に `depends_on` が記述されている場合は、対応する Task の `depends_on` の起点として参照します。
- Schedule の `depends_on` には、真に着手不能となる先行 Task または Milestone のみを記述します。
- 「参考にしたい」「先に見たい」程度の関係は依存にしません。
- 依存は原則として Finish-to-Start として扱います。
- 空の依存関係は `depends_on: []` と明示します。

### 8.2. 依存を置くべきケース

| 依存の種類     | 説明                               | 例                             |
| -------------- | ---------------------------------- | ------------------------------ |
| 開始ゲート依存 | 管理単位の開始が前提               | `M-LCH-START-010` → 初期 Task  |
| 成果物依存     | 入力成果物の完了が必要             | `prj-overview` → `prj-charter` |
| レビュー依存   | レビュー完了後でないと次に進めない | 作成 Task → レビュー Task      |
| 承認依存       | 承認ゲート通過が前提               | レビュー Milestone → 後続 Task |
| 技術依存       | 設計・仕様上、順序が必要           | 業務仕様 → システム設計        |

### 8.3. 依存を最小化する判断基準

- 先行 Task が未完了でも下流 Task を 80% 程度進められるなら、依存を置かない
- 依存を追加しても品質向上や手戻り防止に寄与しない場合は、依存を置かない
- 同一レビューで確認できるものは、細かい直列依存より同一タイミングのレビューを優先する

## 9. タスク長の考え方

`duration_days` は作業日の長さで見積もります。

| duration_days | 目安     | 用途                               |
| ------------- | -------- | ---------------------------------- |
| `0.125`       | 約1時間  | 軽微な修正、確認                   |
| `0.25`        | 半日未満 | 小さな文書更新、単独レビュー       |
| `0.5`         | 半日程度 | 通常の文書作成・レビュー           |
| `1.0`         | 1日程度  | 複雑な成果物整備、複数観点レビュー |

次に該当する場合は分割を検討します。

1. `duration_days` が `1.0` を超える
2. 途中でレビュー待ちや意思決定待ちが発生する
3. 担当ロールが切り替わる
4. 変更対象が多く、1 Task の完了判定が曖昧になる

`duration_days: 0` は使用せず、0 日のゲートは Milestone として定義します。

## 10. Schedule 定義ファイルの構造

### 10.1. 共通項目

Schedule 定義ファイルは、次のトップレベル項目を持ちます。

| 項目                  | 必須     | 記述ルール                                                                        |
| --------------------- | -------- | --------------------------------------------------------------------------------- |
| `kind`                | 必須     | `milestones` または `track`                                                       |
| `version`             | 必須     | スキーマまたはデータ構造のバージョン                                              |
| `project_id`          | 必須     | プロジェクト ID。例: `prj-0001`                                                   |
| `schedule_level`      | 必須     | `milestones`, `domain`, `container`, `cross-domain`, `cross-container` のいずれか |
| `schedule_track`      | 必須     | Schedule の管理トラック。例: `launch`, `release-001`                              |
| `schedule_track_code` | 必須     | ID に使用する短縮コード。例: `LCH`, `REL001`                                      |
| `settings`            | 必須     | 開始日、完了マイルストーンなどの設定                                              |
| `domain`              | 条件付き | `domain`, `container`, `cross-container` では必須                                 |
| `container`           | 条件付き | `container` では必須                                                              |
| `domains`             | 条件付き | `cross-domain` では必須                                                           |
| `containers`          | 条件付き | `cross-container` では必須                                                        |
| `tasks`               | 条件付き | `domain`, `container`, `cross-domain`, `cross-container` では必須                 |
| `milestones`          | 条件付き | `milestones` では必須                                                             |
| `calendar`            | 任意     | カレンダー設定の上書き                                                            |
| `assigned_team`       | 任意     | 現在の担当チーム名。安定キーとしては使わない                                      |
| `notes`               | 任意     | ファイル全体の補足                                                                |

### 10.2. Task 項目

| 項目            | 必須 | 記述ルール                                            |
| --------------- | ---- | ----------------------------------------------------- |
| `id`            | 必須 | `T-<TRACK>-<SUBJECT>-<NNN>` 形式を基本とする          |
| `wbs`           | 必須 | 対応する WBS Item ID を記述する                       |
| `name`          | 必須 | 作業内容が一読で分かる短いラベルにする                |
| `duration_days` | 必須 | 0 より大きい作業日数を記述する                        |
| `depends_on`    | 必須 | 先行 Task / Milestone の ID 配列。依存がなければ `[]` |
| `owner`         | 必須 | `PO`, `BA`, `ARC`, `QE` のいずれか                    |
| `tags`          | 任意 | フィルタ・集計用タグ                                  |
| `notes`         | 任意 | 補足メモ。長文化させない                              |

### 10.3. Milestone 項目

| 項目         | 必須 | 記述ルール                                            |
| ------------ | ---- | ----------------------------------------------------- |
| `id`         | 必須 | `M-<TRACK>-<SUBJECT>-<NNN>` 形式を基本とする          |
| `name`       | 必須 | ゲートや節目が分かる短いラベルにする                  |
| `depends_on` | 必須 | 先行 Task / Milestone の ID 配列。依存がなければ `[]` |
| `owner`      | 任意 | 主責任ロール                                          |
| `date_hint`  | 任意 | 目安日。固定日が必要な場合のみ記述する                |
| `tags`       | 任意 | フィルタ・集計用タグ                                  |
| `notes`      | 任意 | 補足メモ                                              |

## 11. 記述例

### 11.1. Milestones Schedule

```yaml
kind: milestones
version: 1
project_id: prj-0001
schedule_level: milestones
schedule_track: launch
schedule_track_code: LCH
settings:
  start_date: 2026-03-01

milestones:
  - id: M-LCH-START-010
    name: launch 開始
    depends_on: []
    owner: PO
    date_hint: 2026-03-01
    tags:
      - launch

  - id: M-LCH-PRJ-DEFINITION-READY-020
    name: プロジェクト定義レビュー可能
    depends_on:
      - T-LCH-PRJ-OVERVIEW-010
      - T-LCH-PRJ-SCOPE-020
    owner: PO
    tags:
      - launch
      - project-definition
```

### 11.2. Domain Schedule

```yaml
kind: track
version: 1
project_id: prj-0001
schedule_level: domain
schedule_track: launch
schedule_track_code: LCH
domain: project-definition
settings:
  start_date: 2026-03-01
  finish_milestone_id: M-LCH-PRJ-DEFINITION-READY-020

tasks:
  - id: T-LCH-PRJ-OVERVIEW-010
    wbs: WBS-PJD-PRJ-OVERVIEW-010
    name: プロジェクト概要を作成する
    duration_days: 0.5
    depends_on:
      - M-LCH-START-010
    owner: PO
    tags:
      - launch
      - project-definition

  - id: T-LCH-PRJ-SCOPE-020
    wbs: WBS-PJD-PRJ-SCOPE-020
    name: プロジェクトスコープを作成する
    duration_days: 0.5
    depends_on:
      - T-LCH-PRJ-OVERVIEW-010
    owner: PO
    tags:
      - launch
      - project-definition
```

### 11.3. Container Schedule

```yaml
kind: track
version: 1
project_id: prj-0001
schedule_level: container
schedule_track: release-001
schedule_track_code: REL001
domain: business-specifications
container: order
settings:
  start_date: 2026-03-10

tasks:
  - id: T-REL001-BSP-ORDER-BPS-010
    wbs: WBS-BSP-BSP-ORDER-BPS-010
    name: 注文業務仕様を作成する
    duration_days: 0.5
    depends_on:
      - M-REL001-START-010
    owner: BA
    tags:
      - release-001
      - business-specifications
      - order
```

### 11.4. Cross-domain Schedule

```yaml
kind: track
version: 1
project_id: prj-0001
schedule_level: cross-domain
schedule_track: launch
schedule_track_code: LCH
domains:
  - project-definition
  - project-management
settings:
  start_date: 2026-03-01
  finish_milestone_id: M-LCH-LAUNCH-READY-090

tasks:
  - id: T-LCH-PRJ-CHARTER-010
    wbs: WBS-PJD-PRJ-CHARTER-030
    name: プロジェクト憲章を確認する
    duration_days: 0.25
    depends_on:
      - M-LCH-START-010
    owner: PO
    tags:
      - launch
      - project-definition

  - id: T-LCH-PM-PLAN-020
    wbs: WBS-PJM-PM-PLAN-010
    name: プロジェクト管理計画を作成する
    duration_days: 0.5
    depends_on:
      - T-LCH-PRJ-CHARTER-010
    owner: PO
    tags:
      - launch
      - project-management
```

### 11.5. Cross-container Schedule

```yaml
kind: track
version: 1
project_id: prj-0001
schedule_level: cross-container
schedule_track: release-001
schedule_track_code: REL001
domain: system-design
containers:
  - auth-api
  - payment-api
settings:
  start_date: 2026-04-01

tasks:
  - id: T-REL001-AUTH-API-IFX-010
    wbs: WBS-SYD-AUTH-API-IFX-010
    name: 認証 API インターフェース設計を確認する
    duration_days: 0.5
    depends_on: []
    owner: ARC
    tags:
      - release-001
      - system-design
      - auth-api

  - id: T-REL001-PAYMENT-API-IFX-020
    wbs: WBS-SYD-PAYMENT-API-IFX-020
    name: 決済 API インターフェース設計を確認する
    duration_days: 0.5
    depends_on: []
    owner: ARC
    tags:
      - release-001
      - system-design
      - payment-api
```

## 12. 成果物カタログ・WBS から Schedule への落とし込み手順

1. 対象の `wbs-<domain>.yaml` を確認する
2. 対象 WBS Item の `id`, `name`, `owner`, `deliverables`, `done_criteria` を確認する
3. `schedule_track` と `schedule_track_code` を決める
4. `schedule_level` を決める
5. `1 WBS Item = 1～3 Task` を目安に Task へ展開する
6. Task の `id` を `T-<TRACK>-<SUBJECT>-<NNN>` 形式で採番する
7. Task の `wbs` に対応する WBS Item ID を記述する
8. WBS Item の `depends_on` を参照し、対応する先行 Task ID に変換して Schedule の `depends_on` に記述する。WBS に記載のない依存でも着手不能な理由が明確な場合は追加してよい
9. `duration_days` を 0 より大きい値で見積もる
10. 必要に応じて Milestone を追加する
11. ドメイン固有の展開判断は `Appendix B` に追記する

## 13. 具体例

| WBS Item                                 | Task 例                                |
| ---------------------------------------- | -------------------------------------- |
| `WBS-PJD-PRJ-OVERVIEW-010`               | `T-LCH-PRJ-OVERVIEW-010`               |
| `WBS-PJD-PRJ-SCOPE-020`                  | `T-LCH-PRJ-SCOPE-020`                  |
| `WBS-PJD-PRJ-ISSUES-030`                 | `T-LCH-PRJ-ISSUES-030`                 |
| `WBS-PJM-PM-PLAN-010`                    | `T-LCH-PM-PLAN-010`                    |
| `WBS-PJM-PM-COMMUNICATION-PLAN-020`      | `T-LCH-PM-COMMUNICATION-PLAN-020`      |
| `WBS-PJM-PM-QUALITY-MANAGEMENT-PLAN-030` | `T-LCH-PM-QUALITY-MANAGEMENT-PLAN-030` |
| `WBS-SYD-AUTH-API-IFX-010`               | `T-REL001-AUTH-API-IFX-010`            |

## 14. アンチパターン

- WBS に存在しない成果物を Schedule に直接追加する
- `depends_on` を増やしすぎて全 Task が直列になる
- `duration_days: 0` を Task に使う
- `duration_days` が大きすぎて完了判定が曖昧になる
- WBS と Schedule の対応を `wbs` で参照していない
- 仕様上は独立なのに、レビュー都合だけで機械的に直列化する
- `name` が「対応」「更新」だけで、何をする Task か判別できない
- `assigned_team` を安定した分類キーとして使う
- ドメイン固有の例外ルールを本文の共通ルールに混ぜる
- `schedule_level` と `schedule_track` を混同する
- `SUBJECT` が曖昧で、同じ `schedule_track` 内で作業対象を識別できない

## 15. 運用ルール

- WBS Item を追加・変更した場合は、対応する Schedule 定義の追加・変更要否を確認します。
- Schedule の `wbs` は、必ず既存の WBS Item ID を参照します。
- Task ID は、依存関係や実行ログから参照されるため、原則として変更しません。
- `schedule_track` と `schedule_track_code` は、一度使用したら原則として変更しません。
- 依存関係に迷う場合は、まず依存を置かない案を考え、着手不能な理由が明確な場合のみ追加します。
- タスク長に迷う場合は、1 回の作業で完了確認まで到達できるかを基準にします。
- 本戦略を更新した場合は、`sch-*.yaml` と `wbs-*.yaml` の整合を確認します。

## Appendix A. Schedule Track と Schedule ファイルの対応定義

本付録は、Schedule の管理単位と Schedule 定義ファイルの対応を定義します。
`schedule_track` の追加に応じて更新します。

### A.1. Schedule Track

| schedule_track | schedule_track_code | 説明 |
| -------------- | ------------------- | ---- |
| `specdojo`     | `SDH`               | SpecDojo 本体のルール、サンプル、指示テンプレート、管理文書を整備する管理単位 |

### A.2. Schedule ファイル

| schedule_track | schedule_level | 対象 | Schedule ファイル |
| -------------- | -------------- | ---- | ----------------- |
| `specdojo` | `milestones` | プロジェクト全体 | `sch-milestones.yaml` |
| `specdojo` | `domain` | `governance` | `sch-track-governance.yaml` |
| `specdojo` | `domain` | `business` | `sch-track-business.yaml` |
| `specdojo` | `domain` | `design` | `sch-track-design.yaml` |
| `specdojo` | `domain` | `nfr` | `sch-track-nfr.yaml` |
| `specdojo` | `domain` | `quality` | `sch-tack-quality.yaml` |
| `specdojo` | `domain` | `agent-customization` | `sch-tack-agent-customization.yaml` |

## Appendix B. ドメイン別展開プロファイル

本付録は、共通ルールでは表現しきれないドメイン別の前提、Schedule 展開方針を定義します。
共通ルールを上書きするのではなく、ドメインごとの標準パターンや注意点を補足するために使用します。

### B.1. specdojo

#### B.1.1. 前提

- 以下の成果物は作成済みであると想定します。
  - `prj-overview`
  - `prj-charter`
  - `pm-organization`
  - `pm-wbs-to-schedule-strategy`
  - `wbs-governance.yaml`
  - `wbs-business.yaml`
  - `wbs-design.yaml`
  - `wbs-nfr.yaml`
  - `wbs-quality.yaml`
  - `wbs-agent-customization.yaml`

- 以下の領域のルール、指示テンプレート、サンプル、管理文書を作成するための Task を展開対象とします。
  - `governance`
  - `business`
  - `design`
  - `nfr`
  - `quality`
  - `agent-customization`

#### B.1.2. 展開方針

| 項目     | 方針                                                                        |
| -------- | --------------------------------------------------------------------------- |
| 標準分解 | ルールライフサイクルと派生成果物ライフサイクルを分け、必要に応じて 1〜3 Task に分解する |
| owner    | 主に `PO`、構成・設計は `ARC`、品質確認は `QE` も使用する |
| 依存方針 | ドメイン完了マイルストーンと主要成果物の依存だけを置き、同時に進められる Task は直列化しない |
| 注意点   | 管理台帳、進捗報告、議事録などの `control` は原則として Schedule 展開対象外 |

### B.2. domain: `governance`, schedule_track: `specdojo`

| 項目     | 方針 |
| -------- | ---- |
| 標準分解 | ルールブック作成と instruction / sample 作成を分ける |
| owner    | 主に `PO`、構成判断は `ARC`、レビューは `QE` も使用する |
| 依存方針 | キックオフマイルストーンと先行するルールファミリーのみを依存に置く |
| 注意点   | 最終承認で rulebook、instruction、sample をまとめて ready 化できるよう、過度な中間承認を置かない |
