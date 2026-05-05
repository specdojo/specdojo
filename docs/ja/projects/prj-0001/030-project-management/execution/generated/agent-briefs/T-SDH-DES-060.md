# Agent Brief: T-SDH-DES-060

このブリーフは ready 時点の実行ビューであり、進捗の正本ではない。
進捗・監査・状態判定は exec/events のイベントログを参照する。

## 1. タスク概要

- task_id: `T-SDH-DES-060`
- project_id: `prj-0001`
- specdojo_cli_project: `shj-0001`
- name: 技術スタック定義ルールの起草・レビュー
- owner: ARC
- kind: task
- artifact_kind: rules の起草・レビュー
- schedule_file: `sch-design.yaml`
- wbs: `WBS-DES-TSD-060`
- duration_days: `0.5`

## 2. 実施内容

- primary_goal: 技術スタック定義ルールの起草・レビュー
- schedule_notes: Phase 1 はエージェント起草・修正・レビューを連続実行し、中間の人間承認は省略可能。最終承認は後段で一括実施。
- tags: `design`, `rulebook-lifecycle`

## 3. 対象成果物候補

primary_paths:

- docs/ja/specdojo/rulebooks/tsd-rulebook.md

secondary_paths:

- docs/ja/specdojo/instructions/tsd-instruction.md
- docs/ja/specdojo/samples/tsd-sample.md

## 4. 依存と優先度

- depends_on: `M-SDH-100`
- critical_first_rank: `3`
- fifo_rank: `7`
- urgency: 遅延余裕あり（slack=1.75）。
- CPM: `ES=0, EF=0.5, LS=1.75, LF=2.25, slack=1.75`

## 5. 実行ガイド

1. 対象 task を claim する。
2. 対応する rules / instruction / sample の対象を特定する。
3. task 名と notes に沿って成果物を更新する。
4. 必要な検証と lint を実行する。
5. 完了時のみ complete、問題があれば block を記録する。

```bash
specdojo exec claim --project shj-0001 --task T-SDH-DES-060 --by <agent> --msg "start"
# edit / validate / lint
specdojo exec complete --project shj-0001 --task T-SDH-DES-060 --by <agent> --msg "done"
```

## 6. block 時の記録テンプレート

- block_conditions: 依存未解決、レビュー不能、対象ファイル不明、lint/test 未解消
- block_msg_template:

```text
blocked: <reason>; need=<next action>; ref=<path or issue>
```

```bash
specdojo exec block --project shj-0001 --task T-SDH-DES-060 --by <agent> --msg "blocked: <reason>; need=<next action>; ref=<path or issue>"
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
