---
id: sch-rules
type: rulebook
status: draft
---

# スケジュール作成ルール

Schedule Documentation Rules

本ドキュメントは、スケジュールを一貫した粒度と命名で作成・更新するためのルールを定義します。
Schedule は「いつ・誰が・どの順で作業するか」を定義する層であり、成果物スコープと完了条件（WHAT/DONE）は WBS 側で管理します。
本ルールで示す YAML 構造は、ファイル種別ごとの Schedule スキーマを正とします。

## 1. 全体方針

- スケジュールは以下のファイルに分割して管理する。
  - `sch-milestones.yaml`: プロジェクト全体のマイルストーン計画
  - `sch-defaults.yaml`: プロジェクト共通のデフォルト設定（カレンダー・開始日など）
  - `sch-track-<track>.yaml`: トラックごとのスケジュール
  - `sch-config-<track>.yaml`: トラックごとの設定
  - `sch-agent-overrides-<track>.yaml`: エージェントモードの上書き設定
- WBS Item を実行タスク（Task）に展開し、`action`・日付・担当・依存関係を付与する。
- 成果物パスは Schedule に書かない。成果物パスは WBS が管理する。
- 1 WBS Item = 原則 1 Task とする。レビュー・承認・外部待ちなど実行管理上の理由がある場合のみ Task を分割できる。
- `schedule_level` で `milestones`（プロジェクト全体）・`domain`（ドメイン単位）・`container`（コンテナ/コンポーネント単位）の粒度を区別する。
- 成果物カタログ・WBS・Schedule の責務分担と展開フローの全体像は `specdojo-deliverables-to-schedule-guide.md` を参照する。

### 1.1. スキーマ版管理

- スキーマ版は、ファイル種別ごとの Schedule スキーマで管理する。
  - `sch-milestones.yaml`: `docs/specdojo/schemas/v1/sch-milestones.schema.yaml`
  - `sch-defaults.yaml`: `docs/specdojo/schemas/v1/sch-defaults.schema.yaml`
  - `sch-track-<track>.yaml`: `docs/specdojo/schemas/v1/sch-track.schema.yaml`
  - `sch-config-<track>.yaml`: `docs/specdojo/schemas/v1/sch-config.schema.yaml`
  - `sch-agent-overrides-<track>.yaml`: `docs/specdojo/schemas/v1/sch-agent-overrides.schema.yaml`
- 互換性を壊す変更（required 追加、型変更、制約強化など）を行う場合は版を上げる。
- 既存インスタンスに影響する破壊的変更を行う前に、全スケジュールファイルへの影響を確認する。

## 2. 位置づけと用語定義

本ルールでは、用語を次の意味で使います。

| 用語              | 意味                                                  |
| ----------------- | ----------------------------------------------------- |
| task              | WBS Item を実行単位に分解したスケジュール上のタスク   |
| milestone         | 期間ゼロのゲート・承認・リリース地点                  |
| schedule_level    | スケジュールの粒度（milestones / domain / container） |
| track             | Schedule の管理トラック。Task/Milestone ID の先頭要素 |
| config            | トラック別の設定（担当チーム、既定エージェントモードなど） |
| depends_on        | 前提タスクまたはマイルストーンの ID 配列              |
| wbs（Taskの項目） | このタスクが属する WBS Item の ID                     |
| duration_days     | 稼働日ベースの作業期間（小数可、例: 0.5 日）          |

## 3. ファイル命名・ID規則

### 3.1. スケジュールファイル名

- Schedule ファイルは、全体方針で定めたファイル種別に分割する。
- プロジェクト全体のマイルストーン計画は `sch-milestones.yaml` とする。
- プロジェクト共通のデフォルト設定（カレンダー・開始日など）は `sch-defaults.yaml` とする。
- トラックごとのスケジュールは `sch-track-<track>.yaml` とする。
- トラックごとの設定は `sch-config-<track>.yaml` とする。
- エージェントモードの上書き設定は `sch-agent-overrides-<track>.yaml` とする。
- `<track>` は Schedule の管理トラックを表す安定した識別子とし、Task/Milestone ID の `<TRACK>` と対応させる。
- 例: `sch-milestones.yaml`, `sch-defaults.yaml`, `sch-track-launch.yaml`, `sch-config-launch.yaml`, `sch-agent-overrides-launch.yaml`

### 3.2. Task の `id`

- 形式は `T-<TRACK>-<DOMAIN>-<ARTIFACT>-<NNN>` とする。
  - `<TRACK>` はスケジュール上の管理トラック（フェーズ、リリース、作業グループなど）。
  - `<DOMAIN>-<ARTIFACT>` は対応する成果物の略称。
  - `<NNN>` は同一 `<TRACK>-<DOMAIN>-<ARTIFACT>` 内の連番（3 桁固定、`010` 刻み）。
