---
specdojo:
  id: prj-0001:xer-pjr-f4tg-20261124t031919z-658afb77
  type: exec-result
  task_id: PJR-F4TG
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-F4TG/pjr-f4tg-20261124T031919Z-658afb77/plan.md
  started_at: "2026-11-24T03:19:21.154Z"
  completed_at: "2026-11-24T03:27:30.726Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- kata-guide に「kata を agent でレビューする」章（R1〜R5 の段と材料、文章のチェック項目 W1〜W10、kata の観点の組、書き手と別のモデルの組み方、人への報告の形）を追加し、prj-overview・opr・stsd の sample に 5 段を組む strategy（sch-strategy-kata-review-calibration.yaml、executor は sol-executor）を作成した。個票の作業内容・対応結果・CHANGELOG の文案を記入した。報告の見本の作成と利用者のレビューとの比べ（作業内容 No 7・8）は、段の実行と利用者のレビューが要るため理由を付けて open のまま残した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/kata-guide.md`: 変更、+95 / -8 行
- `docs/ja/projects/prj-0001/schedule/sch-strategy-kata-review-calibration.yaml`: 追加、+156 / -0 行

## 3. 申し送り

- track は未作成。作成すると exec run --auto の選択に入るため、目合わせを始めるときにオーケストレーターが `specdojo schedule build --project prj-0001 --track kata-review-calibration` で作り、15 タスク（3 型 × R1〜R5）を流す。
- 作業内容 No 7: prj-overview-sample の R1〜R5 の result を報告の見本として確かめる。executor は agent の CLI を起動できず、書き手と同じ claude が見本を作ると組み方に反するため未実施。
- 作業内容 No 8: 段の結果と、同じ版の 3 つの sample に対する利用者のレビューを比べ、個票の比べた結果の表（型・利用者の指摘・agent の指摘・区分・足した先）を埋め、見落としを kata-guide の文章のチェック項目か strategy の段の description に足す。
- grade の kata の採点を段と同じ 15 観点に絞る変更は未反映。案: pm-review-viewpoints.yaml の外す 9 観点に `grade_targets: [deliverable]` を付ける、`grade_rubric.id` を grade-rubric-v3 に改めて `--rubric-outdated` で評価し直す、kata の weights の planning・business の扱いを決める、観点一覧の yaml-pages スナップショットを更新する。利用者の承認のもとで別に起票する。
- CHANGELOG に書く事項（Added）の文案は個票の対応結果「CHANGELOG に書く事項」にある。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
