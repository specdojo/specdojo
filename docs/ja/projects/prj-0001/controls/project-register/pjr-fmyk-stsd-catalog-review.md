---
specdojo:
  id: prj-0001:pjr-fmyk-stsd-catalog-review
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-04T22:58:04Z"
  derived_from:
    - PJR-3APD
  approach: catalog-planning
  targets:
    - domain:data-model
---

# PJR-FMYK stsd のカタログを CDFD に合わせて見直す

## 1. 概要

stsd の試行（3APD）の最初の段。dct-data-model-stsd.yaml の 5 件を、再編した概念データフロー図と現行の実装に照らして見直す

## 2. 入力

- 対象は dct-data-model-stsd.yaml だけ。data-model のほかの種類（bdd・cdsd・cld・ccd）の分割ファイルは変えない（3APD の範囲）
- カタログは概念データフロー図の再編の前に作った。CDFD は stsd-deliverable・stsd-task-execution・stsd-job-run・stsd-register-entry・stsd-routine-run を状態定義の正本として名指ししている（cdfd-uc-schedule・cdfd-uc-register・cdfd-uc-routine の適用範囲）
- 代表の 1 件は stsd-task-execution を draft で書く（2026-11-05 利用者が決定）

## 3. 完了条件

- `dct-data-model-stsd.yaml` の 5 件それぞれについて、状態を持つ対象・`overview`・`depends_on`・`evidence_refs`（実装のパスと目的）が、概念データフロー図（[[cdfd-overview]]・[[cdfd-uc-register]]・[[cdfd-uc-routine]]・[[cdfd-uc-schedule]]）と現行の実装に合っているかを確かめ、合わないものを直している。`evidence_refs` のパスは実在するファイルを指している。
- CDFD が状態の正本として名指しする対象に、カタログで欠けているものや余分なものがないかを確かめている。足す・除く・分ける・まとめる判断をした場合は、理由を個票の対応結果に書いている。
- `local_id` を変えた場合は、CDFD など既にある文書からの参照を一覧にして個票の対応結果に書いている。参照している文書そのものはこの項目では直さない。`stsd-task-execution` は代表の 1 件として次の段で使うため、変える場合はその理由も書く。
- `dct-data-model-stsd.yaml` 以外のカタログと、成果物（`docs/ja/product/` 配下）は変えていない。
- `npm run -s validate:catalog` と `npm run -s lint:md` が通っている。

## 4. 作業内容

| No  | 作業                                         | 担当 | 状態 | メモ                                         |
| --- | -------------------------------------------- | ---- | ---- | -------------------------------------------- |
| 1   | CDFD と実装に照らして 5 件を確かめる         | BA   | done | 対象の過不足なし、overview・evidence を特定  |
| 2   | カタログを直し、検査を通す                   | BA   | done | `dct-data-model-stsd.yaml` を修正・検証通過  |
| 3   | 判断と理由、参照の一覧を個票の対応結果に書く | BA   | done | 対応結果に対象判定・変更理由・根拠参照を記録 |

## 5. 対応結果

### 5.1. 実施内容

`dct-data-model-stsd.yaml` に定義されている 5 件（`stsd-register-entry`, `stsd-task-execution`, `stsd-deliverable`, `stsd-routine-run`, `stsd-job-run`）について、概念データフロー図（[[cdfd-overview|概念データフロー図（全体概要）]]、[[cdfd-uc-register|概念データフロー図（登録簿起票から完了まで）]]、[[cdfd-uc-routine|概念データフロー図（定期処理・自動運転）]]、[[cdfd-uc-schedule|概念データフロー図（スケジュール計画から完了まで）]]）および現行の実装コードと照合し、カタログ定義（`overview` および `evidence_refs`）を見直して修正した。

### 5.2. CDFD で名指しされた対象の過不足判定

CDFD 4 文書において状態定義・状態遷移の正本として名指しされている対象を精査した:

- [[cdfd-uc-register|cdfd-uc-register]]: 「登録項目・実行記録の状態は `stsd-register-entry`・`stsd-job-run`」
- [[cdfd-uc-routine|cdfd-uc-routine]]: 「状態の定義・遷移は [[stsd-routine-run\|定期処理の実行結果のステータス定義]] と未作成の `stsd-job-run`・`stsd-task-execution` へ委ねる」
- [[cdfd-uc-schedule|cdfd-uc-schedule]]: 「成果物・タスク・ジョブの状態定義と遷移は `stsd-deliverable`・`stsd-task-execution`・`stsd-job-run` を正本とする」

名指しされている対象は `stsd-deliverable`、`stsd-task-execution`、`stsd-job-run`、`stsd-register-entry`、`stsd-routine-run` の 5 件であり、カタログの 5 件と過不足なく完全に合致している。そのため、対象の追加・除外・分割・統合は行わず、既存の 5 件構成を維持した。

### 5.3. `local_id` の変更有無

5 件すべて既存の `local_id` が CDFD の名指しおよび設計体系と一致しているため、`local_id` の変更は行わなかった。代表の 1 件である `stsd-task-execution` もそのまま維持している。したがって、他文書からの参照変更の一覧化は不要である。

### 5.4. 各成果物の見直し詳細

1. `stsd-register-entry`:
   - `overview`: `src/register/item.ts` の `VALID_STATUSES`（`open`, `in-progress`, `waiting`, `review`, `decided`, `done`, `deferred`, `rejected`）と合致するよう「等」を除き全許容値を明記した。
   - `evidence_refs`: 状態遷移規則・履歴イベント変換を行う `src/register/register.ts` に加え、許容値および終端状態（`TERMINAL_STATUSES_SET`）を定義する `src/register/item.ts` を追加した。
2. `stsd-task-execution`:
   - `overview`: `src/exec/types.ts` の `ExecState`（`todo`, `doing`, `blocked`, `done`, `cancelled`）および依存解決による `ready` 導出に合わせ、`todo / ready / doing / blocked / done / cancelled` を明記した。
   - `evidence_refs`: 再エクスポートのみであった `src/exec/exec.ts` を除外除名し、状態遷移および `ready` 判定の実装本体である `src/exec/events.ts` と型定義 `src/exec/types.ts` を指定した。
3. `stsd-deliverable`:
   - `overview`: `draft / ready / deprecated`（実装と一致しているため維持）。
   - `evidence_refs`: 共通処理の `src/deliverable/deliverable.ts` に加え、非推奨化判定と trash 保管への状態遷移を担う `src/deliverable/trash.ts` を追加した。
4. `stsd-routine-run`:
   - `overview`: `src/routine/definition.ts` の `RoutineStateResult`（`running`）および `RoutineExecutionResult`（`success` / `partial` / `failure` / `skipped`）に合わせ、`running / success / partial / failure / skipped` を網羅するよう修正した。
   - `evidence_refs`: 判定・更新規則を担う `src/routine/routine.ts` に加え、型定義を保持する `src/routine/definition.ts` を追加した。
5. `stsd-job-run`:
   - `overview`: `src/job/definition.ts` の `JobRunState`（`running` / `succeeded` / `partial` / `failed` / `noop`）に合わせ、実装に存在しない `pending` を除去し、`running / succeeded / partial / failed / noop`（`attempt` を含む）として修正した。
   - `evidence_refs`: 状態判定・状態遷移規則を担う `src/job/job.ts` に加え、型定義を保持する `src/job/definition.ts` を追加した。

### 5.5. 変更成果物

- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-stsd.yaml`: stsd の 5 件の `overview` および `evidence_refs` の修正
- `docs/ja/projects/prj-0001/controls/project-register/pjr-fmyk-stsd-catalog-review.md`: 個票の作業内容および対応結果の記録

### 5.6. 残課題

- なし（後続の `PJR-3APD` 試行において、代表の 1 件である `stsd-task-execution` の draft 作成を進める）。

## 6. 関連ドキュメント

- [[cdfd-overview]]・[[cdfd-uc-register]]・[[cdfd-uc-routine]]・[[cdfd-uc-schedule]]: 照らし合わせる概念データフロー図
- [[specdojo:stsd-rulebook]]: 1 対象 1 ファイルの規範
- [[specdojo:dct-rulebook]]: カタログの書き方の規範