- 例: `T-LAUNCH-PJD-OVERVIEW-010`, `T-SDH-DES-010`, `T-SDH-DES-011-INS`
- パターン: `^[A-Za-z0-9][A-Za-z0-9_-]{1,63}$`（スキーマ上の制約）

### 3.3. Milestone の `id`

- 形式は `M-<TRACK>-<NNN>` または `M-<TRACK>-<DOMAIN>-<NNN>` とする。
- 例: `M-SDH-100`, `M-SDH-DES-900`, `M-RELEASE-010`
- プロジェクト完了マイルストーンは `finish_milestone_id` で参照する。

## 4. ファイル種別と `kind`

Schedule ファイルは `kind` で種別を区別する。

| kind              | 用途                                             | 主要必須フィールド                                    |
| ----------------- | ------------------------------------------------ | ----------------------------------------------------- |
| `milestones`      | プロジェクト全体のマイルストーン計画             | `version`, `project_id`, `settings`, `schedule_level` |
| `track`           | トラックごとの実行スケジュール定義               | `version`, `project_id`, `settings`, `schedule_level` |
| `defaults`        | プロジェクト共通デフォルト（カレンダー・開始日） | `version`, `calendar`, `settings`                     |
| `config`          | トラックごとの設定                               | `version`, `project_id`, `track`, `settings`          |
| `agent_overrides` | エージェントモードの上書き設定                   | `version`, `project_id`, `task_overrides`             |

## 5. 本文構成（標準テンプレ）

### 5.1. `kind: milestones` / `kind: track` の共通フィールド

`sch-milestones.yaml`（`kind: milestones`）および `sch-track-<track>.yaml`（`kind: track`）は、スキーマで定義されたルート構造に従って構成する。

| 要素               | 必須 | 内容                                                              |
| ------------------ | ---- | ----------------------------------------------------------------- |
| kind               | ○    | `milestones` または `track`                                       |
| version            | ○    | スキーマ/データバージョン（整数）                                 |
| project_id         | ○    | プロジェクト識別子（例: `prj-0001`）                              |
| schedule_level     | ○    | `milestones` / `domain` / `container`                             |
| domain             | ○※   | ドメイン識別子（`domain` / `container` レベルで必須）             |
| container          | ○※   | コンテナ識別子（`container` レベルで必須）                        |
| track              | ○※   | トラック識別子（`sch-track-<track>.yaml` で必須）                 |
| assigned_team      | 任意 | 現在の担当チーム名（原則 `sch-config-<track>.yaml` に集約）       |
| default_agent_mode | 任意 | デフォルトエージェントモード（原則 `sch-config-<track>.yaml` に集約） |
| settings           | ○    | スケジュール設定（`start_date`, `finish_milestone_id` など）      |
| calendar           | 任意 | カレンダー上書き（`timezone`, `workdays`, `holidays` など）       |
| tasks              | ○※   | Task 配列（`domain` / `container` レベルで必須）                  |
| milestones         | ○※   | Milestone 配列（`milestones` レベルで必須。他レベルでも使用可）   |
| notes              | 任意 | ファイルレベルの補足                                              |

### 5.2. `kind: config` の共通フィールド

`sch-config-<track>.yaml`（`kind: config`）は、トラック単位で共有する設定を定義する。

| 要素               | 必須 | 内容                                                         |
| ------------------ | ---- | ------------------------------------------------------------ |
| kind               | ○    | `config` 固定                                                |
| version            | ○    | スキーマ/データバージョン（整数）                            |
| project_id         | ○    | プロジェクト識別子（例: `prj-0001`）                         |
| track              | ○    | 対象トラック識別子                                           |
| assigned_team      | 任意 | トラックの現在の担当チーム名                                 |
| default_agent_mode | 任意 | トラック内タスクに適用するデフォルトエージェントモード       |
| settings           | ○    | トラック固有の設定（基準マイルストーン、制約、運用設定など） |
| notes              | 任意 | ファイルレベルの補足                                         |

### 5.3. Task フィールド

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

### 5.4. Milestone フィールド

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

### 6.1. ファイル分割の使い分け

- `sch-milestones.yaml` は、プロジェクト全体の主要ゲート・承認・リリース地点を管理する。
- `sch-defaults.yaml` は、全 Schedule ファイルに共通するカレンダーと開始日などのデフォルトだけを管理する。
- `sch-track-<track>.yaml` は、トラックごとの Task / Milestone を管理する。実行順序や依存関係はこのファイルを中心に記載する。
- `sch-config-<track>.yaml` は、トラックごとの担当チーム、既定エージェントモード、運用設定などを管理する。
- `sch-agent-overrides-<track>.yaml` は、トラック内の特定タスクに対するエージェントモードの例外だけを管理する。
- トラックをまたぐ依存関係は `depends_on` で参照し、設定値を別トラックのファイルに重複して書かない。

