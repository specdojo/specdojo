---
specdojo:
  id: specdojo:schedule-design-guide
  type: guide
  status: ready
  supersedes:
    - specdojo-deliverables-to-schedule-guide
---

# Schedule設計ガイド

Schedule Design Guide

Schedule の役割、`sch-strategy` から `sch-track` への展開、タスク粒度、依存関係、CPM の考え方を説明します。コマンドの短い使い方は [CLIコマンドリファレンス](../references/command-reference.md) を参照します。

**対象読者**

- 成果物を実行タスクへ展開し、順序、反復、依存関係を設計するプロジェクト計画担当者、Schedule 作成者

**この文書で分かること**

- Schedule ファイルの責務、生成フロー、タスクIDと粒度、実行要件、依存関係、CPM

**次に読む文書**

- 実行手順は [Schedule実行運用ガイド](schedule-operation-guide.md)、exec 設定は [exec設定ガイド](exec-config-guide.md)、`approach` による実践の型の参照方針は [実践の進め方ガイド](ryu-guide.md) を参照してください。

## 1. Scheduleの基本

Schedule が扱う責務と、責務ごとに分かれたファイルの役割を示します。

### 1.1. Scheduleの役割

Schedule は「いつ、どの順序で、誰が実行するか」を定義する層です。成果物のパスや完了条件は成果物カタログが持ち、Schedule は成果物IDを参照して実行タスクへ展開します。

| 定義する内容     | 担当ファイル                   |
| ---------------- | ------------------------------ |
| WHAT / DONE      | 成果物カタログ（`dct-*.yaml`） |
| WHEN / ORDER     | Schedule（`sch-*.yaml`）       |
| エージェント定義 | `pm-members.yaml`              |
| 実行共通設定     | `.specdojo/exec-defaults.yaml` |

#### 1.1.1. 成果物カタログとの責務分担

成果物カタログは「何を管理対象とするか・どこに作成し何を満たせば完了か」を扱い、Schedule は「いつ・誰が・どの順で作業するか」を扱います。両者の責務は次のように分かれます。

| 観点               | 成果物カタログ                         | Schedule               |
| ------------------ | -------------------------------------- | ---------------------- |
| 主目的             | 成果物の論理定義と完了単位の定義       | 実行計画               |
| 問い               | 何がどこに完成すればよいか             | いつ誰が何をするか     |
| 単位               | 成果物                                 | 実行タスク             |
| 成果物ID           | 定義する                               | 参照する               |
| 配置先・成果物パス | `kind: work` の `path` で持つ          | 原則持たない           |
| 完了条件           | `kind: work` の `done_criteria` で持つ | 原則持たない           |
| action             | 持たない                               | 持つ                   |
| 日付               | 持たない                               | 持つ                   |
| 担当者             | 原則持たない                           | 持つ                   |
| 依存関係           | 成果物間の根拠程度                     | 実行順序の依存         |
| status             | カタログ定義文書の状態として持つ       | タスクの実行状態を持つ |

成果物カタログから Schedule への定義の流れは次のとおりです。

```mermaid
flowchart LR
    START(( )) -->|管理対象成果物・path・<br/>done_criteriaを定義| A["成果物カタログ"]
    A -->|成果物IDを参照し<br/>action・日付・担当を付与| C["Schedule"]
    C --> END(( ))
```

各層の詳細なルールは、それぞれの rulebook を正本とします。

- 成果物カタログ: [成果物カタログ（ドメイン別）作成ルール](../rulebooks/dct-rulebook.md)
- Schedule: [スケジュール作成ルール](../rulebooks/sch-rulebook.md)

### 1.2. Scheduleファイル

Schedule は用途別に4種類のファイルで管理します。

| ファイル                                  | 役割                                              |
| ----------------------------------------- | ------------------------------------------------- |
| `sch-milestones.yaml`                     | プロジェクト全体のマイルストーン計画              |
| `sch-defaults.yaml`                       | 全 Schedule 共通のカレンダーや開始日のデフォルト  |
| `sch-strategy-<track>.yaml`               | track schedule の自動生成ルール                   |
| `sch-track-<track>.yaml`                  | 展開済みの Task / Milestone 定義                  |
| `assessments/sch-assessment-<track>.yaml` | 成果物と実践の型の整備状況判定（strategy の入力） |

