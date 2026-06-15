---
id: sch-rules
type: rulebook
status: draft
---

# スケジュール作成ルール

Schedule Documentation Rules

本ドキュメントは、スケジュールを一貫した粒度と命名で作成・更新するためのルールを定義する。
Schedule は「いつ・誰が・どの順で作業するか」を定義する層であり、成果物スコープと完了条件（WHAT/DONE）は成果物カタログ（`dct-<domain>.yaml`）で管理する。

## 1. 全体方針

- スケジュールは以下のファイルに分割して管理する。
  - `sch-milestones.yaml`: プロジェクト全体のマイルストーン計画
  - `sch-defaults.yaml`: プロジェクト共通のデフォルト設定（カレンダー・開始日など）
  - `sch-track-<track>.yaml`: トラックごとのタスク・マイルストーン定義
  - `sch-strategy-<track>.yaml`: トラックごとのタスク生成戦略定義（コードジェネレータ入力）
- 成果物カタログの `kind: work` エントリを実行タスク（Task）に展開し、日付・担当・依存関係を付与する。
- 成果物パスは Schedule に書かない。成果物パスは成果物カタログ（dct）が管理する。
- 1 成果物エントリ = 原則 1 Task とする。レビュー・承認・外部待ちなど実行管理上の理由がある場合のみ Task を分割できる。
- 担当メンバーと実行者の対応は `pm-members.yaml` の `roles` フィールドで管理する。Schedule には `owner`（Role code）のみを記載する。
- 成果物カタログ・Schedule の責務分担と展開フローの全体像は `specdojo-deliverables-to-schedule-guide.md` を参照する。

### 1.1. スキーマ版管理

- スキーマ版は、ファイル種別ごとの Schedule スキーマで管理する。
  - `sch-milestones.yaml`: `docs/specdojo/schemas/v1/sch-milestones.schema.yaml`
  - `sch-defaults.yaml`: `docs/specdojo/schemas/v1/sch-defaults.schema.yaml`
  - `sch-track-<track>.yaml`: `docs/specdojo/schemas/v1/sch-track.schema.yaml`
  - `sch-strategy-<track>.yaml`: `docs/specdojo/schemas/v1/sch-strategy.schema.yaml`
- 互換性を壊す変更（required 追加、型変更、制約強化など）を行う場合は版を上げる。
- 既存インスタンスに影響する破壊的変更を行う前に、全スケジュールファイルへの影響を確認する。

## 2. 位置づけと用語定義

| 用語          | 意味                                                                                           |
| ------------- | ---------------------------------------------------------------------------------------------- |
| task          | 成果物カタログのエントリを実行単位に分解したスケジュール上のタスク                             |
| milestone     | 期間ゼロのゲート・承認・リリース地点                                                           |
| track         | Schedule の管理トラック。Task/Milestone ID の先頭要素                                          |
| depends_on    | 前提タスクまたはマイルストーンの ID 配列                                                       |
| duration_days | 稼働日ベースの作業期間（小数可、例: 0.5 日）                                                   |
| agent_mode    | タスクの実行形態。`auto`（agent が自動実行）または `manual`（人間が実行）                      |
| phase         | `sch-strategy-<track>.yaml` が成果物ごとに生成するタスクの段階（draft / review / finalize 等） |

## 3. ファイル命名・ID規則

### 3.1. スケジュールファイル名

- プロジェクト全体のマイルストーン計画は `sch-milestones.yaml` とする。
- プロジェクト共通のデフォルト設定（カレンダー・開始日など）は `sch-defaults.yaml` とする。
- トラックごとのスケジュールは `sch-track-<track>.yaml` とする。
- トラックごとのタスク生成戦略は `sch-strategy-<track>.yaml` とする。
- `<track>` は Schedule の管理トラックを表す安定した識別子とし、Task/Milestone ID の `<TRACK>` と対応させる。
- 例: `sch-milestones.yaml`, `sch-defaults.yaml`, `sch-track-launch.yaml`, `sch-strategy-launch.yaml`

