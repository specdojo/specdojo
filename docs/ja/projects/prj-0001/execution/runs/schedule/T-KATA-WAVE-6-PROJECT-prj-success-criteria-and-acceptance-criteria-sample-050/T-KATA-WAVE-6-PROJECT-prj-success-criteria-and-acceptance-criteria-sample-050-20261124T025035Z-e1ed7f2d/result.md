---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-project-prj-success-criteria-and-acceptance-criteria-sample-050-20261124t025035z-e1ed7f2d
  type: exec-result
  task_id: T-KATA-WAVE-6-PROJECT-prj-success-criteria-and-acceptance-criteria-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-PROJECT-prj-success-criteria-and-acceptance-criteria-sample-050/T-KATA-WAVE-6-PROJECT-prj-success-criteria-and-acceptance-criteria-sample-050-20261124T025035Z-e1ed7f2d/plan.md
  started_at: "2026-11-24T02:50:42.603Z"
  completed_at: "2026-11-24T02:55:21.038Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:prj-success-criteria-and-acceptance-criteria-sample
    - specdojo:prj-success-criteria-and-acceptance-criteria-sample
---

# Edit Result

## 1. 実施内容

- 成功基準と受入条件の sample を、20 件の finding に基づいて厚く更新しました。
- 既存の ID を維持しつつ、`BV-04`、`SC-07`〜`SC-10`、`AC-05` を追加して、共通サンプル文脈としての厚みを持たせました。
- 例外表は `template` の列構成（論点・扱い・解決期限 / 判断タイミング・責任者）に合わせて再構成し、判定への影響を「扱い」の列に集約する形で記述しました。
- 判定手順、証跡の保存先（受入確認記録）、および担当 `Role code` を補完し、成果物の完成度を高めました。
- `prettier` および `markdownlint` による静的検査を実施し、問題がないことを確認しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-success-criteria-and-acceptance-criteria-sample.md`: finding に基づき、成功基準（`SC`）と受入条件（`AC`）の定義を拡充。判定指標の具体化、ベースライン収集の担当、および `_UNDECIDED_` とした未決事項（人気商品の範囲、長期滞留の定義など）を記述しました。また、例外表を `template` の構成に合わせ、各論点の担当 `Role code` を追加しました。

## 3. 申し送り

- 下流の sample の整合: 初期受入の必須条件が `SC-01`・`SC-07`・`SC-09`・`AC-01`〜`AC-05` になった。`trc-requirements-to-tests-sample`（「`SC-01`・`AC-01`〜`AC-04`（5 件）」）、`atc-index-sample`・`itc-index-sample`（「`SC-01`・`AC-01`〜`AC-04`」）はこれに合わせる手直しが要る。
- rulebook の変更案: rulebook の「例外条件と未解決事項」の推奨表は「論点・判定への影響・当面の扱い」で、`template` の「論点・扱い・解決期限 / 判断タイミング・責任者」と食い違う（`F017`）。sample は `template` に合わせ、判定への影響は「扱い」の列に書いた。rulebook の推奨表を `template` に揃え、判定への影響は扱いの列に書くと定めることを提案する。
- 利用者が決める値（`_UNDECIDED_` のまま）: `SC-04` の人気商品の対象範囲と除外条件、`SC-05` の長期滞留の日数の基準、ベースラインが繁忙期にかかる場合の比較の扱い、オフライン時の記録方法。
- 前提として置いた判断（承認者の確認が要る）: `SC-05` は3区分を合算し、数量と金額の両方で20%以上の削減を合格とした。`SC-09` のつけ残高を1分以内に確認する条件は、共通サンプル文脈の期待効果に合わせて初期受入の必須とした。概要 sample の期待効果の表には1分の目標がないため、概要 sample へ反映するかを判断する。
- 下流の sample の整合: 初期受入の必須条件が SC-01・SC-07・SC-09・AC-01〜AC-05 になった。`trc-requirements-to-tests-sample`（「SC-01・AC-01〜AC-04（5 件）」）、`atc-index-sample`・`itc-index-sample`（「SC-01・AC-01〜AC-04」）はこれに合わせる手直しが要る。
- rulebook の変更案: rulebook の「例外条件と未解決事項」の推奨表は「論点・判定への影響・当面の扱い」で、template の「論点・扱い・解決期限 / 判断タイミング・責任者」と食い違う（F017）。sample は template に合わせ、判定への影響は「扱い」の列に書いた。rulebook の推奨表を template に揃え、判定への影響は扱いの列に書くと定めることを提案する。
- 利用者が決める値（`_UNDECIDED_` のまま）: SC-04 の人気商品の対象範囲と除外条件、SC-05 の長期滞留の日数の基準、ベースラインが繁忙期にかかる場合の比較の扱い、オフライン時の記録方法。
- 前提として置いた判断（承認者の確認が要る）: SC-05 は3区分を合算し、数量と金額の両方で20%以上の削減を合格とした。SC-09 のつけ残高を1分以内に確認する条件は、共通サンプル文脈の期待効果に合わせて初期受入の必須とした。概要 sample の期待効果の表には1分の目標がないため、概要 sample へ反映するかを判断する。
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル（plan・result・個票）を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更した YAML ファイルがない）

## 4. 進め方と実践の型の適用

rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くしました。`grade` の指摘（`finding`）をすべて解決しつつ、利用者が判断すべき事項を `_UNDECIDED_` として残すことで、実例としての価値を持たせています。
