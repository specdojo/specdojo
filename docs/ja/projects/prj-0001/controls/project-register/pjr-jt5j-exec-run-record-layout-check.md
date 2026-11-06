---
specdojo:
  id: prj-0001:pjr-jt5j-exec-run-record-layout-check
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
  registered_at: "2026-11-06T15:06:36Z"
  due_on: null
  derived_from:
    - PJR-VH8D
  depends_on:
    - PJR-9BY9
---

# PJR-JT5J 実行記録の置き場所を validate と CI で検査し、ガイドと照らす

## 1. 概要

決まった場所の外のファイルや run のディレクトリの欠けを exec validate と CI で検出し、ガイドの構成図をモジュールと照らすテストを置き、lock・controls/reviews・assessments の置き場所をそろえる（R3・R4、VH8D の #9・#11・#13）

## 2. 入力

- PJR-VH8D の決定（2026-11-07 indie）: 実行記録は run 単位のディレクトリ execution/runs/`<出どころ>`/`<項目 ID>`/`<run ID>`/ に plan.md・result.md・evidence.json・ログを置く（R1）。出どころは register・schedule・job。置き場所を決める処理はコードの 1 つのモジュールにまとめる（R2）。exec validate と CI で置き場所を検査する（R3）。ガイドの構成図をモジュールと照らすテストを置く（R4）。grade/results と jobs/ の定義は外に残す。既存は git mv で移し、パスの欄だけ書き換える

## 3. 完了条件

- `exec validate` が、実行記録の置き場所の外にあるファイル、run のディレクトリで欠けているファイル（plan・result・evidence）、Git の無視の対象になっていない lock を検出し、場所と理由を出す。既存の正常な記録では何も出ない。
- CI で同じ検査を流す workflow の案がある（`.github/workflows/` は保護された設定のため、案を個票の対応結果に書く）。
- ガイドの構成図（docs-structure-guide・plan-result-lifecycle-guide）に書いたディレクトリと、PJR-Z0XR のモジュールが返すディレクトリを照らす単体テストがあり、食い違うと失敗する。
- `routines/.locks/` の扱いを exec の `.locks/` とそろえている（PJR-PZBP で済んでいればそれを確かめる）。ガイドの `controls/reviews/` を実物の `controls/generated/` に直している。`schedule/assessments/generated/` をほかの横断ディレクトリと同じ深さにそろえ、参照するコードとガイドを合わせている。
- 単体テストで、置き場所の外のファイル・欠けたファイル・無視されていない lock の検出を確かめている。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` が通り、親の検証（`test-integration` を含む）が通っている。
- CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えていない。
- 保護された設定（`package.json`・`lefthook.yml`・`.github/workflows/`・`.specdojo/` の設定・agent の定義・`.gitignore` が保護されている場合はそれも）を変える必要があるときは、変えずに案を個票の対応結果に書き、pipeline では報告の `handoff` にも書いている。反映は利用者の承認のもと行う。
- 未決の点は executor が決め、決めた内容と理由を個票の対応結果に書き、pipeline では報告の `handoff` にも書いている。

## 4. 作業内容

| No  | 作業                                   | 担当 | 状態 | メモ |
| --- | -------------------------------------- | ---- | ---- | ---- |
| 1   | validate に置き場所の検査を足す        | DEV  | open | -    |
| 2   | ガイドとモジュールを照らすテストを足す | DEV  | open | -    |
| 3   | 細かい置き場所をそろえる               | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-vh8d-execution-records-layout]]: 配置の決定
- [[specdojo:docs-structure-guide]]: 構成図の正本
