---
specdojo:
  id: prj-0001:pjr-bvs9-plan-conventions-by-reference
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-06T15:05:39Z"
  due_on: null
  block_reason: "parent validation failed: lint-ts, test-integration, test-unit"
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

- agent に渡す prompt には、今までどおり共通の規約の全文が入っている（agent の CLI によらず規約が届く）。
- 保存する `plan.md` では、共通の規約の部分が、規約の版（内容のハッシュ）への参照になっている。規約の本体は版ごとに 1 つだけ、PJR-Z0XR のモジュールが決める場所に保存される。
- plan を読んで prompt を組み立てる処理（`--resume`、reporter、plan を手で渡す `exec run --plan` を含む）が、参照から規約の全文を復元できる。規約の版が見つからないときは、原因が分かるエラーで止まる。
- 既存の plan（規約を埋め込んだもの）も、そのまま読める。
- 単体テストで、保存する plan の参照、prompt の全文、版が欠けたときのエラー、古い plan の読み取りを確かめている。1 件の plan で減った大きさを個票の対応結果に書いている。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` が通り、親の検証（`test-integration` を含む）が通っている。
- CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えていない。
- 保護された設定（`package.json`・`lefthook.yml`・`.github/workflows/`・`.specdojo/` の設定・agent の定義・`.gitignore` が保護されている場合はそれも）を変える必要があるときは、変えずに案を個票の対応結果に書き、pipeline では報告の `handoff` にも書いている。反映は利用者の承認のもと行う。
- 未決の点は executor が決め、決めた内容と理由を個票の対応結果に書き、pipeline では報告の `handoff` にも書いている。

## 4. 作業内容

| No  | 作業                             | 担当 | 状態 | メモ |
| --- | -------------------------------- | ---- | ---- | ---- |
| 1   | 保存する plan の規約を参照にする | DEV  | open | -    |
| 2   | prompt で全文を復元する          | DEV  | open | -    |
| 3   | テストを足す                     | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-2wc2-execution-records-growth]]: 増え方の抑制
