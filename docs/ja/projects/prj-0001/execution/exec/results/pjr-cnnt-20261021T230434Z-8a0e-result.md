---
specdojo:
  id: prj-0001:xer-pjr-cnnt-20261021t230434z-8a0e
  type: exec-result
  task_id: PJR-CNNT
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-cnnt-20261021T230434Z-8a0e-plan.md
  started_at: "2026-10-21T23:05:45.359Z"
  completed_at: "2026-10-21T23:17:18.380Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- plan、in-place、およびイベントの名前の末尾に付与される乱数（stem）の衝突リスクを解消するため、2バイトから連番による決定的な識別子への変更を実施した。
- ランダムな衝突を避けるために、名前の生成ロジックを連番ベースに変更し、決定的な回帰テストを可能にした。
- 変更に伴い、`CHANGELOG.md`、関連する設計書、およびテストコード、ソースコードを更新した。

## 2. 変更ファイル

- `CHANGELOG.md`: 名前の衝突回避に関する変更内容を追記した。
- `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`: plan のライフサイクルに関する変更を反映した。
- `src/exec/events.ts`: イベント名に連番を使用するロジックを実装した。
- `src/exec/plans-core.ts`: plan の stem（識別子）の生成方法をランダムから連番へ変更した。
- `src/exec/plans-storage.ts`: 連番ベースの識別子管理に対応するための変更を行った。
- `tests/src/exec/deliverable.test.ts`: 成果物に関連するテストケースを更新した。
- `tests/src/exec/events.test.ts`: イベント生成の連番ロジックに関するテストを追加・更新した。
- `tests/src/exec/plans.test.ts`: plan の識別子生成に関するテストを更新した。
- `tests/src/exec/run/inplace.test.ts`: in-place 実行時の識別子生成に関するテストを更新した。

## 3. 申し送り

- 統合後の実環境において、`specdojo exec run` を用いた smoke test を実施し、連番による正当な識別子生成と動作を確認することを推奨する。
- 人の確認が必要: `specdojo exec run --project prj-0001 --register PJR-JSEY`（統合後の実環境で runner の smoke test を1回実施する。）

## 4. 進め方

まず、`src/exec/plans-core.ts` および `src/exec/events.ts` において、従来の 2 バイトのランダムな `stem` を使用する方式から、衝突を回避できる決定的な連番方式へロジックを変更した。これに伴い、`src/exec/plans-storage.ts` の変更を行い、生成された識別子が正しく保存・参照されることを保証した。また、変更後のロジックが期待通りに動作することを確認するため、`tests/` 配下の各テストファイル（`events.test.ts`, `plans.test.ts`, `inplace.test.ts` 等）を更新し、決定的な回帰テストを実現した。
