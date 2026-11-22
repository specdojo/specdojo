---
specdojo:
  id: prj-0001:xer-pjr-tf6f-20261122t080311z-36b64d00
  type: exec-result
  task_id: PJR-TF6F
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-TF6F/pjr-tf6f-20261122T080311Z-36b64d00/plan.md
  started_at: "2026-11-22T08:03:11.993Z"
  completed_at: "2026-11-22T08:15:13.126Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- 親の検証の前に、YAML を変えた run だけ worktree で表示のページを作り直すようにした（`src/exec/worktree-yaml-pages.ts`、`runConfiguredParentValidationBatch` から呼ぶ）。作り直しの失敗は `yaml-pages` の `failed` として記録し、`buildYamlPages` は止まった YAML のパスを示す。`tools/lint-changed.mjs` は変えた YAML の表示のページを検査の対象に足す。単体テスト・統合テスト（`# #` の壊れ方を `lint-md-changed` で止める）、`exec-operation-guide`、個票の対応結果と CHANGELOG の文案を更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-operation-guide.md`: 変更、+2 / -0 行
- `src/docs/yaml-pages.ts`: 変更、+8 / -1 行
- `src/exec/parent-validation.ts`: 変更、+2 / -1 行
- `src/exec/run/agent.ts`: 変更、+22 / -1 行
- `tests/tools/lint-changed.test.ts`: 変更、+21 / -1 行
- `tools/lint-changed.mjs`: 変更、+26 / -4 行
- `src/exec/worktree-yaml-pages.ts`: 追加、+239 / -0 行
- `tests/src/exec/worktree-yaml-pages.integration.test.ts`: 追加、+159 / -0 行
- `tests/src/exec/worktree-yaml-pages.test.ts`: 追加、+152 / -0 行

## 3. 申し送り

- 作業内容 No 4（統合の後の PJR-JSEY での runner の動作の確かめと、YAML を壊した実際の `exec run --register` で統合の前の親の検証で止まることの確かめ）は specdojo-orchestrator が行う。
- CHANGELOG.md は変えていない。個票の `### 5.1. CHANGELOG に書く事項` に、区分「不具合修正」と行の文案を書いた。
- 保護された設定（`exec-defaults.yaml`・`package.json`）の変更は要らない。
- 制約: 統合先から取り込んだ新しい YAML でまだページが無いものは、ほかの YAML が変わっていなければ作り直しの対象にならない。内容の変わらないページは書き換えないため、更新時刻だけ古いページがあると、YAML を変えた run では以後の親の検証でも作り直しが走ることがある。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
