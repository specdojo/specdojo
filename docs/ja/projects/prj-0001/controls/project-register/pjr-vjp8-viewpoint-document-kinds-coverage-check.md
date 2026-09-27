---
specdojo:
  id: prj-0001:pjr-vjp8-viewpoint-document-kinds-coverage-check
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-09-27T11:30:16Z"
---

# PJR-VJP8 観点の document_kinds で判断漏れの rulebook を検出する検証を追加する

## 1. 概要

PJR-H220 の決定（選択肢 B）を実装する。

PJR-AG7B で、観点の適用範囲を `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml` の `document_kinds` で宣言するようにした。宣言は rulebook ID の include / exclude の列挙で行う。2026-09-27 時点では次の 2 観点が exclude を列挙している。

- `vp-arc-single-responsibility`: 21 件
- `vp-ba-business-value`: 12 件

rulebook を追加しても、これらの観点で新しい rulebook の扱いを判断したかどうかを確かめる手段がない。判断が漏れると、当てはまらない観点が適用されて review / grade で的外れな指摘が出るか、逆に必要な観点が外れる。

## 2. 完了条件

- `document_kinds` を宣言した観点ごとに、include / exclude / 既定（適用する）のどれとも判断されていない rulebook を一覧にする検証がある。
- 「既定のまま適用する」と判断したことを記録する方法が決まっており、記録済みの rulebook は一覧に出ない。記録方法（例: 明示の include への列挙、判断済みの一覧）と、その理由を対応結果に記録する。
- 検証は `npm run check` に含まれる。error にするか warning にするかを決め、その理由を対応結果に記録する。
- 検証の出力に、観点 ID と判断が漏れている rulebook ID が含まれる。
- 現状の 107 件の rulebook について、2 観点の判断が記録され、検証が通る状態になっている。判断の記録で既存の include / exclude の結果（どの rulebook に観点が適用されるか）が変わらない。
- rulebook を 1 件追加した場合に検証が漏れを検出すること、判断を記録すれば通ることを確かめるテストがある。
- rulebook の作成手順（`rulebook-authoring-standard.md` または関連する recipe）に、観点の判断を記録することと検証の存在が書かれている。

## 3. 作業内容

| No  | 作業                                       | 担当 | 状態 | メモ                             |
| --- | ------------------------------------------ | ---- | ---- | -------------------------------- |
| 1   | 判断済みの記録方法を決める                 | DEV  | open | 既存の宣言の結果を変えないこと   |
| 2   | 検証を実装し `npm run check` に組み込む    | DEV  | open | -                                |
| 3   | 既存 107 件について 2 観点の判断を記録する | DEV  | open | 現在の適用結果をそのまま記録する |
| 4   | テストと作成手順への記載を追加する         | DEV  | open | -                                |

## 4. 対応結果

-

## 5. 関連ドキュメント

- PJR-H220（本項目の決定）、PJR-AG7B（`document_kinds` の導入）
- [[specdojo:review-guide]]
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
