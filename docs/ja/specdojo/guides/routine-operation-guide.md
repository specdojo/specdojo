---
specdojo:
  id: specdojo:routine-operation-guide
  type: guide
  status: ready
---

# routine運用ガイド

Routine Operation Guide

`routine` は `rtn-*.yaml` の定義に基づき、Schedule の依存グラフとは独立にタスクを定期実行する、時刻条件のトリガー層です。routine 自体は実行機構を持たず、何を実行するかは schedule 実行または register 実行に委ねます。3つの実行経路の比較は [exec運用ガイド](exec-operation-guide.md) を参照します。

routineは、既存の未完了Schedule/Register項目を探索するほか、再利用可能なJob Definitionから期間・revisionごとのJob Runを生成できます。週報や変更文書の翻訳は[Job実行設計](../../product/040-system-design/sysd-job-execution.md)を参照してください。

**対象読者**

- 日次スイープや夜間バッチなど、時刻条件で繰り返す作業を運用する開発者、運用者

**この文書で分かること**

- routine の定義ファイル、due 判定と実行、`action.kind` による実行経路への委譲

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
  kind: register
  filter:
    types:
      - todo
    priorities:
      - high
    statuses:
      - open
  limit: 3
```

## 2. due判定と実行

最終実行時刻と結果は `<routines-path>/generated/routine-state.json` に記録され、`interval`（`30m` / `6h` / `1d` / `1w` 形式）が経過したものを due と判定します。多重起動は lock で防ぐため、外部スケジューラが重複起動しても同じ routine が二重に走ることはありません。

`action.kind` で、どの実行経路を発火させるかを選びます。

| kind          | 動作                                                                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `register`    | 登録簿から `filter`（`types` / `priorities` / `statuses`）と `limit` で選んだ項目を `exec run --register` で実行する                                         |
| `exec-auto`   | `exec run --auto` を実行する（`strategy` / `parallel` / `loop` / `max_rounds` を指定できる）                                                                 |
| `exec-resume` | 再開時刻を迎えた retryable な利用制限 task を `exec resume --due` で排他的に再開する（`parallel` を指定できる）                                              |
| `exec-cycle`  | `exec cycle` を実行し、`exec-resume` → 状態再計算 → `exec-auto` を単一ロック内で順次処理する（`strategy` / `parallel` / `loop` / `max_rounds` を指定できる） |
| `job`         | `job-*.yaml`から一意なJob Runを生成し、`exec run --job`で実行する                                                                                            |

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
[routine] skipped rtn-daily-register-sweep: exec busy
```

`routine-state.json` の `last_result` は `success`、`failure`、`skipped` のいずれかです。`skipped` は failure 件数や終了コードへ加算されず、`routine list` では最終実行時刻の後ろに `(skipped)` と表示されます。

### 2.1. devcontainerでのcron設定

このリポジトリのdevcontainerでは、`.devcontainer/specdojo-routine.cron`をcron設定のテンプレートとして管理します。コンテナ起動時に`.devcontainer/post-start.sh`がワークスペースの絶対パスを埋め込み、`/etc/cron.d/specdojo-routine`へ登録してcronを起動します。これはユーザーcrontabではないため、`crontab -l`には表示されません。

現在のテンプレートは、devcontainerが稼働している間、`prj-0001`のdueなroutineを毎日1時と6時（Asia/Tokyo）に確認します。

```cron
TZ=Asia/Tokyo
CRON_TZ=Asia/Tokyo

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
```

devcontainerが停止している時刻のcronは実行されません。また、外部cronの起動時刻とroutine定義の`trigger.cron`は独立した設定です。特定時刻に確実にdue判定を行う構成では、`.devcontainer/specdojo-routine.cron`と対象の`rtn-*.yaml`で時刻・タイムゾーンを一致させます。プロジェクトIDや実行時刻を変更する場合は両方を更新し、コンテナを再起動して`post-start.sh`による再登録後に上記コマンドで確認します。

## 3. 実行経路への委譲

routine 自体は実行機構を持たないトリガー層です。何を実行するかは `action.kind` が指す schedule 実行または register 実行に委ねられ、状態追跡もそれぞれの経路の規則に従います。routine は発火結果として `last_run` と `last_result` を記録します。

### 3.1. 既存項目の再探索と実行単位の反復

次の2種類を区別します。

| 種類                 | 例                                      | 現行routineでの扱い                  |
| -------------------- | --------------------------------------- | ------------------------------------ |
| 既存項目の再探索     | openな高優先度todoを毎日最大3件消化する | `kind: register`で対応済み           |
| 既存計画の継続       | ReadyなSchedule taskを夜間に進める      | `kind: exec-auto`で対応済み          |
| 新しい実行単位の反復 | 毎週分の週報を作る                      | `kind: job`で期間ごとのRunを生成する |
| checkpoint差分の反復 | 前回成功後に更新された文書を翻訳する    | Jobのcheckpointを使用する            |

`interval: 1w`は前回実行から7日が経過したかを判定します。「毎週金曜日17時」のような暦上の予定は`trigger.cron`と`trigger.timezone`で定義します。取りこぼした実行枠は`policy.missed_run: latest|all`、実行中の重複起動は`policy.overlap: skip`で扱います。

### 3.2. 順次実行（exec-cycle）

延期 task の再開と Ready task の自動実行を続けて動かしたいとき、`exec-resume` と `exec-auto` を別々の routine に分けると、実行順は routine ファイルの列挙順や複数 routine の cron 時刻差に依存します。先行 routine が想定時間を超えると後続 routine が busy skip され、次回の発火まで進みません。

`kind: exec-cycle` は 1 つの routine で次の3 step を固定順で順次実行します。step の順序は routine ファイル名順や cron 時刻差に依存しません。

1. `exec-resume --due`（再開時刻を迎えた retryable な利用制限 task の再開）
2. schedule 状態の再計算（`exec validate` と `exec refresh`）
3. `exec run --auto`（Ready task の実行。`loop` 指定時は Ready がなくなるまで反復）

一連の処理は単一の project 実行ロック内で保持されます。step 間に手動実行・別 routine・CI の `exec run` / `exec resume` は割り込めません。後続 step は自身でロックを取り直さないため、同一 routine 実行の後続 step を busy skip することもありません。

step 単位の失敗方針は次のとおりで、`[cycle] summary: ...` に step ごとの結果が出力されます。

| step      | 失敗時の扱い                                                                      |
| --------- | --------------------------------------------------------------------------------- |
| `resume`  | 再延期や失敗があっても中断しない。依存しない Ready task の実行を継続する          |
| `refresh` | `validate` / `refresh` は Ready 選択の前提のため、失敗したら auto step を中止する |
| `auto`    | 失敗を記録する。以降の step はない                                                |

いずれかの step が失敗すると routine 実行全体は失敗（終了コード 1）になり、`routine-state.json` の `last_result` は `failure` を記録します。開始時に project が busy の場合だけ `--if-busy` 方針（既定は routine 経由で `skip`）が適用され、`skipped` として記録されます。再開対象が 0 件でも状態再計算と auto 実行へ進みます。

```yaml
id: rtn-exec-cycle
enabled: true
interval: 30m
action:
  kind: exec-cycle
  strategy: critical-first
  parallel: 2
  loop: true
  max_rounds: 5
```

`strategy` / `loop` / `max_rounds` は auto step に、`parallel` は resume step と auto step の両方に適用されます。単体の `exec resume` / `exec run --auto` と `kind: exec-resume` / `kind: exec-auto` はこれまでどおり利用できます。
