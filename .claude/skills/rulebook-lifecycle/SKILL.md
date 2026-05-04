---
name: rulebook-lifecycle
description: '*-rulebook.md の作成からその派生成果物（instruction / sample）の作成までを、エージェントと人間のレビューサイクルで進めるワークフロー Skill です。'
---

# SKILL: rulebook-lifecycle

`*-rulebook.md` の作成からその派生成果物（instruction / sample）の作成までを、
エージェントと人間のレビューサイクルで進めるワークフロー Skill です。

## 使いどころ

- 新規の `*-rulebook.md` を作成し、そのまま派生成果物まで一貫して仕上げたいとき
- WBS アイテム単位でルールと派生成果物の完成度をトラッキングしたいとき
- Phase 1（rules）完了後に Phase 2（derivatives）へ進む判断を人間が行いたいとき

## 前提

- すべての入力/出力パスは `docs/ja/specdojo/` 配下を基準とする
- Phase 1 では、別の `*-input.md` は作成しない
- Agent は `*-rulebook.md` の雛形を直接作成し、人はその中の `_TODO_:` / `_UNDECIDED_:` / `_ASSUMPTION_:` を追記・更新する

### specdojo 実行前提

- 進捗の記録と判定は `specdojo` CLI を正本として扱う。
- 実行時は `--project <project-id>` を明示する（例: `shj-0001`）。
- 作業開始前に、対象プロジェクトの解決先を確認する。

```bash
specdojo exec where --project <project-id>
specdojo exec validate --project <project-id>
specdojo exec build --project <project-id>
```

## 役割ラベルと担当主体

この Skill では、プロジェクト標準の `PO / BA / ARC / QE` をそのまま使い、
実行モードに応じて「誰が実行するか（人 / Agent）」を切り替える。

| ラベル | 主な責務                                           | Manual モード | Standard モード | Agent-Max モード                  |
| ------ | -------------------------------------------------- | ------------- | --------------- | --------------------------------- |
| `PO`   | フェーズゲート判断、最終承認、進行可否の決定       | **人**        | **人**          | **人**                            |
| `BA`   | 内容妥当性の修正、業務観点の追記・調整             | **人**        | **人**          | **Agent（必要時のみ人レビュー）** |
| `ARC`  | rules/derivatives の下書き作成、構造・整合レビュー | **Agent**     | **Agent**       | **Agent**                         |
| `QE`   | lint・禁止事項・責務境界の品質確認                 | **Agent**     | **Agent**       | **Agent**                         |

### 運用ルール

- `PO` は常に人が担当する（承認と意思決定は人のみ）。
- `ARC` と `QE` は Agent が担当する（同一 Agent が兼務してよい）。
- `BA` は Manual / Standard では人、Agent-Max では Agent へ委譲できる。
- Manual では Agent 実行ステップ（①③⑤⑥）ごとに人が完了確認する。
- Agent-Max でも、Phase 終了判定と `status: ready` 反映は `PO` の承認後に行う。

### 実行モード

| モード名      | スキーマ値    | 意図                                | 人が介在するポイント                     |
| ------------- | ------------- | ----------------------------------- | ---------------------------------------- |
| `Manual`      | `manual`      | Agent 実行を1ステップごとに確認する | ①③⑤⑥の完了確認 + ②修正 + ④承認 + ⑦承認   |
| `Standard`    | `standard`    | バランス重視                        | ②修正、④承認、⑦承認                      |
| `Agent-Max`   | `agent-max`   | 可能な限り Agent に委譲             | ④承認、⑦承認（必要時のみ ②で人レビュー） |
| `Agent-Ultra` | `agent-ultra` | 人の介在を最終承認1回まで圧縮       | 最終承認のみ（⑦で一括）                  |

### Manual のゲート運用

- ①③⑤⑥の各ステップで、Agent 出力を人がその都度確認してから次へ進む。
- ②④⑦は Standard と同様に人が実施する。
- 進捗ログには `manual-step-check` を含むメッセージを推奨する。

### Agent-Ultra のゲート運用

- ④の承認をスキップし、Phase 1 は `status: draft` のまま Phase 2 に進む。
- ⑦で rules/instruction/sample をまとめて最終承認し、同時に `status: ready` へ更新する。
- ⑦で差し戻しとなった場合は、②または⑤へ戻して Agent が再修正する。
- 監査のため、⑦の承認時に「一括承認モード」を明記する（PR コメントまたはコミットメッセージ）。

### 参照リソース

