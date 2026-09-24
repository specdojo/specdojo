---
specdojo:
  id: prj-0001:pjr-d4kg-document-owner-declaration
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: question
  item_status: open
  priority: low
  owner: ARC
  registered_at: "2026-09-24T13:42:55Z"
  due_on: "2026-11-14"
---

# PJR-D4KG 文書へ owner または RACI を宣言させるかを決める

## 1. 確認事項

schedule を持たない最小構成では review の観点セットを選ぶ根拠が無く、文書の責任者も schedule の owner_rules を辿らないと分からない。frontmatter へ owner を持たせる案と RACI を持たせる案があるが、pm-raci.yaml との二重管理をどう避けるかという論点が生じる。grade の判定軸としては不要であることが PJR-2ZVS の見直しで判明しているため、review と可読性の観点だけで判断する。

## 2. 背景

[[prj-0001:pjr-2zvs-grade-review-integration]] の決定 3.2 を見直した際、grade の判定軸として owner は不要であることが分かった。`done_criteria` の viewpoint は 75% が `human` 評価であり、owner ロールの観点も同様に `human` 偏重のため、grade が判定できない。

一方で、owner を持たないことによる不足が 2 つ残る。

| 用途                                   | 現状                                                                         |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| schedule を持たない最小構成での review | 観点セットを選ぶ根拠が無い。schedule の `owner_rules` が唯一の解決経路である |
| 文書の責任者を人が知る                 | catalog にも frontmatter にも無く、schedule を辿る必要がある                 |

catalog の `done_criteria` は `roles` を項目ごとに持つが、これは「その完了条件を確認する責任を持つロール」であり、文書全体の責任者ではない。実際に 1 つの成果物へ BA・PO・ARC・QE の 4 ロールが現れる。

### 2.1. 二重管理の論点

`pm-raci.yaml` が既に RACI を保持する。frontmatter へ owner や RACI を書くと、同じ情報が 2 箇所に存在する。どちらを正本とし、どう同期するかを決めないと乖離する。

`done_criteria` の `roles` とも重なる。3 箇所になる可能性がある。

## 3. 回答候補

| 候補 | 内容                                                     | 利点                                                 | 懸念                                                                      |
| ---- | -------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------- |
| A    | 何もしない。schedule の `owner_rules` を唯一の経路とする | 二重管理が無い                                       | schedule を持たない構成で review の観点を選べない                         |
| B    | frontmatter へ `owner`（単一ロール）を持たせる           | 文書だけで責任者が分かる。実装が小さい               | `pm-raci.yaml` と二重になる。単一ロールでは実態（4 ロール関与）を表せない |
| C    | frontmatter へ RACI を持たせる                           | 実態に近い                                           | 二重管理がより深刻。文書ごとに 4 区分を書く負担                           |
| D    | catalog の deliverable へ `owner` を追加する             | catalog が成果物の宣言の正本であり置き場所として自然 | schema 変更。既存 catalog の一括更新が要る                                |

判断の材料として、schedule を持たない最小構成で review を行う需要が実際にあるかを確認する必要がある。現状 review は schedule のフェーズとしてのみ存在し、register 経路には review が無い。需要が無ければ候補 A で足りる。

## 4. 回答・結論

_TODO_: 回答または採択した方針を記載する。未回答の場合は `-` とする。

## 5. 承認

| 項目     | 内容   |
| -------- | ------ |
| 回答者   | _TODO_ |
| 回答日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は既定で `commit`（`register close` により `decided` へ遷移）を用いる。
- 回答が不可逆・高リスク・framework schema 破壊的変更を伴う場合は `PR` 方式で承認し、証跡に PR URL と merge SHA を記載する。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
