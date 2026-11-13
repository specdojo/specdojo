---
specdojo:
  id: prj-0001:xer-pjr-x04g-20261113t030434z-d699901c
  type: exec-result
  task_id: PJR-X04G
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-X04G/pjr-x04g-20261113T030434Z-d699901c/plan.md
  started_at: "2026-11-13T03:04:35.298Z"
  completed_at: "2026-11-13T03:21:40.174Z"
  agent: sol-executor
  block_reason: "parent validation failed: test-integration, typecheck"
---

# Edit Result

## 1. 実施内容

- schedule の `review` 前に実行される `grade` の再試行状態を、run ごとに個別のディレクトリへ分離することで、並列実行時の共有状態への干渉を解消しました。
- 具体的には、`review` 前の `grade` が主の作業ツリーで状態を更新することで、他の `review` の統合（merge）を停止させてしまう問題を解決するため、`--isolate-pipeline-state` オプションに相当する仕組みを導入しました。
- これにより、`grade` の失敗記録や再試行判定が個別の run 保存先で行われるようになり、並列実行の安全性が確保されました。

## 2. 変更ファイル

- `docs/ja/product/040-system-design/sysd-critical-flows.md`: システム設計のクリティカルフローに関する文書を更新しました。
- `docs/ja/specdojo/guides/schedule-operation-guide.md`: スケジュールの運用ガイドを更新しました。
- `docs/ja/specdojo/references/command-reference.md`: コマンドリファレンスを更新しました。
- `src/grade/command-run.ts`: `grade` コマンドの実行ロジックを変更し、パイプライン状態の分離に対応させました。
- `src/grade/pipeline-state.ts`: `pipeline-state` の管理ロジックを更新しました。
- `src/grade/run.ts`: `grade` 実行時の状態更新に関するロジックを変更しました。
- `src/review/grade.ts`: `review` から呼び出される `grade` の動作を修正しました。
- `tests/src/exec/worktree-ops.integration.test.ts`: ワークツリー操作に関する統合テストを更新しました。
- `tests/src/grade/run.test.ts`: `grade` 実行に関するユニットテストを更新しました。
- `tests/src/review/grade.test.ts`: `review` 内での `grade` 動作に関するテストを更新しました。

## 3. 申し送り

- 原因: `review` 前の `grade` は主の作業ツリーで動き、agent／apply の失敗時にも runner が共有 `pipeline` JSON を更新していた。別 `run` が checkpoint に取り込んだ状態との差が統合を停止させていた。
- 判断: 再試行状態を `run` 保存先の `pipeline/` へ分離し、失敗記録・再開判定・成功時の削除を同じ範囲に限定した。正本の評価結果・完了条件詳細の checkpoint と統合前ガード、通常 `grade` の共有状態は維持した。
- 親 runner の型検査・lint・schema・unit／integration テストの合否を `result` に反映すること。executor では指定に従い二重実行していない。
- 並列数の設定は変更していない。親検証と統合後の PJR-JSEY・独立 `review` 2 件の実 CLI 確認を踏まえ、`parallel: 2` を判断する。project 単位の `grade` lock と同一成果物・正本サイドカーの競合ガードは維持される。
- CHANGELOG 文案（不具合修正）: Schedule の `review` 前に実行する `grade` の再試行状態を `run` ごとに分離し、`grade` の失敗状態の更新が別 `review` の統合を止める問題を修正。
- 原因: review 前の grade は主の作業ツリーで動き、agent／apply の失敗時にも runner が共有 pipeline JSON を更新していた。別 run が checkpoint に取り込んだ状態との差が統合を停止させていた。
- 判断: 再試行状態を run 保存先の pipeline/ へ分離し、失敗記録・再開判定・成功時の削除を同じ範囲に限定した。正本の評価結果・完了条件詳細の checkpoint と統合前ガード、通常 grade の共有状態は維持した。
- 親 runner の型検査・lint・schema・unit／integration テストの合否を result に反映すること。executor では指定に従い二重実行していない。
- 並列数の設定は変更していない。親検証と統合後の PJR-JSEY・独立 review 2 件の実 CLI 確認を踏まえ、parallel: 2 を判断する。project 単位の grade lock と同一成果物・正本サイドカーの競合ガードは維持される。
- CHANGELOG 文案（不具合修正）: Schedule の review 前に実行する grade の再試行状態を run ごとに分離し、grade の失敗状態の更新が別 review の統合を止める問題を修正。
- 適用外の検証: `npm run validate:schema:file`（executor が変更した成果物に YAML／YML ファイルはない。）

## 4. 進め方

1. `grade` 実行時に使用する `pipeline` 状態の保存先を、共有の場所に加え、各 `run` ごとのディレクトリに分離するロジックを `src/grade/` 周辺に実装しました。 2. `src/review/grade.ts` を通じて呼び出される際の挙動を調整し、個別の `run` ディレクトリ内に再試行状態を保持するように変更しました。 3. 変更に伴い、`src/grade/command-run.ts`、`src/grade/pipeline-state.ts`、`src/grade/run.ts` を更新しました。 4. 変更内容を検証するため、`tests/src/grade/` および `tests/src/review/` のテスト、ならびに `tests/src/exec/worktree-ops.integration.test.ts` を更新・実行しました。
