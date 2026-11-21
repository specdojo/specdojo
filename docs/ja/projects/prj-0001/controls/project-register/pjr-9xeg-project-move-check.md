---
specdojo:
  id: prj-0001:pjr-9xeg-project-move-check
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: ARC
  registered_at: "2026-11-03T05:00:06Z"
  due_on: "2026-12-31"
  derived_from:
    - PJR-8HCB
  commit_type: feat
  commit_scope: project
---

# PJR-9XEG project を別リポジトリへ移す前の読むだけの点検を作る

## 1. 概要

project を別リポジトリへ移す前に、実行中の項目・exec の worktree とブランチ・リポジトリをまたぐリンク・写すべき設定を一覧にする、何も書き換えない点検のコマンドを作る

## 2. 入力

- 利用者は、prj-0002（specdojo-lp の管理）を将来、管理用の別リポジトリ（例: specdojo-lp-specdojo）へ移す可能性を考え、安全に移すための機能を用意することを求めた。全自動の移行コマンドは後回しにし、読むだけの点検・手順のガイド・リポジトリをまたぐリンクの 3 件に分けると判断した（2026-11-03）
- 点検する項目の候補: 実行中・waiting の登録簿の項目と doing の schedule タスク、exec の worktree とブランチ（exec/`<project-id>-``*`）、統合先のブランチ、定期実行の設定、移す project とほかの project の間の wikilink（prj-0002 から prj-0001 の個票へ 10 種類ある）、写すべき設定（specdojo.config.json の project の項目、repos の相対パス、.specdojo の名簿と exec-defaults）、Kata の参照元（移した後は npm パッケージで版を固定する）（2026-11-03）
- コマンドの名前の例は specdojo project move --check。名前と出力の形は executor が決め、理由を記録してよい（2026-11-03）

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
