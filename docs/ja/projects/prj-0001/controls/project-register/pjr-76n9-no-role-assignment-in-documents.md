---
specdojo:
  id: prj-0001:pjr-76n9-no-role-assignment-in-documents
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: high
  owner: PO
  registered_at: "2026-11-21T08:19:42Z"
---

# PJR-76N9 成果物と sample の本文に、文書の役割の割り当てと承認の進み具合を書かない

## 1. 背景

成果物と sample の本文には、文書を作る・確かめる・承認する役割の割り当てや承認の進み具合を書かず、承認と留保は登録簿で追う。rulebook の「誰が判断するか」は「どの利用場面で何を判断するための文書か」に直す

## 2. 入力

- 利用者の指摘（2026-11-21、cnd-specdojo の確定の前）: 概要に PO・ARC・BA・DEV などの役割を書く必要があるか。3 章・4 章が長い
- orchestrator の調べ（2026-11-21）: 役割の割り当ての文は製品の成果物と sample に約 28 件（cnd-specdojo・cpd-specdojo-cli・bes-index・cdsd-execution・`sysd-*`・cnd-sample など）、「誰が……判断するか」と書く rulebook は 19 件（cnd・cxd・atc・pjr など）。cnd-rulebook の 6.1 は「誰がどの利用場面で配置・結合の何を判断するかを示します」としつつ、1 章では役割の割り当てをメンバー定義に委ね、Person を確認者一覧と区別している
- cnd-specdojo の 4.2 の後半は承認の範囲・留保・差し戻しの記録で、設計の中身ではない。品質管理計画（pm-quality-management-plan）の本文も多くが役割の手順で、CLI・runner・hook は読んでおらず、ゲートの判定の記録も無い
- 利用者の承認（2026-11-21）: decision を起票して決まりを決め、流している波の strategy に伝え、cnd-specdojo は手直しの todo（Q9DF）を開き直し、ほかの成果物はまとめて直す todo、rulebook は第 3〜6 波と kata-slim-3 で直す

## 3. 検討した選択肢

| 選択肢 | 内容   | 利点   | 懸念   |
| ------ | ------ | ------ | ------ |
| A      | _TODO_ | _TODO_ | _TODO_ |

## 4. 決定内容

_TODO_: 採択した内容を明確に記載する。

## 5. 採択理由

- _TODO_: 判断根拠を記載する。

## 6. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | _TODO_ |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容   |
| ---------- | ------ |
| 影響範囲   | _TODO_ |
| 必要な対応 | _TODO_ |
| 追跡先     | _TODO_ |

## 8. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
