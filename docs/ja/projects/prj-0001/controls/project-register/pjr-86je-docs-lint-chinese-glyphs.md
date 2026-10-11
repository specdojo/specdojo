---
specdojo:
  id: prj-0001:pjr-86je-docs-lint-chinese-glyphs
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-04T08:46:04Z"
  due_on: null
  completed_at: "2026-10-06T10:43:30Z"
  conclusion: markdownlint のカスタムルール MD061（no-chinese-glyphs）を追加し、日本語と字形の異なる簡体字 20 字を検出する。コードと URL は対象外、意図した箇所は disable コメントで除外する。統合後に残った 3 件の検出は orchestrator が修正した（d27af7c89）
---

<!-- markdownlint-disable no-chinese-glyphs -->

# PJR-86JE 日本語の文書に中国語の字体が混ざったことを検出する lint を追加する

## 1. 概要

ローカル LLM（oMLX の Ornith など）は日本語の出力に中国語の字体・語彙（`业`、`为`、`时`、`这个`、`问题` など）を混ぜることがあり、2026-10-04 の grade の計測では executor の出力の 6 回中 3〜4 回に現れた。agent が日本語の文書を書くと、そのままコミットされる。どの agent が混ぜても検出できるよう、docs-lint に中国語でしか使わない字体を検出する規則を追加する

## 2. 完了条件

- `packages/docs-lint` に、日本語の Markdown 文書の本文で中国語の簡体字の字体（日本語の常用漢字と字形が異なり、日本語の文書では使わない字。例: `业`、`务`、`为`、`时`、`这`、`们`、`个`、`说`、`对`、`关`、`发`、`问`、`题`、`实`、`现`、`进`、`没`、`还`、`过`、`样`、`揭`）を検出する規則を追加し、`npm run lint:md` で失敗にする。
- 検出した位置（ファイル・行・字）と、対応する日本語の字体（例: `业`→業、`为`→為）を表示する。
- 誤検出を避ける範囲を決めて記録する。少なくとも、コードブロックとインラインコード、外部の引用（URL、固有名詞）、中国語を意図して含む文書は対象外にできるようにする。
- 字の一覧の決め方（簡体字と日本語の新字体で字形が異なる字だけを対象にし、日中で同じ字形の字は含めない）を記録し、一覧を1か所で管理する。
- 既存の文書を全件検査し、検出された箇所を直すか、意図したものとして除外する。
- unit test で、検出、対応する字体の表示、コード部分の除外、除外の指定を検証する。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                 | 担当 | 状態 | メモ                                    |
| --- | ------------------------------------ | ---- | ---- | --------------------------------------- |
| 1   | 対象の字の一覧と、除外の範囲を決める | DEV  | done | 日中で字形が同じ字（没など）を含めない  |
| 2   | docs-lint への規則の実装とテスト     | DEV  | done | markdownlint のカスタムルールとして実装 |
| 3   | 既存の文書の全件検査と修正           | DEV  | done | markdownlint-disable などで除外         |

## 4. 対応結果

- `packages/docs-lint/src/markdownlint-rule-no-chinese-glyphs.cjs` に markdownlint のカスタムルールを実装した。
- `packages/docs-lint/bin/specdojo-docs-lint.js` の `markdownlint` 実行時に上記ルールを `-r` オプションで読み込ませるように修正した。
- 対象文字として指定された「\`业\`、\`务\`、\`为\`、\`时\`、\`这\`、\`们\`、\`个\`、\`说\`、\`对\`、\`关\`、\`发\`、\`问\`、\`题\`、\`实\`、\`现\`、\`进\`、\`还\`、\`过\`、\`样\`、\`揭\`」を対象にし、「没」は日中で同じ字形のため除外した。対応する日本語の字体をエラーメッセージに出力するようにした。
- `markdownlint-cli` に `markdown-it` のパース結果を使わせることで、`code`、`inlineCode`、外部の引用（URL）等を自動的に無視するようにした。また、`<!-- markdownlint-disable no-chinese-glyphs -->` での意図的除外も可能にした。
- `tests/packages/docs-lint/markdownlint-rule-no-chinese-glyphs.test.ts` で unit test を追加し、検出および除外の挙動を検証した。
- 既存の文書（チケット等）に含まれる中国語文字をインラインコードでエスケープし、意図的に含む箇所は除外コメントを挿入した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-vqb5-agent-grade-comparison]]: 「ornith の executor の改善（2026-10-04）」で、executor の出力に中国語の字体が混ざった記録。
- `packages/docs-lint/src/`（`remark-no-unescaped-angle-placeholder.ts` など既存の規則）
