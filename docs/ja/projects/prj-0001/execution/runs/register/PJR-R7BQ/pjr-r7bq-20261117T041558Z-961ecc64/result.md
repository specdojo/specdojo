---
specdojo:
  id: prj-0001:xer-pjr-r7bq-20261117t041558z-961ecc64
  type: exec-result
  task_id: PJR-R7BQ
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-R7BQ/pjr-r7bq-20261117T041558Z-961ecc64/plan.md
  started_at: "2026-11-17T04:15:59.553Z"
  completed_at: "2026-11-17T04:32:45.345Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- 定期の job（job-grade-kata・job-grade-deliverable）を grade run に移した（grade run に終了コード 2・75 と --reference-per-kind を追加）。grade・agent・exec の内部用のコマンドを commander の hidden で help から外し、コマンドリファレンス・routine 運用ガイド・Job 定義標準と個票を更新した。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/jobs/job-grade-deliverable.yaml`: 変更、+77 / -16 行
- `docs/ja/projects/prj-0001/jobs/job-grade-kata.yaml`: 変更、+77 / -17 行
- `docs/ja/specdojo/guides/routine-operation-guide.md`: 変更、+3 / -3 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+46 / -31 行
- `docs/ja/specdojo/standards/job-definition-standard.md`: 変更、+3 / -4 行
- `src/commands/agent.ts`: 変更、+5 / -3 行
- `src/exec/commands.ts`: 変更、+1 / -1 行
- `src/exec/run/lifecycle-commands.ts`: 変更、+1 / -1 行
- `src/exec/trial-commands.ts`: 変更、+3 / -1 行
- `src/grade/command-apply.ts`: 変更、+3 / -3 行
- `src/grade/command-inspect.ts`: 変更、+5 / -3 行
- `src/grade/command-plan.ts`: 変更、+1 / -1 行
- `src/grade/command-run.ts`: 変更、+8 / -1 行
- `src/grade/run.ts`: 変更、+80 / -7 行
- `tests/src/cli-verb-taxonomy.test.ts`: 変更、+31 / -0 行
- `tests/src/grade/run.test.ts`: 変更、+72 / -1 行

## 3. 申し送り

- grade run に終了コード 2（部分成功）・1（完了なし）・75（rate limit、同じ --run-id で再開）と --reference-per-kind（kata のみ、--reference と併用不可）を追加した。既定の比較（リファレンスなし）は ensureReviewGrade などの既存の呼び出しを変えないため据え置いた。
- job-grade-kata・job-grade-deliverable は、選択条件ごとの grade list の和集合を `logs/grade/jobs/&lt;job_run_id&gt;/selection.txt` に固定して grade run --path に渡す。上限到達の文書は grade run に渡さず retry exhausted: として報告する。idempotency key を kata command-v10、deliverable command-v9 に上げた。
- grade run は英語 finding の翻訳の段を持たないため、定期の job では旧結果から再掲された英語 finding の表示用の翻訳が行われなくなる（PJR-YYDS の方針どおり）。
- tools/grade/run-per-document.sh と tests/tools/grade-per-document.test.ts は手動実行（全件再評価・3 段構成の比較）のために残した。削除するかは別の登録簿項目で判断してほしい。`stage_total` が 1 以外の旧 state で上限到達した文書は、job では報告だけになり再評価されない。
- 実 agent による定期の job の通し実行（routine run または exec run --job）は sandbox で行えないため、次の定期実行の結果で、grade run の出力と終了コードが analysis・partial の判定へ正しく渡ることを確かめてほしい。
- CHANGELOG の文案は個票の「CHANGELOG に書く事項」に書いた（Changed: 内部用のコマンドを help から外した／Added: grade run の終了コード 2・75 と --reference-per-kind／Changed: 定期の job を grade run に移した）。保護された設定の変更は不要だった。
- 人の確認が必要: `specdojo routine run / exec run --job job-grade-kata（実 agent による定期の job の通し実行）`（実 agent CLI の起動と利用枠の消費を伴うため sandbox では実行できない。次の定期実行で grade run の出力・終了コードが analysis と partial の判定へ渡ることを確かめる）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
