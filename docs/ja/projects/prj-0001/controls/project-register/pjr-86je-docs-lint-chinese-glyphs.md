---
specdojo:
  id: prj-0001:pjr-86je-docs-lint-chinese-glyphs
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-04T08:46:04Z"
  due_on: null
---

# PJR-86JE 日本語の文書に中国語の字体が混ざったことを検出する lint を追加する

## 1. 概要

ローカル LLM（oMLX の Ornith など）は日本語の出力に中国語の字体・語彙（业、为、时、这个、问题 など）を混ぜることがあり、2026-10-04 の grade の計測では executor の出力の 6 回中 3〜4 回に現れた。agent が日本語の文書を書くと、そのままコミットされる。どの agent が混ぜても検出できるよう、docs-lint に中国語でしか使わない字体を検出する規則を追加する

## 2. 完了条件

- `packages/docs-lint` に、日本語の Markdown 文書の本文で中国語の簡体字の字体（日本語の常用漢字と字形が異なり、日本語の文書では使わない字。例: 业、务、为、时、这、们、个、说、对、关、发、问、题、实、现、进、没、还、过、样、揭）を検出する規則を追加し、`npm run lint:md` で失敗にする。
- 検出した位置（ファイル・行・字）と、対応する日本語の字体（例: 业→業、为→為）を表示する。
- 誤検出を避ける範囲を決めて記録する。少なくとも、コードブロックとインラインコード、外部の引用（URL、固有名詞）、中国語を意図して含む文書は対象外にできるようにする。
- 字の一覧の決め方（簡体字と日本語の新字体で字形が異なる字だけを対象にし、日中で同じ字形の字は含めない）を記録し、一覧を1か所で管理する。
- 既存の文書を全件検査し、検出された箇所を直すか、意図したものとして除外する。
- unit test で、検出、対応する字体の表示、コード部分の除外、除外の指定を検証する。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                 | 担当 | 状態 | メモ                               |
| --- | ------------------------------------ | ---- | ---- | ---------------------------------- |
| 1   | 対象の字の一覧と、除外の範囲を決める | DEV  | open | 日中で字形が同じ字を含めない       |
| 2   | docs-lint への規則の実装とテスト     | DEV  | open | 既存の remark の規則の形に合わせる |
| 3   | 既存の文書の全件検査と修正           | DEV  | open | -                                  |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-vqb5-agent-grade-comparison]]: 「ornith の executor の改善（2026-10-04）」で、executor の出力に中国語の字体が混ざった記録。
- `packages/docs-lint/src/`（`remark-no-unescaped-angle-placeholder.ts` など既存の規則）
