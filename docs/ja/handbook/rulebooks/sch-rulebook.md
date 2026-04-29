---
id: sch-rules
type: rulebook
status: draft
---

# スケジュール作成ルール

Schedule Documentation Rules

本ドキュメントは、`sch-<scope>.yaml` を一貫した粒度と命名で作成・更新するためのルールを定義します。
Schedule は「いつ・誰が・どの順で作業するか」を定義する層であり、成果物スコープと完了条件（WHAT/DONE）は WBS 側で管理します。
本ルールで示す YAML 構造は、`docs/shared/schemas/sch.schema.yaml` を正とします。

## 1. 全体方針

- WBS Item を実行タスク（Task）に展開し、`action`・日付・担当・依存関係を付与する。
- 成果物パスは Schedule に書かない。成果物パスは WBS が管理する。
- 1 WBS Item = 原則 1 Task とする。レビュー・承認・外部待ちなど実行管理上の理由がある場合のみ Task を分割できる。
- `schedule_level` で `milestones`（プロジェクト全体）・`domain`（ドメイン単位）・`container`（コンテナ/コンポーネント単位）の粒度を区別する。
- 成果物カタログ・WBS・Schedule の責務分担と展開フローの全体像は `specdojo-deliverables-to-schedule-guide.md` を参照する。

### 1.1. スキーマ版管理（`$id`）

- スキーマ版は `docs/shared/schemas/sch.schema.yaml` で管理する。
- 互換性を壊す変更（required 追加、型変更、制約強化など）を行う場合は版を上げる。
- 既存インスタンスに影響する破壊的変更を行う前に、全スケジュールファイルへの影響を確認する。

## 2. 位置づけと用語定義

本ルールでは、用語を次の意味で使います。

| 用語              | 意味                                                  |
| ----------------- | ----------------------------------------------------- |
| Task              | WBS Item を実行単位に分解したスケジュール上のタスク   |
| Milestone         | 期間ゼロのゲート・承認・リリース地点                  |
| schedule_level    | スケジュールの粒度（milestones / domain / container） |
| depends_on        | 前提タスクまたはマイルストーンの ID 配列              |
| wbs（Taskの項目） | このタスクが属する WBS Item の ID                     |
| duration_days     | 稼働日ベースの作業期間（小数可、例: 0.5 日）          |

## 4. ファイル種別と `kind`

Schedule ファイルは `kind` で種別を区別する。

| kind              | 用途                                             | 主要必須フィールド                                    |
| ----------------- | ------------------------------------------------ | ----------------------------------------------------- |
| `schedule`        | 実行スケジュール定義（タスク・マイルストーン）   | `version`, `project_id`, `settings`, `schedule_level` |
| `defaults`        | プロジェクト共通デフォルト（カレンダー・開始日） | `version`, `calendar`, `settings`                     |
| `agent_overrides` | エージェントモードの上書き設定                   | `version`, `project_id`, `task_overrides`             |

## 3. ファイル命名・ID規則

### 3.1. スケジュールファイル名

- ファイル名は `sch-<kind>.yaml` もしくは、`sch-<kind>-<group>.yaml` とする。
- `<scope>` はスケジュールの対象範囲を表す安定した識別子とする。
- 例: `sch-milestones.yaml`, `sch-design.yaml`, `sch-defaults.yaml`, `sch-agent-overrides.yaml`
- プロジェクト全体のマイルストーン計画は `sch-milestones.yaml` とする。
- プロジェクト共通のデフォルト設定（カレンダー・開始日など）は `sch-defaults.yaml` とする。

### 3.2. Task の `id`

- 形式は `T-<GROUP>-<DOMAIN>-<ARTIFACT>-<NNN>` とする。
  - `<GROUP>` はスケジュール上の管理グループ（フェーズ、リリース、作業グループなど）。
  - `<DOMAIN>-<ARTIFACT>` は対応する成果物の略称。
  - `<NNN>` は同一 `<GROUP>-<DOMAIN>-<ARTIFACT>` 内の連番（3 桁固定、`010` 刻み）。
- 例: `T-LAUNCH-PJD-OVERVIEW-010`, `T-SDH-DES-010`, `T-SDH-DES-011-INS`
- パターン: `^[A-Za-z0-9][A-Za-z0-9_-]{1,63}$`（スキーマ上の制約）

### 3.3. Milestone の `id`

- 形式は `M-<GROUP>-<NNN>` または `M-<GROUP>-<DOMAIN>-<NNN>` とする。
- 例: `M-SDH-100`, `M-SDH-DES-900`, `M-RELEASE-010`
- プロジェクト完了マイルストーンは `finish_milestone_id` で参照する。

## 4. ファイル種別と `kind`

Schedule ファイルは `kind` で種別を区別する。

| kind              | 用途                                             | 主要必須フィールド                                    |
| ----------------- | ------------------------------------------------ | ----------------------------------------------------- |
| `schedule`        | 実行スケジュール定義（タスク・マイルストーン）   | `version`, `project_id`, `settings`, `schedule_level` |
| `defaults`        | プロジェクト共通デフォルト（カレンダー・開始日） | `version`, `calendar`, `settings`                     |
| `agent_overrides` | エージェントモードの上書き設定                   | `version`, `project_id`, `task_overrides`             |

## 5. 本文構成（標準テンプレ）

### 5.1. `kind: schedule` の共通フィールド

`sch-<scope>.yaml`（`kind: schedule`）は、スキーマで定義されたルート構造に従って構成する。

