---
specdojo:
  id: prj-0001:pjr-7rz4-project-move-guide
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
  registered_at: "2026-11-03T05:01:37Z"
  due_on: "2026-12-31"
  derived_from:
    - PJR-8HCB
  commit_type: docs
  commit_scope: guides
---

# PJR-7RZ4 project を別リポジトリへ移す手順のガイドを書く

## 1. 概要

project を管理用の別リポジトリへ移す手順（履歴の切り出し、設定の写し、external_projects の宣言、Kata の版の固定、文書サイトから外す）をガイドに書く

## 2. 入力

- 利用者は、prj-0002（specdojo-lp の管理）を将来、管理用の別リポジトリ（例: specdojo-lp-specdojo）へ移す可能性を考え、安全に移すための機能を用意することを求めた。全自動の移行コマンドは後回しにし、読むだけの点検・手順のガイド・リポジトリをまたぐリンクの 3 件に分けると判断した（2026-11-03）
- 手順に含める項目: git subtree split などで `base_path` の履歴だけを新しいリポジトリへ切り出す（共有の履歴は書き換えない）、specdojo.config.json の project の項目と .specdojo の名簿・exec-defaults を写して元から外す、移した後も互いに起票できるよう `external_projects` に別名を宣言する、Kata を npm パッケージから参照して版を固定する、元のリポジトリの文書サイトのサイドメニューから外す、登録簿の ID と commit の Refs は project の ID を変えなければそのまま使える（2026-11-03）
- 読むだけの点検（同時に起票する todo）と、リポジトリをまたぐリンクの書き方（同時に起票する todo）を手順の中で使う（2026-11-03）

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
