---
id: xep-T-LAUNCH-pm-plan-010
task_id: T-LAUNCH-pm-plan-010
mode: edit
status: ready
project_id: prj-0001
generated_at: 2026-06-02T21:53:15.292Z
---

# Edit Plan: T-LAUNCH-pm-plan-010

このプランは ready 時点の実行ビューです。進捗の正本は exec/events です。

## 1. タスク概要

- task_id: `T-LAUNCH-pm-plan-010`
- project_id: `prj-0001`
- name: たたき台作成
- owner: PM
- schedule_file: `sch-track-launch.yaml`

## 2. 対象成果物

- path: `/docs/ja/projects/prj-0001/030-project-management/010-management-plan/pm-plan.md`

done_criteria:

- プロジェクト全体の管理方針・プロセスを承認できる粒度で記述されていること
- 計画・進捗・リスク管理の方針が記述されていること
- 業務プロセスとの整合が確認できること
- 構成管理・技術管理の観点が含まれていること
- レビュー方針・品質基準への参照が確認できること

## 3. 依存と優先度

- depends_on:
- urgency: 遅延余裕あり（slack=3.25）。
- CPM: `ES=0, EF=0.25, LS=3.25, LF=3.5, slack=3.25`

## 4. 実施手順

1. 対応する成果物を特定する。
2. task 名と notes に沿って成果物を更新する。
3. 必要な検証と lint を実行する。
4. result ファイルの done_criteria_checked セクションを記入する。
   result: `exec/results/T-LAUNCH-pm-plan-010-result.md`
5. 完了したら正常終了する（終了コード 0）。
6. 実装できない・問題が解決できない場合は標準エラー出力に理由を書いて異常終了する（終了コード 1）。

## 5. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。

## 6. 注意事項

- このファイルに進捗を追記しない。状態は events のみを正本とする。
- 依存未解決時は complete ではなく block を記録する。

## 7. 参照先

- ready source: `generated/ready.json`
- task catalog: `generated/task-catalog.md`
- CPM summary: `generated/cpm.md`
- critical path: `generated/critical-path.md`
- execution events: `exec/events/*.json`
