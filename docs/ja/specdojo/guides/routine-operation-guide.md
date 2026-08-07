---
specdojo:
  id: specdojo:routine-operation-guide
  type: guide
  status: ready
---

# routine運用ガイド

Routine Operation Guide

`routine` は `rtn-*.yaml` の定義に基づき、Schedule の依存グラフとは独立にタスクを定期実行する、時刻条件のトリガー層です。routine 自体は実行機構を持たず、何を実行するかは schedule 実行または register 実行に委ねます。3つの実行経路の比較は [exec運用ガイド](exec-operation-guide.md) を参照します。

現行routineが繰り返すのは「既存の未完了Schedule/Register項目を探して起動すること」です。週報のように期間ごとの新しい実行単位を生成する作業や、前回成功時点以降の変更文書を翻訳する作業は直接表現できません。これらは、再利用可能な定義から毎回Job Runを生成する[Job実行設計](../../product/040-system-design/sysd-job-execution.md)で扱います。Job連携は設計段階であり、現行CLIには未実装です。

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

| kind          | 動作                                                                                                                 |
| ------------- | -------------------------------------------------------------------------------------------------------------------- |
| `register`    | 登録簿から `filter`（`types` / `priorities` / `statuses`）と `limit` で選んだ項目を `exec run --register` で実行する |
| `exec-auto`   | `exec run --auto` を実行する（`strategy` / `parallel` / `loop` / `max_rounds` を指定できる）                         |
| `exec-resume` | 再開時刻を迎えた retryable な利用制限 task を `exec resume --due` で排他的に再開する（`parallel` を指定できる）      |

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

## 3. 実行経路への委譲

routine 自体は実行機構を持たないトリガー層です。何を実行するかは `action.kind` が指す schedule 実行または register 実行に委ねられ、状態追跡もそれぞれの経路の規則に従います。routine は発火結果として `last_run` と `last_result` を記録します。

### 3.1. 既存項目の再探索と実行単位の反復

次の2種類を区別します。

| 種類                 | 例                                      | 現行routineでの扱い                  |
| -------------------- | --------------------------------------- | ------------------------------------ |
| 既存項目の再探索     | openな高優先度todoを毎日最大3件消化する | `kind: register`で対応済み           |
| 既存計画の継続       | ReadyなSchedule taskを夜間に進める      | `kind: exec-auto`で対応済み          |
| 新しい実行単位の反復 | 毎週分の週報を作る                      | Job Runのmaterializeが必要（未実装） |
| checkpoint差分の反復 | 前回成功後に更新された文書を翻訳する    | Jobとcheckpointが必要（未実装）      |

`interval: 1w`は前回実行から7日が経過したかを判定するもので、「毎週金曜日17時」のような暦上の予定ではありません。Job連携の設計では、routineに`cron`と`timezone`を追加してこの差を扱います。
