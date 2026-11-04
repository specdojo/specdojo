---
specdojo:
  id: prj-0001:pjr-y431-split-plan-conventions
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-04T12:10:55Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-0MR5
  commit_type: refactor
  commit_scope: exec
---

# PJR-Y431 exec plan の共通の規約を共通・edit・review の 3 つのファイルに分ける

## 1. 概要

edit と review の plan に入る共通の規約（xep-common-conventions-template.md）を、両方に共通、edit だけ、review だけの 3 つに分け、plan の生成時に共通のファイルと mode に合うほうを組み合わせる

## 2. 入力

- xep-common-conventions-template.md は 2026-09-01 に edit plan の共通の規約として作られた。2026-09-28（PJR-N22N）に review-only の印つきで review の判断の手順が足され、review plan にも入るようになった。今は edit の plan テンプレート 21 個と review の plan テンプレート 10 個が使い、grade の plan は使わない（2026-11-04）
- 利用者の判断: 名前と中身がずれているため、edit だけの印を足す案ではなく、共通・edit・review の 3 つのファイルに分ける。分ける作業と冗長さの規則を足す作業（PJR-0MR5）は別の項目にし、分ける前後で plan の本文が一致することを確かめられるようにする（2026-11-04）

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
