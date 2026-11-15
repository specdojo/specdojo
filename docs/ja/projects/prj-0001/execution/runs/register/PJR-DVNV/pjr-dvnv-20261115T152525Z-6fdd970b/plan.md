---
specdojo:
  id: prj-0001:xep-pjr-dvnv-20261115t152525z-6fdd970b
  type: exec-plan
  rulebook: none
  task_id: PJR-DVNV
  name: "runner が統合の後に書いたイベントと run の記録を commit する"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: DEV
---

# Edit Plan: PJR-DVNV runner が統合の後に書いたイベントと run の記録を commit する

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-DVNV「runner が統合の後に書いたイベントと run の記録を commit する」に対応する。

統合の後のイベントと試行の記録を、runner が自分で commit する（run の終わりに記帳の commit を足す、など）

## 2. 対象項目

- `id`: PJR-DVNV
- `type`: todo
- `priority`: high
- `owner`: DEV
- `due`: _TODO_
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-dvnv-exec-commit-trailing-records.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-DVNV/pjr-dvnv-20261115T152525Z-6fdd970b/result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- 2026-11-15、develop の作業ツリーに commit されていない実行記録が 465 件たまっていた。イベント 371 件（11/10〜11/15 の claim・complete・block・unblock・release など）と、失敗した試行や再開前の試行のログ 70 件
- 調べた結果: ログの配置の変更（2026-11-07、PJR-Z0XR）が原因ではない。runner の統合の commit に入るのはその時点までのイベント（claim）と run の記録で、統合の後に書く complete・失敗時の block は 8 月から一度も runner が commit していない。orchestrator が『実行イベントを記録する』commit（08-12・09-16・11-05・11-09 など）で手で補っていたが、playbook にも orchestrator の定義にも書かれておらず、引き継がれずにたまった

## 3. 進め方

1. 個票（存在する場合）を読み、目的・完了条件・制約を把握する。登録簿の一覧は大きいため読まない。
2. 個票に完了条件がある場合はそれを作業の基準にする。無い場合はタイトルと説明から完了条件の仮説を立て、記録する。pipeline では個票の対応結果と executor の報告の `handoff` に書き、result を直接書ける実行形式では result に明記する。
3. 関連する成果物・設計書・実装を確認し、対象ファイルを特定して変更する。
4. 個票が存在する場合は、個票の作業内容・対応結果セクションを実施内容で更新する。
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

`共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b` `docs/ja/projects/prj-0001/execution/conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt`