### 3.2. Task の `id`

- 基本形式は `T-<TRACK>-<DOMAIN>-<ARTIFACT>-<NNN>` とする。
  - `<TRACK>`: スケジュール上の管理トラック。
  - `<DOMAIN>-<ARTIFACT>`: 対応する成果物の略称。
  - `<NNN>`: 同一 `<TRACK>-<DOMAIN>-<ARTIFACT>` 内の連番（3 桁固定、`010` 刻み）。
- `phase_sets` 全体を反復する場合は `-C<cycle>`、個別 `phase_set` を反復する場合は `-I<iteration>` を基本形式の末尾に付ける。
- 両方を反復する場合は `T-<TRACK>-<DOMAIN>-<ARTIFACT>-<NNN>-C<cycle>-I<iteration>` の順とする。
- `C` と `I` は該当する反復回数が2回以上の場合だけ付け、番号は `01` から始まる2桁以上のゼロ埋め表記とする。
- 例: `T-LAUNCH-PJD-OVERVIEW-010`, `T-SDH-DES-010`
- 反復例: `T-LAUNCH-PJD-OVERVIEW-010-C01-I02`
- パターン: `^[A-Za-z0-9][A-Za-z0-9_-]{1,127}$`（最大128文字。スキーマ上の制約）

### 3.3. Milestone の `id`

- 形式は `M-<TRACK>-<NNN>` または `M-<TRACK>-<DOMAIN>-<NNN>` とする。
- 例: `M-SDH-100`, `M-SDH-DES-900`, `M-RELEASE-010`
- プロジェクト完了マイルストーンは `finish_milestone_id` で参照する。

## 4. ファイル種別と `kind`

Schedule ファイルは `kind` で種別を区別する。

| kind         | 用途                                               | 主要必須フィールド                                      |
| ------------ | -------------------------------------------------- | ------------------------------------------------------- |
| `milestones` | プロジェクト全体のマイルストーン計画               | `version`, `project_id`, `settings`                     |
| `track`      | トラックごとの実行スケジュール定義                 | `version`, `project_id`, `track`, `tasks`               |
| `defaults`   | プロジェクト共通デフォルト（カレンダー・開始日）   | `version`, `calendar`, `settings`                       |
| `strategy`   | トラックのタスク生成戦略（コードジェネレータ入力） | `id`, `type`, `track`, `scope`, `phases`, `owner_rules` |

## 5. 本文構成（標準テンプレ）

### 5.1. `kind: milestones` / `kind: track` の共通フィールド

| 要素         | 必須 | 内容                                                          |
| ------------ | ---- | ------------------------------------------------------------- |
| `kind`       | ○    | `milestones` または `track`                                   |
| `version`    | ○    | スキーマ/データバージョン（整数）                             |
| `project_id` | ○    | プロジェクト識別子（例: `prj-0001`）                          |
| `track`      | ○※   | トラック識別子（`kind: track` で必須）                        |
| `settings`   | ○    | スケジュール設定（`start_date`, `finish_milestone_id` など）  |
| `calendar`   | 任意 | カレンダー上書き（`timezone`, `workdays`, `holidays` など）   |
| `tasks`      | ○※   | Task 配列（`kind: track` で必須）                             |
| `milestones` | ○※   | Milestone 配列（`kind: milestones` で必須。track でも使用可） |
| `notes`      | 任意 | ファイルレベルの補足                                          |

### 5.2. Task フィールド

