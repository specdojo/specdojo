---
specdojo:
  id: prj-0001:pjr-160d-commit-scope-excluded-changes-fix
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: hard
  owner: sol-executor
  registered_at: "2026-11-13T21:53:02Z"
  derived_from:
    - PJR-1Y1M
  commit_type: fix
  commit_scope: commit-scope
---

# PJR-160D executor の変更が commit の対象外のまま統合されないようにする

## 1. 概要

PJR-1Y1M の修正

## 2. 入力

- PJR-1Y1M の修正。kata-wave-1 の後、wave-2 を作る前に流す（indie が 2026-11-14 に承認）

## 3. 完了条件

- executor が commit の対象外のファイルを変えたまま報告したとき、runner が統合を黙って進めない。対象外の変更が残っていれば、統合を止めて理由（どのファイルか）を result と報告に残す。
- 型の文書を作る approach（`bootstrap` と `*-maintenance`）では、型を直すのに要るファイル（成果物カタログの項目・schema・文書サイトの型のメニュー）を commit の対象に含められるかを検討し、含めるなら許可リストの決め方を直す。含めない場合は、変更案として報告に書く決まりにする。
- `commit-scope: unresolved target doc id (not committable)` の警告が出るのに、型のファイルが commit される理由を確かめ、警告の意味と実際の振る舞いを合わせる。
- 対象外の変更が残る場合と、型の文書を作る場合の両方を、回帰テストで確かめている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
