# Agent Brief: T-LAUNCH-prj-overview-010

このブリーフは ready 時点の実行ビューであり、進捗の正本ではない。
進捗・監査・状態判定は exec/events のイベントログを参照する。

## 1. タスク概要

- task_id: `T-LAUNCH-prj-overview-010`
- project_id: `prj-0001`
- specdojo_cli_project: `prj-0001`
- name: たたき台作成
- owner: BA
- kind: task
- schedule_file: `sch-track-launch.yaml`
- duration_days: `0.25`

## 2. 実施内容

- primary_goal: たたき台作成
- schedule_notes: -
- tags: -

## 3. 対象成果物

- path: `prj-overview.md`

done_criteria:

- [object Object]
- [object Object]
- [object Object]
- [object Object]
- [object Object]

## 4. 依存と優先度

- depends_on: -
- critical_first_rank: `1`
- fifo_rank: `2`
- urgency: クリティカルパス上。遅延余裕なし。
- CPM: `ES=0, EF=0.25, LS=0, LF=0.25, slack=0`

## 5. 実施手順

1. 対応する成果物を特定する。
2. task 名と notes に沿って成果物を更新する。
3. 必要な検証と lint を実行する。
4. 実装が完了したら正常終了する（終了コード 0）。
5. 実装できない・問題が解決できない場合は標準エラー出力に理由を書いて異常終了する（終了コード 1）。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。

## 7. 注意事項

- このファイルに進捗を追記しない。状態は events のみを正本とする。
- 依存未解決やレビュー不能時は complete ではなく block を記録する。
- Agent-Ultra 前提でも最終承認の扱いは schedule と運用ルールに従う。

## 8. 参照先

- ready source: `generated/ready.json`
- task catalog: `generated/task-catalog.md`
- CPM summary: `generated/cpm.md`
- critical path: `generated/critical-path.md`
- execution events: `exec/events/*.json`
