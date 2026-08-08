---
specdojo:
  id: prj-0001:pjr-q88a-register-stdout-stderr
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-Q88A register系コマンド全体のエラー出力をstdoutからstderrへ統一する

## 1. 概要

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
