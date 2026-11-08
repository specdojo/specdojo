---
specdojo:
  id: prj-0001:pjr-c1rg-sf-kata-reference-to-implementation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T00:34:51Z"
  derived_from:
    - PJR-2GD6
  depends_on:
    - PJR-HMV6
  approach: rulebook-maintenance
  targets:
    - specdojo:sf-rulebook
---

# PJR-C1RG システム化機能（sf）の型を、実装と同じことを書かない形に手入れする

## 1. 概要

システム化機能の型を手入れする。機能の目的と業務プロセスとの対応に絞り、操作の説明はコマンドリファレンスと各ガイドを参照する

## 2. 入力

- 方針（indie が決定、2026-11-08）: 機能の目的と業務プロセスとの対応に絞り、操作の説明はコマンドリファレンスと各ガイドを参照する。
- rulebook にあわせて sf-sample も揃える。

## 3. 完了条件

- [[specdojo:sf-rulebook]] に、次の規則を書いている。
  - 機能の目的と、業務プロセス仕様（bps）・画面仕様（uis）との対応に絞る。
  - コマンドの使い方・オプション・手順は書かず、コマンドリファレンスと各ガイドを参照する。
- `sf-sample` を新しい規則に合わせている。`sf-index` の型は変えていない。
- 型の変更に合わせて schema（`docs/specdojo/schemas/v1/`）を変える必要があれば変えている。その場合も、今の形で書かれた既存の文書が引き続き検査を通る（後方互換）。schema を変えたかどうかと理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- 規則と sample の書き方で迷った点や、決めきれない点は `_UNDECIDED_` で残さず executor が決め、決めた内容と理由を個票の対応結果に書いている。型の確定（PJR-RZ9Q）で人が判断する材料にする。
- 成果物の文書（`docs/ja/product/` 配下）は作らず、ほかの種類の型も変えていない。ただし、この型を参照している別の型の記述（例: 関連する型の「〜との関係」の節）が食い違う場合は、その箇所だけを直している。
- CHANGELOG の未公開の版の節に型の変更を書き、公開済みの版の節を変えていない。
- `npm run lint:md`・`npm run validate:schema`・`npm run test:unit` が通っている。

## 4. 作業内容

| No  | 作業                                                                                  | 担当   | 状態 | メモ |
| --- | ------------------------------------------------------------------------------------- | ------ | ---- | ---- |
| 1   | 今の rulebook と `sf-sample` を読み、実装・schema・リファレンスと重なる記述を洗い出す | _TODO_ | open | -    |
| 2   | rulebook に参照の規則を書き、`sf-sample` を揃える                                     | _TODO_ | open | -    |
| 3   | 検査を流し、決めた点と理由を対応結果に書く                                            | _TODO_ | open | -    |

## 5. 対応結果

executor は個票の対応結果を書かず、result にだけ記録したため、orchestrator が result（`execution/runs/register/PJR-C1RG/pjr-c1rg-20261108T024416Z-e7b31ded/result.md`）から書き写した（2026-11-08）。

### 実施内容

- [[specdojo:sf-rulebook]] を、機能の目的と業務プロセス仕様（bps）・画面仕様（uis）との対応に絞る形に改訂した。操作手順はコマンドリファレンスと各ガイドへの参照に留める。
- 個別機能（`sf-<term>`）の章構成を「目的と概要」「業務プロセス・画面との対応」「入出力と前提条件」「処理要件・機能振る舞い」「非機能・技術制約」「操作手順・コマンド参照」「検証・受入観点」とした。
- [[specdojo:sf-sample]] を、駄菓子屋の販売管理システムの「商品販売機能（`sf-product-sales`）」を題材に、bps・uis・br・bdd・bes・opr との対応を示す完成例に書き直した。`sf-index` の型は変えていない。
- `deliverables-reference.md` の sf の説明を 2 行直し、CHANGELOG の未公開の版の節に追記した。

### schema の変更

変更なし。sf は Markdown の成果物で、既存の `deliverable-frontmatter.schema.yaml` の範囲で検査できるため。

### 決めた点（PJR-RZ9Q への材料）

- 上の章構成。
- 操作手順の章は残し、中身はコマンドリファレンスと各ガイドへの参照だけにする。

### 検証

親の検証（型検査・lint・単体テスト・統合テスト・schema）がすべて通った。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 対象: [[specdojo:sf-rulebook]]
- 後続: [[prj-0001:pjr-rz9q-business-specs-reps-kata-confirm]]
