---
specdojo:
  id: prj-0001:pjr-bsck-deprecate-unused-commands
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: low
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-16T11:00:14Z"
  due_on: null
  derived_from:
    - PJR-C5AF
  commit_type: refactor
  commit_scope: cli
---

# PJR-BSCK 使われていない・移行用・非推奨のコマンドを非推奨にし、次の版で消す

## 1. 概要

使われていない・移行用・非推奨のコマンドに非推奨の警告を出し、次の版で消す。コマンドの数を減らし、利用者が覚える範囲と保守の負担を小さくするため（PJR-C5AF）。

## 2. 入力

- PJR-C5AF の消す候補: timeline where・build、exec note・link・estimate、exec migrate-records・grade migrate・register migrate・config migrate-members
- 次の版で help と実行時に非推奨の警告を出し、代わりの操作を示す。その次の版で消す。消す前に、利用者のリポジトリとガイドでの使われ方をもう一度確かめる

## 3. 完了条件

- 対象のコマンドが、help と実行時に非推奨の警告と代わりの操作を出す。
- コマンドリファレンスとガイドに、非推奨と消す予定の版が書かれている。
- 警告を出した版の次の版で、対象のコマンドを消す（消す前に使われ方をもう一度確かめる）。
- `npm run check` と親の検証が通る。

## 4. 作業内容

| No  | 作業                             | 担当 | 状態 | メモ |
| --- | -------------------------------- | ---- | ---- | ---- |
| 1   | 非推奨の警告と代わりの操作を足す | DEV  | open | -    |
| 2   | リファレンスとガイドを更新する   | DEV  | open | -    |
| 3   | 次の版で消す                     | DEV  | open | -    |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[prj-0001:pjr-c5af-command-inventory]]
