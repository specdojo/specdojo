---
specdojo:
  id: prj-0001:pjr-0130-clarify-why-review-viewpoints
  type: project
  status: ready
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
| 1 | 既存の目的整合・業務価値・可読性 viewpoint の責務と重複を整理する | QE | done | PO は上位目的との整合、BA は業務上の Why と What / How の対応、UX は読み手への伝わり方を担当 |
| 2 | Why の明確性と手段の目的化を判定する check / evidence を具体化する | QE | done | 不足・矛盾・対応先のない手段を根拠とともに指摘できる表現へ更新 |
| 3 | 成果物種別ごとの適用範囲と、責務外詳細を要求しない条件を定義する | BA | done | 構造・設定中心の成果物は参照・命名・下流利用の整合で判定 |
| 4 | review plan / result の代表例で過剰指摘や観点漏れがないか確認する | QE | done | charter の BA 観点と scope の PO 観点で既存 coverage と両立することを確認 |

## 4. 対応結果

- [[prj-0001:pm-review-viewpoints|レビュー観点一覧]]の既存 3 観点を更新し、新しい viewpoint は追加しなかった。
- `vp-po-purpose-alignment` は、project-level Why と主要な定義・判断の整合、成果物固有の目的または上位参照、対応する目的・成果のない手段を確認する責務とした。
- `vp-ba-business-value` は、対象者、業務課題、放置時の影響、期待価値・効果を根拠に、主要な成果・方針が Why に応えるかを確認する責務とした。
- `vp-ux-readability` は、Why の内容自体を再判定せず、初見の読者が必要性と主要な判断の関係、目的と手段の区別を理解できるかを確認する責務とした。
- 構造・設定中心の成果物では業務上の Why の詳細な再掲を要求せず、上位参照、名称、メタデータ、下流利用との整合で判定する適用条件を各観点へ反映した。
- [[prj-0001:xrp-t-launch-prj-charter-090|プロジェクト憲章の review plan]] / [[prj-0001:xrr-t-launch-prj-charter-090|review result]] の BA 観点と、[[prj-0001:xrp-t-launch-prj-scope-090|プロジェクトスコープの review plan]] / [[prj-0001:xrr-t-launch-prj-scope-090|review result]] の PO 観点を代表例として確認した。前者は対象者・期待効果・上位目的との対応、後者は対象範囲・対象外・上位目的との対応を証拠に判定できており、既存の `business_goal` / `scope_boundary` / `traceability` coverage と矛盾せず、後続文書へ委譲した詳細を過剰に要求しない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-0122|launch trackの振り返り]] — 起票元
- [[prj-0001:pjr-0127-clarify-project-why|prj-overviewのプロジェクトWhyを明確化]] — 判定対象となる project-level Why
- [[prj-0001:pjr-0129-why-what-how-recipes|Why-What-How作成原則をrecipeへ反映]] — 作成側の対策
- [[prj-0001:pm-review-viewpoints|レビュー観点一覧]] — 変更対象
- [[specdojo-review-guide]] — review viewpoint の運用基準
- [[recipe-authoring-standard|Recipe 記述標準]] — Why / What / How / Trace と成果物形式別の適用基準
