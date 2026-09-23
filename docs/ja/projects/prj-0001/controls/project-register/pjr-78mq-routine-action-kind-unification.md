---
specdojo:
  id: prj-0001:pjr-78mq-routine-action-kind-unification
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-09-08T13:57:47Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-09T12:52:34Z"
---

# PJR-78MQ routine の action.kind を job へ統合する

## 1. 概要

routine の `action.kind` は 5 種あるが、実装の構造が同じである。job がコマンドを決定論的に
実行できるようになれば、すべてを job として定義できる。

## 2. 現状

### 2.1. 実装は同一の形をしている

```typescript
if (action.kind === "exec-auto")   { const args = buildExecAutoArgs(...);   return spawnSelf(args); }
if (action.kind === "exec-resume") { const args = buildExecResumeArgs(...); return spawnSelf(args); }
if (action.kind === "exec-cycle")  { const args = buildExecCycleArgs(...);  return spawnSelf(args); }
if (action.kind === "job")         { const args = buildJobRunArgs(...);     return spawnSelf(args); }
```

いずれも引数を組み立てて自分自身を spawn するだけである。`register` も同様の構造を持つ。差は
どのサブコマンドを呼ぶかだけで、`kind` ごとに専用の引数組み立て関数と検証ロジックが存在する。

### 2.2. 実際の利用状況

| routine                      | action kind | 参照 job                     |
| ---------------------------- | ----------- | ---------------------------- |
| `rtn-daily-register-sweep`   | register    | —                            |
| `rtn-exec-cycle`             | exec-cycle  | —                            |
| `rtn-exec-limit-resume`      | exec-resume | —                            |
| `rtn-grade-kata`             | job         | `job-grade-kata`             |
| `rtn-grade-recheck`          | job         | `job-grade-kata`             |
| `rtn-translate-updated-docs` | job         | `job-translate-updated-docs` |
| `rtn-weekly-report`          | job         | `job-weekly-report`          |

`job-grade-kata` は 2 つの routine から異なる入力で呼ばれている。job の再利用は成立している
が、その恩恵を受けられるのは `kind: job` の routine だけである。

## 3. 統合で得られるもの

| 観点             | 現在                          | 統合後                 |
| ---------------- | ----------------------------- | ---------------------- |
| routine の分岐   | 5 種                          | 1 種                   |
| 引数組み立て     | kind ごとに専用関数           | job 定義（YAML）       |
| 入力の型と既定値 | kind ごとに個別実装           | job の `inputs` を共用 |
| 冪等キー         | job のみ                      | すべてに適用可         |
| 再利用           | job のみ複数 routine から可能 | すべて可能             |
| 手動実行         | job のみ `exec run --job`     | すべて可能             |

冪等キーと手動実行がすべての種別で使えるようになる点が大きい。現状 `exec-cycle` は手動で
同じ条件を再現する手段が限られる。

想定する形は次のとおりである。

```yaml
id: job-exec-cycle
inputs:
  parallel: { type: integer, default: 1 }
task:
  mode: command
  command: |
    specdojo exec run --auto --loop --parallel {{inputs.parallel}}
```

routine 側は単純になる。

```yaml
action:
  kind: job
  job: job-exec-cycle
  inputs:
    parallel: 1
```

## 4. 前提と未解決の論点

### 4.1. PJR-GWY4 が前提である

job は現在コマンドを直接実行できない。`task.mode` は `edit` / `review` のみで agent 駆動に
限られる。[[prj-0001:pjr-gwy4-job-deterministic-command]] の実装が前提となる。

### 4.2. 入力の検証水準が下がらないようにする

現在は TypeScript で `strategy` / `parallel` / `priorities` などの値を検証している。job の
`inputs` は型を持つが、値の妥当性（`strategy` が `critical-first` か `fifo` か）まで検証
できるかを確認する必要がある。検証が緩くなれば、誤設定が実行時まで露見しない。

### 4.3. `register` は入れ子の入力を持つ

`filter.types` / `filter.priorities` のような入れ子の条件を持つ。job の `inputs` は
`string` / `integer` / `boolean` / `list` で、入れ子の mapping を表現できない。追加設計が要る。

### 4.4. 互換性の方針

