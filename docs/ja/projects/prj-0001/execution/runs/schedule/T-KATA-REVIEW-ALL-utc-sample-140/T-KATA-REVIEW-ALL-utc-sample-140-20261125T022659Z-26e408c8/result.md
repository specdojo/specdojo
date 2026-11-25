---
specdojo:
  id: prj-0001:xer-t-kata-review-all-utc-sample-140-20261125t022659z-26e408c8
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-utc-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-utc-sample-140/T-KATA-REVIEW-ALL-utc-sample-140-20261125T022659Z-26e408c8/plan.md
  started_at: "2026-11-25T02:27:08.721Z"
  completed_at: "2026-11-25T02:39:40.384Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:utc-sample
    - specdojo:utc-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R4（正しさ）として、`utc-sample` に書かれた事実の主張 18 件を schema・rulebook・参照先の sample と突き合わせた。
- 誤り 2 件を直した。どちらも対象外の代替経路の指定で、PATH-05 を外部結合テストの `receipt-print` 連携に、PATH-01 を PATH-02・PATH-03 にした。
- 残る主張は一致するか、正本のない架空の仮定（`confirmCheckout`、`tests/unit/sales-checkout.test.ts`）だった。
- `npx prettier --check` と runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` は通過した。
- runner の検査のうち `lint:ts`・`lint:md`・`lint:fm`・`test:integration`・`typecheck`・`test:unit` は、変更種別が対象外のため `not_applicable` だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/utc-sample.md`: 対象外・除外理由の代替経路 2 か所を直した。印刷失敗時に会計を維持することの代替を `PATH-05` から外部結合テストの `receipt-print` 連携に、販売記録と在庫の DB 保存の代替を `PATH-01` から内部結合テスト `PATH-02`・`PATH-03` にした。差分は 2 行の置換（+2/-2）。

## 3. 申し送り

- R4 の確かめの表は executor の handoff（R4-03）にある 18 件で、不一致は R4-01・R4-02 の 2 件だった。どちらも直した。
- F006（index の記入例との条件の書き方の違い）と F007（釣銭の計算が本書にない点）は `vp-qe-kata-conformance`（kata 相互）に当たるため未対応で、R5 に任せる。
- F001・F002・F009 は kata のレビューに使わない観点のため、本段では扱っていない。
- R4-01 [正しさ/直した] 対象外の「印刷失敗時に会計を維持すること」の代替が `PATH-05` になっていたが、ifd-sample の `PATH-05` は「保全・復元処理 → 復元用保管サービス」の経路で印刷とは関係がない。tsp-index-sample と utc-index-sample に合わせて「外部結合テストの `receipt-print` 連携」に直した。
- R4-02 [正しさ/直した] 対象外の「販売記録と在庫の DB 保存」の代替が `PATH-01`（画面の取得）になっていた。utc-index-sample の「対象外・除外理由（共通）」と ifd-sample に合わせて「内部結合テスト `PATH-02`・`PATH-03`」に直した。
- R4-03 [確かめの表] 主張 18 件を確かめた（frontmatter の type・rulebook・`based_on`、章の構成、`case_id` の形式、10 列の順、kinuya-test-data、TR-01〜TR-05 と BAC-01・BAC-02・tsp-index-sample、PATH の割り当て、utc-sale-input、依存の制御、receipt-print の例外、優先度と自動化、kinuya-ci-unit）。不一致は R4-01・R4-02 の 2 件で、どちらも直した。`confirmCheckout` と `tests/unit/sales-checkout.test.ts` は正本のない架空の仮定のため確かめていない。
- R4-04 [grade の finding の扱い] F003（入口の名前）・F004・F005（証跡のテストコードのパス）・F008（受け取りの印刷要求に適用した例外）は、前の段が直した版で解消していることを確かめた。
- R4-05 [grade の finding の扱い] F001・F009 の観点（`vp-po-decision-readiness`・`vp-ops-release-readiness`）と F002 の観点（`vp-pm-dependency-risk`）は、kata-guide の「kata の観点の組」で kata のレビューに使わない観点のため扱わない。
- R4-06 [grade の finding の扱い/R5 へ] F006（index の記入例との条件の書き方の違い。トレースは TR-02 にそろっており、残るのは `環境: なし` の有無と期待値の言い回し）と F007（index 側の責務にある釣銭の計算が本書にない）は `vp-qe-kata-conformance`（kata 相互）に当たるため R5 に任せる。

## 4. 進め方と実践の型の適用

sample-maintenance の R4（正しさ）として、sample の事実の主張を schema、rulebook、参照先の sample（ifd-sample、tsp-index-sample、utc-index-sample、bac-sample）と突き合わせた。不一致は PATH の割り当て 2 件で、各正本に合わせて直した。F003・F004・F005・F008 は、前の段が直した版で解消していることを確かめた。F001・F002・F009 は kata の観点の組の対象外、F006・F007 は kata 相互の整合として R5 の担当にした。根拠不足の見送りはなく、sample の status は `draft` のまま据え置いた。
