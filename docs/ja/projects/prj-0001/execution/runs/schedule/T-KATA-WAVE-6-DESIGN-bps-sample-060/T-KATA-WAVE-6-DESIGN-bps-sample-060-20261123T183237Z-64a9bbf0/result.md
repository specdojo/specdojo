---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-design-bps-sample-060-20261123t183237z-64a9bbf0
  type: exec-result
  task_id: T-KATA-WAVE-6-DESIGN-bps-sample-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-DESIGN-bps-sample-060/T-KATA-WAVE-6-DESIGN-bps-sample-060-20261123T183237Z-64a9bbf0/plan.md
  started_at: "2026-11-23T18:32:46.542Z"
  completed_at: "2026-11-23T19:38:09.998Z"
  agent: opus-executor
  execution: agent
  approach: template-maintenance
  targets:
    - specdojo:bps-sample
    - specdojo:bps-template
---

# Edit Result

## 1. 実施内容

- 業務プロセス仕様の template (`bps-template.md`) を `rulebook` および `sample` の内容に合わせて更新しました。
- 「検証・受入観点」において、主要例外の扱いに関する指示を、例外がある場合に限定した記述へ修正しました（F001 対応）。
- 「未決事項」の表の構造を、`rulebook` および `sample` に合わせ、「論点」「影響する章・ステップ」「当面の扱い」の3列に変更しました（F002 対応）。また、論点ラベルを可変の `_ISSUE_LABEL_` とし、`_TODO_`、`_UNDECIDED_`, `_ASSUMPTION_` の選択方法を注記しました。
- PJR-76N9 に基づき、決定者や決定時期などの情報を本文に含めないよう、既存の列を削除しました。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/bps-template.md`: `rulebook` の要件と `sample` の構造に基づき、`finding` で指摘された「検証・受入観点」の指示文および「未決事項」のテーブル構造を修正しました。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

参照されている `sample` (`docs/ja/specdojo/samples/bps-sample.md`) および `rulebook` の指示に基づき、`template` (`docs/ja/specdojo/templates/bps-template.md`) の章構成とプレースホルダの定義を同期させました。具体的には、例外処理に関する記述の整合性と、未決事項を管理するためのテーブル定義の簡略化・可変化を行いました。
