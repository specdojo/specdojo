---
specdojo:
  id: sch-rulebook
  type: rulebook
  status: ready
  target_format: yaml
  recipe: none
  sample: none
  template: none
  based_on:
    - rulebook-authoring-standard
---

# スケジュール作成ルール

Schedule Documentation Rules

本ドキュメントは、Schedule（`sch-*.yaml`）を一貫した粒度と命名で作成・更新するためのルールです。
Schedule は「いつ・誰が・どの順で作業するか」を定義する層であり、成果物スコープと完了条件（WHAT / DONE）は成果物カタログ（`dct-<domain>.yaml`）で管理します。
本書は命名・ID 規則と schema で表現できない記述規範を定義し、構造・必須キーは schema を、設計の考え方と生成フローは [[specdojo-schedule-design-guide]] を参照します。

## 1. 全体方針

- Schedule は `sch-milestones.yaml` / `sch-defaults.yaml` / `sch-track-<track>.yaml` / `sch-strategy-<track>.yaml` の 4 種類に分割して管理する。各ファイルの役割と生成フローは [[specdojo-schedule-design-guide]] を参照する。
- 成果物カタログの `kind: work` エントリを実行タスクへ展開し、期間・担当・依存関係を付与する。成果物パスと完了条件はカタログが管理する（[[specdojo-deliverables-to-schedule-guide]] を参照）。
- `sch-strategy-<track>.yaml` が存在するトラックでは、strategy と成果物カタログを SSOT とし、`sch-track-<track>.yaml` は `specdojo schedule build` で再生成可能な生成物として扱う。生成後の track を直接編集しない。
- Schedule の `owner` には Role code のみを記載し、実行主体との対応は `pm-members.yaml` で管理する。

## 2. 位置づけと用語定義

| 用語          | 意味                                                                                           |
| ------------- | ---------------------------------------------------------------------------------------------- |
| task          | 成果物カタログのエントリを実行単位に分解したスケジュール上のタスク                             |
| milestone     | 期間ゼロのゲート・承認・リリース地点                                                           |
| track         | Schedule の管理トラック。Task / Milestone ID の先頭要素                                        |
| depends_on    | 前提タスクまたはマイルストーンの ID 配列                                                       |
| duration_days | 稼働日ベースの作業期間（小数可、例: 0.5 日）                                                   |
| execution     | フェーズ・タスクの実行種別。`agent`（agent が実行）または `human`（人間が実行）                |
| phase         | `sch-strategy-<track>.yaml` が成果物ごとに生成するタスクの段階（draft / review / finalize 等） |

## 3. ファイル命名・ID規則

### 3.1. スケジュールファイル名

- プロジェクト全体のマイルストーン計画は `sch-milestones.yaml` とする。
- プロジェクト共通のデフォルト設定（カレンダー・開始日など）は `sch-defaults.yaml` とする。
- トラックごとのスケジュールは `sch-track-<track>.yaml`、タスク生成戦略は `sch-strategy-<track>.yaml` とする。
- `<track>` は Schedule の管理トラックを表す安定した識別子とし、Task / Milestone ID の `<TRACK>` と対応させる。
- 例: `sch-milestones.yaml`, `sch-track-launch.yaml`, `sch-strategy-launch.yaml`

### 3.2. Task の `id`

- 基本形式は `T-<TRACK>-<local_id>-<phase_suffix>` とし、反復する場合だけ `-C<cycle>` / `-I<iteration>` を末尾に付ける（順序は `C`、`I`。反復回数が 2 以上の場合のみ、`01` 始まりの 2 桁以上ゼロ埋め）。
- `schedule build` で生成されるタスクの `id` は YAML に書かず、自動導出に委ねる。
- 例: `T-LAUNCH-prj-overview-010`、反復例: `T-LAUNCH-prj-overview-010-C01-I02`
- パターン: `^[A-Za-z0-9][A-Za-z0-9_-]{1,127}$`（最大128文字。スキーマ上の制約）
- 導出規則と反復の考え方は [[specdojo-schedule-design-guide]] の `タスクID` と `phase_setsの反復` を参照する。

### 3.3. Milestone の `id`

- 形式は `M-<TRACK>-<name>` とし、`<name>` には対象のドメインやゲートが分かる slug を使う。
  - 例: `M-LAUNCH-project-definition`
