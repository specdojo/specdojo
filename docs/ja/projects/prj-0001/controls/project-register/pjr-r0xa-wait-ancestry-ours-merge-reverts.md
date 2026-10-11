---
specdojo:
  id: prj-0001:pjr-r0xa-wait-ancestry-ours-merge-reverts
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-09-27T03:07:17Z"
  completed_at: "2026-09-27T07:46:00Z"
  block_reason: "agent exited with non-zero code: runner validation `test-integration` (`npm run test:integration`) が failed となったため。"
  conclusion: syncExecBranchAfterWait の -s ours を通常 merge に改め、記帳ファイルの競合だけ統合先側で解決し、それ以外の競合は中断して worktree を保持する。ブランチ作成後に統合先へ入った成果が再開・統合後も残ることを統合テストで確認した
---

# PJR-R0XA waiting からの再開前の develop 取り込みが統合時に他項目の成果を消す

## 1. 課題内容

`waiting` になった register 項目では、runner の `syncExecBranchAfterWait`（`src/exec-run.ts`）が、統合先ブランチを exec branch へ `-s ours` で merge する（commit メッセージは `record <branch> wait ancestry`）。

- この merge は、統合先を exec branch の祖先として記録するが、exec branch の tree には統合先の変更を取り込まない。
- 統合先が wait commit 以外に進んでいない場合は問題ない。
- exec branch の作成後に統合先が進んでいると、再開後の統合 merge では merge-base がその統合先になる。その結果、統合先で追加・変更された内容は「exec branch 側で削除・巻き戻された」とみなされ、統合 commit が他項目の成果を消す。

2026-09-27 の事例は次のとおり。

- `exec run --parallel 5 --force-restart` で E8FY・QJAD・HG98・06RE・6V3D を実行した。E8FY は統合まで進み、QJAD・HG98・06RE・6V3D は runner の検証の失敗で `waiting` になった。wait の時点で、各 exec branch に ours merge が入った。
- その後、E8FY・QJAD の統合と PJR-3HHW の起票で develop が進んだ。
- `--resume` で HG98 を統合すると、merge は次の変更を含む状態で止まった。
  - PJR-3HHW の個票とイベントの削除
  - E8FY の evidence の削除
  - 06RE・6V3D・E8FY の plan の削除
  - 他項目の個票の巻き戻し
- QJAD のファイルで競合し、runner の `merge --abort` も未 commit の記帳ファイルのため失敗した。merge は develop 上で途中のまま残り、利用者が `git reset --hard HEAD` で復旧した。commit はされておらず、develop の内容は失われていない。
- 同じ run で先に統合された QJAD（cc1ae7e0）は、QJAD 自身の 8 ファイルだけを変更しており、他項目の削除はなかった。

## 2. 影響範囲

| 観点         | 影響                                                                                                                 |
| ------------ | -------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `exec run --register --worktree` で `waiting` から再開する経路のすべて。並行実行で統合先が進みやすい場合に顕在化する |
| スケジュール | 修正まで、waiting 項目は `--resume` ではなく `--force-restart` でやり直す必要があり、executor の作業が無駄になる     |
| コスト       | やり直しによる agent 利用枠の消費                                                                                    |
| 品質         | 競合しなければ、他項目の成果を消す統合 commit がそのまま作られる。発見が遅れると復旧範囲が広がる                     |
| 関係者       | 並行実行を使う利用者、orchestrator                                                                                   |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                        |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 祖先関係の記録だけを目的に `-s ours` で統合先全体を merge しているため。統合先が wait commit 以外に進んでいない、という前提がコードで保証されていない                                                                                                                                                                       |
| 対応策   | 候補は次の 3 つ。A: 統合先を通常の merge で取り込む（記帳の add/add 競合は記帳ファイルだけを統合先側で解決する）。B: ours merge をやめ、再開時に exec branch を統合先へ rebase する。C: 統合前に、統合 merge が exec branch の変更対象外のパスを削除・変更しないことを検査し、検出したら中止する（A・B と併用する安全装置） |
| 依存事項 | PJR-3HHW（runner の検証の直列化）が入ると、並行実行で waiting になる頻度が下がる。ただし、本不具合の修正は代わりにならない                                                                                                                                                                                                  |
| 完了条件 | 統合先が進んだ後に waiting から `--resume` しても、統合 commit が exec branch の変更対象外のパスを変更しないことを統合テストで確認する。安全装置（C）が働いた場合は、統合を中止し、develop を merge 途中のまま残さない                                                                                                      |

修正までは、`waiting` の項目を `--resume` で再開せず、`--force-restart` でやり直す。

### 3.1. 1 回目の実行で失敗した統合テスト（2026-09-27 追記）

codex-expert-executor による 1 回目の実行は、runner の `test-integration` で失敗した。orchestrator が worktree で `tests/src/exec-register-pipeline-e2e.integration.test.ts` を単独で実行すると、11 件中次の 3 件が失敗した（いずれも `expected 1 to be +0`）。並行実行の負荷によるものではない。

- `resumes a hook-rejected merge without reverting changes added after branch creation`（今回追加されたテスト）
- `blocks exec-codex-protected-write distinctly and resumes the executor after the handoff is applied`（既存）
- `blocks exec-claude-protected-write distinctly and resumes the executor after the handoff is applied`（既存）

やり直しでは、上記 3 件を含む `npm run test:integration` が成功することを完了条件に加える。codex の sandbox では統合テストを実行できないため、executor は waiting からの再開経路（`syncExecBranchAfterWait` とその呼び出し元）の変更が既存の再開テストに与える影響を、コードから確認する。

## 4. 対応結果

- `syncExecBranchAfterWait` の `-s ours` を廃止し、`wait` commit と、その時点までに統合先へ入った変更を exec branch へ通常 merge するよう変更した。root の `wait` commit に保存済みの記帳ファイルは worktree の未 commit 変更を解放してから merge し、個票・イベント・plan・result の競合だけを統合先側の内容で解決する。対象外パスの競合は同期を中断して worktree を保持する。
- exec branch の作成後に統合先へ別成果を commit し、最初の統合を hook で失敗させて `waiting` にしたあと、`--resume` する統合テストを追加した。再開後も別成果が残り、対象項目の統合 commit の差分にそのパスが含まれないことを確認する。
- [[specdojo:exec-worktree-guide]] に、`waiting` 遷移後の同期 merge と競合時の扱いを追記した。

## 5. 関連ドキュメント

- [[specdojo:exec-worktree-guide]]
- `src/exec-run.ts`（`syncExecBranchAfterWait`）
- PJR-HG98（発生した項目）、PJR-3HHW（並行実行での waiting の発生源）、PJR-2M84（統合 merge の失敗時に merge を中断する既存対応）