| 種別        | パス / 参照                                             |
| ----------- | ------------------------------------------------------- |
| rules 作成  | `@file:.github/skills/upsert-rulebook/SKILL.md`         |
| instruction | `@file:.github/skills/rulebook-to-instruction/SKILL.md` |
| sample      | `@file:.github/skills/rulebook-to-sample/SKILL.md`      |
| 運用ルール  | `@file:.github/instructions/rulebook.instructions.md`   |

## ワークフロー概要

```text
Phase 1 (rules)                Phase 2 (derivatives)
─────────────────              ──────────────────────
 ① agent draft                  ⑤ agent draft
 ② human modify                 ⑥ agent review
 ③ agent review                 ⑦ human approve
 ④ human approve                   → status: ready
    → status: ready
    → Phase 2 へ
```

- Phase 1 と Phase 2 は **直列** で実行する（Phase 1 完了が Phase 2 の前提）
- 各ステップの完了は **人間の明示的な承認** で確定する

### ステップ別担当（役割ラベル × 人/Agent）

| ステップ | 作業                        | 主担当ラベル | Manual              | Standard | Agent-Max             | Agent-Ultra         |
| -------- | --------------------------- | ------------ | ------------------- | -------- | --------------------- | ------------------- |
| ①        | agent draft (rules)         | `ARC`        | Agent（都度人確認） | Agent    | Agent                 | Agent               |
| ②        | modify (rules)              | `BA`         | 人                  | 人       | Agent（必要時のみ人） | Agent               |
| ③        | agent review (rules)        | `QE`         | Agent（都度人確認） | Agent    | Agent                 | Agent               |
| ④        | human approve (rules)       | `PO`         | 人                  | 人       | 人                    | スキップ            |
| ⑤        | agent draft (derivatives)   | `ARC`        | Agent（都度人確認） | Agent    | Agent                 | Agent               |
| ⑥        | agent review (derivatives)  | `QE`         | Agent（都度人確認） | Agent    | Agent                 | Agent               |
| ⑦        | human approve (derivatives) | `PO`         | 人                  | 人       | 人                    | 人（rules含め一括） |

- `BA` は ② で主担当、④/⑦ では `PO` の相談先（Consulted）として参加する。
- `PO` は ①/③/⑤/⑥ のレビュー結果を確認し、次フェーズ進行可否を最終決定する。

## Phase 1: Rules ライフサイクル

### ① agent draft — ルールの初版作成

1. 対象 `<name>` を特定する（WBS の deliverables パス、または開いているファイルから）
2. `upsert-rulebook` Skill を使って `rules/<name>-rulebook.md` を新規作成またはアップサートする
3. 未確定事項がある箇所には `_TODO_:` / `_UNDECIDED_:` / `_ASSUMPTION_:` を入れた雛形として作成する
4. Frontmatter の `status` を `draft` に設定する
5. `npm run -s lint:md` で検証する

**完了条件**: lint エラーなし、標準章構成（`全体方針` 〜 `生成 AI への指示テンプレート`）を満たしている

### ② modify — ドラフト修正（人 / Agent）

1. エージェントがドラフトの要約と、`_TODO_:` / `_UNDECIDED_:` / `_ASSUMPTION_:` を追記すべき箇所を提示する
2. Manual / Standard では人間が `*-rulebook.md` 本文の中でラベル付き項目を追記・更新し、Agent-Max では Agent が修正を実行する
3. 別の `*-input.md` は作成せず、必要な未確定情報は `*-rulebook.md` 本文に保持する
4. 修正が完了したら、エージェントレビュー（③）に進む

**完了条件**: 修正差分が反映され、③へ進める状態であること

### ③ agent review — エージェントによるレビュー

以下の観点でレビューを実施する:

- `docs/ja/specdojo/standards/rulebook-structure-standard.md` との章構成整合
- `docs-contents-guide.md` との目的・内容整合
- 禁止事項（曖昧語、実装詳細、章番号飛び）の検出
- `サンプル（最小でも可）` のリンクと `生成 AI への指示テンプレート` のリンクの有効性
- lint チェック結果

**出力**: レビュー指摘事項リスト（問題なし / 修正提案あり）

### ④ human approve — 人間による最終承認

1. レビュー指摘がある場合、人間が対応方針を判断する
2. Frontmatter の `status` を `ready` に更新する
3. Phase 2 に進むかを人間が判断する

**完了条件**: `status: ready` かつ人間が Phase 2 進行を承認

## Phase 2: Derivatives ライフサイクル

### ⑤ agent draft — 派生成果物の一括作成

Phase 1 で完成した `rules/<name>-rulebook.md` を入力として、以下を作成する:

1. `instructions/<name>-instruction.md` — `rulebook-to-instruction` Skill を使用
2. `samples/<name>-sample.md` — `rulebook-to-sample` Skill を使用

