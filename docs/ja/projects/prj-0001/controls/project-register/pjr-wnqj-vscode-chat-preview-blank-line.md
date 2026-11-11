---
specdojo:
  id: prj-0001:pjr-wnqj-vscode-chat-preview-blank-line
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: sol-executor
  registered_at: "2026-11-11T14:51:47Z"
  commit_type: feat
  commit_scope: vscode
---

# PJR-WNQJ VS Code の Markdown のプレビューで chat の対話を表示し、発言の間に空行を置けるようにする

## 1. 概要

vscode-specdojo のプレビューに chat と chat tui の描き方を足し、発言の間の空行を区切りとして読み飛ばす。GitHub などテキストで読んでも見やすくする

## 2. 入力

- V5AZ の review で、VS Code では chat が対話の形で表示されないと利用者が気づいた。標準のプレビューは plugin なしでは描けないため、markdown-it の plugin を持つ拡張機能に足す（indie が 2026-11-11 に承認）
- GitHub では chat が描かれずテキストとして表示されるため、発言の間に 1 行空けても描画が崩れないようにしたい（indie の要望）

## 3. 完了条件

- `packages/vscode-specdojo` の Markdown のプレビューで、`chat` のコードブロックが吹き出し（利用者は右、相手側は左）で、`chat tui` が TUI 風（利用者は `>`、相手側は `●`、暗い背景、等幅）で表示される。話者の判定・続き行・インラインコードの扱いと見た目を、文書サイト（`packages/docs-site/src/chat.ts`）とそろえている。処理を共通にするか写すかは executor が決め、理由を個票の対応結果に書く。
- `chat` のブロックの中で発言の間に置いた空行を区切りとして扱い、吹き出しの中身に空の行を残さない。文書サイトと VS Code の両方で同じに振る舞う。字下げした続き行の間の空行の扱いも決めて書く。
- `.github/instructions/markdown.instructions.md` の「対話コードブロック（chat）」に、発言の間に 1 行空ける書き方を足している（GitHub などでテキストとして読んでも発言の境目が分かるため）。
- 既存の文書の `chat` のブロック（クイックスタートガイドなど）を、発言の間に 1 行空ける書き方にそろえている。発言の中身は変えない。
- 発言の間の空行・空行なし・続き行・`chat tui` を、文書サイトと拡張機能の両方のテストで確かめている。
- 拡張機能の README と、関連するガイドを直している。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。VS Code での見た目は利用者が確かめる（executor の作業ではない）。

## 4. 作業内容

| No  | 作業                                             | 担当     | 状態 | メモ |
| --- | ------------------------------------------------ | -------- | ---- | ---- |
| 1   | 拡張機能に chat の描き方を足し、空行の扱いを直す | executor | open | -    |
| 2   | 記述ルールと既存の chat のブロックを直す         | executor | open | -    |
| 3   | VS Code のプレビューで見た目を確かめる           | indie    | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-v5az-quick-start-conversation-flow]]
- [[prj-0001:pjr-gq14-use-case-product-conversation-flow]]
