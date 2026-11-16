---
specdojo:
  id: prj-0001:pjr-c0hh-i18n-cli-messages
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: i18n-code
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-11-15T13:25:01Z"
  derived_from:
    - PJR-BRCG
  depends_on:
    - PJR-PMK6
---

# PJR-C0HH SpecDojo の CLI の表示とエラーを多言語化する（英語版 第 1 段）

## 1. 概要

CLI の表示とエラーを言語ごとのメッセージの表に分け、英語の表を用意する

## 2. 入力

- PJR-BRCG の決定（indie が 2026-11-15）: コードの多言語化は、CLI の表示とエラーを言語ごとのメッセージの表に分けることから始める。agent への指示の文（plan の共通規約・exec-templates）の英語版は、英語で成果物を作りたい利用者が出た段階で足す
- 始める条件: 0.8.0（PJR-PMK6）を出した後

## 3. 範囲（track と domain）

track `i18n-code`。CLI（`src/`）の表示・エラー・案内の文を、言語ごとのメッセージの表に分け、英語の表を用意する。agent への指示の文（plan の共通規約・exec-templates）と文書は対象外（PJR-CYHR と、英語の成果物の需要が出た段階）。

## 4. 完了の判断の基準

- CLI の表示とエラーが、言語ごとのメッセージの表から出る。日本語と英語の表があり、言語を設定で選べる。
- 表にない文が残っていないことを、テストか検査で確かめられる。
- 子の todo がすべて完了し、利用者向けの変更が CHANGELOG に書く事項として残っている。

## 5. 子項目

子 todo は `register add --type todo --from <epic-id>` で起票する。現在の一覧と状態は `register build` が生成する epic 別ビューで確認する。

## 6. 対応結果

_TODO_: 完了を判断した根拠と残課題を記載する。未完了の場合は `-` とする。

## 7. 関連ドキュメント

- [[prj-0001:pjr-brcg-english-edition-approach]]