`sch-strategy-<track>.yaml` は `schedule build` の生成入力であり、DCT・Timeline・assessment・標準 profile から `schedule strategy generate` で作成できます。`schedule build` 後は `sch-track-<track>.yaml` が実行対象になります。整備状況判定は `assessments/` 配下に置き、`sch-*.yaml` を直接読む build 系の処理が strategy / track と取り違えないようにします。

計画成果物を Schedule に載せるプロジェクトでは、専用の `planning` ドメインと `planning` トラックを用います。人または agent が更新する計画入力は `kind: work`、track と milestones は `kind: generated` としてカタログへ登録します。ただし `sch-strategy-planning` 自身は `kind: control` とするか planning scope 外へ置き、strategy が自身の作成タスクを生成する循環を避けます。`dct-<domain>.yaml` 自身と `generated/` 配下の表示用生成物は Schedule 対象にしません。

## 2. sch-trackの生成

strategy から track への生成フロー、展開する情報、反復、タスクIDの導出を示します。

### 2.1. 生成フロー

`sch-track-<track>.yaml` は原則として手書きせず、次の流れで生成します。

```text
成果物カタログ（dct-*.yaml）+ Timeline + sch-assessment-<track>.yaml
  -> specdojo schedule strategy generate --track <track>
  -> sch-strategy-<track>.yaml
  -> specdojo schedule build --track <track> --force
  -> sch-track-<track>.yaml
  -> specdojo exec refresh
  -> generated/ready.json, cpm.md, gantt-chart.svg など
```

実行するコマンドは次のとおりです。

```bash
specdojo schedule build --project <project-id> --track <track> --force
specdojo exec refresh --project <project-id>
```

新規または再判定した track では、先に次を実行します。

```bash
specdojo schedule strategy generate --project <project-id> --track <track> \
  --default-owner <role> --gate-owner <role> --milestone-owner <role> --dry-run
specdojo schedule strategy generate --project <project-id> --track <track> \
  --default-owner <role> --gate-owner <role> --milestone-owner <role>
```

`phase_sets`、`cycles`、`iterations`、フェーズ追加削除、`phase_suffix`、依存関係、ゲートを変更した場合は、`schedule build` を先に実行してから `exec refresh` を実行します。

`--track` は生成・上書きする `sch-track-<track>.yaml` を指定します。一方、`sch-milestones.yaml` はプロジェクト全体の正本であるため、同じ `schedule_path` にあるすべての `sch-strategy-*.yaml` から毎回再構築します。別 track のマイルストーンは保持され、削除された strategy や定義から生成されなくなったマイルストーンだけが除去されます。

再構築時は、既存ファイルに残るマイルストーン ID の並びを維持し、新しく生成された ID を末尾へ追加します。既存項目の内容は最新の strategy から全面置換するため、表示順を安定させながら定義変更を反映できます。既存ファイルがない初回生成では、strategy ファイル名順に並びます。

`sch-milestones.yaml` の `status` は、既存ファイルの再構築時には変更しません。対象 track や他の strategy の `status` にかかわらず、人が昇格・降格した状態を保持します。初回生成時だけ `draft` とし、build の成功を理由に自動昇格しません。

全 strategy のいずれかに検証エラー、project ID の不一致、マイルストーン ID の重複がある場合、`schedule build` は不完全な `sch-track-<track>.yaml` や `sch-milestones.yaml` を書き込まずに停止します。`--dry-run` でも全 strategy を評価し、プロジェクト全体のマイルストーン生成結果を表示します。

### 2.2. トラックへ展開する情報

`sch-strategy-<track>.yaml`（生成入力）から `sch-track-<track>.yaml`（生成物）への展開では、タスク単位で確定する実行情報だけを展開します。