| 要素            | 必須 | 内容                                                                          |
| --------------- | ---- | ----------------------------------------------------------------------------- |
| `id`            | ○    | タスク ID（スキーマ pattern 準拠）                                            |
| `local_id`      | 任意 | 対応する成果物の `local_id`                                                   |
| `phase_suffix`  | 任意 | フェーズの3桁サフィックス                                                     |
| `phase_set`     | 任意 | タスクを生成した `phase_set` 名                                               |
| `phase_id`      | 任意 | `phase_set` 内のフェーズ ID                                                   |
| `cycle`         | 任意 | `phase_sets` 全体を反復する場合の1始まりの cycle 番号                         |
| `iteration`     | 任意 | 個別 `phase_set` を反復する場合の1始まりの iteration 番号                     |
| `name`          | ○    | タスク名（action を含む動詞句が望ましい）                                     |
| `duration_days` | ○    | 稼働日ベースの作業期間（小数可、ゼロ不可）                                    |
| `depends_on`    | ○    | 前提タスク/マイルストーン ID の配列（前提なしの場合は空配列 `[]`）            |
| `owner`         | ○    | 主責任ロール（`pm-roles.yaml` に定義された Role code。例: `PO`, `BA`, `ARC`） |
| `description`   | 任意 | フェーズ内で実行者（エージェント・人間）が行うことの説明。`sch-strategy` の `phase_sets[].description` から自動展開される。exec plan の「このフェーズで行うこと」として出力される |
| `agent_mode`    | 任意 | `auto`（既定）または `manual`。省略時は `auto`                                |
| `tags`          | 任意 | 分類タグ配列                                                                  |
| `notes`         | 任意 | 補足メモ（簡潔に）                                                            |

### 5.3. Milestone フィールド

| 要素         | 必須 | 内容                                          |
| ------------ | ---- | --------------------------------------------- |
| `id`         | ○    | マイルストーン ID                             |
| `name`       | ○    | マイルストーン名                              |
| `depends_on` | ○    | 前提 ID の配列（前提なしの場合は空配列 `[]`） |
| `owner`      | 任意 | 主責任ロール                                  |
| `date_hint`  | 任意 | 目標日（ISO 8601 形式 `YYYY-MM-DD`）          |
| `tags`       | 任意 | 分類タグ配列                                  |
| `notes`      | 任意 | 補足メモ                                      |

### 5.4. `kind: strategy` のフィールド

`sch-strategy-<track>.yaml` は、コードジェネレータが `sch-track-<track>.yaml` を生成するための入力ファイルである。スキーマは `docs/specdojo/schemas/v1/sch-strategy.schema.yaml` で管理する。

**ルートフィールド**

| 要素                        | 必須 | 内容                                                               |
| --------------------------- | ---- | ------------------------------------------------------------------ |
| `id`                        | ○    | 成果物 ID（例: `prj-0001:sch-strategy-launch`）                    |
| `type`                      | ○    | `project` 固定                                                     |
| `status`                    | ○    | `draft` / `ready` / `deprecated`                                   |
| `track`                     | ○    | 対象トラック識別子（例: `launch`）                                 |
| `scope`                     | ○    | 対象カタログと include_kinds の定義                                |
| `phases`                    | ○    | 成果物フォーマット別のフェーズ定義（`markdown` / `yaml` など）     |
| `task_id_pattern`           | ○    | タスク ID 生成パターン（例: `T-LAUNCH-{local_id}-{phase_suffix}`） |
| `owner_rules`               | ○    | `local_id` → `owner` ロールのマッピングリスト                      |
| `cross_domain_dependencies` | 任意 | カタログの `depends_on` を補完するドメイン間依存                   |

**`scope` フィールド**

| 要素            | 必須 | 内容                                            |
| --------------- | ---- | ----------------------------------------------- |
| `catalogs`      | ○    | 対象カタログの `id` と `path`（絶対パス）の配列 |
| `include_kinds` | ○    | タスク生成対象の `kind` リスト（通常 `[work]`） |

**`phases[フォーマット][]` フィールド**

| 要素            | 必須 | 内容                                      |
| --------------- | ---- | ----------------------------------------- |
| `id`            | ○    | フェーズ識別子（例: `draft`, `validate`） |
| `name`          | ○    | フェーズ名                                |
| `task_suffix`   | ○    | タスク ID 採番用サフィックス（3 桁）      |
| `duration_days` | ○    | 標準作業期間（稼働日、小数可）            |

