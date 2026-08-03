---
specdojo:
  id: specdojo:routine-operation-guide
  type: guide
  status: ready
---

# routine運用ガイド

Routine Operation Guide

`routine` は `rtn-*.yaml` の定義に基づき、Schedule の依存グラフとは独立にタスクを定期実行する、時刻条件のトリガー層です。routine 自体は実行機構を持たず、何を実行するかは schedule 実行または register 実行に委ねます。3つの実行経路の比較は [exec運用ガイド](exec-operation-guide.md) を参照します。

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

最終実行時刻は `<routines-path>/generated/routine-state.json` に記録され、`interval`（`30m` / `6h` / `1d` / `1w` 形式）が経過したものを due と判定します。多重起動は lock で防ぐため、外部スケジューラが重複起動しても同じ routine が二重に走ることはありません。

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

## 3. 実行経路への委譲

routine 自体は実行機構を持たないトリガー層です。何を実行するかは `action.kind` が指す schedule 実行または register 実行に委ねられ、状態追跡もそれぞれの経路の規則に従います。routine が記録するのは `last_run` だけです。
