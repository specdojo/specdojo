---
specdojo:
  id: prj-0001:xer-pjr-5n1q-20261123t034720z-a9a723aa
  type: exec-result
  task_id: PJR-5N1Q
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-5N1Q/pjr-5n1q-20261123T034720Z-a9a723aa/plan.md
  started_at: "2026-11-23T03:47:23.020Z"
  completed_at: "2026-11-23T04:00:16.549Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- `specdojo orchestrator handoff` を足した。登録簿・`exec queue` の列・exec run のロックから「進行中」と「判断待ち」の章を組み立て、`register add --type handoff` で起票する。`--dry-run` で表示だけを行い、開いている handoff があれば知らせる。`register add` に `--section` / `--section-file`（繰り返し可）を足した。単体テストを足し、CLI リファレンス・登録簿運用ガイド・`pjr-rulebook` を直し、個票の作業内容と対応結果を埋めた。保護された指示の本文と playbook は変更案だけを個票に書いた。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/register-operation-guide.md`: 変更、+5 / -1 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+25 / -2 行
- `docs/ja/specdojo/rulebooks/pjr-rulebook.md`: 変更、+1 / -1 行
- `src/commands/orchestrator.ts`: 変更、+2 / -0 行
- `src/register/create-commands.ts`: 変更、+25 / -8 行
- `src/register/external-project.ts`: 変更、+7 / -0 行
- `src/register/section.ts`: 変更、+36 / -0 行
- `tests/src/register/section.test.ts`: 変更、+104 / -1 行
- `src/commands/orchestrator-handoff.ts`: 追加、+323 / -0 行
- `tests/src/commands/orchestrator-handoff.test.ts`: 追加、+268 / -0 行

## 3. 申し送り

- 統合の後に、orchestrator が prj-0001 で `npx specdojo orchestrator handoff --project prj-0001 --dry-run` を流して確かめてから close する（個票の作業内容の 6 行目は open のまま）。executor の worktree では `npx tsx src/specdojo.ts orchestrator handoff --project prj-0001 --dry-run` で確かめ済み。止まった（`stopped`）列や runner の生きていない列が 10 件ほど出たため、次のセッションで再開か cancel を決めるとよい。
- 保護された設定の変更案（個票の対応結果の「保護された設定の変更案」の小節を正とする）: `.agents/specdojo-orchestrator.agent.md`（SSOT）と各環境のラッパー（`.claude/agents/specdojo-orchestrator.md`・`.github/agents/specdojo-orchestrator.md`・`.codex/agents/specdojo-orchestrator.toml`・`.opencode/agents/` のオーケストレーターの定義）に同じ本文を入れる。(1) register の type の表に `handoff`（セッション・LLM の切り替えの引き継ぎ、終端 `done`）を足す。(2) コマンド地図に `orchestrator handoff` / `register close` の行を足す。(3)「対話の進め方」の後に章「セッションの始めと終わり」を足す。始めるときは `generated/pjr-handoffs.md` で開いている handoff を読み、受け取った主体を `--by` にして `register close --commit` する。終えるときは `orchestrator handoff --dry-run` で示して承認を得てから `--by specdojo-orchestrator --commit` で起票し、手で書く章を `register update --section` で埋める。返事を待つことは先に `question` として起票する。`tmp/orchestrator/handoff-*.md` には書かない。
- playbook `docs/ja/projects/prj-0001/030-project-management/pm-orchestrator-playbook.md` の変更案: 章「セッションの引き継ぎ」を足す。夜の間の承認の範囲は handoff の「有効な承認の範囲」に書き、長く効くものは playbook の該当の章へ移す。handoff の起票と close は register の記帳として `develop` へ `--commit` で直接 commit してよい。今の `tmp/orchestrator/handoff-*.md` は最初の `orchestrator handoff` の起票で置き換える。
- 決めた点: 起票は `register add` を同じ CLI で起動して任せた（採番・event・commit を二重に持たないため）。章を起票と同時に埋めるため `register add` に `--section` / `--section-file` の繰り返し指定を足した。`--description` は渡さない（一覧の説明は第 1 章の段落から読まれ、手で書く章が埋まってしまうため）。開いている handoff があっても起票は止めず知らせるだけにした。「進行中」には `in-progress` の項目と止まった列も入れ、`waiting` は両方の章に出す。schedule の `doing` のタスクは、検証に失敗すると終了する `exec status` の読み込みを避けるため入れなかった。
- CHANGELOG に書く事項（個票 5.4）: Added — `specdojo orchestrator handoff` を追加。Added — `register add` に `--section` / `--section-file`（繰り返し可）を追加。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
