---
specdojo:
  id: prj-0001:xer-pjr-1565-20261118t131049z-b589cb8d
  type: exec-result
  task_id: PJR-1565
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-1565/pjr-1565-20261118T131049Z-b589cb8d/plan.md
  started_at: "2026-11-18T13:10:50.674Z"
  completed_at: "2026-11-18T13:26:37.538Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- Added `specdojo exec queue` (add/run/status/cancel). It saves a reserved order of grade, `exec run` and `post-integration build-dist` steps to `execution/queues/&lt;queue-id&gt;.json`, waits for each child process to exit before starting the next, supports stop/continue on failure and resume, and shows unfinished queues in `exec status`. Added unit tests and docs, filled in the ticket's results with the option comparison, the decisions and proposed wording for the protected orchestrator definition.

## 2. 変更ファイル

- `docs/ja/product/040-system-design/sysd-job-execution.md`: 変更、+2 / -0 行
- `docs/ja/specdojo/guides/exec-operation-guide.md`: 変更、+3 / -0 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+31 / -0 行
- `src/exec/commands.ts`: 変更、+5 / -1 行
- `src/exec/post-integration.ts`: 変更、+20 / -7 行
- `src/exec/queue-command.ts`: 追加、+201 / -0 行
- `src/exec/queue.ts`: 追加、+379 / -0 行
- `tests/src/exec/queue.test.ts`: 追加、+307 / -0 行

## 3. 申し送り

- 方式は `exec queue` の新設に決めた（Job の `task.steps` は `/bin/sh` の任意コマンドで完了条件に反し再試行が先頭から、`exec run` への予約付与はロックの持ち方が複雑になるため）。比較の表は個票の対応結果「方式の比較と決定」を参照。
- 保護された設定 `.agents/specdojo-orchestrator.agent.md` の「実行の運び方」に、待ち合わせのスクリプトの代わりに `exec queue add` / `exec queue run` / `exec queue status` を使う行を足す変更案を個票の対応結果「保護された設定の変更案」に書いた。利用者の承認のもと feature ブランチで反映する。
- プロジェクトの運用メモ `pm-orchestrator-playbook.md` の待機の行を `exec queue` へ置き換える案も同じ節に書いた（未反映）。
- 決めた点: 予約は `&lt;execution_path&gt;/queues/` に置き記帳と同じく利用者か orchestrator が commit する／段の間で exec のロックを持ち続けない（子の `exec run` が自分で取るため。段の間に別の run が入り得る）／終了コードは `succeeded` のみ 0／落ちて `running` のまま残った段は再開時にもう一度流す／`--project` を書かない段には予約の project を足す。
- CHANGELOG の文案（区分 Added）は個票の対応結果「CHANGELOG に書く事項」に書いた。
- 残課題: 予約の作成から実行までを実プロセスで通す統合テストは未追加（段の実行は差し替え可能な関数として単体テストで確認済み）。
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T13:12:40.321Z に再開

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
