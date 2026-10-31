---
specdojo:
  id: prj-0001:pjr-2fv2-release-v0-6-0
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  owner: PO
  registered_at: "2026-10-31T08:35:35Z"
  due_on: "2026-11-30"
---

# PJR-2FV2 0.6.0 でリリースする

## 1. 概要

specdojo 0.6.0 と @specdojo/docs-lint 0.4.0 を公開する。docs-site は変更がないため 0.3.0 のまま

## 2. 入力

- 2026-10-31 の対話で利用者がリリースを指示した。版は specdojo 0.6.0、@specdojo/docs-lint 0.4.0（`_CONTEXT_` の目印の検出を追加したため minor）、@specdojo/docs-site は 0.3.0 から変更がないため上げない
- CHANGELOG に破壊的変更の節はないが、schedule の guided-pass の approach が fully-guided から draft に変わったことと、fully-guided が宣言された文書だけを参照する磨き込み専用になったことを、版の節の先頭で目立たせる
- 手順は pm-orchestrator-playbook のリリースの手順に従う。push・PR の merge・タグ・npm の公開の承認は利用者が行う

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
