---
specdojo:
  id: prj-0001:pjr-484b-deliverable-type-declaration
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: hard
  registered_at: "2026-10-28T10:07:40Z"
  block_reason: "parent validation failed: test-unit"
  derived_from:
    - PJR-RYK8
---

# PJR-484B 成果物の type に requirement と glossary を足し、rulebook の宣言と lint で照合する

## 1. 概要

schema に requirement と glossary を足し、rulebook 107 件の frontmatter に扱う成果物の type を宣言させる。Markdown の成果物・sample・テンプレートの type を宣言にそろえ、違えば lint でエラーにする

- PJR-RYK8 の決定（1-B・2-B）に従い、type の値を足し、rulebook の宣言を正本として成果物の type を照合する。

## 2. 完了条件

- 成果物の frontmatter の schema の type に `requirement`（システム機能・非機能要件・受入基準）と `glossary`（用語集）がある。
- rulebook の frontmatter の schema に、扱う成果物の type を宣言する必須のフィールドがある（名前の案は `deliverable_type`。変える場合は理由を記録する）。
- rulebook 107 件すべてに宣言がある。`project` はプロジェクトの管理文書（prj・pm・dct・tml など）に限る。割り当ての一覧（rulebook・type・理由）を本個票の対応結果に書き、index の rulebook など迷ったものは理由と一緒に書く。
- Markdown の成果物・sample・テンプレート（`frontmatter_template`）の type が宣言と一致している。
- `lint:fm` など既存の検査で、Markdown の成果物・sample・テンプレートの type が rulebook の宣言と違えばエラーにし、文面に宣言された type を示す。
- `document-metadata-standard` と `rulebook-authoring-standard` に、値の意味・宣言の書き方・検査を書く。
- CHANGELOG の `## [Unreleased]` に、移行の手順（rulebook への宣言の追加と type の書き換え）を書く。公開済みの版の節は変えない。
- YAML の type と YAML の表示用ページは PJR-0D0T で扱うため、本項目では変えない。
- 単体テストで、宣言の必須・type のずれのエラー・新しい値を確かめる。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run lint:fm`・`npm run test:unit` が通り、親の検証 7 件が通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。

## 3. 作業内容

| No  | 作業                                                | 担当     | 状態 | メモ |
| --- | --------------------------------------------------- | -------- | ---- | ---- |
| 1   | schema に値と rulebook の宣言のフィールドを追加する | executor | open | -    |
| 2   | rulebook 107 件に宣言を足し、割り当てを記録する     | executor | open | -    |
| 3   | Markdown の成果物・sample・テンプレートをそろえる   | executor | open | -    |
| 4   | lint の照合を実装する                               | executor | open | -    |
| 5   | standard・CHANGELOG を更新し、テストを足す          | executor | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:document-metadata-standard]]
- [[specdojo:rulebook-authoring-standard]]
