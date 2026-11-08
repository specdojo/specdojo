---
specdojo:
  id: prj-0001:pjr-mecy-bdd-kata-reference-to-implementation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T00:32:15Z"
  derived_from:
    - PJR-2GD6
  depends_on:
    - PJR-HMV6
  approach: rulebook-maintenance
  targets:
    - specdojo:bdd-rulebook
---

# PJR-MECY 業務データ辞書（bdd）の型を、実装と同じことを書かない形に手入れする

## 1. 概要

業務データ辞書の型を手入れする。schema があるエンティティは schema を正として参照し、fields には schema から読めない業務上の意味だけを書く。schema のないエンティティは今の形か TypeScript の型の参照にする

## 2. 入力

- 方針（indie が決定、2026-11-08）: schema があるエンティティは schema を正として参照し、fields には schema から読めない業務上の意味だけを書く。schema のないエンティティは今の形か TypeScript の型の参照にする。
- rulebook にあわせて bdd-sample も揃える。

## 3. 完了条件

- [[specdojo:bdd-rulebook]] に、次の規則を書いている。
  - schema があるエンティティは、schema を正として参照する（参照の書き方とキー名は executor が決める）。
  - fields には、schema から読めない業務上の意味（項目の業務的な定義、enum の値が表す業務上の状態など）だけを書く。型・必須・パターンなど schema にある制約は繰り返さない。
  - schema のないエンティティは、今の形で fields を書くか、TypeScript の型を参照する。どちらを選ぶかの基準を書く。
- `bdd-sample` を新しい規則に合わせ、schema を参照するエンティティと、schema のないエンティティの両方の例を載せている。
- 型の変更に合わせて schema（`docs/specdojo/schemas/v1/`）を変える必要があれば変えている。その場合も、今の形で書かれた既存の文書が引き続き検査を通る（後方互換）。schema を変えたかどうかと理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- 規則と sample の書き方で迷った点や、決めきれない点は `_UNDECIDED_` で残さず executor が決め、決めた内容と理由を個票の対応結果に書いている。型の確定（PJR-RZ9Q）で人が判断する材料にする。
- 成果物の文書（`docs/ja/product/` 配下）は作らず、ほかの種類の型も変えていない。ただし、この型を参照している別の型の記述（例: 関連する型の「〜との関係」の節）が食い違う場合は、その箇所だけを直している。
- CHANGELOG の未公開の版の節に型の変更を書き、公開済みの版の節を変えていない。
- `npm run lint:md`・`npm run validate:schema`・`npm run test:unit` が通っている。

## 4. 作業内容

| No  | 作業                                                                                   | 担当   | 状態 | メモ |
| --- | -------------------------------------------------------------------------------------- | ------ | ---- | ---- |
| 1   | 今の rulebook と `bdd-sample` を読み、実装・schema・リファレンスと重なる記述を洗い出す | _TODO_ | open | -    |
| 2   | rulebook に参照の規則を書き、`bdd-sample` を揃える                                     | _TODO_ | open | -    |
| 3   | 検査を流し、決めた点と理由を対応結果に書く                                             | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 対象: [[specdojo:bdd-rulebook]]
- 後続: [[prj-0001:pjr-rz9q-business-specs-reps-kata-confirm]]
