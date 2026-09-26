---
specdojo:
  id: prj-0001:pjr-bx79-integrate-dubious-ownership-retry
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: DEV
  registered_at: "2026-09-24T12:38:20Z"
  due_on: "2026-10-17"
  block_reason: "agent exited with non-zero code: runner validation `test-unit` failed (exit 1). The executor evidence shows `tests/tools/grade-per-document.test.ts` has 12 failures."
---

# PJR-BX79 統合段の dubious ownership を 1 回だけ再試行する

## 1. 概要

統合段の git コマンドが次で失敗する事象が 2 回発生した。

```text
integrate failed: git status failed: fatal: detected dubious ownership in repository
  at '/workspaces/specdojo-workspace/worktrees/prj-0001-PJR-NFV7'
  (args: --porcelain=v1 -z --untracked-files=all)
```

初回は [[prj-0001:pjr-7vkr-npm-release]] の統合段で、2 回目は [[prj-0001:pjr-nfv7-result-trailing-newline]] である。いずれも再現せず、統合段だけの再開（[[prj-0001:pjr-j3g0-exec-resume-integrate-schedule-task]]）で完了した。

### 1.1. 調査結果

| 確認項目                                                      | 結果                            |
| ------------------------------------------------------------- | ------------------------------- |
| worktree の所有者                                             | `node:node`（uid 1000）         |
| 実行ユーザ                                                    | `node`（uid 1000）              |
| `.git` の所有者                                               | 1000:1000。本体リポジトリも同じ |
| 手元での `git status --porcelain=v1 -z --untracked-files=all` | 成功                            |

所有者は一致しており、事後に実行すると通る。git の所有者チェックは `st_uid` と euid の比較であるため、一致していれば `safe.directory` の設定有無に関わらず成立する。devcontainer の overlay ファイルシステムで所有者情報が一時的に異なって見える事象と考えられる。

### 1.3. 3 回目は checkpoint 段で起きた（2026-09-26）

[[prj-0001:pjr-1y9p-resume-executor-plan]] の実行で 3 回目が発生した。**統合段ではなく、agent を起動する前の checkpoint 段**だった。

```text
checkpoint failed: git ls-files failed: fatal: detected dubious ownership in repository
  at '/workspaces/specdojo-workspace/worktrees/prj-0001-PJR-1Y9P'
  (args: --full-name -z -- 4 paths)
```

同じ項目をすぐ再実行すると再現しなかった。uid は今回も一致していた（worktree も実行ユーザも 1000）。

`safe.directory` には `/workspaces/specdojo` と `/workspaces/specdojo-workspace/specdojo` だけが登録され、`worktrees/` 配下は登録されていない。ただし所有者が一致していれば git は `safe.directory` を参照しないため、**登録の漏れは原因ではない**。所有者の比較が一時的に食い違う（overlay 上のファイルの見え方など）と考える方が、再実行で通る事実と合う。

**再試行を統合段だけに置くと、checkpoint 段の失敗を救えない。** 個々の git 呼び出しを包む層で、`dubious ownership` を検出したら 1 回だけ再試行する形にする。

### 1.2. なぜ対処するか

人が見ていれば `--resume` で回復し、agent の枠も消費しない。実害は再開操作だけである。

しかし **routine の無人実行で起きると翌朝まで止まる**。`rtn-exec-cycle` を有効化する場合、この失敗は自動実行を止める要因になる。再試行 1 回で回復する見込みが高く、実装も小さい。

一方、所有者が本当に異なる場合まで再試行で握りつぶすと別の問題を隠す。対象を `dubious ownership` に限定し、再試行しても失敗したらそのまま報告する。

## 2. 完了条件

- worktree に対する git コマンドが `dubious ownership` で失敗した場合に限り、1 回だけ再試行する。**統合段だけでなく checkpoint 段も対象とする**。個々の git 呼び出しを包む層で扱う。
- 再試行しても失敗した場合は、従来どおり失敗として扱い理由を報告する。握りつぶさない。
- `dubious ownership` 以外の失敗では再試行しない。
- 再試行が発生したことがログまたは evidence から分かる。
- 判定と再試行の挙動を検証する単体テストがある。`dubious ownership` を含む stderr と、含まない stderr の双方を入力にする。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                    | 担当 | 状態 | メモ                             |
| --- | --------------------------------------- | ---- | ---- | -------------------------------- |
| 1   | 統合段の git 実行に再試行の判定を入れる | DEV  | done | `dubious ownership` に限定した   |
| 2   | 再試行の発生をログへ残す                | DEV  | done | 警告ログへ対象と引数を記録する   |
| 3   | 判定と挙動の単体テストを追加する        | DEV  | done | 該当・非該当の stderr を検証した |

## 4. 対応結果

- 共通の Git 実行層で `fatal: detected dubious ownership` を判定し、同じコマンドを1回だけ再試行するようにした。checkpoint 段と統合段のどちらも対象になる。
- 再試行時は cwd と要約した引数を警告ログへ記録する。再試行後も失敗した場合は2回目の結果を呼び出し元へ返し、従来のエラー処理を継続する。
- 該当する stderr、該当しない stderr、再試行後も同じエラーになる場合の単体テストを追加した。
- 詳細な運用仕様を [[specdojo:exec-worktree-guide|exec worktree運用ガイド]] へ追記した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-j3g0-exec-resume-integrate-schedule-task]]
- [[prj-0001:pjr-tr8g-git-failure-reason-progress]]
- `src/exec-worktree-ops.ts`
