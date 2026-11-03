---
specdojo:
  id: prj-0001:pjr-66er-cross-repository-links
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
  registered_at: "2026-11-03T05:02:47Z"
  due_on: "2026-12-31"
  derived_from:
    - PJR-8HCB
  commit_type: feat
  commit_scope: docs
---

# PJR-66ER リポジトリをまたぐ文書のリンクの書き方を決めて対応する

## 1. 概要

管理用リポジトリとプロダクトのリポジトリ、別リポジトリへ移した project の間で、wikilink を文書サイトで解決できるよう、リポジトリをまたぐリンクの書き方と表示の仕組みを決めて対応する

## 2. 入力

- 利用者は、prj-0002（specdojo-lp の管理）を将来、管理用の別リポジトリ（例: specdojo-lp-specdojo）へ移す可能性を考え、安全に移すための機能を用意することを求めた。全自動の移行コマンドは後回しにし、読むだけの点検・手順のガイド・リポジトリをまたぐリンクの 3 件に分けると判断した（2026-11-03）
- 今は prj-0002 の文書から prj-0001 の個票へ wikilink が 10 種類あり、prj-0001 の運用メモや個票からも prj-0002 を指している。リポジトリが分かれると文書サイトで解決できなくなる（2026-11-03）
- PJR-8HCB で決めたスターターの 3 種類のリポジトリ（管理・作る側・配る側）でも同じ問題が起きるため、移行の点検とガイドより先に要る。書き方の案の例は、`external_projects` の別名を付けた wikilink を GitHub の URL に置き換えて表示する形。方式は選択肢と理由を記録して決める（2026-11-03）

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
