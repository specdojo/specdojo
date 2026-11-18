---
specdojo:
  id: prj-0001:pjr-1565-orchestration-queue
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: ARC
  registered_at: "2026-11-17T22:58:15Z"
  due_on: "2026-11-30"
  depends_on:
    - PJR-8KXJ
---

# PJR-1565 grade・register の実行・build を混ぜた順番の予約を、specdojo の機能で流す

## 1. 概要

orchestrator が scratchpad のシェルスクリプトで grade・exec run・build の順番を予約しており、セッションが終わると消え、利用者から見えないため、specdojo の機能で予約して流せるようにする。

## 2. 入力

- 利用者の問い（2026-11-18）: 実行の予約は specdojo の機能か、orchestrator が script を書いているのか
- orchestrator の調べ（2026-11-18）: 予約は orchestrator が書いたシェルスクリプト（前の出力に終わりの行が出るまで 30 秒ごとに確かめ、次の npx specdojo を実行する）。specdojo にあるのは exec run --register A B C（--on-failure）、register の --depends-on、--if-busy wait（同じ種類のロックだけ）。grade・exec run・npm run build を混ぜた順番と、別の種類の作業の終わりを待つ機能はない。job は validate と list だけで、routine から起動される
- 利用者の決定（2026-11-18）: 方式（job の定義に段を並べる、exec run に予約を持たせる など）は executor が比べて決め、理由を書く。予約の中身と進み具合が登録簿か exec status から見えること。dist の作り直しは統合の後の処理の項目に任せる

## 3. 完了条件

- grade・`exec run`（register・schedule）・統合の後の処理を混ぜた順番の予約を、specdojo のコマンドで作って流せるようにする。方式（job の定義に段を並べる、`exec run` に予約を持たせる など）を 2 案以上比べて決め、比べた結果と理由を個票の対応結果に書く。
- 予約は git の管理下か登録簿の横に残り、orchestrator のセッションが終わっても消えない。予約の中身・進み具合・止まった段と理由が、登録簿か `exec status` から見える。
- 各段は前の段の終わり（成功・失敗）を待って始まる。段が失敗したときに止めるか続けるかを指定できる。待つ処理は、プロセス名の検索（`pgrep -f` など）に頼らない。
- 段の中身は今のコマンドを呼ぶだけとし、任意のシェルを受け付けない。dist の作り直しは [[prj-0001:pjr-8kxj-post-integration-build-dist|PJR-8KXJ]] の統合の後の処理に任せる。
- 予約の作成・順番どおりの実行・失敗時の停止と継続を、単体テストか統合テストで確かめる。
- orchestrator の定義（`.agents/specdojo-orchestrator.agent.md`）とプロジェクトの運用メモで、スクリプトの代わりにこの機能を使うように書き換える案を個票の対応結果に書く。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。
- 設計の変更を関係する文書（`docs/ja/specdojo/references/command-reference.md`・exec の設計書など）へ反映する。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                  | 担当 | 状態 | メモ                                                  |
| --- | ----------------------------------------------------- | ---- | ---- | ----------------------------------------------------- |
| 1   | 予約の方式を比べて決める                              | ARC  | done | `exec queue` を新設（対応結果の「方式の比較と決定」） |
| 2   | 予約の作成・実行・進み具合の表示を実装する            | ARC  | done | `src/exec/queue.ts`・`src/exec/queue-command.ts`      |
| 3   | テストと文書を足し、orchestrator の定義の変更案を書く | ARC  | done | 案は対応結果の「保護された設定の変更案」              |

## 5. 対応結果

### 5.1. 実施内容

- `specdojo exec queue` を足した。`add <queue-id> --step <spec> / --step-continue <spec>` で予約を作り、`run <queue-id>` で順に流し、`status [queue-id]` で中身と進み具合を、`cancel <queue-id> --msg` で取り消しを行う（`src/exec/queue.ts`・`src/exec/queue-command.ts`、`src/exec/commands.ts` で登録）。
- 予約は `<execution_path>/queues/<queue-id>.json` に置く。段ごとの状態（`pending`・`running`・`succeeded`・`failed`）・時刻・終了コード・要約と、予約の状態（`succeeded`・`completed_with_failures`・`stopped`・`cancelled`）・`stopped_step`・`reason` を段の前後で書く。
- 段は許可リストの `grade run ...`・`exec run ...`（`--register`・`--register-filter`・`--auto`・`--task` のどれかが要り、`--job`・`--plan` は拒否）・`post-integration build-dist` に限る。空白だけで区切り、引用符とバックスラッシュは拒否し、シェルを通さず specdojo の CLI に argv で渡す。`build-dist` は PJR-8KXJ の親検証の `build`（`npm run build` の固定 argv）を exec のロックを待って取ってから流し、失敗の印（`dist/.specdojo-build-failed`）も統合の後と同じ関数（`updateDistBuildFailureMarker` として `src/exec/post-integration.ts` から切り出した）で扱う。
- 各段は runner が起動した子プロセスの `close` を待ってから次を始める。`pgrep -f` などのプロセス名の検索は使わない。`--step` の段が失敗すると止まり、`--step-continue` の段は失敗しても進む。止まった予約は `exec queue run` で失敗した段から再開し、終わった段は繰り返さない。
- `exec status` の末尾に、終わっていない予約を `queues:` として 1 行ずつ出すようにした。
- 単体テスト `tests/src/exec/queue.test.ts`（段の解析と許可リスト、作成と一覧、順番どおりの実行、失敗時の停止と継続、停止からの再開、実行中の取り消し、ロックの取り合い、例外の扱い）を足した。
- [[specdojo:command-reference]] に「実行の予約（exec queue）」の節と exec の一覧の行を、[[specdojo:exec-operation-guide]] のユースケースの表に行と説明を、[[sysd-job-execution]] の「順次実行 Job」に Job との分担を書いた。

