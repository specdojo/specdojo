---
specdojo:
  id: prj-0001:pjr-0130-clarify-why-review-viewpoints
  type: project
  status: draft
  rulebook: pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0130 Whyの明確性を既存review viewpointsへ反映

## 1. 概要

成果物の主要な定義・判断が、どの対象者のどの課題・期待価値に応えるかをレビューで判定できるようにする。類似する viewpoint を新設してレビューを細分化するのではなく、既存の目的整合、業務価値、可読性の観点へ、Why の明確性と手段の目的化を検出する具体的な check / evidence を反映する。

## 2. 完了条件

- Why を判定する既存 viewpoint の責務と重複範囲が整理され、必要以上に新しい viewpoint を増やしていない。
- project-level Why との整合、成果物固有の目的、主要な What / How との対応を確認できる check が定義されている。
- 対象者、課題、期待価値、判断理由、上位文書への参照など、判定に使える evidence が具体化されている。
- 構造・設定中心の成果物へ業務上の Why の詳細記述を一律要求しない適用条件になっている。
- 「Why が明確」という抽象的な合否ではなく、不足・矛盾・手段の目的化を finding として説明できる。
- review plan / result の代表例で、既存 coverage と矛盾せず判定できることを確認している。

## 3. 作業内容

<!-- prettier-ignore -->
| No | 作業 | 担当 | 状態 | メモ |
| --- | --- | --- | --- | --- |
| 1 | 既存の目的整合・業務価値・可読性 viewpoint の責務と重複を整理する | QE | open | PO / BA / UX 観点 |
| 2 | Why の明確性と手段の目的化を判定する check / evidence を具体化する | QE | open | 抽象的なチェックにしない |
| 3 | 成果物種別ごとの適用範囲と、責務外詳細を要求しない条件を定義する | BA | open | 構造・設定成果物を考慮 |
| 4 | review plan / result の代表例で過剰指摘や観点漏れがないか確認する | QE | open | coverage との整合も確認 |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-0122|launch trackの振り返り]] — 起票元
- [[prj-0001:pjr-0127-clarify-project-why|prj-overviewのプロジェクトWhyを明確化]] — 判定対象となる project-level Why
- [[prj-0001:pjr-0129-why-what-how-recipes|Why-What-How作成原則をrecipeへ反映]] — 作成側の対策
- [[prj-0001:pm-review-viewpoints|レビュー観点一覧]] — 変更対象
- [[specdojo-review-guide]] — review viewpoint の運用基準
