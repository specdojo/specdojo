---
specdojo:
  id: prj-0001:xer-pjr-g6nt-20261123t041517z-7f592de5
  type: exec-result
  task_id: PJR-G6NT
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-G6NT/pjr-g6nt-20261123T041517Z-7f592de5/plan.md
  started_at: "2026-11-23T04:16:22.328Z"
  completed_at: "2026-11-23T04:23:42.915Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- `where playbook`・`playbook scaffold`・設定 `playbook_path`（既定 `030-project-management/pm-orchestrator-playbook.md`）を実装した。単体テスト（新規 6 件を含む 133 件）・`typecheck`・`lint:ts` は通った。設定・コマンドリファレンスを直し、指示の本文の案・移し方・CHANGELOG の文案を個票の対応結果に書いた。

## 2. 変更ファイル

- `docs/ja/specdojo/references/command-reference.md`: 変更、+6 / -1 行
- `docs/ja/specdojo/references/specdojo-config-reference.md`: 変更、+14 / -13 行
- `docs/specdojo/schemas/v1/specdojo-config.schema.yaml`: 変更、+2 / -0 行
- `src/commands/where.ts`: 変更、+2 / -0 行
- `src/shared/specdojo-config.ts`: 変更、+8 / -0 行
- `src/specdojo.ts`: 変更、+2 / -0 行
- `tests/src/commands/where.integration.test.ts`: 変更、+6 / -2 行
- `src/project/playbook.ts`: 追加、+108 / -0 行
- `tests/src/project/playbook.test.ts`: 追加、+98 / -0 行

## 3. 申し送り

- 保護された設定の変更案: `.agents/specdojo-orchestrator.agent.md`（SSOT と 4 つのラッパー、本文はバイト一致で保つ）の「プロジェクトの文書にオーケストレーター向けの運用メモがあれば、作業を始める前に読む。」を「作業を始める前に `specdojo where playbook --project &lt;id&gt;` を実行する。表示されたパスにファイルがあれば（`(does not exist)` が付かなければ）、そのオーケストレーター運用メモを読む。無ければ読まずに進める。運用メモの雛形は `specdojo playbook scaffold` で作れる。」へ差し替える。反映は利用者の承認のもとでオーケストレーターが行う。
- 保護された設定の変更案: `CLAUDE.md` と `AGENTS.md` の 11 行目（運用メモのパスの直書き）を「prj-0001 を扱う対話型オーケストレーターは、作業の前に `specdojo where playbook --project prj-0001` で引いた運用メモを読む。」へ差し替えるか削除する。
- 決めた内容: 雛形の作り方は `config scaffold` の一部ではなく独立した `playbook scaffold` にした（`config` は設定を扱うコマンドで責務が違うため）。置き場所は `playbook_path`（`base_path` 相対、既定 `030-project-management/pm-orchestrator-playbook.md`）で、prj-0001 の今の場所と一致するため移行は要らない。`_PROJECT_NAME_` はプロジェクト ID で埋める。
- 移し方: 既定と違う場所にある運用メモは、`playbook_path` を設定に足す（保護された設定のため承認のもとで行う）か、既定のパスへ `git mv` する。文書 ID は変えず、`[[id]]` の参照は直さない。
- CHANGELOG に書く事項（区分 Added、v0.10.0）: `specdojo where playbook` と `specdojo playbook scaffold` を追加。オーケストレーターの運用メモの場所を設定 `playbook_path`（既定 `030-project-management/pm-orchestrator-playbook.md`）から引き、雛形を作れるようにした。
- `tests/src/commands/where.integration.test.ts` に `playbook` の種類を足したが、統合テストは親 runner が実行する。
- `src/shared/specdojo-config.ts` は `max-lines` の warning（1000 行超）が出ている。今回の追加は 8 行で、元から超えていた。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
