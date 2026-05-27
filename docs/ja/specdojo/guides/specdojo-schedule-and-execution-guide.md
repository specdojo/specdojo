---
id: specdojo-schedule-and-execution-guide
type: guide
status: draft
---

# SpecDojo スケジューリングガイド

本ドキュメントは SpecDojo におけるスケジュール設計の考え方と運用フローを説明する。
ファイル形式や各フィールドの詳細は `sch-rulebook.md` を参照すること。

## 1. Schedule の役割

Schedule は「いつ・どの順序で・誰が実行するか」を定義する層である。

| 定義する内容   | 担当ファイル                       |
| -------------- | ---------------------------------- |
| WHAT / DONE    | 成果物カタログ（`dct-*.yaml`）     |
| WHEN / ORDER   | Schedule（`sch-*.yaml`）           |
| エージェント選択 | `exec-agent.yaml`               |

Schedule は成果物カタログを参照するが、成果物パスや完了条件を直接持たない。

## 2. ファイル構成

Schedule は用途別に 4 種類のファイルで管理する。

| ファイル                    | 役割                                               |
| --------------------------- | -------------------------------------------------- |
| `sch-milestones.yaml`       | プロジェクト全体のマイルストーン計画               |
| `sch-defaults.yaml`         | 全 Schedule 共通のカレンダー・開始日デフォルト値   |
| `sch-track-<track>.yaml`    | トラックごとの Task / Milestone 定義（実行対象）   |
| `sch-strategy-<track>.yaml` | `sch-track-<track>.yaml` の自動生成ルール（入力）  |

`sch-strategy-<track>.yaml` はコードジェネレータへの入力であり、生成後は `sch-track-<track>.yaml` を正とする。

## 3. `sch-strategy` による自動生成フロー

`sch-track-<track>.yaml` は手書きではなく、次のフローで生成する。

```text
成果物カタログ（dct-*.yaml）
        ↓
sch-strategy-<track>.yaml（スコープ・フェーズ・owner ルール定義）
        ↓
specdojo exec build（または sch コードジェネレータ）
        ↓
sch-track-<track>.yaml（Task / Milestone が展開された実行スケジュール）
```

`sch-strategy-<track>.yaml` には成果物の `local_id` 単位で `phase` と `owner` を定義する。

## 4. フェーズと AI エージェント選択

`sch-strategy-<track>.yaml` の `phases` は成果物フォーマット（`.md` / `.yaml`）ごとに定義する。
フェーズ（`draft` / `review` / `finalize` など）と `difficulty` の組み合わせから、`exec-agent.yaml` がエージェント tier を決定する。

```text
(phase_set, phase.id, difficulty)
        ↓
exec-agent.yaml の phase_tier_rules / difficulty_overrides
        ↓
tier（small / full / expert）
        ↓
tier_routing → agent コマンド
```

`sch-strategy-<track>.yaml` は AI の設定を持たない。AI 関連の設定は `exec-agent.yaml` に集約する。

## 5. Task 粒度

Task は AI Agent が一度の実行で完了できる粒度に設計する。

| 指標            | 推奨値       |
| --------------- | ------------ |
| `duration_days` | 0.125 〜 1   |
| 変更ファイル数  | 1 〜 5       |
| 責務            | 1 つ         |

粒度が大きすぎる場合は Task を分割し、小さすぎて独立完了できない場合は統合する。

## 6. Dependency 設計

依存関係は最小限にする。依存が多いほど並列実行できる Ready タスクが減り、スループットが低下する。

```text
良い例（最小依存）:
  migration → repository → api endpoint

悪い例（過剰依存）:
  migration → repository → api → test → docs → release
```

Ready タスク数の目安は同時に 5 〜 20 件。これを下回る状態が続く場合は依存関係を見直す。

## 7. CPM とクリティカルパス

`specdojo exec build` は Schedule から CPM（Critical Path Method）を計算し、各 Task の ES / EF / LS / LF / Slack を求める。

```text
generated/cpm.md          — CPM 計算結果
generated/critical-path.md — クリティカルパス一覧
```

Slack が 0 の Task がクリティカルパスに乗る。これらの遅延はプロジェクト全体の遅延に直結するため、優先して Ready にする。

## 8. AI 実行フロー

`specdojo exec run --auto` は次の手順でタスクを自動実行する。

```text
exec build
  → ready.json に Ready タスクを出力
exec run --auto
  → ready.json から次のタスクを読み取り
  → exec-agent.yaml で tier / エージェントを解決
  → opencode run --agent <agent> <プロンプト> を実行
  → complete でイベントを記録
exec build（再実行）
  → 状態を更新して次の Ready タスクを計算
```

人間による実行が必要なタスクは `agent_mode: manual` を指定する。

## 9. 手動実行手順

`specdojo exec run --auto` が行う処理をステップバイステップで手動再現する手順を示す。
エージェントの動作確認やトラブルシュートに使う。

