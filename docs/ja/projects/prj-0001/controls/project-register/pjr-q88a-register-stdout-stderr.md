---
specdojo:
  id: prj-0001:pjr-q88a-register-stdout-stderr
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-08T09:57:44Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-08T12:00:00Z"
  conclusion: printCommandErrorをstderr出力へ変更し、printWhereErrorと統合(削除)。register系全サブコマンドのエラー出力がstderrに統一された。内部呼び出し元はstdio inherit+終了コード判定のため影響なし。command-referenceへ反映。
  register_events:
    - v: 1
      id: reg_57f1ce004c2c46ec1cf6e303e27d1d76
      ts: "2026-08-08T09:57:44Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "chore(register): PJR-Q88Aを起票（register系コマンド全体のエラー出力をstdoutからstderrへ統一する）"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: register系コマンド全体のエラー出力をstdoutからstderrへ統一する
        - field: description
          from: ""
          to: "[[prj-0001:pjr-nwpc-register-where-stderr]]では`register where`のみエラー出力をstderrへ分離したが、`add`/`start`/`wait`/`review`/`close`/`reject`/`defer`/`reopen`/`update`/`renumber`等の他サブコマンドは`printCommandError`慣例のままstdoutへエラーを出している。内部呼び出し元（`spawnSelf`/`spawnRegisterTransition`等）は`stdio: inherit`＋終了コードのみで成否判定しており、stdout内容を解析する箇所は無いため、stderrへの変更は安全である。Unix/CLIの一般的な慣習（正常出力はstdout、エラーはstderr）に揃える。"
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
      legacy_commit: 51de0ed486628bb6c179eeb0f10a4a633b751bb7
    - v: 1
      id: reg_6e3457486df8f44d34bfefa057efd922
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
          from: "[[prj-0001:pjr-nwpc-register-where-stderr]]では`register where`のみエラー出力をstderrへ分離したが、`add`/`start`/`wait`/`review`/`close`/`reject`/`defer`/`reopen`/`update`/`renumber`等の他サブコマンドは`printCommandError`慣例のままstdoutへエラーを出している。内部呼び出し元（`spawnSelf`/`spawnRegisterTransition`等）は`stdio: inherit`＋終了コードのみで成否判定しており、stdout内容を解析する箇所は無いため、stderrへの変更は安全である。Unix/CLIの一般的な慣習（正常出力はstdout、エラーはstderr）に揃える。"
          to: registerサブコマンド(add/start/wait/review/close/reject/defer/reopen/update/renumber等)はほぼ全てprintCommandError慣例でエラーをstdoutへ出す。PJR-NWPCでregister whereのみstderrへ分離したが、他のサブコマンドはstdoutのまま残っている。内部呼び出し元(spawnSelf/spawnRegisterTransition等)はstdio inherit+終了コードのみで成否判定しておりstdout内容を解析していないため、stderrへ変更しても既存の内部呼び出しへの影響はない。printCommandErrorを呼ぶ全箇所をstderrへ揃え、既存テストのstdout検証も合わせて更新する。catalog.ts/schedule.tsにも同種のstdout一本化が見られるが、対象はregister系に限定し、他コマンドへの拡張は別途判断する。
        - field: owner
          from: _TODO_
          to: ARC
        - field: due
          from: _TODO_
          to: "2026-08-31"
        - field: conclusion
          from: "-"
          to: printCommandErrorをstderr出力へ変更し、printWhereErrorと統合(削除)。register系全サブコマンドのエラー出力がstderrに統一された。内部呼び出し元はstdio inherit+終了コード判定のため影響なし。command-referenceへ反映。
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
      previous_event_id: reg_57f1ce004c2c46ec1cf6e303e27d1d76
    - v: 1
      id: reg_2e4aa5ea6b0a4312c5911e92c5aff005
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: registered
          from: _TODO_
          to: "2026-08-08"
        - field: completed
          from: "-"
          to: "2026-08-08"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_6e3457486df8f44d34bfefa057efd922
---

# PJR-Q88A register系コマンド全体のエラー出力をstdoutからstderrへ統一する

## 1. 概要

