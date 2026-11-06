---
specdojo:
  id: prj-0001:pjr-jm29-epic-based-plan-docs
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  registered_at: "2026-11-05T22:55:07Z"
  derived_from:
    - PJR-VYSC
  depends_on:
    - PJR-PE19
---

# PJR-JM29 文書と Kata と prj-0001 を epic ベースの全体計画に移す

## 1. 概要

tml の Kata を非推奨にし、ガイドとリファレンスを epic ベースの説明に直し、prj-0001 の epic に domains を書いて全体計画を確かめる

## 2. 入力

- 由来: PJR-VYSC の決定。runner とスキーマの変更は PJR-PE19 で行う（2026-11-06）
- 利用者の決定: epic がない track は全体計画に出さない（2026-11-06）

## 3. 完了条件

- `tml-rulebook.md` と `tml-sample.yaml` を `status: deprecated` にし、冒頭に全体計画は epic で管理することと移行先を書く。
- `timeline-design-guide.md` は非推奨の旨と移行の手順だけを残す。`docs-structure-guide`・`register-operation-guide`・`specdojo-overview-guide`・`specdojo-config-reference`・`command-reference`・`pjr-rulebook`・`dct-rulebook` の timeline の説明を epic ベースの全体計画に直す。
- prj-0001 の epic 3 件（PJR-3APD・PJR-GQN3・PJR-GEZN）に `domains` を書く。値は各個票の範囲の章と、今の `tml-index.yaml` から取る。
- `dct-planning.yaml` から `tml-index` の項目を外す。外せない依存（`depends_on: [tml-index]` など）があれば `_UNDECIDED_` として残し、理由を個票の対応結果に書く。
- prj-0001 の `tml-index.yaml` は消さず、冒頭のコメントに非推奨と書く。削除は利用者が判断する。
- `dashboard build` を実行し、全体計画に epic の 3 件が出て、epic のない track が出ないことを確かめ、結果を個票の対応結果に書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:catalog`・`npm run docs:build` が通る。
- runner のコードは変えない。
- CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えない。
- 保護された設定（`package.json`・agent の定義・`exec-defaults.yaml` など）は変えない。変更が要る場合は、案を個票の対応結果に書き、pipeline では報告の `handoff` にも書く。

## 4. 作業内容

| No  | 作業                                          | 担当     | 状態 | メモ |
| --- | --------------------------------------------- | -------- | ---- | ---- |
| 1   | tml の Kata を非推奨にする                    | executor | open | -    |
| 2   | ガイドとリファレンスを直す                    | executor | open | -    |
| 3   | prj-0001 の epic とカタログと timeline を直す | executor | open | -    |
| 4   | dashboard で全体計画を確かめる                | executor | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- PJR-VYSC: 由来の decision
- PJR-PE19: 先行の実装の todo
- [[specdojo:tml-rulebook]]: 非推奨にする Kata
