---
specdojo:
  id: prj-0001:pjr-t4e0-watch-coexist-exec-watch
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-23T00:13:27Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-26T12:16:55Z"
  conclusion: 見張りを立ち上げたままのオーケストレーターと共存させ、exec watch を足した
  derived_from:
    - PJR-52EE
  depends_on:
    - PJR-40EE
  commit_type: feat
  commit_scope: exec
---

# PJR-T4E0 見張りと立ち上げたままのオーケストレーターを共存させ、exec watch を足す

## 1. 概要

手で始めた run に触らない・見張りの停止と再開・lock の尊重を扱い、次のイベントまで待つ exec watch を足す（PJR-52EE の子の 4）

## 2. 入力

- PJR-52EE を 4 件に分ける。決まった手当ては規則で行い、判断が要るものは agent に診断の案だけを書かせ（案 C）、立ち上げたままのオーケストレーターのために待つコマンドを足す（案 A）。MCP を使う案は採らない（利用者の決定、2026-11-23）

## 3. 完了条件

- オーケストレーターや人が手で始めた run・再開・直しの途中の worktree には、見張りも手当て（子の 2）も触らない。見分けは、実行中のプロセスと lock、claim の actor、手で付ける「見張りの対象外」の印で行う。
- オーケストレーターや人が、見張りをいつでも止めたり再開したりできる（全体、またはタスク単位）。
- 別の run が lock を持っている間は何もせず、次の回に回す（PJR-KVWH と合わせる）。
- `exec watch` を足す。見張り（子の 1）のイベントの記録を読み、指定した種類のイベント（止まった・終わった・waiting になった など）が新しく起きるまで待って、その内容を出して終わる。待つ上限の時間を指定でき、上限で終わったときは別の終了コードにする。
- `exec watch` はふつうの CLI のコマンドとし、後ろで流しても前で流しても使える。なくても見張りと手当ての仕組みは成り立つ。オーケストレーターの使い方（後ろで流して通知で起きる、前で流して待つ）をガイドに書く。
- オーケストレーターが手で run を流しているときに見張りと手当てが動いても、ぶつからないことを統合テストで確かめる。
- 2026-11-13〜14 の夜の実例（型のメニューの足し忘れ・commit の対象外・branch の食い違い）を、回帰テストの場面として再現する。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。設定の例や変更が要る場合は、案を個票の対応結果と報告の `handoff` に書く。
- 関連する設計・ガイド・CLI リファレンスを直す。
- runner と routine の動きを変えるため、統合の後に orchestrator が `exec smoke` と実際の routine の 1 回の実行で確かめてから close する。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。
- 2 回目の実行（2026-11-26）: 1 回目の変更は別のブランチ `feature/prj-0001/exec-watch-coexist` にあり、develop には入っていない。その後に PJR-3M4M（見張りの手当て）が develop に入り、1 回目の変更と見張りのコード・テスト・3 つの文書（登録簿運用ガイド、ルーチン運用ガイド、コマンドリファレンス）で衝突する。
  - develop を基に、1 回目の変更をすべて入れ直す。1 回目の差分は `git diff project/prj-0001/develop...feature/prj-0001/exec-watch-coexist` で、1 回目の対応結果は `git show feature/prj-0001/exec-watch-coexist` の個票で読める。
  - 3M4M の手当て（`watch.remedies`、回数の上限、`remedy` の記録）と、T4E0 の停止・再開・`exec watch`・手で始めた run を避ける動きの両方を残す。どちらのテストも消さない。
  - 手で始めた run・人やオーケストレーターの claim・止めた印の付いた対象には、3M4M の手当ても打たないことを単体テストか統合テストで確かめる。
  - 対応結果は 1 回目の内容に 2 回目で変えた点を足す形で書く。

## 4. 作業内容

