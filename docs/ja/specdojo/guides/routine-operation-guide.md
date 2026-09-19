---
specdojo:
  id: specdojo:routine-operation-guide
  type: guide
  status: ready
---

# routine運用ガイド

Routine Operation Guide

`routine` は `rtn-*.yaml` の定義に基づき、Schedule の依存グラフとは独立にタスクを定期実行する、時刻条件のトリガー層です。routine 自体は実行機構を持たず、何を実行するかは Job Definition に委ねます。Job が schedule 実行または register 実行を呼び出します。実行経路の比較は [exec運用ガイド](exec-operation-guide.md) を参照します。

routineは、既存の未完了Schedule/Register項目を探索するほか、再利用可能なJob Definitionから期間・revisionごとのJob Runを生成できます。週報や変更文書の翻訳は[Job実行設計](../../product/040-system-design/sysd-job-execution.md)を参照してください。

継続品質評価は `job-grade-kata` や `job-grade-deliverable` の Job Definition から `action.kind: job` の routine で定期起動します。文書の選択、各文書の executor / reporter 実行、`grade apply --path --analysis-from` の逐次処理は `tools/grade/run-per-document.sh` が持ちます。定期 Job は `--stages 1` で codex 単段を選びます。Job runnerは`task.command`からその入口を直接起動してevidenceを記録し、成功後の結果判断だけを`task.analysis`のreporter agentへ委譲します。責務の切り分け基準は [Job定義標準](../standards/job-definition-standard.md) を参照します。

**対象読者**

- 日次スイープや夜間バッチなど、時刻条件で繰り返す作業を運用する開発者、運用者

**この文書で分かること**

- routine の定義ファイル、due 判定と実行、`action.job` による Job への委譲

**次に読む文書**

- schedule 実行の詳細は [Schedule実行運用ガイド](schedule-operation-guide.md)、register 実行の詳細は [登録簿運用ガイド](register-operation-guide.md) を参照してください。
- レートリミット再開のための routine 例は [exec運用ガイド](exec-operation-guide.md) の `中断・訂正・再実行` を参照してください。

## 1. routineの定義

`routine` は `rtn-*.yaml` の定義に基づき、Schedule の依存グラフとは独立にタスクを定期実行します。CLI は常駐しません。外部スケジューラ（cron / CI の scheduled workflow）から `routine run --due` を冪等に呼び出す前提です。

定義は `.specdojo/specdojo.config.json` の `routines_path` 配下に `rtn-<slug>.yaml` として置き、`id` はファイル名と一致させます。

```yaml
id: rtn-daily-register-sweep
name: 登録簿 open todo の日次スイープ
enabled: true
interval: 1d
action:
  kind: job
  job: job-register-sweep
  inputs:
    types: todo
    priorities: high
    statuses: open
    limit: "3"
```

### 1.1. 複数 action の順次実行

通常は `action` に1つの Job を指定します。複数の独立した委譲単位を同じ実行機会で順序保証したい場合は、`action` に1件以上の配列を指定します。各要素は `kind: job` と参照する Job、入力を持ちます。

```yaml
id: rtn-staged-execution
enabled: true
interval: 1d
action:
  - kind: job
    job: job-exec-auto
    inputs:
      strategy: fifo
      parallel: "1"
  - kind: job
    job: job-exec-auto
    inputs:
      strategy: critical-first
      parallel: "2"
  - kind: job
    job: job-final-check
    inputs:
      mode: strict
```

配列は先頭から1段ずつ同期的に実行し、前段が完了してから次段を起動します。途中の段が `failure` または `skipped` でも、失敗分を後段で拾う運用を可能にするため、残りの段を続行します。全体結果は `failure`、`skipped`、`success` の優先順で集約します。つまり、1段でも失敗すれば `failure`、失敗がなく1段でも skip なら `skipped`、全段成功時だけ `success` です。段間の待機と失敗時中断の切り替えは提供しません。

配列 action の実行後は、通常の `last_result` に加えて段ごとの `index`（1始まり）、`kind`、`result` を `last_action_results` へ記録します。単一オブジェクトの action では `last_action_results` を記録せず、既存の状態形式を維持します。

```json
{
  "last_result": "failure",
  "last_action_results": [
    { "index": 1, "kind": "job", "result": "failure" },
    { "index": 2, "kind": "job", "result": "success" },
    { "index": 3, "kind": "job", "result": "success" }
  ]
}
```

### 1.2. grade の単段評価

