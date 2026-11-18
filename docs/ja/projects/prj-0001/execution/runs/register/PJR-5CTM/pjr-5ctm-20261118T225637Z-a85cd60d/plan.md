---
specdojo:
  id: prj-0001:xep-pjr-5ctm-20261118t225637z-a85cd60d
  type: exec-plan
  rulebook: none
  task_id: PJR-5CTM
  name: "npm audit の high を解消する（配る依存を先に）"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: ARC
---

# Edit Plan: PJR-5CTM npm audit の high を解消する（配る依存を先に）

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-5CTM「npm audit の high を解消する（配る依存を先に）」に対応する。

npm audit の high 15 件を解消する。配る依存（tinyglobby・fdir・picomatch・fast-uri）を先に直し、開発用は依存ごとに上げるか外すかを決める。古い版へ下げる直し方は使わない

## 2. 対象項目

- `id`: PJR-5CTM
- `type`: todo
- `priority`: high
- `owner`: ARC
- `due`: 2026-11-30
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-5ctm-npm-audit-high.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-5CTM/pjr-5ctm-20261118T225637Z-a85cd60d/result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- 利用者の依頼（2026-11-18）: npm audit で high が多く出るようになったので直したい
- orchestrator の調べ（2026-11-18）: npm audit は high 15・moderate 18・low 3・critical 0。--omit=dev では high 3（tinyglobby・fdir・picomatch）と moderate 1（fast-uri）。tinyglobby は実行時の依存
- orchestrator の調べ（2026-11-18）: 開発用の high は vitest・markdownlint-cli・remark-cli・ajv-cli・vite・markdown-it などの推移的な依存。npm audit の直し方には vitest@3.1.4・markdownlint-cli@0.33.0 など今より古い版へ下げる案が混じる
- 利用者の決定（2026-11-18）: 直し方は推奨の案 1。executor が依存ごとの直し方を調べて個票の対応結果に書き、package.json・package-lock.json（保護された設定）への反映は利用者の承認のもと orchestrator が feature ブランチで行う

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
