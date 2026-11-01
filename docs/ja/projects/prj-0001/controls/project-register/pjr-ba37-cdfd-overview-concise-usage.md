---
specdojo:
  id: prj-0001:pjr-ba37-cdfd-overview-concise-usage
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
  registered_at: "2026-11-01T12:26:44Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-GEZN
---

# PJR-BA37 全体概要を系統の分け方にそろえ、端的に書き直す

## 1. 概要

cdfd-overview のプロセス領域の章を図と同じ系統の 6 節にして PDCA の列を足し、旧プロセスグループ別の表と未決事項を外し、共通・基盤のノードを 3 領域に分け、本文を端的にする

## 2. 入力

- 利用者は、プロセス領域の章が PDCA のプロセスグループで分かれていて、系統で描いた図の説明と合っていないと指摘した。章を図と同じ 6 つ（共通・基盤、register 系、schedule 系、routine 系、共通実行領域、Orchestrator）に分け、表に PDCA の列を足す推奨を採用した（2026-11-01）
- 利用者は、旧プロセスグループ別 CDFD の表（移行期の参照）は要らない、図の「共通・基盤」のノードが何を意味するか分からない、全体的に分かりにくいので不要な部分を削り端的に書いてほしい、と求めた（2026-11-01）
- 残っている未決事項は Action の CDFD との境界の論点で、Action の CDFD は PJR-SJQC で非推奨にすると決めている
- 文書の status は T-DATA-FLOW-USAGE-cdfd-overview-010 で draft に下がっている。status は変えない

## 3. 完了条件

- 「プロセス領域」の章が、図と同じ 6 節（共通・基盤、register 系、schedule 系、routine 系、共通実行領域、Orchestrator）に分かれている。共通・基盤は `P-01`・`P-12`・`P-13`、register 系は `P-02`、schedule 系は `P-03`・`P-04`・`P-09`・`P-10`、routine 系は `P-05`・`P-06`、共通実行領域は `P-07`・`P-08`・`P-11`、Orchestrator は `P-14` とする。各表に「PDCA」の列（Plan・Do・Check・Action のいずれか。Onboarding と Orchestrator は表にふさわしい値を executor が決め、理由を個票の対応結果に書く）がある。領域 ID と、業務目的・主な担当・起点イベントの中身は変えない
- 章の導入にある「六つのプロセスグループ」の言い方を、上の分け方に合わせている。「共通実行領域」が何かを、章の導入の 1 文で分かるようにしている
- 「共通・基盤と 3 系統」の図で、共通・基盤のノードを、Onboarding（`P-01`）・稼働構成管理（`P-12`）・非推奨化保管（`P-13`）の 3 つのノードに分けている。今の線は、意味に合う領域のノードへ割り当て直す。1 本の線に 2 つの意味が入っているもの（「配置・バージョン更新」「初期状態・承認済み構成変更」）は、領域ごとの線に分ける。線の割り当てを個票の対応結果に表で記録する
- 「詳細 CDFD 一覧」から、旧プロセスグループ別 CDFD の節と表、旧文書の移行についての説明文を外している。ユースケース別 CDFD の表は残す
- 「未決事項」の章を外している（残っていた論点は、PJR-SJQC で非推奨にすると決めた Action の CDFD との境界の話のため）
- 本文が端的になっている。各章・各節の導入は 1 文まで、図の説明は 1 文までとし、凡例と重なる注記（`->` の意味など）は図ごとに繰り返さない。表の中身は変えない
- 上の点のほかは、図の受け渡しを変えない。変えた線と理由を個票の対応結果に記録する
- 文書の status は変えない（draft のまま）。詳細の CDFD の文書は変えない
- `npm run lint:md`・`npm run lint:d2` と親の検証が通る

## 4. 作業内容

| No  | 作業                                                | 担当 | 状態 | メモ |
| --- | --------------------------------------------------- | ---- | ---- | ---- |
| 1   | プロセス領域の章を系統の 6 節にし、PDCA の列を足す  | BA   | open | -    |
| 2   | 共通・基盤のノードを 3 領域に分け、線を割り当て直す | BA   | open | -    |
| 3   | 旧表と未決事項を外し、本文を端的にする              | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:cdfd-overview]]
- [[specdojo:cdfd-overview-rulebook]]
- [[specdojo:cdfd-d2-rulebook]]
