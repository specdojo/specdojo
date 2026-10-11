---
specdojo:
  id: prj-0001:pjr-wafc-grade-translation-no-added-code
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-06T12:29:04Z"
  due_on: null
  completed_at: "2026-10-06T22:14:02Z"
  conclusion: 翻訳の指示で新たなバッククォートを禁じ、訳文のインラインコードが元の文と一致することを点検に加えた。gemma26-reporter では指示が守られないため、翻訳専用の agent への切り替えを後続の todo で扱う
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
| 1   | 翻訳の指示と点検を直し、テストと文書を更新する                              | DEV          | done | `grade translation-plan` / `grade localize` |
| 2   | 統合後、`pm-risk-register-rulebook.md` の翻訳を実モデルでやり直して確かめる | orchestrator | done | 13件中7件を採用、6件は英語に戻した          |

## 4. 対応結果

- `grade translation-plan` に、元にないインラインコードやバッククォートを追加せず、固有名詞・識別子以外の英語の語句を日本語へ訳す指示を追加した。元のインラインコードを一字一句変えずに残す指示は維持した。
- `grade localize` は原文と訳文のインラインコードを多重集合として比較し、欠落を `missing-inline-code`、追加を `extra-inline-code` で項目ごとに不合格にする。既存の pipeline は不合格 index だけを1回再翻訳するため、追加で不合格になった項目も同じ再試行と英語正本へのフォールバックを使う。
- unit test に、元にない `` `decision owner` `` を加えた訳文の拒否、元と同じ `` `npm test` `` を保持した訳文の受理、翻訳 plan の新しい指示を追加した。翻訳段階が判定値と正本の `message` を変更しない構造は維持した。
- コマンドリファレンス、文書メタデータ標準、routine 運用ガイド、Ollama 設計書、関連する比較記録を新しい点検へ同期した。
- 残作業は、統合後に orchestrator が `pm-risk-register-rulebook.md` の表示翻訳を実モデルでやり直す No. 2 のみである。判定はやり直さない。
- 実モデルでの確認（orchestrator、2026-10-06）: 指示を加えても gemma26-reporter は 13 件中 11 件でバッククォートを追加し、追加された件は点検（`extra-inline-code`）で不合格になった。1件ずつの訳し直しで5件が通り、最終的に7件が翻訳され、6件は英語の正本を表示に使った（訳し直しは 258 秒）。点検は意図どおり働いている。
- 原因は `gemma26-reporter` の定義にある reporter 向けの「識別子はインラインコードで囲む」指示とみられる。翻訳専用の agent を用意し、既定の翻訳の agent を切り替える作業は後続の todo で扱う。実モデルでの再確認は、Ollama を起動したときに行う。

## 5. 関連ドキュメント

- [[prj-0001:pjr-jwxk-grade-translation-code-tokens]]（印をコードで管理する翻訳の仕組み）
- [[prj-0001:pjr-27y0-grade-english-canonical-translation]]（英語正本と翻訳の仕組み）
