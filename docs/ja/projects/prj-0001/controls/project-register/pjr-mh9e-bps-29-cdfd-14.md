---
specdojo:
  id: prj-0001:pjr-mh9e-bps-29-cdfd-14
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  owner: BA
  registered_at: "2026-09-26T05:44:30Z"
  block_reason: "integrate failed: git status failed: fatal: detected dubious ownership in repository at '/workspaces/specdojo-workspace/worktrees/prj-0001-PJR-MH9E' (args: --porcelain=v1 -z --untracked-files=all)"
---

# PJR-MH9E 成果物カタログの BPS 29 件を現行 CDFD の 14 領域へ追従させる

## 1. 概要

`dct-business-model-bps.yaml` の BPS 29 件は、`cdfd-overview.md` を 14 領域へ書き換える前の**旧 10 領域体系**の P 番号を `overview` に記載している。同じ P 番号が現行では別の領域を指すため、カタログの記述から対象プロセスを特定できない。29 件の分割と `overview` を現行 CDFD へ追従させる。

## 2. 事実

### 2.1. 同じ P 番号が別の領域を指す

| カタログの記述                                     | 旧体系での意味         | 現行 CDFD での意味                       |
| -------------------------------------------------- | ---------------------- | ---------------------------------------- |
| `bps-task-review-finalize` = P-04-05・06           | review 実行と finalize | **P-04 = スケジュール計画展開**          |
| `bps-task-edit` = P-04-04                          | edit 実行              | 同上                                     |
| `bps-derived-project-scoped` = P-08-02〜04         | 派生生成               | **P-08 = 成果物評価**                    |
| `bps-reporting-monitoring-detection` = P-09-01・02 | 監視入力確認・滞留検知 | **P-09-01/02 = 報告対象確定 / 進捗集計** |
| `bps-config-change-evaluation` = P-07-01           | 構成変更評価           | **P-07 = タスク実行**                    |

**ずれは 29 件全体に及ぶ。** `overview` の文言だけを読むと対応が取れているように見えるため、P 番号を突き合わせないと誤りに気づかない。

### 2.2. 現行 CDFD の 14 領域

| ID     | 領域                         | 対応する BPS                           |
| ------ | ---------------------------- | -------------------------------------- |
| `P-01` | プロジェクト初期セットアップ | `bps-init-*`                           |
| `P-02` | 登録簿定義                   | `bps-register-*`                       |
| `P-03` | 成果物カタログ定義           | `bps-planning-catalog-strategy-update` |
| `P-04` | スケジュール計画展開         | `bps-planning-*`                       |
| `P-05` | 定期実行定義                 | `bps-routine-required`                 |
| `P-06` | ジョブ定義                   | `bps-routine-job-run`                  |
| `P-07` | タスク実行                   | `bps-task-*`、`bps-parallel-*`         |
| `P-08` | 成果物評価                   | `bps-deliverable-evaluation`           |
| `P-09` | 進捗可視化報告               | `bps-reporting-*`                      |
| `P-10` | 派生生成閲覧提供             | `bps-derived-*`                        |
| `P-11` | タスク完了                   | `bps-task-completion`                  |
| `P-12` | 稼働構成管理                 | `bps-config-*`                         |
| `P-13` | 非推奨化保管                 | `bps-deprecation-*`                    |
| `P-14` | オーケストレーター           | `bps-routine-register-schedule-cycle`  |

### 2.3. 2 領域に対応する BPS を追加した

`P-08 成果物評価` と `P-11 タスク完了` は旧 29 件に含まれていなかった。[[prj-0001:pjr-h4h7-bps-grade-review]] で先行作成された [[bps-deliverable-evaluation|成果物評価]] と [[bps-task-completion|タスク完了]] を、それぞれ現行 CDFD の `P-08` と `P-11` としてカタログへ追加した。

両エントリの `local_id`、`path`、`rulebook` は先行作成した文書と一致し、既存 29 件と同じ `done_criteria` を参照する。

### 2.4. 旧 10 領域と現行 14 領域の対応

