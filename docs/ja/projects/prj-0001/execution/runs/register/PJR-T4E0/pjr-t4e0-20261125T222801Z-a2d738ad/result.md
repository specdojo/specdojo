---
specdojo:
  id: prj-0001:xer-pjr-t4e0-20261125t222801z-a2d738ad
  type: exec-result
  task_id: PJR-T4E0
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-T4E0/pjr-t4e0-20261125T222801Z-a2d738ad/plan.md
  started_at: "2026-11-25T22:28:02.677Z"
  completed_at: "2026-11-25T22:42:42.403Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- develop（PJR-3M4M 入り）を基に PJR-T4E0 の 1 回目の変更を入れ直し、見張りのコード・テスト・文書の衝突を手で解いた。見張りの対象外（止めた印・人やオーケストレーターの claim・動いているプロセス）と全体の停止には 3M4M の手当ても打たない。そのことを単体テストと統合テストで確かめた。`exec watch` は `remedy`・`remedy_stopped` も待てる。個票の作業内容と対応結果（2 回目の差分・迷った点・CHANGELOG に書く事項・申し送り）を更新した。

## 2. 変更ファイル

- `docs/ja/product/040-system-design/sysd-job-execution.md`: 変更、+4 / -0 行
- `docs/ja/specdojo/guides/register-operation-guide.md`: 変更、+40 / -16 行
- `docs/ja/specdojo/guides/routine-operation-guide.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+49 / -8 行
- `src/commands/watch-scan.ts`: 変更、+223 / -86 行
- `src/exec/commands.ts`: 変更、+2 / -0 行
- `src/exec/watch-scan.ts`: 変更、+212 / -44 行
- `tests/src/commands/watch-scan.integration.test.ts`: 変更、+14 / -1 行
- `tests/src/exec/watch-scan.test.ts`: 変更、+282 / -1 行
- `src/exec/watch-command.ts`: 追加、+142 / -0 行
- `src/exec/watch-control.ts`: 追加、+350 / -0 行
- `src/exec/watch-wait.ts`: 追加、+140 / -0 行
- `tests/src/exec/watch-coexist.integration.test.ts`: 追加、+248 / -0 行
- `tests/src/exec/watch-control.test.ts`: 追加、+252 / -0 行
- `tests/src/exec/watch-wait.test.ts`: 追加、+187 / -0 行

## 3. 申し送り

- 統合の後に orchestrator が `exec smoke` と `specdojo routine run --project prj-0001 --id rtn-exec-watch-scan` の 1 回の実行で確かめてから close する。朝報告の「3. 見張りの対象外」「4. 手当て」の節と、`exec watch --timeout` の終了コード 124 も確かめる。個票の作業内容の No 9 は open のまま。
- 朝報告の章番号が変わった（3. 見張りの対象外、4. 手当て、5. この日に解けたもの、6. 読めなかった記録）。3M4M の CLI 統合テストの章番号の期待を合わせ、起動した偽の再開の子プロセスが終わるのを待つ処理を足した（子が動いている間は見張りがその対象を動いているプロセスとして触らないため）。期待の中身は変えていない。
- 決めたこと: 手当てで起動した再開のコマンドも対象を名指しするため、動いている間はその対象を対象外とし、同じ対象へ手当てを重ねない。対象外の間は手当ての回数も増えない。朝報告の「見張りの対象外」は「手当て」の前に置いた。
- 保護された設定と routine `rtn-exec-watch-scan` は変えていない。ロックの間は見張りも止める運用にする場合は、`action.args` に `--if-busy`・`skip` を足す案を人が判断する。
- 1 回目のブランチ `feature/prj-0001/exec-watch-coexist` は本件の統合の後は要らない。消すかは orchestrator が判断する。運用メモ（`pm-orchestrator-playbook`）へ `exec watch` と `watch-pause` の使い方を足すかも orchestrator が判断する。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
