---
specdojo:
  id: prj-0001:xer-pjr-q2at-20261115t134347z-e767fe26
  type: exec-result
  task_id: PJR-Q2AT
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-Q2AT/pjr-q2at-20261115T134347Z-e767fe26/plan.md
  started_at: "2026-11-15T13:45:52.604Z"
  completed_at: "2026-11-15T15:42:27.119Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- 親 runner の検証 ID を 1 行にまとめた `not_run` / `not_applicable` の行は、挙がった検証がすべて親 runner の記録で passed / `not_applicable` のときだけ満たしたものとし、設定にない・未知・記録なし・読み取れない列は従来どおり止めるようにした。回帰テストと、まとめた行を書かせない executor の指示・共通規約の記述も追加した。

## 2. 変更ファイル

- `docs/ja/specdojo/exec-templates/xp-common-conventions-template.md`: 変更、+1 / -1 行
- `src/exec/parent-validation.ts`: 変更、+46 / -0 行
- `src/exec/reporter.ts`: 変更、+8 / -0 行
- `src/exec/run/agent.ts`: 変更、+1 / -1 行
- `tests/src/exec/reporter.test.ts`: 変更、+74 / -0 行
- `tests/src/exec/run/run.test.ts`: 変更、+1 / -0 行

## 3. 申し送り

- 判断: `pipeline.parent_validations` に設定済みかどうかは、evidence にある親 runner の記録（source=runner、id 付き）で判定した。runner は設定された検証ごとに、流さなかった場合も `not_applicable` で記録するため、設定と記録が 1 対 1 に対応する。
- 判断: `npm`・`npx`・`pnpm`・`yarn`・`node`・`tsx`・`specdojo` で始まる行はコマンドそのものとして扱い、まとめた行とはみなさない。`…` を含む列は読み取れないので止める側にした。まとめた行の `not_applicable` も読み替えの対象にした。
- CHANGELOG に書く事項（個票の対応結果に記載）: Fixed - 親の検証をまとめた `not_run` の 1 行で、親の検証がすべて通っていても止まっていた不具合を直した。Changed - executor の指示と共通規約で、親の検証を evidence に含める場合は検査ごとに 1 行ずつ書くよう求める。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
