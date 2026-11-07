---
specdojo:
  id: prj-0001:xer-pjr-bvs9-20261107t000912z-28adcfe2
  type: exec-result
  task_id: PJR-BVS9
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-BVS9/pjr-bvs9-20261107T000912Z-28adcfe2/plan.md
  started_at: "2026-11-07T00:09:13.113Z"
  completed_at: "2026-11-07T00:30:37.578Z"
  agent: sol-executor
  block_reason: "parent validation failed: lint-ts, test-integration, test-unit"
---

# Edit Result

## 1. 実施内容

- 保存する `plan.md` の規約部分を、規約の SHA-256 ハッシュ値への参照に変更する仕組みを実装しました。
- 規約の本体は `execution/conventions/` ディレクトリに `.txt` ファイルとして保存され、再開時や手動生成時に復元されるようになります。
- これにより、各 `plan.md` のファイルサイズを削減し、共通規約の版管理を効率化しました。
- 変更に伴い、`CHANGELOG.md`、実装コード、テストコード、および各種ガイドラインを更新しました。

## 2. 変更ファイル

- `CHANGELOG.md`: 本変更に関する記録を追加しました。
- `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`: 規約の参照方式に関するガイドラインを更新しました。
- `src/exec/plans-generation.ts`: 規約をハッシュ値で参照し、`execution/conventions/` に保存するロジ逻辑を実装しました。
- `src/exec/plans-storage.ts`: 規約の保存および復元に関する機能を更新しました。
- `src/exec/register.ts`: 登録プロセスにおける規約の扱いに対応させました。
- `src/exec/run/in-place.ts`: `in-place` 実行時の規約参照ロジックを更新しました。
- `src/exec/run/job.ts`: `job` 実行時の規約参照に関する変更を適用しました。
- `src/exec/run/register-core.ts`: レジストレーションのコアロジックにおける規約の扱いを修正しました。
- `src/exec/run/register-post-review.ts`: レビュー後の処理における規約の適用を更新しました。
- `src/exec/run/register-resume.ts`: 再開時の規約復元プロセスを実装しました。
- `src/exec/run/register-worktree.ts`: ワークツリーを用いた実行時の規約参照を対応させました。
- `src/exec/trial-commands.ts`: 試行コマンド実行時の規約の扱いに対応させました。
- `src/exec/worktree-ops-lifecycle.ts`: ワークツリー操作ライフサイクルにおける規約の整合性を確保しました。
- `src/job/job.ts`: `job` 実行時に関連する規約の適用に関する変更を適用しました。
- `src/shared/plan-templates.ts`: 規約の参照を含むテンプレート構造の変更を適用しました。
- `src/shared/run-records.ts`: 実行記録における規約の版情報の保持に対応させました。
- `tests/src/exec/pipeline-e2e.integration.test.ts`: 新しい規約の参照方式を含む E2E テストを追加しました。
- `tests/src/exec/plans.test.ts`: 規約の参照および復元に関する単体テストを追加しました。
- `tests/src/exec/register-pipeline-e2e.integration.test.ts`: 登録パイプラインにおける規約の参照テストを追加しました。
- `tests/src/exec/register-plan-escape.test.ts`: 規約の参照に関するエッジケースのテストを追加しました。
- `tests/src/exec/run/inplace.test.ts`: `in-place` 実行時の規約の扱いに関するテストを追加しました。
- `src/shared/plan-conventions.ts`: 規約の参照および管理に関するロジックを実装しました。
- `tests/src/exec/plan-conventions.test.ts`: 規約の管理に関するテストを追加しました。

## 3. 申し送り

- 判断: 規約は `mode`・`schema` 解決後の内容から版を計算し、共通の `execution/conventions/` に `.txt` で保存する。整形によるハッシュ変更を防ぎ、欠落時は現在のテンプレートへフォールバックせず停止する。個票にも記録済み。
- 生成した `plan.md` は 9,297 バイトから 5,835 バイトへ、3,462 バイト削減した。共有規約は 3,643 バイトで、同じ版の次の `plan.md` から再利用する。
- 統合後は `PJR-JSEY` に本項目を加え、実 agent CLI の動作を確認する。
- 判断: 規約は mode・schema 解決後の内容から版を計算し、共通の execution/conventions/ に .txt で保存する。整形によるハッシュ変更を防ぎ、欠落時は現在のテンプレートへフォールバックせず停止する。個票にも記録済み。
- 生成した plan は 9,297 バイトから 5,835 バイトへ、3,462 バイト削減した。共有規約は 3,643 バイトで、同じ版の次の plan から再利用する。
- 統合後は PJR-JSEY に本項目を加え、実 agent CLI の動作を確認する。
- 適用外の検証: `npm run validate:schema:file`（executor が変更した YAML ファイルはない。）
- 人の確認が必要: `npx specdojo exec run --project prj-0001 --register PJR-JSEY --executor-by claude-executor --worktree`（統合後、実 agent CLI と利用枠を使う動作確認が必要。）

## 4. 進め方

各 `plan.md` に含まれる規約の本文を削除し、代わりに `execution/conventions/` に保存された規約の SHA-256 ハッシュ値への参照を埋め込む仕組みを構築しました。規約の生成・保存は `src/exec/plans-generation.ts` にて行われ、再開時や手動実行時にはそのハッシュを用いて `execution/conventions/` から規約を復元します。これにより、`plan.md` の肥大化を防ぎつつ、規約の版管理を確実に行えるようにしました。
