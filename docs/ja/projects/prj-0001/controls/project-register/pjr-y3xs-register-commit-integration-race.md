---
specdojo:
  id: prj-0001:pjr-y3xs-register-commit-integration-race
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: high
  difficulty: hard
  owner: ARC
  registered_at: "2026-11-18T12:03:53Z"
  due_on: "2026-11-30"
---

# PJR-Y3XS register の --commit が実行中の統合を止め、-m を 2 つ付けると commit せずに終わることがある

## 1. 課題内容

register ... --commit の記帳の commit が exec の統合と重なると、統合が staged changes を理由に止まる。また -m を 2 つ付けた close が記帳だけして commit せずに終わる。原因を調べて直す

## 2. 入力

- orchestrator の観測（2026-11-18）: PJR-6998 を register add --commit で起票した commit の途中（commit hook の register-build は 50 秒ほどかかる）に、T-KATA-SLIM-2-utc-catalog-040 の統合が走り、integration failed: Staged changes in integration target（pjr-6998 の個票とイベント）で止まった。統合だけを exec resume でやり直した
- orchestrator の観測（2026-11-18）: register close --commit に -m を 2 つ（2 つ目は複数行の本文）付けた PJR-3VJM・PJR-ANKZ・PJR-QTB6 の close が、記帳は済んだのに commit されず、出力の最後の行は 'Co-Authored-By… -- 2 paths)' だった。どれも specdojo git -- commit で手で commit した。-m を 1 つだけ付けた register add --commit は commit できた
- orchestrator の観測（2026-11-18・2026-11-19）: 個票とイベントを specdojo git -- add と commit（パスを指定）で commit した後に、イベントの YAML（pjr-5ctm・pjr-p318・pjr-y3xs・pjr-x21w・pjr-ygzf・pjr-a5fy など）が index に残ることが繰り返しあった。commit の hook（lint-staged の整形）が整形したファイルを index へ戻しているとみられる。残った index は次の統合を staged changes で止めるため、commit のたびに git diff --cached を確かめて外している
- orchestrator の運用（pm-orchestrator-playbook）: 記帳は register ... --commit で行えば、lifecycle のロックを取るため実行中の run と取り合わない、としている

## 3. 影響範囲

| 観点         | 影響                                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------------------- |
| スコープ     | `register ... --commit` の commit、記帳の commit と exec の統合の取り合い、commit の hook が index に残すファイル |
| スケジュール | 統合が止まると、その run を `exec resume` でやり直すまで後の run が進まない                                       |
| コスト       | orchestrator が commit のたびに index を確かめ、手で commit し直す手間がかかる                                    |
| 品質         | 記帳したのに commit されない状態に気づかないと、登録簿の状態と履歴が食い違う                                      |
| 関係者       | ARC・DEV（register と統合の修正）、オーケストレーター（記帳）                                                     |

## 4. 対応方針

| 項目     | 内容                                                                 |
| -------- | -------------------------------------------------------------------- |
| 原因     | 3 つの現象の原因は対応結果に書く                                     |
| 対応策   | 下の完了条件のとおり、3 つの現象をそれぞれ再現するテストを足して直す |
| 依存事項 | なし                                                                 |
| 完了条件 | 下の「完了条件」を満たす                                             |

完了条件:

