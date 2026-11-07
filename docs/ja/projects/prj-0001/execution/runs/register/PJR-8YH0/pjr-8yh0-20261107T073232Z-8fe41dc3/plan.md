---
specdojo:
  id: prj-0001:xep-pjr-8yh0-20261107t073232z-8fe41dc3
  type: exec-plan
  rulebook: none
  task_id: PJR-8YH0
  name: "executor から再開した run に前回の親の検証のログが元の名前で残る"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: DEV
---

# Edit Plan: PJR-8YH0 executor から再開した run に前回の親の検証のログが元の名前で残る

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-8YH0「executor から再開した run に前回の親の検証のログが元の名前で残る」に対応する。

再開の前の試行の退避が写しを作るだけで元のログを残すため、成功した再開の run に、失敗した前回の親の検証のログが今回の名前のまま commit される

## 2. 対象項目

- `id`: PJR-8YH0
- `type`: issue
- `priority`: medium
- `owner`: DEV
- `due`: _TODO_
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-8yh0-resume-stale-validation-logs.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-8YH0/pjr-8yh0-20261107T073232Z-8fe41dc3/result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- PJR-TA6W の executor からの再開（commit fe25cef49）。run のディレクトリに parent-validation-attempt-1-lint-fm.log と parent-validation-attempt-1-test-integration.log が残り、中身は退避の写し（`*.attempt-1.log`）と同じで exit code 1 を示す。再開後の親の検証はすべて passed で、evidence.json の `log_refs` はこれらを参照しない（2026-11-07 orchestrator の確認）
- 原因の見立て: snapshotRunAttempt（src/shared/run-records.ts）は pipeline-state・evidence・ログを `*.attempt-N.*` へ copyFileSync で写すだけで、元のファイルを消さない。親の検証のログは失敗したときだけ書かれるため、成功した再開では上書きされずに前回のものが残る（2026-11-07）
- 決定: 試行の退避では、ログを写さずに移す。ただし引き継ぐ evidence の `log_refs` が指すログは元の名前で残し、`pipeline-state.json` と `evidence.json` は今のまま写す（2026-11-07 indie が決定）

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

- 親の検証の `test-integration` で、`tests/src/exec/register-resume.integration.test.ts` の「resumes only the reporter stage and completes the item without re-running the executor」が失敗した。足した `expect(executorRefs).toHaveLength(1)` に対し、`kind` が `agent-output-excerpt` の `log_refs` は 3 件あった。
- 失敗の原因はテストの前提である。`agent-output-excerpt` は executor のログだけを指すとは限らない。executor のログの参照は、`kind` の件数ではなく、パスの名前（`executor.log`）で特定する。そのうえで、reporter から再開した後もその参照と元の名前のファイルが残り、中身が変わらないことを確かめる。
- 既にあるテスト「resumes a reporter-stage run from executor after syncing the integration branch」の名前と筋書きを、親の検証の失敗の筋書きに書き換えている。既にあるテストは元のまま残し、親の検証が失敗した run を executor から再開する筋書きは、別のテストとして足す。
- 直した後に、`npx vitest run --config vitest.integration.config.ts tests/src/exec/register-resume.integration.test.ts` などで、このファイルの統合テストが流せるなら流す。sandbox で流せない場合は、親の検証に任せてよい。テストを直した理由を個票の対応結果に書く。

[共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b](../../../../conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt)