Kata と成果物の定期評価は、`codex-expert-executor` と `gemma-reporter` の単段で実行します。`job-grade-kata` と `job-grade-deliverable` は `tools/grade/run-per-document.sh --stages 1` を起動し、条件付きの後続段は持ちません。変更済み・未評価・段未完了を横断的に再評価する `rtn-grade-recheck` は `kind: all`、`changed_only: true`、`ungraded: true`、`incomplete: true`、`limit: 15` を入力します。

成果物は `rtn-grade-deliverable-recheck` が `job-grade-deliverable` を起動します。Job は同じ script を `--stages 1 --target deliverable` で実行し、成果物カタログから変更済み・未評価・段未完了の Markdown 成果物だけを最大10件選びます。評価結果は成果物の最新 grade と成果物ごとの `done_criteria` 詳細へ上書きされるため、実行ごとの review result は増やしません。

`rtn-grade-deliverable-recheck` は毎日1時、`rtn-grade-recheck` は毎日6時に実行し、いずれも `missed_run: skip` とします。devcontainer の cron は1時・5時・6時に `routine run --due` を呼び、5時は dashboard 更新など同じ due runner を使う別 routine の起動機会です。コンテナ停止中の実行枠を日中へ持ち越さず、対話的な register 実行との競合を避けます。

両 routine では、Job の `task.precondition` が `grade list` を使って script の selection-v4 と同じ変更済み・未評価・再試行可能な段未完了の和集合、辞書順、対象種別、件数上限を先に評価します。連続失敗上限に達した文書は `grade state --exhausted` で同じ和集合に加えてから件数上限を適用し、処理対象からは外して report-only 対象にします。処理対象も report-only 対象も0件なら Job Run、plan、result、evidence を作らず、command と analysis reporter も起動しません。routine はこの結果を `skipped` として受け取り、`routine-state.json` の `last_run` / `last_result` と、cron の場合は `last_scheduled_for` を更新します。

| 段  | executor / reporter                        | 対象と役割                                 |
| --- | ------------------------------------------ | ------------------------------------------ |
| 1   | `codex-expert-executor` / `gemma-reporter` | 対象文書をリファレンスなしで評価し確定する |

Job runnerは、この入口をmaterialize済みの引数で1回起動し、コマンド、終了コード、stdout/stderrをevidenceへ記録します。コマンドが成功した場合だけanalysis reporterが、未完了の段、失敗の切り分け、verdict と score の偏りを判断します。executor、reporter、対象種別、件数上限はscriptの引数またはJobの`inputs`から解決します。

scriptの`--run-id`にはJob Run IDを渡すため、rate limitや中断後に同じJob Runをretryすると完了済みの処理を飛ばして再開します。通常の agent / apply 失敗は `<execution_path>/grade/pipeline/` に完了段、失敗段、本文ハッシュ、連続失敗回数を保存します。次の日次実行枠でも本文ハッシュが同じなら失敗段から再開し、本文が変われば古い到達状況を使わず1段目から評価します。3段構成から単段へ切り替えた時点で、現在本文に対して有効な `stage_total: 3` の state が残っている場合は、既存評価を完了済みとみなして state を削除します。rate limit は失敗回数に数えません。既定で同じ段が3回連続失敗すると再試行から外し、結果の `retry_exhausted` 行で人手対応を報告します。`period`は対象期間の表示だけに使い、実行や再開の同一性には使いません。

## 2. due判定と実行

最終実行時刻と結果は `<routines-path>/generated/routine-state.json` に記録され、`interval`（`30m` / `6h` / `1d` / `1w` 形式）が経過したものを due と判定します。配列 action の場合は段別結果も同じ state に記録します。多重起動は lock で防ぐため、外部スケジューラが重複起動しても同じ routine が二重に走ることはありません。

単一オブジェクトの `action.kind`、配列の各要素の `kind` とも `job` だけを受け付けます。routine は `job-*.yaml` から一意な Job Run を生成して `exec run --job` へ委譲し、コマンド、入力の型・値域、冪等キーは Job Definition が担います。旧 `register` / `exec-auto` / `exec-resume` / `exec-cycle` kind は 2026-09-09 に廃止し、同等の command Job へ移行しました。

| Job                  | 動作                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------- |
| `job-register-sweep` | flat list 入力で登録簿を絞り込み、選択した項目を `exec run --register` 相当で実行する |
| `job-exec-auto`      | `exec run --auto` を実行する                                                          |
| `job-exec-resume`    | `exec resume --due` を実行する                                                        |
| `job-exec-cycle`     | `exec cycle` を実行する                                                               |

週報Jobを毎週金曜日17時（Asia/Tokyo）に起動する例です。