- 3 つの現象（記帳の commit の途中の統合が staged changes で止まる、`-m` を 2 つ付けた `register close --commit` が commit せずに終わる、commit の後に hook の整形したファイルが index に残る）の原因を調べ、個票の対応結果に書く。
- `register ... --commit` は、`-m` を 1 つ付けた場合も複数付けた場合（本文を含む）も、そのコマンドが変えた個票とイベントだけを commit する。commit できなかった場合は、理由を示して 0 以外で終わる。
- 記帳の commit の途中に exec の統合が始まっても、統合が記帳の staged のファイルを理由に失敗しない（記帳の commit が終わるのを待つ、または記帳のファイルを統合の対象から外す）。どちらにするかは executor が決め、理由を個票の対応結果に書く。
- `register ... --commit` と `specdojo git -- commit` の後に、そのコマンドが stage したファイルが index に残らない。
- 上の 3 点を確かめるテストがある（実 Git が要るものは統合テスト）。
- 保護された設定（`lefthook.yml`・`package.json` など）の変更が要る場合は、案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証（test-integration）を通す。
- `CHANGELOG.md` は変えず、個票の対応結果の `### <n>.<m>. CHANGELOG に書く事項`（Markdown の連番ルールに従う）に区分（追加・変更・不具合修正など）と行の文案を書く。影響がなければ「なし」と書く。

## 5. 対応結果

### 5.1. 原因

- 記帳の commit の途中の統合が止まる: `register ... --commit` と `specdojo git` は project の lifecycle ロック（`exec/.locks/exec-lifecycle`）の下で stage と commit を行う。一方、schedule の task の統合（`src/exec/run/schedule-task.ts` の `runPreparedTask`）は、プロセス内の `SerialAsyncLock` しか取っていなかった。register の worktree 実行だけが同じロックを取っていた。そのため記帳が個票と event を stage して hook（register-build など）を実行している間に schedule の統合が始まり、`stagedMergeBlocker` が記帳の staged のファイルを理由に止めた。playbook の「lifecycle のロックを取るため実行中の run と取り合わない」は、register の run にしか当てはまっていなかった。
- `-m` を 2 つ付けた close が commit されない: commander は値付きオプションの繰り返しを最後の値で上書きする。そのため commit message は 2 つ目の `-m`（本文）だけになり、件名に type が無いことを commit-msg の commitlint が拒否した。`register` は記帳を作業ツリーに残し、stage を戻して終了コード 1 で終わっていた。ただし失敗のメッセージは `git commit failed: … (args: commit --only -m <message>)` の形で、複数行の message が引数の要約にそのまま入っていた。そのため出力の最後の行は `Co-Authored-By… -- 2 paths)` という引数の断片になり、失敗に気づきにくかった。
- commit の後に event の YAML が index に残る: pathspec 付きの `git commit -- <path>`（`--only`）は、一時 index を使って commit する。lefthook の `stage_fixed` が hook の中で実行する `git add` は一時 index にだけ入り、本来の index には hook の前の（整形前の）内容が残る。HEAD と作業ツリーは整形後で一致するのに、index だけが整形前の内容を staged として持つ。`register ... --commit` は収束の amend で結果的に直していたが、hook をもう一度走らせていた。`specdojo git -- commit -- <paths>` には戻す処理が無かった。

### 5.2. 対応

- schedule の統合: `withExecLifecycleMutex` を足した。`runPreparedTask` の統合の段（`finalize` と後片付けの記帳）は、プロセス内の lock に加えて project の lifecycle ロックを取る。`exec run` の schedule 実行・手動実行・`exec resume` は、すべてこの経路を通る。
- `-m` の繰り返し: `register` の `-m, --message` を繰り返せるようにした。各値を空行でつないで段落にする（`git commit -m` と同じ）。commit が失敗した場合は、`Register commit failed for <ID>: <原因>` と、記帳済みで未 commit のファイルの一覧を最後に書き、終了コード 1 で終わる。git の引数の要約（`summarizeGitArguments`）は空白と改行を 1 行へ畳む。
- index の残り: `src/shared/git.ts` に `restoreIndexAfterPathspecCommit` を足した。commit の対象のうち、index が HEAD と異なり、作業ツリーが HEAD と一致するパスだけを `git reset` で HEAD へ戻す。作業ツリーが HEAD と異なるパスは利用者の作業かもしれないため触らない。`register ... --commit` は初回の commit と各 amend の後に、`specdojo git -- commit ... -- <pathspec>` は commit が成功した後に、これを呼ぶ。`specdojo git` は戻したパスを標準エラー出力へ書く。
- 文書: [[specdojo:command-reference|コマンドリファレンス]] と [[specdojo:register-operation-guide|登録簿運用ガイド]] に、`-m` の繰り返し、失敗時の終了、hook が整形したファイルの index の扱い、schedule の統合が記帳を待つことを書いた。

