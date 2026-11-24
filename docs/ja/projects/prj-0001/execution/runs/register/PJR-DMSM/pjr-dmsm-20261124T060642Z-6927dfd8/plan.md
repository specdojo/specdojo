---
specdojo:
  id: prj-0001:xep-pjr-dmsm-20261124t060642z-6927dfd8
  type: exec-plan
  rulebook: none
  task_id: PJR-DMSM
  name: "v0.10.0 の CHANGELOG と移行の注意をまとめる"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: DEV
---

# Edit Plan: PJR-DMSM v0.10.0 の CHANGELOG と移行の注意をまとめる

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-DMSM「v0.10.0 の CHANGELOG と移行の注意をまとめる」に対応する。

v0.10.0 に入れた項目の CHANGELOG に書く事項を集めて CHANGELOG.md にまとめ、既存の利用者向けの移行の注意を書く

## 2. 対象項目

- `id`: PJR-DMSM
- `type`: todo
- `priority`: high
- `owner`: DEV
- `due`: 2026-11-30
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-dmsm-v0100-release-notes.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-DMSM/pjr-dmsm-20261124T060642Z-6927dfd8/result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- v0.10.0 に入れる（利用者の指定、2026-11-24）
- リリースは 12 月の第 1 週を目標にする（利用者の判断、2026-11-24）

## 3. 進め方

1. 個票（存在する場合）を読み、目的・完了条件・制約を把握する。登録簿の一覧は大きいため読まない。
2. 個票に完了条件がある場合はそれを作業の基準にする。無い場合はタイトルと説明から完了条件の仮説を立て、記録する。pipeline では個票の対応結果と executor の報告の `handoff` に書き、result を直接書ける実行形式では result に明記する。
3. 関連する成果物・設計書・実装を確認し、対象ファイルを特定して変更する。
4. 個票が存在する場合は、個票の作業内容・対応結果セクションを実施内容で更新する。作業内容の表は、各行の状態とメモを実績に合わせる。終えた行は状態を `done` にし、`_TODO_` を残さない。executor が実行できない行（grade の起動など）は状態を `open` のまま残し、その理由をメモに書く。理由のない `done` 以外の行や `_TODO_` の残る行があると、post-review と `register close` は完了にしない。
5. 個票の完了条件が result への記載を求める場合、pipeline の executor は個票の対応結果と報告の `handoff` の両方に書く。reporter と runner が result の申し送りへ反映する。executor は result を直接編集しない。
6. 判断に迷う箇所は _TODO_ / _ASSUMPTION_ で残し、根拠と次のアクションを記録する。pipeline では個票の対応結果と報告の `handoff` に書き、result を直接書ける実行形式では result に書く。

### grade result から展開された finding

- なし

plan に展開された finding は、message と同じ viewpoint ID の判定根拠に照らして解消する。未解消、根拠不足、または判断不能の場合は、理由と次のアクションを記録する。pipeline では個票の対応結果と報告の `handoff` に書き、result を直接書ける実行形式では result に書く。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。

## 4. 完了手順

1. 「進め方」に従って対応を完了する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result に実施内容・変更ファイル・申し送りを記入する。pipeline では executor は実施内容・変更ファイル・検証結果を報告し、申し送りを `handoff` に記載する。reporter と runner が result を記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。
4. 登録簿（`pjr-index.md`）の行と個票のステータス項目は変更しない。状態遷移（review / close など）は runner と人間が行う。

## 5. 異常終了の条件

- 前提不足・対象ファイル不明・静的検査未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は登録簿の状態を変更せず、終了コードと標準エラー出力で runner に結果を返す。

## 再開の指示（2026-11-24T06:12:35.289Z）

利用者が再開の前に足した指示である。これまでの申し送りとあわせて、この指示に従って作業を続ける。

- 前回は CHANGELOG.md の下書きまでで未完了だった。下書き（移行の注意・追加・不具合修正）は活かして続ける。前回の報告では個票に収集済みの項目を記録したとあったが、PJR-DMSM の個票は変わっていなかった。集める対象は次の 2 組。(1) 入力に「v0.10.0 に入れる」とある項目: PJR-2P7C PJR-TQZA PJR-1JF6 PJR-1RJP PJR-2X6K PJR-40EE PJR-4VD6 PJR-6690 PJR-77FH PJR-7EZR PJR-7TVA PJR-82H2 PJR-A54F PJR-B6M3 PJR-C11R PJR-DF5Z PJR-EEWP PJR-FBP0 PJR-GA72 PJR-JA3M PJR-N5J8 PJR-NRWJ PJR-Q723 PJR-TAHV PJR-TN64 PJR-XSRF PJR-YCMR PJR-YQ32 PJR-36QG PJR-8PXJ PJR-F4TG PJR-F636 PJR-VM2S PJR-DMSM  (2) v0.9.2（2026-11-21）の後に done・decided・review になり、個票に「CHANGELOG に書く事項」がある項目: PJR-09HA PJR-0JVB PJR-0VPB PJR-1FMG PJR-1HJH PJR-1S74 PJR-22N9 PJR-2MR5 PJR-2Q86 PJR-2RHB PJR-30PT PJR-325Y PJR-39AB PJR-50RQ PJR-5N1Q PJR-5T0Q PJR-6Y05 PJR-77JB PJR-7C9X PJR-7KQT PJR-7M9J PJR-86BN PJR-8S4T PJR-9170 PJR-98HS PJR-9X52 PJR-9XEG PJR-AEKE PJR-B6NS PJR-BBTW PJR-BEQ8 PJR-BHFG PJR-BM07 PJR-BNAV PJR-C7WD PJR-CJMN PJR-E4MW PJR-E73Z PJR-EF4Z PJR-EF7M PJR-EKGQ PJR-ESE7 PJR-EX0D PJR-EZ4Z PJR-F6MC PJR-FGKB PJR-G3TT PJR-G6NT PJR-GV43 PJR-HCHH PJR-HRW6 PJR-K32V PJR-K8F1 PJR-KYG4 PJR-KZZM PJR-MS7X PJR-N0P1 PJR-N4D0 PJR-N5D2 PJR-N6FQ PJR-PHY7 PJR-PP4X PJR-PXNQ PJR-QHES PJR-QTZ7 PJR-QWG7 PJR-R05D PJR-R8DM PJR-RPNF PJR-RS2P PJR-SJC7 PJR-SJR7 PJR-SV9G PJR-SZCR PJR-TF6F PJR-TJZM PJR-TN50 PJR-VCER PJR-VQK2 PJR-WB78 PJR-WNQJ PJR-XA6Y PJR-XHS8 PJR-XZ9B PJR-YS9M PJR-YY0P PJR-Z17T PJR-Z8MQ  。各個票の「CHANGELOG に書く事項」を読み、利用者に影響するものを区分ごとに CHANGELOG.md へまとめる（似た項目は 1 行にまとめてよい。kata の sample・rulebook の手直しは個別に並べず要約してよい）。「なし」と書かれたものは載せない。集めた項目と区分、載せなかった項目と理由、文案が見つからなかった項目の一覧を PJR-DMSM の個票の対応結果に必ず書く。review の項目（F636・F4TG・VM2S など）は載せたうえで、個票の対応結果に review であることを書く。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
