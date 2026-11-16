---
specdojo:
  id: prj-0001:pjr-dvnv-exec-commit-trailing-records
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-15T12:27:24Z"
  completed_at: "2026-11-15T16:49:55Z"
  conclusion: 0.8.0 の第 1 段で直した（runner が統合の後に書いたイベントと run の記録を commit する）。親の検証をすべて通って統合済み
  commit_type: fix
  commit_scope: exec
---

# PJR-DVNV runner が統合の後に書いたイベントと run の記録を commit する

## 1. 概要

統合の後のイベントと試行の記録を、runner が自分で commit する（run の終わりに記帳の commit を足す、など）

## 2. 入力

- 2026-11-15、develop の作業ツリーに commit されていない実行記録が 465 件たまっていた。イベント 371 件（11/10〜11/15 の claim・complete・block・unblock・release など）と、失敗した試行や再開前の試行のログ 70 件
- 調べた結果: ログの配置の変更（2026-11-07、PJR-Z0XR）が原因ではない。runner の統合の commit に入るのはその時点までのイベント（claim）と run の記録で、統合の後に書く complete・失敗時の block は 8 月から一度も runner が commit していない。orchestrator が『実行イベントを記録する』commit（08-12・09-16・11-05・11-09 など）で手で補っていたが、playbook にも orchestrator の定義にも書かれておらず、引き継がれずにたまった

## 3. 完了条件

- run の終わり（成功・失敗・延期・再開のどれでも）に、runner が書いたイベント（claim・complete・block・unblock・release）と、その run の記録（plan・result・evidence・pipeline-state・ログ、退避した試行のログ）を、記帳の commit として develop に入れる。作業ツリーに残さない。
- 統合の commit に入らなかったイベントがあれば、次の run の準備の commit で拾う仕組みが効いているか確かめ、効いていなければ直す。
- commit が index.lock などで失敗したら再試行し、それでも失敗したら残ったファイルと次の操作を報告に書く。
- 人が書くイベント（`exec claim`・`complete`・`block` など）は、従来どおり記帳する人が commit する。その区別をガイドに書いている。
- run が終わった後に `git status` で実行記録が残らないことを、回帰テストか実際の run で確かめている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                            | 担当 | 状態 | メモ |
| --- | ----------------------------------------------- | ---- | ---- | ---- |
| 1   | 統合の後のイベントと試行の記録を commit する    | DEV  | done | -    |
| 2   | 次の run の準備の commit での拾い上げを確かめる | DEV  | done | -    |
| 3   | ガイドと回帰テストを足す                        | DEV  | done | -    |

## 5. 対応結果

- 記帳の commit を足した。`exec run`（Schedule の `--auto` と `--task --worktree`）・`exec resume`・`exec cycle` の終わりに、runner が `exec(run): record execution events and run records` を 1 件作る。成功・失敗・延期・再開のどれで終わっても作る（`src/exec/trailing-records.ts`、`src/exec/run/trailing-records.ts`）。中に入れるものは次の 3 つ。
  - root に未 commit で残っているイベント（`exec/events/*.json`）のうち、`by` が `agent-members.yaml` の agent のもの。
  - それらの task の `runs/schedule/<task-id>/` 配下（plan・result・evidence・pipeline-state・ログ、退避した試行）。
  - `plan-conventions/` 配下。
- 次の run の準備の commit で拾う仕組みは効いていなかった。準備の commit（`prepare execution`）は exec branch にだけ置かれ、入るのはその task の plan・result・claim だけである。直し方として、記帳の commit が今回の run の記録に限らず、root に残る runner の記録を全部拾うようにした。これで、前の run の残りや異常終了で残ったものも次の run の終わりに入る。
- index.lock の競合は既存の `gitResult` が 1.5 秒間隔で 10 回まで再試行する。記帳は統合と同じ scheduler lock で直列化した。hook が result.md を拒否したら result.md を外してもう一度試す。それでも失敗したら、stage を戻したうえで、残ったファイルと次の操作を標準エラーに出す。
- 保持した worktree を後で統合する経路も直した。記帳済みの plan・result と exec branch 側の同じファイルが両側の追加として競合する。そこで、その task の run の記録と checkpoint の複製に限って exec branch 側で解決する。Schedule の統合と `exec worktree merge` の両方で `resolveConflictsWithBranchPaths` に渡すようにした。
- ガイドに書いた。`schedule-operation-guide` に「実行記録の記帳」の節を足し、runner が記帳するものと人が commit するもの（人が書いたイベント・human タスクの記録）の区別を書いた。`exec-worktree-guide` と `branch-workflow-guide` にも反映した。
- 回帰テストを書いた。`tests/src/exec/trailing-records.integration.test.ts` は、選ぶ範囲・記帳の commit 1 件・hook に拒否された場合の報告・失敗の後に記帳してから統合する経路を確かめる。`pipeline-e2e` には、失敗の後と再開の後に `git status` で実行記録が残らないことを足した。HEAD を統合の commit とみなしていた期待値は、記帳の commit を飛ばして確かめる形に改めた。

### 5.1. 判断した点

- 人が書いたイベントは、`by` が agent かどうかで分けた。runner は claim・complete・block などを agent の名前で書き、人のコマンドは人の名前で書くためである。人が `--by <agent>` で書いたイベントは runner の記帳に入る。
- run の記録は、選んだイベントの task の分に限った。human タスク（`-140` など）の result を人の編集中に commit しないためである。
- hook は飛ばさない。`evidence-secret-scan` が実行記録の認証情報を止めるためである。
- 記帳に失敗しても run の終了コードは変えない。成果物の統合はもう終わっており、記帳は次の run でやり直せるためである。
- grade の評価結果（`grade/criteria`・`grade/results`）は記帳の対象に入れなかった。人の `grade` 実行でも変わるので、runner の記録と区別できないためである。
- register の run は対象外とした。統合の merge commit と `wait` commit に記帳が同梱されており、2026-11-15 にたまった記録にも `runs/register/` は無かったためである。

### 5.2. CHANGELOG に書く事項

- Changed: Schedule の `exec run`・`exec resume`・`exec cycle` は、run の終わりに、統合の後に runner が書いたイベントと run の記録を記帳の commit（`exec(run): record execution events and run records`）1 件にまとめる。作業ツリーに実行記録が残らなくなり、develop の first-parent には run ごとに記帳の commit が 1 件加わる。
- Fixed: 失敗・延期の後に記帳した plan・result が、再開後の統合で exec branch 側の同じファイルと競合しても統合が止まらない。

### 5.3. 残課題

- `pm-orchestrator-playbook` などにある、orchestrator が実行記録を手で commit する運用は、この変更の統合後に見直す。
- 実際の run で develop の `git status` を確かめる作業は、統合後に runner かオーケストレーターが行う。

## 6. 関連ドキュメント

- [[prj-0001:pjr-y013-exec-commit-folding]]
- [[prj-0001:pjr-tn43-user-decisions-pending]]