既存の 7 routine をすべて `kind: job` へ移行し、旧 `register` / `exec-auto` / `exec-resume` /
`exec-cycle` は 2026-09-09 付で受け付けを終了する。リポジトリ内の定義を同一変更で移行でき、
外部公開済みの stable schema version もないため、移行期間は設けない。旧定義は
`routine validate` でエラーにし、対応する `job-register-sweep` / `job-exec-auto` /
`job-exec-resume` / `job-exec-cycle` への書き換えを廃止条件かつ移行手順とする。

## 5. 完了条件

- `exec-auto` / `exec-resume` / `exec-cycle` / `register` が job として定義できる。
- 定義した job が routine からも `exec run --job` からも実行できる。
- 入力の妥当性検証が、現在の TypeScript による検証と同等以上である。値域の制約を含む。
- `register` の入れ子入力が表現できる。または表現できない場合の代替が定義されている。
- 既存の 7 routine が、移行後も同じ動作をする。
- 互換性の方針が決まっている。`kind` を残す場合はその期間と廃止条件が示されている。
- 統合により削除できた重複コードが示されている。

## 6. 作業内容

| No  | 作業                                  | メモ                                 |
| --- | ------------------------------------- | ------------------------------------ |
| 1   | 入力検証の水準を設計する              | 値域制約を job schema で表現できるか |
| 2   | `register` の入れ子入力の扱いを決める | 表現方法または代替                   |
| 3   | 既存 4 種を job 定義へ移す            |                                      |
| 4   | routine の分岐を 1 種へ集約する       | 重複した引数組み立てを削除           |
| 5   | 互換性の方針に沿って移行する          |                                      |
| 6   | 単体テストを追加する                  |                                      |

## 7. 対応結果

- routine schema と実装を `action.kind: job` の1経路へ集約し、旧4 kind 固有の入力型、検証、
  引数組み立て、register 選択・実行分岐を削除した。具体的には `buildExecAutoArgs` /
  `buildExecResumeArgs` / `buildExecCycleArgs` / `buildRegisterRunArgs`、routine 内の
  `selectRegisterItems`、`executeRoutineAction` の5分岐を除去した。既存7 routine はすべて Job
  参照へ移行した。
- `job-exec-auto` / `job-exec-resume` / `job-exec-cycle` / `job-register-sweep` を追加し、routine と
  `exec run --job` のどちらからも同じ command を materialize できるようにした。
- Job input に `enum` / `minimum` / `maximum` を追加し、定義時の既定値と Run materialize 時の
  入力へ同じ値域検証を適用した。旧 routine の strategy と正整数制約を Job 側へ移した。
- register の入れ子 filter は `types` / `priorities` / `statuses` の list と `limit` の integer へ
  平坦化した。`exec run --register-filter` が値を再検証し、従来と同じ既定条件、ID順、上限で選ぶ。
- command Job から同一 project の `specdojo exec` を呼ぶ場合は、親 runner の lock token と実際の
  owner token の一致を検証して lock を継承する。自己デッドロックを避けつつ Job 全体の排他を保つ。
- 互換移行は段階移行なしとし、旧 kind を schema と parser の双方で拒否する。移行日と置換先を
  routine 運用ガイドおよび command reference に記載した。
- 残課題はない。

## 7. 対応結果

`RoutineActionKind` が `job` のみとなり、既存 7 routine すべてが `job` へ移行した。

| routine                    | 変更前        | 変更後 |
| -------------------------- | ------------- | ------ |
| `rtn-daily-register-sweep` | `register`    | `job`  |
| `rtn-exec-cycle`           | `exec-cycle`  | `job`  |
| `rtn-exec-limit-resume`    | `exec-resume` | `job`  |
| 他 4 件                    | `job`         | `job`  |

`src/routine.ts` が 295 行減り、kind ごとに重複していた引数組み立てと検証が削除された。
互換性の方針は `kind` を残さない一括移行を選んでいる。

`routine validate` は 7 件すべてを通過する。単体テストは 1420 件が成功する。

## 8. 関連ドキュメント

- [[prj-0001:pjr-gwy4-job-deterministic-command]]: 前提となる決定論的なコマンド実行。
- [[prj-0001:pjr-t2kk-grade-recheck-routine]]: routine 化の検証で構造の問題が判明した項目。
