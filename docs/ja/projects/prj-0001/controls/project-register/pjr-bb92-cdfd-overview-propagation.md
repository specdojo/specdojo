---
specdojo:
  id: prj-0001:pjr-bb92-cdfd-overview-propagation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-09-26T11:11:30Z"
---

# PJR-BB92 cdfd-overview の変更を下位 CDFD へ追従させる

## 1. 概要

`1d735942` で `cdfd-overview.md` の Do へ `Schedule（track）` を加え、Schedule（track）がタスクの状態を持たないと訂正した。どちらも実装と一致するが、**下位の CDFD へ反映していなかった。** [[prj-0001:pjr-f1jg-cdfd-overview-runner-qe]] の grade で `cdfd-overview` の major として検出された。`cdfd-rulebook` は全体概要を名称と区分の正本とするため、下位を追従させる。

## 2. 変更内容

| 文書                | 変更                                                                                                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `cdfd-do`           | 主要入力、データストア、データストア表、図のノードとエッジ、`P-07-01` の個別入出力へ `Schedule（track）` を加えた |
| `cdfd-plan`         | データストア表の Schedule（track）から「状態」を外し、状態の正本は実行記録とした                                  |
| `cdfd-check`        | データストア表、図のエッジ 2 本、`P-10-02` の個別入出力から Schedule（track）の「状態」を外した                   |
| `cdfd-orchestrator` | 成果物カタログの行から `owner` を外し、担当はスケジュール戦略の `owner_rules` から得るとした                      |

`cdfd-do` で Schedule（track）を参照するのは `P-07-01`（実行受入）である。実装では `exec run --auto` が `sch-track-*.yaml` から次のタスク、担当、依存を読む（`src/exec-schedule.ts`）。

`cdfd-check` の図では、状態は既に `実行記録 -->|"実績・実行状態"|` と `実行記録 -->|"実行結果・実行状態"|` から入っている。Schedule（track）のエッジから「状態」を外しても、状態の流れは失われない。

`cdfd-orchestrator` の担当は、全体概要の Orchestrator がデータストアとして持つスケジュール戦略から得る。Schedule（track）は全体概要の Orchestrator のデータストアに含まれないため、そちらは参照させない。

## 3. 範囲外として残した点

`cdfd-plan` の `7. 状態遷移の参照` は、Schedule（track）のタスクの状態を変えるプロセスを `P-04-02` Schedule（track）展開としている。実装では状態の遷移（claim、complete など）は実行イベントとして Do で記録される。**どのプロセスがタスクの状態を変えるかは STSD（`stsd-task-execution`）で定める事項**だが、STSD は未作成である。本項目では扱わない。

## 4. 完了条件

- 4 文書が `cdfd-overview.md` の Schedule（track）の扱いと一致している。
- `cdfd-do` の箇条書き、データストア表、図、個別入出力で Schedule（track）が過不足なく対応している。
- Schedule（track）がタスクの状態を持つ記述が CDFD に残っていない。
- `cdfd-orchestrator` の担当の出どころが全体概要と一致している。
- grade を再実行し、`cdfd-overview` の該当 major が解消している。

## 5. 作業内容

| No  | 作業                       | 担当 | 状態 | メモ                    |
| --- | -------------------------- | ---- | ---- | ----------------------- |
| 1   | 4 文書を追従させる         | ARC  | done | 本文参照                |
| 2   | grade を再実行して確認する | QE   | open | `--stages 1` を明示する |

## 6. 対応結果

-

## 7. 関連ドキュメント

- [[prj-0001:pjr-f1jg-cdfd-overview-runner-qe]]
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-overview.md`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-do.md`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-plan.md`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-check.md`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-orchestrator.md`
