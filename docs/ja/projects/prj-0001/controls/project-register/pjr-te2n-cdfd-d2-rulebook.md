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

1. `docs/ja/specdojo/rulebooks/cdfd-d2-rulebook.md` を作る。
   - `specdojo:cdfd-mermaid-rulebook` と同じ概念（プロセス・プロセスグループ・サブグラフ・データストア・物理保管・外部主体・イベント・情報の流れ・物の流れ）を、D2 の記法で一対一に表す対応表を持つ。記号の対応は個票の入力の案を基本とし、変える場合は理由を個票の対応結果に書く。
   - 色は `classes` で概念の大分類ごとに定義して `class` で当て、ノード単位の `style` の個別指定は禁止する。Mermaid 版の色・絵文字の方針と揃える。
   - 方向は `direction: right` を基本とする。配置のエンジンは文書のサイトと同じ ELK を前提とする。
   - PJR-8TQJ で要点に絞った CDFD の rulebook と同じ密度で書く。
   - Frontmatter は [[specdojo:rulebook-authoring-standard]] に従い、`status: draft` とする。
2. rulebook の中の D2 の例は ` ```d2 ` のコードブロックで書き、`npm run lint:d2` を通す。
3. `cdfd-overview`・`cdfd`・`cdfd-uc` の 3 つの rulebook が、CDFD の記法を Mermaid と D2 から選べるようにする。
   - どこで選ぶか（例: プロダクトの `cdfd-overview` の凡例で宣言する）は executor が決め、理由を個票の対応結果に書く。
   - 記法を宣言しない既存のプロダクトは、今までどおり Mermaid として扱われる。
4. プロダクトの CDFD の文書（`docs/ja/product/010-business-specs/010-data-flow/`）は変えない。書き直しは PJR-RXVC と PJR-T1D1 で行う。
5. どの rulebook の `status` も上げない（ready への格上げは人が行う）。
6. 終える前に `npm run lint:md`・`npm run lint:fm`・`npm run lint:mermaid`・`npm run lint:d2`・`npm run validate:schema` を通す。あわせて親の検証も通す。
7. 未決の点は executor が決め、理由を個票の対応結果に書く。

## 4. 作業内容

| No  | 作業                                                       | 担当 | 状態 | メモ |
| --- | ---------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 完了条件に沿って D2 版の rulebook と記法の選び方を用意する | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:cdfd-mermaid-rulebook]]
- [[specdojo:cdfd-overview-rulebook]]
- [[specdojo:cdfd-rulebook]]
- [[specdojo:cdfd-uc-rulebook]]
- [[prj-0001:pjr-2zmy-document-editing-toolset]]
- [[prj-0001:pjr-6nem-d2-rendering-foundation]]
- [[prj-0001:pjr-8tqj-cdfd-concise-rulebooks]]
