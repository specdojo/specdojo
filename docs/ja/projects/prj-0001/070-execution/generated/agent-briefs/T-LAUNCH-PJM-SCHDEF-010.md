# Agent Brief: T-LAUNCH-PJM-SCHDEF-010

このブリーフは ready 時点の実行ビューであり、進捗の正本ではない。
進捗・監査・状態判定は exec/events のイベントログを参照する。

## 1. タスク概要

- task_id: `T-LAUNCH-PJM-SCHDEF-010`
- project_id: `prj-0001`
- specdojo_cli_project: `prj-0001`
- name: sch-defaults たたき台作成
- owner: ARC
- kind: task
- schedule_file: `sch-track-launch.yaml`
- duration_days: `0.125`

## 2. 実施内容

- primary_goal: sch-defaults たたき台作成
- schedule_notes: -
- tags: -

## 3. 対象成果物

- path: `sch-defaults.yaml`

done_criteria:

- PO がカレンダー・開始日などのデフォルト設定を承認できること
- BA が業務稼働日・休日設定が確認できること
- ARC が validate:schema を通過していることを確認できること
- QE が設定値の妥当性を確認できること

## 4. 依存と優先度

- depends_on: -
- critical_first_rank: `3`
- fifo_rank: `3`
- urgency: 遅延余裕あり（slack=2.0625）。
- CPM: `ES=0, EF=0.125, LS=2.0625, LF=2.1875, slack=2.0625`

## 5. 実行ガイド

1. 対象 task を claim する。
2. 対応する成果物を特定する。
3. task 名と notes に沿って成果物を更新する。
4. 必要な検証と lint を実行する。
5. 完了時のみ complete、問題があれば block を記録する。

```bash
specdojo exec claim --project prj-0001 --task T-LAUNCH-PJM-SCHDEF-010 --by <agent> --msg "start"
# edit / validate / lint
specdojo exec complete --project prj-0001 --task T-LAUNCH-PJM-SCHDEF-010 --by <agent> --msg "done"
```

## 6. block 時の記録テンプレート

- block_conditions: 依存未解決、レビュー不能、対象ファイル不明、lint/test 未解消
- block_msg_template:

```text
blocked: <reason>; need=<next action>; ref=<path or issue>
```

```bash
specdojo exec block --project prj-0001 --task T-LAUNCH-PJM-SCHDEF-010 --by <agent> --msg "blocked: <reason>; need=<next action>; ref=<path or issue>"
```

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
