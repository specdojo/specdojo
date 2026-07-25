---
specdojo:
  id: prj-0001:pjr-0131-concise-documentation-policy
  type: project
  status: draft
  rulebook: pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0131 簡潔な文書作成の共通原則をdocumentation policyへ追加

## 1. 概要

agent が生成する文書を、必要な論点と判断根拠を保ったまま簡潔にするため、SpecDojo の文書全体に適用する共通原則を documentation policy に追加する。文字数や行数の機械的な達成を目的にせず、一文一主張、適切な段落・箇条書きの粒度、正本への参照、重複削除を基本方針として定義する。

## 2. 完了条件

- 簡潔性を「必要な論点と判断根拠を維持し、重複と判断に不要な記述を除くこと」として定義している。
- 一文一主張、段落・箇条書きの粒度、表と本文の役割分担、正本への参照について共通原則が記載されている。
- 文・段落・箇条書きの量を示す場合は推奨目安とし、成果物種別を無視した一律の合格条件にしていない。
- 短文化によって背景、判断理由、例外、制約、`done_criteria` の充足に必要な内容を削除しないことが明記されている。
- 既存の「正本を明確にする」「重複より参照を優先する」原則との責務と記述位置が整理されている。
- 代表的な複数の文書形式で適用可能であり、Markdown lint に適合している。

## 3. 作業内容

<!-- prettier-ignore -->
| No | 作業 | 担当 | 状態 | メモ |
| --- | --- | --- | --- | --- |
| 1 | 現行 policy の正本・参照・読みやすさに関する原則を棚卸しする | ARC | open | 重複する規定を増やさない |
| 2 | 簡潔性の目的、共通原則、推奨目安、禁止すべき機械的運用を定義する | ARC | open | 数値は原則として警告値・目安 |
| 3 | 根拠・例外・制約・done_criteria を保持する安全条件を明記する | ARC | open | 短さ自体を目的化しない |
| 4 | Markdown・表中心・YAML中心の代表文書へ適用できるか確認する | ARC | open | 形式差を考慮 |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-0122|launch trackの振り返り]] — 起票元
- [[specdojo-documentation-policy-guide]] — 変更対象
- [[prj-0001:pjr-0129-why-what-how-recipes|Why-What-How作成原則をrecipeへ反映]] — recipe 側の関連対応
- [[prj-0001:pjr-0132-detect-document-redundancy|既存review viewpointで文書の冗長性を検出]] — レビュー側の関連対応
