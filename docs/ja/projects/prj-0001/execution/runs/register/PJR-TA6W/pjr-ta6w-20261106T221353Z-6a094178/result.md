---
specdojo:
  id: prj-0001:xer-pjr-ta6w-20261106t221353z-6a094178
  type: exec-result
  task_id: PJR-TA6W
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-TA6W/pjr-ta6w-20261106T221353Z-6a094178/plan.md
  started_at: "2026-11-06T22:13:54.151Z"
  completed_at: "2026-11-06T23:12:12.636Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- 古い配置の `run` を新しい配置で再開した際に、`evidence` やログが `commit` されない問題を修正した。
- `register` の `executor` が再開時に以前の `run ID` を引き継がず新配置へ記録していた点と、`commit` 判定が `result` のディレクトリを基準にして自身の記録を別 `run` として除外していた問題を解消した。
- 累積変更において元の保存先を維持し、同じ `run` の新旧両配置の記録を `commit` 対象に含めるように改良した。
- 修正に伴い、`CHANGELOG.md`、ソースコード、および統合テストを更新した。

## 2. 変更ファイル

- `CHANGELOG.md`: `CHANGELOG.md` の更新。
- `docs/ja/specdojo/guides/exec-operation-guide.md`: `docs/ja/specdojo/guides/exec-operation-guide.md` の更新。
- `src/exec/evidence.ts`: `src/exec/evidence.ts` の更新。
- `src/exec/pipeline-state.ts`: `src/exec/pipeline-state.ts` の更新。
- `src/exec/run/register-resume.ts`: `src/exec/run/register-resume.ts` の更新。
- `src/exec/worktree-ops-commit.ts`: `src/exec/worktree-ops-commit.ts` の更新。
- `src/shared/run-records.ts`: `src/shared/run-records.ts` の更新。
- `tests/src/exec/register-resume.integration.test.ts`: `tests/src/exec/register-resume.integration.test.ts` の更新。
- `tests/src/exec/run-records.test.ts`: `tests/src/exec/run-records.test.ts` の更新。
- `tests/src/exec/worktree-ops.integration.test.ts`: `tests/src/exec/worktree-ops.integration.test.ts` の更新。
- `tests/src/exec/worktree-ops.test.ts`: `tests/src/exec/worktree-ops.test.ts` の更新。

## 3. 申し送り

- 原因は、`register` の `executor` 再開で以前の `run ID` を引き継がず新配置へ記録したことと、`commit` 判定が `result` のディレクトリを基準に自分の記録を別 `run` として除外したこと。累積変更で元の保存先を維持し、同じ `run` の新旧両配置の記録を `commit` 対象に含めた。
- PJR-PZBP の再開分の `evidence`・ログは `worktree` とともに削除済みであり、この修正では復元できない。個票の対応結果にも記録済み。
- 前回の `lint-fm` 失敗に対し、現在の `HEAD` の `.remarkrc.yaml` に新配置の `plan`・`result` 用 `schema` ルールが既にあることを確認した。設定と `result` は編集していない。`lint-fm` と修正した統合テストを含む親検証は `runner` が実施する。
- 統合後は、個票の対応結果とオーケストレーター運用メモに従い、PJR-JSEY で実 `agent` CLI を使う `runner` の動作確認を行う。
- 原因は、register の executor 再開で以前の run ID を引き継がず新配置へ記録したことと、commit 判定が result のディレクトリを基準に自分の記録を別 run として除外したこと。累積変更で元の保存先を維持し、同じ run の新旧両配置の記録を commit 対象に含めた。
- PJR-PZBP の再開分の evidence・ログは worktree とともに削除済みであり、この修正では復元できない。個票の対応結果にも記録済み。
- 前回の lint-fm 失敗に対し、現在の HEAD の `.remarkrc.yaml` に新配置の plan・result 用 schema ルールが既にあることを確認した。設定と result は編集していない。lint-fm と修正した統合テストを含む親検証は runner が実施する。
- 統合後は、個票の対応結果とオーケストレーター運用メモに従い、PJR-JSEY で実 agent CLI を使う runner の動作確認を行う。
- 適用外の検証: `npm run validate:schema:file`（executor 自身による YAML 変更はない。既存の event YAML 差分は runner が管理する状態遷移記録である。）

## 4. 進め方

原因調査の結果、`executor` が `run` を再開する際に以前の `run ID` を引き継がずに新しいディレクトリへ記録してしまうことと、`commit` を判断する際に `result` ディレクトリを基準としたために、自身の追加した記録が別 `run` のものとして除外されてしまうことが問題であることを特定した。これに対し、`run` の記録として累積変更を保持し、新旧両方の配置の記録を同一の `run` として `commit` 対象に含めるよう、`src/exec/run/register-resume.ts` および関連する `worktree-ops` のロジックを修正した。
