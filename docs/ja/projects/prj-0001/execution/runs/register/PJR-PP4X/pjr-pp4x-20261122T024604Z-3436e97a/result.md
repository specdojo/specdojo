---
specdojo:
  id: prj-0001:xer-pjr-pp4x-20261122t024604z-3436e97a
  type: exec-result
  task_id: PJR-PP4X
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-PP4X/pjr-pp4x-20261122T024604Z-3436e97a/plan.md
  started_at: "2026-11-22T02:46:05.544Z"
  completed_at: "2026-11-22T02:55:27.962Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- 型の文書（rulebook・recipe・sample・template）または domain: kata の catalog の成果物の review では、runner の事前の grade と review plan の grade の対象種別を kata に揃えた（reviewGradeTargetKind）。代表成果物と宣言済みの型が同じ文書なら grade は 1 回だけ流れる。review の段では grade list --changed-only の failed で block しない（isGradeFreshnessCheck）。単体テスト、review-guide、個票の対応結果（第 1・2 波への影響、090 の流し直しの手順、CHANGELOG の文案）を更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/review-guide.md`: 変更、+3 / -1 行
- `src/exec/plans-core.ts`: 変更、+46 / -1 行
- `src/exec/plans-generation.ts`: 変更、+9 / -2 行
- `src/exec/reporter.ts`: 変更、+22 / -0 行
- `tests/src/exec/reporter.test.ts`: 変更、+53 / -0 行
- `tests/src/exec/review-kata.test.ts`: 変更、+94 / -1 行

## 3. 申し送り

- 統合の後に、オーケストレーターが第 3 波の 090 を 1 件流し、止まらずに verdict が記録されることを確かめる（executor の sandbox では agent と grade を起動できない）。
- 止まった 090 の 10 件は、task ごとに `specdojo exec release --project prj-0001 --task &lt;task-id&gt; --by &lt;actor&gt;` と `specdojo exec refresh --project prj-0001` で todo に戻してから、`specdojo exec run` で流し直す。`exec resume`（reporter から、または `--resume-from executor`）は古い plan（`--target deliverable`）を使い回すため使わない。
- CHANGELOG.md は変えていない。区分（不具合修正）と行の文案は個票の対応結果の `### 5.1. CHANGELOG に書く事項` にある。
- 鮮度の確認の block の除外は `grade list` の `--changed-only` 付きに限った。`--dependency-changed` の failed は既存のテストどおり review の段でも block する。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
