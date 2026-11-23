---
specdojo:
  id: prj-0001:pjr-0jvb-exec-cycle-skip-human-tasks
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-22T23:53:44Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-561Q
  commit_type: fix
  commit_scope: exec
---

# PJR-0JVB exec cycle が agent を指定すると人の確定のタスクを拾って失敗する

## 1. 課題内容

11-23 朝の exec cycle が第 3 波の完成版確定（execution: human）13 件を edit として拾い、plan の生成で止まって failed になった。agent を指定した自動の実行でも人のタスクを外す

## 2. 入力

- 2026-11-23 の朝の exec cycle（JBR-exec-cycle-eb11b9add2df）の stderr に、`T-KATA-WAVE-3-*-140` の 13 件で「has execution: human; claim it to create and use its result instead of a plan.」が出て、auto=failure になった
- 見立て（未確認）: src/exec/run/schedule-prepare.ts は agent の候補が無いときだけ人のタスクを止める。cycle が --edit-by で agent を渡すと、この判定を通り抜けて src/exec/plans-generation.ts の plan の生成で止まる
- PJR-561Q の記録では、--auto は execution: human のタスクを自動で飛ばしていた

## 3. 影響範囲

| 観点         | 影響                                                                 |
| ------------ | -------------------------------------------------------------------- |
| スコープ     | `src/exec/run/schedule-mode.ts`、`src/exec/run/schedule-prepare.ts`  |
| スケジュール | 影響なし                                                             |
| コスト       | 人のタスクで plan 生成が失敗し cycle が failure になる無駄がなくなる |
| 品質         | 自動選択が人のタスクを拾わない。`--by` 等の明示指定は従来どおり      |
| 関係者       | DEV                                                                  |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                  |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `--edit-by` / `--review-by` で agent 候補が作られると、`prepareSingleTask` の人のタスク判定が候補なしの分岐にしか無く、素通りして plan 生成で失敗した |
| 対応策   | 自動選択で `--by`・`--executor-by`・タスク固定 agent の無い人のタスクを skip し、`prepareSingleTask` でも同条件を override 解決の前に判定する         |
| 依存事項 | なし                                                                                                                                                  |
| 完了条件 | agent を `--edit-by` で指定した自動実行が `execution: human` のタスクを拾わず、failure にならないこと                                                 |

## 5. 対応結果

- `schedule-mode.ts` の準備ループで、明示 agent の無い人のタスクを skip（ログ出力）するようにした。
- `schedule-prepare.ts` の人のタスク判定を override 解決の前へ移し、mode 単位の `--edit-by` / `--review-by` は明示 agent に数えないようにした。
- 確認: 型・単体テストは親 runner の検証に委ねる。専用の回帰テストは未追加（申し送り）。
- 再発防止: mode 単位の override は人のタスクの許可にならない、という規則をコードコメントに残した。

## 6. 関連ドキュメント

- `PJR-561Q`（派生元）
