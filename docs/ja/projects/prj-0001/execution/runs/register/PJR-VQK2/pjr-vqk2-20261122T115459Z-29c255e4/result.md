---
specdojo:
  id: prj-0001:xer-pjr-vqk2-20261122t115459z-29c255e4
  type: exec-result
  task_id: PJR-VQK2
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-VQK2/pjr-vqk2-20261122T115459Z-29c255e4/plan.md
  started_at: "2026-11-22T11:55:01.793Z"
  completed_at: "2026-11-22T12:04:32.914Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- 要約の commit= の出どころを特定した。post-review で commit が作られないときに HEAD を読む経路と、post-review が無い経路で統合後の HEAD を読む経路である。どちらも統合の commit（outputCommit）が出るように直した。selectRunCommitId を追加し、単体テストを 2 件足した。

## 2. 変更ファイル

- `src/exec/register.ts`: 変更、+12 / -0 行
- `src/exec/run/register-post-review.ts`: 変更、+11 / -2 行
- `src/exec/run/register-worktree.ts`: 変更、+1 / -1 行
- `tests/src/exec/register-multiple-ids.test.ts`: 変更、+25 / -0 行

## 3. 申し送り

- 原因の経路は 2 つ（post-review で commit が作られないときの HEAD、post-review が無い経路の統合後の HEAD）。例の run の記録が無く、実際にどちらで起きたかは断定できない。
- commit= の ID は 12 桁に揃えた。従来の --short の長さは環境で変わるため、既存の outputCommit.slice(0, 12) に合わせた。
- runner の出力を変えるため、統合の後にオーケストレーターが JSEY を流して確かめてから close する。
- CHANGELOG.md は変えていない。個票の対応結果の「CHANGELOG に書く事項」に、区分 Fixed と行の文案を書いた。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
