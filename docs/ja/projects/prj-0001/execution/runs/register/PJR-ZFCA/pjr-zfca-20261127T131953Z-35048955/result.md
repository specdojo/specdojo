---
specdojo:
  id: prj-0001:xer-pjr-zfca-20261127t131953z-35048955
  type: exec-result
  task_id: PJR-ZFCA
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-ZFCA/pjr-zfca-20261127T131953Z-35048955/plan.md
  started_at: "2026-11-27T13:22:00.062Z"
  completed_at: "2026-11-27T13:36:05.443Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- 停止した runner の PID と lock 記録を確認できる場合に限り、specdojo-orchestrator の強制解除を許可しました。競合防止、イベント証跡、単体テスト、文書と個票を更新しました。型検査・lint・全件テストは親 runner が実行します。result は編集していません。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-operation-guide.md`: 変更、+2 / -0 行
- `docs/ja/specdojo/guides/orchestrator-operation-guide.md`: 変更、+2 / -0 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+4 / -0 行
- `src/exec/commands.ts`: 変更、+10 / -4 行
- `src/exec/core.ts`: 変更、+50 / -27 行
- `src/exec/events.ts`: 変更、+9 / -5 行
- `src/exec/run/lifecycle-commands.ts`: 変更、+2 / -0 行
- `tests/src/exec/events.test.ts`: 変更、+25 / -0 行
- `tests/src/exec/release-all-blocked.test.ts`: 変更、+267 / -4 行
- `src/exec/release-safety.ts`: 追加、+155 / -0 行

## 3. 申し送り

- 保護設定の変更案: `.agents/specdojo-orchestrator.agent.md` の「止まったときの対処」に、停止した別 agent の claim は `exec release --by specdojo-orchestrator --force` で解除し、実行中・判定不能なら人の `--force` に引き継ぐ旨を追加してください。人の名前を `--by` に代用せず、`--reset-worktree` と `--all-blocked` は利用者の承認を得る運用を維持します。個票第5.3節に文案を記録済みです。承認後の反映には `npm run orchestrator:sync` と `npm run lint:orchestrator-sync` を使用してください。
- 統合後は運用メモ第6.1節に従い、PJR-JSEY を `--targets PJR-ZFCA` で実行してから close を判断してください。実 agent の起動を伴うため sandbox では未実施です。
- 旧 claim・手動 claim など PID と lock token の対応記録がない場合は人へ引き継ぎます。再開との取り違えを防ぐため、無関係な project run が生存する場合も安全側に拒否します。終了済みでも新しい lock は既存の stale 判定を満たすまで拒否します。
- 適用外の検証: `npm run validate:schema:file`（YAML・YMLファイルを変更していません。）
- 人の確認が必要: `npx specdojo exec smoke --project prj-0001 --register PJR-JSEY --targets PJR-ZFCA --executor-by claude-executor --reporter-by gemma26-reporter`（統合後、実 agent を起動する runner 動作確認が必要です。）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
