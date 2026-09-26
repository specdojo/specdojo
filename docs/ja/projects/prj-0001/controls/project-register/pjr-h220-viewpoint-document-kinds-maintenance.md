---
specdojo:
  id: prj-0001:pjr-h220-viewpoint-document-kinds-maintenance
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-09-26T23:23:16Z"
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

_TODO_: 採択した内容を明確に記載する。

## 4. 採択理由

- _TODO_: 判断根拠を記載する。

## 5. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | _TODO_ |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                             |
| ---------- | ---------------------------------------------------------------- |
| 影響範囲   | `pm-review-viewpoints.yaml`、観点の解決処理、rulebook の作成手順 |
| 必要な対応 | 決定後に実装・手順更新の todo を起票する                         |
| 追跡先     | _TODO_                                                           |

## 7. 関連ドキュメント

- [[specdojo:review-guide]]
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