| No  | 作業                                                                                     | 担当         | 状態 | メモ                                                                                                                    |
| --- | ---------------------------------------------------------------------------------------- | ------------ | ---- | ----------------------------------------------------------------------------------------------------------------------- |
| 1   | 見張りの停止と再開の印、手で始めた作業を見分ける規則、手当ての関門を作る                 | DEV          | done | `src/exec/watch-control.ts`                                                                                             |
| 2   | 見張りに見張りの対象外・全体の停止・`--if-busy`・`cleared` の後の状態を足す              | DEV          | done | `src/exec/watch-scan.ts`・`src/commands/watch-scan.ts`                                                                  |
| 3   | `orchestrator watch-pause`・`watch-resume`・`watch-status` を足す                        | DEV          | done | `src/commands/watch-scan.ts`                                                                                            |
| 4   | `exec watch` を足す                                                                      | DEV          | done | `src/exec/watch-wait.ts`・`src/exec/watch-command.ts`・`src/exec/commands.ts`                                           |
| 5   | 単体テストと、手で流す run と見張りが並ぶ統合テスト（夜の実例 3 場面）を足す             | DEV          | done | `tests/src/exec/watch-control.test.ts`・`watch-wait.test.ts`・`watch-scan.test.ts`・`watch-coexist.integration.test.ts` |
| 6   | ガイド・CLI リファレンス・設計を直す                                                     | DEV          | done | 登録簿運用ガイド・routine 運用ガイド・CLI リファレンス・Job 実行設計                                                    |
| 7   | 2 回目: develop（PJR-3M4M 入り）を基に 1 回目の変更を入れ直し、手当てと両立させる        | DEV          | done | 見張りのコード・テスト・3 つの文書の衝突を手で解いた。3M4M のテストは消さず、報告の章番号の変更だけ合わせた             |
| 8   | 2 回目: 対象外・人やオーケストレーターの claim・止めた印に手当てを打たないことを確かめる | DEV          | done | `tests/src/exec/watch-scan.test.ts`（単体 5 件）・`watch-coexist.integration.test.ts`（実プロセスとロック）             |
| 9   | 統合の後に `exec smoke` と実際の routine の 1 回の実行で確かめる                         | orchestrator | open | 統合の後に orchestrator が行う。executor の sandbox では統合前のため行えない                                            |

## 5. 対応結果

見張り（`orchestrator watch-scan`）が、オーケストレーターや人が手で進めている対象に触らないようにし、見張りの停止と再開、記録を読んで待つ `exec watch` を足した。2 回目で、develop に先に入った PJR-3M4M の手当て（`watch.remedies`）と両立させ、対象外の対象には手当ても打たないようにした。見分け方・停止と再開・ロックの扱い・オーケストレーターの使い方は [[specdojo:register-operation-guide|登録簿運用ガイド]] の「立ち上げたままのオーケストレーターと共存する」に書いた。

- 見張りの対象外: 手で付ける印（`orchestrator watch-pause --id`）、人（名簿の `type: human`）か `specdojo-orchestrator` の claim、対象の ID を名指しするか対象の worktree の中で動いているプロセス（`/proc` の引数と作業ディレクトリ）の順に見る。当たる対象は記録に足さず、開いている止まりも解かず、朝報告の「見張りの対象外」に理由を載せる。手を離した後の回で記録する。
- 停止と再開: `orchestrator watch-pause`・`watch-resume`（`--id` なしで全体、ありで対象ごと）と `watch-status`。印は `execution/watch/watch-control.json` に置き、操作は見張りの記録へ `paused`・`resumed` の行で残す。全体を止めている間、見張りは記録も朝報告も手当ても行わない。
- ロック: 手当ての入口として `watchActionGate`（全体の停止と実行ロック）と `decideWatchHold`（対象ごと）を用意した。見張りには `--if-busy skip` を足し、別の run がロックを持っていれば `[watch-scan] skipped: exec busy` を出して何もせず、routine からは終了コード 75 で次の回に流し直させる（PJR-KVWH と同じ出力）。
- `exec watch`: 記録を読み、`--event`・`--state`・`--category`・`--target` に当たる行が新しく足されるまで待ち、出して終了コード 0 で終わる。`--timeout` の上限で終わったときは 124。止まりが解けた `cleared` の行に解けた後の状態（`done` など）を残すようにし、「終わった」を `--event cleared --state done` で待てる。
- 統合テスト: 実際の実行ロックと実プロセスで、手で流す run・手で再開するプロセス・worktree の中で同期するプロセス・対象外の印が並ぶ間、見張りが何も足さず登録簿の event も変えないこと、手を離した後の回で型のメニューの足し忘れ（`kata_rule`）・commit の対象外（`out_of_commit_scope`）・branch の食い違い（`target_ahead`）として記録することを確かめた。
- 1 回目では、本番のデータで `--dry-run` を流し、36 件のうち人が claim した blocked の schedule のタスク 9 件が対象外になり、`review` の項目は従来どおり判断待ちとして残ることを確かめた（2 回目では流し直していない）。

