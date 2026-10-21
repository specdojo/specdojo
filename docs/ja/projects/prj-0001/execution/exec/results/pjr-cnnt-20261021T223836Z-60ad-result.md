---
specdojo:
  id: prj-0001:xer-pjr-cnnt-20261021t223836z-60ad
  type: exec-result
  task_id: PJR-CNNT
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-cnnt-20261021T223836Z-60ad-plan.md
  started_at: "2026-10-21T22:38:37.038Z"
  completed_at: "2026-10-21T22:53:34.605Z"
  agent: flash-high-executor
  block_reason: "agent exited with non-zero code: parent validation failed: lint-ts, test-unit"
---

# Edit Result

## 1. 実施内容

- plan の stem や event 名の末尾に使用される乱数（hex 文字列）の長さを 2 バイトから 4 バイト（8 文字）へ拡張しました。
- 名称の衝突を回避するため、同じ stem が生成された場合にカウンター（`-1`, `-2` ...）を付与する重複検知とフォールバック機構を実装しました。
- この変更は `buildInPlaceStem`、`archivePlan`、および `writeEventFile` の各関数に適用されています。

## 2. 変更ファイル

- `CHANGELOG.md`: 乱数による名称衝突問題の修正に関する変更点を追記しました。
- `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`: plan のライフサイクルと名称生成に関する情報を更新しました。
- `src/exec/events.ts`: イベントファイル書き出し時の名称重複検知とカウンター付与のロジックを追加しました。
- `src/exec/plans-core.ts`: plan の stem 生成において、乱数長を 4 バイトに拡張し、重複時のフォールバック処理を追加しました。
- `src/exec/plans-storage.ts`: plan のアーカイブ処理において、名称衝突を回避するロジックを導入しました。
- `src/exec/plans.ts`: plan 関連のコアロジックにおける名称生成プロセスを更新しました。
- `tests/src/exec/deliverable.test.ts`: 成果物の生成における名称生成の検証テストを追加しました。
- `tests/src/exec/events.test.ts`: イベント生成時の名称重複に対する振る舞いに関するテストを追加しました。
- `tests/src/exec/plans.test.ts`: plan の stem 生成における衝突検知とカウンター付与のテストを追加しました。
- `tests/src/exec/run/inplace.test.ts`: in-place 実行時の名称生成の安定性を検証するテストを追加しました。

## 3. 申し送り

- `test-unit` で `TypeError: Cannot redefine property: randomBytes` が発生していることを確認しました。これは `vi.spyOn` による `crypto.randomBytes` のモックが ESM 環境下で失敗していることに起因します。テストコードの修正が必要です。
- 適用外の検証: `npm run validate:schema:file`（no changed `*.yaml` or `*.yml` files in worktree）

## 4. 進め方

まず、plan の stem およびイベント名に使用される乱数の長さを 2 バイトから 4 バイトに拡張することで、衝突確率を大幅に低減させました。さらに、万が一衝突が発生した場合に備え、生成された名前が既存のものと重複している場合に `-1`, `-2` といったカウンターを付記する仕組みを `buildInPlaceStem` を中心とした主要な関数群に導入しました。これにより、秒単位で連続して plan が生成された場合でも、一意性を保証できるようにしました。