それぞれ Frontmatter の `status` を `draft` に設定する。

### ⑥ agent review — エージェントによる整合性レビュー

以下の観点で instruction と sample をレビューする:

- rules の必須章がすべて反映されているか
- 章タイトル（見出し名称）が rules と整合しているか
- 曖昧語が含まれていないか
- instruction が「AI 実行指示」、sample が「完成イメージ例示」の責務を逸脱していないか
- lint チェック結果

**出力**: 各ファイルのレビュー結果（問題なし / 修正提案あり）

### ⑦ human approve — 人間による最終承認

1. レビュー指摘がある場合、人間が対応方針を判断する
2. 全ファイルの Frontmatter `status` を `ready` に更新する

**完了条件**: instruction と sample の `status` がともに `ready`

## 進捗トラッキング

この Skill では、進捗管理を以下の 2 層で運用する。

1. 機械可読の正本: `specdojo exec` のイベントログ（`exec/events/*.json`）
2. 人間可読の補助: チェックリスト（PR本文、作業メモ）

### 進捗記録の基本手順

#### 1. 実行前に整合確認

```bash
specdojo exec validate --project <project-id>
specdojo exec build --project <project-id>
```

#### 2. 着手時に claim

```bash
specdojo exec claim \
    --project <project-id> \
    --task <task-id> \
    --by <actor> \
    --msg "rulebook-lifecycle:<name>:phase<1|2>-step<1..7>:start"
```

#### 3. 完了時に complete

```bash
specdojo exec complete \
    --project <project-id> \
    --task <task-id> \
    --by <actor> \
    --msg "rulebook-lifecycle:<name>:phase<1|2>-step<1..7>:done"
```

#### 4. 生成物を再計算して状態を更新

```bash
specdojo exec build --project <project-id>
```

#### 5. 必要に応じて block / unblock

```bash
specdojo exec block --project <project-id> --task <task-id> --by <actor> --msg "reason"
specdojo exec unblock --project <project-id> --task <task-id> --by <actor> --msg "resolved"
```

### scheduler の利用

- 次の着手候補は `specdojo exec scheduler` を使って取得する。
- 判定のみ行う場合は `--dry-run` を使う。

```bash
specdojo exec scheduler --project <project-id> --by <actor>
specdojo exec scheduler --project <project-id> --by <actor> --dry-run
```

### 判定に使う生成ファイル

| ファイル                     | 用途                                                 |
| ---------------------------- | ---------------------------------------------------- |
| `generated/ready.json`       | strategy別の ready 順序確認                          |
| `generated/claim-next.json`  | 次の claim 対象確認                                  |
| `generated/state.json`       | task の状態確認（todo/doing/blocked/done/cancelled） |
| `generated/cpm.md`           | CPM と slack の確認                                  |
| `generated/critical-path.md` | クリティカルパスの確認                               |

### チェックリスト運用（補助）

以下のチェックリストは補助資料として使い、最終判定は `specdojo` のイベントと生成物で行う。

```text
[ ] Phase 1: ① agent draft       — <name>-rulebook.md
[ ] Phase 1: ② modify            — <name>-rulebook.md
[ ] Phase 1: ③ agent review      — <name>-rulebook.md
[ ] Phase 1: ④ human approve     — <name>-rulebook.md
[ ] Phase 2: ⑤ agent draft       — <name>-instruction.md, <name>-sample.md
[ ] Phase 2: ⑥ agent review      — <name>-instruction.md, <name>-sample.md
[ ] Phase 2: ⑦ human approve     — rules + derivatives
```

Agent-Ultra では以下を使う。

```text
[ ] Phase 1: ① agent draft        — <name>-rulebook.md
[ ] Phase 1: ② agent modify       — <name>-rulebook.md
[ ] Phase 1: ③ agent review       — <name>-rulebook.md
[ ] Phase 1: ④ skip human approve — carry draft to Phase 2
[ ] Phase 2: ⑤ agent draft        — <name>-instruction.md, <name>-sample.md
[ ] Phase 2: ⑥ agent review       — <name>-instruction.md, <name>-sample.md
[ ] Phase 2: ⑦ human final approve — rules + derivatives
```

## 中断と再開

- 人間が途中で作業を中断する場合、現在のステップ番号と対象ファイルを記録する
- 再開時はそのステップから続行する
- Phase 1 完了後に Phase 2 を保留にすることも可能（`status: ready` は Phase 1 の完了を示す）

## 対象外

- WBS/スケジュールファイルの更新 — 本 Skill のスコープ外
