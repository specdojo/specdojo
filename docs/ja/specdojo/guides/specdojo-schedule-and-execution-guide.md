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

## 9. Anti-patterns

| Anti-pattern                   | 問題点                                             |
| ------------------------------ | -------------------------------------------------- |
| 巨大 Task（1日以上）           | AI が一度の実行で完了できず、途中状態が残りやすい  |
| 過剰依存チェーン               | Ready タスクが常に少なく、並列実行の恩恵を得られない |
| `duration_days: 0` の Task     | ゼロ期間は Milestone を使う                       |
| `depends_on` の省略            | 前提なしでも `[]` と明示する                       |
| 成果物パスを Schedule に直接記載 | パスは成果物カタログが管理する                    |
| `sch-strategy` に AI 設定を記載 | AI 関連は `exec-agent.yaml` に集約する            |
