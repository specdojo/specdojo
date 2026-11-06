---
specdojo:
  id: prj-0001:pjr-pzbp-routine-state-outside-git
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-06T15:05:10Z"
  due_on: null
  derived_from:
    - PJR-VH8D
---

# PJR-PZBP 定期処理の状態を Git の外へ移し、何もしなかった job の記録を残さない

## 1. 概要

routine-state.json と routine-runs.jsonl を端末の状態を置く場所へ移し、job の記録なしで失敗した実行だけを Git に残す。何も変えなかった job の実行記録は commit しない（VH8D の #8）

## 2. 入力

- PJR-VH8D の決定（2026-11-07 indie）: 実行記録は run 単位のディレクトリ execution/runs/`<出どころ>`/`<項目 ID>`/`<run ID>`/ に plan.md・result.md・evidence.json・ログを置く（R1）。出どころは register・schedule・job。置き場所を決める処理はコードの 1 つのモジュールにまとめる（R2）。exec validate と CI で置き場所を検査する（R3）。ガイドの構成図をモジュールと照らすテストを置く（R4）。grade/results と jobs/ の定義は外に残す。既存は git mv で移し、パスの欄だけ書き換える
- 利用者の決定（PJR-VH8D #8）: 定期処理の実行状態と履歴は Git の外の端末の状態を置く場所へ移す。Git に残すのは job の実行記録を残さずに失敗した定期処理の実行だけとし、正常に何もしなかった実行（skip を含む）は残さない。precondition を持たない job が動いて何も変えなかった場合も実行記録を commit しない。実現の方法は設計で決める（2026-11-06）

## 3. 完了条件

- `routine-state.json` と `routine-runs.jsonl` の置き場所が、`docs/` の下の `generated/` から、端末の状態を置く場所（Git の外。場所は executor が決め、既存の端末の状態の置き場所があればそれにそろえて理由を書く）へ移っている。既存の状態を新しい場所へ引き継ぐ方法（初回に移す、など）がある。
- 定期処理の実行が、job の実行記録を残さずに失敗したときだけ、その実行の記録を Git に残す（置き場所と形式は executor が決める）。成功・skip・何もしなかった実行は Git に残さない。
- `precondition` を持たない job が動いて何も変えなかった場合、その job の実行記録を commit しない。判定の方法（runner が変更の有無で判定する、など）と理由を個票の対応結果に書いている。
- `routines/.locks/` を文書のツリーの外へ移すか、Git の無視の対象にしている（`.gitignore` が保護されている場合は案を書く）。
- dashboard の定期処理の表示と、stsd-routine-run が管理場所とする記録との関係を個票の対応結果に書いている（ステータス定義の本文は変えない）。
- 単体テストで、状態の置き場所、失敗の記録の残し方、何もしなかった job の記録を commit しないことを確かめている。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` が通り、親の検証（`test-integration` を含む）が通っている。
- CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えていない。
- 保護された設定（`package.json`・`lefthook.yml`・`.github/workflows/`・`.specdojo/` の設定・agent の定義・`.gitignore` が保護されている場合はそれも）を変える必要があるときは、変えずに案を個票の対応結果に書き、pipeline では報告の `handoff` にも書いている。反映は利用者の承認のもと行う。
- 未決の点は executor が決め、決めた内容と理由を個票の対応結果に書き、pipeline では報告の `handoff` にも書いている。

## 4. 作業内容

| No  | 作業                                      | 担当 | 状態 | メモ |
| --- | ----------------------------------------- | ---- | ---- | ---- |
| 1   | 状態と履歴の置き場所を移す                | DEV  | open | -    |
| 2   | 失敗の記録だけを Git に残す               | DEV  | open | -    |
| 3   | 何もしなかった job の記録を commit しない | DEV  | open | -    |
| 4   | テストを足す                              | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-vh8d-execution-records-layout]]: #8 の決定
- [[prj-0001:stsd-routine-run]]: 定期処理の状態の定義