2 回目で変えた点:

- 入れ直し: develop を基に 1 回目の差分を入れ直した。新しいファイル（`watch-control.ts`・`watch-wait.ts`・`watch-command.ts` とそのテスト）はそのまま入れ、衝突した `src/exec/watch-scan.ts`・`src/commands/watch-scan.ts`・`tests/src/exec/watch-scan.test.ts`・3 つの文書と Job 実行設計は両方の変更を残す形で手で合わせた。
- 手当てと対象外: 手当ては `diffWatchScan` の `current`（今の止まり）からだけ選ぶため、対象外の対象は記録にも手当ての候補にも入らない。全体の停止と `--if-busy skip` の回は、観察の前に終わり手当ても起動しない。ロックの間に手当てを次の回に回す動き（3M4M の `deferredByLock`）は残した。実行ロックの判定は 3M4M の差し替え口 `isRunLive` を見張りの関門と手当ての両方で使う。
- 朝報告の章: 「1. 集計」「2. 止まっているもの」「3. 見張りの対象外」「4. 手当て」「5. この日に解けたもの」「6. 読めなかった記録」とした。3M4M の CLI 統合テストの章番号の期待を「4. 手当て」へ合わせた。
- `exec watch` で手当ても待てるように、`--event` に `remedy`・`remedy_stopped` を足し、`--category` で手当ての行も絞れるようにした。出力の 1 行にも手当ての動き・回数・コマンド・出力のパスを出す。
- 見張りのコマンドは `--if-busy` と、3M4M の `--exec-defaults`・`--no-remedy` を両方持つ。
- テスト: 単体テストに、対象外の印・対象を名指しするプロセス・オーケストレーターの claim・全体の停止の各場合に手当てを起動しないこと、印を外すと起動することを足した。統合テストは、ロックを外した後も手で始めたプロセスと印の付いた対象には手当てを打たず、手を離した後の回で branch の食い違いにだけ同期の手当てを 1 件打つことを確かめるようにした。
- 3M4M の CLI 統合テストは、起動した偽の再開の子プロセスが動いている間は見張りがその対象を「動いているプロセス」として触らないため、次の見張りの前に子が終わるのを待つようにした。期待は変えていない。

### 5.1. 迷った点と決めたこと

- コマンドの置き場所: 停止と再開は見張りと同じ `orchestrator` の下に `watch-pause`・`watch-resume`・`watch-status` として置いた。`exec watch` は完了条件どおり `exec` の下に置いた。`watch-scan` の下位コマンドにすると、引数なしの `watch-scan` の実行と混ざるためである。
- 「見張りの対象外」の印と対象ごとの停止: 同じ印とした。どちらも「この対象に見張りと手当てが触らない」ことを表し、別々に持つと片方だけ外し忘れるためである。
- ロックの間の見張り: 既定（`--if-busy scan`）では従来どおり見る。見張りは読み取りと記録だけで、PJR-40EE が夜間の run の間も見るために実行ロックを取らない形にしたためである。「ロックの間は何もせず次の回に回す」は手当てに課し（3M4M の `deferredByLock` と同じ）、見張りにも `--if-busy skip` で選べるようにした。routine `rtn-exec-watch-scan` は変えていない。
- 人の claim の範囲: schedule のタスクは claim した主体を持つため、どの状態でも人の claim なら対象外とした。register 項目は最後の event の主体しか持たないため、作業中の `in-progress` だけに当てた。人が `review` に進めた項目まで対象外にすると、判断待ちが記録と `exec watch` から消えるためである。
- プロセスの見分け: 引数が ID と一致する（`--task=<ID>`・`,` 区切りを含む）か、作業ディレクトリの道のりに `<ID>` か `-<ID>` で終わる名前がある場合とした。見張り自身と `exec watch` は、対象を名指ししても作業ではないため数えない。`/proc` を読めない環境では空として扱い、印と claim で見分ける。
- 「終わった」の表し方: 見張りの記録に新しい種類を足さず、`cleared` の行に解けた後の状態を残した。完了の全件を記録すると、初回に過去の完了がすべて足されるためである。
- `exec watch` の待ち方: 記録のファイルを決まった間隔（既定 `5s`）で読む。`fs.watch` は環境によって通知が落ちるためである。上限の終了コードは GNU `timeout` に合わせて 124 とした。
- 全体の停止の間の routine: 見張りは `[watch-scan] skipped: watch paused (...)` を出し、routine からは終了コード 75 で終わる。busy の出力ではないため、routine は済んだ skip として記録し、流し直さない。
- 2 回目: 手当てで起動した再開のコマンドも対象を名指しするため、動いている間はその対象を対象外とする。同じ対象へ手当てを重ねないための動きとして、例外を作らずそのままにした。
- 2 回目: 対象外の間は手当てを打たないため、手当ての回数（`attempt_window` の数え）も増えない。対象外になる前に打った回数はそのまま数える。
- 2 回目: 朝報告の「見張りの対象外」は「手当て」の前に置いた。止まっているものと同じく対象の一覧で、先に読んで手で進めているものを外せるようにするためである。

