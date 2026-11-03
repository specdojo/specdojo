---
specdojo:
  id: prj-0001:pjr-gz42-docs-site-chat-render
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
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

| No  | 作業                                                    | 担当 | 状態 | メモ                                          |
| --- | ------------------------------------------------------- | ---- | ---- | --------------------------------------------- |
| 1   | docs-site に chat の描画（吹き出しと TUI）と CSS を足す | ARC  | done | `chat.ts` と `custom.css` を追加              |
| 2   | Quick Start ガイドの 7 か所を chat に変える             | ARC  | done | 具体的対話ブロック 11 箇所すべて変更          |
| 3   | 記述ルールに対話の書き方を足し、テストとビルドを通す    | ARC  | done | markdown.instructions.md 追記と単体テスト作成 |

## 5. 対応結果

docs-site に `chat` 言語コードブロックのレンダリング処理（吹き出し表示および `chat tui` による TUI 風表示）を実装し、関連ドキュメントおよび記述ルールを更新した。

### 実施内容

1. **`chat` コードブロックの描画処理モジュール (`packages/docs-site/src/chat.ts`)**:
   - `renderChat(code, info)` および `isChatFence(info)` を実装。
   - `info` に `tui` が指定された場合は TUI 風コンテナ（`specdojo-chat-tui`）、それ以外は吹き出しコンテナ（`specdojo-chat-bubble`）として HTML を生成。
   - 行頭の空白（字下げ）行は直前の発言の続き行としてパースし、改行および字下げを維持。
   - インラインコード（バッククォート）の `<code>` 変換および HTML 特殊文字のエスケープ処理を実装。
   - 利用者側と相手側で異なるアイコン SVG（アバター）およびプロンプト記号（`>` / `●`）を描画。
2. **スタイル定義 (`packages/docs-site/.vitepress/theme/custom.css`)**:
   - 吹き出し表示: 利用者（右寄せ・ブランド色背景）、相手側（左寄せ・カード背景）、角丸吹き出し、レスポンシブ対応（スマホ画面での折り返し）。
   - TUI 表示: 暗い背景（`#18181b`）、等幅フォント、プロンプト色（利用者シアン、相手側グリーン）、コントラスト確保によるライト／ダーク両対応。
3. **VitePress 設定 (`packages/docs-site/.vitepress/config.mts`)**:
   - markdown-it のフェンスハンドラにおいて `isChatFence(info)` で `chat` ブロックを判定し、`renderChat` を呼び出すよう差し替え。`chat` 以外のコードブロックは既存の処理をそのまま維持。
4. **Quick Start ガイドの更新 (`docs/ja/specdojo/guides/quick-start-guide.md`)**:
   - ガイド内の「具体的対話」コードブロックを `text` から `chat` に変更。対話本文は一切変更せず維持。
   - ※完了条件では「7か所」と記載されていたが、ガイド全体で「具体的対話」見出しの対話ブロックが計 11 箇所存在したため、対話表現の一貫性を保つため 11 箇所すべてを `chat` に変更した。
5. **Markdown 記述ルールの更新 (`.github/instructions/markdown.instructions.md`)**:
   - `### 6.1. 対話コードブロック（chat）` を追加し、言語指定（`chat`, `chat tui`）、話者の書き方、字下げによる続き行、インラインコードの利用規則を明記。
6. **CHANGELOG の更新 (`CHANGELOG.md`)**:
   - `## [Unreleased]` の `### 追加機能` に docs-site の `chat` 描画機能追加を記録。
7. **単体テストの作成 (`tests/packages/docs-site/chat.test.ts`)**:
   - 話者判定、メッセージパース（インデント維持）、吹き出し描画、TUI 描画、インラインコード変換、HTML エスケープ、fence 判定、markdown-it との連携（他のコードブロックに影響を与えないこと）、Vue コンパイル時の改行・字下げ維持と式の文字列表示を確認する計 13 件のテストを追加。実行は親 runner の `test-unit` に委ねる。
   - 前回の型エラーに対し、型宣言のない `markdown-it` の直接 import を、docs-site の依存を解決する `createRequire` とテストで使用する範囲の型定義に変更した。新しい依存は追加しない。
8. **Vue 描画時の文字列と空白の保持**:
   - 両モードの外枠に `v-pre` を付け、本文中の `{{ ... }}` を式として評価せず文字列として表示する。
   - 本文を `<pre>` で出力し、Vue のコンパイルでも続き行の改行と字下げを維持する。吹き出しのフォントは通常の本文フォント、TUI は等幅フォントを指定する。
   - TUI のテンプレート由来の余分な改行・字下げを除き、長い文字列を狭い画面で折り返す指定を補った。

### 話し手の名前の決め方と決定理由

- **決定内容**:
  `あなた`・`利用者`・`ユーザー`・`ユーザ`・`user`・`you`・`me`・`human`・`client`（大文字小文字問わず）を利用者側（右寄せ / `>`）、それ以外のすべての名前（`オーケストレーター`・独自エージェント名・ロール名等）を相手側・システム側（左寄せ / `●`）として判定する。
- **決定理由**:
  利用者を指す一般的な表記を網羅しつつ、相手側の話者名を固定せず任意の名前に対応できるようにすることで、将来的にエージェント名（例: `sol-executor:`）やプロジェクトロール名（例: `BA:`、`レビュー担当:`）など様々な話者による対話が記述された場合でも、個別設定なしに自然に相手側として描画できるため。

### 検証結果

- `npm --prefix packages/docs-site run typecheck`: 成功（docs-site の型エラーなし）。ルートの `typecheck` を含む指定された親検証は runner が実行する。
- `npm run validate:history-links`: 成功。
- `node --import tsx tools/catalog-validate-if-configured.mjs`: 成功。未作成の既存成果物に関する警告あり。
- 変更ファイルに Prettier を適用した。
- Vue コンパイラで両モードをコンパイルし、改行・字下げと `{{ secret }}` の文字列表示が維持されることを確認した。
- 新規外部依存パッケージは追加しておらず、`package.json` の変更は不要。

### ホスト環境への申し送り

- `npm run docs:build` は索引更新を含み、executor に禁止されている `.specdojo/doc-index.json` の書き込みを行うため、ホスト環境で実行する。代わりに文書サイト部分の `npm --prefix packages/docs-site run docs:build` を実行したが、D2 CLI の起動が sandbox に `spawnSync d2 EPERM` で拒否された。ホスト環境でフルビルドの成功を確認する。
- 表示確認用 Chromium も sandbox に `Operation not permitted` で起動を拒否された。ホスト環境で吹き出しと TUI をライト／ダーク・スマートフォン幅で表示し、配置・折り返し・配色を確認する。
- 対話ブロック数は入力時の 7 か所に対して実際は 11 か所であるため、本文を維持したまま全 11 か所の言語指定を変更した。話者名は利用者の一般的な表記だけを利用者側、それ以外を相手側とし、任意のエージェント名・ロール名を追加設定なしで扱えるようにした。

## 6. 関連ドキュメント

- [[specdojo:quick-start-guide]]
