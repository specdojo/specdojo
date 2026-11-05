---
specdojo:
  id: prj-0001:pjr-q9aw-stsd-task-execution-refine
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-04T23:38:12Z"
  block_reason: "executor reported incomplete: 依存成果物 bdd-exec-state.yaml／bdd-exec-event.yaml が存在せず停止。個票の対応結果のみ更新し、標準エラーへ理由を出力、終了コード1。"
  derived_from:
    - PJR-3APD
  depends_on:
    - PJR-1799
    - PJR-H2V8
  approach: fully-guided
  targets:
    - prj-0001:stsd-task-execution
---

# PJR-Q9AW stsd-task-execution を磨き込む

## 1. 概要

stsd の試行（3APD）の段 3。draft した stsd-task-execution を fully-guided で磨き込み、Kata の出来を測る材料にする

## 2. 入力

- 磨き込みは stsd の Kata（rulebook・図の rulebook・recipe・sample・template）に沿って行う。Kata の出来は、この 1 件を材料に人が判断する（3APD の段 5）
- draft（PJR-1799）の T-12（完了から終了、「成果物受入」）と T-13（中止から終了、「中止確定」）は実装にないイベントで、推測で埋められている。実装で確かめて直すか、終了点を置かない理由を「概要」に書く（stsd の rulebook の状態遷移図の規則）（2026-11-05 orchestrator の確認）

## 3. 完了条件

- [[stsd-task-execution]] を、[[specdojo:stsd-rulebook]] と stsd の recipe・sample に沿って磨き込んでいる。カタログの `done_criteria`（BA・PO・ARC・QE・DEV の観点）を満たすよう、足りない記述を補っている。
- draft で `_UNDECIDED_` として残した点を、実装で確かめて埋めるか、残す理由を書いている。
- Kata（rulebook・recipe・sample・template）に従うと実物に合わない点、書けない点を、Kata の種類と場所を添えて個票の対応結果に書いている。3APD の段 5（手入れか作り直しかの判断）の材料にする。
- `docs/ja/product/010-business-specs/020-data-model/stsd-task-execution.md` 以外の成果物と Kata は変えていない。Kata に直すべき点を見つけた場合は、変えずに個票の対応結果に書く。
- `npm run -s lint:md` と `npm run -s lint:fm` が通っている。

## 4. 作業内容

| No  | 作業                                                 | 担当 | 状態 | メモ |
| --- | ---------------------------------------------------- | ---- | ---- | ---- |
| 1   | Kata と done_criteria に照らして足りない点を洗い出す | BA   | open | -    |
| 2   | 磨き込み、検査を通す                                 | BA   | open | -    |
| 3   | Kata の合わない点を対応結果に書く                    | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[stsd-task-execution]]: 対象の成果物
- [[specdojo:stsd-rulebook]]: stsd の書き方の規範
