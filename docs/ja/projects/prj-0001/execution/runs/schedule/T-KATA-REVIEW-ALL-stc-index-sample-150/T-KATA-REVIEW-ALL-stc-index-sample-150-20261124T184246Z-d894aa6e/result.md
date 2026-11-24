---
specdojo:
  id: prj-0001:xer-t-kata-review-all-stc-index-sample-150-20261124t184246z-d894aa6e
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-stc-index-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-stc-index-sample-150/T-KATA-REVIEW-ALL-stc-index-sample-150-20261124T184246Z-d894aa6e/plan.md
  started_at: "2026-11-24T18:42:54.857Z"
  completed_at: "2026-11-24T18:54:47.316Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:stc-index-sample
    - specdojo:stc-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として `docs/ja/specdojo/samples/stc-index-sample.md` を更新した。TSP・SAC・性能要件・受入条件との食い違いを概要側で解消した。
- 更新の中身は、在庫・つけ残高の対象と分配の追加、性能の出口条件に合わせた分配の追加、P0/P1 定義の TSP への整合、性能試行の記録の保持方針、改訂時の追従対象へのトレース表の追加である。
- 相手側（`stc-sample`、`etc-index-sample`、`itc-index-sample`、`atc-index-sample`）の食い違い 6 件は変更せず、修正案を handoff に記録した。
- grade の F001 は `vp-pm-control-reporting` が kata-guide 6.3 の除外観点のため変更していない。F002 は R4、F003 は R2 で解消済みのため再修正していない。F004 は相手側の修正案（R5-6）とした。F005 は R1 の参照化を維持し、対象別のトレースが BAC・受入条件・印刷契約に対応することを確認した。
- 検証は、executor の `npx prettier --write` と `git diff --check` が成功した。runner 実行の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も成功した。他の検査は変更種別により適用外である。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/stc-index-sample.md`: TSP の対象範囲に合わせ、在庫更新（AC-05・AC-02）の対象と分配を追加し、つけ残高の対象を購入・入金による更新まで広げた。性能の出口条件（SAC-PERF-01〜04）に対応して、会計記録の欠落・重複、残高確認時間、日次締めの担当を分配へ追加した。共通合格基準では TSP の必須ケースを P0 に明記し、P1 を P0 に当たらないものに限定した。性能測定のデータ量と初期化の例外、試行記録を日次締め測定終了まで保持する方針を追記した。改訂時の追従対象にトレース表を加えた。

## 3. 申し送り

- 指摘は executor の handoff（R5-1〜R5-11）のとおり。実施内容に反映する表は、指定の7列（No・段・箇所・指摘・直した案・根拠・印）で1回だけ記載し、申し送りに表を重ねない。
- 要判断の印を付ける指摘は evidence に記載がない。印はすべて「-」のままとする。
- 相手側の修正案は R5-6〜R5-11 に記載がある。対象は `stc-sample`（観点名と性能基準の扱い、P99 記録と取引番号照合）、`etc-index-sample`（印刷待ち時間 30 秒）、`itc-index-sample`（PATH-04・PATH-07 の帰属）、`atc-index-sample`（SC-07・SC-09・AC-05 の反映）である。いずれも本タスクでは変更しておらず、別タスクでの対応が必要である。
- R5-1: R5 / 1. 本ドキュメントの目的と適用対象、2. テスト対象の括り方と分割基準、4章、6章、7.1 / TSP が対象とする在庫・つけの更新が、概要では残高確認に限定されている / AC-05・AC-02 に対応する在庫更新の対象と分配を追加し、つけ残高の対象を購入・入金による更新まで広げた。観測点と証跡の照合キーも対応させた / `vp-qe-kata-conformance`。[[specdojo:tsp-index-sample|テスト戦略・方針]] 2.1・3・5章、[[specdojo:prj-success-criteria-and-acceptance-criteria-sample|成功基準と受入条件]] AC-05・AC-02 / -
- R5-2: R5 / 1〜4章、6.2. 対象別への分配方針、7.2. 共通合格基準 / TSP の性能出口条件は SAC-PERF-01〜04 だが、概要の性能分配は会計確定応答だけである / 会計記録の欠落・重複、残高確認時間、日次締めの担当を追加した。SAC・性能要件への参照、暫定基準の適用と値の記録だけを行う指標を明記した / `vp-qe-kata-conformance`。[[specdojo:tsp-index-sample|テスト戦略・方針]] 第5章、[[specdojo:sac-sample|システム受入条件]] 第2章、[[specdojo:nfr-performance-sample|性能要件]] 第3・4章。日次締めは営業時間・対象データが異なるため別対象とした / -
- R5-3: R5 / 7.2. 共通合格基準 / TSP が全件合格を求める BAC と更新・表示一致が、概要の P0 定義に明示されず、P1 の例外対象と重なる / TSP の必須ケースを P0 に明記し、P1 は P0 に当たらないものに限定した。不具合の重大度と収束基準は TSP を参照させた / `vp-qe-kata-conformance`。[[specdojo:tsp-index-sample|テスト戦略・方針]] 第5・7章。R4 の性能基準を P0 とする修正は維持した / -
- R5-4: R5 / 7.1. 境界・環境の共通方針 / ケース終了時の記録削除は、性能試行の記録を使う日次締めの前提と両立しない / 性能測定のデータ量・初期化の例外を対象別に記し、試行の記録を日次締め測定終了まで保持してから削除する方針にした / `vp-qe-kata-conformance`、`vp-dev-change-impact`。[[specdojo:sac-sample|システム受入条件]] 2.4、[[specdojo:stc-index-rulebook|総合テストカタログ 概要 作成ルール]] 6.7 / -
- R5-5: R5 / 6.2. 対象別への分配方針 / 改訂時の追従対象がケース表とコードだけで、rulebook が求めるトレース表を含まない / 追従対象にトレース表を加えた / `vp-dev-change-impact`。[[specdojo:stc-index-rulebook|総合テストカタログ 概要 作成ルール]] 第1章の改訂時の追従 / -
- R5-6: R5 / 6.2. 対象別への分配方針 / F004: 印刷失敗は概要で「会計維持」、対象別で「未確定停止」となっている / - / `vp-qe-kata-conformance`。[[specdojo:stc-sample|総合テストカタログ 対象別]] 6.2 の観点名を「会計維持」へ変更する案。`perspective_key` と `case_id` は維持する。対象外の文書なので変更していない / -
- R5-7: R5 / 7.2. 共通合格基準 / 対象別は仮置き性能基準の合格を出口条件に使わないとしており、TSP・SAC の暫定判定と矛盾する / - / `vp-qe-kata-conformance`。[[specdojo:stc-sample|総合テストカタログ 対象別]] 第4章の前提表前の一律禁止を改め、性能は [[specdojo:tsp-index-sample|テスト戦略・方針]] 第5章と [[specdojo:sac-sample|システム受入条件]] に従って暫定判定する案。二重確定の設計仮定とは扱いを分ける / -
- R5-8: R5 / 6.2. 対象別への分配方針 / 対象別の性能ケースは SAC が求める P99 の記録と送信・保存の取引番号照合を期待値に含めていない / - / `vp-qe-kata-conformance`、`vp-dev-change-impact`。[[specdojo:stc-sample|総合テストカタログ 対象別]] 6.4 の既存ケースに [[specdojo:sac-sample|システム受入条件]] 2.1・2.2 の観測・証跡を加え、トレース表も更新する案。商品検索の測定条件・記録も性能要件に沿って対象別へ具体化する。既存 ID は維持する / -
- R5-9: R5 / 3. 対象外・除外理由、7.1. 境界・環境の共通方針 / ET の印刷待ち上限10秒が、ST・印刷連携仕様の30秒と食い違う / - / `vp-qe-kata-conformance`。[[specdojo:etc-index-sample|外部結合テストカタログ 概要]] 第7・8章の印刷待ち時間と期待値を、[[specdojo:ifx-cmd-sample|レシート印刷コマンド連携仕様]] の `timeout_seconds` 30 に揃える案。保管サービスの値とは区別する / -
- R5-10: R5 / 1. 本ドキュメントの目的と適用対象 / 参照先 IT 概要は保全取得・復元回復を ET に委ねており、現行 TSP・ET 概要の境界と一致しない / - / `vp-qe-kata-conformance`。[[specdojo:itc-index-sample|内部結合テストカタログ 概要]] 第1〜3章で PATH-04・PATH-07 を IT の対象へ戻し、ET は PATH-05・PATH-06 とする案。根拠は [[specdojo:tsp-index-sample|テスト戦略・方針]] 2.1・4.2 と [[specdojo:etc-index-sample|外部結合テストカタログ 概要]] 第2章 / -
- R5-11: R5 / 1. 本ドキュメントの目的と適用対象 / 参照先 AT 概要の初期受入範囲が SC-01・AC-01〜04 のままで、TSP の必須範囲に追従していない / - / `vp-qe-kata-conformance`。[[specdojo:atc-index-sample|受入テストカタログ 概要]] の適用対象・分割・分配・合格基準へ SC-07・SC-09・AC-05 を反映する案。根拠は [[specdojo:tsp-index-sample|テスト戦略・方針]] 第5章と [[specdojo:prj-success-criteria-and-acceptance-criteria-sample|成功基準と受入条件]] / -
- reporter 向け: R5-1〜R5-11 は実施内容に指定の7列の Markdown 表として1回だけ記載し、申し送りに表を重ねないこと。相手側の文書は変更せず、修正案だけを記録した。
- 進め方と実践の型の適用用: 共通規約、kata-guide 第6章、Sample 記述標準の共通文脈、STC の index・対象別 rulebook、テストドキュメントスコープ定義標準、メタ情報標準、共通レビュー観点、成果物カタログの `done_criteria`、grade result、R1〜R4 result を確認した。対象の wikilink・`based_on` の参照先、SAC・性能要件・受入条件・印刷連携仕様も照合した。用語集6ファイルの用語・別名を照合し、対象の業務語・term に一致する定義はなかった。index rulebook の `recipe`・`template` は `not-needed`。必須9章、カラム、既存 ID、`based_on`、`status: draft`、前段の修正を維持した。
- grade finding の扱い: F001 の `vp-pm-control-reporting` は kata-guide 6.3 の除外観点であり変更しなかった。TSP の架空の PJR 引継ぎ先は確認済み。F002 は R4、F003 は R2 で解消済みとして再修正していない。F004 は R5-6 として相手側の修正案を残した。F005 は R1 の参照化を維持し、対象別の TR-01・TR-02 と TR-02・TR-03 が BAC・受入条件・印刷契約に対応することを確認した。plan の記録は grade 由来で、condense 由来の記録はない。grade サイドカーは変更していない。
- 変更ファイルは docs/ja/specdojo/samples/stc-index-sample.md のみ。影響対象は `stc-stock-update`、`stc-credit-balance`、`stc-daily-close`、`stc-cash-sale`、および必須ケースの優先度確認が必要な `stc-sale-hold`。未同梱の対象別カタログや架空の `kinuya-ci-st` の実装は作成していない。result は reporter、lint・テスト・schema 検査は親 runner が担当する。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown sample のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/samples/ 配下のみで、docs/ja/projects/ 配下に達していない。）
- 適用外の検証: `npm run validate:history-links`（executor は履歴ファイル、plan、result を変更していない。）

## 4. 進め方と実践の型の適用

kata-guide の「kata を agent でレビューする」の R5 に従った。確認した資料は、共通規約、kata-guide 第6章、Sample 記述標準の共通文脈、STC の index・対象別 rulebook、テストドキュメントスコープ定義標準、メタ情報標準、共通レビュー観点、成果物カタログの `done_criteria`、grade result、R1〜R4 result である。対象の wikilink と `based_on` の参照先（TSP、SAC、性能要件、受入条件、印刷連携仕様）も照合した。用語集6ファイルには対象の業務語・term に一致する定義がなかった。rulebook を正として、必須9章、カラム、既存 ID、`based_on`、`status: draft`、前段の修正を維持した。index rulebook の `recipe` と `template` は `not-needed` である。根拠が確認できた範囲だけを改訂し、相手側の文書は変更せず修正案を handoff に残した。grade サイドカーは直接編集していない。plan の記録は grade 由来で、condense 由来の記録はない。