**`owner_rules[]` フィールド**

| 要素        | 必須 | 内容                                  |
| ----------- | ---- | ------------------------------------- |
| `local_ids` | ○    | 対象成果物の `local_id` リスト        |
| `owner`     | ○    | 作成タスクの主責任ロール（Role code） |

**`cross_domain_dependencies[]` フィールド**

| 要素        | 必須 | 内容                                                                             |
| ----------- | ---- | -------------------------------------------------------------------------------- |
| `dependent` | ○    | 依存元の `local_id`                                                              |
| `requires`  | ○    | 前提となる `local_id`（`dependent` の draft は `requires` の finalize 後に着手） |
| `note`      | 任意 | 補足                                                                             |

## 6. 記述ガイド

### 6.1. ファイル分割の使い分け

- `sch-milestones.yaml` は、プロジェクト全体の主要ゲート・承認・リリース地点を管理する。
- `sch-defaults.yaml` は、全 Schedule ファイルに共通するカレンダーと開始日などのデフォルトだけを管理する。
- `sch-track-<track>.yaml` は、トラックごとの Task / Milestone を管理する。実行順序・依存関係・担当・`agent_mode` をこのファイルで完結させる。
- `sch-strategy-<track>.yaml` が存在するトラックでは、strategy と成果物カタログを SSOT とし、`sch-track-<track>.yaml` は `specdojo schedule build` で再生成可能なビルド成果物として扱う。生成後の track を直接編集しない。

### 6.2. 成果物カタログとタスクの対応

- タスク名（`name`）に成果物の `local_id` を含めることで、カタログとの追跡可能性を保つ。
- 1 成果物エントリを複数 Task に分割する場合（レビュー・承認・外部待ちなど）は、同じ `local_id` を名前に使い、タスク ID の連番で区別する。

### 6.3. action の種別

- `create` / `modify` / `review` / `approve` / `publish` などの action は Schedule の Task として表現する。
- action の種別は `tasks[].name` に動詞句として含める（例: 「ルールブックをレビューする」）。
- action は成果物カタログの `done_criteria` には記載しない（成果物カタログは WHAT/DONE、Schedule は HOW/WHEN を扱う）。

### 6.4. `depends_on`

- 前提のないタスク・マイルストーンは `depends_on: []` と明示する（省略不可）。
- `depends_on` には同一ファイル内の ID だけでなく、`sch-milestones.yaml` や他の `sch-track-<track>.yaml` の ID も参照できる。
- ツールが依存グラフの整合性（ID 存在確認・循環参照検出）を検証する。

### 6.5. `duration_days`

- 稼働日ベースで記述する。小数可（例: `0.125`, `0.25`, `0.5`）。ゼロは不可（ゼロ期間は Milestone を使う）。
- カレンダー設定（`workdays`, `work_hours_per_day`）は `sch-defaults.yaml` に集約し、個別ファイルでは `calendar` で差分のみ上書きする。

### 6.6. `kind: defaults` の使い方

- プロジェクト共通の `calendar`（タイムゾーン・稼働曜日・祝日）と `settings.start_date` を `sch-defaults.yaml` に定義する。
- 個別の `sch-track-<track>.yaml` で `calendar` を省略すると defaults が適用される。
- `sch-defaults.yaml` は `project_id` を持たない（スキーマ上禁止）。

### 6.7. `agent_mode` の使い方

- `agent_mode` は Task 単位で指定する任意フィールドで、省略時は `auto` とみなす。
- `auto`: `owner` の Role code に対応する agent（`pm-members.yaml` の `roles` で照合）が自動実行する。
- `manual`: 人間による実行を必須とする。最終承認・公開可否判断など、agent に委ねられないタスクに指定する。
- `owner` が `PO` のタスクのうち最終承認を伴うものは `agent_mode: manual` を明示する。