- `sch-strategy` の `phase_gates` / `group_milestones` から生成されるマイルストーンも同形式とする。
- プロジェクト完了マイルストーンは `settings.finish_milestone_id` で参照する。

## 4. 本文構成（標準テンプレ）

Schedule は Markdown の章構成を持たない YAML 成果物であり、ルートキー・必須キー・型は次の schema を正本とする。キー一覧は本書に複製しない。

| ファイル                    | kind         | schema                                                |
| --------------------------- | ------------ | ----------------------------------------------------- |
| `sch-milestones.yaml`       | `milestones` | `docs/specdojo/schemas/v1/sch-milestones.schema.yaml` |
| `sch-defaults.yaml`         | `defaults`   | `docs/specdojo/schemas/v1/sch-defaults.schema.yaml`   |
| `sch-track-<track>.yaml`    | `track`      | `docs/specdojo/schemas/v1/sch-track.schema.yaml`      |
| `sch-strategy-<track>.yaml` | `strategy`   | `docs/specdojo/schemas/v1/sch-strategy.schema.yaml`   |

- 各ファイルのメタ情報には `rulebook: sch-rulebook` を宣言する。
- 互換性を壊す schema 変更（required 追加、型変更、制約強化など）を行う場合は版を上げ、既存の全 Schedule ファイルへの影響を確認する。

## 5. 記述ガイド

schema で機械検証できない記述規範だけを定める。設計の考え方（フェーズ設計、反復、タスク粒度、依存関係、トラックへ展開する情報）は [[specdojo-schedule-design-guide]] を参照する。

### 5.1. 成果物カタログとタスクの対応

- 1 成果物エントリ = 原則 1 タスクとする。レビュー・承認・外部待ちなど実行管理上の理由がある場合のみ分割できる。
- タスク名（`name`）は成果物の `local_id` を含む動詞句とし、カタログとの追跡可能性を保つ（例: 「ルールブックをレビューする」）。
- `create` / `modify` / `review` / `approve` などの action はタスク名で表現し、成果物カタログの `done_criteria` には書かない（カタログは WHAT / DONE、Schedule は HOW / WHEN を扱う）。

### 5.2. depends_on と duration_days

- 前提のないタスク・マイルストーンも `depends_on: []` と明示する。
- `depends_on` には同一ファイル内の ID だけでなく、`sch-milestones.yaml` や他の `sch-track-<track>.yaml` の ID も参照できる。整合性（ID 存在確認・循環参照検出）はツールが検証する。
- `duration_days` は稼働日ベースで小数可、ゼロ不可（ゼロ期間は Milestone を使う）。
- カレンダーと開始日は `sch-defaults.yaml` に集約し、個別ファイルでは `calendar` で差分のみ上書きする。

### 5.3. execution と owner

- `execution` は `agent`（既定）または `human` とする。最終承認・公開可否判断など agent に委ねられないフェーズ・タスクは `human` を明示する。
- `owner` には `pm-roles.yaml` に定義された Role code のみを使用する。

### 5.4. strategy の記述

- `scope.catalogs` は絶対パスで記載し、`include_kinds: [work]` で `kind: control` / `generated` を除外する。
- `owner_rules` は、カタログに存在する全 `kind: work` の `local_id` を網羅する。
- `cross_domain_dependencies` は、カタログの `depends_on` に含まれないドメイン間依存だけを補完し、重複して記載しない。
- レビュー担当ロールは各成果物の `done_criteria` から取得されるため、strategy に重複して記載しない。

## 6. 禁止事項

- 成果物パスを Schedule に直接書くこと（パスは成果物カタログが管理する）。
- 完了条件（`done_criteria`）を Schedule に書くこと（成果物カタログに書く）。
- `schedule build` で生成された `sch-track-<track>.yaml` を直接編集すること。
- `duration_days: 0` のタスクを作ること（ゼロ期間は Milestone を使う）。
- `depends_on` を省略すること（前提なしでも `[]` と明示する）。
- `sch-defaults.yaml` の `calendar` / `settings` を各 Schedule ファイルに重複して書くこと。
- `pm-roles.yaml` に存在しない Role code を `owner` に書くこと。
- `sch-strategy-<track>.yaml` の `scope.catalogs[].path` に相対パスを使うこと（絶対パス必須）。
- `sch-strategy-<track>.yaml` の `owner_rules` にカタログの `done_criteria` のレビューロールを重複して記載すること。
