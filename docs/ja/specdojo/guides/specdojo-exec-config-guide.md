---
specdojo:
  id: specdojo-exec-config-guide
  type: guide
  status: draft
---

# 実行設定ガイド

Exec Configuration Guide

SpecDojo のエージェント実行は、`sch-strategy-<track>.yaml` の phase に作業要件を定義し、`pm-members.yaml` のエージェント定義から実行者を選択する。レートリミットなどの共通実行ポリシーは `exec-defaults.yaml` に分離する。

## 1. 設定ファイルの分担

| ファイル                       | 役割                                                           | 粒度         |
| ------------------------------ | -------------------------------------------------------------- | ------------ |
| `sch-strategy-<track>.yaml`    | phase ごとの `mode`・`approach`・`capabilities`・`proficiency` | トラック     |
| `pm-members.yaml`              | 誰が作業するか（identity・command・capabilities・proficiency） | プロジェクト |
| `.specdojo/exec-defaults.yaml` | rate limit 検出条件・リトライポリシー・provider 別同時実行上限 | システム     |

`sch-strategy` は agent 個体を指定しない。phase に「どんな能力が必要か」を書き、`pm-members.yaml` に「誰がその能力を持つか」を書く。

## 2. phase の実行要件

`execution: agent` の phase には、必要に応じて `mode`・`capabilities`・`proficiency` を直接定義する。`mode` は plan/result の種別であり、agent の能力ではない。

```yaml
phase_sets:
  first-pass:
    - id: enrich
      name: 調査・補強
      execution: agent
      task_suffix: "020"
      mode: edit
      proficiency: normal

  research-first-pass:
    - id: enrich
      name: 調査・深掘り
      execution: agent
      task_suffix: "020"
      mode: edit
      capabilities: [web_search]
      proficiency: expert

  review-pass:
    - id: review
      name: レビュー
      execution: human
      task_suffix: "030"
      mode: review
```

| フィールド     | 必須 | 説明                                                                                                                                                        |
| -------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `execution`    | 任意 | `agent` または `human`。省略時は `agent`                                                                                                                    |
| `mode`         | 任意 | `edit` または `review`。省略時は `edit`                                                                                                                     |
| `approach`     | 任意 | `fully-guided` / `recipe-guided` / `freeform` / `bootstrap` / `rulebook-maintenance` / `recipe-maintenance` / `sample-maintenance` / `template-maintenance` |
| `capabilities` | 任意 | 必要なツールリスト。ツール不要の場合は省略                                                                                                                  |
| `proficiency`  | 任意 | 必要な品質水準。省略すると全水準が候補                                                                                                                      |

## 3. エージェントの定義

`pm-members.yaml` の `type: agent` メンバーには `command`・`capabilities`・`proficiency`・`priority` を定義する。

```yaml
members:
  - nickname: edit-agent
    display_name: Edit Agent
    email: null
    roles: []
    type: agent
    capabilities: []
    proficiency: normal
    priority: 10
    command: "opencode run --agent edit-agent"

  - nickname: expert-web-agent
    display_name: Expert Web Agent
    email: null
    roles: []
    type: agent
    capabilities: [web_search]
    proficiency: expert
    priority: 10
    command: "opencode run --agent expert-web-agent"
```

`exec run --auto` は phase の `capabilities` をすべて持つ agent を候補にする。`proficiency` が指定されている場合は一致する agent のみを候補にし、未指定の場合は全水準を候補に含める。候補のソートキーは次の順に評価する。

1. busy 状態（イベントログ上で `doing` のタスクを担当中の agent）を最後尾に置く。`--parallel` 実行で同じ最上位 agent に集中して rate limit に陥るのを避けるため。
2. `priority` 昇順（同値なら次へ）。
3. 余剰 capabilities 数の少ない順。

