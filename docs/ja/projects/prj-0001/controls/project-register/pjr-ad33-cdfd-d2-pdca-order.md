---
specdojo:
  id: prj-0001:pjr-ad33-cdfd-d2-pdca-order
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

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
