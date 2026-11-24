---
specdojo:
  id: prj-0001:pjr-qcj5-kata-review-report-table
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
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

| No  | 作業                                                | 担当 | 状態 | メモ                                               |
| --- | --------------------------------------------------- | ---- | ---- | -------------------------------------------------- |
| 1   | kata-guide の `人への報告の形` に報告の決まりを追記 | BA   | done | executor の `handoff` と reporter の表を定めた     |
| 2   | strategy の 5 段の `description` を直す             | BA   | done | R4 にも指摘の報告の指示を足した。schema 検査 valid |
| 3   | 統合後に段を 1 件流して確かめる                     | BA   | open | executor は流せない。オーケストレーターが行う      |

## 5. 対応結果

- `docs/ja/specdojo/guides/kata-guide.md` の `人への報告の形` に、executor は `handoff` に指摘を 1 件 1 項目で書き、reporter は `実施内容` に表として 1 回だけ書いて申し送りに重ねない決まりを追記した。
- `sch-strategy-kata-review-calibration.yaml` の R1〜R5 の `description` を同じ決まりに合わせた。R4 は確かめの表の指示に指摘の報告を足した。
- `sch-track-kata-review-calibration.yaml` は生成物のため直接編集していない。反映は track の再生成が要る（オーケストレーターへの申し送り）。
- 保護された設定（reporter の agent の定義など）は変更していない。変更案はなし。
- 決めた点: 項目の書式を `No: 段 / 箇所 / 指摘 / 直した案 / 根拠 / 印` とした。理由は 1 件 1 項目で、reporter が表へ写しやすいため。

### 5.1. CHANGELOG に書く事項

なし

## 6. 関連ドキュメント

- [[specdojo:kata-guide|実践の型活用ガイド]]
