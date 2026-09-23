---
specdojo:
  id: prj-0001:pjr-tx1g-exec-resume-rate-limited-executor
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-09-08T21:32:21Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-08T21:35:46Z"
---

# PJR-TX1G rate limit で中断した executor を再開できない

## 1. 概要

executor が `rate_limited` のまま残った run は `--resume` が拒否し、`--force-restart` で
worktree ごと破棄するしか手段がなかった。

```text
PJR-GWY4: not resumable (executor stage is "rate_limited" for run 20260908T135101588Z-6706095e;
          re-run the item instead)
```

## 2. 観測した事実

PJR-GWY4 の実行が rate limit で中断した。worktree には 17 ファイルの変更が残っていた。

| 領域     | 内容                                                                  |
| -------- | --------------------------------------------------------------------- |
| 実装     | `src/job.ts`、`src/exec-run.ts`、`src/exec-evidence.ts`               |
| スキーマ | `job.schema.yaml`、`job-run.schema.yaml`、`exec-evidence.schema.yaml` |
| テスト   | `tests/src/job.test.ts`、`tests/src/exec-run-inplace.test.ts`         |
| 文書     | `routine-operation-guide.md`、`xep-job-template.md`                   |

この状態で `typecheck` と `test:unit` 1423 件が成功していた。成果を捨てる合理性がない。

## 3. 原因

再開判定が `running` と `succeeded` のみを扱っていた。

```typescript
if (latest.state.stages.executor.status === "running") { ... 再開可 }
if (latest.state.stages.executor.status !== "succeeded") { ... 拒否 }
```

[[prj-0001:pjr-6vfn-exec-run-register-executor-reporter]] は reporter が `rate_limited` / `failed`
になる場合を対象としており、executor 側の `rate_limited` は範囲外であった。意図的な除外では
ない。

## 4. 対応

`rate_limited` を再開対象へ追加した。ただし `running` の分岐をそのまま使っていない。

`running` の分岐は evidence があれば reporter 段へ進む。rate limit で打ち切られた executor は
evidence が記録されていても作業を完了していない。実際に PJR-GWY4 の evidence は
`final_message` と `validations` が空であった。reporter へ進めれば未完成の実装を統合する。

そのため `rate_limited` では常に executor を既存 worktree 上で再開する。`rate_limited` が付く
段が中断された段であり、reporter が `pending` のまま残っていることも executor 中の中断を示す。

既存テストが `rate_limited` を再開不可と主張していたが、これは未完了の例として使っていた
だけで方針を定めたものではない。古い run へ遡らないという意図を保つため、状態を `failed` へ
置き換えた。

## 5. 完了条件

- executor が `rate_limited` の run を `--resume` で再開できる。
- 再開先が executor 段である。evidence が存在しても reporter 段へ進まない。
- 既存 worktree と成果物が保持される。
- 最新 run が再開不能な場合に、古い run へ遡らない挙動が維持されている。
- 上記を検証する単体テストがある。

## 6. 作業内容

| No  | 作業                                     | メモ                            |
| --- | ---------------------------------------- | ------------------------------- |
| 1   | `rate_limited` を再開対象へ追加          | executor 段へ固定する           |
| 2   | 回帰テストを追加                         | evidence があっても executor へ |
| 3   | 既存テストの状態を `failed` へ置き換える | 遡らない意図を保つ              |

## 7. 対応結果

`src/exec-register-resume.ts` に `rate_limited` の分岐を追加し、常に executor 段を再開対象と
した。判断の根拠をコメントとして残している。

`tests/src/exec-register-resume.test.ts` へ「evidence があっても executor 再開対象にする」
検証を追加し、既存の「古い run へ遡らない」テストの状態を `failed` へ置き換えた。同ファイルの
25 件が成功する。`typecheck` と `lint:ts` も通過した。

実地では PJR-GWY4 が既存 worktree 上で executor 段から再開できることを確認した。

```text
PJR-GWY4: resume the executor stage of run 20260908T135101588Z-6706095e
          in worktrees/prj-0001-PJR-GWY4
```

対応は commit `a850952c` である。

## 8. 関連ドキュメント

- [[prj-0001:pjr-gwy4-job-deterministic-command]]: この事象が発生した項目。
- [[prj-0001:pjr-9qz2-exec-stale-running-stage]]: `running` のまま残った状態の復旧。
