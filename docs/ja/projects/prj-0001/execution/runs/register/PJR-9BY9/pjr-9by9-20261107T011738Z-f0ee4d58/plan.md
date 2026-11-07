---
specdojo:
  id: prj-0001:xep-pjr-9by9-20261107t011738z-f0ee4d58
  type: exec-plan
  rulebook: none
  task_id: PJR-9BY9
  name: "既存の実行記録を run 単位のディレクトリへ移す"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: DEV
---

# Edit Plan: PJR-9BY9 既存の実行記録を run 単位のディレクトリへ移す

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-9BY9「既存の実行記録を run 単位のディレクトリへ移す」に対応する。

既存の plan・result・evidence・ログ約 3,000 件を git mv で execution/runs/ へ移すコマンドを作って実行し、記録の中のパスの欄を書き換え、古い配置の読み取りと plans/done/ をなくす

## 2. 対象項目

- `id`: PJR-9BY9
- `type`: todo
- `priority`: high
- `owner`: DEV
- `due`: -
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-9by9-exec-run-record-migration.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-9BY9/pjr-9by9-20261107T011738Z-f0ee4d58/result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- PJR-VH8D の決定（2026-11-07 indie）: 実行記録は run 単位のディレクトリ execution/runs/`<出どころ>`/`<項目 ID>`/`<run ID>`/ に plan.md・result.md・evidence.json・ログを置く（R1）。出どころは register・schedule・job。置き場所を決める処理はコードの 1 つのモジュールにまとめる（R2）。exec validate と CI で置き場所を検査する（R3）。ガイドの構成図をモジュールと照らすテストを置く（R4）。grade/results と jobs/ の定義は外に残す。既存は git mv で移し、パスの欄だけ書き換える

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

## 再開時の追加の指示（orchestrator、2026-11-07）

前回の試行は、sandbox で Git の index に書けず、実際の移動が 0 件のまま `incomplete` で止まった。orchestrator が worktree で次を行い、commit `d17dcdeba` に記録した。

- `exec migrate-records --project prj-0001 --dry-run` で、移動 5,576 件・参照の更新 3,214 件・欠落 18 件・除外 0 件を確かめた。
- `--dry-run` を外して流し、5,576 件を `git mv` で移した。中身が変わらないもの 2,458 件、パスの欄を書き換えたもの 3,118 件、job の状態 96 件を更新した。書き換えたログは 0 件。再実行は移動・更新とも 0 件だった。
- 移した後の `exec validate`・`exec status` は移す前と同じ結果で、`dashboard build --dry-run` の出力は生成時刻のほかは移す前と同じだった。
- 古い配置に残るのは `exec/events`（791 件）と `exec/trials`（40 件）だけである。

この試行では、移動をやり直さない。次を行う。

- 個票の対応結果の「移動件数と停止理由」と「検証と申し送り」を、上の実際の結果に合わせて書き直す。`exec/events` を移さない理由を書く。
- 移した後の状態で、残りの完了条件（古い配置の読み取りがコードにないこと、ガイド、検証）を確かめる。
- `npm run validate:history-links` の失敗の原因だった PJR-G1W9 の個票は、develop で直した。

[共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b](../../../../conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt)
