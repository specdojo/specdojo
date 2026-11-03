---
specdojo:
  id: prj-0001:pjr-gz42-docs-site-chat-render
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-03T23:08:13Z"
  due_on: "2026-11-30"
  commit_type: feat
  commit_scope: docs-site
---

# PJR-GZ42 文書サイトで対話を吹き出しと TUI の見た目で表示する

## 1. 概要

docs-site に chat 言語のコードブロックを吹き出し（右に利用者、左にオーケストレーター）と TUI 風の見た目で描画する処理を足し、Quick Start ガイドの対話 7 か所を chat に変える

## 2. 入力

- Quick Start ガイドの対話は 7 か所の text のコードブロックで、行頭の「あなた:」「オーケストレーター:」と字下げの続き行で書かれ、対話に見えない（2026-11-04）
- 利用者の判断: 案 A（コードブロックの言語を chat に変え、中身は今の書き方のまま、文書サイトで吹き出しに描画する。GitHub などでは今と同じコードブロックとして読める）を採り、同じ処理で chat tui の TUI 風の見た目（利用者は > の入力行、オーケストレーターは ● で始まる出力、暗い背景）も選べるようにする（2026-11-04）
- docs-site の .vitepress/config.mts の markdown.config には、mermaid のコードブロックを HTML 生成時に差し替える処理があり、同じ仕組みで足せる（2026-11-04）

## 3. 完了条件

- docs-site が、言語 `chat` のコードブロックを吹き出しで描画する。`あなた:` で始まる発言は右、`オーケストレーター:` で始まる発言は左に、話し手の名前（とアイコン）を添えて表示する。話し手の頭の行に続く字下げの行（箇条書きを含む）は同じ吹き出しに入れ、改行と字下げを保つ。インラインのコード（バッククォート）は書式として表示する
- 言語 `chat tui`（またはそれに相当する指定）で、TUI 風の見た目（利用者の発言は `>` の付いた入力行、オーケストレーターの発言は `●` で始まる出力、暗い背景、等幅の文字）で描画できる。話し手の名前の決め方（`あなた:`・`オーケストレーター:` 以外の名前を許すか）は executor が決め、理由を個票の対応結果に記録する
- 吹き出しと TUI の両方が、ライトとダークの表示で読める。狭い画面（スマートフォンの幅）でも崩れない
- Markdown の元は変えずに HTML 生成時だけ差し替える。`chat` 以外のコードブロックの表示は変えない
- [[specdojo:quick-start-guide]] の対話のコードブロック 7 か所を `chat` に変える。対話の中身は変えない
- 対話の書き方（`chat` の言語、話し手の頭の書き方、続き行の字下げ、TUI の指定）を、Markdown の記述ルール（`.github/instructions/markdown.instructions.md`）に足す。このファイルを executor が変えられない場合は、足す文案を個票の対応結果と報告の handoff に書き、反映は利用者の承認のもとで行う
- 描画の単体テスト（吹き出し、TUI、続き行、話し手の判定、`chat` 以外は変えないこと）を足し、`npm run docs:build` が通る。docs-site の CHANGELOG（ルートの CHANGELOG.md の Unreleased）に書く
- 保護された設定（`.specdojo/**`・`package.json` など）は変えない。docs-site に新しい依存が要る場合は、案を個票の対応結果と報告の handoff に書く
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run test:unit` を流し、親の検証が通る。未決の点は executor が決め、理由を個票の対応結果に記録する

## 4. 作業内容

| No  | 作業                                                    | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------- | ---- | ---- | ---- |
| 1   | docs-site に chat の描画（吹き出しと TUI）と CSS を足す | ARC  | open | -    |
| 2   | Quick Start ガイドの 7 か所を chat に変える             | ARC  | open | -    |
| 3   | 記述ルールに対話の書き方を足し、テストとビルドを通す    | ARC  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:quick-start-guide]]
