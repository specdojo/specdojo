---
specdojo:
  id: prj-0001:xer-pjr-0x0s-20261111t115946z-1b4d549b
  type: exec-result
  task_id: PJR-0X0S
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-0X0S/pjr-0x0s-20261111T115946Z-1b4d549b/plan.md
  started_at: "2026-11-11T11:59:47.535Z"
  completed_at: "2026-11-11T12:21:04.512Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- 夜間の `register` 実行において、子の `worktree` 配置が入れ子にならないよう調整しました。
- 子の `worktree` が Job の環境（Git 環境など）を漏らさないよう、環境の切り離しを行いました。
- 関連する設計書、ガイド、コマンドリファレンス、ソースコード、およびテストコードを更新しました。

## 2. 変更ファイル

- `docs/ja/product/040-system-design/sysd-job-execution.md`: Job 実行時の `worktree` 配置と環境の分離に関する設計記述を更新。
- `docs/ja/specdojo/guides/exec-worktree-guide.md`: `worktree` の使用に関するガイドを更新。
- `docs/ja/specdojo/references/command-reference.md`: コマンドに関するリファレンスを更新。
- `src/commands/night-orchestrator.ts`: 夜間オーケストレーターのコマンド実装を更新。
- `src/exec/run/job.ts`: Job 実行時の `worktree` 制御ロジックを修正。
- `src/exec/worktree.ts`: `worktree` 操作のコアロジックを修正。
- `tests/src/commands/night-orchestrator.test.ts`: オーケストレーターのコマンドに関するテストを更新。
- `tests/src/exec/job-worktree.integration.test.ts`: Job と `worktree` の統合テストを更新。
- `tests/src/exec/register-pipeline-e2e.integration.test.ts`: `register` パイプラインの E2E テストを更新。
- `tests/src/exec/worktree.integration.test.ts`: `worktree` に関する統合テストを更新。

## 3. 申し送り

- 配置の設定値・既定値は主の作業ツリー基準とし、互換性のため明示的な `--worktree-base` の相対指定は起動元基準を維持しました。絶対パスは変更しません。
- orchestrator は統合後に夜間 routine を1回実行し、子の記録の最終統合先への反映と親検証の成功を確認してから `rtn-night-approved-register` を有効に戻してください。playbook 6.1 節に従う PJR-JSEY の確認も必要です。
- CHANGELOG 文案（v0.8.0・不具合修正）: 夜間の register 実行で子の worktree が入れ子になり、Job の内部環境が子の統合テストへ漏れて review・merge を飛ばす問題を修正しました。個票5.4節にも記録済みです。
- 適用外の検証: `npm run validate:schema:file`（executor が変更した YAML/YML ファイルはありません。）
- 人の確認が必要: `node --import tsx src/specdojo.ts routine run --project prj-0001 --id rtn-night-approved-register`（統合後に orchestrator が実行する実運用確認。実 agent の起動と使用量消費を伴います。）

## 4. 進め方

まず `src/exec/worktree.ts` および `src/exec/run/job.ts` を修正し、`worktree` の配置が Job の `worktree` の下に作られないように変更しました。併せて、子の実行環境が親の Git 環境などの情報を引き継がないよう、環境の分離を強化しました。その後、`src/commands/night-orchestrator.ts` を含めた実装と、それに対する各種テストコード（`tests/` 配下）を更新し、設計書やガイド類も最新の状態に整合させました。