### 5.2. CHANGELOG に書く事項

- 区分: Added
  - `specdojo exec watch` を追加。見張りの記録に指定した種類のイベント（止まった・解けた・手当てを打った・手当てを止めた・見張りの停止と再開）が新しく足されるまで待ち、内容を出して終わる。`--state`・`--category`・`--target` で絞り、`--timeout` の上限で終わったときは終了コード 124 を返す。
  - `specdojo orchestrator watch-pause`・`watch-resume`・`watch-status` を追加。見張りを全体または対象ごとに止め・再開し、止めた・再開したことを見張りの記録に残す。
  - `orchestrator watch-scan` に `--if-busy <scan|skip>` を追加。`skip` では別の run が実行ロックを持っている間は何もせず、routine から次の回に流し直させる。
- 区分: Changed
  - `orchestrator watch-scan` が、手で付けた印・人やオーケストレーターの claim・対象を名指しするか対象の worktree で動いているプロセスに当たる対象を見張りの対象外とし、記録にも手当てにも回さず、朝報告の「見張りの対象外」に載せるようにした。見張りを全体で止めている間は記録も手当ても行わない。止まりが解けた `cleared` の行に、解けた後の状態を残すようにした。朝報告の「手当て」以降の章番号が 1 つずつ下がる。

### 5.3. 申し送り

- 保護された設定は変えていない。routine `rtn-exec-watch-scan` も変えていない。ロックの間は見張りも止めたい運用にする場合は、`action.args` に `--if-busy`・`skip` を足す案を人が判断する。
- 1 回目のブランチ `feature/prj-0001/exec-watch-coexist` は、本件の統合の後は要らない。消すかは orchestrator が判断する。
- 統合の後に、orchestrator が `exec smoke` と、`specdojo routine run --project prj-0001 --id rtn-exec-watch-scan` の 1 回の実行で、記録と朝報告（「見張りの対象外」と「手当て」の節を含む）が書かれることを確かめてから close する。あわせて `exec watch --timeout` の終了コード 124 を確かめる。
- オーケストレーターの運用メモ（`pm-orchestrator-playbook`）へ `exec watch` と `watch-pause` の使い方を足すかは、orchestrator が判断する。本件では正本のガイドにだけ書いた。

## 6. 関連ドキュメント

- [[specdojo:register-operation-guide|登録簿運用ガイド]]（「止まった実行を見張る」「止まった実行に手当てを打つ」「立ち上げたままのオーケストレーターと共存する」）
- [[specdojo:routine-operation-guide|routine運用ガイド]]
- [[specdojo:command-reference|CLIコマンドリファレンス]]（「見張りのイベントを待つ（exec watch）」、`orchestrator`）
- [[sysd-job-execution|Job実行設計]]（「止まった実行の見張り」）
- 親の項目: PJR-52EE。前の子: PJR-40EE。手当て: PJR-3M4M
