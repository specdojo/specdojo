---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-usability-sample-140-20261126t052124z-40c1d67b
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-usability-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-usability-sample-140/T-KATA-REVIEW-ALL-nfr-usability-sample-140-20261126T052124Z-40c1d67b/plan.md
  started_at: "2026-11-26T05:21:34.886Z"
  completed_at: "2026-11-26T05:32:28.514Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-usability-sample
    - specdojo:nfr-usability-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、`nfr-usability-sample.md` の主張を参照先の sample（`specdojo:uis-sample`、`specdojo:stc-sample`）と突き合わせた。食い違う 2 か所を直した。
- 1 つ目は `nfr-usb-006` の `備考` である。確定済み会計の取消を対象画面の外の業務として対象外にした。
- 2 つ目は「関連ドキュメント導線」の「総合テスト」行の目的である。`stc-sample` の実際の範囲に合わせた。
- grade の F001 と F002 は前の段の版ですでに解消されていたため、この段では追加の修正をしていない。
- runner 検査は `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed だった。ほかの検査は変更の種類により `not_applicable` になった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R4 | nfr-usability-sample.md「操作性要件一覧」の `nfr-usb-006` の `備考` | 破壊的操作に「確定済み会計の取消」を含めていた。`specdojo:uis-sample` の「確定後の取消は別業務とする」と食い違う。対象画面のどれにもこの業務がないため、測定方法の「対象画面の操作から洗い出す」では数えられない。 | 対象を「取引中止、つけ記録の取消」とし、確定済み会計の取消は対象画面の外の業務として対象外にした。 | `specdojo:uis-sample` の 21 行目 | minor/vp-qe-verifiability |
| 2 | R4 | nfr-usability-sample.md「関連ドキュメント導線」の「総合テスト」行 | `specdojo:stc-sample` の目的を「会計画面でのエラー表示と確認」としていた。`stc-sample` が扱うのは確定前の取消と印刷失敗の警告だけで、入力エラーの表示や中止確認ダイアログのケースはない。 | 目的を「`nfr-usb-005`・`nfr-usb-006` を判定する総合テストの会計の経路」に改めた。 | `specdojo:stc-sample` の 16・82・96〜97 行目 | minor/vp-arc-technical-constraints |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-usability-sample.md`: `nfr-usb-006` の `備考` で、破壊的操作の対象を「取引中止、つけ記録の取消」にした。確定済み会計の取消は、`uis-sample` の「確定後の取消は別業務」に合わせて対象外とした。「総合テスト」行の目的は「`nfr-usb-005`・`nfr-usb-006` を判定する総合テストの会計の経路」に改めた。あわせて prettier で表の列幅を整形した。

## 3. 申し送り

- 確かめられない主張として、`nfr-usb-002` の取消理由「誤登録」と、`nfr-usb-006` のつけ記録の取消の確認がある。正本となる `uis-credit-ledger` と取消業務の画面仕様が未作成のためである。共通サンプル文脈とは食い違わないので仮定として残した。画面仕様ができた後に照合し直す。
- [minor/vp-qe-verifiability] 「操作性要件一覧」の `nfr-usb-006` の `備考` は、破壊的操作に「確定済み会計の取消」を含めていた。`specdojo:uis-sample` の「確定後の取消は別業務とする」（21 行目）と食い違い、対象画面のどれにもこの業務がないため、測定方法の「対象画面の操作から洗い出す」では数えられない。対象を「取引中止、つけ記録の取消」とし、確定済み会計の取消は対象画面の外の業務として対象外にした。
- [minor/vp-arc-technical-constraints] 「関連ドキュメント導線」の「総合テスト」行は、`specdojo:stc-sample` の目的を「会計画面でのエラー表示と確認」としていた。`stc-sample` が扱うのは確定前の取消と印刷失敗の警告だけで（16・82・96〜97 行目）、入力エラーの表示や中止確認ダイアログのケースはない。目的を「`nfr-usb-005`・`nfr-usb-006` を判定する総合テストの会計の経路」に改めた。
- 確かめられない主張: `nfr-usb-002` の取消理由「誤登録」と、`nfr-usb-006` のつけ記録の取消の確認には正本がない。`uis-credit-ledger` と取消業務の画面仕様が未作成のためである。共通サンプル文脈とは食い違わないので仮定として残した。画面仕様ができた後に照合し直す。
- grade の finding F001・F002 は前の段の版ですでに解消されていた。F001 は `sac-store-sales` に「（未作成）」が明示済み、F002 は判定者が Role code の `BA・QE` になっている。この段では追加の修正をしていない。
- 適用外の検証: `npm run validate:history-links`（変更したのは sample 1 件だけで、plan・result・個票の履歴蓄積ファイルを変更していないため）

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に従い、sample の事実の主張を参照先の sample と突き合わせた。確かめられた範囲だけを直し、正本がない主張は共通サンプル文脈と矛盾しない仮定として残した。grade の F001 と F002 は前の段の版ですでに解消されていたことを確認し、追加の修正はしていない。