### 5.3. 決めた点

- 統合と記帳の取り合いは「記帳の commit が終わるのを待つ」にした。理由: `register ... --commit`・`specdojo git`・register の worktree 実行は、すでに同じ lifecycle ロックで直列化している。schedule の統合だけが外れていたため、同じロックに入れるのが最も小さい変更で、playbook の運用と一致する。記帳のファイルを統合の対象から外す方法は、merge が clean な index を要るという `stagedMergeBlocker` の前提を崩し、他の操作が stage したものを巻き込む恐れがある。
- `job` の統合（`src/exec/run/job.ts`）と手動の `exec worktree merge` は、今回のロックの対象にしていない。観測された現象は schedule の統合で、job は routine から短時間で走る。同じ現象が出たら別の項目で同じ helper を当てる。
- `specdojo git -- commit` で index を戻すのは、`--` の後に pathspec がある commit だけにした。`--` の無い `git commit <path>` は、オプションの値と pathspec を区別できないため対象外とする。pathspec の無い commit は本来の index で行われるため、この問題は起きない。
- `specdojo git -- add` と、後の別の `specdojo git -- commit` の間はロックを持たないため、その間に統合が始まると staged で止まり得る。記帳は `register ... --commit`、または pathspec 付きの 1 回の `specdojo git -- commit` で行う運用を勧める。
- 保護された設定（`lefthook.yml`・`package.json`）は変えていない。hook の `stage_fixed` はそのままで、commit 側で index を戻す。

### 5.4. 確認

- 統合テスト（`tests/src/register/commit.integration.test.ts`）: `-m` を 2 つ（2 つ目は複数行の本文）付けた `register update --commit` が件名と本文の両方で、個票と event だけを commit する。件名に type の無い message を拒否する commit-msg hook の下で確認する。hook が整形して `git add` した event が、commit の後の index に残らない。hook が失敗したときに、未 commit のファイルを示して終了コード 1 で終わる。
- 統合テスト（`tests/src/commands/git.integration.test.ts`）: `specdojo git -- commit -m … -- file.txt` の後、hook が整形して stage したファイルは index から HEAD へ戻る。利用者が先に stage した別のファイルは残る。
- 単体テスト: `withExecLifecycleMutex` が記帳の保持するロックの解放を待ってから統合を始め、統合の間は枠を持つこと（`tests/src/exec/run/schedule-integration-lock.test.ts`）。`commitPathspecs`、`registerCommitMessageFromParagraphs`、`summarizeGitArguments` の 1 行化。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run test:integration` は、pipeline の親 runner が実行する。

### 5.5. CHANGELOG に書く事項

- 不具合修正: `register ... --commit` の `-m` を繰り返せるようにし、`git commit -m` と同じく件名と本文の段落にした。2 つ目の `-m` だけが message になって commitlint に拒否され、記帳だけが残っていた。commit に失敗したときは、記帳済みで未 commit のファイルを示して終了コード 1 で終わる。
- 不具合修正: schedule の task の統合が、`register ... --commit` と同じ lifecycle ロックを取るようにした。記帳の commit の途中に始まった統合が `Staged changes in integration target` で止まらない。
- 不具合修正: `register ... --commit` と `specdojo git -- commit ... -- <pathspec>` の後、commit の hook が整形して stage したファイルが index に残らないようにした。

## 6. 関連ドキュメント

- [[prj-0001:pm-orchestrator-playbook]]（記帳は `register ... --commit` で行う運用）
