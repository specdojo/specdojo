---
specdojo:
  id: prj-0001:pjr-zpjz-exec-result-superseded-status
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-23T01:44:00Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-23T02:23:07Z"
  conclusion: exec-result の status へ superseded を追加した。新しい result を scaffold する際に、同一タスクで残っている in_progress と blocked の先行 result を遷移させる。complete の記録は書き換えない。固定名 result を再利用する実行は対象外とする。既存の残置 result（PJR-DCTG の1回目）も移行済み。
  register_events:
    - v: 1
      id: reg_7db5572239d4cf0ab692504865e11352
      ts: "2026-08-23T01:47:07Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(register): result の superseded ステータスを PJR-ZPJZ として起票"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: 破棄された実行試行を表す result status superseded を追加する
        - field: description
          from: ""
          to: exec-result の status は in_progress、complete、blocked の3値しかなく、再実行によって後続の実行に置き換えられた試行を表せない。PJR-DCTG では1回目の実行が checkpoint 失敗で成果を残さず終了し、2回目が成功したが、1回目の result は in_progress のまま残っている。実行中に見える in_progress も、解決すべきブロックに見える blocked も実態と合わない。SpecDojo は resume や force-restart など再実行を前提とした設計であり、破棄された試行は今後も発生する。schema へ superseded を追加し、誰がいつ設定するかを含めて運用を定める。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-23"
        - field: due
          from: ""
          to: "2026-08-31"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: 6d116474d033fd79633356cf0e943b1dfe8e0d90
    - v: 1
      id: reg_0e5cdaf6bb70cba8cc8c8b827f71b637
      ts: "2026-08-23T01:47:23Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-ZPJZ): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: d6d22969fd26cb173d7a07a2e147d297034b67a6
      previous_event_id: reg_7db5572239d4cf0ab692504865e11352
    - v: 1
      id: reg_bac461ae4345460ed104db3c6fa523b4
      ts: "2026-08-23T02:17:34Z"
      action: review
      actor: SpecDojo Test
      from_status: in-progress
      to_status: review
      reason: "exec(register PJR-ZPJZ): review"
      changes:
        - field: status
          from: in-progress
          to: review
      legacy_commit: a6a88de8188025c9b4827cd52b3d79abe6cf07c7
      previous_event_id: reg_0e5cdaf6bb70cba8cc8c8b827f71b637
    - v: 1
      id: reg_3f48b8235422184d6c68ba6f0befcd9f
      ts: "2026-08-23T02:23:07Z"
      action: close
      actor: SpecDojo Test
      from_status: review
      to_status: done
      reason: "exec(register PJR-ZPJZ): close"
      changes:
        - field: status
          from: review
          to: done
        - field: completed
          from: "-"
          to: "2026-08-23"
        - field: conclusion
          from: "-"
          to: exec-result の status へ superseded を追加した。新しい result を scaffold する際に、同一タスクで残っている in_progress と blocked の先行 result を遷移させる。complete の記録は書き換えない。固定名 result を再利用する実行は対象外とする。既存の残置 result（PJR-DCTG の1回目）も移行済み。
      legacy_commit: d3b7848686816912da71c2fe15729be3e09b4cf8
      previous_event_id: reg_bac461ae4345460ed104db3c6fa523b4
---

# PJR-ZPJZ 破棄された実行試行を表す result status superseded を追加する

## 1. 概要

exec-result の status は in_progress、complete、blocked の3値しかなく、再実行によって後続の実行に置き換えられた試行を表せない。PJR-DCTG では1回目の実行が checkpoint 失敗で成果を残さず終了し、2回目が成功したが、1回目の result は in_progress のまま残っている。実行中に見える in_progress も、解決すべきブロックに見える blocked も実態と合わない。SpecDojo は resume や force-restart など再実行を前提とした設計であり、破棄された試行は今後も発生する。schema へ superseded を追加し、誰がいつ設定するかを含めて運用を定める。

## 2. 完了条件

