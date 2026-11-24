---
specdojo:
  id: prj-0001:xer-t-kata-review-calibration-opr-sample-150-20261124t051559z-aa254487
  type: exec-result
  task_id: T-KATA-REVIEW-CALIBRATION-opr-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-CALIBRATION-opr-sample-150/T-KATA-REVIEW-CALIBRATION-opr-sample-150-20261124T051559Z-aa254487/plan.md
  started_at: "2026-11-24T05:16:07.199Z"
  completed_at: "2026-11-24T05:23:19.750Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- kata レビュー R5（整合）として `opr-sample` を関連 sample と突き合わせ、sample 側の食い違いを修正した。変更は `docs/ja/specdojo/samples/opr-sample.md` のみ（58 行追加・48 行削除、表の再整形を含む）。
- 全体構成を入口、本書を共通手順・証跡規約の参照先として区別した。既存の全 7 分冊と障害対応方針へのリンクを置き、障害対応だけが分冊で `opr-incident` は予定という旧記述を解消した（F003）。
- 定期点検・アラート対応・バックアップ確認・バッチ再実行・アカウント手順・問い合わせ一次対応を、各分冊の手順と矛盾しないよう揃えた。具体的には次の点を直した。 - 締め差異が残る場合の PO 確認。 - バックアップ通知の 9:30 判定。 - 死活の誤検知が月 3 件以上の場合の見直し。 - 演習の復元は DEV、OPS は結果の確認・記録。 - バッチは自動取得込み 2 回・手動 1 回まで。 - 権限の付与は PO 承認・OPS 操作、緊急権限は失効と事後確認。 - 問い合わせの記録訂正は店番担当へ依頼し、締め済み金額は PO へ引き継ぐ。
- F001・F004 は kata-guide 6.3 が kata レビューから除外する観点のため、決定者・期限・ready 確認者の列は追加していない。F002 は直前 R4 が保管期間未決時の削除禁止を概要に追加して解消済みのため維持した。相手側 sample は変更していない。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-sample.md`: 概要・障害対応手順・関連ドキュメント導線で、全体構成と本書の役割を区別し、既存の全 7 分冊と障害対応方針へ wikilink した。定期点検、アラート対応、バックアップ確認・リストア、バッチ再実行、アカウント手順、問い合わせ一次対応、証跡の各記述を関連分冊に整合させた。frontmatter と必須 12 章は維持した。

## 3. 申し送り

- 要判断の指摘は R5-1（分冊の導線と共通規約の置き場所）、R5-5（権限分冊との矛盾）、R5-7（入口側の更新）、R5-8（権限対象の方針）、R5-9（PO 不通時の紙への切替条件）。いずれも相手側 sample の修正案で、本タスクでは相手側を変更していない。
- executor は指摘表を R5-1〜R5-12 として handoff に記載している。R5-7〜R5-12 は相手側 sample の修正案で、R5-7・R5-8・R5-9 に「要判断」の印が付いている。R5-10〜R5-12 は印なし。内容は evidence.handoff の表を参照すること。
- 親検証（`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema`）は passed。executor の検査（prettier の整形と確認、`git diff --check`）も passed。コード系検査は変更種別により `not_applicable`。
- 変更ファイルは docs/ja/specdojo/samples/opr-sample.md のみ（58 行追加・48 行削除、表の再整形を含む）。result・grade サイドカーは編集していない。frontmatter と必須 12 章を維持した。reporter は以下の指摘表を result の実施内容へ記載すること。
- | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R5-1 | R5 | 1. 概要、4. 障害対応手順、12. 関連ドキュメント導線 | 全体構成との ID の混同、障害対応だけを分冊とする記述、既存文書の予定扱いがある | 全体構成を入口、本書を共通手順・証跡規約の参照先として区別し、既存の全 7 分冊と障害対応方針へリンクした | source=grade F003、`vp-qe-kata-conformance`。opr-rulebook 1.1、opr-index-rulebook 2、各分冊の概要。入口側にも共通規約の重複が残るため、R5-7 の整理案と合わせて判断する。ID の改名・統合は採らなかった | 要判断 | | R5-2 | R5 | 3. 定期点検、5. アラート対応手順 | 締め差異の引継ぎ、バックアップ通知時刻、死活の誤検知見直し条件が方針の具体化と揃わない | 差異が残る場合の PO 確認、9:30 の判定、死活の誤検知が月 3 件以上の場合の見直しを記載し、バックアップの誤検知判定を分けた | `vp-qe-kata-conformance`。opd-index-sample 5・10、opd-monitoring-sample 2.2〜2.4、opr-monitoring-sample 3・5、opr-batch-sample 5 | - | | R5-3 | R5 | 6. バックアップ確認・リストア手順 | 閲覧権限の OPS が演習の復元を実行する一方、復元分冊では DEV が実行する | DEV が復元し、OPS が結果を確認・記録する形に揃え、販売件数の比較範囲を前日の日次締めまでとした | `vp-qe-kata-conformance`。opr-backup-restore-sample 2・3・6、opd-index-sample 8 | - | | R5-4 | R5 | 7. バッチ再実行・失敗時対応 | 上限の数え方が曖昧で、上限後の追加手動取得とも読める | 自動取得込み 2 回・手動 1 回までとし、同時実行を避け、上限後は PO へ報告して定期取得を待つ形に揃えた | `vp-qe-kata-conformance`。opr-batch-sample 7.2・7.5 | - | | R5-5 | R5 | 2. 前提、9. アカウント手順、11. 証跡 | DEV による付与・剥奪と緊急権限を置かない記述が権限分冊と矛盾する | 分冊を参照し、PO 承認・OPS 操作、区分別検証、緊急権限の失効・事後確認、権限変更記録・棚卸し記録に揃えた。ホスティング環境の管理者権限と販売管理システムの権限を区別した | `vp-qe-kata-conformance`。opd-index-sample 4 の RACI、opd-access-control-sample 2、opr-access-control-sample 9・11。上位方針の付与対象制限とは不整合が残るため R5-8 を申し送る。分冊の具体手順を削って旧記述に合わせる案は採らなかった | 要判断 | | R5-6 | R5 | 10. 問い合わせ一次対応手順 | 閲覧権限の OPS 自身が記録を訂正する記述になっている | OPS が店番担当へ訂正を依頼して結果を確認し、締め済み金額の訂正は PO へ引き継ぐ形に揃えた | `vp-qe-kata-conformance`。opr-support-sample 2、opd-access-control-sample 2.1 | - |
- 相手側は変更していない。reporter は次の行も同じ指摘表へ追記すること。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R5-7 | R5 | opr-index-sample 6・7・9・12 | 入口側には分冊が障害対応だけという記述と、今回直した旧手順が残る | - | `vp-dev-change-impact`。docs/ja/specdojo/samples/opr-index-sample.md の関連導線を全分冊へ更新し、共通手順は opr-sample への参照にまとめる案。両 rulebook が index の正本責務を定めるため、共通規約の置き場所の最終整理が必要 | 要判断 | | R5-8 | R5 | opd-index-sample 9、opd-access-control-sample 2.1 | 全体方針はアカウントを店番担当と DEV に限定する一方、権限方針分冊は OPS の運用区分を定める | - | `vp-qe-kata-conformance`。docs/ja/specdojo/samples/opd-index-sample.md の付与対象を権限区分表への参照に置き換え、docs/ja/specdojo/samples/opd-access-control-sample.md の差分説明も合わせる案。権限対象の方針判断が要る | 要判断 | | R5-9 | R5 | opr-incident-sample 4.3、opr-monitoring-sample 5、opd-index-sample 4・6 | PO 不通時の紙への切替について、障害分冊は切替可、監視分冊は判断待ちとなり、全体方針も未応答時と通常時の条件を別々に記す | - | `vp-qe-kata-conformance`。docs/ja/specdojo/samples/opd-index-sample.md で未応答時の例外・起点・判断者を明確にしてから、docs/ja/specdojo/samples/opr-incident-sample.md と docs/ja/specdojo/samples/opr-monitoring-sample.md を同じ条件へ揃える案。推測で例外を追加しなかった | 要判断 | | R5-10 | R5 | opr-incident-sample 4.3、opd-index-sample 6 | 転記の件数・金額の照合者が障害分冊では OPS、全体方針と復元分冊では DEV になっている | - | `vp-qe-kata-conformance`。docs/ja/specdojo/samples/opr-incident-sample.md の照合者を DEV、OPS を結果確認・報告に揃える案 | - | | R5-11 | R5 | opd-index-sample 7 | 価格変更の戻し条件が変更前との相違になっており、本書と変更分冊の変更記録との照合と食い違う | - | `vp-qe-kata-conformance`。docs/ja/specdojo/samples/opd-index-sample.md の価格変更の戻し条件を、承認された変更記録の価格との不一致へ直す案。本書と opr-change-sample の条件は維持した | - | | R5-12 | R5 | 関連分冊の導線・参照メタ情報 | batch・backup-restore・support の分冊に既存の障害手順の予定扱いが残り、batch の根拠参照も未修飾の opd-index になっている | - | `vp-dev-change-impact`。docs/ja/specdojo/samples/opr-batch-sample.md、opr-backup-restore-sample.md、opr-support-sample.md の関連導線を既存 sample の wikilink へ更新し、batch の `based_on` は依存宣言を確認して実在する修飾 ID へ揃える案 | - |
- 進め方と実践の型の適用へ記録：共通規約 2 文書、kata-guide 6.1・6.3・6.5、Sample 記述標準、opr-rulebook・opr-index-rulebook・opr-template、共通レビュー観点一覧、grade result、直前 R4 result、opr 系全 9 sample、opd-index・監視・障害・権限の sample、用語集 6 ファイルの用語と関連定義を確認した。OPR に対応する recipe はない。章構成・必須要素は rulebook と template を正とし、分冊全文の再掲を避けた。共通サンプル文脈の単一店舗・タブレット 1 台・店主代表の最終判断、既存の KPI・監査ログ 1 年は維持した。
- finding の扱い：source=grade F003 は対象 sample 側の導線を修正し、相手側の残件を指摘表へ記録した。F001・F004 は kata-guide 6.3 が kata レビューから除外する観点であり、決定者・期限・ready 確認者の列は追加していない。F002 は直前 R4 が保管期間未決時の削除禁止を概要に追加して解消済みのため維持した。source=condense の記録はない。親検証は runner に委ね、sandbox で重複実行していない。
- 検証補足：参照 ID 11 件の実在・ID 一致、必須 12 章、frontmatter の維持、TODO がないことを確認した。確認スクリプト内での Git 子プロセス起動は EPERM になったため、既読の元 frontmatter との比較に切り替えて再実行し、成功した。CHANGELOG 文案（変更）：運用手順サンプルの分冊導線と、監視・復元演習・再実行・権限管理・問い合わせの記述を関連サンプルに整合。
- 適用外の検証: `npm run validate:schema:file`（変更した成果物は Markdown のみで、YAML ファイルの変更はない。）
- 適用外の検証: `npm run validate:history-links`（既存の plan・result・登録簿個票を変更していない。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/samples/ 内のみで、docs/ja/projects/ 配下に及ばない。）

## 4. 進め方と実践の型の適用

根拠とした資料は次のとおり。 - 共通規約 2 文書、kata-guide 6.1・6.3・6.5、Sample 記述標準。 - `opr-rulebook`、`opr-index-rulebook`、`opr-template`。 - 共通レビュー観点一覧、grade result、直前 R4 result。 - opr 系全 9 sample、`opd-index-sample`・監視・障害・権限の sample、用語集 6 ファイル。 OPR に対応する recipe はない。章構成と必須要素は rulebook と template を正とし、分冊全文の再掲は避けた。共通サンプル文脈（単一店舗・タブレット 1 台・店主代表の最終判断）と、既存の KPI・監査ログ 1 年は維持した。 finding の扱いは次のとおり。 - F003 は対象 sample 側の導線を修正して解消した。 - F001・F004 は kata レビュー対象外の観点のため見送った。 - F002 は R4 で解消済みのため維持した。 - `source=condense` の記録はない。 参照 ID 11 件の実在と ID 一致、必須 12 章、frontmatter の維持、TODO がないことを確認した。ID の改名・統合は採っていない。
