---
specdojo:
  id: prj-0001:pjr-nwpc-register-where-stderr
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: low
  owner: ARC
  due_on: "2026-08-31"
  completed_at: "2026-08-08T12:00:00Z"
  register_events:
    - v: 1
      id: reg_fb96e223004dfb9f8ebf5134668049c2
      ts: "2026-08-08T02:54:45Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "chore(register): PJR-NWPCを起票（register whereのエラー出力をstderrへ分離する）"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: register whereのエラー出力をstderrへ分離する
        - field: description
          from: ""
          to: '[[prj-0001:pjr-0163-register-add-id-fetch]] の申し送りで判明した事項。`register where` はエラー時に `printCommandError` の慣例に従いメッセージを stdout へ書くため、`register:sync-pull` / `register:sync-push` npm script が `git -C "$(specdojo register where --integration)"` のようにコマンド置換で呼び出すと、統合ブランチworktree未用意時にエラー文字列がそのまま `-C` のパス引数として渡り、gitの「cannot change to directory」という分かりにくい二重エラーになる。gitがpath不正で失敗するため実害（サイレント誤動作）はないが、エラーメッセージの分かりにくさを解消する。'
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: _TODO_
        - field: registered
          from: ""
          to: _TODO_
        - field: due
          from: ""
          to: _TODO_
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: 897a8bc781e5f48a0949129d54df0c2f76d6a864
    - v: 1
      id: reg_40591a2a785ded8b57f456aa94201921
      ts: "2026-08-09T10:55:22Z"
      action: close
      actor: SpecDojo Test
      from_status: open
      to_status: done
      reason: "exec(register PJR-9P5Q): 既存登録項目を個票 frontmatter へ一括移行する"
      changes:
        - field: status
          from: open
          to: done
        - field: description
          from: '[[prj-0001:pjr-0163-register-add-id-fetch]] の申し送りで判明した事項。`register where` はエラー時に `printCommandError` の慣例に従いメッセージを stdout へ書くため、`register:sync-pull` / `register:sync-push` npm script が `git -C "$(specdojo register where --integration)"` のようにコマンド置換で呼び出すと、統合ブランチworktree未用意時にエラー文字列がそのまま `-C` のパス引数として渡り、gitの「cannot change to directory」という分かりにくい二重エラーになる。gitがpath不正で失敗するため実害（サイレント誤動作）はないが、エラーメッセージの分かりにくさを解消する。'
          to: register whereはエラー時にprintCommandError慣例でstdoutへメッセージを書くため、npm script(register:sync-pull/register:sync-push)経由で統合ブランチworktree未用意時にgit -Cへ誤ったパス文字列として渡り、分かりにくい二重エラーになる（gitがpath不正で失敗するため実害はないがUXが悪い）。register whereのエラー出力のみstderrへ分離する。
        - field: priority
          from: medium
          to: low
        - field: owner
          from: _TODO_
          to: ARC
        - field: due
          from: _TODO_
          to: "2026-08-31"
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
      previous_event_id: reg_fb96e223004dfb9f8ebf5134668049c2
    - v: 1
      id: reg_48b7da3561f825c529bdf270b70611f2
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: completed
          from: "-"
          to: "2026-08-08"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_40591a2a785ded8b57f456aa94201921
---

# PJR-NWPC register whereのエラー出力をstderrへ分離する

## 1. 概要

register whereはエラー時にprintCommandError慣例でstdoutへメッセージを書くため、npm script(register:sync-pull/register:sync-push)経由で統合ブランチworktree未用意時にgit -Cへ誤ったパス文字列として渡り、分かりにくい二重エラーになる（gitがpath不正で失敗するため実害はないがUXが悪い）。register whereのエラー出力のみstderrへ分離する。

[[prj-0001:pjr-0163-register-add-id-fetch]] の申し送りで判明した事項。`register where` はエラー時に `printCommandError` の慣例に従いメッセージを stdout へ書くため、`register:sync-pull` / `register:sync-push` npm script が `git -C "$(specdojo register where --integration)"` のようにコマンド置換で呼び出すと、統合ブランチworktree未用意時にエラー文字列がそのまま `-C` のパス引数として渡り、gitの「cannot change to directory」という分かりにくい二重エラーになる。gitがpath不正で失敗するため実害（サイレント誤動作）はないが、エラーメッセージの分かりにくさを解消する。

## 2. 完了条件

- `register where` のエラー出力がstderrへ書かれ、成功時のパス出力（stdout）と分離されている。
- 統合ブランチworktree未用意時に `register:sync-pull` / `register:sync-push` を実行すると、gitの二重エラーではなく `register where` 自身の分かりやすいエラーメッセージが表示される。
- 既存の `register where` の呼び出し元・テストが新しい出力先を前提に更新されている。
- 他の `register` サブコマンドの `printCommandError` 慣例（stdout出力）には影響を与えない（`register where` のみの変更であることが明記されている）。

## 3. 作業内容

| No  | 作業                                                                                            | 担当 | 状態 | メモ                                                           |
| --- | ----------------------------------------------------------------------------------------------- | ---- | ---- | -------------------------------------------------------------- |
| 1   | `register where` のエラー出力をstderrへ変更する                                                 | ARC  | done | `printCommandError` を流用せず専用の `printWhereError` を新設  |
| 2   | npm script（`register:sync-pull` / `register:sync-push`）の挙動を統合worktree未用意時に確認する | ARC  | done | `printWhereError` の stdout 非汚染を単体テストで検証           |
| 3   | テストを追加し、コマンドリファレンスに変更点を反映する                                          | ARC  | done | `register-reserve.test.ts` に追加、command-reference.md へ追記 |

## 4. 対応結果

- `src/register.ts` に `printWhereError` を新設し、`register where` の `catch` を `printCommandError` から `printWhereError` に切り替えた。エラーメッセージを `process.stderr` へ書くことで、成功時のパス出力（stdout）と分離した。
- 他の `register` サブコマンドは従来どおり `printCommandError`（stdout 出力）のままで、`register where` のみの変更に限定した。
- `tests/src/register-reserve.test.ts` に `printWhereError` の単体テストを追加し、エラーが stderr へ書かれ stdout を汚さないこと、`process.exitCode` が 1 になることを検証した。
- `docs/ja/specdojo/references/command-reference.md` に `register where` のエラー出力を stderr へ分離する旨を追記した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-0163-register-add-id-fetch|register addのID採番方式見直しと統合ブランチ予約のfetch同期]]
- [[specdojo:command-reference|SpecDojoコマンドリファレンス]]
