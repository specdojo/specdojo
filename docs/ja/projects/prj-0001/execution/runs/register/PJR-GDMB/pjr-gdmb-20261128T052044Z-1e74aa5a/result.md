---
specdojo:
  id: prj-0001:xer-pjr-gdmb-20261128t052044z-1e74aa5a
  type: exec-result
  task_id: PJR-GDMB
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-GDMB/pjr-gdmb-20261128T052044Z-1e74aa5a/plan.md
  started_at: "2026-11-28T05:20:51.083Z"
  completed_at: "2026-11-28T05:37:10.270Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- `specdojo guarded-push` を追加しました。ブランチ範囲・fast-forward の検査、送信範囲表示、dry-run、executor/reporter の拒否、既存ロックでの直列化を実装し、テスト・利用説明・個票を更新しました。型検査・lint・テスト本体は指定どおり親 runner に委ねます。保護設定と result は編集していません。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/orchestrator-operation-guide.md`: 変更、+5 / -1 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+18 / -1 行
- `src/commands/git.ts`: 変更、+1 / -1 行
- `src/exec/run/agent.ts`: 変更、+2 / -1 行
- `src/exec/run/in-place.ts`: 変更、+2 / -0 行
- `src/exec/trial-core.ts`: 変更、+7 / -1 行
- `src/exec/worktree-command.ts`: 変更、+2 / -0 行
- `src/specdojo.ts`: 変更、+2 / -0 行
- `tests/src/commands/git.test.ts`: 変更、+1 / -1 行
- `tests/src/exec/run/inplace.test.ts`: 変更、+3 / -1 行
- `tests/src/exec/worktree-command.integration.test.ts`: 変更、+2 / -0 行
- `src/commands/guarded-push.ts`: 追加、+170 / -0 行
- `src/shared/agent-role.ts`: 追加、+4 / -0 行
- `tests/src/commands/guarded-push.integration.test.ts`: 追加、+236 / -0 行
- `tests/src/commands/guarded-push.test.ts`: 追加、+70 / -0 行

## 3. 申し送り

- 入口は `specdojo guarded-push --project &lt;id&gt; [--branch &lt;branch&gt;] [--remote &lt;name&gt;] [--dry-run]`。既存の Git ラッパーと権限設定で区別するため独立コマンドとした。通常・trial・in-place・分割 worktree の agent に `SPECDOJO_AGENT_ROLE` を渡し、存在すれば Git 起動前に拒む。環境変数の除去、改変した CLI、hook・通信 helper の任意コードまでは隔離しないため、役割別 deny と既存ガードを併用する。
- Claude の未反映案: `settings.orchestrator.json` と配布原本の `permissions.ask` に `Bash(specdojo guarded-push:*)`・`Bash(npx specdojo guarded-push:*)` を追加。edit/review/report は同じ入口を deny。既存の `git push` と絶対パス版の deny を維持し、競合する包括 allow を整理する。
- Codex の未反映案: orchestrator 用 rules で `["specdojo","guarded-push"]` と `["npx","specdojo","guarded-push"]` を `decision="prompt"`、executor/reporter 用では `forbidden` にする。共通 forbidden が orchestrator も阻まないよう、役割別の rules 読み込み先・起動経路を分離する。既存の git push の forbidden、非対話の `approval_policy="never"`、ネットワーク制限を維持する。
- Copilot の未反映案: 対話起動で入口を含む包括 allow を置かず、毎回 tool 承認を求め、以後の実行への承認保存はしない。executor に `--deny-tool 'shell(specdojo guarded-push)'`・`--deny-tool 'shell(npx specdojo guarded-push)'` を追加。git push の deny と reporter の shell 禁止を維持する。
- OpenCode の未反映案: Qwen/Gemma の `permission.bash` と配布原本で `specdojo guarded-push*`・`npx specdojo guarded-push*` を ask。executor/reporter は deny とし、包括 allow・dry-run の規則より後へ配置する。git push と絶対パス版の deny を維持する。
- agy の未反映案: PJR-D5RS の直接起動用 `templates/antigravity/settings.orchestrator.json` の ask に `command(specdojo guarded-push)`・`command(npx specdojo guarded-push)` を追加。`toolPermission: "request-review"` と git push の deny を維持する。手動 executor の入口も deny、reporter の全 command 禁止は維持し、SpecDojo の agy provider は復元しない。
- 文言案: `CLAUDE.md`・`AGENTS.md`・`.opencode/AGENTS.md`・`.github/copilot-instructions.md` とオーケストレーター本文を『オーケストレーターに限り、push は `npx specdojo guarded-push --project &lt;id&gt;` を用い、`project/&lt;id&gt;/develop` と `feature/&lt;id&gt;/*` の範囲内で、ブランチ・remote・commit の範囲と件数を提示して毎回承認を得る。直接の git push、main・タグ・履歴を書き換える push、executor/reporter の利用は禁止。同期専用ブランチは既存の専用コマンドに任せる』にそろえる。本文には『同じ引数の dry-run で提示し、先端・送信先・範囲が変われば再表示・再承認する。npm・リリースの公開は人が行う』を加える。
- 保護設定案と文言案の詳細は個票の対応結果 5.2・5.3 節に記録済み。利用者の承認後にローカル設定と配布原本へ反映し、本文ラッパーを再生成・同期検査する。実 CLI で毎回の確認、キャンセル時の未送信、executor の拒否を確認するまでは従来の push 禁止を維持する。指定済み親検証と result 記入は runner/reporter が実施する。
- 適用外の検証: `npm run validate:schema:file`（executor が変更した YAML/YML ファイルはない。）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