| 要素               | 必須 | 内容                                                              |
| ------------------ | ---- | ----------------------------------------------------------------- |
| kind               | ○    | `schedule` 固定                                                   |
| version            | ○    | スキーマ/データバージョン（整数）                                 |
| project_id         | ○    | プロジェクト識別子（例: `prj-0001`）                              |
| schedule_level     | ○    | `milestones` / `domain` / `container`                             |
| domain             | ○※   | ドメイン識別子（`domain` / `container` レベルで必須）             |
| container          | ○※   | コンテナ識別子（`container` レベルで必須）                        |
| assigned_team      | 任意 | 現在の担当チーム名（可変情報）                                    |
| default_agent_mode | 任意 | デフォルトエージェントモード（`domain` / `container` レベルのみ） |
| settings           | ○    | スケジュール設定（`start_date`, `finish_milestone_id` など）      |
| calendar           | 任意 | カレンダー上書き（`timezone`, `workdays`, `holidays` など）       |
| tasks              | ○※   | Task 配列（`domain` / `container` レベルで必須）                  |
| milestones         | ○※   | Milestone 配列（`milestones` レベルで必須。他レベルでも使用可）   |
| notes              | 任意 | ファイルレベルの補足                                              |

### 5.2. Task フィールド

| 要素          | 必須 | 内容                                                               |
| ------------- | ---- | ------------------------------------------------------------------ |
| id            | ○    | タスク ID（スキーマ pattern 準拠）                                 |
| wbs           | ○    | 対応する WBS Item の ID（例: `WBS-DES-IFX-010`）                   |
| name          | ○    | タスク名（action を含む動詞句が望ましい）                          |
| duration_days | ○    | 稼働日ベースの作業期間（小数可、ゼロ不可）                         |
| depends_on    | ○    | 前提タスク/マイルストーン ID の配列（前提なしの場合は空配列 `[]`） |
| owner         | ○    | 主責任ロール（`PO` / `BA` / `ARC` / `QE`）                         |
| tags          | 任意 | 分類タグ配列                                                       |
| notes         | 任意 | 補足メモ（簡潔に）                                                 |

### 5.3. Milestone フィールド

| 要素       | 必須 | 内容                                          |
| ---------- | ---- | --------------------------------------------- |
| id         | ○    | マイルストーン ID                             |
| name       | ○    | マイルストーン名                              |
| depends_on | ○    | 前提 ID の配列（前提なしの場合は空配列 `[]`） |
| owner      | 任意 | 主責任ロール                                  |
| date_hint  | 任意 | 目標日（ISO 8601 形式 `YYYY-MM-DD`）          |
| tags       | 任意 | 分類タグ配列                                  |
| notes      | 任意 | 補足メモ                                      |

## 6. 記述ガイド

### 6.1. schedule_level の使い分け

- `milestones`: プロジェクト全体の主要ゲート・リリース地点を管理する。タスクを含めてもよいが、粗い粒度の概要タスクに留める。
- `domain`: ドメイン単位の詳細タスクを管理する。`domain` フィールドが必須。
- `container`: コンテナ/コンポーネント単位の詳細タスクを管理する。`domain` と `container` が必須。

### 6.2. WBS Item とタスクの対応

- `tasks[].wbs` に対応する WBS Item の ID を記載し、WBS との追跡可能性を保つ。
- 1 WBS Item を複数 Task に分割する場合（レビュー・承認・外部待ちなど）は、全 Task に同じ `wbs` を記載する。
- `wbs` フィールドはスキーマ上 `^WBS-[A-Z0-9]+-[A-Z0-9-]+-[0-9]{3}$` パターンを要求する（NNN サフィックス含む）。

### 6.3. `depends_on`

- 前提のないタスク・マイルストーンは `depends_on: []` と明示する（省略不可）。
- `depends_on` には同一ファイル内の ID だけでなく、他の Schedule ファイルの ID も参照できる。
- ツールが依存グラフの整合性（ID 存在確認・循環参照検出）を検証する。

### 6.4. `duration_days`

- 稼働日ベースで記述する。小数可（例: `0.125`, `0.25`, `0.5`）。ゼロは不可（ゼロ期間は Milestone を使う）。
- カレンダー設定（`workdays`, `work_hours_per_day`）は `sch-defaults.yaml` に集約し、個別ファイルでは `calendar` で差分のみ上書きする。

### 6.5. `kind: defaults` の使い方

- プロジェクト共通の `calendar`（タイムゾーン・稼働曜日・祝日）と `settings.start_date` を `sch-defaults.yaml` に定義する。
- 個別の Schedule ファイルで `calendar` を省略すると defaults が適用される。
- `sch-defaults.yaml` は `project_id` を持たない（スキーマ上禁止）。

### 6.6. `kind: agent_overrides` の使い方

- 特定タスクのエージェントモードを上書きする場合に使う（例: 特定タスクだけ `manual` にする）。
- `default_agent_mode` は Schedule ファイルの全タスクに適用されるデフォルトを設定する。
- `task_overrides` は `domain` / `container` レベルでのみ使用できる。

## 7. 禁止事項

- 成果物パスを Schedule に直接書くこと（パスは WBS が管理する）。
- 完了条件（`done_criteria`）を Schedule に書くこと（WBS に書く）。
- `duration_days: 0` のタスクを作ること（ゼロ期間は Milestone を使う）。
- `depends_on` を省略すること（前提なしでも `[]` と明示する）。
- WBS に存在しない `wbs` ID を Task に記載すること。
- `id` に意味のない略号や重複する値を使うこと。
- `sch-defaults.yaml` の `calendar` / `settings` を各 Schedule ファイルに重複して書くこと。

## 8. サンプル（最小でも可）

- サンプルは次を参照する。
  - `../samples/sch-sample.md`（ドメインレベルスケジュールの例）
  - `../samples/sch-milestones-sample.md`（マイルストーン計画の例）

## 9. 生成 AI への指示テンプレート

- 生成 AI への具体的な指示は次を参照する。
  - `../instructions/sch-instruction.md`
