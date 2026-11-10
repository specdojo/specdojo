---
specdojo:
  id: prj-0001:pjr-brcg-english-edition-approach
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  owner: PO
  registered_at: "2026-11-10T23:26:54Z"
  due_on: "2026-12-31"
---

# PJR-BRCG SpecDojo の英語版の進め方と始める条件を決める

## 1. 背景

機能と型が固まった後に英語版を作るため、コードの多言語化・文書の英語化・型の英語化の範囲、正本の言語、同期の仕方、始める条件、epic の分け方を決める。決まったらこの decision から epic を起票する

## 2. 入力

- indie の要望（2026-11-11）: SpecDojo の機能と型が固まってきたら英語版を作りたい。コードの多言語化、文書と型の英語化がある。
- すでにあるもの: docs/en/ の置き場所（docs-site は docs/en がなくてもビルドできる、PJR-EA20）、命名の標準の多言語文書の ID 方針（翻訳は同じ論理文書の言語違いとして同じ ID）、更新文書の翻訳の routine rtn-translate-updated-docs（今は止めてある）、grade の英語の判定を正本にし gemma26-translator で日本語へ翻訳する仕組み、用語集 gl-common の概念名と英語名の対応（PJR-QD81）。
- 論点: (1) 範囲（CLI の表示・エラー・agent への指示の文の多言語化、ガイドとリファレンスの英語化、rulebook・recipe・sample・template の英語化）、(2) 正本の言語（日本語を正本にするか、型は英語を正本にするか）、(3) 日本語の正本を変えたときの英語版の追い方、(4) 始める条件（例: 業務仕様とプロジェクトの型の手入れの epic が終わり型が ready にそろったら）、(5) epic の分け方（コードと文書・型の 2 つにするか）。
- epic ではなく decision で起票する（indie が決定）。担当は PO、期限は 2026-12-31。

## 3. 検討した選択肢

| 選択肢 | 内容   | 利点   | 懸念   |
| ------ | ------ | ------ | ------ |
| A      | _TODO_ | _TODO_ | _TODO_ |

## 4. 決定内容

_TODO_: 採択した内容を明確に記載する。

## 5. 採択理由

- _TODO_: 判断根拠を記載する。

## 6. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | _TODO_ |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容   |
| ---------- | ------ |
| 影響範囲   | _TODO_ |
| 必要な対応 | _TODO_ |
| 追跡先     | _TODO_ |

## 8. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
