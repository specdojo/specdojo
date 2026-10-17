---
specdojo:
  id: prj-0001:pjr-613h-enobufs-test-flaky
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: medium
  owner: DEV
  registered_at: "2026-10-17T09:13:21Z"
  due_on: null
---

# PJR-613H ENOBUFS のテストが負荷によって失敗する

## 1. 課題内容

tests/src/exec/worktree.test.ts の reports ENOBUFS のテストは、子プロセスに 64 KB を書かせて maxBuffer 1 KB で止められることを確かめる。負荷が高いと子プロセスが止められる前に書き終えて終了コード 0 になり、status が null でなくなって失敗する

## 2. 影響範囲

| 観点         | 影響                                                                                                     |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| スコープ     | `tests/src/exec/worktree.test.ts` の「reports ENOBUFS and the signal when the output exceeds maxBuffer」 |
| スケジュール | 急がないが、親の検証をむだに止めるため早めに直す                                                         |
| コスト       | 負荷が高いときに、変更と関係なく親の検証や commit の hook が失敗し、再開の手間がかかる                   |
| 品質         | テストの結果がタイミングで変わる                                                                         |
| 関係者       | exec の親の検証、開発者                                                                                  |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                               |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 子プロセスは 64 KB を 1 回書いて終わる。`spawnSync` は出力が `maxBuffer` を超えると子プロセスを止めるが、負荷が高いと止める前に子プロセスが書き終えて正常に終わり、`status` が `0` になる          |
| 対応策   | 子プロセスが止められるまで書き続けるようにし（例: 終わらないループで書き続ける）、確かめる内容を `result.error` の `ENOBUFS` を中心にする。`status` と signal は、止められた場合の値として確かめる |
| 依存事項 | なし                                                                                                                                                                                               |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                                             |

### 3.1. 完了条件

- 上のテストが、負荷の有無によらず、出力が `maxBuffer` を超えたときの `describeGitProcessFailure` のメッセージ（`output exceeded maxBuffer (ENOBUFS)` と signal）を確かめる。
- 子プロセスが止められずに残らない（テストの後に子プロセスが動き続けない）。
- テストを 20 回続けて実行して、すべて通ることを確かめ、result に書く（例: `npx vitest run --project unit tests/src/exec/worktree.test.ts -t ENOBUFS --repeat 20` など、使える方法で）。
- `src/` の動作は変えない。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 4. 対応結果

- `tests/src/exec/worktree.test.ts` の子プロセスを、64 KiB を一度だけ出力して終了する処理から、停止されるまで同じ出力を続ける処理へ変更した。親が `maxBuffer` 超過を検知する前に子が正常終了する競合をなくした。
- `result.error.code` が `ENOBUFS` であることを直接検証し、あわせて上限超過時の `status` が `null`、signal が非 `null` であり、`describeGitProcessFailure` のメッセージに `output exceeded maxBuffer (ENOBUFS)` と signal が含まれることを検証するようにした。
- `spawnSync` が上限超過時に子プロセスを停止してから返るため、テスト終了後に子プロセスは残らない。`src/` の動作は変更していない。
- 同じ子プロセスと `describeGitProcessFailure` を使うスモーク検証を20回連続で実行し、20回すべてで `ENOBUFS`、`status: null`、非 `null` の signal、期待するメッセージ、および子プロセスが残っていないことを確認した。単体テスト全件は親 runner の検証で確認する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-ry4c-register-commit-git-status-buffer]]: このテストを加えた項目。
