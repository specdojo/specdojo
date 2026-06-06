---
id: xep-t-launch-pm-plan-010
type: exec-plan
rulebook: xep-rulebook
task_id: T-LAUNCH-pm-plan-010
mode: edit
status: ready
project_id: prj-0001
owner: PM
---

# Edit Plan: T-LAUNCH-pm-plan-010

## 1. このフェーズで行うこと

担当ロールが成果物の初版を作成する。
章構成・記載項目を決め、現時点で把握している情報を埋める。
調査・確認が必要な箇所は TODO として明示したまま残す。

## 2. 対象成果物

- path: `/docs/ja/projects/prj-0001/030-project-management/010-management-plan/pm-plan.md`
- result: `exec/results/T-LAUNCH-pm-plan-010-result.md`

**done_criteria:**

- プロジェクト全体の管理方針・プロセスを承認できる粒度で記述されていること
- 計画・進捗・リスク管理の方針が記述されていること
- 業務プロセスとの整合が確認できること
- 構成管理・技術管理の観点が含まれていること
- レビュー方針・品質基準への参照が確認できること

## 3. 完了手順

1. 「このフェーズで行うこと」に従って成果物を更新する。
2. 必要な検証と lint を実行する。
3. result の done_criteria_checked セクションを記入する。

## 4. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- 異常終了時は complete ではなく block を記録する。
