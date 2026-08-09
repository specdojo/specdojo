---
specdojo:
  id: prj-0001:pjr-zrxg-register-ansi
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_on: "2026-08-08"
  due_on: "2026-08-31"
  completed_on: "2026-08-08"
  conclusion: stripTerminalControlSequences(src/exec-shared.ts)を追加し、sanitizeRegisterConclusion・checkpoint失敗メッセージ・block_reason書き出しの3箇所でANSIエスケープコード等を除去。実装レビューで正規表現に生の制御バイトが直接埋め込まれgitがバイナリ扱いする不備を発見し、\\uXXXXエスケープ表記へ修正済み。
---

# PJR-ZRXG register系失敗理由の文字列にANSIエスケープコードが混入し登録簿が破損する

## 1. 概要

sanitizeRegisterConclusion（src/exec-register.ts）は改行とパイプ文字のみ除去し長さを制限するが、ANSIエスケープコード（ターミナル制御文字）は除去しない。checkpoint commit失敗時（src/exec-worktree-ops.ts）はcommitted.stdout/stderrを生のまま連結してエラーメッセージにするため、lefthook等が色付き出力を返す失敗ではANSIエスケープコードがそのままpjr-index.mdの結論列やresultのblocked理由に書き込まれ表示が壊れる（PJR-PP0Dのcheckpoint失敗で実際に発生）。sanitizeRegisterConclusionにANSIエスケープコード除去を追加し、同様に生のsubprocess出力をユーザ向け文字列として扱う他の箇所（exec-worktree-opsのチェックポイント/commit/merge失敗メッセージ等）も洗い出して対応する。

`exec run --register PJR-NWPC PJR-PP0D PJR-4AHZ --worktree`実行時、PJR-PP0Dのcheckpoint commitがpre-commit hook（markdownlint）失敗で異常終了し、その際の生のsubprocess出力（lefthookの色付きボックスUIによるANSIエスケープコード込み）が`pjr-index.md`の「結論」列にそのまま書き込まれ表示が破損した。`sanitizeRegisterConclusion`（`src/exec-register.ts`）が改行と`|`のみ除去し、ANSIエスケープコードを除去していないことが原因である。

## 2. 完了条件

- `sanitizeRegisterConclusion`がANSIエスケープコード（ターミナル制御文字）を除去し、除去後も改行・`|`除去・長さ制限の既存動作を維持する。
- `src/exec-worktree-ops.ts`のcheckpoint commit失敗メッセージ構築（`committed.stdout`/`committed.stderr`の生連結）を含め、subprocessの生出力がユーザー向け文字列（register結論・resultのblocked理由等）に使われる他の箇所を洗い出し、同様にサニタイズされている。
- 色付き出力を返すコマンド（lefthook等）が失敗した場合でも、`pjr-index.md`・result個票の該当欄が正常なMarkdownとして表示されることを自動テストで確認できる。
- 既存のサニタイズ動作（改行→スペース、`|`→`/`、200文字制限）を検証する既存テストが引き続き成功する。

## 3. 作業内容

| No  | 作業                                                                     | 担当 | 状態 | メモ                                                         |
| --- | ------------------------------------------------------------------------ | ---- | ---- | ------------------------------------------------------------ |
| 1   | `sanitizeRegisterConclusion`にANSIエスケープコード除去を追加する         | ARC  | done | 共通関数`stripTerminalControlSequences`を新設して利用        |
| 2   | `exec-worktree-ops.ts`の失敗メッセージ構築箇所を洗い出し、同様に対応する | ARC  | done | checkpoint失敗の生出力連結＋result blocked理由の choke point |
| 3   | 自動テストを追加する                                                     | ARC  | done | ANSI/OSC/制御文字入り出力を模した再現ケースを追加            |

## 4. 対応結果

- 原因は`sanitizeRegisterConclusion`（`src/exec-register.ts`）が改行と`|`のみ除去し、ANSIエスケープコードを除去していなかったこと。加えて`src/exec-worktree-ops.ts`のcheckpoint commit失敗メッセージが`committed.stdout`/`committed.stderr`を生連結しており、色付きhook出力（lefthook等）の制御文字がそのまま失敗理由へ伝播していた。
- 共通ユーティリティ`stripTerminalControlSequences`を`src/exec-shared.ts`に新設した。ansi-regex相当のパターンでANSIエスケープシーケンス（`ESC(0x1B)`/`CSI(0x9B)`始まり）を除去し、続けてタブ(0x09)・改行(0x0A)・復帰(0x0D)を除くC0/C1制御文字（0x00-0x08 / 0x0B / 0x0C / 0x0E-0x1F / 0x7F-0x9F）を除去する。改行類は保持し、1行化は呼び出し側に委ねる。
- 適用箇所は次の3つ。いずれもsubprocessの生出力がユーザー向け文字列（登録簿の結論列・resultのblocked理由）へ流入する経路である。
  - `sanitizeRegisterConclusion`（`src/exec-register.ts`）: 既存の改行→スペース・`|`→`/`・200文字制限の前段でANSI/制御文字を除去。register結論列を守る。
  - checkpoint commit失敗メッセージ（`src/exec-worktree-ops.ts`）: `committed.stdout`/`committed.stderr`を連結する前に各要素をサニタイズ。非register呼び出し元も保護する。
  - `serializeFrontmatter`のblock_reason書き出し（`src/exec-results.ts`）: block_reasonの唯一の書き込み箇所でサニタイズ。register経路だけでなく`extractBlockReason(stderr)`由来のschedule系タスクのresultも守る（choke pointでの防御）。
- テストは`tests/src/exec-shared.test.ts`に`stripTerminalControlSequences`のケース（SGRカラー・lefthook風ボックス・OSC終端BEL・その他C0/C1・タブ/改行保持・無害文字列）を追加。`tests/src/exec-register.test.ts`に`sanitizeRegisterConclusion`のANSI除去ケースと、ANSI除去後も改行→スペース・`|`→`/`が働くケースを追加。既存のサニタイズ検証テスト（改行・`|`・200文字制限）は据え置きで全て成功。
- 検証: `npm run typecheck` / `npm run lint:ts` / `npm run build` エラーなし。`npx vitest run` 全896テスト成功。
- ソースへ生の制御文字を混入させないため、テストのANSI/BEL構築は`String.fromCharCode(0x1b)` / `String.fromCharCode(0x07)`で行っている。

## 5. 関連ドキュメント

- [[prj-0001:pjr-pp0d-exec-plan-todo-markdown|exec plan生成時にアンダースコア識別子や`_TODO_`がMarkdown強調記号として誤解釈され破損する]]