| 展開する情報       | 理由                                                     |
| ------------------ | -------------------------------------------------------- |
| `name`             | 実行者が作業を識別するために必要                         |
| `description`      | エージェント・人間が実行時に参照するフェーズ指示         |
| `target_local_ids` | 横断タスクの対象成果物群を plan / commit scope へ渡す    |
| `owner`            | 誰が実行するかを決定するために必要                       |
| `duration_days`    | CPM 計算に必要                                           |
| `depends_on`       | 実行順序の決定に必要。タスク ID に解決済みの形で展開する |

トラック全体に共通する生成ルールや設計意図は strategy に留めます。

| strategy に留める情報             | 理由                                                             |
| --------------------------------- | ---------------------------------------------------------------- |
| `phase_sets` の定義               | フェーズ構成は strategy が SSOT。定義全体はトラックへ複製しない  |
| `owner_rules`                     | どの `local_id` を誰が担当するかのルール。トラックには展開しない |
| `cross_domain_dependencies`       | 依存関係の設計意図。トラックには解決済み `depends_on` として反映 |
| `phase_gates`・`group_milestones` | 生成ロジック。トラックにはマイルストーンとして展開済み           |

`description` をトラックへ展開するのは、エージェントや人間が plan ファイルだけを読んで実行できるようにするためです。strategy を参照させる方式は plan 生成時にファイルが 2 つ必要になり、自己完結性が損なわれます。

反復タスクには、実行時にタスク ID の文字列解析へ依存しないよう、生成元を表す `phase_set`・`phase_id`・`phase_suffix` と、該当する `cycle`・`iteration` を展開します。

`cross_deliverable_passes` から生成する横断タスクは、成果物別の `local_id` を持たず、明示された複数の `target_local_ids` を持ちます。これにより、一つの横断タスクの対象を plan frontmatter の `targets` と commit scope へ同じ順序で展開できます。

### 2.3. phase_setsの反復

個別 `phase_set` の反復と、`phase_sets` シーケンス全体の反復は別の階層として扱います。

| フィールド   | 意味                                                | 省略時 |
| ------------ | --------------------------------------------------- | ------ |
| `iterations` | 個別 `phase_set` の総実行回数                       | `1`    |
| `cycles`     | `sequence` に指定した `phase_sets` 全体の総実行回数 | `1`    |

```yaml
default_phase_sets:
  cycles: 2
  sequence:
    - phase_set: first-pass
      iterations: 2
    - phase_set: finalize-pass
```

この例は次の順序に展開されます。

```text
cycle 1: first-pass #1 -> first-pass #2 -> finalize-pass
cycle 2: first-pass #1 -> first-pass #2 -> finalize-pass
```

反復しない場合は、従来どおり配列形式も使えます。

```yaml
default_phase_sets: [first-pass, finalize-pass]
```

`cycles` と `iterations` は追加回数ではなく総実行回数です。

### 2.4. タスクID

タスク ID は `T-<TRACK>-<local_id>-<phase_suffix>` を基礎にし、反復する場合だけ `-C<cycle>` と `-I<iteration>` を末尾に付けます。`id:` フィールドは `sch-track` の YAML に書かず、自動導出します。

```text
# 反復なし
T-LAUNCH-prj-overview-010

# phase_sets 全体のみ反復
T-LAUNCH-prj-overview-010-C01

# 個別 phase_set のみ反復
T-LAUNCH-prj-overview-010-I01

# 両方を反復
T-LAUNCH-prj-overview-010-C01-I01

# 横断タスク
T-LAUNCH-project-definition-dedup-060
```

`cycles` が `2` 以上の場合だけ `C`、`iterations` が `2` 以上の場合だけ `I` を付けます。両方を使う場合の順序は `C`、`I` です。

横断タスクは `T-<TRACK>-<cross_deliverable_pass.id>-<task_suffix>` とします。成果物の `local_id` を代表値として使わないため、対象群をタスク ID から推測せず `target_local_ids` を参照します。

