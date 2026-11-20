---
specdojo:
  id: prj-0001:xep-pjr-1565-20261118t131049z-b589cb8d
  type: exec-plan
  rulebook: none
  task_id: PJR-1565
  name: "grade・register の実行・build を混ぜた順番の予約を、specdojo の機能で流す"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: ARC
---

# Edit Plan: PJR-1565 grade・register の実行・build を混ぜた順番の予約を、specdojo の機能で流す

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-1565「grade・register の実行・build を混ぜた順番の予約を、specdojo の機能で流す」に対応する。

orchestrator が scratchpad のシェルスクリプトで grade・exec run・build の順番を予約しており、セッションが終わると消え、利用者から見えないため、specdojo の機能で予約して流せるようにする。

## 2. 対象項目

- `id`: PJR-1565
- `type`: todo
- `priority`: medium
- `owner`: ARC
- `due`: 2026-11-30
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-1565-orchestration-queue.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-1565/pjr-1565-20261118T131049Z-b589cb8d/result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- 利用者の問い（2026-11-18）: 実行の予約は specdojo の機能か、orchestrator が script を書いているのか
- orchestrator の調べ（2026-11-18）: 予約は orchestrator が書いたシェルスクリプト（前の出力に終わりの行が出るまで 30 秒ごとに確かめ、次の npx specdojo を実行する）。specdojo にあるのは exec run --register A B C（--on-failure）、register の --depends-on、--if-busy wait（同じ種類のロックだけ）。grade・exec run・npm run build を混ぜた順番と、別の種類の作業の終わりを待つ機能はない。job は validate と list だけで、routine から起動される
- 利用者の決定（2026-11-18）: 方式（job の定義に段を並べる、exec run に予約を持たせる など）は executor が比べて決め、理由を書く。予約の中身と進み具合が登録簿か exec status から見えること。dist の作り直しは統合の後の処理の項目に任せる

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

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
