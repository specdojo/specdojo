---
specdojo:
  id: prj-0001:xep-pjr-hqve-20261108t000142z-3952e123
  type: exec-plan
  rulebook: none
  task_id: PJR-HQVE
  name: "schedule の --auto --parallel の統合が、index に残った記録のファイルで止まる"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
---

# Edit Plan: PJR-HQVE schedule の --auto --parallel の統合が、index に残った記録のファイルで止まる

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-HQVE「schedule の --auto --parallel の統合が、index に残った記録のファイルで止まる」に対応する。

stsd-pilot の schedule を --auto --parallel 2 で流している間に、block の event ファイルが commit されずに index に載ったまま残り、別のタスクの統合の git merge が「local changes would be overwritten」で止まった。原因を調べ、統合が止まらないようにする

## 2. 対象項目

- `id`: PJR-HQVE
- `type`: issue
- `priority`: medium
- `owner`: _TODO_
- `due`: _TODO_
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-hqve-auto-parallel-staged-event-blocks-merge.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-HQVE/pjr-hqve-20261108T000142Z-3952e123/result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- 2026-11-05 13:07 に T-STSD-PILOT-stsd-register-entry-070 が block され、その block の event ファイルが index に追加（A）されたまま残った。13:14 の T-STSD-PILOT-stsd-routine-run-070 の統合の git merge が、このファイルを理由に止まった（integrate.log）。index から外すと統合できた
- 同じ時間帯に orchestrator が register add --commit を続けて実行していた（10 件の起票）。そのうち 1 件は利用者の中断で commit の前に止まり、自分の 2 ファイルを index に載せたまま残した。どちらが block の event を index に載せたかは確かめていない
- schedule の --auto で流したタスクの claim・complete・block の event は、統合の後も作業ツリーに untracked のまま残り、orchestrator が手で commit している（exec(schedule): ... を記録する）

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