#### 2.4.1. 成果物群を横断する直列 pass

成果物別 phase を複製せず、明示した成果物群を一度だけ共同編集する場合は `cross_deliverable_passes` を使います。

```yaml
cross_deliverable_passes:
  - id: project-definition-dedup
    name: プロジェクト定義の正本選択・重複整理
    task_suffix: "060"
    duration_days: 0.5
    owner: ARC
    after_gate: G-LAUNCH-bootstrap-pass
    before_phase_set: refine-pass
    execution: agent
    mode: edit
    approach: cross-deliverable-dedup
    proficiency: expert
    scope:
      catalogs:
        - prj-0001:dct-project-definition
```

各 entry は scope の成果物数にかかわらず一つのタスクへ展開されます。そのタスクは `after_gate` に依存し、scope 内の `before_phase_set` の先頭タスクが横断タスクに依存します。このため、完了ゲート → 横断タスク → 成果物別 phase の順序を保ちつつ、横断作業の重複生成を防げます。

scope は `catalogs`、`groups`、`local_ids` の和集合で明示します。少なくとも二つの成果物へ解決できる必要があります。すでに全 phase 完了として `initial_state` に登録された成果物は対象群と plan targets には含めますが、後続 phase のブロック対象にはしません。

## 3. 実行要件とフェーズ解決

phase ごとの実行要件の定義方法と、`exec refresh` 時にどう解決されるかを示します。

### 3.1. フェーズと実行要件

`sch-strategy-<track>.yaml` の各フェーズには、実行種別と作業要件を定義できます。

```yaml
phase_sets:
  first-pass:
    - id: enrich
      name: 調査・補強
      execution: agent
      task_suffix: "020"
      mode: edit
      capabilities: [web_search]
      proficiency: expert
```

| フィールド     | 用途                                     |
| -------------- | ---------------------------------------- |
| `execution`    | `agent` または `human`。省略時は `agent` |
| `mode`         | `edit` または `review`。省略時は `edit`  |
| `approach`     | plan テンプレートの進め方を選ぶ          |
| `capabilities` | 必要なツールや能力を示す                 |
| `proficiency`  | 必要な習熟度を示す                       |

`approach` の値ごとの意味と、rulebook / recipe / sample / template の参照方針は [実践の進め方ガイド](ryu-guide.md) を参照します。エージェント選択の詳細は [exec設定ガイド](exec-config-guide.md) を参照します。

### 3.2. executor / reporter pipeline

一つの agent が成果物編集から result 記入までを担う従来フローを分割する場合、`execution: agent` の phase に任意の `agent_pipeline` を定義します。pipeline は executor、reporter の 2 stage 固定で、この順序を入れ替えたり一方を省略したりできません。

```yaml
phase_sets:
  first-pass:
    - id: enrich
      name: 調査・補強
      execution: agent
      task_suffix: "020"
      mode: edit
      agent_pipeline:
        stages:
          - stage_role: executor
            capabilities: [web_search]
            proficiency: expert
          - stage_role: reporter
            proficiency: normal
```

| stage      | 順序 | 責務                                | 選択要件                                |
| ---------- | ---- | ----------------------------------- | --------------------------------------- |
| `executor` | 1    | 成果物の編集と検証を行う            | stage の `capabilities` / `proficiency` |
| `reporter` | 2    | evidence から構造化された結果を作る | stage の `capabilities` / `proficiency` |

- `agent_pipeline` は phase 単位の任意設定です。省略した phase は従来の単一 agent フローのまま動作します。
- pipeline を指定した phase は agent 実行専用です。`execution: human` と併用できません。
- `mode` と `approach` は phase 全体へ適用し、各 stage の agent 選択要件は stage 内の `capabilities` と `proficiency` で定義します。
- stage には `pm-members.yaml` の nickname を書きません。`stage_role` と実行要件に一致する member を実行時に解決します。
- 登録簿の項目（`exec run --register`）は per-item のパイプライン宣言を持たないため、`agent_pipeline` の YAML 定義は使いません。代わりに `--executor-by <nickname>` と `--reporter-by <nickname>` を両方指定すると、同じ executor/reporter 2段階（evidence の受け渡し・result 描画を含む）で実行します。詳細は [CLIコマンドリファレンス](../references/command-reference.md) の `exec run` を参照します。

