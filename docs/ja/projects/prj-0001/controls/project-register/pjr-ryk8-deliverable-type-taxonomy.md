---
specdojo:
  id: prj-0001:pjr-ryk8-deliverable-type-taxonomy
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  registered_at: "2026-10-28T10:03:38Z"
  derived_from:
    - PJR-0D0T
---

# PJR-RYK8 成果物の type の値の範囲と rulebook との対応を見直す

## 1. 背景

要件・用語集に当たる type がなく、プロダクトの仕様の sample の多くが project になっている。type の値の範囲、各 rulebook が扱う成果物の type の対応、その宣言の方法を決める

- 成果物の type の値は `template`・`sample`（非推奨）・`project`・`flow`・`rule`・`data`・`ui`・`api`・`architecture`・`test`・`operations` の 11 個である（`deliverable-frontmatter.schema.yaml`）。
- Markdown の sample 約 95 件のうち約 70 件が `project` で、uis（画面仕様）・テストケース・構成図・データモデルなど、プロダクトの仕様も含む。要件（sf・nfr・bes・bac・sac）と用語集（gl）には合う値がない。
- rulebook と type の対応を宣言する場所がなく、`bdd-rulebook` は「`type: data` の成果物に適用する」と「`type` は `domain` 固定」を同時に書いている。
- type の値を読んで動きを変えるコードはない（grade も読まない）。
- PJR-0D0T（YAML の type をそろえる）の検討で分かった。

## 2. 検討した選択肢

| 選択肢 | 内容                                                                  | 利点                                        | 懸念                                                 |
| ------ | --------------------------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------- |
| 1-A    | 値の範囲はいまの 11 個のまま                                          | 変更がない                                  | `project` が受け皿のまま残る                         |
| 1-B    | `requirement` と `glossary` を足し、`project` は管理文書に限る        | 合う値がない状態を最小の追加で解消できる    | 値の名前と境界を決める必要がある                     |
| 1-C    | 種類ごとに細かく分ける                                                | 分類が細かい                                | 値が多く迷う。type を読むコードがなく得がない        |
| 2-A    | rulebook と type の対応表を standard に書く                           | 一覧で見渡せる                              | 107 件と手でそろえ続けることになり、ずれに気づけない |
| 2-B    | rulebook の frontmatter で扱う成果物の type を宣言し、lint で照合する | 正本が 1 か所になり、ずれを機械で検出できる | rulebook 107 件に宣言を足す必要がある（一度だけ）    |
| 2-C    | 成果物に type を書かせず、宣言から導く                                | 二重に持たない                              | 既存の成果物と schema の必須項目を変え、影響が大きい |

## 3. 決定内容

1-B と 2-B を採る。

- 成果物の type に `requirement`（システム機能・非機能要件・受入基準）と `glossary`（用語集）を足す。`project` はプロジェクトの管理文書（prj・pm・dct・tml など）に限る。
- rulebook の frontmatter に、扱う成果物の type を宣言させる。成果物・sample・テンプレートの type が宣言と違えば lint でエラーにする。
- 古い値や宣言と違う値は移行期間を設けずエラーにし、エラーの文面で置き換え先を示す。移行の手順は CHANGELOG に書く。
- 107 件の rulebook の割り当ては、作業の todo で案を作り、迷うものは理由と一緒に記録する。

## 4. 採択理由

- 合う値がない問題は、値を 2 つ足すだけで解ける。細かく分けても、type を読んで動くコードがないため得がない。
- type が rulebook の宣言とずれる問題は、宣言を正本にして機械で照合すれば防げる。`bdd-rulebook` の自己矛盾や `project` の受け皿化は、この検査があれば起きなかった。
- 0.x の版で、type の値で動きが変わるコードもないため、移行期間を設けずエラーにしても利用者の手間は値の書き換えに限られる。

## 5. 承認

| 項目     | 内容                                                                                                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 決定者   | indie                                                                                                                                                                           |
| 決定日   | 2026-10-28                                                                                                                                                                      |
| 承認方式 | commit                                                                                                                                                                          |
| 証跡     | 本個票の close の commit。framework schema の破壊的変更に当たるが、作成者と独立した承認者がいない期間のため、[[specdojo:git-branching-standard]] の定めにより commit で承認する |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                          |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | 成果物の frontmatter の schema、rulebook の frontmatter の schema、rulebook 107 件、sample・テンプレート・成果物の type、lint |
| 必要な対応 | 値と宣言と検査をそろえる todo を本項目から起票する。PJR-0D0T はその todo の後に行う                                           |
| 追跡先     | 本項目から `--from` でつないだ todo                                                                                           |

## 7. 関連ドキュメント

- [[specdojo:document-metadata-standard]]
- [[specdojo:rulebook-authoring-standard]]
