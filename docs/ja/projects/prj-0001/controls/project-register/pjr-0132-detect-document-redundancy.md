---
specdojo:
  id: prj-0001:pjr-0132-detect-document-redundancy
  type: project
  status: draft
  rulebook: pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0132 既存review viewpointで文書の冗長性を検出

## 1. 概要

文書の主要な目的や判断点を短時間で把握できるかという観点から、冗長性を review で検出できるようにする。類似 viewpoint を新設せず、既存の `vp-ux-readability` に、同じ主張の反復、判断に不要な一般論、表と本文の重複、正本からの過剰な再掲を確認する具体的な check / evidence を反映する。

## 2. 完了条件

- `vp-ux-readability` の責務に簡潔性を含める理由が整理され、重複する viewpoint を追加していない。
- 同じ主張の反復、判断に不要な一般論、表と本文の重複、正本からの過剰な再掲を検出できる `check` が定義されている。
- 段落・箇条書きの長さ、重複箇所、正本への参照、削除候補など、レビュー根拠となる `evidence` が具体化されている。
- 長さだけで fail とせず、必要な背景、判断理由、例外、制約、`done_criteria` を保持して判定する基準になっている。
- 通常は `minor`、冗長さによって主旨・判断点が読み取れない場合は `major` とする severity の扱いが明確である。
- project の実値と新規 project 用 template が同期し、生成ページを再生成できる。
- 代表的な文章中心の成果物に適用した review plan / result で、具体的な指摘を記録できることを確認している。

## 3. 作業内容

<!-- prettier-ignore -->
| No | 作業 | 担当 | 状態 | メモ |
| --- | --- | --- | --- | --- |
| 1 | `vp-ux-readability` と他 viewpoint の責務・重複を整理する | UX | open | 新設の必要性も再確認 |
| 2 | 冗長性を検出する check / evidence と severity の扱いを定義する | UX | open | 文字数のみで判定しない |
| 3 | project の review viewpoints と template へ同じ内容を反映する | UX | open | scaffold 後の差異を防ぐ |
| 4 | 代表成果物の review plan / result で検出可能性と過剰指摘を確認する | QE | open | 必要情報の削除を促さない |
| 5 | YAML 由来の表示ページを再生成し、schema・lint を検証する | QE | open | 正本は YAML |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-0122|launch trackの振り返り]] — 起票元
- [[prj-0001:pjr-0131-concise-documentation-policy|簡潔な文書作成の共通原則をdocumentation policyへ追加]] — 作成側の共通原則
- [[prj-0001:pm-review-viewpoints|レビュー観点一覧]] — project 実値の変更対象
- [[pm-review-viewpoints-template]] — 新規 project 用 template の変更対象
- [[specdojo-review-guide]] — review viewpoint の運用基準