registerサブコマンド(add/start/wait/review/close/reject/defer/reopen/update/renumber等)はほぼ全てprintCommandError慣例でエラーをstdoutへ出す。PJR-NWPCでregister whereのみstderrへ分離したが、他のサブコマンドはstdoutのまま残っている。内部呼び出し元(spawnSelf/spawnRegisterTransition等)はstdio inherit+終了コードのみで成否判定しておりstdout内容を解析していないため、stderrへ変更しても既存の内部呼び出しへの影響はない。printCommandErrorを呼ぶ全箇所をstderrへ揃え、既存テストのstdout検証も合わせて更新する。catalog.ts/schedule.tsにも同種のstdout一本化が見られるが、対象はregister系に限定し、他コマンドへの拡張は別途判断する。

[[prj-0001:pjr-nwpc-register-where-stderr]]では`register where`のみエラー出力をstderrへ分離したが、`add`/`start`/`wait`/`review`/`close`/`reject`/`defer`/`reopen`/`update`/`renumber`等の他サブコマンドは`printCommandError`慣例のままstdoutへエラーを出している。内部呼び出し元（`spawnSelf`/`spawnRegisterTransition`等）は`stdio: inherit`＋終了コードのみで成否判定しており、stdout内容を解析する箇所は無いため、stderrへの変更は安全である。Unix/CLIの一般的な慣習（正常出力はstdout、エラーはstderr）に揃える。

## 2. 完了条件

- `printCommandError`を呼ぶ全ての`register`サブコマンドで、エラーメッセージがstderrへ書かれる。
- 成功時の通常出力（更新内容の表示等）は引き続きstdoutのまま変更しない。
- 既存の内部呼び出し元（`spawnSelf`/`spawnRegisterTransition`等）が終了コードのみで成否判定しており、stdout/stderr変更の影響を受けないことを確認する。
- 既存テストのうち、register系コマンドのエラー出力先（stdout）を前提にしているものをstderr前提へ更新する。
- コマンドリファレンスに、register系コマンドのエラー出力先（stderr）が明記されている。
- 対象は`register`系コマンドに限定し、`catalog`/`schedule`等の同種パターンへの拡張は本項目のスコープ外であることが明記されている。

## 3. 作業内容

| No  | 作業                                                                                                       | 担当 | 状態 | メモ                                    |
| --- | ---------------------------------------------------------------------------------------------------------- | ---- | ---- | --------------------------------------- |
| 1   | `printCommandError`をstderr出力へ変更する（`register where`専用の`printWhereError`との統合可否も検討する） | ARC  | done | `src/register.ts`                       |
| 2   | 内部呼び出し元がstdout内容に依存していないことを確認する                                                   | ARC  | done | `spawnSelf`/`spawnRegisterTransition`等 |
| 3   | 既存テストのstdout前提箇所をstderr前提へ更新する                                                           | ARC  | done | -                                       |
| 4   | コマンドリファレンスへ反映する                                                                             | ARC  | done | -                                       |

## 4. 対応結果

- `src/register.ts`の`printCommandError`を`process.stdout.write`から`process.stderr.write`へ変更した。これにより`register`配下の全サブコマンド（`scaffold`/`add`/`build`/`update`/`start`/`wait`/`review`/`close`/`reject`/`defer`/`reopen`/`renumber`/`where`）のエラーがstderrへ揃う。
- 両者が完全に同一動作になったため、`register where`専用の`printWhereError`を`printCommandError`へ統合した。`where`のcatch節も`printCommandError`を呼ぶよう変更し、統合後の`printCommandError`をexport化した。`where`固有の理由（コマンド置換で`git -C`引数へエラー文字列が混入する問題）はコメントに残した。
- 成功時の通常出力（更新内容・生成パス・`Would ...`のdry-runプレビュー・`Warning: ...`）は`stdout`のまま変更していない。
- 内部呼び出し元（`src/exec-run.ts`の`spawnSelf`/`spawnRegisterTransition`、`src/routine.ts`の`spawnSelf`）は`spawnSync(..., { stdio: "inherit" })`で`result.status === 0`のみを見て成否判定しており、stdout内容を解析していない。よってエラー出力先の変更による影響はない。
- テスト`tests/src/register-reserve.test.ts`の`printWhereError`前提を`printCommandError`前提へ更新した（import・describe名・呼び出し）。エラーがstderrへ書かれstdoutを汚さないことを引き続き検証する。
- コマンドリファレンス（[[specdojo:command-reference|SpecDojoコマンドリファレンス]]）へ、`register`系全コマンドがエラーをstderrへ分離すること、および本方針が`register`系限定で`catalog`/`schedule`等はスコープ外であることを明記した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-nwpc-register-where-stderr|register whereのエラー出力をstderrへ分離する]]
- [[specdojo:command-reference|SpecDojoコマンドリファレンス]]
