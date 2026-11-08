---
specdojo:
  id: prj-0001:xer-t-business-specs-reps-bes-task-ready-selected-020-20261108t161513z-750c6005
  type: exec-result
  task_id: T-BUSINESS-SPECS-REPS-bes-task-ready-selected-020
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-BUSINESS-SPECS-REPS-bes-task-ready-selected-020/T-BUSINESS-SPECS-REPS-bes-task-ready-selected-020-20261108T161513Z-750c6005/plan.md
  started_at: "2026-11-08T16:15:14.277Z"
  completed_at: "2026-11-08T22:22:26.719Z"
  agent: opus-executor
  execution: agent
  approach: freeform
  targets:
    - bes-task-ready-selected
---

# Edit Result

## 1. 実施内容

- 業務イベント仕様 `bes-task-ready-selected.md` の草案を新規作成しました。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/030-business-model/bes-task-ready-selected.md`: 実行可能なタスクが選択されたイベントを定義する草案を新規作成しました。`specdojo:bes-rulebook` の 5 項目構成に基づき、単発・自動・並列の起点区分、確定時点、発生条件、事実データを記述し、未決事項を `_TODO_` および `_ASSUMPTION_` として明記しています。

## 3. 申し送り

- 依存先の `bes-index` が未作成のため参照できていない。作成時に `P-07` の起点イベント行から `bes-task-ready-selected` へリンクする必要がある（本文 `_TODO_`）。
- 自動選択では選択と着手宣言（`claim`）が同じ排他区間で続けて行われる。2 つを業務上同じ時点とみなすかは未決で、refine（070）で `bps-task-selection-preparation` と照合して決める。
- 対象を schedule 系のタスクに限るという `_ASSUMPTION_` を置いた。register 系・routine 系の選択も同じイベントにまとめるかは `bes-index` 作成時に決める。
- 並列選択で「同じ要求で選ばれた」ことを示す情報を、実行記録の既存項目で表せるかは未確認。データモデルの磨き込みで照合する。
- 参照先の `br-task-selection-strategy`・`bps-task-selection-preparation`・`bps-parallel-required` は未作成のため、wikilink ではなくインラインコードで仮置きした。
- plan の approach は freeform だが、カタログが `specdojo:bes-rulebook` を指定しているので、その 5 項目構成に合わせた。根拠にした文書は `cdfd-overview`、`cdfd-uc-schedule`、`prj-0001:stsd-task-execution`、`dct-business-model-bes` / `bps` / `br` のカタログ、類似成果物 `bps-task-completion`、`prj-overview`。実装（`src/exec/schedule/ready.ts`、`src/exec/run/schedule-mode.ts`、`src/exec/commands.ts`）は、選択経路が単発・自動・並列の 3 つあることの確認にだけ使った。Web 検索は使っていない。対象ファイルは新規作成のため、破棄した既存記述はない。
- 依存先の `bes-index` が未作成のため参照できていない。作成時に `P-07` の起点イベント行から `bes-task-ready-selected` へリンクする必要がある（本文 `_TODO_`）。
- 対象を schedule 系のタスクに限るという `_ASSUMPTION_` を置いた。register 系・routine 系の選択も同じイベントにまとめるかは `bes-index` 作成時に決める。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/product 配下の成果物だけで、pjr 個票や plan.md / result.md などの履歴ファイルは変更していない）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/product/ 配下だけで docs/ja/projects/ には及んでいない）
- 適用外の検証: `npm run validate:schema:file`（変更した `*.yaml` / `*.yml` ファイルがない）

## 4. 進め方と実践の型の適用

カタログ指定の `specdojo:bes-rulebook` に従い、単発・自動・並列の 3 パターンの起点区分を軸とした 5 項目構成で草案を組み立てました。プロジェクト共通文脈（`prj-overview.md`）および類似成果物（`bps-task-completion` 等）に基づき、イベント発生条件と事実データを定義し、未確定の論点は `_TODO_` / `_ASSUMPTION_` として明記しています。
