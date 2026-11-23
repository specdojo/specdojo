---
specdojo:
  id: prj-0001:xer-pjr-1s74-20261123t230525z-532a75b6
  type: exec-result
  task_id: PJR-1S74
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-1S74/pjr-1s74-20261123T230525Z-532a75b6/plan.md
  started_at: "2026-11-23T23:05:25.972Z"
  completed_at: "2026-11-23T23:13:30.313Z"
  agent: sonnet-executor
  block_reason: "parent validation failed: lint-fm-changed"
---

# Edit Result

## 1. 実施内容

- runner の YAML 検査要否判定（`src/exec/reporter.ts`）を修正しました。reason 付きの `specdojo-schema` directive（`none` または `validate=false`）を持つ YAML は `validate:schema:file` の要求対象から外れます。これにより、`validate=false` の template（pm-members-template.yaml）だけを変えたタスクが、検査が無いとして止まる問題を解消しました。
- 追加した単体テスト 5 件と既存 reporter テスト 131 件は通過しました。`npm run typecheck`、`npm run lint:ts`、runner の `test:unit`、`test:integration`（関連テストのみ）、`validate:schema` も通過しました。
- runner の `npm run lint:fm:changed` は失敗しました。個票 `pjr-1s74-schema-check-skip-validate-false.md` の 55 行目に、未エスケープの `&lt;reason&gt;` があるためです。個票は executor が対応結果を更新したファイルで、runner 管理の変更として扱われます。この指摘は未解消です。

## 2. 変更ファイル

- `src/exec/reporter.ts`: YAML の検査要否の判定から、reason 付きの `specdojo-schema` directive（`none` または `validate=false`）が付いた YAML を除外するようにしました。
- `tests/src/exec/reporter-schema-check-skip.test.ts`: 新規の単体テストです。検査しない印の付いた YAML が `validate:schema:file` の要求から外れることを 5 件のケースで検証します。

## 3. 申し送り

- `npm run lint:fm:changed` が失敗しています。個票 `pjr-1s74-schema-check-skip-validate-false.md` の 55 行目にある `&lt;reason&gt;` を、インラインコードで囲む必要があります。これは executor evidence からの事実で、修正は未実施です。
- 統合後、オーケストレーターが exec resume --task T-KATA-WAVE-6-PROJECT-pm-members-sample-060 --resume-from executor で流し直す。template の `scheduler_strategy` は `_SCHEDULER_STRATEGY_` から critical-first に戻すよう指示する。
- CHANGELOG に書く事項: 区分 Fixed。runner が、specdojo-schema: validate=false または none（reason= 付き）の YAML だけを変えた task に validate:schema:file を求めて止めていたのを直した。

## 4. 進め方

reporter の YAML 検査要否判定で、reason 付きの `specdojo-schema` directive（`none` または `validate=false`）を持つ YAML を対象から外しました。この変更を単体テストで固定し、個票の対応結果を更新しました。
