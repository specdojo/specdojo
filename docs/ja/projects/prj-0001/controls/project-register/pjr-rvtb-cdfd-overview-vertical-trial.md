---
specdojo:
  id: prj-0001:pjr-rvtb-cdfd-overview-vertical-trial
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
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

- [[prj-0001:cdfd-overview]] の 4 つの図が `direction: down` になっている。プロセスは上から Orchestrator・Plan・Do・Check・Action の順に並び、共通・基盤の図では Onboarding が Orchestrator の上にある。`a <- b` の書き方と、共通・基盤の図の透明度 0 の線は保つ
- 各図に、その系統を始める起点イベントが 1〜3 個、`event` class の六角形で描かれ、始まるプロセスへラベル付きの線でつながっている。イベントの文言は「プロセス領域」の表の「起点イベント」列と同じである。選んだイベントと理由を個票の対応結果に記録している
- イベントの線のほかは受け渡しを変えていない。変更前の 57 本が向き・ラベルを含めてすべて残ることを確かめ、個票の対応結果に記録している
- 「概念データフロー（概要）」の図の説明と「凡例（本プロダクト共通）」の説明が、縦向きとイベントの描き方に合っている。「プロセス領域」と「データストア」の表は変えていない
- rulebook は変えていない。rulebook とのずれ（`direction: down`、図に描いたイベントなど）を、個票の対応結果に一覧で記録している
- 4 つの図を `d2 --layout elk` で SVG に出力し、上からのプロセスの並びを図ごとに測って個票の対応結果に記録している。プロセスが同じ行に横に並ぶ場合は規則どおりと記録しない
- `npm run lint:md`・`npm run lint:d2` と親の検証が通る。文書の status を変えていない。詳細の CDFD 8 文書は変えていない
- 利用者が VS Code の Markdown プレビューで見た目を確かめている（orchestrator が close 前に確認する。executor の作業ではない）

## 4. 作業内容

| No  | 作業                                                                | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 4 つの図を `direction: down` にする                                 | BA   | open | -    |
| 2   | 系統ごとに入口の起点イベントを 1〜3 個描く                          | BA   | open | -    |
| 3   | 図と凡例の説明を直し、受け渡し・並び順・rulebook とのずれを記録する | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:cdfd-overview]]
- [[specdojo:cdfd-overview-rulebook]]
- [[specdojo:cdfd-d2-rulebook]]