### 9.1. `exec build` でスケジュールを最新化する

```sh
specdojo exec build --project <project-id>
```

`generated/ready.json` と `generated/agent-briefs/` が更新される。

### 9.2. 次のタスクを確認する

```sh
cat generated/ready.json | jq '.strategies["critical-first"].next_task_id'
# または
cat generated/ready.md
```

`ready.json` の `strategies.critical-first.next_task_id` が次の実行対象タスク ID（以降 `<task-id>`）。
`tasks[].cpm.slack` が `0` のタスクがクリティカルパス上のタスク。

### 9.3. タスクの `local_id` とフェーズサフィックスを確認する

タスク ID の末尾 3 桁が `task_suffix`（例: `T-LAUNCH-PJD-OVERVIEW-010` → `010`）。
タスク名の先頭スペース区切りトークンが `local_id`（例: `"prj-overview たたき台作成"` → `prj-overview`）。

```sh
cat generated/ready.json | jq '.tasks[] | select(.id == "<task-id>") | {name, id}'
```

### 9.4. `sch-strategy-*.yaml` で `phase_set` と `difficulty` を確認する

`owner_rules` の `local_ids` に対象 `local_id` が含まれるエントリを探す。

```sh
grep -A 5 '<local_id>' docs/ja/projects/<project>/030-project-management/schedule/sch-strategy-*.yaml
```

取得した `phase_set`（省略時は `default_phase_set`）と `difficulty`（省略時は `normal`）を記録する。
次に `phase_sets[<phase_set>]` から `task_suffix` が一致するエントリを探し、`phase.id` を取得する。

### 9.5. `exec-agent.yaml` で tier を決定する

`.specdojo/exec-agent.yaml` の `phase_tier_rules` を上から評価し、`phase_set` と `phase`（`phase.id`）が一致する最初のルールの `tier` と `capabilities` を取得する。

次に `difficulty_overrides` を評価する。`difficulty` が一致するルールの `min_tier` が現在の `tier` より上位であれば昇格させる（`small` → `full` → `expert` の順）。

### 9.6. `tier_routing` と `agent_commands` でコマンドを決定する

`capabilities` がある場合は `<tier>+<capability>` の複合キーを先に確認する。なければ `<tier>` にフォールバックする。

```yaml
# 例: tier=full の場合
tier_routing:
  full:
    cmd: opencode-edit    # ← このキーを agent_commands で引く
    by: edit-agent

agent_commands:
  opencode-edit: "opencode run --agent edit-agent"
```

取得したシェルコマンド文字列（例: `opencode run --agent edit-agent`）が実行コマンドの基底になる。

### 9.7. エージェントブリーフを確認する

```sh
cat generated/agent-briefs/<task-id>.md
```

このファイルの内容がエージェントへのプロンプトとして渡される。

### 9.8. エージェントを実行する

ブリーフの内容を最後の引数として追加して実行する。

```sh
opencode run --agent edit-agent "$(cat generated/agent-briefs/<task-id>.md)"
```

ドライランで確認する場合:

```sh
specdojo exec run --task <task-id> --dry-run --project <project-id>
```

### 9.9. 完了イベントを記録する

エージェントが正常終了したら `complete` イベントを書き込む。

```sh
specdojo exec complete --task <task-id> --by <actor> --msg "manual run"
```

### 9.10. `exec build` を再実行して次の Ready タスクを更新する

```sh
specdojo exec build --project <project-id>
```

完了したタスクの後続タスクが新たに Ready になり、`ready.json` が更新される。

## 10. レートリミット対応

AI モデルのレートリミットに達した場合、`exec run` は `exec-agent.yaml` の `rate_limit_policy` に従って自動対応する。

| タスクの種別 | `cpm.slack` | 対応 |
| ------------ | ----------- | ---- |
| 非クリティカル | `> 0` | skip：`block` イベントを記録し次のタスクへ |
| クリティカル | `== 0` | `fallback_tier` で代替モデルに切り替えて再試行。それも失敗なら `wait_seconds` 待機して再試行 |

クリティカルパス上のタスクはスキップせず、必ず完了させることでプロジェクト完了日への影響を防ぐ。
設定の詳細は `specdojo-command-usage-guide.md` の `exec run` セクションを参照すること。

## 11. Anti-patterns

| Anti-pattern                   | 問題点                                             |
| ------------------------------ | -------------------------------------------------- |
| 巨大 Task（1日以上）           | AI が一度の実行で完了できず、途中状態が残りやすい  |
| 過剰依存チェーン               | Ready タスクが常に少なく、並列実行の恩恵を得られない |
| `duration_days: 0` の Task     | ゼロ期間は Milestone を使う                       |
| `depends_on` の省略            | 前提なしでも `[]` と明示する                       |
| 成果物パスを Schedule に直接記載 | パスは成果物カタログが管理する                    |
| `sch-strategy` に AI 設定を記載 | AI 関連は `exec-agent.yaml` に集約する            |
