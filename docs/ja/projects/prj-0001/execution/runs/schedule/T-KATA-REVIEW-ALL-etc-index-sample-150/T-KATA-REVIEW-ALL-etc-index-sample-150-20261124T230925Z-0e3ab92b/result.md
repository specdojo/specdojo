---
specdojo:
  id: prj-0001:xer-t-kata-review-all-etc-index-sample-150-20261124t230925z-0e3ab92b
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-etc-index-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-etc-index-sample-150/T-KATA-REVIEW-ALL-etc-index-sample-150-20261124T230925Z-0e3ab92b/plan.md
  started_at: "2026-11-24T23:09:34.472Z"
  completed_at: "2026-11-24T23:19:19.056Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:etc-index-sample
    - specdojo:etc-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として `etc-index-sample` を、`tsp-index-sample`・`etc-sample`・`etc-index-rulebook` と照合して修正しました。内部結合テストの範囲の表記、分割見直しの閾値、ケース表の記入例（トレース・証跡）を直しました。
- 次の 4 件は sample 側を修正しました。R5-1 内部結合テストの範囲、R5-2 分割閾値（F009）、R5-3 トレース列（F007）、R5-4 証跡列。
- F001・F008 は、相手側 `itc-index-sample` の食い違いと判断しました。今の `tsp-index-sample` では `PATH-04`・`PATH-07` が内部結合テスト、`PATH-05`・`PATH-06` が外部結合テストです。`etc-index-sample` はこの定めと一致しているため、変更していません。直す案は handoff に「要判断」として記録しました。
- F002・F003・F004 は計画・報告の観点です。kata-guide はこの観点を kata の段のレビューで使わないと定めているため、この段では扱いません。F005・F006 は前の段の版で解消済みなので、指摘を繰り返していません。
- 検証結果は次のとおりです。executor が実行した `npx prettier --write` と `npx markdownlint` は passed でした。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も passed でした。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/etc-index-sample.md`: 目的と適用対象の内部結合テストの範囲を「画面・記録サービス・保全・復元処理と業務記録データベース（DB）の結合」に直し、`tsp-index-sample` に合わせました。分割を見直す閾値を「観点が 15 以上か、ケース表が 50 行以上」に直し、rulebook の条件に合わせました。ケース表の記入例では、トレースを `TR-01,TR-05` にし、証跡に `tests/et/receipt-print/failure-handling.test.ts` を加えて、`etc-sample` の同じケースと一致させました。prettier で表の列幅も揃えました。

## 3. 申し送り

- R5-5（要判断）: 相手側 `itc-index-sample` の適用対象の段落と、外部結合テストの行・対象外の表が、`PATH-04`〜`PATH-07` を外部結合テスト（`etc-backup-storage`）の範囲として内部結合テストでは扱わないとしています。このままでは `PATH-04`（保全の取得）と `PATH-07`（復元の回復）をどのテストも扱いません。案は `itc-index-sample` を `tsp-index-sample` に合わせることです。具体的には、`PATH-04`・`PATH-07` を内部結合テストの範囲に入れ、保全の取得と復元後の記録一致の term・観点を置き、外部結合テストの代替先を `PATH-05`・`PATH-06` に絞ります。選ばなかった案は、`etc-index-sample` に `PATH-04`・`PATH-07` と復元の回復の観点を加えることです。`tsp-index-sample` の内部結合テストの範囲に反するため不採用としました。`tsp-index-sample` を正本としましたが、どちらに合わせるかは人が判断してください。
- F002・F003・F004 は、計画・報告の観点（`vp-pm-plan-feasibility`・`vp-pm-control-reporting`）の指摘です。この段では扱っていません。担当の Role code や登録簿の引き継ぎ先（PJR の ID）を示す必要があれば、登録簿の運用として別途判断してください。
- R5-1: R5 / 1. 本ドキュメントの目的と適用対象 / 内部結合テストで扱う範囲が「画面・記録サービス・業務記録 DB」となっており、tsp-index-sample の内部結合テストの範囲（保全・復元処理を含む）と一致しない / 「画面・記録サービス・保全・復元処理と業務記録データベース（DB）の結合は内部結合テストで扱う」に直した / vp-qe-kata-conformance（tsp-index-sample のテストレベル表の内部結合テストの行） / -
- R5-2: R5 / 2. テスト対象の括り方と分割基準 / 分割を見直す閾値「観点が 15 を超える・ケース表が 50 行を超えた」が、rulebook の「観点が 15 以上、表が 50 行以上」と境界値で食い違う（F009） / 「観点が 15 以上か、ケース表が 50 行以上になった時点」に直した / vp-qe-kata-conformance（etc-index-rulebook の分割基準） / -
- R5-3: R5 / 8. ケース表の共通カラム / 記入例のトレース列が説明文で、同じケース et-receipt-print-failure-handling-010 の etc-sample の値（`TR-01,TR-05`）や rulebook が求める ID と合わない（F007） / `TR-01,TR-05`（etc-receipt-print のトレース表で仕様 ID に対応付ける）に直した / vp-qe-kata-conformance（etc-index-rulebook のケース表カラムの定義、etc-rulebook のトレース章、etc-sample の 6.2.2.） / -
- R5-4: R5 / 8. ケース表の共通カラム / 記入例の証跡が、etc-sample の同じケースの証跡（テストファイル名を含む）と食い違う / `tests/et/receipt-print/failure-handling.test.ts` を加え、etc-sample と同じ証跡の構成にした / vp-qe-kata-conformance（etc-sample の 6.2.2.） / -
- R5-5: R5 / 2. テスト対象の括り方と分割基準（相手側: itc-index-sample） / F001・F008 は tsp-index-sample が `PATH-04`〜`PATH-07` を外部結合テストの範囲とする前提だが、今の版の tsp-index-sample は `PATH-04`・`PATH-07` を内部結合テスト、`PATH-05`・`PATH-06` を外部結合テストとしており、etc-index-sample と一致する。食い違っているのは itc-index-sample の適用対象の段落と、外部結合テストの行・対象外の表で、`PATH-04`〜`PATH-07` を外部結合テスト（etc-backup-storage）の範囲として内部結合テストでは扱わないとしている。このままでは保全の取得（`PATH-04`）と復元の回復（`PATH-07`）をどのテストも扱わない / - / vp-qe-kata-conformance、vp-dev-change-impact。相手側の案: itc-index-sample を tsp-index-sample に合わせ、`PATH-04`・`PATH-07` を内部結合テストの範囲に入れて保全の取得と復元後の記録一致の term・観点を置き、外部結合テストの代替先を `PATH-05`・`PATH-06` に絞る。選ばなかった案: etc-index-sample に `PATH-04`・`PATH-07` と復元の回復の観点を加える（tsp-index-sample の内部結合テストの範囲と保全・復元の内部結合テストでの確認の記述に反するため不採用）。tsp-index-sample を正本としたが、どちらに合わせるかは人が判断する / 要判断
- R5-6: R5 / 9. メモ / 将来課題 / F002（vp-pm-plan-feasibility）・F003・F004（vp-pm-control-reporting）は計画・報告の観点で、kata-guide の「kata の観点の組」はこれらを kata の段のレビューで使わないと定めているため、この段では扱わない / - / kata-guide の kata の観点の組（外す観点の表）。必要なら登録簿の運用として別途判断する / -
- R5-7: R5 / 4. 観点の立て方（共通）・5. 条件の立て方（共通） / F005（遅延の具体値）・F006（ET で扱う範囲の非機能の型）は前の段の版ですでに解消済み（遅延は 9 秒・29 秒、非機能の行あり）のため指摘を繰り返さない / - / vp-qe-verifiability、vp-qe-omissions-consistency（前の段の範囲） / -

## 4. 進め方と実践の型の適用

根拠は次の文書です。`tsp-index-sample`、`etc-sample`、`etc-index-rulebook`、kata-guide の R5（整合）と「kata の観点の組」、`sample-authoring-standard`。食い違いは rulebook と上流の `tsp-index-sample` を正として判定しました。sample 側に原因がある食い違いだけを直し、相手側（`itc-index-sample`）に原因がある食い違いは変更せず、直す案を handoff に残しました。前の段で解消済みの F005・F006 は繰り返していません。根拠が足りず見送った指摘はありません。F001・F008 は sample 側に誤りがなく、人の判断が必要なため未解消として記録しました。
