---
specdojo:
  id: prj-0001:pjr-q9df-cnd-specdojo-rework-grade-findings
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
  registered_at: "2026-11-15T11:12:33Z"
  commit_type: docs
  commit_scope: cnd
  approach: fully-guided
  targets:
    - cnd-specdojo
---

# PJR-Q9DF cnd-specdojo を grade の指摘で手直しする（コンテナ構成と配備の方針の基準）

## 1. 概要

最新の grade の指摘を取り込み、承認の基準となるコンテナ構成と配備の方針を本文で定める

## 2. 入力

- kata-wave-1 の確定（T-KATA-WAVE-1-cnd-specdojo-140）で差し戻した（indie が 2026-11-15 に判断、PJR-TN43）。grade は needs-work 82 点で完了条件 4/5
- 主な指摘: コンテナ構成と配備の方針の基準が本文で定まっておらず、PO が承認できない（DC-002）。留保した範囲（文書サイトの閲覧の認証と配信、REL-10 は PJR-CJMN）と、今承認する範囲を区別する

## 3. 完了条件

- PO が承認の基準にできる、コンテナ構成と配備の方針（何をどこで動かし、何を配備しないか）を本文で定めている。
- 今の時点で承認する範囲と、留保した範囲（文書サイトの閲覧の認証と配信は運用設計まで、REL-10 は PJR-CJMN）を区別し、留保の範囲で許される後続の作業と保留する作業が分かる。
- 本文に書いた人間の PO の判断と、期限付きの留保（追跡先の PJR）を消さずに保っている。
- 成果物の `status` は `draft` のまま変えない（確定は人が T-KATA-WAVE-1 の 140 で行う）。
- 直した後に `grade run --target deliverable` で grade し直し、成果物カタログの完了条件をすべて満たす（留保の範囲だけが未充足として残る場合は、その理由を対応結果に書く）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:catalog` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                                    | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 最新の grade の指摘を取り込み、配備の方針の基準を定める | ARC  | open | -    |
| 2   | 承認する範囲と留保の範囲を書き分ける                    | ARC  | open | -    |
| 3   | grade し直して結果を書く                                | ARC  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
