---
specdojo:
  id: prj-0001:pjr-nwpc-register-where-stderr
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-NWPC register whereのエラー出力をstderrへ分離する

## 1. 概要

[[prj-0001:pjr-0163-register-add-id-fetch]] の申し送りで判明した事項。`register where` はエラー時に `printCommandError` の慣例に従いメッセージを stdout へ書くため、`register:sync-pull` / `register:sync-push` npm script が `git -C "$(specdojo register where --integration)"` のようにコマンド置換で呼び出すと、統合ブランチworktree未用意時にエラー文字列がそのまま `-C` のパス引数として渡り、gitの「cannot change to directory」という分かりにくい二重エラーになる。gitがpath不正で失敗するため実害（サイレント誤動作）はないが、エラーメッセージの分かりにくさを解消する。

## 2. 完了条件

- `register where` のエラー出力がstderrへ書かれ、成功時のパス出力（stdout）と分離されている。
- 統合ブランチworktree未用意時に `register:sync-pull` / `register:sync-push` を実行すると、gitの二重エラーではなく `register where` 自身の分かりやすいエラーメッセージが表示される。
- 既存の `register where` の呼び出し元・テストが新しい出力先を前提に更新されている。
- 他の `register` サブコマンドの `printCommandError` 慣例（stdout出力）には影響を与えない（`register where` のみの変更であることが明記されている）。

## 3. 作業内容

| No  | 作業                                                                                            | 担当 | 状態 | メモ                                                         |
| --- | ----------------------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------ |
| 1   | `register where` のエラー出力をstderrへ変更する                                                 | ARC  | open | `printCommandError` を流用せず専用のエラー処理にするか要検討 |
| 2   | npm script（`register:sync-pull` / `register:sync-push`）の挙動を統合worktree未用意時に確認する | ARC  | open | 手動確認または自動テストで再現・確認                         |
| 3   | テストを追加し、コマンドリファレンスに変更点を反映する                                          | ARC  | open | -                                                            |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-0163-register-add-id-fetch|register addのID採番方式見直しと統合ブランチ予約のfetch同期]]
- [[specdojo:command-reference|SpecDojoコマンドリファレンス]]
