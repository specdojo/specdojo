---
specdojo:
  id: prj-0001:pjr-pzbp-routine-state-outside-git
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-06T15:05:10Z"
  due_on: null
  derived_from:
    - PJR-VH8D
---

# PJR-PZBP 定期処理の状態を Git の外へ移し、何もしなかった job の記録を残さない

## 1. 概要

routine-state.json と routine-runs.jsonl を端末の状態を置く場所へ移し、job の記録なしで失敗した実行だけを Git に残す。何も変えなかった job の実行記録は commit しない（VH8D の #8）

## 2. 入力

- PJR-VH8D の決定（2026-11-07 indie）: 実行記録は run 単位のディレクトリ execution/runs/`<出どころ>`/`<項目 ID>`/`<run ID>`/ に plan.md・result.md・evidence.json・ログを置く（R1）。出どころは register・schedule・job。置き場所を決める処理はコードの 1 つのモジュールにまとめる（R2）。exec validate と CI で置き場所を検査する（R3）。ガイドの構成図をモジュールと照らすテストを置く（R4）。grade/results と jobs/ の定義は外に残す。既存は git mv で移し、パスの欄だけ書き換える
- 利用者の決定（PJR-VH8D #8）: 定期処理の実行状態と履歴は Git の外の端末の状態を置く場所へ移す。Git に残すのは job の実行記録を残さずに失敗した定期処理の実行だけとし、正常に何もしなかった実行（skip を含む）は残さない。precondition を持たない job が動いて何も変えなかった場合も実行記録を commit しない。実現の方法は設計で決める（2026-11-06）

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
