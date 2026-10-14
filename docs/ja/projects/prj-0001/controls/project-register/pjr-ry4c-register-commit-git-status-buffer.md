---
specdojo:
  id: prj-0001:pjr-ry4c-register-commit-git-status-buffer
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-13T21:18:07Z"
  due_on: null
---

# PJR-RY4C 未追跡のファイルが多いと register の --commit が git status failed で止まる

## 1. 課題内容

gitResult の spawnSync が maxBuffer を指定しないため、git status --porcelain の出力が既定の上限（1 MB）を超えると失敗し、原因を示さない git status failed になる。2026-10-14 に未追跡のファイル 8,575 個で register close --commit が止まった

## 2. 影響範囲

| 観点         | 影響                                                                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `src/exec-worktree.ts` の `gitResult`（`spawnSync` で git を起動する共通処理）と、その出力を使う `register --commit`・exec の worktree 操作・evidence の収集など |
| スケジュール | v0.3.0 の公開の妨げにはしない。利用者の判断を待つ                                                                                                                |
| コスト       | 未追跡のファイル（ビルド結果や cache など）が多い作業場所で、記帳や exec の統合が止まる。エラーに原因が出ないため、切り分けに時間がかかる                        |
| 品質         | `git status` 自体は成功しているのに、出力の受け取りで失敗し、`git status failed` とだけ表示される                                                                |
| 関係者       | register と exec を使う利用者、orchestrator                                                                                                                      |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                    |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `gitResult` の `spawnSync` が `maxBuffer` を指定せず、Node.js の既定の上限（1 MiB）で stdout を打ち切る。上限を超えると子プロセスが SIGTERM で止められ、`status` が `null`、`error.code` が `ENOBUFS`、stderr が空になる。`gitOutput` は stderr だけから原因を作るため、原因のない `git status failed (args: …)` になる |
| 再現     | 2026-10-14 に、空のリポジトリへ未追跡のファイルを置き、`spawnSync("git", ["status", "--porcelain=v1", "-z", "--untracked-files=all"])` を既定の設定で実行した。stdout が 1,033,893 バイトのときは成功し、1,081,344 バイトに達したところで `status: null`・`signal: SIGTERM`・`error: ENOBUFS` で失敗した                |
| 対応策   | `gitResult` の `spawnSync` に十分な `maxBuffer` を指定する。あわせて、`result.error`（`ENOBUFS` など）や signal で終わった場合は、その内容を失敗のメッセージに含める                                                                                                                                                    |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                    |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                                                                                                                                                                  |

### 3.1. 完了条件

- `gitResult` が、1 MiB を超える出力の git コマンドを打ち切らずに受け取れる。
- git の起動の失敗や出力の上限超過など、stderr が空の失敗でも、エラーのメッセージに原因（`ENOBUFS`、signal など）が含まれる。
- 1 MiB を超える `git status` の出力を受け取れることと、上限超過のときに原因がメッセージに含まれることを、テストで確かめている。
- `npm run check` が通る。

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-ca0s-docs-site-output-in-node-modules]]: 本件が起きた close。
- `src/exec-worktree.ts`（`gitResult`・`gitOutput`・`formatGitCommandFailure`）
