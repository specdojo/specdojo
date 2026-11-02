---
specdojo:
  id: prj-0001:pjr-b0b8-agy-session-permissions-multi-repo
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
  registered_at: "2026-11-02T12:57:11Z"
  due_on: "2026-11-30"
---

# PJR-B0B8 agy のセッション別権限設定に対応し、マルチリポジトリの編集境界を見直す

## 1. 概要

agy のセッション別設定を使い、役割ごとの権限を分離する。宣言済みプロダクトリポジトリとその worktree の編集を可能にし、秘密情報・保護設定への制限と両立させる。

## 2. 入力

- 利用者が agy 1.4.12 のセッション別設定を用いた allow/deny 制御と、マルチリポジトリのプロダクトリポジトリ編集境界の見直しを依頼した。担当 ARC、期限 2026-11-30。
- 利用者共有の agy --version は 1.4.12。ローカルの agy --help で --settings が settings.json のキーを JSON またはファイルパスで受け取り、セッション内だけに適用して保存しないことを確認した。
- 現在の配布設定はグローバル設定へのルール追加が中心。宣言済みプロダクトリポジトリの --add-dir 注入は既存実装にある。本リポジトリの exec-defaults には --dangerously-skip-permissions が残る。
- Claude と同等の制御が可能かは未検証であり、設定マージ・優先順位・実際の許可と拒否を確認する。起票までが今回の承認範囲であり、exec の実行は別途承認する。

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
