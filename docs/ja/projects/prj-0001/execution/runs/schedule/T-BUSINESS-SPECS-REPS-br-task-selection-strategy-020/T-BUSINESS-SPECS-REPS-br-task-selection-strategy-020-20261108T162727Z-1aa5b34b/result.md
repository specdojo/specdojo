---
specdojo:
  id: prj-0001:xer-t-business-specs-reps-br-task-selection-strategy-020-20261108t162727z-1aa5b34b
  type: exec-result
  task_id: T-BUSINESS-SPECS-REPS-br-task-selection-strategy-020
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-BUSINESS-SPECS-REPS-br-task-selection-strategy-020/T-BUSINESS-SPECS-REPS-br-task-selection-strategy-020-20261108T162727Z-1aa5b34b/plan.md
  started_at: "2026-11-08T16:27:29.348Z"
  completed_at: "2026-11-08T16:41:17.251Z"
  agent: opus-executor
  execution: agent
  approach: freeform
  targets:
    - br-task-selection-strategy
---

# Edit Result

## 1. 実施内容

- ビジネスルール（タスク選択戦略）の草案を新規作成し、`status`: `draft` として保存した。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/030-business-model/br-task-selection-strategy.md`: タスク選択戦略（critical-first / fifo 等）のルール定義を含む草案を新規作成した。

## 3. 申し送り

- 依存成果物 `bps-task-selection-preparation`（docs/ja/product/010-business-specs/030-business-model/bps-task-selection-preparation.md）が未作成のまま、スケジューラは本タスクを Ready と判定した。本書の適用範囲と対象外は実装（src/exec/schedule/ready.ts, src/exec/core.ts, src/exec/commands.ts, src/exec/run/schedule-mode.ts）、dct-business-model-br / dct-business-model-bps の定義、gl-common.yaml、prj-overview.md から仮置きした。同仕様の作成後に `P-07-01` の手順との対応を確認する必要がある。
- PO の判断待ち: `fifo` はタスク ID の辞書順で、到着順ではない。業務上の意味（到着順）に合わせるか、名称・説明を ID 順へ改めるかを決める必要がある。
- 判断待ち: agent-members / pm-members の schema の `scheduler_strategy` は dependency-first / manual も受け付けるが、選択時（`resolveSchedulerStrategy`）にエラーになる。受け付ける値を揃えるか、両戦略を定義する必要がある。
- 判断待ち: `exec scheduler` はメンバーの `scheduler_strategy` を参照するが、`exec run --auto` / `exec cycle` は参照せず、そのまま critical-first を既定値として使う。揃えるか、意図した差として明記するかを決める必要がある。
- result の『進め方と実践の型の適用』に記録する内容: 既存記述はなく新規作成した。実践の型は br-rulebook の章構成だけを参考にし、判定内容は実装を正とした。Web 検索は行っていない（内部情報で判断できたため）。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/product 配下の成果物だけで、plan / result / pjr 個票は変更していない）
- 適用外の検証: `specdojo catalog validate`（変更は docs/ja/product/ 配下だけで、docs/ja/projects/ には及んでいない）

## 4. 進め方と実践の型の適用

既存記述がないため新規作成を行い、依存成果物 `bps-task-selection-preparation` が未作成であることから、実装コードやカタログ定義、プロジェクト概要などの内部情報を根拠に草案を組み立てた。実践の型については `br-rulebook` の章構成を参考にしつつ、具体的な判定ロジックは実装に基づいた記述とした。