```yaml
id: rtn-weekly-report
enabled: true
trigger:
  cron: "0 17 * * 5"
  timezone: Asia/Tokyo
action:
  kind: job
  job: job-weekly-report
  inputs:
    period: "{{scheduled_at | iso_week}}"
policy:
  missed_run: all
  overlap: skip
```

```bash
# due な routine をまとめて実行する（cron / CI から呼ぶ想定）
specdojo routine run --project <project-id> --due

# 特定の routine を due 判定と無関係に即時実行する
specdojo routine run --project <project-id> --id rtn-daily-register-sweep

# 実行内容を確認する（実行も last_run 記録もしない）
specdojo routine run --project <project-id> --due --dry-run
```

各 action は委譲先へ `--if-busy skip` を渡します。同じ project の `exec run` または `exec resume` が動作中なら待機せず、次のように記録して終了します。単一の routine 実行内では再試行せず、次回の cron tick に委ねます。

```text
[routine] skipped rtn-daily-register-sweep: job action skipped
```

`routine-state.json` の `last_result` は `success`、`failure`、`skipped` のいずれかです。`skipped` は project busy または Job precondition の skip を表し、failure 件数や終了コードへ加算されません。`routine list` では最終実行時刻の後ろに `(skipped)` と表示されます。

### 2.1. devcontainerでのcron設定

このリポジトリのdevcontainerでは、`.devcontainer/specdojo-routine.cron`をcron設定のテンプレートとして管理します。コンテナ起動時に`.devcontainer/post-start.sh`がワークスペースの絶対パスを埋め込み、`/etc/cron.d/specdojo-routine`へ登録してcronを起動します。これはユーザーcrontabではないため、`crontab -l`には表示されません。

現在のテンプレートは、devcontainerが稼働している間、`prj-0001`のdueなroutineを毎日1時と6時（Asia/Tokyo）に確認します。

```cron
TZ=Asia/Tokyo
CRON_TZ=Asia/Tokyo

*/5 * * * * node /usr/bin/date -u +\%Y-\%m-\%dT\%H:\%M:\%SZ > __WORKSPACE_DIR__/logs/routine-cron-heartbeat.log
0 1,6 * * * node cd __WORKSPACE_DIR__ && /usr/local/bin/node dist/specdojo.js routine run --project prj-0001 --due >> logs/routine-exec-cycle.log 2>&1
```

登録内容と稼働状態は次のコマンドで確認します。

```bash
# /etc/cron.dへ登録された内容
sudo cat /etc/cron.d/specdojo-routine

# cronプロセス
pgrep -a cron

# routine定義とdue状態
specdojo routine validate --project prj-0001
specdojo routine list --project prj-0001

# 実行対象だけを確認する（実行・状態更新なし）
specdojo routine run --project prj-0001 --due --dry-run

# cron実行後のログ（初回実行前はファイルが存在しない）
tail -n 100 logs/routine-exec-cycle.log

# cronデーモンの生存確認。稼働中なら5分ごとに更新される
cat logs/routine-cron-heartbeat.log
```

`post-start.sh` は cron の起動直後の status 確認に失敗した場合、その失敗を無視せず終了します。起動後の停止は `routine-exec-cycle.log` だけでは「due 対象なし」と区別できないため、`routine-cron-heartbeat.log` の最終時刻が10分以上更新されていないことを検知条件にします。devcontainerが停止している時刻のcronは実行されません。また、外部cronの起動時刻とroutine定義の`trigger.cron`は独立した設定です。特定時刻に確実にdue判定を行う構成では、`.devcontainer/specdojo-routine.cron`と対象の`rtn-*.yaml`で時刻・タイムゾーンを一致させます。プロジェクトIDや実行時刻を変更する場合は両方を更新し、コンテナを再起動して`post-start.sh`による再登録後に上記コマンドで確認します。

## 3. 実行経路への委譲

routine 自体は実行機構を持たないトリガー層です。何を実行するかは `action.job` の Job Definition に委ねられ、状態追跡も Job が呼ぶ schedule 実行または register 実行の規則に従います。routine は発火結果として `last_run` と `last_result`、配列 action では `last_action_results` を記録します。

### 3.1. 既存項目の再探索と実行単位の反復

次の2種類を区別します。

| 種類                 | 例                                      | 現行routineでの扱い                  |
| -------------------- | --------------------------------------- | ------------------------------------ |
| 既存項目の再探索     | openな高優先度todoを毎日最大3件消化する | `job-register-sweep`へ入力を渡す     |
| 既存計画の継続       | ReadyなSchedule taskを夜間に進める      | `job-exec-auto`へ入力を渡す          |
| 新しい実行単位の反復 | 毎週分の週報を作る                      | `kind: job`で期間ごとのRunを生成する |
| checkpoint差分の反復 | 前回成功後に更新された文書を翻訳する    | Jobのcheckpointを使用する            |

