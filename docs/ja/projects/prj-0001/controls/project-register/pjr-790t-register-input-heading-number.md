---
specdojo:
  id: prj-0001:pjr-790t-register-input-heading-number
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: easy
  owner: DEV
  registered_at: "2026-10-31T02:43:14Z"
  due_on: "2026-11-30"
---

# PJR-790T 入力の章がない種類の個票で入力の見出しに番号を付ける

## 1. 概要

decision など入力の章がない種類の個票へ --input を書くと、番号のない ## 入力 が末尾に足されるため、番号付きの章として適切な位置に入れる

## 2. 入力

- src/register/input.ts の setRegisterInput は、入力の章がない個票では本文の末尾に番号のない ## 入力 を足す。Markdown の規約では ## 以下の見出しに連番が要る。todo は 2 章に入るが、decision（PJR-BNMV で発生）では末尾に足された

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
