---
specdojo:
  id: prj-0001:pjr-ctv4-resume-integrate-bookkeeping-conflict
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-09-27T20:29:30Z"
---

# PJR-CTV4 waiting を複数回経た項目の再開時の統合で記帳ファイルが競合し merge が途中で残る

## 1. 課題内容

PJR-N22N は、次の経過で 3 回 `waiting` を経た。

1. 2026-09-27：executor が着手前の判断が未決定であるとして着手しなかった。
2. `--force-restart` での再実行：runner の `typecheck` が失敗した。
3. orchestrator が worktree で型エラーを直し、`--resume` で reporter の段から再開した。

3 の再開では runner の検証はすべて通ったが、develop への統合 merge が次のファイルで競合した。

- `docs/ja/projects/prj-0001/controls/project-register/events/pjr-n22n.yaml`（content）
- `docs/ja/projects/prj-0001/execution/exec/results/pjr-n22n-20260927T151253Z-3ce3-result.md`（add/add）

runner は `merge --abort` を試みたが、`docs/ja/specdojo/exec-templates/xrp-recipe-maintenance-template.md` が `not uptodate` のため失敗した。内容の差分はなく、stat だけがずれていた。同じ時間帯に、夜間の routine（`job-grade-deliverable`）が同じ作業ツリーで動いていた。develop は merge 途中のまま残り、続く wait の記帳 commit も `cannot do a partial commit during a merge` で失敗した。orchestrator が grade の結果ファイルを残したまま `git update-index --refresh` と `git merge --abort` で復旧した。commit はされておらず、develop の内容は失われていない。

PJR-R0XA の修正後の同期 merge（`syncExecBranchAfterWait`）は、wait の時点で起きる記帳ファイルの競合を統合先側の内容で解決する。しかし、再開後の統合 merge で起きる記帳ファイルの競合は解決しない。

## 2. 影響範囲

| 観点         | 影響                                                                                |
| ------------ | ----------------------------------------------------------------------------------- |
| スコープ     | `waiting` を経た項目を `--resume` で統合する経路。とくに複数回 `waiting` を経た項目 |
| スケジュール | 該当する項目は `--force-restart` でやり直す必要があり、executor の作業が無駄になる  |
| コスト       | やり直しによる agent 利用枠の消費                                                   |
| 品質         | 統合先が merge 途中で残ると、同じ作業ツリーの routine や次の run が失敗する         |
| 関係者       | 並行実行と再開を使う利用者、orchestrator                                            |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                     |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 統合 merge の時点で、項目自身の記帳ファイル（個票・イベント・plan・result）が統合先と exec branch の両方で変わっている。R0XA の同期は wait の時点だけを扱う。`merge --abort` は stat だけのずれでも失敗する                              |
| 対応策   | 統合 merge で競合したのが項目自身の記帳ファイルだけの場合は、exec branch 側（再開後の最新の記帳）で解決して merge を完了する。`merge --abort` の前に `git update-index --refresh` を行い、stat だけのずれで abort が失敗しないようにする |
| 依存事項 | PJR-R0XA（wait 時の同期 merge）                                                                                                                                                                                                          |
| 完了条件 | `waiting` を 2 回以上経た項目を `--resume` で統合でき、記帳ファイルの競合で止まらないことを統合テストで確認する。stat だけがずれたファイルがあっても `merge --abort` が成功することを確認する                                            |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:exec-worktree-guide]]
- `src/exec-run.ts`（統合 merge、`syncExecBranchAfterWait`）
- PJR-N22N（発生した項目）、PJR-R0XA、PJR-2M84
