---
specdojo:
  id: prj-0001:pjr-f4tg-kata-agent-review-stages
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: hard
  owner: BA
  registered_at: "2026-11-23T23:01:49Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-TQZA
  depends_on:
    - PJR-TQZA
  commit_type: feat
  commit_scope: kata
---

# PJR-F4TG kata の agent のレビューの段を組み、2〜3 の型で人のレビューと目合わせする

## 1. 概要

PJR-TQZA で決めた流れで、文章のチェック項目・kata 専用の観点・別のモデルの組み方・人への報告の形を作り、2〜3 の型で利用者のレビューと比べて直す

## 2. 入力

- v0.10.0 に入れる（利用者の指定、2026-11-24）
- sample の横串の確認（段 2）のやり方として使う
- 目合わせの型は prj-overview・opr・stsd の sample（利用者の決定、2026-11-24）

## 3. 完了条件

- PJR-TQZAで決めた流れを、kata のレビューの段として組む。案 A の場合は、R1 目的の過不足・R2 構成・R3 読みやすさ・R4 正しさ・R5 整合の 5 段とし、段ごとに渡す材料と出すものを決める。
- 文章のチェック項目（一文一義、主語の明示、用語の統一、文の長さ、表と箇条書きの使い分けなど）を作る。既存の記述の標準（`docs/ja/specdojo/standards/` の文章の規約）と重ねず、足りない点だけを足す。置き場所と理由を個票の対応結果に書く。
- grade の観点から kata に合うものを選び、kata 専用の観点の組を決める（`pm-review-viewpoints.yaml` の `kata` の扱い）。外した観点と理由を書く。
- R4 では、書いてある事実を正本（schema・src・コマンドリファレンス）と突き合わせ、主張ごとの確かめ結果を根拠とともに表にする。R5 では、同じ系列の sample・参照先・用語集を読む範囲に入れる。
- 書き手と別のモデルにレビューさせる組み方（例: claude が書いたものは codex の sol、codex が書いたものは claude）を決める。
- 人への報告の形（段の順の指摘、直した案の差分、agent が迷った点の印）を決め、1 つの型で見本を作る。
- 2〜3 の型で、利用者のレビューの指摘と agent の指摘を比べ、見落としと誤りを個票の対応結果に表で書く。見落としはチェック項目か段の指示に足す。比べる型は利用者と決める。
- 組み方は、できるだけ schedule の strategy・job・grade の観点の設定で行い、runner のコードを変える必要が出た場合は別に起票する。保護された設定（`.specdojo/` など）に触れる場合は、案を個票の対応結果に書き、反映は利用者の承認のもとで行う。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema` を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
