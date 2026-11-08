---
specdojo:
  id: prj-0001:pjr-m7kd-ccd-kata-reference-to-implementation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T00:33:10Z"
  derived_from:
    - PJR-2GD6
  depends_on:
    - PJR-HMV6
  approach: rulebook-maintenance
  targets:
    - specdojo:ccd-mermaid-rulebook
---

# PJR-M7KD 概念クラス図（ccd）の型を、実装と同じことを書かない形に手入れする

## 1. 概要

概念クラス図の型を手入れする。属性は主キーだけにし、そのほかの属性は bdd を参照する。図と本文は関連の意味・多重度・役割名に絞る

## 2. 入力

- 方針（indie が決定、2026-11-08）: 属性は主キーだけにし、そのほかの属性は bdd を参照する。図と本文は関連の意味・多重度・役割名に絞る。
- rulebook にあわせて ccd-sample も揃える。

## 3. 完了条件

- [[specdojo:ccd-mermaid-rulebook]] に、次の規則を書いている。
  - クラスの属性は主キーだけにし、そのほかの属性は業務データ辞書（bdd）を参照する。
  - 図と本文は、関連の意味（役割名）・多重度・関係の種類に絞る。関連ごとに、業務上なぜその多重度になるかを書く。
- `ccd-sample` を新しい規則に合わせている。
- 型の変更に合わせて schema（`docs/specdojo/schemas/v1/`）を変える必要があれば変えている。その場合も、今の形で書かれた既存の文書が引き続き検査を通る（後方互換）。schema を変えたかどうかと理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- 規則と sample の書き方で迷った点や、決めきれない点は `_UNDECIDED_` で残さず executor が決め、決めた内容と理由を個票の対応結果に書いている。型の確定（PJR-RZ9Q）で人が判断する材料にする。
- 成果物の文書（`docs/ja/product/` 配下）は作らず、ほかの種類の型も変えていない。ただし、この型を参照している別の型の記述（例: 関連する型の「〜との関係」の節）が食い違う場合は、その箇所だけを直している。
- CHANGELOG の未公開の版の節に型の変更を書き、公開済みの版の節を変えていない。
- `npm run lint:md`・`npm run validate:schema`・`npm run test:unit` が通っている。

## 4. 作業内容

| No  | 作業                                                                                   | 担当   | 状態 | メモ |
| --- | -------------------------------------------------------------------------------------- | ------ | ---- | ---- |
| 1   | 今の rulebook と `ccd-sample` を読み、実装・schema・リファレンスと重なる記述を洗い出す | _TODO_ | open | -    |
| 2   | rulebook に参照の規則を書き、`ccd-sample` を揃える                                     | _TODO_ | open | -    |
| 3   | 検査を流し、決めた点と理由を対応結果に書く                                             | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 対象: [[specdojo:ccd-mermaid-rulebook]]
- 後続: [[prj-0001:pjr-rz9q-business-specs-reps-kata-confirm]]