### 3.3. `bootstrap` と `retrofit` のフェーズ順序

実践の型が未整備で、かつ既存実装から成果物を作成・補正する場合、`bootstrap` と `retrofit` を一つの phase に混在させません。次の順序を推奨します。

1. `bootstrap`: 代表成果物と rulebook / recipe / sample / template を一式で初期整備する。
2. `retrofit` edit: DCT の `evidence_refs` から各成果物を新設・補正する。
3. `cross-deliverable-dedup`: 必要な場合だけ、成果物間の正本選択と重複整理を行う。
4. `fully-guided`: 整備済みの実践の型に沿って内容を磨き込む。
5. `retrofit` review: 完成版と実装エビデンスの一致・乖離・未確認範囲を判定する。
6. `finalize` または `bootstrap-finalize`: human が成果物と必要な実践の型を確定する。

`retrofit` を使う成果物には、事前に DCT の `evidence_refs` を宣言します。実装エビデンスは Schedule の依存関係ではなく調査入力であるため、`depends_on` や `targets` へ複製しません。

### 3.4. exec refresh時のフェーズ解決

`exec refresh` は、`sch-track-<track>.yaml` のタスクを入力にし、対応する `sch-strategy-<track>.yaml` からフェーズ情報を解決して `ready.json` へ記録します。plan ファイルは `exec refresh` では生成せず、`exec plan` または `exec run` が必要時に生成します。

```text
sch-track task
  local_id, phase_suffix, cycle, iteration
  -> sch-strategy の phase_set / phase を解決
  -> mode, approach, capabilities, proficiency を確定
  -> generated/ready.json に記録
  -> exec plan / exec run が plan を生成
```

`mode`、`approach`、`execution`、`capabilities`、`proficiency` だけを変更した場合は `exec refresh` で反映できます。タスク構造が変わる変更をした場合は `schedule build --force` が必要です。

### 3.5. 実践の型の整備状況判定（`sch-assessment-<track>.yaml`）

phase や owner rule に書く `approach` は、対象成果物と実践の型が実際に使える状態かどうかで変わります。この整備状況判定を `assessments/sch-assessment-<track>.yaml` に残し、strategy を書く前の入力にします。判断は次のとおり分担します。

| 段階     | 担当                                                | 出力                                                                            |
| -------- | --------------------------------------------------- | ------------------------------------------------------------------------------- |
| 事実収集 | コード（`schedule assessment scaffold`）            | `facts`（成果物・実践の型の実在、宣言形式、`status`、参照切れ、実装エビデンス） |
| 意味判断 | エージェント（`schedule assessment prompt` の指示） | `judgment`（4観点の利用可能性とタスク目的 `intent`）                            |
| 規則適用 | コード（`schedule assessment validate`）            | `recommended_approach`（判定規則の結果と一致することを検証）                    |
| 構造生成 | コード（`schedule strategy generate`）              | scope・profile・owner・gate・依存・milestone を持つ strategy                    |
| 承認     | 人間                                                | 判定結果のレビュー、`undecided` の解消、`status` の確定                         |

