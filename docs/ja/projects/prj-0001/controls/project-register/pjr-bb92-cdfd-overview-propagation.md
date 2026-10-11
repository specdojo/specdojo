---
specdojo:
  id: prj-0001:pjr-bb92-cdfd-overview-propagation
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-09-26T11:11:30Z"
  completed_at: "2026-09-26T16:03:10Z"
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

4 文書を追従させ（`f3d35618`）、夜間の grade で確かめた。完了条件をすべて満たす。

### 6.1. grade の結果

`cdfd-overview` は codex、残りの 4 本は agy で評価した（`cdfd-overview` は agy で失敗したため codex で評価し直した）。

| 文書                | score | major | 本項目で直した不整合 |
| ------------------- | ----- | ----- | -------------------- |
| `cdfd-overview`     | 79    | 6     | **3 件とも解消**     |
| `cdfd-do`           | 83    | 3     | —                    |
| `cdfd-plan`         | 89    | 2     | —                    |
| `cdfd-check`        | 83    | 2     | —                    |
| `cdfd-orchestrator` | 97    | 0     | pass                 |

`cdfd-overview` で本項目が対象にした 3 件（Do の入力に Schedule（track）がない、track が状態を持つとする記述、Orchestrator の担当の出どころ）は、いずれも指摘から消えた。

### 6.2. 新しく見つかった不整合

`cdfd-overview` に、本項目と関係のない既存の不整合が 2 件新しく指摘された。

| 指摘                                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------- |
| 全体概要は Check への要求を「評価・報告要求」に限るが、`cdfd-check` と `cdfd-orchestrator` は P-10 の起動に「生成要求」を含む     |
| 全体概要は Orchestrator への応答を実行記録の「実行状態」に集約するが、`cdfd-orchestrator` は Plan・Check・Action からの応答を持つ |

以前から残る 4 件（P-01 の起点、Action の承認の境界、PO の承認記録 2 件）とあわせ、別項目での対応を検討する。

### 6.3. 取りこぼしの修正

成果物カタログ `dct-data-flow.yaml` の `cdfd-onboarding` の note に「Detached Unit」が残っていた。[[prj-0001:pjr-34mq-plain-repository-naming-readme]] の範囲（README とガイド 5 本）の外だったため、「別リポジトリ構成」へ改めた。

## 7. 関連ドキュメント

- [[prj-0001:pjr-f1jg-cdfd-overview-runner-qe]]
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-overview.md`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-do.md`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-plan.md`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-check.md`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-orchestrator.md`
