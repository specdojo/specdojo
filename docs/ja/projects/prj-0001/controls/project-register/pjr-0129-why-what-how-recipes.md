---
specdojo:
  id: prj-0001:pjr-0129-why-what-how-recipes
  type: project
  status: draft
  rulebook: pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0129 Why-What-How作成原則をrecipeへ反映

## 1. 概要

agent が手段や網羅的な説明へ引っ張られず、主要な論点を保って成果物を作成できるよう、Why・What・How・Trace を共通の論理構造として定義する。全成果物へ同じ章順を強制せず、共通原則は一か所に置き、各 recipe には成果物の責務に応じた問いと適用方法だけを反映する。

## 2. 完了条件

- Why・What・How・Trace の意味、相互関係、記述時の判定基準が共通原則として定義されている。
- 共通原則が「章の固定順」ではなく「主要な主張・判断の論理の骨格」であることが明記されている。
- Markdown、表形式の登録簿、YAML など、成果物形式に応じた適用方法または非適用条件が定義されている。
- 対象 recipe には共通説明を複製せず、その成果物で答えるべき固有の問いと委譲境界が記載されている。
- sample または代表成果物を用いて、Why から What / How への対応を追えることが確認されている。
- recipe の指示によって成果物の責務外の詳細や重複記述を要求しない。

## 3. 作業内容

<!-- prettier-ignore -->
| No | 作業 | 担当 | 状態 | メモ |
| --- | --- | --- | --- | --- |
| 1 | Why・What・How・Trace の共通原則とアンチパターンを定義する | ARC | open | 固定章構成にはしない |
| 2 | recipe を成果物種別ごとに棚卸しし、適用対象と適用方法を決める | ARC | open | YAML・登録簿等も考慮 |
| 3 | 対象 recipe の問い・深掘り手順・仕上げ確認へ固有部分を反映する | ARC | open | 共通説明は参照する |
| 4 | 代表 sample / 成果物で論点、簡潔性、委譲境界への効果を確認する | BA | open | 手段の目的化と重複を確認 |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-0122|launch trackの振り返り]] — 起票元
- [[prj-0001:pjr-0127-clarify-project-why|prj-overviewのプロジェクトWhyを明確化]] — project-level Why の整備
- [[docs-phases-overview]] — Why / What / How の既存概念
- [[specdojo-reference-materials-guide]] — recipe の役割と参照方針