| 旧領域                      | 現行領域                                                          | 対応方法                                                                                 |
| --------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `P-01` 初期セットアップ     | `P-01` プロジェクト初期セットアップ                               | 現行の導入条件確定・Kata 配置・稼働構成初期化へ記述を更新                                |
| `P-02` 登録簿ライフサイクル | `P-02` 登録簿定義                                                 | 3 件を `P-02-01` の利用場面別フローとして維持                                            |
| `P-03` 計画展開             | `P-03` 成果物カタログ定義、`P-04` スケジュール計画展開            | 2 件を一領域ずつへ分割                                                                   |
| `P-04` タスク実行           | `P-07` タスク実行、`P-08` 成果物評価、`P-11` タスク完了           | 既存 4 件は Do の受入・遂行・検証・統合／記録へ限定し、grade と review は新規 2 件へ分離 |
| `P-05` 定期処理             | `P-05` 定期実行定義、`P-06` ジョブ定義、`P-14` オーケストレーター | 定義 2 件と定期起点の運転 1 件へ分割                                                     |
| `P-06` 並行処理             | `P-07` タスク実行                                                 | 並行実行は独立領域でなく実行形態になったため統合                                         |
| `P-07` 構成変更             | `P-12` 稼働構成管理                                               | 番号と領域名を更新                                                                       |
| `P-08` 派生生成             | `P-10` 派生生成閲覧提供                                           | 番号と領域名を更新                                                                       |
| `P-09` 報告                 | `P-09` 進捗可視化報告                                             | 現行 3 ステップへ記述を更新                                                              |
| `P-10` 非推奨化・保管       | `P-13` 非推奨化保管                                               | 番号と現行 3 ステップへ記述を更新                                                        |

単純な番号付け替えは旧 `P-07`〜`P-10` のうち責務が保たれた領域に限定した。責務境界が変わった旧 `P-03`〜`P-06` は、現行 CDFD の「定義」「実行」「評価」「完了」「運転」の境界に合わせてグループと `overview` を見直した。

## 3. 完了条件

- 29 件すべての `overview` が現行 CDFD の P 番号を指している。
- 14 領域それぞれについて、対応する BPS があるか、不要である理由が分かる。
- `P-08` と `P-11` の BPS がカタログへ登録されている。[[prj-0001:pjr-h4h7-bps-grade-review]] で先行作成した文書と `local_id`、`path`、`rulebook` が一致する。
- 各 BPS の `done_criteria` が定義されている。先行作成した 2 件も含む。
- 分割の見直しが必要な箇所は、変更内容と理由が記録されている。単純な番号付け替えと区別する。
- `depends_on` が現行の領域間関係と整合している。
- `npx specdojo catalog validate --project prj-0001` が通過している。
- grade を再実行し、`vp-arc-cross-document-consistency` の finding が増えていない。

## 4. 検討事項

### 4.1. 番号の付け替えか分割の見直しか

既存 29 件の `local_id` と `path` は他カタログから参照されているため変更しない。一方、BPS は一つのプロセス領域に属するため、カタログのグループを現行 14 領域へ分割し、各エントリを一つの領域にだけ配置した。

旧「計画展開」と旧「定期処理」は複数の現行領域へ分割し、旧「並行処理」は現行「タスク実行」へ統合した。旧「タスク実行」に含まれていた評価と完了判断は、既存エントリから外して `P-08` と `P-11` の先行作成済み BPS へ分離した。

### 4.2. 再発防止

現行の DCT schema に CDFD プロセス ID 専用項目はなく、本項目だけで schema を拡張すると他カタログと生成処理へ影響が広がる。このため、次の二点を採用した。

- 14 領域をカタログのグループ名として明示し、各 BPS を一つの領域だけに配置する。
- 各 `overview` に現行の領域内プロセス ID を明記し、本個票の対応表を番号改訂時の確認基準として残す。

専用項目による機械検証は別の schema 改訂として扱う。本項目では `catalog validate` による参照・依存・必須項目の検査と、個票の対応表による意味上の照合を組み合わせる。

## 5. 作業内容

