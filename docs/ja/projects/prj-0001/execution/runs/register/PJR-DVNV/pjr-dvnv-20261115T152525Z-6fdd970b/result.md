---
specdojo:
  id: prj-0001:xer-pjr-dvnv-20261115t152525z-6fdd970b
  type: exec-result
  task_id: PJR-DVNV
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-DVNV/pjr-dvnv-20261115T152525Z-6fdd970b/plan.md
  started_at: "2026-11-15T15:28:15.648Z"
  completed_at: "2026-11-15T16:16:30.123Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- Schedule の exec run・exec resume・exec cycle の終わりに、runner が統合の後に書いたイベントと run の記録を記帳の commit 1 件にまとめるようにした。前の run の残りも拾い、記帳済みの記録との統合時の競合は exec branch 側で解決する。ガイド 3 本、回帰テスト、個票の対応結果を更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/branch-workflow-guide.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/guides/exec-worktree-guide.md`: 変更、+4 / -0 行
- `docs/ja/specdojo/guides/schedule-operation-guide.md`: 変更、+19 / -1 行
- `src/exec/run/lifecycle-commands.ts`: 変更、+7 / -2 行
- `src/exec/run/register-command.ts`: 変更、+4 / -5 行
- `src/exec/run/schedule-task.ts`: 変更、+12 / -0 行
- `src/exec/worktree-command.ts`: 変更、+11 / -0 行
- `tests/src/exec/pipeline-e2e.integration.test.ts`: 変更、+50 / -16 行
- `src/exec/run/trailing-records.ts`: 追加、+42 / -0 行
- `src/exec/trailing-records.ts`: 追加、+256 / -0 行
- `tests/src/exec/trailing-records.integration.test.ts`: 追加、+241 / -0 行

## 3. 申し送り

- 判断: 人と runner のイベントは、`by` が `.specdojo/agent-members.yaml` の agent かどうかで区別した。人が `--by &lt;agent&gt;` で書いたイベントは runner の記帳に入る。
- 判断: run の記録は、選んだ runner のイベントの task の `runs/schedule/&lt;task-id&gt;/` 配下に限った。human タスク（`-140` など）の result を人の編集中に commit しないためである。
- 判断: 記帳の commit は hook を飛ばさない（`evidence-secret-scan` で実行記録の秘密情報を止めるため）。hook が result.md を拒否したら result.md を外して再試行し、それでも失敗したら stage を戻して、残ったファイルと次の操作を標準エラーに出す。run の終了コードは変えない。
- 判断: grade の評価結果（`grade/criteria`・`grade/results`）は記帳の対象外とした。人の grade 実行でも変わり、runner の記録と区別できないためである。register の run も対象外とした（merge commit と wait commit に記帳が同梱されており、2026-11-15 にたまった記録にも `runs/register/` が無かった）。
- 次の run の準備の commit で拾う仕組みは効いていなかった（準備の commit は exec branch にだけ置かれ、入るのはその task の plan・result・claim だけ）。記帳の commit が、root に残る runner の記録をその run の分に限らず全部拾うように直した。
- 利用者への影響: develop の first-parent に、run ごとに記帳の commit（`exec(run): record execution events and run records`）が 1 件加わる。`pipeline-e2e` で HEAD を統合の commit とみなしていた期待値は、記帳の commit を飛ばして確かめる形に改めた。
- 残課題: 統合の後に、`pm-orchestrator-playbook` などにある、orchestrator が実行記録を手で commit する運用を見直す。
- 残課題: 統合の後に実際の run で、develop の `git status` に実行記録が残らないことを確かめる。
- CHANGELOG に書く事項は個票の「CHANGELOG に書く事項」の節に書いた（Changed: run の終わりの記帳 commit / Fixed: 失敗・延期の後に記帳した plan・result が再開後の統合で競合しても止まらない）。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
