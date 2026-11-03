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

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