`interval: 1w`は前回実行から7日が経過したかを判定します。「毎週金曜日17時」のような暦上の予定は`trigger.cron`と`trigger.timezone`で定義します。取りこぼした実行枠は`policy.missed_run: skip|latest|all`で扱います。`skip`は現在の分が cron に一致するときだけ実行し、停止中の枠を再実行しません。実行中の重複起動は`policy.overlap: skip`で扱います。

### 3.2. 順次実行（exec-cycle）

延期 task の再開と Ready task の自動実行を続けて動かしたいとき、`job-exec-resume` と `job-exec-auto` を別々の routine に分けると、実行順は routine ファイルの列挙順や複数 routine の cron 時刻差に依存します。先行 routine が想定時間を超えると後続 routine が busy skip され、次回の発火まで進みません。

`job-exec-cycle` は 1 つの routine で次の5 step を固定順で順次実行します。step の順序は routine ファイル名順や cron 時刻差に依存しません。

1. `exec-resume --due`（再開時刻を迎えた retryable な利用制限 task の再開）
2. `index build`（`.specdojo/doc-index.json` の再構築）
3. 古い track の再生成（必要な track ごとの `schedule build --force`）
4. schedule 状態の再計算（`exec validate` と `exec refresh`）
5. `exec run --auto`（Ready task の実行。`loop` 指定時は Ready がなくなるまで反復）

step 3 は、`sch-track-<track>.yaml` がないか、`sch-strategy-<track>.yaml` の更新時刻が track より新しい場合だけ実行します。これは `exec validate` の警告と同じ判定です。該当 track がなければ step 3 のコマンドとログを省略します。再生成に失敗した場合は古い track のまま状態再計算や auto 実行へ進みません。自動再生成は `exec cycle` に限定し、単発の `exec run` と `exec refresh` の動作は変えません。

`index build` を状態再計算より前に挟むのは、直前の step（`resume` や、前回 routine 実行の取りこぼし）が新設した成果物を、Ready task の plan 生成が参照できるようにするためです。これを省くと、ある task が新設した成果物を同じ project の後続 task が wikilink/ID 参照で解決できず、生成された plan に `Unresolved ID reference` の警告が残ることがあります。`loop` 指定時は、auto step 内のラウンドを跨ぐたびにも `index build` → 古い track の再生成 → `exec refresh` の順で再実行されます。前ラウンドで新設された成果物を解決できるだけでなく、strategy の更新で追加された次 track の task も同じ cycle の次ラウンドから Ready 選択できます。

一連の処理は単一の project 実行ロック内で保持されます。step 間に手動実行・別 routine・CI の `exec run` / `exec resume` は割り込めません。後続 step は自身でロックを取り直さないため、同一 routine 実行の後続 step を busy skip することもありません。

step 単位の失敗方針は次のとおりで、`[cycle] summary: ...` に step ごとの結果が出力されます。

| step       | 失敗時の扱い                                                                       |
| ---------- | ---------------------------------------------------------------------------------- |
| `resume`   | 再延期や失敗があっても中断しない。依存しない Ready task の実行を継続する           |
| `index`    | `index build` は後続 step の参照解決の前提のため、失敗したら残りの step を中止する |
| `schedule` | 古い track の再生成に失敗したら状態再計算と auto step を中止する                   |
| `refresh`  | `validate` / `refresh` は Ready 選択の前提のため、失敗したら auto step を中止する  |
| `auto`     | 失敗を記録する。以降の step はない                                                 |

いずれかの step が失敗すると routine 実行全体は失敗（終了コード 1）になり、`routine-state.json` の `last_result` は `failure` を記録します。開始時に project が busy の場合だけ `--if-busy` 方針（既定は routine 経由で `skip`）が適用され、`skipped` として記録されます。再開対象が 0 件でも状態再計算と auto 実行へ進みます。

```yaml
id: rtn-exec-cycle
enabled: true
interval: 30m
action:
  kind: job
  job: job-exec-cycle
  inputs:
    strategy: critical-first
    parallel: "2"
    loop: "true"
    max_rounds: "5"
```

`strategy` / `loop` / `max_rounds` は auto step に、`parallel` は resume step と auto step の両方に適用されます。単体の `exec resume` / `exec run --auto` はこれまでどおり利用でき、routine からは対応する Job を参照します。
