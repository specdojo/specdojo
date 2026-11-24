---
specdojo:
  id: prj-0001:pjr-f4mg-english-edition-first-scope
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: BA
  registered_at: "2026-11-23T22:53:08Z"
  due_on: "2026-12-31"
  derived_from:
    - PJR-BHJM
  depends_on:
    - PJR-BHJM
  commit_type: feat
  commit_scope: docs
---

# PJR-F4MG 英語版の最初の範囲を作る

## 1. 概要

PJR-BHJM で決めた範囲で、README・文書サイトの入口・クイックスタートと入門の型の組の英語版を作る

## 2. 入力

- v0.11.0 に入れる見込み（PJR-BHJM で確定する）

## 3. 完了条件

- PJR-BHJMで決めた範囲で、英語版の最初の範囲を作る。案 A の場合は、README の英語の節（PJR-82H2 の続き）、文書サイトの英語の入口（`docs/en/`）とクイックスタート、入門の型の組（PJR-BXYM）の英語版とする。
- 英語の kata の置き場所と、言語の選び方（設定のキー、`init` の質問、`kata list` での見え方）を決め、決めた内容と理由を個票の対応結果に書く。決められない点は `_UNDECIDED_` で残し、何が足りないかを書く。
- 日本語の型を正本とし、英語版がどの日本語の版から訳したかを追えるようにする（frontmatter などで）。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema` を通し、文書サイトのビルド（`npm run docs:build`）が通ることを確かめる。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
