---
id: specdojo-schedule-design-guide
type: guide
status: draft
---

# SpecDojo Schedule設計ガイド

SpecDojo Schedule Design Guide

Schedule の役割、`sch-strategy` から `sch-track` への展開、タスク粒度、依存関係、CPM の考え方を説明します。コマンドの短い使い方は [specdojo-command-reference-guide.md](specdojo-command-reference-guide.md) を参照します。

## 1. Scheduleの役割

Schedule は「いつ、どの順序で、誰が実行するか」を定義する層です。成果物のパスや完了条件は成果物カタログが持ち、Schedule は成果物IDを参照して実行タスクへ展開します。

| 定義する内容     | 担当ファイル                   |
| ---------------- | ------------------------------ |
| WHAT / DONE      | 成果物カタログ（`dct-*.yaml`） |
| WHEN / ORDER     | Schedule（`sch-*.yaml`）       |
| エージェント定義 | `pm-members.yaml`              |
| 実行共通設定     | `.specdojo/exec-defaults.yaml` |

成果物カタログとの責務分担は [specdojo-deliverables-to-schedule-guide.md](specdojo-deliverables-to-schedule-guide.md) も参照します。

## 2. Scheduleファイル

Schedule は用途別に4種類のファイルで管理します。

| ファイル                    | 役割                                             |
| --------------------------- | ------------------------------------------------ |
| `sch-milestones.yaml`       | プロジェクト全体のマイルストーン計画             |
| `sch-defaults.yaml`         | 全 Schedule 共通のカレンダーや開始日のデフォルト |
| `sch-strategy-<track>.yaml` | track schedule の自動生成ルール                  |
| `sch-track-<track>.yaml`    | 展開済みの Task / Milestone 定義                 |

`sch-strategy-<track>.yaml` は生成入力です。`schedule build` 後は `sch-track-<track>.yaml` が実行対象になります。

## 3. 生成フロー

`sch-track-<track>.yaml` は原則として手書きせず、次の流れで生成します。

```text
成果物カタログ（dct-*.yaml）
  -> sch-strategy-<track>.yaml
  -> specdojo schedule build --track <track> --force
  -> sch-track-<track>.yaml
  -> specdojo exec build
  -> generated/ready.json, cpm.md, timeline.svg など
```

実行するコマンドは次のとおりです。

```bash
specdojo schedule build --project <project-id> --track <track> --force
specdojo exec build --project <project-id>
```

`phase_sets`、`cycles`、`iterations`、フェーズ追加削除、`phase_suffix`、依存関係、ゲートを変更した場合は、`schedule build` を先に実行してから `exec build` を実行します。

## 4. phase_setsの反復

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

## 5. タスクID

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
```

`cycles` が `2` 以上の場合だけ `C`、`iterations` が `2` 以上の場合だけ `I` を付けます。両方を使う場合の順序は `C`、`I` です。

## 6. フェーズと実行要件

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

エージェント選択の詳細は [specdojo-exec-strategy-guide.md](specdojo-exec-strategy-guide.md) を参照します。

## 7. exec build時のフェーズ解決

`exec build` は、`sch-track-<track>.yaml` のタスクを入力にし、対応する `sch-strategy-<track>.yaml` からフェーズ情報を解決して `ready.json` へ記録します。plan ファイルは `exec build` では生成せず、`exec plan` または `exec run` が必要時に生成します。

```text
sch-track task
  local_id, phase_suffix, cycle, iteration
  -> sch-strategy の phase_set / phase を解決
  -> mode, approach, capabilities, proficiency を確定
  -> generated/ready.json に記録
  -> exec plan / exec run が plan を生成
```

`mode`、`approach`、`execution`、`capabilities`、`proficiency` だけを変更した場合は `exec build` で反映できます。タスク構造が変わる変更をした場合は `schedule build --force` が必要です。

## 8. タスク粒度

Task は AI Agent が一度の実行で完了できる粒度にします。

| 指標            | 推奨             |
| --------------- | ---------------- |
| `duration_days` | `0.125` から `1` |
| 変更ファイル数  | 1から5           |
| 責務            | 1つ              |

大きすぎる Task は分割し、小さすぎて独立完了できない Task は統合します。

## 9. 依存関係

依存関係は最小限にします。依存が多いほど並列実行できる Ready タスクが減ります。

```text
良い例:
  migration -> repository -> api endpoint

悪い例:
  migration -> repository -> api -> test -> docs -> release
```

Ready タスク数の目安は同時に5から20件です。これを下回る状態が続く場合は依存関係を見直します。

## 10. CPMとクリティカルパス

`specdojo exec build` は Schedule から CPM（Critical Path Method）を計算します。

```text
generated/cpm.md
generated/critical-path.md
```

Slack が `0` の Task はクリティカルパスに乗ります。これらの遅延はプロジェクト全体の遅延に直結するため、優先して Ready にします。

## 11. Anti-patterns

| Anti-pattern                       | 問題                                                                 |
| ---------------------------------- | -------------------------------------------------------------------- |
| 巨大 Task（1日以上）               | 一度のエージェント実行で完了しにくい                                 |
| 過剰依存チェーン                   | Ready タスクが少なくなり並列性が落ちる                               |
| `duration_days: 0` の Task         | ゼロ期間は Milestone を使う                                          |
| `depends_on` の省略                | 前提なしでも `[]` と明示する                                         |
| 成果物パスを Schedule に直接書く   | パスは成果物カタログが管理する                                       |
| `sch-strategy` に agent 個体を書く | strategy は作業要件を持ち、agent 個体は `pm-members.yaml` に集約する |
