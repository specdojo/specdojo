---
specdojo:
  id: prj-0001:pjr-h220-viewpoint-document-kinds-maintenance
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: medium
  owner: DEV
  registered_at: "2026-09-26T23:23:16Z"
  completed_at: "2026-09-27T11:30:58Z"
  conclusion: 選択肢 B を採択。document_kinds は rulebook ID の列挙を維持し、観点ごとに判断漏れの rulebook を一覧化する検証を追加する。実装は PJR-VJP8
---

# PJR-H220 観点の document_kinds を rulebook ID 列挙で保守し続けるか決める

## 1. 背景

PJR-AG7B では、観点がどの種類の文書に当てはまるかを `document_kinds` の include / exclude で宣言する仕組みを入れた。対象は rulebook ID で列挙する。

`docs/ja/specdojo/defaults/pm-review-viewpoints.yaml` の現状は次のとおりである。

- `vp-arc-single-responsibility`: index 系の rulebook 21 件を exclude に列挙している。
- `vp-ba-business-value`: 12 件を exclude に列挙している。

この方式では、index 系などの rulebook を追加するたびに、関係する観点の列挙も更新する必要がある。更新を忘れると、新しい種類の文書に当てはまらない観点が適用され、review / grade で的外れな指摘が出る。更新漏れを検知する仕組みもない。

## 2. 検討した選択肢

| 選択肢 | 内容                                                                                            | 利点                                           | 懸念                                                                 |
| ------ | ----------------------------------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------- |
| A      | rulebook ID の列挙を維持し、rulebook 追加時の更新を作成手順（standard / recipe）へ明記する      | 仕組みの変更がない                             | 手順頼みで漏れを検知できない                                         |
| B      | 列挙を維持し、全 rulebook が各観点で include / exclude / 既定のどれに当たるかを検証で一覧化する | 追加時の判断漏れを検知できる                   | 検証の追加が要る。判断そのものは人が行う                             |
| C      | rulebook の frontmatter に分類（例: index 系）を持たせ、観点は分類で include / exclude する     | 追加時に分類を付ければ観点側の更新が不要になる | frontmatter スキーマと AG7B の解決処理の変更が要る。分類の定義が要る |

## 3. 決定内容

選択肢 B を採択する。観点の適用範囲は、これまでどおり `document_kinds` の rulebook ID の列挙で宣言する。そのうえで、`document_kinds` を宣言した観点ごとに、include / exclude / 既定（適用する）のどれとも判断されていない rulebook を一覧にする検証を追加する。rulebook を追加したときの判断漏れを、手順ではなく検証で検知する。

判断済みであることの記録方法（明示の include への列挙、判断済み一覧など）と、検証を error にするか warning にするかは、実装の todo である PJR-VJP8 で決める。rulebook に分類を持たせる選択肢 C は、分類の種類が固まった時点で、index 系から段階的に移す余地を残す。

## 4. 採択理由

- 除外リストの中身を確認した（2026-09-27）。`vp-arc-single-responsibility` の 21 件は index 系の rulebook 19 件（index 系の全件）と overview 系 2 件で、分類 1 つでほぼ表せる。一方、`vp-ba-business-value` の 12 件は index 系 2 件と、種類の異なる 10 件（`bdd`・`dct`・`gl`・`ifx-*`・`pm-members`・`pm-roles`・`sch`・`tml`）で、1 つの分類では表せない。
- 選択肢 C は、単一責務の観点にしか効かない。frontmatter のスキーマ変更と 107 件の rulebook への分類の付与が必要で、分類の定義そのものが別の設計判断になる。
- 選択肢 B は、両方の観点に同じ仕組みで効く。今の宣言の形のまま、スキーマの変更も既存 rulebook の手直しもなく導入できる。判断は人が行うが、判断の漏れはなくなる。
- 選択肢 A は、漏れを検知できないため、現状の問題が残る。
- B の検証は、将来 C へ移った後も、分類の付与漏れの検知に引き続き使える。

## 5. 承認

| 項目     | 内容                                                           |
| -------- | -------------------------------------------------------------- |
| 決定者   | PO                                                             |
| 決定日   | 2026-09-27                                                     |
| 承認方式 | commit                                                         |
| 証跡     | 本個票の決定内容を記録した commit（`docs(register PJR-H220)`） |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                             |
| ---------- | ---------------------------------------------------------------- |
| 影響範囲   | `pm-review-viewpoints.yaml`、観点の解決処理、rulebook の作成手順 |
| 必要な対応 | 決定後に実装・手順更新の todo を起票する                         |
| 追跡先     | PJR-VJP8（検証の実装）                                           |

## 7. 関連ドキュメント

- [[specdojo:review-guide]]
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