| No  | 作業                                        | 担当 | 状態 | メモ                                              |
| --- | ------------------------------------------- | ---- | ---- | ------------------------------------------------- |
| 1   | 旧 10 領域と現行 14 領域の対応表を作る      | BA   | done | 2.4 節に記録                                      |
| 2   | 29 件の `overview` を現行 P 番号へ更新する  | BA   | done | 全件を現行の領域内プロセスへ対応付け              |
| 3   | 分割の見直しが要る箇所を特定し変更する      | BA   | done | 旧 `P-03`〜`P-06` と評価・完了の分離を見直した    |
| 4   | `P-08` / `P-11` の BPS をカタログへ登録する | BA   | done | PJR-H4H7 の `local_id`・`path`・`rulebook` と一致 |
| 5   | `done_criteria` を定義する                  | QE   | done | YAML anchor により全 31 件へ適用                  |
| 6   | 再発防止の方法を検討する                    | ARC  | done | 14 グループと `overview` の二重対応を採用         |
| 7   | `catalog validate` と grade を実行する      | QE   | done | 検査結果を 6.4 節へ記録                           |

## 6. 対応結果

### 6.1. カタログの再編

`dct-business-model-bps.yaml` を現行 CDFD と同じ `P-01`〜`P-14` の 14 グループへ再編した。既存 29 件は参照互換性のため `local_id` と `path` を維持し、名称、`overview`、配置先、`depends_on` を現行の責務境界へ合わせた。

- 旧「計画展開」の 2 件を `P-03` 成果物カタログ定義と `P-04` スケジュール計画展開へ分割した。
- 旧「定期処理」の 3 件を `P-05` 定期実行定義、`P-06` ジョブ定義、`P-14` オーケストレーターへ分割した。
- 旧「並行処理」の 4 件を、並行実行という実行形態として `P-07` タスク実行へ統合した。
- 旧「タスク実行」の review・finalize 責務を Do から外し、既存 4 件を `P-07` の実行受入・遂行・成果検証・統合／記録へ限定した。
- 旧 `P-07`〜`P-10` は、現行の `P-12`・`P-10`・`P-09`・`P-13` へそれぞれ追従させた。

### 6.2. BPS 2 件の追加

[[prj-0001:pjr-h4h7-bps-grade-review]] で先行作成された次の 2 件を登録し、カタログの BPS は合計 31 件になった。

| 領域   | `local_id`                   | `path`                          | `rulebook`              |
| ------ | ---------------------------- | ------------------------------- | ----------------------- |
| `P-08` | `bps-deliverable-evaluation` | `bps-deliverable-evaluation.md` | `specdojo:bps-rulebook` |
| `P-11` | `bps-task-completion`        | `bps-task-completion.md`        | `specdojo:bps-rulebook` |

両エントリを含む全 31 件が、BA・PO・ARC・QE・DEV の 5 観点からなる共通 `done_criteria` を持つ。

### 6.3. 依存関係

`depends_on` は現行の受け渡しに合わせ、次の関係を明示した。

- `P-03` の成果物カタログ定義から `P-04` の計画展開、`P-04` から `P-07` の実行受入へつなぐ。
- `P-06` のジョブ定義を `P-05` の定期実行定義が参照する。
- `P-07` の実行結果記録から `P-08` の成果物評価、`P-08` から `P-11` のタスク完了へつなぐ。
- 定期到来イベント `bes-routine-due` は、定義領域ではなく定期起点で PDCA を運転する `P-14` だけが参照する。
- 派生生成要求 `bes-derived-content-requested` は `P-10` の 3 件が引き続き参照する。

### 6.4. 検証

- `catalog validate --project prj-0001` は全カタログを `OK` とし、終了コード 0 で完了した。未作成成果物の `based_on` を検証できない既存 warning は残るが、参照・依存・schema の error はない。
- `catalog build`、`register build`、`index build` は終了コード 0 で完了した。
- 14 グループの連番、31 件の一意な `local_id`、既存 29 件の領域内プロセス参照、新規 2 件の登録値、全件の `done_criteria` を機械確認した。
- BPS 本文 2 件は本項目で変更していないため、`grade list --changed-only` の再評価対象は 0 件だった。保存済み grade の hash と finding 数を `grade validate` で検証し、2 件とも error 0、`vp-arc-cross-document-consistency` は level 4、同観点の finding は 0 件であり、増加していないことを確認した。

## 7. 関連ドキュメント

- [[prj-0001:pjr-h4h7-bps-grade-review]]
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-business-model-bps.yaml`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-overview.md`
- `docs/ja/specdojo/rulebooks/bps-rulebook.md`