- 実践の型の解決規則（宣言・`none`・慣例 ID・参照切れ）はコード側の単一実装を使います。エージェントにファイル探索・ID 導出・存在判定をさせず、`facts` の再編集も禁止します。
- 利用可能性は、`target-fit`（対象成果物向けか）、`substantive-content`（空・placeholder 中心でないか）、`internal-consistency`（相互に致命的な矛盾がないか）、`standard-alignment`（現行 rulebook・schema と整合するか）の4観点を根拠付きで評価し、すべて `pass` なら `usable`、1件でも `fail` なら `unusable`、`fail` が無く未確認が残れば `unknown` とします。`status: draft` であること自体は利用不能の根拠になりません。
- `recommended_approach` は `intent` と利用可能性から決まります。`author-deliverable` だけが整備状況で `fully-guided` / `recipe-guided` / `freeform` に分岐し、`bootstrap` / `retrofit` / `cross-deliverable-dedup` / 各 `*-maintenance` / `finalize` / `bootstrap-finalize` は目的別フェーズとして `intent` から選びます。
- `bootstrap` は `bootstrap_scope`（一式で初期整備する実践の型）と理由の記載が必要で、対象がすべて利用可能な場合は選べません。`retrofit` は解決済みの `evidence_refs` が 1 件以上必要です。
- 判定できない項目が残る場合は `recommended_approach: undecided` とし、対象 `local_id` を `topic` にした blocking な `open_questions` を必ず添えます。`undecided` のまま strategy を生成しません。
- 標準 profile は `bootstrap`、`retrofit`、`fully-guided`、`recipe-guided`、`freeform`、4種の maintenance、横断整理、`finalize` / `bootstrap-finalize` を、固定の phase ID・suffix・duration・execution・mode・agent pipeline へ写像します。成果物ごとに異なる profile は `owner_rules[].phase_sets` で分けます。
- owner は明示オプション、既存 strategy、既定 owner の順に解決します。DCT の `done_criteria.roles` はレビュー観点なので、主担当へ流用しません。
- generator は書き込み前に `schedule build --dry-run` 相当を実行します。全 strategy の project ID、参照、schema、milestone ID に問題があれば既存ファイルを上書きしません。

コマンドの使い方は [CLIコマンドリファレンス](../references/command-reference.md) の `schedule assessment（成果物・実践の型の利用可能性判定）`、`approach` ごとの進め方は [実践の進め方ガイド](ryu-guide.md) の `整備状況に応じた進め方（approach）` を参照します。

## 4. タスク設計の品質

タスク粒度、依存関係、CPM、典型的な失敗パターンを示します。

### 4.1. タスク粒度

Task は AI Agent が一度の実行で完了できる粒度にします。

| 指標            | 推奨             |
| --------------- | ---------------- |
| `duration_days` | `0.125` から `1` |
| 変更ファイル数  | 1から5           |
| 責務            | 1つ              |

大きすぎる Task は分割し、小さすぎて独立完了できない Task は統合します。

`cross_deliverable_passes` は一つの論点整理責務を成果物群へ適用する例外であり、変更ファイル数より意味的なまとまりを優先します。scope を広げすぎず、正本を相互に選択できる成果物群ごとに分けます。

### 4.2. 依存関係

依存関係は最小限にします。依存が多いほど並列実行できる Ready タスクが減ります。

```text
良い例:
  migration -> repository -> api endpoint

悪い例:
  migration -> repository -> api -> test -> docs -> release
```

Ready タスク数の目安は同時に5から20件です。これを下回る状態が続く場合は依存関係を見直します。

### 4.3. CPMとクリティカルパス

`specdojo exec refresh` は Schedule から CPM（Critical Path Method）を計算します。

```text
generated/cpm.md
generated/critical-path.md
```

Slack が `0` の Task はクリティカルパスに乗ります。これらの遅延はプロジェクト全体の遅延に直結するため、優先して Ready にします。

### 4.4. Anti-patterns

| Anti-pattern                       | 問題                                                                 |
| ---------------------------------- | -------------------------------------------------------------------- |
| 巨大 Task（1日以上）               | 一度のエージェント実行で完了しにくい                                 |
| 過剰依存チェーン                   | Ready タスクが少なくなり並列性が落ちる                               |
| `duration_days: 0` の Task         | ゼロ期間は Milestone を使う                                          |
| `depends_on` の省略                | 前提なしでも `[]` と明示する                                         |
| 成果物パスを Schedule に直接書く   | パスは成果物カタログが管理する                                       |
| `sch-strategy` に agent 個体を書く | strategy は作業要件を持ち、agent 個体は `pm-members.yaml` に集約する |
