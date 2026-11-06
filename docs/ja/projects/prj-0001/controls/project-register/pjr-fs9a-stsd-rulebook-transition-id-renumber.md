---
specdojo:
  id: prj-0001:pjr-fs9a-stsd-rulebook-transition-id-renumber
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
  registered_at: "2026-11-06T11:53:13Z"
  due_on: null
  derived_from:
    - PJR-3APD
  depends_on:
    - PJR-S8EF
  approach: rulebook-maintenance
  targets:
    - specdojo:stsd-rulebook
---

# PJR-FS9A stsd-rulebook の遷移 ID を確定までは振り直せるようにする

## 1. 概要

遷移 ID は status が draft のあいだは通し番号に振り直してよく、確定（ready）した後は振り直さず欠番を残す規則にする

## 2. 入力

- 利用者のレビュー: `T-<nn>` の番号は下書きのあいだの追加・削除で欠番が出る。欠番を気にしない（A）、略号にする（B）、確定までは振り直してよい（C）を比べ、C とする。確定（status: ready）した後は振り直さず欠番を残し、外からの参照を変えない（2026-11-06 indie が決定）

## 3. 完了条件

- [[specdojo:stsd-rulebook]] の「ファイル命名・ID規則」の遷移 ID の規則が、文書が確定前（`status: draft`）のあいだは遷移の追加・削除・並べ替えに合わせて図と表の順に `T-01` から欠番なく振り直してよく、確定（`status: ready`）した後は既存 ID を振り直さず、削除した ID を欠番として再利用しない、と定めている。
- 確定前に振り直したときは、旧 ID で書いた記録（下書きへのレビューの指摘など）との対応が分かるよう、振り直しを記録に残すことを求めている（記録する場所は、成果物の本文ではなく作業の記録とする）。
- 完成判定や禁止事項など、ほかの章に遷移 ID の不変を前提とした記述があれば、同じ規則に合わせている。
- 変えるのは `stsd-rulebook` だけで、ほかの Kata と成果物（`docs/ja/product/` 配下）は変えていない。ほかの Kata に直すべき点を見つけた場合は、変えずに個票の対応結果に書き、pipeline では報告の `handoff` にも書く。
- `npm run -s lint:md`・`npm run -s lint:fm`・`npm run -s lint:mermaid` が通っている。

## 4. 作業内容

| No  | 作業                                       | 担当 | 状態 | メモ |
| --- | ------------------------------------------ | ---- | ---- | ---- |
| 1   | 遷移 ID の規則を確定前と確定後に分けて直す | BA   | open | -    |
| 2   | ほかの章との食い違いを直し、検査を通す     | BA   | open | -    |

## 5. 対応結果

- [[specdojo:stsd-rulebook]] の「ファイル命名・ID規則」を改訂した。初回の確定前は図と表の順に `T-01` から振り直せるようにし、旧新 ID の対応を作業の記録へ残す。確定後は既存 ID を保持し、削除した ID を再利用しない。
- 後続対応: [[specdojo:stsd-recipe]] の「全体の作成手順」には、更新時に常に既存 ID を保持する記述がある。確定前の振り直しを許す規則と作業記録への対応記録に合わせる必要があるが、今回の対象外として変更していない。
- 後続対応: [[specdojo:stsd-template]] は「状態の判定」章がなく、図と遷移表が別章で、図の遷移ラベルにも ID がない。現行 rulebook を正として整合させる必要があるが、今回の対象外として変更していない。ほかの Kata と `docs/ja/product/` 配下も変更していない。
- 必須の lint は親 runner が executor 終了後に実行し、結果を実行記録へ追記する。

## 6. 関連ドキュメント

- [[specdojo:stsd-rulebook]]: 手入れの対象
- [[prj-0001:stsd-task-execution]]: 欠番の例（`T-12`・`T-13`）
