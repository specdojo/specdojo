---
specdojo:
  id: prj-0001:xer-t-kata-review-all-itc-index-sample-140-20261124t222718z-ad87f74b
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-itc-index-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-itc-index-sample-140/T-KATA-REVIEW-ALL-itc-index-sample-140-20261124T222718Z-ad87f74b/plan.md
  started_at: "2026-11-24T22:27:26.001Z"
  completed_at: "2026-11-24T22:39:31.115Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:itc-index-sample
    - specdojo:itc-index-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として `itc-index-sample` の事実を tsp-index-sample・ifd-sample・bac-sample・schema・rulebook と照合した。誤りだった AT の範囲と UT の置き換えを直し、F003（`PATH-02` の遅延・無応答を再現する依存行の追加）と F005（優先度基準の判定可能化）を反映した。 | No. | 場所 | 指摘 | 直し | viewpoint | | --- | --- | --- | --- | --- | | R4-1 | 1. 本ドキュメントの目的と適用対象（テストレベル表 AT 行） | AT の範囲が「SC-01・AC-01〜AC-04」で、tsp のテストレベル一覧（SC-01・SC-07・SC-09・AC-01〜AC-05）と不一致 | 「SC-01・SC-07・SC-09・AC-01〜AC-05」に修正 | `vp-arc-technical-constraints` | | R4-2 | 同（UT 行） | 「DB と記録サービスを Fake で置き換えた」が tsp の環境区分（DB は Fake、記録サービスは Stub）と不一致 | 「DB を Fake、記録サービスを Stub で置き換えた」に修正 | `vp-arc-technical-constraints` | | R4-3 | 7. 内部結合テスト共通の境界/依存の扱い | F003: `PATH-02` の遅延・無応答を再現する手段が依存の表にない | 「`PATH-02` の応答」行を追加。照合待ちの条件に限り、記録サービス処理後の応答を要求元タイムアウトより長く遅延または破棄する Stub を挟む | `vp-arc-technical-constraints` | | R4-4 | 9. ケース表の共通カラム（`優先度`） | F005: 「通知内容を P2」が IT 範囲のどれか不明で、P0〜P2 に当たらないケースの扱いがない | P0=記録の二重計上・欠落・誤更新が起きうるもの、P1=記録は変えないが応答を誤りうるもの、P2=どちらにも当たらないものに書き直した | `vp-qe-verifiability` | | R4-5 | 1・2・3・8 の各章 | tsp が `PATH-04`・`PATH-07` を内部結合テストの範囲とした変更に本書が追従していない | 修正せず R5 へ申し送り（handoff 参照） | `vp-arc-technical-constraints` | | R4-6 | 7.（`receipt-print` 行） | 「10秒無応答」の値は正本がなく確かめられない | 仮置きの値として確かめの対象外 | - | 確かめの表（主張ごと）は次のとおり。 | No. | 主張 | 突き合わせ先 | 結果 | | --- | --- | --- | --- | | 1 | frontmatter の `type: test`・`based_on` | `deliverable-frontmatter.schema.yaml`・`common-frontmatter.schema.yaml` | 一致 | | 2 | ケース表10カラム・`case_id` 形式・`nnn` 010 から10刻み・`automated` | itc-index-rulebook「ケース表の共通カラム」 | 一致 | | 3 | `kinuya-test-data` 商品A 単価30円・在庫5個 | tsp「テストデータ」 | 一致 | | 4 | C-01 在庫5→3、C-02 在庫5→0 | bac-sample BAC-01 | 一致 | | 5 | 放課後ピーク1時間60取引 | tsp「メモ / 将来課題」 | 一致 | | 6 | AT の範囲 | tsp テストレベル一覧 | 不一致のため修正 | | 7 | UT の置き換え | tsp 環境区分 | 不一致のため修正 | | 8 | `PATH-04`・`PATH-07` の範囲 | tsp テストレベル一覧・「I/F の確認範囲と代替方法」、`git log -S` で変更履歴を確認 | 不一致のため R5 へ | | 9 | `kinuya-ci-sales-recovery` の実行条件 | tsp 自動化方針 | 一部不一致（No.8 に従属） | | 10 | `PATH-02`・`PATH-03` の定義と照合待ちの要件 | ifd-sample | 一致 | | 11 | 通信不能時の販売継続は未決で対象外 | tsp・ifd | 一致（報告先は F002 として R5 へ） | | 12 | `receipt-print` の10秒無応答 | 正本なし | 確かめられない |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/itc-index-sample.md`: テストレベル表の AT 範囲と UT の置き換え（DB は Fake、記録サービスは Stub）を tsp-index-sample に合わせて修正した。依存の表に `PATH-02` の遅延・無応答を再現する Stub の行を追加し、ケース表の `優先度` 基準を P0〜P2 のどれにも当たるよう判定可能な書き方にした。

## 3. 申し送り

- R4-5 は要判断として R5 へ送る。tsp-index-sample は tsp-index-sample-120 以降、`PATH-04` と `PATH-07` を内部結合テストの範囲とした（検証用 DB へ実接続、保管サービスは Stub）。外部結合テストは `PATH-05`・`PATH-06` とした。本書は依然「`PATH-04`・`PATH-07` は外部結合テストの範囲」「ET は `PATH-04`〜`PATH-07`」と書いており、CI 実行条件にも保管サービス連携の変更が抜けている。直すには保全・復元の term（例: `itc-backup-restore`）の追加と、観点・依存・CI 方針の改訂が要る。正しさの段の局所的な直しを超えるため、`based_on` 参照先との整合を扱う R5 に任せた。ET 行だけを `PATH-05`・`PATH-06` に直す案は本文の他箇所と矛盾するため採らなかった。tsp 側を元に戻す案も R5 で比較する。
- F002（`vp-pm-control-reporting`、報告先に `kinuya:pjr-i003` を書く）は R4 の観点に当たらないため R5 に任せた。F001・F004・F006 は前の段で解消済みである。
- R4-1: R4 / 1. 本ドキュメントの目的と適用対象（テストレベル表 AT 行） / AT の範囲が「SC-01・AC-01〜AC-04」で tsp-index-sample のテストレベル一覧（SC-01・SC-07・SC-09・AC-01〜AC-05）と不一致 / 「SC-01・SC-07・SC-09・AC-01〜AC-05」に直した / vp-arc-technical-constraints（正本: tsp-index-sample テストレベル一覧の受入テスト行） / -
- R4-2: R4 / 1. 本ドキュメントの目的と適用対象（テストレベル表 UT 行） / 「DB と記録サービスを Fake で置き換えた」が、tsp-index-sample の環境区分（DB は Fake、記録サービスはスタブ）と不一致 / 「DB を Fake、記録サービスを Stub で置き換えた」に直した / vp-arc-technical-constraints（正本: tsp-index-sample 環境区分と用途の単体テスト行） / -
- R4-3: R4 / 7. 内部結合テスト共通の境界/依存の扱い / F003: tsp が IT で求める `PATH-02` の遅延・無応答を再現する手段が依存の表にない / 「`PATH-02` の応答」行を追加し、照合待ちの条件に限り記録サービス処理後の応答を要求元タイムアウトより長く遅延または破棄する Stub を挟むとした / vp-arc-technical-constraints（tsp-index-sample「I/F の確認範囲と代替方法」の遅延と無応答を再現できるスタブ） / -
- R4-4: R4 / 9. ケース表の共通カラム（`優先度`） / F005: 「通知内容を P2」が IT 範囲のどれか不明で、P0〜P2 に当たらないケースの扱いがない / P0=記録の二重計上・欠落・誤更新が起きうるもの、P1=記録は変えないが応答（確定結果・エラー種別・残高照会の結果）を誤りうるもの、P2=どちらにも当たらないもの（印刷要求の回数など）に書き直した / vp-qe-verifiability / -
- R4-5: R4 / 1. 本ドキュメントの目的と適用対象・2. テスト対象の括り方と分割基準・3. 対象外・除外理由（共通）・8. テスト環境・データの共通方針 / tsp-index-sample は tsp-index-sample-120（2026-11-24）以降、保全の取得（`PATH-04`）と復元の回復（`PATH-07`）を内部結合テストの範囲（検証用 DB へ実接続、保管サービスは Stub）とし、外部結合テストは `PATH-05`・`PATH-06` とした。本書は依然「PATH-04・PATH-07 は外部結合テストの範囲（tsp の定め）」「ET は PATH-04〜PATH-07」「IT は PATH-04〜PATH-07 を扱わない」と書き、CI 実行条件からも保管サービス連携の変更が抜けている / - / vp-arc-technical-constraints。直すには保全・復元の term（例: `itc-backup-restore`）の追加と観点・依存・CI 方針の改訂が要り、正しさの段の局所的な直しを超えるため、`based_on` 参照先との整合を扱う R5 に任せた。選ばなかった案: R4 で ET 行だけ `PATH-05`・`PATH-06` に直す案は本文の他箇所と矛盾するため採らなかった。tsp 側を元に戻す案も R5 で比較する / 要判断
- R4-6: R4 / 7. 内部結合テスト共通の境界/依存の扱い（`receipt-print` 行） / 「10秒無応答」の値は正本（tsp・ifd・コマンドリファレンス）がなく確かめられない / - / 共通サンプル文脈と食い違わない仮置きの値として確かめの対象外とした / -
- 確かめの表（reporter が R4 の指摘表の後に置く）: 1 frontmatter `type: test`・`based_on`（deliverable-frontmatter.schema.yaml / common-frontmatter.schema.yaml）一致。2 ケース表10カラム・`case_id` 形式・`nnn` 010 から10刻み・`automated`（itc-index-rulebook「ケース表の共通カラム」）一致。3 `kinuya-test-data` 商品A 単価30円・在庫5個（tsp「テストデータ」）一致。4 C-01 在庫5→3・C-02 在庫5→0（bac-sample BAC-01）一致。5 放課後ピーク1時間60取引（tsp「メモ / 将来課題」）一致。6 AT の範囲（tsp テストレベル一覧）不一致→修正。7 UT の置き換え（tsp 環境区分）不一致→修正。8 `PATH-04`・`PATH-07` の範囲（tsp テストレベル一覧・「I/F の確認範囲と代替方法」、git log -S で変更履歴を確認）不一致→R5 へ。9 `kinuya-ci-sales-recovery` の実行条件（tsp 自動化方針）一部不一致（No.8 に従属）。10 `PATH-02`・`PATH-03` の定義と照合待ちの要件（ifd-sample）一致。11 通信不能時の販売継続は未決で対象外（tsp・ifd）一致。報告先は F002 として R5 へ。12 `receipt-print` の10秒無応答（正本なし）確かめられない。
- F001・F004・F006 は前の段で解消済み、F002（vp-pm-control-reporting、報告先に `kinuya:pjr-i003` を書く）は R4 の観点の組に当たらないため R5 に任せた。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/itc-index-sample.md のみで、plan / result / 個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更ファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

sample-maintenance。sample の事実を tsp-index-sample・ifd-sample・bac-sample・schema・rulebook と突き合わせ、誤りは sample 側を正本に合わせて直した。rulebook と矛盾する箇所はなく、F003 と F005 は判定根拠に照らして解消した。`PATH-04`・`PATH-07` の範囲は、根拠の食い違いが本文全体に及ぶため推測で直さず、R5 に任せた。
