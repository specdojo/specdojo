---
specdojo:
  id: prj-0001:xer-pjr-q2at-20261115t134347z-e767fe26
  type: exec-result
  task_id: PJR-Q2AT
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-Q2AT/pjr-q2at-20261115T134347Z-e767fe26/plan.md
  started_at: "2026-11-15T13:45:52.604Z"
  completed_at: "2026-11-15T14:13:27.035Z"
  agent: opus-executor
  block_reason: "parent validation failed: validate-schema"
---

# Edit Result

## 1. 実施内容

- 親 runner の検証結果を 1 行にまとめた `not_run` または `not_applicable` の行の判定ロジックを修正し、親の検証がすべて成功している場合に executor が停止する不具合を解消した。
- 親 runner の各種検証（`id` 付き）が `passed` または `not_applicable` であることを、検証ごとに個別に判定するようにしたことで、検証結果の集約による誤判定を防ぐ。
- 回帰テストのためのテストケース追加、および executor への指示と共通規約への記述変更を実施した。

## 2. 変更ファイル

- `docs/ja/specdojo/exec-templates/xp-common-conventions-template.md`: executor が親の検証を報告する際、集約した `not_run` 行ではなく、各検証ごとに 1 行ずつ記述することを求める旨の指示を追加した。
- `src/exec/parent-validation.ts`: 親の検証結果を判定するロジックを修正し、検証の集約行（`not_run` / `not_applicable`）による誤判定を回避し、個別の検証結果に基づいた判定を行うように変更した。
- `src/exec/reporter.ts`: reporter の挙動に関連する修正を行った。
- `src/exec/run/agent.ts`: agent の実行プロセスに関連する修正を行った。
- `tests/src/exec/reporter.test.ts`: reporter の挙動に関する回帰テストを追加した。
- `tests/src/exec/run/run.test.ts`: run プロセスの検証および文言に関するテストケースを追加した。

## 3. 申し送り

- 判断: `pipeline.parent_validations` に設定済みかどうかは、evidence にある親 runner の記録（`source=runner`、`id` 付き）で判定した。runner は設定された検証ごとに、流さなかった場合も `not_applicable` で記録するため、設定と記録が 1 対 1 に対応する。
- 判断: `npm`・`npx`・`pnpm`・`yarn`・`node`・`tsx`・`specdojo` で始まる行はコマンドそのものとして扱い、まとめた行とはみなさない。`…` を含む列は読み取れないので止める側にした。まとめた行の `not_applicable` も読み替えの対象にした。
- CHANGELOG に書く事項（個票の対応結果に記載）: Fixed - 親の検証をまとめた `not_run` の 1 行で、親の検証がすべて通っていても止まっていた不具合を直した。Changed - executor の指示と共通規約で、親の検証を evidence に含める場合は検査ごとに 1 行ずつ書くよう求める。
- 判断: `pipeline.parent_validations` に設定済みかどうかは、evidence にある親 runner の記録（source=runner、id 付き）で判定した。runner は設定された検証ごとに、流さなかった場合も `not_applicable` で記録するため、設定と記録が 1 対 1 に対応する。
- CHANGELOG に書く事項（個票の対応結果に記載）: Fixed - 親の検証をまとめた `not_run` の 1 行で、親の検証がすべて通っていても止まっていた不具合を直した。Changed - executor の指示と共通規約で、親の検証を evidence に含める場合は検査ごとに 1 行ずつ書くよう求める。

## 4. 進め方

親の検証結果を集約した `not_run` 行によって executor が誤って停止してしまう問題を解決するため、判定ロジックを修正した。具体的には、集約された行を読み替えるのではなく、`id` を持つ個別の検証結果（`passed` または `not_applicable`）を直接参照するようにした。併せて、executor が集約行を使わず、各検証を個別に行として記述するように指示・規約を更新し、回帰テストを実装した。