ソート後、`exec-defaults.yaml` の `providers.<provider>.max_concurrency` が設定された provider について、同一ラウンドで既に上限数の agent を確保済みであれば、その provider の候補を除外する。別 provider の候補が残ればそれを実行者に繰り上げる。すべての候補の provider が上限に達している場合は、claim も worktree 生成も行わずにそのタスクを次ラウンドへ繰り延べる（タスクは `todo` のまま保持され、取りこぼさない）。`--loop` 実行では、この繰り延べにより上限付き provider が自然に直列化される。`max_concurrency` はグローバルな `--parallel` を下げないため、他 provider は並列実行を維持する。`max_concurrency` は auto 選択のみに適用し、`--agent-cmd` / `--edit-agent` / `--review-agent` などの明示指定や resume 実行には適用しない。

## 4. 実行フロー

rate limit を検知したら、まず待機なしで次の優先順 agent に切り替えて再実行する（次候補は別アカウント/プロバイダ想定）。全候補が rate limit の場合のみ `rate_limit_policy.on_critical.retry` の wait+backoff で再パスを行い、`max_attempts` 回（初回パスを 1 回目として数える）まで繰り返す。この再試行は critical / non-critical を問わず全タスクに適用する。

```mermaid
flowchart LR
  T["ready task\nmode / capabilities / proficiency"]
  F1["pm-members\ncapabilities フィルタ"]
  F2["proficiency フィルタ\n（指定あれば）"]
  S["busy 最後尾 → priority → 余剰数\nでソート"]
  M0["candidates[i]\ncommand 実行"]
  RL{"rate limit?"}
  OK(["complete"])
  NX{"次候補あり?"}
  MN["candidates[i+1]\n即時切替"]
  WT{"再パス上限?"}
  WB["wait+backoff\n後に再パス"]
  BL(["block & log"])

  T --> F1 --> F2 --> S --> M0 --> RL
  RL -->|No| OK
  RL -->|Yes| NX
  NX -->|Yes| MN --> M0
  NX -->|No| WT
  WT -->|未達| WB --> M0
  WT -->|到達| BL
```

## 5. exec-defaults

`.specdojo/exec-defaults.yaml` には、全トラック共通の実行ポリシーを定義する。

```yaml
rate_limit_detection:
  exit_codes: [1]
  stderr_patterns:
    - "rate limit"
    - "429"

rate_limit_policy:
  on_non_critical:
    action: skip
  on_critical:
    action: try_next
    retry:
      max_attempts: 3
      initial_wait_seconds: 60
      backoff_multiplier: 3
      max_wait_seconds: 600
    on_exhausted: block
```

provider ごとに挙動が異なる設定は `providers.<provider>` に置く。各キーは対応するグローバル値を完全に置き換え、未指定のキーはグローバル値にフォールバックする。`<provider>` は `pm-members[].provider` に対応する。指定できるキーは次のとおり。

- `rate_limit_detection`: provider 固有の検出シグナル（`stderr_patterns` を優先する）。
- `rate_limit_policy`: provider 固有のリトライ／フォールバック／block ポリシー。
- `max_concurrency`: その provider の agent を 1 ラウンドで同時に走らせる上限（正の整数）。未指定・0 以下・非整数は「上限なし」として扱う。

`max_concurrency` は、同一ホストの単一モデルを共有する provider（例: ローカル Ollama の `opencode`）が複数同時起動でメモリ競合・モデルロード待ちにより不安定になるのを防ぐために使う。グローバルな `--parallel` を下げずに、その provider だけを直列化できる。

```yaml
providers:
  opencode:
    # opencode は 1 ラウンドで同時 1 つに制限する（他 provider は --parallel のまま並列）。
    max_concurrency: 1
```

## 6. 変更手順

新しい作業要件を追加する場合は、まず `sch-strategy-<track>.yaml` の phase に `capabilities` / `proficiency` を追加する。必要な能力を持つ agent が `pm-members.yaml` に存在しない場合だけ、新しい agent を追加する。

`approach: rulebook-maintenance` のような進め方の違いも phase に直接定義する。参考資料メンテナンスを通常成果物作業に暗黙で混ぜず、必要な phase として明示する。
