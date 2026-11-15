---
specdojo:
  id: prj-0001:xep-pjr-9mwh-20261115t170253z-0373056d
  type: exec-plan
  rulebook: none
  task_id: PJR-9MWH
  name: "schedule の executor の再開が、develop に commit 済みの run の記録との衝突で止まる"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: DEV
---

# Edit Plan: PJR-9MWH schedule の executor の再開が、develop に commit 済みの run の記録との衝突で止まる

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-9MWH「schedule の executor の再開が、develop に commit 済みの run の記録との衝突で止まる」に対応する。

DVNV と ED0K の組み合わせで pipeline-e2e の統合テストが落ち、develop の test-integration が失敗する

## 2. 対象項目

- `id`: PJR-9MWH
- `type`: issue
- `priority`: high
- `owner`: DEV
- `due`: 2026-11-16
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-9mwh-schedule-executor-resume-trailing-record-conflict.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-9MWH/pjr-9mwh-20261115T170253Z-0373056d/result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- 2026-11-16 01:54、develop（47676ea25）で tests/src/exec/pipeline-e2e.integration.test.ts の「resumes the executor after a failed integration, syncing the integration target」が落ちる。親の検証の test-integration が全件失敗するため、0.8.0 の phase 2 の run がすべて止まる
- 原因: PJR-DVNV で runner は block の後の run の記録（execution/runs/schedule/`<task>`/`<run>`/result.md など）を develop へ commit するようになった。PJR-ED0K の schedule の --resume-from executor は、再開の前に develop を exec branch へ merge する（syncTaskWorktreesWithIntegrationTargets）。worktree 側にも同じ run の記録が commit されているため、result.md が add/add で衝突し「merge conflicts with main: execution/runs/schedule/T-TEST-doc-010/.../result.md」で止まる
- register の再開（src/exec/run/register-resume.ts）は projectTheirsPaths に bookkeeping のパスを渡して統合先の側を採っているが、schedule の再開（src/exec/run/lifecycle-commands.ts の executor 再開前の同期）は渡していない。同じ考え方で、そのタスク自身の run の記録（DVNV が commit する範囲）の衝突を解いて再開できるように直す。どちらの側を採るかは、再開した executor が result を書き直すことと、後の統合の merge が衝突しないことから決める
- 完了条件: 上記の E2E を含む npm run test:integration が通る。DVNV の trailing-records の統合テストと ED0K の再開のテストも通る。register の再開に同じ穴がないかも確かめる

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

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
