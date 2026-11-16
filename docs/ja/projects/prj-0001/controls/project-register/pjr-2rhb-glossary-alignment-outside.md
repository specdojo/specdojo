---
specdojo:
  id: prj-0001:pjr-2rhb-glossary-alignment-outside
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: sol-executor
  registered_at: "2026-11-12T23:14:58Z"
  derived_from:
    - PJR-6XQ4
  commit_type: docs
  commit_scope: glossary
---

# PJR-2RHB 用語集の確定に合わせて、用語集の外の文書と型の表記をそろえる

## 1. 概要

用語集の確定のレビューで決めた表記（job run など）と気づいた点を、用語集の外の文書・型・コードのメッセージへまとめて反映する

## 2. 入力

- 用語集の確定のレビュー（2026-11-13）で、用語集の外にも直す点が出てきた。用語集の外の直しは、まとめて 1 回で行う（indie の依頼）。項目は indie が後から追記する
- 「Job Run」を「job run」に統一する。用語集の見出しは直した。設計書（sysd-job-execution など）・状態定義（stsd-job-run）・ガイド・コードのメッセージなど、用語集の外でおよそ 29 ファイルが「Job Run」を使っている。文書の題名（「Job実行設計」など）の扱いも含めて決める
- 英語名と英語の用語は小文字で書き、SpecDojo の概念の名前として大文字で定着しているもの（Kata など）と固有名詞（SpecDojo など）だけを例外にする、という決まりを用語集の型（gl-rulebook）に足す。gl を PJR-960C に足すときに、rulebook の見直しの段で入れてもよい
- 用語集の型（gl-rulebook）に、`notes` には読み手向けの補足（前提・例外・使う文脈）だけを書き、`category` や `relatedTerms` の指定のしかたなど YAML の書き方のメモを書かない、という決まりを足す。用語集の確定のレビュー（2026-11-13）で、「構成要素の `category` に本用語を指定する」のような注記が読み手に分からないと indie が指摘した

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
