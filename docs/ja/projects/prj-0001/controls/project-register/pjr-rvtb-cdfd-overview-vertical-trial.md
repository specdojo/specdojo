---
specdojo:
  id: prj-0001:pjr-rvtb-cdfd-overview-vertical-trial
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-01T08:50:42Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-T1D1
---

# PJR-RVTB 全体概要の CDFD を縦向きにし、系統ごとの入口のイベントを描いて試す

## 1. 概要

詳細の CDFD を作らず全体概要と BPS で表す案の判断材料として、cdfd-overview の 4 つの図を direction: down にし、系統ごとの入口の起点イベントを 1〜3 個描いて試す。rulebook は変えず、ずれを記録する

## 2. 入力

- 利用者は、残りの CDFD 8 文書を作らず、cdfd-overview と BPS で表す案（D）を検討している。判断の前に、縦向きと入口のイベントを描いた cdfd-overview を見たい（2026-11-01）
- D 案では起点イベントが図から抜けるため、系統ごとの図にその系統を始めるイベントだけを 1〜3 個描く（D-2）を試す（2026-11-01 の対話で利用者が選択）
- 横向きの register 系の図は 4432×864px で、文書の幅では約 16% に縮む。direction: down にすると 2108×2791px になり、今の a <- b の書き方と透明度 0 の線のまま、上から Orchestrator・Plan・Do・Check・Action の順に並ぶことを orchestrator が 4 つの図で確かめた
- cdfd-d2-rulebook は direction: down を階層構造の図に限り、cdfd-overview-rulebook は起点イベントを図に描かないと定めている。試行では rulebook を変えず、ずれを記録する。採用する場合は decision を記録してから rulebook を直し、採用しない場合は書き直しの commit を戻す
- 担当と期限は、CDFD の項目について利用者が決めた値（担当は BA、期限は 11 月末）にそろえる

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
