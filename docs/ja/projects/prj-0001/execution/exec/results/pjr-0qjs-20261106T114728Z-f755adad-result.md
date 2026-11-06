---
specdojo:
  id: prj-0001:xer-pjr-0qjs-20261106t114728z-f755adad
  type: exec-result
  task_id: PJR-0QJS
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-0qjs-20261106T114728Z-f755adad-plan.md
  started_at: "2026-11-06T11:47:38.925Z"
  completed_at: "2026-11-06T12:00:20.179Z"
  agent: sol-executor
  approach: sample-maintenance
  targets:
    - specdojo:stsd-sample
---

# Edit Result

## 1. 実施内容

- stsd-sample の目的を業務判断の説明へ改め、「状態の判定」章を追加しました。
- 通常系・例外系それぞれの図の直下に、対応する遷移表を配置しました。
- 全 8 遷移のラベルに対して、既存の遷移 ID を含める形式（`T-&lt;nn&gt;`）に更新しました。
- 駄菓子屋の業務文脈と、遷移の成立条件（照合条件）の整合性を維持しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/stsd-sample.md`: 章構成を新しい標準に合わせて更新しました。目的の記述を状態管理の観点に変更したほか、「状態の判定」章を新設し、状態遷移図の各ラベルへ遷移 ID を付与した上で、図の直下に遷移表を配置するように構成を変更しました。

## 3. 申し送り

- 他の Kata の差異を個票の「対応結果」に記録済みです。stsd-recipe 第 3・4・8 章と stsd-template は旧章構成のままであり、「適用範囲」に正本・スコープを含んでいます。また、template の遷移ラベルには ID も含まれていません。今回は `stsd-rulebook` を優先したため、recipe および template への追従は PJR-93NK および PJR-8TMF へ申し送ります。
- reporter の判断根拠: `stsd-rulebook` 第 5・6 章、`stsd-mermaid-rulebook` 第 3・6 章、`sample-authoring-standard`、および共通レビュー観点である `vp-qe-verifiability`、`vp-qe-omissions-consistency`、`vp-arc-conciseness` を確認しました。`stsd-job-run` および `stsd-deliverable` の Job Run 完成版レビュー結果も参照しています。`grade` の `F001`・`F002` が求める「発注内容との照合」は、編集前から状態一覧・初期遷移・`T-01` に反映されていたため、その成立条件を維持しています。変更後も 6 状態・8 遷移の対応、図表のイベント・条件、および到達性を確認済みです。
- 他の Kata の差異を個票の「対応結果」に記録済み。stsd-recipe 第3・4・8章と stsd-template は旧章構成で、適用範囲に正本・スコープを含み、図と遷移表が別章。template の遷移ラベルには ID もない。今回は rulebook を優先し、recipe・template の追従は PJR-93NK・PJR-8TMF へ申し送る。
- reporter の判断根拠: stsd-rulebook 第5・6章、stsd-mermaid-rulebook 第3・6章、sample-authoring-standard、共通レビュー観点の vp-qe-verifiability・vp-qe-omissions-consistency・vp-arc-conciseness を確認した。stsd-job-run・stsd-deliverable と Job Run 完成版レビュー結果も参照した。grade の F001・F002 が求める発注内容との照合は編集前から状態一覧・初期遷移・T-01 に反映済みであり、その条件を維持した。変更後も6状態・8遷移の対応、図表のイベント・条件、到達性を確認した。

## 4. 進め方と実践の型の適用

stsd-sample を新しい章立てと遷移 ID 入りのラベルに合わせるため、`stsd-rulebook` および `stsd-mermaid-rulebook` の規範に基づき、目的・適用範囲・状態の判定の区分けを行い、図と遷移表の関連付け（ID 付与と図直下への配置）を整備しました。
