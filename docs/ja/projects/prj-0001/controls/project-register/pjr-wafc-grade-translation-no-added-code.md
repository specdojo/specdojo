---
specdojo:
  id: prj-0001:pjr-wafc-grade-translation-no-added-code
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: DEV
  registered_at: "2026-10-06T12:29:04Z"
  due_on: null
---

# PJR-WAFC grade の翻訳で英語の語句をバッククォートで残させない

## 1. 概要

[[prj-0001:pjr-jwxk-grade-translation-code-tokens]] の仕組みで 2026-10-06 に `pm-risk-register-rulebook.md` の英語の finding 13 件を gemma26 で翻訳したところ、すべて点検に通った。しかし元の英語の文にはバッククォートがないにもかかわらず、gemma26 は `decision owner`、`decision state` のように英語の語句をバッククォートで囲み、訳さずに残した。17 件中の大半がこの形で、日本語として読みにくい。

plan の「インラインコードを一字一句変えずに残す」という指示に引っ張られたと考えられる。指示で新たなバッククォートを禁じ、点検でも検出して 1 件ずつ訳し直す。

## 2. 完了条件

- `grade translation-plan` の指示に、元の文にないバッククォートを付けないこと、インラインコード以外の英語の語句は日本語に訳すこと（固有名詞・識別子を除く）を加える。インラインコードを変えずに残す指示は維持する。
- `grade localize` の件ごとの点検に、訳文のインラインコードの集合が元の文のインラインコードの集合と一致すること（増えも減りもしない）を加える。増えた件は新しい理由（例: `extra-inline-code`）で不合格とし、既存の 1 件ずつの訳し直しの対象にする。
- 判定の値と正本の `message` を変えない既存の性質を保つ。
- unit test で、インラインコードが増えた訳文の不合格と、元の文と同じインラインコードの訳文の合格を検証する。
- 関連する文書（コマンドリファレンスなど）の点検の説明を合わせる。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                                                        | 担当         | 状態 | メモ                                        |
| --- | --------------------------------------------------------------------------- | ------------ | ---- | ------------------------------------------- |
| 1   | 翻訳の指示と点検を直し、テストと文書を更新する                              | DEV          | open | `grade translation-plan` / `grade localize` |
| 2   | 統合後、`pm-risk-register-rulebook.md` の翻訳を実モデルでやり直して確かめる | orchestrator | open | 判定はやり直さない                          |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-jwxk-grade-translation-code-tokens]]（印をコードで管理する翻訳の仕組み）
- [[prj-0001:pjr-27y0-grade-english-canonical-translation]]（英語正本と翻訳の仕組み）
