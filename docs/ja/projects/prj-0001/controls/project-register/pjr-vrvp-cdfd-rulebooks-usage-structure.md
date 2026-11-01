---
specdojo:
  id: prj-0001:pjr-vrvp-cdfd-rulebooks-usage-structure
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
  registered_at: "2026-11-01T09:54:27Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-SJQC
---

# PJR-VRVP CDFD の rulebook を overview と系統別の詳細の体系に合わせる

## 1. 概要

PJR-SJQC の決定に合わせ、cdfd-overview-rulebook・cdfd-uc-rulebook・cdfd-d2-rulebook を、系統の関係を描く overview、プロセス領域の単位で描く系統別の詳細、縦向き、入口のイベント、配色 G に対応させる

## 2. 入力

- PJR-SJQC で、overview は共通・基盤と register・schedule・routine の関係を描き、3 系統は cdfd-uc-rulebook の形の詳細 3 文書でプロセス領域の単位で描くと決めた（2026-11-01）
- 図は凡例を含めて縦向き、系統の入口の起点イベントを描き、配色はトランザクションデータ #c8e6c9 / #2e7d32、マスタ・構成データ #e8f5e9 / #43a047、物理保管はトランザクションデータと同じとする（PJR-SJQC）
- rulebook は他のプロダクトでも使うため、今の分け方（データストアの区分とプロセスグループ別 CDFD）も選べる形を保つ

## 3. 完了条件

- [[specdojo:cdfd-overview-rulebook]] で、全体概要の構成として「系統の関係を描く」方式を選べる。この方式では、全体概要は共通・基盤と使い方の系統の関係（系統どうしをつなぐデータと仕組みを含む）を描き、各系統の流れはユースケース別 CDFD で描く。プロセス領域の表、データストアの表、凡例は全体概要に置く。今の方式（データストアの区分またはプロセスの流れで図を分け、プロセスグループ別 CDFD を置く）も選べる形を保ち、凡例で方式を宣言しない場合の既定は今の方式のままとする
- [[specdojo:cdfd-uc-rulebook]] で、系統の関係を描く方式の詳細として使う場合は、プロセスグループの代表ノードではなくプロセス領域（`P-xx`）の単位でノードを描けることと、その系統の入口の起点イベントを図に描くことを定めている。起点イベントの文言は全体概要の「プロセス領域」の表と同じにする
- [[specdojo:cdfd-overview-rulebook]] で、系統の関係を描く方式では、全体概要の図に系統の入口の起点イベントを描いてよいことを定めている
- [[specdojo:cdfd-d2-rulebook]] で、方向の基本を `direction: down` とし、プロセスは上から Orchestrator・Plan・Do・Check・Action の順（Onboarding は Orchestrator の上）に並べる。並びに逆らう戻りの矢印は `a <- b` と書き、プロセスどうしの受け渡しがない図では透明度 0 の線を使ってよい（PJR-AD33 で足した規則を「上から」に読み替える）
- [[specdojo:cdfd-d2-rulebook]] の `classes` と例の配色を、トランザクションデータ `#c8e6c9` / `#2e7d32`、マスタ・構成データ `#e8f5e9` / `#43a047`、物理保管はトランザクションデータと同じ、にそろえる。[[specdojo:cdfd-mermaid-rulebook]] の既定の凡例の色も同じ値にそろえる。方向など Mermaid 版の他の規則は変えない
- 各 rulebook の完成判定の項目を、上の変更と整合させる。status は上げない
- `cdfd-overview.md` と詳細の CDFD の文書は変えない（schedule の作業で直す）
- `npm run lint:md`・`npm run lint:d2`・`npm run lint:mermaid` と親の検証が通る。rulebook の追加・変更でレビュー観点の記録（`pm-review-viewpoints.yaml`）の更新が要る場合は、既存の rulebook と同じ扱いで足す

## 4. 作業内容

| No  | 作業                                                             | 担当 | 状態 | メモ |
| --- | ---------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | cdfd-overview-rulebook に系統の関係を描く方式を足す              | BA   | open | -    |
| 2   | cdfd-uc-rulebook にプロセス領域の単位と入口のイベントを足す      | BA   | open | -    |
| 3   | cdfd-d2-rulebook を縦向きと配色 G にし、Mermaid 版の色をそろえる | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:cdfd-overview-rulebook]]
- [[specdojo:cdfd-uc-rulebook]]
- [[specdojo:cdfd-d2-rulebook]]
- [[specdojo:cdfd-mermaid-rulebook]]