### 6.2. schedule_level の使い分け

- `milestones`: `sch-milestones.yaml` で使用し、プロジェクト全体の主要ゲート・リリース地点を管理する。タスクを含めてもよいが、粗い粒度の概要タスクに留める。
- `domain`: `sch-track-<track>.yaml` で使用し、トラック内のドメイン単位の詳細タスクを管理する。`domain` フィールドが必須。
- `container`: `sch-track-<track>.yaml` で使用し、トラック内のコンテナ/コンポーネント単位の詳細タスクを管理する。`domain` と `container` が必須。

### 6.3. WBS Item とタスクの対応

- `tasks[].wbs` に対応する WBS Item の ID を記載し、WBS との追跡可能性を保つ。
- 1 WBS Item を複数 Task に分割する場合（レビュー・承認・外部待ちなど）は、全 Task に同じ `wbs` を記載する。
- `wbs` フィールドの形式は `WBS-<DOMAIN>-<ARTIFACT>`（末尾に連番なし）とする。

### 6.4. action の種別

- `create` / `modify` / `review` / `approve` / `publish` などの action は Schedule の Task として表現する。
- action の種別は `tasks[].name` に動詞句として含める（例: 「BPS ルールブックをレビューする」）。
- action は WBS の `done_criteria` や `deliverable` には記載しない（WBS は WHAT、Schedule は HOW/WHEN を扱う）。

### 6.5. `depends_on`

- 前提のないタスク・マイルストーンは `depends_on: []` と明示する（省略不可）。
- `depends_on` には同一ファイル内の ID だけでなく、`sch-milestones.yaml` や他の `sch-track-<track>.yaml` の ID も参照できる。
- ツールが依存グラフの整合性（ID 存在確認・循環参照検出）を検証する。

### 6.6. `duration_days`

- 稼働日ベースで記述する。小数可（例: `0.125`, `0.25`, `0.5`）。ゼロは不可（ゼロ期間は Milestone を使う）。
- カレンダー設定（`workdays`, `work_hours_per_day`）は `sch-defaults.yaml` に集約し、個別ファイルでは `calendar` で差分のみ上書きする。

### 6.7. `kind: defaults` の使い方

- プロジェクト共通の `calendar`（タイムゾーン・稼働曜日・祝日）と `settings.start_date` を `sch-defaults.yaml` に定義する。
- 個別の `sch-track-<track>.yaml` で `calendar` を省略すると defaults が適用される。
- `sch-defaults.yaml` は `project_id` を持たない（スキーマ上禁止）。

### 6.8. `kind: config` の使い方

- トラックごとの担当チーム、既定エージェントモード、運用上の設定は `sch-config-<track>.yaml` に定義する。
- `sch-track-<track>.yaml` は Task / Milestone の実行計画を主に扱い、設定値の重複を避ける。
- `sch-config-<track>.yaml` の `<track>` は、対応する `sch-track-<track>.yaml` と一致させる。

### 6.9. `kind: agent_overrides` の使い方

- 特定タスクのエージェントモードを上書きする場合に使う（例: 特定タスクだけ `manual` にする）。
- `default_agent_mode` は `sch-config-<track>.yaml` に定義し、個別タスクの例外だけを `sch-agent-overrides-<track>.yaml` に記載する。
- `task_overrides` は、対応する `sch-track-<track>.yaml` 内の Task ID を参照する。

## 7. 禁止事項

- 成果物パスを Schedule に直接書くこと（パスは WBS が管理する）。
- 完了条件（`done_criteria`）を Schedule に書くこと（WBS に書く）。
- `duration_days: 0` のタスクを作ること（ゼロ期間は Milestone を使う）。
- `depends_on` を省略すること（前提なしでも `[]` と明示する）。
- WBS に存在しない `wbs` ID を Task に記載すること。
- `id` に意味のない略号や重複する値を使うこと。
- `sch-defaults.yaml` の `calendar` / `settings` を各 Schedule ファイルに重複して書くこと。
- `sch-config-<track>.yaml` に置くべきトラック設定を `sch-track-<track>.yaml` や `sch-agent-overrides-<track>.yaml` に重複して書くこと。
- `sch-agent-overrides-<track>.yaml` に、タスク例外以外のトラック共通設定を書くこと。

## 8. サンプル（最小でも可）

- サンプルは次を参照する。
  - `../samples/sch-sample.md`（ドメインレベルスケジュールの例）
  - `../samples/sch-milestones-sample.md`（マイルストーン計画の例）

## 9. 生成 AI への指示テンプレート

- 生成 AI への具体的な指示は次を参照する。
  - `../instructions/sch-instruction.md`
