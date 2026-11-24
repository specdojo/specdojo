---
specdojo:
  id: prj-0001:xer-pjr-tn64-20261124t052611z-3365b7ac
  type: exec-result
  task_id: PJR-TN64
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-TN64/pjr-tn64-20261124T052611Z-3365b7ac/plan.md
  started_at: "2026-11-24T05:26:12.403Z"
  completed_at: "2026-11-24T05:32:03.140Z"
  agent: terra-executor
---

# Edit Result

## 1. 実施内容

- ready 昇格ガードを docs/ 配下に限定し、fixture と成果物の回帰テスト、ガイド、個票を更新した。親 runner が型検査・lint・単体テスト・統合テストを実行する。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-config-guide.md`: 変更、+8 / -8 行
- `src/exec/worktree-ops-commit.ts`: 変更、+16 / -6 行
- `tests/src/exec/worktree-ops.integration.test.ts`: 変更、+16 / -0 行
- `tests/src/exec/ready-promotion.test.ts`: 追加、+24 / -0 行

## 3. 申し送り

- CHANGELOG に書く事項（不具合修正）: agent 実行の ready 昇格検査で、テスト fixture などの成果物でないファイルを除外する。
- パス規則を採用したため、docs/ 外の成果物は ready 昇格ガードの対象外となる。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
