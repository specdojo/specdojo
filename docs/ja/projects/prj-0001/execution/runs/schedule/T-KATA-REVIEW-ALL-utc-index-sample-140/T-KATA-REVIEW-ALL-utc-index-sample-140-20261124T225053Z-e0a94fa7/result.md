---
specdojo:
  id: prj-0001:xer-t-kata-review-all-utc-index-sample-140-20261124t225053z-e0a94fa7
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-utc-index-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-utc-index-sample-140/T-KATA-REVIEW-ALL-utc-index-sample-140-20261124T225053Z-e0a94fa7/plan.md
  started_at: "2026-11-24T22:51:04.406Z"
  completed_at: "2026-11-24T23:03:22.380Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:utc-index-sample
    - specdojo:utc-index-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）のレビューとして、`utc-index-sample` の主張を schema、rulebook、tsp-index-sample、bac-sample、ifd-sample と突き合わせた。
- 誤りを 3 件直した。業務記録 DB の代替レベルの `PATH` 番号の誤り、`receipt-print` と保管サービスの `PATH` 対応の誤り、適用対象の「印刷要求の回数と内容」の抜けである。
- finding のうち F001・F003・F004 を反映した。F002・F005〜F008 は前の段（120・130）が直した版で解消済みだった。
- F009 は kata-guide の「kata の観点の組」で kata の段のレビューでは使わない観点のため扱わなかった。
- 検証は、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed だった。executor の prettier と markdownlint も passed だった。変更種別により対象外とされた検査は runner が記録している。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/utc-index-sample.md`: 次の 6 点を修正した。(1) 対象外・除外理由で、業務記録 DB の代替レベルの経路を `PATH-01`〜`PATH-03` から `PATH-02`・`PATH-03` に直した。(2) `receipt-print` と保管サービスの代替を「外部結合テスト（`receipt-print` 連携、保管サービスは `PATH-05`・`PATH-06`）」に直した。(3) 適用対象に「会計確定時の印刷要求の回数と内容」を足した。(4) F001 として、`utc-sales-checkout` の依存の扱いに記録サービス Stub、`receipt-print` Mock、採番器の注入を足した。(5) F003 として、`優先度` に BAC-03 の保留判定を P0、確定前に店番が気づける入力検証を P1 とする区分を足した。(6) F004 として、CI 整備前の `証跡` を、DEV が単体テスト全件を実行して失敗 0 件を確かめ、実行日・コミット・実行件数を残す書き方にした。

## 3. 申し送り

- R4-1 の `PATH-02`・`PATH-03` への修正は、`PATH-03` だけにする案と迷い、保存の要求の経路も含めた。人の判断を要する。
- R4-5 の `優先度` の P1 の区分は、正本のない業務の仮定である。人の判断を要する。
- R4-6 の CI 整備前の `証跡` には、具体的なコマンド名を書いていない。駄菓子屋の架空システムに正本がないためである。人の判断を要する。
- 確かめ17（初期リリースの単体テスト対象は同期処理だけ）は、正本がなく確かめられなかった。確かめ18（テストコードの位置 `tests/unit/sales-checkout.test.ts`）も、未同梱の架空例のため確かめられなかった。確かめ16 の `kinuya-ci-unit` は、tsp-index-sample に記載はあるが実体が未同梱で、実行は確かめられない。
- F009 の `_UNDECIDED_` と `_ASSUMPTION_` は、sample に残っている。ready 化は登録簿で追う。
- R4-1: R4 / 対象外・除外理由（共通） / 業務記録 DB の代替レベル「内部結合テスト（`PATH-01`〜`PATH-03`）」の `PATH-01` は店頭操作端末から画面提供サービスへの画面資材の取得で、DB への保存結果と関係しない / `PATH-02`・`PATH-03` に直した / `vp-arc-technical-constraints`。ifd-sample の PATH 一覧（`PATH-01` 画面の取得、`PATH-02` 記録・照会の依頼、`PATH-03` 業務記録の参照と更新）。`PATH-03` だけにする案と迷い、保存の要求の経路も含めた / 要判断
- R4-2: R4 / 対象外・除外理由（共通） / `receipt-print` と保管サービスの代替を「外部結合テスト（`PATH-05`・`PATH-06`）」としていたが、`PATH-05`・`PATH-06` は保管サービスの経路で、`receipt-print` には PATH が定義されていない / 「外部結合テスト（`receipt-print` 連携、保管サービスは `PATH-05`・`PATH-06`）」に直した / `vp-arc-technical-constraints`。ifd-sample の PATH-05・PATH-06、tsp-index-sample の外部結合テストの行 / -
- R4-3: R4 / 本ドキュメントの目的と適用対象 / 対象の列挙に、テスト戦略の単体テストの範囲にある「印刷要求の回数と内容」が抜けていた（本書の依存の表には `receipt-print` Mock がある） / 対象に「会計確定時の印刷要求の回数と内容」を足した / `vp-qe-verifiability`。tsp-index-sample のテストレベルの表の単体テストの行 / -
- R4-4: R4 / テスト対象の括り方と分割基準 / F001: `utc-sales-checkout` の依存の扱いが「商品・在庫リポジトリは Fake」だけで、記録サービス Stub・`receipt-print` Mock・採番器を持つ term が読めない / 「記録サービスは Stub、`receipt-print` は Mock、取引番号は採番器を注入」を足した / `vp-arc-technical-constraints`、単体テスト共通の境界/依存の扱いの表 / -
- R4-5: R4 / ケース表の共通カラム / F003: `優先度` の区分で、`utc-sale-input` の入力検証と BAC-03 の保留判定の優先度が決まらない / BAC-03 の保留判定を P0 に含め、数量の形式など確定前に店番が気づける入力検証を P1 とした / `vp-dev-implementation-readiness`。BAC-03 の誤った確定は在庫の誤更新につながる。P1 の区分は正本のない業務の仮定 / 要判断
- R4-6: R4 / ケース表の共通カラム / F004: CI 整備前の `証跡` に、実行する範囲と合格の判定がない / DEV が手元で単体テスト全件を実行して失敗 0 件を確かめ、実行日・コミット・実行件数を残す書き方にした / `vp-dev-testability`。具体的なコマンド名は駄菓子屋の架空システムに正本がないため書かなかった / 要判断
- R4-7: R4 / 前の段で解消済みの finding / F002・F005・F006・F007・F008 は、前の段（120・130）が直した版で該当の記述が解消済みだった。F005 の該当行は「品質ゲートに従う」への委譲になっている / - / 前の段の差分（git log 7338daa342・a61d490392） / -
- R4-8: R4 / メモ / 将来課題 / F009（`vp-ops-release-readiness`）は、kata-guide の「kata の観点の組」で kata の段のレビューでは使わない観点のため扱わない / - / kata-guide の「kata の観点の組」の外す観点の表。ready 化は登録簿で追う / -
- 確かめ1: 主張=frontmatter の `type: test` / 正本=docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml、utc-index-rulebook の推奨 Frontmatter 項目 / 確かめ方=読み取り / 結果=一致 / 根拠=enum に test、rulebook は `specdojo.type` を test と定める
- 確かめ2: 主張=見出し 1〜9 の構成 / 正本=utc-index-rulebook の本文要件 / 確かめ方=読み取り / 結果=一致 / 根拠=見出しの番号と名称が表と同じ
- 確かめ3: 主張=内部結合以降は各レベルの `*c-index` で扱う / 正本=utc-index-rulebook の記述ガイド / 確かめ方=読み取り / 結果=一致 / 根拠=rulebook の 6.1
- 確かめ4: 主張=観点 15 以上・ケース表 50 行以上で分割を検討 / 正本=utc-index-rulebook の 6.2 / 確かめ方=読み取り / 結果=一致 / 根拠=例 15 以上／50 以上
- 確かめ5: 主張=業務記録 DB の代替は内部結合テスト（`PATH-01`〜`PATH-03`） / 正本=docs/ja/specdojo/samples/ifd-sample.md、tsp-index-sample.md / 確かめ方=PATH を grep / 結果=不一致 / 根拠=`PATH-01` は画面の取得。`PATH-02`・`PATH-03` に直した
- 確かめ6: 主張=`receipt-print` と保管サービスの代替は外部結合テスト（`PATH-05`・`PATH-06`） / 正本=ifd-sample.md、tsp-index-sample.md / 確かめ方=grep / 結果=不一致 / 根拠=ifd-sample に `receipt-print` の PATH がない。PATH の対応を分けて直した
- 確かめ7: 主張=性能・処理量の代替は総合テスト（性能測定） / 正本=tsp-index-sample.md / 確かめ方=読み取り / 結果=一致 / 根拠=総合テストの行に性能（日次締めを含む）
- 確かめ8: 主張=基準データ `kinuya-test-data`（商品A: 単価30円・在庫5個） / 正本=tsp-index-sample.md、bac-sample.md / 確かめ方=grep / 結果=一致 / 根拠=tsp の 95 行、bac の共通前提
- 確かめ9: 主張=C-01 は数量2・在庫5→3、C-02 は在庫と同数の5・請求額150円・在庫0 / 正本=bac-sample.md / 確かめ方=grep / 結果=一致 / 根拠=BAC-01 のケース表
- 確かめ10: 主張=BAC-02 は在庫超過で確定しない、BAC-03 は C-03・C-04 で保留する / 正本=bac-sample.md / 確かめ方=grep / 結果=一致 / 根拠=BAC-02 は希望6個・在庫5個、BAC-03 は C-03 商品未特定・C-04 数量不明
- 確かめ11: 主張=AC-02 はつけ残高確認 / 正本=prj-success-criteria-and-acceptance-criteria-sample.md / 確かめ方=grep / 結果=一致 / 根拠=AC-02「在庫とつけ残高を確認できる」
- 確かめ12: 主張=DB は Fake、記録サービスは Stub、`receipt-print` は Mock / 正本=tsp-index-sample.md のテスト環境の表 / 確かめ方=読み取り / 結果=一致 / 根拠=開発環境の行（記録サービスはスタブ、印刷要求はモック）
- 確かめ13: 主張=ケース表は rulebook の 10 カラムをこの順で置く / 正本=utc-index-rulebook の 6.8 / 確かめ方=読み取り / 結果=一致 / 根拠=記入例の列順が rulebook と同じ
- 確かめ14: 主張=`case_id` `ut-sales-checkout-stock-allocation-020` / 正本=utc-index-rulebook の 6.8 / 確かめ方=形式の照合 / 結果=一致 / 根拠=`&lt;level&gt;-&lt;term&gt;-&lt;perspective_key&gt;-&lt;nnn&gt;`、nnn は 3 桁で 10 刻み
- 確かめ15: 主張=`自動化` は `automated`、`優先度` は P0/P1/P2 / 正本=utc-index-rulebook の 6.8 / 確かめ方=読み取り / 結果=一致 / 根拠=manual/automated/mixed、P0/P1/P2
- 確かめ16: 主張=CI ジョブ `kinuya-ci-unit` / 正本=tsp-index-sample.md / 確かめ方=grep / 結果=一致 / 根拠=115 行の架空の CI ジョブ。実体は未同梱で、実行は確かめられない
- 確かめ17: 主張=初期リリースの単体テスト対象は同期処理だけ / 正本=なし / 確かめ方=tsp-index-sample.md を grep / 結果=確かめられない / 根拠=tsp に同期・非同期の記述がない。駄菓子屋の業務の仮定として扱い、共通サンプル文脈と食い違わない
- 確かめ18: 主張=テストコードの位置 `tests/unit/sales-checkout.test.ts` / 正本=なし（未同梱の架空例と本文で明記） / 確かめ方=- / 結果=確かめられない / 根拠=架空成果物
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ の sample のみで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更ファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

kata-guide の R4（正しさ）に従い、sample の主張を schema、utc-index-rulebook、tsp-index-sample、bac-sample、ifd-sample と突き合わせた。確かめは 18 項目で、不一致は 2 件、確かめられなかったのは 3 件だった。不一致は直し、正本のない駄菓子屋の業務の仮定は確かめの対象にしなかった。前の段が直した記述は繰り返さず維持した。grade の finding のうち、この段の観点に当たる F001・F003・F004 を反映した。F002・F005〜F008 は前の段で解消済み、F009 は kata の段のレビューで外す観点のため扱わなかった。frontmatter の `status` は `draft` のまま据え置いた。
