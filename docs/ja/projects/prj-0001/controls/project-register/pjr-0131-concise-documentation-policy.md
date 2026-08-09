---
specdojo:
  id: prj-0001:pjr-0131-concise-documentation-policy
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  due_on: "2026-07-31"
  completed_on: "2026-07-26"
  conclusion: 簡潔な文書作成の共通原則を追加
---

# PJR-0131 簡潔な文書作成の共通原則をdocumentation policyへ追加

## 1. 概要

文書全体に適用する簡潔性・重複回避・正本参照・文章量の目安をdocumentation policyの共通原則として定義する

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
| 1 | 現行 policy の正本・参照・読みやすさに関する原則を棚卸しする | ARC | done | 2.2、3.3、3.4 の責務を確認 |
| 2 | 簡潔性の目的、共通原則、推奨目安、禁止すべき機械的運用を定義する | ARC | done | 数値は見直しを始める推奨目安として定義 |
| 3 | 根拠・例外・制約・done_criteria を保持する安全条件を明記する | ARC | done | 短さ自体を目的にしない条件を基本方針と判断基準へ反映 |
| 4 | Markdown・表中心・YAML中心の代表文書へ適用できるか確認する | ARC | done | 3形式の適用方法と保持する内容を整理 |

## 4. 対応結果

- [[specdojo:specdojo-philosophy]]の基本方針に「Concise but Complete」を追加し、簡潔性を、必要な論点と判断根拠を維持しながら重複と判断に不要な記述を除くことと定義した。
- 一文一主張、一段落一論点、一項目一論点、表と本文の役割分担を共通原則として整理した。短文化で背景、判断理由、例外、制約、トレーサビリティ、`done_criteria` の充足に必要な内容を削除しない条件も明記した。
- 文、段落、箇条書き、表の量は見直しを始める推奨目安とし、文字数や行数などの数値だけで合否を判定しない方針を示した。
- 文章中心の Markdown、表中心の Markdown、YAML / JSON について、簡潔にする方法と保持する内容を整理した。
- 正本と派生物の分離は既存の「正本と派生物を分離する」、参照への置換は「重複よりも参照を優先する」、文書内の必要十分な表現は今回追加した「簡潔さと必要情報を両立する」で扱う責務分担とした。

## 5. 関連ドキュメント

- [[prj-0001:pjr-0122|launch trackの振り返り]] — 起票元
- [[specdojo:specdojo-philosophy]] — 変更対象
- [[prj-0001:pjr-0129-why-what-how-recipes|Why-What-How作成原則をrecipeへ反映]] — recipe 側の関連対応
- [[prj-0001:pjr-0132-detect-document-redundancy|既存review viewpointで文書の冗長性を検出]] — レビュー側の関連対応
