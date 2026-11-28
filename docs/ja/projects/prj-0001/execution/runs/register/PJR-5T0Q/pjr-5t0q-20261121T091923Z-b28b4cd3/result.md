---
specdojo:
  id: prj-0001:xer-pjr-5t0q-20261121t091923z-b28b4cd3
  type: exec-result
  task_id: PJR-5T0Q
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-5T0Q/pjr-5t0q-20261121T091923Z-b28b4cd3/plan.md
  started_at: "2026-11-21T09:19:24.527Z"
  completed_at: "2026-11-21T09:26:52.115Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- `resolveCommitScope` で、名前空間の違う target（`specdojo:tsp-index-sample` など）を、カタログの成果物の文書の id（HEAD から読む）で照合して commit の許可リストに入れるようにした。カタログに無い型の文書は今までどおり止まる。単体・統合テストを追加し、個票の対応結果を更新した。

## 2. 変更ファイル

- `src/exec/plans-core.ts`: 変更、+17 / -1 行
- `src/exec/plans.ts`: 変更、+1 / -0 行
- `src/exec/worktree-ops-commit.ts`: 変更、+32 / -0 行
- `tests/src/exec/plans.test.ts`: 変更、+52 / -0 行
- `tests/src/exec/worktree-ops.integration.test.ts`: 変更、+80 / -0 行

## 3. 申し送り

- 統合のあと、orchestrator が T-KATA-WAVE-3-tsp-index-sample-080 を流し直し、統合まで通ることを確かめてから PJR-5T0Q を close する。
- CHANGELOG 文案（Fixed）: `exec` の commit 許可リストが、kata ドメインなど `&lt;project_id&gt;:` 以外の名前空間で修飾された成果物の target（例: `specdojo:tsp-index-sample`）をカタログの文書の id で引けず、condense などの成果物向けの段で統合が non-target changes として止まる問題を修正（PJR-5T0Q）。
- 判断: 文書の id は working tree ではなく worktree の HEAD から読む（agent が frontmatter の id を書き換えて commit の範囲を広げるのを防ぐため）。照合は `&lt;project_id&gt;:` 以外の名前空間の ID だけにかけ、一致が複数件なら解決しない（止める側に倒す）。
- 範囲外の発見: `.specdojo/doc-index.json` が tracking から外れているため、`headDocIndexLookup`（`git show HEAD:.specdojo/doc-index.json`）は常に失敗し、効いていない。改善するなら別の登録簿の項目として起票する。
- `tmp/check-5t0q.ts` は確認用の使い捨てファイル（commit の対象外）。削除の許可が出なかったので残してある。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
