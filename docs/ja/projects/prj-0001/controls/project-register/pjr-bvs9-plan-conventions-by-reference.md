---
specdojo:
  id: prj-0001:pjr-bvs9-plan-conventions-by-reference
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-06T15:05:39Z"
  due_on: null
  derived_from:
    - PJR-2WC2
  depends_on:
    - PJR-Z0XR
---

# PJR-BVS9 保存する plan の共通の規約を版への参照にする

## 1. 概要

agent に渡す prompt には共通の規約の全文を含めたまま、保存する plan.md の規約の部分を版（ハッシュ）への参照にし、規約の本体は版ごとに 1 つだけ保存する（PJR-2WC2）

## 2. 入力

- PJR-VH8D の決定（2026-11-07 indie）: 実行記録は run 単位のディレクトリ execution/runs/`<出どころ>`/`<項目 ID>`/`<run ID>`/ に plan.md・result.md・evidence.json・ログを置く（R1）。出どころは register・schedule・job。置き場所を決める処理はコードの 1 つのモジュールにまとめる（R2）。exec validate と CI で置き場所を検査する（R3）。ガイドの構成図をモジュールと照らすテストを置く（R4）。grade/results と jobs/ の定義は外に残す。既存は git mv で移し、パスの欄だけ書き換える
- 利用者の決定（PJR-2WC2）: 増え方はログ以外の原因で抑える。全 plan に埋め込む共通の規約（約 3 KB）を減らす（2026-11-06）
- 既存の設計: 共通の規約は plan の本文に断片として注入する。agent の CLI によらず規約が届くのは plan の本文経由だけのため。agent に渡す内容は変えず、保存する plan.md だけを規約の版への参照にする（2026-11-07 indie が承認）

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
