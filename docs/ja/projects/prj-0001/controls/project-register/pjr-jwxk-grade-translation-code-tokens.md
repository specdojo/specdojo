---
specdojo:
  id: prj-0001:pjr-jwxk-grade-translation-code-tokens
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-06T12:06:51Z"
  due_on: null
  completed_at: "2026-10-06T22:13:53Z"
  conclusion: 翻訳の印をコードで管理し、件数・仮名・インラインコードを件ごとに点検、不合格の件だけ1件ずつ訳し直すようにした。実モデルで13件すべて点検に通ることを確認した
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
  - 元の文と訳文のインラインコードの多重集合が一致し、欠落も追加もない。
- 点検に落ちた件は、どの件かを機械で読める形で出力する。`tools/grade/run-per-document.sh` は、落ちた件だけを 1 件ずつ翻訳の agent へ渡して訳し直し、同じ点検を通った件を採用する。訳し直しは 1 件につき 1 回までとし、それでも落ちた件は英語の正本を `message_ja` に使う。
- 翻訳の失敗や点検の結果は、viewpoint、level、severity、line、score、verdict、正本の `message` を変更しない。日本語の finding は従来どおり翻訳の対象外とする。
- unit test で、件数の不一致、仮名のない訳文、インラインコードの欠落、2 件の入れ替え（インラインコードで検出できる場合）、一部の件だけの不合格と採用、訳し直しの成功と英語への戻しを検証する。pipeline fixture で、点検に落ちた件だけが 1 件ずつ訳し直されることを検証する。
- routine 運用ガイド、コマンドリファレンス、Ollama の設計書（tsd-ollama）など、token 付きの配列を前提に書いた記述を新しい方式に合わせる。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                                                        | 担当         | 状態 | メモ                                        |
| --- | --------------------------------------------------------------------------- | ------------ | ---- | ------------------------------------------- |
| 1   | 翻訳の入出力から token を外し、件ごとの点検を実装する                       | DEV          | done | `grade translation-plan` / `grade localize` |
| 2   | 点検に落ちた件だけの 1 件ずつの訳し直しを script に加える                   | DEV          | done | 訳し直しは 1 件につき 1 回まで              |
| 3   | unit test・pipeline fixture・文書を更新する                                 | DEV          | done | 件別採否、単件再試行、英語 fallback を検証  |
| 4   | 統合後、`pm-risk-register-rulebook.md` の翻訳を実モデルでやり直して確かめる | orchestrator | done | 13件すべて点検に通過（d38c252a9）           |

## 4. 対応結果

- `grade translation-plan` の入力を token のない英語文の配列へ変更し、同数・同順の訳文とインラインコードの保持を指示するようにした。
- `grade localize` は件数不一致を全件不合格とし、件数一致時は空文字、仮名、インラインコードを項目ごとに検証する。後続の [[prj-0001:pjr-wafc-grade-translation-no-added-code]] でインラインコードの検証を完全一致へ強化し、元にない追加も不合格にした。合格項目だけを採用し、不合格の `translation_index`、finding ID、理由を JSON へ出力する。
- `tools/grade/run-per-document.sh` は不合格 index だけを1件ずつ翻訳 agent へ再送し、各1回の再試行後も不合格なら英語正本を `message_ja` に残す。
- unit test と pipeline fixture へ、件数不一致、仮名・インラインコードの欠落、入れ替え、部分採用、単件再試行の成功・失敗を追加した。運用ガイド、コマンドリファレンス、メタデータ標準、Ollama 設計書、関連する比較記録を新方式へ同期した。
- 残課題は、orchestrator が実モデルで `pm-risk-register-rulebook.md` の表示翻訳を再確認する作業（No. 4）のみであり、実装上の残課題はない。
- 実モデルでの確認（orchestrator、2026-10-06）: `pm-risk-register-rulebook.md` を codex（判定）と gemma26-reporter（翻訳）で流し直し、英語の finding 13 件がすべて1回目の翻訳で点検に通った（28 秒）。旧形式の日本語の finding 4 件は翻訳されず原文のまま残った（d38c252a9）。ただし訳文の大半で、英語の語句がバッククォートで囲まれて訳されずに残ったため、[[prj-0001:pjr-wafc-grade-translation-no-added-code]] で扱った。

## 5. 関連ドキュメント

- [[prj-0001:pjr-27y0-grade-english-canonical-translation]]（英語正本と翻訳の仕組み）
- [[prj-0001:pjr-vqb5-agent-grade-comparison]]（agent の比較の記録）
