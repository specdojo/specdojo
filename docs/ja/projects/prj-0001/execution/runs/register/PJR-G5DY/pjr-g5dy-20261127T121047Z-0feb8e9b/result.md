---
specdojo:
  id: prj-0001:xer-pjr-g5dy-20261127t121047z-0feb8e9b
  type: exec-result
  task_id: PJR-G5DY
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-G5DY/pjr-g5dy-20261127T121047Z-0feb8e9b/plan.md
  started_at: "2026-11-27T12:10:56.169Z"
  completed_at: "2026-11-27T12:18:01.187Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- schedule の task の行の「内容」を、task 定義の成果物名・カタログのファイル名・`local_id` の順に引く形へ直した。task 名は「次にすること」と重なるときは出さない。単体テストと説明、個票の対応結果を更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/references/command-reference.md`: 変更、+1 / -1 行
- `src/dashboard/dashboard.ts`: 変更、+44 / -13 行
- `tests/src/dashboard/dashboard.test.ts`: 変更、+81 / -1 行

## 3. 申し送り

- type 系の task の内容は、strategy のカタログに載る場合は成果物名、載らない場合は `local_id` が出る。CHANGELOG に書く事項は個票の対応結果の小節にある（CHANGELOG.md は変えていない）。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
