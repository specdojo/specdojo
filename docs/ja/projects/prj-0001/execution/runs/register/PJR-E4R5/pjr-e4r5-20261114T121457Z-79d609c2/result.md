---
specdojo:
  id: prj-0001:xer-pjr-e4r5-20261114t121457z-79d609c2
  type: exec-result
  task_id: PJR-E4R5
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-E4R5/pjr-e4r5-20261114T121457Z-79d609c2/plan.md
  started_at: "2026-11-14T12:14:58.838Z"
  completed_at: "2026-11-14T12:34:09.939Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- 型を整備する `schedule` の `review` において、型一式の自動 `grade` および完了判定の制限を導入しました。
- すべての `grade` が `pass` であることを完了の条件に追加し、不整合な状態（`needs-work`/`fail`）や古い結果（`grade-stale`）がある場合は完了を認めないように制約を強化しました。
- `grade run --if-busy fail|wait` コマンドを追加し、同一プロジェクトの `grade` 実行が稼働中の場合に、失敗させるか待機するかを選択可能にしました。
- 回帰テスト、設計書、ガイド、および個票の更新をすべて完了しています。

## 2. 変更ファイル

- `docs/ja/product/040-system-design/sysd-critical-flows.md`: 設計書の更新。
- `docs/ja/specdojo/guides/review-guide.md`: レビューガイドの更新。
- `docs/ja/specdojo/references/command-reference.md`: コマンドリファレンスの更新。
- `src/exec/plans-generation.ts`: プラン生成ロジックの更新。
- `src/exec/run/in-place.ts`: インプレイス実行ロジックの更新。
- `src/exec/run/schedule-prepare.ts`: スケジュール準備ロジックの更新。
- `src/exec/run/schedule-task.ts`: スケジュールタスク管理ロジックの更新。
- `src/grade/command-run.ts`: `grade run` コマンドの更新。
- `src/grade/run.ts`: `grade` 実行コアロジックの更新。
- `src/review/grade.ts`: レビュー時の `grade` 判定ロジックの更新。
- `tests/src/grade/run.test.ts`: `grade run` に関するテストの更新。
- `tests/src/review/grade.test.ts`: レビュー時の `grade` 判定に関するテストの更新。
- `src/exec/review-kata.ts`: `review-kata` 実装の追加。
- `tests/src/exec/review-kata.test.ts`: `review-kata` に対するテストの追加。

## 3. 申し送り

- 対象は `task` 自身の `track` の `intent` から解決し、代表成果物に加えて `rulebook`・全 `sample`・宣言済み `recipe`/`template` を評価した。
- 型すべての最新 `grade` が `pass` の場合だけ完了可能とした。`needs-work`/`fail` は `incomplete`、未評価・古い結果・参照不足は `grade-stale`、読取不能は `grade-unavailable`。`complete-with-findings` でも迂回できず、runner が記録済み `verdict` も制限する。
- PJR-36PW に関連して `grade run --if-busy fail|wait` を追加し、自動 `review` は `wait` を指定する。PJR-X04G の再試行状態分離と `checkpoint` ガードを維持し、対象パスの `hash` で同一秒の `run ID` 衝突を防止した。関連項目の状態変更は行っていない。
- 変更ファイル: `src/exec/review-kata.ts`、`src/exec/plans-generation.ts`、`src/exec/run/schedule-prepare.ts`、`src/exec/run/schedule-task.ts`、`src/exec/run/in-place.ts`、`src/grade/command-run.ts`、`src/grade/run.ts`、`src/review/grade.ts`、`tests/src/exec/review-kata.test.ts`、`tests/src/grade/run.test.ts`、`tests/src/review/grade.test.ts`、`docs/ja/product/040-system-design/sysd-critical-flows.md`、`docs/ja/specdojo/guides/review-guide.md`、`docs/ja/specdojo/references/command-reference.md`、`docs/ja/projects/prj-0001/controls/project-register/pjr-e4r5-kata-review-grade-kata-fix.md`。
- CHANGELOG 文案（個票にも記録済み）: 不具合修正—型を整備する `schedule` の `review` で型一式を自動 `grade` し、すべて `pass` になるまで完了判定を保留する。追加—`grade run --if-busy fail|wait` で同一 `project` の `grade` の終了待ちを選択できる。
- 型検査・`lint`・`schema`・`unit`/`integration test` は指定どおり親 `runner` に委ねた。`result`・個票のステータス・保護設定・`CHANGELOG.md` は編集していない。
- 対象は task 自身の track の intent から解決し、代表成果物に加えて rulebook・全 sample・宣言済み recipe/template を評価する。型の組の整合を確認するため、改善対象の1種だけには絞らない。
- 型すべての最新 grade が pass の場合だけ完了可能とした。needs-work/fail は incomplete、未評価・古い結果・参照不足は grade-stale、読取不能は grade-unavailable。complete-with-findings でも迂回できず、runner が記録済み verdict も制限する。
- PJR-36PW に関連して grade run --if-busy fail|wait を追加し、自動 review は wait を指定する。PJR-X04G の再試行状態分離と checkpoint ガードを維持し、対象パスの hash で同一秒の run ID 衝突を防止した。関連項目の状態変更は行っていない。
- 変更ファイル: src/exec/review-kata.ts、src/exec/plans-generation.ts、src/exec/run/schedule-prepare.ts、src/exec/run/schedule-task.ts、src/exec/run/in-place.ts、src/grade/command-run.ts、src/grade/run.ts、src/review/grade.ts、tests/src/exec/review-kata.test.ts、tests/src/grade/run.test.ts、tests/src/review/grade.test.ts、docs/ja/product/040-system-design/sysd-critical-flows.md、docs/ja/specdojo/guides/review-guide.md、docs/ja/specdojo/references/command-reference.md、docs/ja/projects/prj-0001/controls/project-register/pjr-e4r5-kata-review-grade-kata-fix.md。
- CHANGELOG 文案（個票にも記録済み）: 不具合修正—型を整備する schedule の review で型一式を自動 grade し、すべて pass になるまで完了判定を保留する。追加—grade run --if-busy fail|wait で同一 project の grade の終了待ちを選択できる。
- 型検査・lint・schema・unit/integration test は指定どおり親 runner に委ねた。result・個票のステータス・保護設定・CHANGELOG.md は編集していない。
- 適用外の検証: `npm run validate:schema:file`（executor の変更は TypeScript と Markdown のみで、YAML 成果物を変更していない。）

## 4. 進め方

作業の前提として、`task` の `intent` に基づき、型一式の自動判定と完了条件の厳格化、および `grade` 実行時の競合制御機能の追加を行いました。具体的には、`src/review/grade.ts` において、すべての対象の `grade` が `pass` であることを必須条件とするロジックを実装し、`src/grade/command-run.ts` を通じて `grade run --if-busy` オプションを提供しました。また、これに伴い設計書、ガイド、テストコードのすべての整合性を検証しました。
