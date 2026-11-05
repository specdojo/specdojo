---
specdojo:
  id: prj-0001:pjr-00ny-stsd-kata-maintain-or-rebuild
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  registered_at: "2026-11-05T10:44:15Z"
  derived_from:
    - PJR-3APD
    - PJR-MC63
---

# PJR-00NY stsd の Kata は作り直さず手入れとする

## 1. 背景

3APD の段 5。代表の 1 件（stsd-task-execution）を材料に、stsd の Kata を手入れするか作り直すかを決める

## 2. 入力

- 作り直しの目安（章立ての変更が半分を超える、図の表記を Mermaid から D2 へ変える、rulebook の規則の半分ほどが合わない）にどれも当たらない。最終版の章立ては template の 5 章と同じで、合わなかった点は 3 つ（PJR-Q9AW の対応結果）
- 状態遷移図は Mermaid の stateDiagram-v2 が合うため、D2 へ移さない
- frontmatter の id の書き方（プロジェクト修飾の有無）は stsd に限らず cdfd・cdfd-uc・bps の rulebook にもあるため、stsd の手入れとは別の項目で扱う

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
