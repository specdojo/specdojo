---
specdojo:
  id: prj-0001:pjr-te2n-cdfd-d2-rulebook
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-10-31T14:16:02Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-2ZMY
  depends_on:
    - PJR-6NEM
    - PJR-8TQJ
---

# PJR-TE2N CDFD の D2 版の rulebook と記法の選び方を用意する

## 1. 概要

cdfd-mermaid-rulebook に対応する cdfd-d2-rulebook を作り、CDFD の記法を Mermaid と D2 から選べるようにする。今は cdfd-overview・cdfd・cdfd-uc の rulebook が includes で cdfd-mermaid-rulebook を固定している

## 2. 入力

- 利用者は cdfd-mermaid-rulebook の D2 版を求めた（2026-10-31）
- 記号の対応の案: プロセスは border-radius 付きの rectangle、データストアは cylinder、物理保管は border-radius を大きくした rectangle、外部主体は rectangle、イベントは hexagon、サブグラフはコンテナ、情報の流れは ->、物の流れは太線の class、色は classes で定義し class で当てる、方向は direction: right
- 記法をどこで選ぶか（例: プロダクトの cdfd-overview の凡例で宣言する）は executor が決め、理由を個票の対応結果に記録してよい
- D2 の描画の基盤（PJR-6NEM）と、要点に絞った CDFD の rulebook（PJR-8TQJ）の後に行う

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
