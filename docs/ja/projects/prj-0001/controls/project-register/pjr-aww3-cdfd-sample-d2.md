---
specdojo:
  id: prj-0001:pjr-aww3-cdfd-sample-d2
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-15T14:35:28Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-PMK6
  commit_type: docs
  commit_scope: kata
  approach: sample-maintenance
  targets:
    - specdojo:cdfd-sample
---

# PJR-AWW3 cdfd-sample の概念データフロー図を D2 に書き直す

## 1. 概要

Mermaid のまま残る 5.1・5.2 の 2 図を、全体概要で採用した D2 へ書き直す

## 2. 入力

- cdfd-sample は cdfd-overview-sample（`based_on`）を詳細化する。全体概要は「凡例（本プロダクト共通）」で D2 を採用し、cdfd-rulebook は全体概要で選んだ記法に従うと定めるが、cdfd-sample の図は Mermaid のまま残っている（2026-11-15）
- 5.1 仕入計画と 5.2 入荷検品の 2 図を [[specdojo:cdfd-d2-rulebook]] に沿って D2 にする（direction: down、データストアの色は G 案）。ノード、エッジ、情報の流れと商品の流れの区別、プロセス ID は変えない。図の下の凡例の説明も D2 の表記に合わせる
- cdfd-overview-sample・cdfd-uc-sample の D2 の書き方にそろえる。本文の表と章構成は変えない
- 0.8.0（PJR-PMK6）で型を極力最新にする方針に含める（2026-11-15、利用者が承認）

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

- 申し送り（executor）: 5.1・5.2 の D2 化に加え、plan に展開された grade の finding（F001〜F003）を解消するため、入力の「本文の表は変えない」の例外として表の文言を最小限変更した（`P-01-01` の業務目的、3.1 の導入文、4.1 商品台帳の利用、8.1 `E-02-02` の検出条件・停止範囲・扱い・再開条件）。表の列と章構成は変えていない。この例外を認めるかは利用者が確認する。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
