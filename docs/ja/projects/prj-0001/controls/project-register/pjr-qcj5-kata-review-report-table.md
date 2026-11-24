---
specdojo:
  id: prj-0001:pjr-qcj5-kata-review-report-table
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-24T13:32:47Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-0BGE
  commit_type: docs
  commit_scope: kata
---

# PJR-QCJ5 段のレビューの指摘の表を result に表として 1 回だけ書かせる

## 1. 概要

段の result で指摘の表が 1 行に詰められ重なる問題を、kata-guide と段の指示で直す

## 2. 入力

- 担当は BA、期限は 2026-11-30（利用者、2026-11-24）
- PJR-0BGE の段取りとして 2026-11-24 の晩の実行の前に行う（利用者、2026-11-24）

## 3. 完了条件

- 2026-11-24 の目合わせ（PJR-F4TG）で、段の result の指摘の表が Markdown の表にならず、申し送りの 1 行に詰めて書かれ、同じ表が 2 回重なった。executor の `handoff` の表の文字列を reporter がそのまま写したためである。
- [[specdojo:kata-guide|実践の型活用ガイド]] の `人への報告の形` に、executor が報告の `handoff` に指摘を 1 件ずつ（1 件 1 項目、列は No・段・箇所・指摘・直した案・根拠・印）書くこと、reporter が result の `実施内容` に Markdown の表として 1 回だけ書き、申し送りに表を重ねないことを定める。
- `docs/ja/projects/prj-0001/schedule/sch-strategy-kata-review-calibration.yaml` の 5 段の `description` の報告の指示を、上の決まりに合わせて直す（全 sample の strategy はこれを写して作る）。
- reporter の agent の定義など保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- strategy は `npm run validate:schema:file`（sch-strategy の schema）で確かめる。
- 統合の後に、オーケストレーターが段を 1 件流し、result の指摘の表が表として 1 回だけ書かれることを確かめてから close する。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
