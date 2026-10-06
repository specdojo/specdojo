---
specdojo:
  id: prj-0001:pjr-jwxk-grade-translation-code-tokens
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: DEV
  registered_at: "2026-10-06T12:06:51Z"
  due_on: null
---

# PJR-JWXK grade の翻訳でモデルに印を書かせず、各件をコードで点検する

## 1. 概要

[[prj-0001:pjr-27y0-grade-english-canonical-translation]] の finding の翻訳は、token 付きの文字列配列をモデルに渡し、token の書き写しで順序を検証している。2026-10-06 に `pm-risk-register-rulebook.md` を codex（判定）と gemma26（翻訳）で実際に流したところ、gemma26 は 13 件すべてを自然な日本語に訳したが、10 件目の token を `[T010]` ではなく `[T10]` と書いたため、翻訳全体が捨てられ表示が英語のままになった。

token はコードの側で管理し、モデルには英語の文だけの配列を渡して訳文だけの配列を受け取る。対応づけは件数と、件ごとの内容の点検で確かめる。点検に落ちた件だけを 1 件ずつ訳し直し、それでも落ちた件は英語の正本を表示に使う。

## 2. 完了条件

- `grade translation-plan` がモデルに渡す配列は、英語の finding の文だけで、token を含まない。plan の指示は、同じ件数・同じ順序の訳文だけの JSON 文字列配列を返すこと、インラインコード（バッククォートで囲んだ部分）を一字一句変えずに残すことを求める。
- `grade localize` は、訳文の配列の件数が翻訳の対象の件数と一致しない場合、全件を不合格とする。件数が一致する場合は件ごとに次を点検し、すべて満たす件だけ `message_ja` に採用する。
  - 空でない文字列である。
  - 平仮名または片仮名を含む。
  - 元の文のインラインコードが、訳文にすべてそのまま含まれる。
- 点検に落ちた件は、どの件かを機械で読める形で出力する。`tools/grade/run-per-document.sh` は、落ちた件だけを 1 件ずつ翻訳の agent へ渡して訳し直し、同じ点検を通った件を採用する。訳し直しは 1 件につき 1 回までとし、それでも落ちた件は英語の正本を `message_ja` に使う。
- 翻訳の失敗や点検の結果は、viewpoint、level、severity、line、score、verdict、正本の `message` を変更しない。日本語の finding は従来どおり翻訳の対象外とする。
- unit test で、件数の不一致、仮名のない訳文、インラインコードの欠落、2 件の入れ替え（インラインコードで検出できる場合）、一部の件だけの不合格と採用、訳し直しの成功と英語への戻しを検証する。pipeline fixture で、点検に落ちた件だけが 1 件ずつ訳し直されることを検証する。
- routine 運用ガイド、コマンドリファレンス、Ollama の設計書（tsd-ollama）など、token 付きの配列を前提に書いた記述を新しい方式に合わせる。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                                                        | 担当         | 状態 | メモ                                        |
| --- | --------------------------------------------------------------------------- | ------------ | ---- | ------------------------------------------- |
| 1   | 翻訳の入出力から token を外し、件ごとの点検を実装する                       | DEV          | open | `grade translation-plan` / `grade localize` |
| 2   | 点検に落ちた件だけの 1 件ずつの訳し直しを script に加える                   | DEV          | open | 訳し直しは 1 件につき 1 回まで              |
| 3   | unit test・pipeline fixture・文書を更新する                                 | DEV          | open | -                                           |
| 4   | 統合後、`pm-risk-register-rulebook.md` の翻訳を実モデルでやり直して確かめる | orchestrator | open | 判定はやり直さない                          |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-27y0-grade-english-canonical-translation]]（英語正本と翻訳の仕組み）
- [[prj-0001:pjr-vqb5-agent-grade-comparison]]（agent の比較の記録）