- `exec-result-frontmatter.schema.yaml` の `status` に `superseded` が追加され、意味が説明されている。
- `superseded` を設定する主体とタイミングが決まっている。同一タスクで新しい run を開始したとき、未完了のまま残る先行 result を runner が遷移させる案を軸に検討する。
- `complete` の result を後から `superseded` へ落とさない。完了した実行の記録は書き換えない。
- 既存の残置 result（`pjr-dctg-20260818T151438Z-ce4f-result.md`）が `superseded` へ移行されている。
- 一覧や状態集計（`exec status` など）で `superseded` が「実行中」や「対応が必要なブロック」として扱われない。
- `status` の意味の違いが rulebook またはガイドへ記載されている。`in_progress` は実行中、`blocked` は解決すべき停止、`superseded` は後続の実行に置き換えられた試行、と区別できる。
- 上記を検証する unit test が追加され、`npm run test:unit`、`npm run validate:schema`、`npm run lint:fm` が成功する。

## 3. 作業内容

| No  | 作業                                            | 担当 | 状態 | メモ                                                                            |
| --- | ----------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------- |
| 1   | `superseded` の意味と、他の値との境界を定義する | ARC  | done | 対応不要な破棄済み試行として定義し、`blocked` と区別した                        |
| 2   | schema へ値を追加する                           | ARC  | done | `exec-result-frontmatter.schema.yaml` の enum と説明を更新した                  |
| 3   | 設定主体とタイミングを決めて実装する            | ARC  | done | runner が一意名 result の scaffold 時に先行未完了 result を遷移させる           |
| 4   | 状態集計や一覧での扱いを確認する                | ARC  | done | `exec status` は event log 由来のタスク状態を集計し、result status を集計しない |
| 5   | 既存の残置 result を移行する                    | ARC  | done | PJR-DCTG の1回目（`ce4f`）を2回目の開始時刻で `superseded` に移行した           |
| 6   | rulebook またはガイドへ status の区別を記載する | ARC  | done | plan/resultライフサイクルガイドへ4値と遷移ルールを記載した                      |
| 7   | unit test を追加する                            | ARC  | done | 未完了の自動遷移、`complete` の保持、固定名 result の非遷移を追加した           |

## 4. 対応結果

- `exec-result-frontmatter.schema.yaml` と `ExecResultMeta` の status に `superseded` を追加した。`completed_at` は試行が終端 status へ到達した時刻とし、`superseded` では後続 run の開始時刻を記録する。
- runner の result scaffold 処理で、同じ `task_id` を持つ先行の一意名 result を検索し、`in_progress` / `blocked` だけを `superseded` へ更新するようにした。`complete` / 既に `superseded` の result、固定名 result の再利用、同じ run の `resume` は変更しない。
- register の in-place / worktree 実行では、遷移した先行 result も runner 管理対象へ含め、当該 run の checkpoint / commit から漏れないようにした。
- [[specdojo:plan-result-lifecycle-guide|plan/resultライフサイクルガイド]] に4値の意味、設定主体・タイミング、`exec status` のタスク状態集計との分離を記載した。
- `pjr-dctg-20260818T151438Z-ce4f-result.md` を `superseded` へ移行し、後続 run の `started_at`（`2026-08-18T15:17:19.842Z`）を `completed_at` に記録した。
- unit test で先行 `in_progress` / `blocked` result の自動遷移、`block_reason` の除去、`complete` result の保持、固定名 result を再利用する場合の非遷移を検証した。関連3 suite 62件、typecheck、ESLint、対象Markdown/frontmatter、catalog/index の検証は成功した。全1,257件を対象にした `npm run test:unit` はプロセスが終了せず中断し、`npm run validate:schema` は sandbox の tsx IPC 制約で停止したが、同じvalidatorを `node --import tsx` で実行して全対象の適合を確認した。`npm run lint:fm` は今回未変更の既存planにある未エスケープ `<domain>` 1件で失敗し、変更対象ファイルのみの実行は成功した。

## 5. 関連ドキュメント

- 事象が確認された項目: [[prj-0001:pjr-dctg-data-flow-dct-instance-analysis|PJR-DCTG data-flow等からDCT成果物インスタンスを判定するagentの実装]]（本対応の完了までクローズを保留する）
- 再実行を前提とした設計: [[prj-0001:pjr-6vfn-exec-run-register-executor-reporter|PJR-6VFN exec run --register で executor 成功後に reporter だけを再開できるようにする]]
- 変更対象の schema: `docs/specdojo/schemas/v1/exec-result-frontmatter.schema.yaml`
- 変更対象の実装: `src/exec-results.ts` の status 更新と result の scaffold 処理、`src/exec-run.ts` の register checkpoint / commit 対象
