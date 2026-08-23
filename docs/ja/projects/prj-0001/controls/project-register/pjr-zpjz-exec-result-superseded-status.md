---
specdojo:
  id: prj-0001:pjr-zpjz-exec-result-superseded-status
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: ARC
  registered_at: "2026-08-23T01:44:00Z"
  due_on: "2026-08-31"
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

| No  | 作業                                            | 担当 | 状態 | メモ                                                                                    |
| --- | ----------------------------------------------- | ---- | ---- | --------------------------------------------------------------------------------------- |
| 1   | `superseded` の意味と、他の値との境界を定義する | ARC  | open | `blocked` との違い（解決すべきか否か）を明確にする                                      |
| 2   | schema へ値を追加する                           | ARC  | open | `exec-result-frontmatter.schema.yaml`                                                   |
| 3   | 設定主体とタイミングを決めて実装する            | ARC  | open | runner が新しい run の開始時に先行 result を遷移させる案を軸にする。`complete` は対象外 |
| 4   | 状態集計や一覧での扱いを確認する                | ARC  | open | `exec status` などで実行中やブロックとして数えない                                      |
| 5   | 既存の残置 result を移行する                    | ARC  | open | PJR-DCTG の1回目（`ce4f`）が対象                                                        |
| 6   | rulebook またはガイドへ status の区別を記載する | ARC  | open | 3値の使い分けを本文で説明する                                                           |
| 7   | unit test を追加する                            | ARC  | open | schema 検証、遷移条件、`complete` を落とさないこと                                      |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 事象が確認された項目: [[prj-0001:pjr-dctg-data-flow-dct-instance-analysis|PJR-DCTG data-flow等からDCT成果物インスタンスを判定するagentの実装]]（本対応の完了までクローズを保留する）
- 再実行を前提とした設計: [[prj-0001:pjr-6vfn-exec-run-register-executor-reporter|PJR-6VFN exec run --register で executor 成功後に reporter だけを再開できるようにする]]
- 変更対象の schema: `docs/specdojo/schemas/v1/exec-result-frontmatter.schema.yaml`
- 変更対象の実装: `src/exec-run.ts` の `updateResultStatus` と result の scaffold 処理
