---
specdojo:
  id: prj-0001:xer-pjr-merv-20261103t130253z-9fc08e8a
  type: exec-result
  task_id: PJR-MERV
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-MERV/20261103T130253379Z-7595f210/plan.md
  started_at: "2026-11-03T13:02:53.827Z"
  completed_at: "2026-11-03T15:36:03.645Z"
  agent: argon-executor
---

# Edit Result

## 1. 実施内容

- `src/exec/reporter.ts` の検査適用判定から runner が生成する `exec/` 配下の記録を除外し、executor の変更範囲に乗らない検査（`validate:history-links` や `validate:catalog`）を `not_applicable` として扱うよう修正した。
- これに伴い、`src/exec/run/agent.ts`、`tests/src/exec/reporter.test.ts`、`tests/src/exec/run/run.test.ts` を更新した。
- 共通規約テンプレート、運用・設定ガイド、および `CHANGELOG.md` を更新した。
- 個票 `pjr-merv-validation-applicability-mismatch.md` の対応結果を更新した。

## 2. 変更ファイル

- `CHANGELOG.md`: プロジェクトの変更履歴を更新した。
- `docs/ja/specdojo/exec-templates/xep-common-conventions-template.md`: 共通規約テンプレートを更新した。
- `docs/ja/specdojo/guides/exec-config-guide.md`: 実行構成ガイドを更新した。
- `docs/ja/specdojo/guides/exec-operation-guide.md`: 実行運用ガイドを更新した。
- `src/exec/reporter.ts`: 検査の適用判定ロジックを修正し、runner が生成する実行管理ファイルを対象外とした。
- `src/exec/run/agent.ts`: エージェントの実行ロジックを更新した。
- `tests/src/exec/reporter.test.ts`: reporter のテストコードを更新した。
- `tests/src/exec/run/run.test.ts`: 実行フローのテストコードを更新した。

## 3. 申し送り

- 方式の選択と理由: 選択肢 1「runner が書く `exec/plans/`・`exec/results/` などの実行管理ファイルを executor の変更範囲から除外し、それだけによって対象になる検査（`validate:history-links`・`validate:catalog`）は executor に対して適用外（`not_applicable`）として扱う」を採用した。選択肢 2「plan に runner が書く `plan`・`result` も検査対象に入ることを明記して executor に流させる」は、executor / reporter パイプラインでは `plan` が executor 起動前に runner によって生成され、`result` の本文は executor 終了後に reporter と runner が描画するため、プロダクト文書（`docs/ja/product/`）のみを編集するタスクで executor にプロジェクト側の履歴リンク検査やカタログ検査を毎回実行させても終了後の `result` を検証できず冗長になることから退けた。
- 保護された設定（`.specdojo/**`・`package.json`・`lefthook.yml` など）の変更は不要と判断した。
- runner のコード（`src/exec/reporter.ts`・`src/exec/run/agent.ts`）を変更したため、統合後に新しいプロセスで `exec run` の動作を確認してから close する。
- 保護された設定（`.specdojo/**`・`package.json`・`lefthook.yml` など）の変更は不要と判断した。
- 適用外の検証: `npm run validate:schema:file`（変更に YAML ファイル（`*.yaml` / `*.yml`）がない）

## 4. 進め方

executor が自身で変更したファイルのみを検査対象とする性質を利用し、runner が後から書き込む `exec/` 配下のファイルによって引き起こされる「不当な検査失敗（`not_run` や `not_applicable` の判定ミス）」を回避するため、`src/exec/reporter.ts` の検査適用ロジックを修正。runner が生成するファイルを検査対象から除外することで、executor はプロダクト文書の変更に基づいた正しい `not_applicable` 判断が可能となるよう調整した。
