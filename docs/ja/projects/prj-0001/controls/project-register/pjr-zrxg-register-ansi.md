---
specdojo:
  id: prj-0001:pjr-zrxg-register-ansi
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-ZRXG register系失敗理由の文字列にANSIエスケープコードが混入し登録簿が破損する

## 1. 概要

`exec run --register PJR-NWPC PJR-PP0D PJR-4AHZ --worktree`実行時、PJR-PP0Dのcheckpoint commitがpre-commit hook（markdownlint）失敗で異常終了し、その際の生のsubprocess出力（lefthookの色付きボックスUIによるANSIエスケープコード込み）が`pjr-index.md`の「結論」列にそのまま書き込まれ表示が破損した。`sanitizeRegisterConclusion`（`src/exec-register.ts`）が改行と`|`のみ除去し、ANSIエスケープコードを除去していないことが原因である。

## 2. 完了条件

- `sanitizeRegisterConclusion`がANSIエスケープコード（ターミナル制御文字）を除去し、除去後も改行・`|`除去・長さ制限の既存動作を維持する。
- `src/exec-worktree-ops.ts`のcheckpoint commit失敗メッセージ構築（`committed.stdout`/`committed.stderr`の生連結）を含め、subprocessの生出力がユーザー向け文字列（register結論・resultのblocked理由等）に使われる他の箇所を洗い出し、同様にサニタイズされている。
- 色付き出力を返すコマンド（lefthook等）が失敗した場合でも、`pjr-index.md`・result個票の該当欄が正常なMarkdownとして表示されることを自動テストで確認できる。
- 既存のサニタイズ動作（改行→スペース、`|`→`/`、200文字制限）を検証する既存テストが引き続き成功する。

## 3. 作業内容

| No  | 作業                                                                     | 担当 | 状態 | メモ                                            |
| --- | ------------------------------------------------------------------------ | ---- | ---- | ----------------------------------------------- |
| 1   | `sanitizeRegisterConclusion`にANSIエスケープコード除去を追加する         | ARC  | open | `src/exec-register.ts`                          |
| 2   | `exec-worktree-ops.ts`の失敗メッセージ構築箇所を洗い出し、同様に対応する | ARC  | open | checkpoint/commit/merge失敗の各エラーメッセージ |
| 3   | 自動テストを追加する                                                     | ARC  | open | ANSIエスケープコード入り出力を模した再現ケース  |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-pp0d-exec-plan-todo-markdown|exec plan生成時にアンダースコア識別子や`_TODO_`がMarkdown強調記号として誤解釈され破損する]]
