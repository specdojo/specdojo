---
specdojo:
  id: prj-0001:pjr-wnqj-vscode-chat-preview-blank-line
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
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

| No  | 作業                                             | 担当     | 状態 | メモ                                            |
| --- | ------------------------------------------------ | -------- | ---- | ----------------------------------------------- |
| 1   | 拡張機能に chat の描き方を足し、空行の扱いを直す | executor | done | 描画処理・CSS・フェンス処理と共通テストを追加   |
| 2   | 記述ルールと既存の chat のブロックを直す         | executor | done | 記述ルール・ガイド・README と対話 11 か所を更新 |
| 3   | VS Code のプレビューで見た目を確かめる           | indie    | open | -                                               |

## 5. 対応結果

### 5.1. 実施内容と設計判断

- VS Code 拡張に `chat` / `chat tui` のフェンス描画処理と `media/chat.css` を追加し、`extension.ts` から接続した。拡張のマニフェストの `markdown.previewStyles` で CSS を読み込む。吹き出しの左右配置・余白・アイコン・TUI の配色を文書サイトにそろえ、吹き出しの色は VS Code のテーマ変数に対応させた。
- 描画処理は文書サイトの `chat.ts` を拡張の `src/chat.ts` に複製した。文書サイトは ESM、拡張は CommonJS かつ `rootDir` が拡張の `src/` に限定されるため、パッケージ間参照やビルド設定変更を避けて、それぞれ単独で配布できる構成を選んだ。共通のテストケースを両実装へ適用し、同じ入力の HTML と解析結果が一致する比較テストで乖離を検出する。
- 両実装とも空行を読み飛ばす。空白・タブだけの行や連続した空行、続き行の間の空行も本文に残さない。空行だけでは発言を終えず、空行後の字下げされた続き行は直前の発言に含める。テキストの可読性のための区切りを表示内容へ混ぜず、従来の続き行の解釈を保つためである。空行以外の改行・字下げ、話者判定、インラインコード、HTML のエスケープは維持した。
- Markdown 記述ルール、[[specdojo:docs-editing-guide|ドキュメント編集ガイド]]、拡張の README に記法と表示方法を追記した。[[specdojo:quick-start-guide|クイックスタートガイド]] の既存対話 11 か所は発言間に空行だけを追加し、本文を維持した。

### 5.2. 検証と申し送り

- 拡張のコンパイルと VSIX の作成に成功した。VSIX 内に描画モジュール・フェンス処理・マニフェストで指定した CSS・README が含まれることを確認した。パッケージ作成時に LICENSE 未同梱の警告が出るが、作成自体は成功した。
- コンパイル済みの `extendMarkdownIt` に最小限の VS Code API 代替を渡し、実際の markdown-it で吹き出し・TUI・空行あり／なし・CRLF・続き行・インラインコード・HTML のエスケープ・通常フェンスの維持を確認した。文書サイトとの出力一致、クイックスタートの本文が空行を除いて同一であることも確認した。
- カタログ検証と履歴リンク検証は成功した。カタログ検証には本変更の対象外の成果物欠落・再エクスポート参照などの警告がある。
- 単体テストには両実装の空行・空行なし・続き行・TUI と比較テストを追加した。型検査・各 lint・単体テスト・統合テスト・schema 検証は、pipeline の指定に従い親 runner の検証に委ねる。
- 利用者の確認: VSIX を再インストールして VS Code を再読み込みし、ドキュメント編集ガイドの例を `chat` と `chat tui` で表示して、左右配置・暗い TUI・改行・インラインコードを確認する。VS Code 実画面の確認は完了条件に従い indie が担当する。

### 5.3. CHANGELOG に書く事項

- 追加: SpecDojo VS Code 拡張の Markdown プレビューで、`chat` の吹き出し表示と `chat tui` の TUI 表示に対応。
- 変更: 文書サイトと VS Code の対話表示で、発言間や続き行の間の空行を読み飛ばすようにし、ガイドの対話を発言間に 1 行空ける記法に統一。

## 6. 関連ドキュメント

- [[prj-0001:pjr-v5az-quick-start-conversation-flow]]
- [[prj-0001:pjr-gq14-use-case-product-conversation-flow]]
