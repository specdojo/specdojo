---
specdojo:
  id: prj-0001:pjr-cy0s-stsd-sample-transition-id-renumber
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: easy
  owner: BA
  registered_at: "2026-11-06T12:06:56Z"
  due_on: null
  completed_at: "2026-11-06T12:53:24Z"
  conclusion: stsd-sample の遷移 ID を図と表の順に T-01〜T-08 へ振り直し、図の前の範囲の記載も合わせた
  derived_from:
    - PJR-3APD
    - PJR-0QJS
  depends_on:
    - PJR-FS9A
  approach: sample-maintenance
  targets:
    - specdojo:stsd-sample
---

# PJR-CY0S stsd-sample の遷移 ID を図と表の順に振り直す

## 1. 概要

分けた図ごとの表で交互になった stsd-sample の遷移 ID を、PJR-FS9A の規則に沿って図と表の順に通し番号へ振り直す

## 2. 入力

- PJR-0QJS の結果、通常系の表が T-01・T-02・T-03・T-05・T-07、例外系の表が T-04・T-06・T-08 と交互になった。もとの 1 つの表の ID を図ごとの表へ分けたため（2026-11-06）
- 確定までは振り直してよい規則（PJR-FS9A、C 案）の手本として、sample の ID を図と表の順に振り直す（2026-11-06 indie が承認）

## 3. 完了条件

- [[specdojo:stsd-sample]] の遷移 ID が、図と、そのすぐ下の遷移表の順に `T-01` から欠番なく振られている（通常系の図と表が先、例外系が後）。図のラベルと遷移表で同じ ID を使っている。
- 例外系の図の前にある遷移 ID の範囲の記載（例: 「例外系（`T-04`、`T-06`、`T-08`）」）を、新しい ID に合わせている。
- 遷移の中身（遷移元・遷移先・イベント・条件・補足）と、ほかの章は変えていない。旧 ID と新 ID の対応を個票の対応結果に書いている。
- 変えるのは `stsd-sample` だけで、ほかの Kata と成果物（`docs/ja/product/` 配下）は変えていない。
- `npm run -s lint:md`・`npm run -s lint:fm`・`npm run -s lint:mermaid` が通っている。

## 4. 作業内容

| No  | 作業                                   | 担当 | 状態 | メモ |
| --- | -------------------------------------- | ---- | ---- | ---- |
| 1   | 遷移 ID を図と表の順に振り直す         | BA   | open | -    |
| 2   | 図の前の範囲の記載を合わせ、検査を通す | BA   | open | -    |

## 5. 対応結果

- [[specdojo:stsd-sample]] の図・直下の遷移表・図前の範囲を、通常系 `T-01`〜`T-05`、例外系 `T-06`〜`T-08` に揃えた。遷移元・遷移先・イベント・条件・補足と、ほかの章の内容は維持した。
- 旧 ID → 新 ID: `T-01` → `T-01`、`T-02` → `T-02`、`T-03` → `T-03`、`T-04` → `T-06`、`T-05` → `T-04`、`T-06` → `T-07`、`T-07` → `T-05`、`T-08` → `T-08`。追加・削除した遷移はない。
- `grade` の F001・F002 が求める発注内容との照合は、状態一覧・初期遷移・`T-01` の条件へ反映済みであることを確認し、維持した。
- [[specdojo:stsd-rulebook]] 第 3 章の確定前の振り直し規則を適用した。[[specdojo:stsd-recipe]] 第 3 章の既存 ID 保持の記述とは差異があるため、rulebook を正とした。recipe の追従は PJR-FS9A の申し送りで追跡されており、今回の対象外として維持した。
- 必須の lint は executor 終了後に親 runner が実行し、実行記録へ結果を追記する。ほかの Kata と `docs/ja/product/` 配下は変更していない。

## 6. 関連ドキュメント

- [[specdojo:stsd-sample]]: 手入れの対象
- [[specdojo:stsd-rulebook]]: 遷移 ID の規則（PJR-FS9A で直す）