### 6.8. `sch-strategy-<track>.yaml` の使い方

- `scope.catalogs` に対象カタログの絶対パスを記載する。`include_kinds: [work]` で `kind: control` / `generated` を除外する。
- `phases` は成果物の `path` 拡張子（`.md` / `.yaml` など）をキーとしてフォーマット別に定義する。フォーマットが追加された場合は新しいキーを追加する。
- `owner_rules` は `local_id` リストと `owner` ロールの対応を列挙する。カタログに存在する全 `kind: work` の `local_id` を網羅する。
- `cross_domain_dependencies` はカタログの `depends_on` に含まれないドメイン間依存を補完する。カタログ内の `depends_on` と重複して記載しない。
- レビュー担当ロールは各成果物の `done_criteria` からコードジェネレータが取得する。`sch-strategy-<track>.yaml` に重複して記載しない。

### 6.9. トラック展開の設計指針

`sch-strategy-<track>.yaml`（ソース）から `sch-track-<track>.yaml`（ビルド成果物）への展開において、何をトラックに展開すべきかを次の指針で判断する。

**トラックに展開する（実行情報）**

タスクを実行するために必要な情報で、タスク単位で確定する値。

| 情報           | 理由                                               |
| -------------- | -------------------------------------------------- |
| `name`         | 実行者が作業を識別するために必要                   |
| `description`  | エージェント・人間が実行時に参照するフェーズ指示   |
| `owner`        | 誰が実行するかを決定するために必要                 |
| `duration_days` | CPM 計算に必要                                    |
| `depends_on`   | 実行順序の決定に必要。タスク ID に解決済みの形で展開 |

**ストラテジーに留める（生成ルール・設計意図）**

トラック全体に共通する生成ルールや設計意図であり、タスクごとに異なる値にならないもの。

| 情報                          | 理由                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| `phase_sets` の定義           | フェーズ構成はストラテジーが SSOT。定義全体はトラックへ複製しない |
| `owner_rules`                 | どの local_id に誰が担当するかのルール。トラックには展開しない |
| `cross_domain_dependencies`   | 依存関係の設計意図。トラックには解決済み `depends_on` として反映 |
| `phase_gates`・`group_milestones` | 生成ロジック。トラックにはマイルストーンとして展開済み  |

この指針に従うと、`description` はフェーズの実行内容を表す情報であり、エージェントや人間が plan ファイルのみを読んで実行できるよう、トラックへの展開が適切である。ストラテジーを参照させる方式はプラン生成時にファイルが 2 つ必要になり、自己完結性が損なわれる。

反復タスクでは、実行時にタスク ID の文字列解析へ依存しないよう、生成元を表す `phase_set`・`phase_id`・`phase_suffix` と、該当する `cycle`・`iteration` をタスクへ展開する。

## 7. 禁止事項

- 成果物パスを Schedule に直接書くこと（パスは成果物カタログが管理する）。
- 完了条件（`done_criteria`）を Schedule に書くこと（成果物カタログに書く）。
- `duration_days: 0` のタスクを作ること（ゼロ期間は Milestone を使う）。
- `depends_on` を省略すること（前提なしでも `[]` と明示する）。
- `id` に意味のない略号や重複する値を使うこと。
- `sch-defaults.yaml` の `calendar` / `settings` を各 Schedule ファイルに重複して書くこと。
- `pm-roles.yaml` に存在しない Role code を `owner` に書くこと。
- `sch-strategy-<track>.yaml` の `scope.catalogs[].path` に相対パスを使うこと（絶対パス必須）。
- `sch-strategy-<track>.yaml` の `owner_rules` にカタログの `done_criteria` のレビューロールを重複して記載すること。

## 8. サンプル

- 参照: `../samples/sch-sample.md`（ドメインレベルスケジュールの例）
- 参照: `../samples/sch-milestones-sample.md`（マイルストーン計画の例）
