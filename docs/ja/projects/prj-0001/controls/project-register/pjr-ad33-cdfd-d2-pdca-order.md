---
specdojo:
  id: prj-0001:pjr-ad33-cdfd-d2-pdca-order
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
  registered_at: "2026-11-01T06:50:27Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-RXVC
---

# PJR-AD33 CDFD の D2 図で P・D・C・A を左から順に並べる

## 1. 概要

D2 の CDFD 図でプロセスが Orchestrator・Plan・Do・Check・Action の順に左から並ぶよう、戻りの矢印を a <- b で書く規則を cdfd-d2-rulebook に足し、全体概要の 4 つの図を直す

## 2. 入力

- 利用者は、全体概要の図のプロセスがどの図でも P・D・C・A の順に左から右へ並んでいる方が分かりやすいと考えている（2026-11-01）
- 2026-11-01 時点の ELK の配置では、register 系は Action・Plan・Do・Orchestrator・Check、routine 系は Plan・Do・Orchestrator・Check・Action の順で、図ごとに並びが違う
- 原因は Orchestrator との往復や Action から Plan への再計画要求など、ループを作る戻りの矢印で、ELK がどの矢印を逆向きとみなすかを選べない
- 戻りの矢印を a <- b と書くと、矢印の向きは同じまま、配置では a が左に来る。register 系の図で試し、Orchestrator・Plan・Do・Check・Action の順に並ぶことを確かめた
- 共通・基盤の図は Onboarding・Plan・Do・Check・Action の順にする（2026-11-01 の対話で推奨を採用）
- 利用者が VS Code の Markdown プレビューで見た目を確かめてから close する。T1D1 はこの項目の後に行う

## 3. 完了条件

- [[specdojo:cdfd-d2-rulebook]] に並び順の規則がある。プロセスは Orchestrator・Plan・Do・Check・Action の順に左から並べ、Onboarding がある図では Onboarding を Plan の左に置く。並び順に逆らう戻りの矢印は `b -> a` ではなく `a <- b` と書き、ELK に並びを決めさせない
- [[prj-0001:cdfd-overview]] の 4 つの図が、この規則に沿って書き直されている
- 4 つの図を `d2 --layout elk` で SVG に出力し、プロセスの左からの並びが規則どおりであることを確かめ、図ごとの並びを個票の対応結果に記録している
- 受け渡しの数・向き・ラベルは変えていない。変更前の図の受け渡しと一対一に対応することを個票の対応結果に記録している
- ノードの ID・名前・色の付け方と、図以外の本文は変えていない
- `npm run lint:md`・`npm run lint:d2` と親の検証が通る。文書と rulebook の status を上げていない。詳細の CDFD 8 文書（PJR-T1D1 の対象）は変えていない
- 利用者が VS Code の Markdown プレビューで見た目を確かめている（orchestrator が close 前に確認する。executor の作業ではない）

## 4. 作業内容

| No  | 作業                                                             | 担当 | 状態 | メモ |
| --- | ---------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | cdfd-d2-rulebook に並び順の規則を足す                            | BA   | open | -    |
| 2   | cdfd-overview の 4 つの図の戻りの矢印を `a <- b` で書き直す      | BA   | open | -    |
| 3   | SVG で並び順を確かめ、受け渡しの対応とあわせて対応結果に記録する | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:cdfd-d2-rulebook]]
- [[prj-0001:cdfd-overview]]