### 5.2. 方式の比較と決定

| 案                                            | 良い点                                                                               | 合わない点                                                                                                                                                                                                |
| --------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A: Job の定義（`task.steps`）に段を並べる     | 既にある。冪等キー・attempt・routine 起動を使える                                    | 段は `/bin/sh` で解釈される任意のコマンドで、完了条件の「任意のシェルを受け付けない」に反する。予約のたびに `jobs_path` へ定義と入力を書く必要がある。再試行は先頭の段から始まり、終わった run を繰り返す |
| B: `exec run` に予約を持たせる（`--then` 等） | 既存の入口のまま使える                                                               | `exec run` は exec のロックを持つため、別のロックの grade や build を中に入れるとロックの持ち方が複雑になる。オプションがさらに増え、予約の中身を後から見る場所がない                                     |
| C: `exec queue` を新設する（採用）            | 段を許可リストの argv に限れる。予約ファイルに段ごとの状態が残り、途中から再開できる | 新しいコマンドと保存先が増える                                                                                                                                                                            |

C を選んだ。完了条件のうち、任意のシェルを受け付けないこと・予約がセッションをまたいで残り見えること・止まった段から再開できることを、既存の仕組みを変えずに満たせるのが C だけだったため。

### 5.3. 決めた点と理由

- 保存先は登録簿の横ではなく `<execution_path>/queues/` とした。予約は run の記録と同じ実行の記録で、登録簿は課題・判断の台帳のため。Git の管理下に残り、`exec validate --records-only` の配置の検査にも当たらない（`.json` は runs の外では検査の対象外）。commit は記帳と同じく利用者か orchestrator が行う。
- 段の間で exec のロックを持ち続けない。各段の `exec run` が自分でロックを取るため、予約の runner が持つと子の run が待ち続ける。この結果、段の間に別の run が入り得る。同じ予約を 2 つの runner が流さないよう、予約ごとのロック（`exec/.locks/queue-<queue-id>.lock`、Git の無視対象）を取る。
- 終了コードは `succeeded` のときだけ 0、`completed_with_failures`・`stopped`・取り消しは 1 とした。続ける段の失敗も後から確かめるべき結果のため。
- runner が落ちて `running` のまま残った段は、再開時にもう一度流す。段の中の `exec run` は自分の再開の仕組み（`--resume` など）を持つため、予約の層では途中の状態を推測しない。`status` では予約のロックが生きていなければ `running (runner not alive)` と出す。
- `--project` を書かない段には予約の project を足す。既定の project が変わっても予約の対象がずれないようにするため。
- dist の作り直しを自動で挟むことはせず、`post-integration build-dist` の段を明示したときだけ流す。統合の後の自動の build は PJR-8KXJ の `pipeline.post_integration` に任せる。

### 5.4. 保護された設定の変更案

`.agents/specdojo-orchestrator.agent.md`（保護）の「実行の運び方」に次の行を足す案。反映は利用者の承認のもと feature ブランチで行う。

```markdown
- grade・`exec run`・build を順に流すときは、待ち合わせのシェルスクリプトを書かず `specdojo exec queue add <queue-id> --step "..."` で予約し、`specdojo exec queue run <queue-id>` を background で流す。進み具合は `exec queue status <queue-id>` か `exec status` の `queues:` で確かめる。止まった予約は原因を直してから同じ `exec queue run` で再開する。
```

プロジェクトの運用メモ `docs/ja/projects/prj-0001/030-project-management/pm-orchestrator-playbook.md`（保護の対象外だが、完了条件に従い案として書く）の「列の終わりを待って次を流す待機を書くときは…」の行を次へ置き換える案。

```markdown
- 列の終わりを待って次を流すときは、待機のスクリプトを書かず `exec queue` で予約する（[[specdojo:command-reference|コマンドリファレンス]] の「実行の予約（exec queue）」）。予約ファイル（`execution/queues/<queue-id>.json`）は記帳と同じく commit する。どうしても待機を書く場合も、相手のプロセスを `pgrep -f` のパターンで探さない（`落とし穴` を参照）。
```

### 5.5. CHANGELOG に書く事項

- 区分: Added
- 文案: `specdojo exec queue` を追加した。grade・`exec run`（register・schedule）・`post-integration build-dist` を混ぜた順番を `execution/queues/<queue-id>.json` に予約し、前の段の終わりを待って順に流す。段ごとに失敗時の停止・継続を指定でき、止まった段から再開できる。予約の進み具合は `exec queue status` と `exec status` で確かめられる（PJR-1565）。

### 5.6. 残課題

- 上記の orchestrator の定義と運用メモの変更案の反映（利用者）。
- 予約の作成から実行までを実プロセスで通す統合テストは足していない。段の実行は差し替え可能な関数として単体テストで確かめ、CLI は `exec queue --help`・`status`・許可リスト外の段の拒否を手で確かめた。

## 6. 関連ドキュメント

- [[prj-0001:pjr-8kxj-post-integration-build-dist]]
